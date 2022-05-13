---
title: Custom Markdown Components in 11ty
description: Ever wanted to nest Markdown in HTML? In 11ty, you can easily do this with paired shortcodes and a custom Markdown library parser.
keywords: [11ty, paired shortcodes, markdown, html]
categories: [11ty, markdown, javascript]
thumbnail: ./images/thumbnail.png
---

Like many static site generators, 11ty automatically converts Markdown templates to HTML, allowing you to focus on authoring content in a plaintext format. Unfortunately, the standard Markdown language only supports a limited number of shortcuts—anything custom is going to require that you write HTML by hand or extend the parser with a plugin.

The biggest catch with Markdown is that you can't ever nest it inside custom HTML. If you try to write HTML in a Markdown-only paragraph, it'll render as a string. Likewise, if you try to nest Markdown inside of a custom HTML tag, it'll render as-is rather than getting parsed to HTML.

In 11ty, one option to make HTML markup more reusable is to use an include:

{% raw %}
```liquid {data-file="src/_posts/2022-01-30-my-post.md"}
This is some **Markdown** interrupted by an include:

{% include "template.html" arg1: "val1", arg2: "val2" %}

The include inserts some HTML into this article.
```
{% endraw %}

This can work nicely for the simplest use cases where the include only needs to accept plaintext string arguments. But as soon as you need to nest Markdown inside of those strings, you'll run into the same problem: It won't get parsed to HTML. Plus, it would be nice to not have to use {% raw %}`{% set %}`{% endraw %} or {% raw %}`{% capture %}`{% endraw %} all the time to create multiline strings to pass into the include.

In this article, we'll look at how you can leverage paired shortcodes in 11ty to create truly custom components that can nest Markdown inside HTML tags.

{% aside %}
This tutorial assumes that you're using [markdown-it](https://github.com/markdown-it/markdown-it), but that isn't strictly necessary. All that matters is that you're using some custom Markdown parser and overriding 11ty's Markdown library in your config.
{% endaside %}

## A Primer on Shortcodes

Templating languages like Liquid and Nunjucks use tags for variable assignment, control flow, and various other operations. Tags look like this (examples shown in Liquid):

{% raw %}
```liquid
{% if someCondition %}{% endif %}
{% for i in (1..2) %}{% endfor %}
{% assign variable = 42 %}
```
{% endraw %}

The built-in templating tags are usually more than enough, but you may want to extend your templating language with custom tags. In 11ty, this is done by creating [template shortodes](https://www.11ty.dev/docs/shortcodes/): JavaScript functions that accept arguments and return a markup string (although they *technically* don't need to return anything).

You register shortcodes in your 11ty config, like so:

```js {data-file=".eleventy.js"}
module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('tag', (arg) => `<div>${arg}</div>`);
}
```

Once you've registered a shortcode, you can use it anywhere where templating is allowed, like Markdown:

{% raw %}
```liquid
{% tag 'Hello 11ty' %}
```
{% endraw %}

This particular example will output the following HTML once 11ty has processed the template:

```html
<div>Hello 11ty</div>
```

But this isn't all that exciting. It's not even the primary use case for shortcodes. Shortcodes are great for stuff like [creating custom image markup](https://www.11ty.dev/docs/plugins/image/), rendering templates asynchronously, and more.

You may have noticed that in the above example, our custom shortcode didn't have a corresponding closing tag. Wouldn't it be nice if we could do this instead?

{% raw %}
```liquid
{% tag %}
Hello, 11ty
{% endtag %}
```
{% endraw %}

## Paired Shortcodes as Components

It turns out that we actually *can* do this in 11ty using something called a [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes). All we need to do is swap out the function call in our 11ty config to register a paired shortcode instead of a normal one:

```js {data-file=".eleventy.js"}
module.exports = (eleventyConfig) => {
  eleventyConfig.addPairedShortcode('tag', (children) => `<div>${children}</div>`);
}
```

Unlike regular shortcodes, paired shortcodes have both a starting and ending tag, between which you can nest any content (plain text, includes, and even other shortcodes!). If any nested content is present, it gets parsed recursively for any templating logic, and the final output gets passed to the shortcode as its first positional argument. In the example above, our shortcode will receive the string `Hello, 11ty`. If you've ever worked with a component framework like React or Vue, then you may find it easier to think of paired shortcodes as components, where the nested content is essentially your `children` prop/slot.

Cool! We're getting closer to what we want: being able to nest Markdown inside custom HTML tags. Unfortunately, if we just pass Markdown syntax to our paired shortcode in its current state, we'll run into the same problem as before: The Markdown string will render as-is inside a text node. To fix this, we'll register a custom Markdown library with 11ty and use it in our shortcode to parse the content.

## Exporting a Reusable Markdown Parser

One great thing about 11ty projects is that you can leverage CommonJS modules to create reusable exports for functionality that may be needed in data files, filters, shortcodes, the 11ty config itself, and any other JavaScript files—including serverless functions! So rather than declaring your Markdown library inline inside of the 11ty config, you can export it from a separate module and import it into `.eleventy.js`. Here's an example of what that might look like:

```js {data-file="11ty/markdown.js"}
const markdownItDefault = require('markdown-it');

// you can use any plugins and configs you want
const markdownIt = markdownItDefault({
  html: true,
  breaks: false,
  linkify: true,
});

module.exports = markdownIt;
```

The nice thing about this pattern is that if you use certain Markdown plugins, like [`markdown-it-link-attributes`](https://github.com/crookedneighbor/markdown-it-link-attributes), they'll all get packaged up nicely as part of one reusable parser that's configured once and ready for use anywhere.

In `.eleventy.js`, you'd then import this custom module rather than directly importing the third-party module:

```js {data-file=".eleventy.js"}
const markdownIt = require('./11ty/markdown.js');

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary('md', markdownIt);
}
```

## Parsing the Markdown to HTML in Our Shortcode

At this point, all that remains is to update our custom paired shortcode to use this Markdown parser. Let's first lift the shortcode out into its own module:

```js {data-file="11ty/shortcodes.js"}
const customShortcode = (children) => {
  return `<div>${children}</div>`
}
```

Now, rather than directly interpolating the `children` prop inside our markup, we'll first convert it to Markdown:

```js {data-file="11ty/shortcodes.js"}
const markdownIt = require('../markdown');

const customShortcode = (children) => {
  const content = markdownIt.render(children);
  return `<div>${content}</div>`
}
```

One [common pitfall](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output) for Markdown in 11ty is when indented text gets interpreted as a code block. To fix this, you can install the [`outdent`](https://www.npmjs.com/package/outdent) package and use it like so:

```js {data-file="11ty/shortcodes.js"}
const markdownIt = require('../markdown');
const outdent = require('outdent');

const customShortcode = (children) => {
  const content = markdownIt.render(children);
  return outdent`<div>${content}</div>`
}
```

And we're done! We can now safely write any custom Markdown syntax inside our paired shortcode, and it will get parsed correctly to HTML:

{% raw %}
```md
{% tag %}
This contains some [**Markdown**](https://www.11ty.dev/docs/languages/markdown/).

# This is a heading level 1
{% endtag %}
```
{% endraw %}

Like I mentioned earlier, since you're using a single module for Markdown parsing, you can extend that module with whatever plugins you need. All of those changes will propagate to wherever the parser gets used!

## Use Cases

You may be wondering when you'd ever need to do something like this. In the example we looked at, the shortcode returns a `div` to keep things simple for this tutorial. Where this approach truly shines is if you need to render other tags with Markdown children, like:

- `aside` with `role="note"` (instead of blockquotes) for parenthetical content.
- Extended blockquotes that have citations/quotes at the end.
- A figure shortcode that renders a `<figure>` with a caption in Markdown.
- A `details` element containing Markdown-rendered content.

Below are some examples of this using custom shortcodes that I've implemented:

### Aside

Code:

{% raw %}
```liquid
{% aside %}
  This is an `aside` shortcode for parentheticals. It's an alternative to using Markdown blockqutoes and renders its content in an `<aside role="note">`. Neat!
{% endaside %}
```
{% endraw %}

Result:

{% aside %}
  This is an `aside` shortcode for parentheticals. It's an alternative to using Markdown blockqutoes and renders its content in an `<aside role="note">`. Neat!
{% endaside %}

### Quote

Code:

{% raw %}
```liquid
{% quote "Zach Leatherman: Eleventy v1.0.0, the Stable Release", "https://www.11ty.dev/blog/eleventy-one-point-oh/" %}
  This project would not be possible without our lovely community. Thank you to everyone that built something with Eleventy (×476 authors on our web site!), wrote a blog post about Eleventy, contributed code to core or plugins, documentation, asked questions, answered questions, braved The Leaderboards, participated on Discord, filed issues, attended (or organized!) a meetup, said a kind word on Twitter ❤️.
{% endquote %}
```
{% endraw %}

Result:

{% quote "Zach Leatherman: Eleventy v1.0.0, the Stable Release", "https://www.11ty.dev/blog/eleventy-one-point-oh/" %}
  This project would not be possible without our lovely community. Thank you to everyone that built something with Eleventy (×476 authors on our web site!), wrote a blog post about Eleventy, contributed code to core or plugins, documentation, asked questions, answered questions, braved The Leaderboards, participated on Discord, filed issues, attended (or organized!) a meetup, said a kind word on Twitter ❤️.
{% endquote %}

## Summary

Markdown is awesome. 11ty is awesome. Combine the two, and you get the flexibility of both without any tradeoffs. 11ty allows you to extend your favorite templating language with custom tags that can wrap Markdown syntax, effectively allowing you to nest Markdown inside HTML.
