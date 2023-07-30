---
title: Interactive HTML Code Demos in Eleventy
description: With eleventy-plugin-code-demo, you can easily add interactive HTML, CSS, and JavaScript code demos to your Eleventy site using Markdown.
keywords: [eleventy, code demo]
categories: [11ty, html, css, javascript, webperf]
---

In an early draft of my [interactive guide to JavaScript events](/blog/interactive-guide-to-javascript-events/), I was leaving `TODO` placeholders every few paragraphs as a reminder to take screenshots of my code demo output. Taking screenshots is tedious, especially for an article of that scale, and it slows me down; instead, I prefer to focus on writing my content first and supplementing it with media afterwards.

But the further I got into this draft, the more I realized that I was not only creating more work for myself but also potentially detracting from the article's value. Screenshots certainly have a place, but an article littered with them can be a slog to read. I enjoy articles that are hands on, where I can see a result in real time rather than just staring at a static screenshot. Not only that, but I also knew that if I ever wanted to update the code demos to correct a mistake after publishing, I would have to go back and retake the screenshots, and that would be a nightmare to maintain. These thoughts nearly killed my motivation to finish my first draft.

A quick fix would've been to create the demos in a third-party app like Codepen or Codesandbox and embed them as iframes in my article. That can work just fine depending on your requirements, but I had reasons for avoiding this approach. On this site, I'm obsessive about many things, and one of those is performance—I've put in a lot of effort to create a highly performant UX, and I'm proud to say that most of my articles (even long ones with media) load within a second. While Codepen demos do allow you to easily share code demos, they also load hundreds of kilobytes of third-party JavaScript (with third-party cookies) that can slow down your page load. Moreover, this would create an unwanted dependency between my content and an external platform that may one day go down or introduce inaccessible markup in its iframes that I'd have no control over. So, given these limitations, I decided to create my own code demos.

The first thing I remembered was Stephanie Eckles's article on [using Eleventy templating to create static code demos](https://11ty.rocks/posts/eleventy-templating-static-code-demos/), but after thinking about my use case a bit more, I realized that this wouldn't suit my particular needs. That article teaches you how to add _static_ HTML and CSS code demos to an article by scoping `<style>` tags to their corresponding markup with a bit of clever auto-generated selector logic. But I wanted to share not only HTML and CSS but also JavaScript code snippets, and I couldn't just do that with multiple `<script>` tags since they would all leak into a shared global scope—an event listener in one code demo would fire in another, for example. So while this idea seemed promising at first, it fell just short of what I needed.

## `HTMLIframeElement.srcdoc`

Thankfully, I came across a brilliant article by [Maciej Mionskowski](https://mionskowski.pl/posts/iframe-code-preview/) on how he used the iframe tag's `srcdoc` attribute to create code demos in his Hugo site. See, most iframes use the `src` property to point to the embedded page, like this:

```html
<iframe
  src="https://example.com"
  title="My title"
  width="1600"
  height="900"
></iframe>
```

But this isn't the only way to create an iframe—there's also `HTMLIframeElement.srcdoc`, an attribute that represents the frame's markup as an HTML string. The browser then parses that string and builds the frame. So a frame with this markup:

```html
<iframe
  srcdoc="<!doctype html><html><head></head><body></body></html>"
  title="My title"
  width="1600"
  height="900"
></iframe>
```

Will eventually have this inner document structure when rendered:

```html
<!doctype html>
<html>
  <head></head>
  <body></body>
</html>
```


## eleventy-plugin-code-demo

It wouldn't be very practical to have to define an `HTMLIframeElement.srcdoc` string by hand every time you wanted to embed an iframe with custom markup. Wouldn't it be nice if we could instead build such an iframe more expressively, such as with Markdown code blocks? That would feel especially natural in a setting where we're already using Markdown, such as in a blog post.

After reading Maciej's article and playing around with the idea, I quickly prototyped a working solution in Eleventy that takes a shortcode like this in my Markdown:

{% capture code %}
```html
<button>Click me!</button>
```
```css
button {
  padding: 8px;
}
```
```js
const button = document.querySelector('button');
button.addEventListener('click', () => console.log('Clicked'));
```
{% endcapture %}

````md
{% raw %}{% codeDemo 'Demo of a button that logs a message when clicked' %}{% endraw -%}
{{ code }}
{%- raw %}{% endcodeDemo %}{% endraw %}
````

And turns it into the following interactive iframe (try it out!):

{% codeDemo 'Demo of a button that logs a message when clicked' %}
{{ code }}
{% endcodeDemo %}

I then published the code for this as a standalone Eleventy plugin on npm: [eleventy-plugin-code-demo](https://www.npmjs.com/package/eleventy-plugin-code-demo). You can download it and take it for a spin if you'd like to add code demos to your own Eleventy site. Note that I won't cover every usage or plugin option in this article; you can find the comprehensive docs in [the plugin's README](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo/blob/master/README.md).

### Overview: How the Plugin Works

My package exports a [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes), which means it uses this special syntax:

```liquid
{% raw %}{% shortcode %}...{% endshortcode %}{% endraw %}
```

Unlike regular shortcodes, paired shortcodes have a closing tag and allow you to nest content inside them. In Eleventy, this inner content is implicitly passed to the shortcode as its first argument:

```js
const shortcode = (content) => {
  // return something
}
```

My plugin parses `content` and searches for Markdown code blocks for HTML, CSS, and JavaScript (all of which are optional). The shortcode then:

1. Extracts the inner content of each Markdown code block,
2. Assembles a `srcdoc` string,
2. Minifies and escapes the resulting `srcdoc` string, and
4. Renders the final output as an `iframe`.

[The plugin code](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo/blob/master/src/utils.js) is fewer than 100 lines in total.

### Custom Rendering

If you'd like to render a completely custom document structure, my plugin uses [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_controlhttps://en.wikipedia.org/wiki/Inversion_of_control) with the render function pattern, giving you complete control over your iframe's structure. The `renderDocument` option is a function that will be called with the parsed HTML, CSS, and JS code as strings; you can then return whatever custom markup you want:

```js
const { EleventyPluginCodeDemo } = require('eleventy-plugin-code-demo');

eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
  /* Render whatever document structure you want. The HTML, CSS, and JS parsed
  from the shortcode's body are supplied to this function as an argument, so
  you can position them wherever you want, or add class names or data-attributes to html/body */
  renderDocument: ({ html, css, js }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
  </html>`,
});
```

This shared document structure will be rendered for every usage of the shortcode.

For my use case, I created a little view at the bottom that spies on `console.log`, similar to Codepen or JSFiddle embeds. You can get creative and render whatever you want; the only limitation is that you have to write all your markup, styles, and shared JavaScript using template literal strings.

When configuring the plugin, you can also set up some global attributes that you want to apply to all iframes:

```js
const { EleventyPluginCodeDemo } = require('eleventy-plugin-code-demo');

eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
  // key-value pairs for HTML attributes
  // these are applied to all code previews
  iframeAttributes: {
    height: '300',
    style: 'width: 100%;',
    frameborder: '0',
  },
});
```

You can also [apply HTML attributes to individual iframes](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo#per-usage-html-attributes).

### Code Interpolation

Want to reuse some common code across multiple demos or show the code itself before the demo? No problem! Use your templating language's multiline string shortcode (e.g., `capture` in Liquid, or `set` in Nunjucks) and interpolate that string as needed:

{% raw %}
````md
{% capture html %}
```html
<button>Click me!</button>
```
{% endcapture %}
{% capture css %}
```css
button {
  padding: 8px;
}
```
{% endcapture %}
{% capture js %}
```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('hello, 11ty!');
});
```
{% endcapture %}

{% codeDemo 'Title' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}
````
{% endraw %}

### Performance

If you're worried about build times, fear not! The plugin is *blazing* fast. It:

- Parses code blocks with the battle-tested [`markdown-it`](https://github.com/markdown-it/markdown-it) library.
- Escapes your HTML with [`lodash.escape`](https://www.npmjs.com/package/lodash.debounce) to prevent malformed HTML.
- Minifies your code with the highly optimized [`minify-html`](https://www.npmjs.com/package/@minify-html/node) package.

You can run Eleventy in debug mode to verify that the plugin comprises only a tiny percentage of your build time. As a point of reference, my aforementioned article has 24 code demos, and I have 25 usages across my site in total at the time of this writing. Here's a sample debug output from a cold start:

```
Eleventy:Benchmark Benchmark    146ms   0%    25× (Configuration) "codeDemo" Liquid Paired Shortcode +1ms
Eleventy:Benchmark Benchmark     77ms   0%     1× (Aggregate) Searching the file system (templates) +0ms
Eleventy:Benchmark Benchmark   1904ms   3%   108× (Aggregate) Data File +0ms
Eleventy:Benchmark Benchmark      7ms   0%     1× (Aggregate) Searching the file system (data) +0ms
Eleventy:Benchmark Benchmark    557ms   1%   128× (Aggregate) Template Read +0ms
```

That first line is how long it took Eleventy to parse all 25 usages of my shortocde—a mere 146 milliseconds that pales in comparison to other tasks.

As for the performance of the actual iframes, at the time of this writing, my article [scores 100 on Lighthouse in all categories](https://pagespeed.web.dev/analysis/https-www-aleksandrhovhannisyan-com-blog-interactive-guide-to-javascript-events/mqkinsjt0s?form_factor=mobile) on both mobile and desktop. That's much better than the performance I would've gotten with third-party iframes.

### Portability

In principle, the shortcode plugin doesn't have any Eleventy-specific logic, so it can technically work in any JavaScript-based build system. The other nice thing about the shortcode approach is that the code for your demos is embedded right within your Markdown, which means you can later move it to Codepen or some other provider if you decide to. In the worst case, if you ever decide to migrate to a static site generator that doesn't support custom shortcodes, you could just copy-paste the output iframes from your site right into your Markdown.

## Final Thoughts

Code demos can create an interactive and hands-on experience for readers, but they're not cheap—a typical third-party iframe will load client-side JavaScript and cookies, hurting your page load and potentially exposing your users to wanted tracking. Thankfully, in a static site generator such as Eleventy, we can easily create our own code demos without shipping any unwanted code.

I hope you find my plugin useful! If there are any features that you'd like me to add, you can submit a feature request on [the project's GitHub repository](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).
