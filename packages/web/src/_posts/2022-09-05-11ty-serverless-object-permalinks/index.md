---
title: "11ty Serverless and Object Permalinks: Hybrid Rendering"
description: Learn how to reuse a single source template in 11ty Serverless to generate both a static and server-rendered page.
keywords: [11ty serverless, object permalink]
categories: [11ty, netlify, ssg, forms]
---

In [a recent project](https://cryptography-algorithms.netlify.app/), I wanted to create a simple website that collects some input via a form and generates a corresponding output page, with no client-side JavaScript. This website needed to have multiple distinct pages, each with its own `form[method="GET"]` and a submit button. When the submit button is clicked on a particular page, the user should be taken to a corresponding output page. All of this sounded like the perfect use case for [11ty Serverless](https://www.11ty.dev/docs/plugins/serverless/): a plugin that allows Eleventy to generate not only static pages at build time but also serverless pages at request time, utilizing [Netlify functions](https://www.netlify.com/products/functions/) that run on the server side. Since serverless routes can accept query parameters, they can easily handle form submissions since the default behavior for forms is to serialize their data in the URL.

One way to implement the website I just described in 11ty is to always server-render an input page and reuse that same page (source template and permalink) for the form submission endpoint. So when the form gets submitted, the page will refresh itself with the form data serialized in its URL as query parameters, like `/page1/?param=value`.

<div class="scroll-x">
  <table>
    <caption>Table 1: a single source template, always server rendered</caption>
    <thead>
      <tr>
        <th scope="col">Page</th>
        <th scope="col">Rendering mode</th>
        <th scope="col">Source template</th>
        <th scope="col">Permalink</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Input</td>
        <td>SSR</td>
        <td><code>src/page1.html</code></td>
        <td><code>/page1/</code></td>
      </tr>
      <tr>
        <td>Output</td>
        <td>SSR</td>
        <td><code>src/page1.html</code></td>
        <td><code>/page1/</code></td>
      </tr>
    </tbody>
  </table>
</div>

That works well, but it's not ideal because every request for `/page1/` will always fire off a Netlify function to build that page. Depending on the amount of traffic you get (or the number of times users submit your form), you may end up blowing your monthly quota for serverless function calls. Plus, this approach will introduce a slight delay between the request time and the time when the server responds with the built page (also known as the [time to first byte](https://web.dev/ttfb/)). With a purely static page built at deploy time, the server response time would be much faster.

Another approach is to statically generate the input page from one template (maybe `src/page1.html`) and server-render a different output page on a different route from a different template (maybe `src/output1.html`), like so:

<div class="scroll-x">
  <table>
    <caption>Table 2: using two different templates</caption>
    <thead>
      <tr>
        <th scope="col">Page</th>
        <th scope="col">Rendering mode</th>
        <th scope="col">Source file</th>
        <th scope="col">Permalink</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Input</td>
        <td>SSG</td>
        <td><code>src/page1.html</code></td>
        <td><code>/page1/</code></td>
      </tr>
      <tr>
        <td>Output</td>
        <td>SSR</td>
        <td><code>src/output1.html</code></td>
        <td><code>/output1/</code></td>
      </tr>
    </tbody>
  </table>
</div>

This time around, the input page (`/page1/`) can be served immediately to the user because it will be generated statically when 11ty runs your build. Meanwhile, the output page will be built at request time when a user submits the form or manually navigates to the serverless route (`/output1/`). But this approach is also not without its downsides. For starters, the output page's URL has no "memory" of the input page that led you to it. Instead, I wanted a nested directory structure, like `/page1/output/`, to communicate this relationship more clearly. Moreover, to make it easier to present the output to the user, I wanted the output page to reuse the same template as the input page and just populate the form with whatever query parameters were supplied to it. Then, the template could detect if it's in a serverless environment and, if so, show some output in addition to the form. In this approach, I would need to copy-paste the code from `page1.html` into `output1.html`, which is less than ideal.

What I really wanted was to reuse `page1.html` for both SSG and SSR:

<div class="scroll-x">
  <table>
    <caption>Table 3: reusing a source template for both SSG and SSR</caption>
    <thead>
      <tr>
        <th scope="col">Page</th>
        <th scope="col">Rendering mode</th>
        <th scope="col">Source template</th>
        <th scope="col">Permalink</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Input</td>
        <td>SSG</td>
        <td><code>src/page1.html</code></td>
        <td><code>/page1/</code></td>
      </tr>
      <tr>
        <td>Output</td>
        <td>SSR</td>
        <td><code>src/page1.html</code></td>
        <td><code>/page1/output/</code></td>
      </tr>
    </tbody>
  </table>
</div>

For example, if a user is on `/page1/` and submits the form, the browser should request `/page1/output/` on form submission. That `/page1/output/` route is rendered on the server but reuses the exact same source template as the original statically built `/page1/` page.

There are two benefits to this approach. First, each source URL (`/page1/`) is associated with a corresponding output URL (`/page1/output/`), so there's a clear relationship between these two pages. Second, because the output page reuses the same input source template and populates the form with the values supplied to it via query parameters, a user doesn't need to constantly navigate back and forth between the input and output pages if they want to resubmit the form. Once they land on the output page, they can tweak the form to their heart's content and resubmit it to generate new output.

In summary, I wanted to reuse a single 11ty template to generate both a static (build-time) page and a serverless page. Let's learn how to do this!

## Prerequisites

This tutorial assumes basic working knowledge of 11ty Serverless. Before proceeding, I recommend that you familiarize yourself with this plugin. There are many useful community resources on this subject. When I was first learning how to use 11ty Serverless, I found the following resources particularly helpful:

- [Official Eleventy Serverless documentation](https://www.11ty.dev/docs/plugins/serverless/)
- [Creating a dynamic color converter with 11ty Serverless](https://bryanlrobinson.com/blog/creating-a-dynamic-color-converter-with-11ty-serverless/)
- [A First Look at Eleventy Serverless](https://someantics.dev/first-look-eleventy-serverless/)

## 1. Defining a Serverless Route

In your typical site built with 11ty or any other static site generator, you would define your pages statically and give each one a permalink. In 11ty Serverless, creating a server-rendered page is not a simple matter of creating a template file, giving it a permalink, and calling it a day. Rather, we need to register our serverless functions with Eleventy ahead of time so it doesn't need to scan our source code to discern whether a template is serverless or static.

We can register a serverless route in our `.eleventy.js` file by importing the serverless plugin from the [`@11ty/eleventy`](https://www.npmjs.com/package/@11ty/eleventy) package (which you've hopefully already installed!) and passing it along to the 11ty config's `addPlugin` method, like so:

```js {data-file=".eleventy.js" data-copyable="true"}
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "page1",
    // you can change this directory name if you want
    functionsDir: "./netlify/functions/",
  });

  return {/* your eleventy dir config */};
};
```

In my project, I wanted to be able to generate multiple serverless routes without having to copy-paste this code for each one. If you have a similar use case, I recommend creating a tiny helper function to do this for you, like this:

```js {data-file=".eleventy.js" data-copyable="true"}
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = (eleventyConfig) => {
  const createServerlessRoute = (name) => {
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
      name,
      functionsDir: "./netlify/functions/",
    });
  };

  createServerlessRoute("page1");
  createServerlessRoute("page2");
  createServerlessRoute("etc");

  return {/* your eleventy dir config */};
};
```

The next time 11ty runs, it will generate new source files under `./netlify/functions/` corresponding to each serverless route you declared in your config. For example, the above code will generate the following three directories:

- `./netlify/functions/page1/`
- `./netlify/functions/page2/`
- `./netlify/functions/etc/`

{% aside %}
**Heads up!** Remember to [add glob patterns for these directories to your `.gitignore`](https://www.11ty.dev/docs/plugins/serverless/#step-2-add-to-.gitignore) since they contain not only the lambda function itself (which you can edit and need to track) but also some regenerated files that you don't want to track.
{% endaside %}

## 2. Creating a Template for SSG and SSR

So far, we've only registered a Netlify function with the 11ty Serverless plugin, but this won't really do anything yet if we navigate to those URLs. That's because we need to create a template with a permalink pointing to the serverless route so that 11ty knows how to build the page at request time. Since we want our single template to generate both a static page and a server-rendered page, we'll need to use an object permalink instead of the ordinary string permalink that you're used to seeing:

```yml {data-file="src/_pages/page1.html" data-copyable="true"}
---
permalink:
  build: /page1/
  page1: /page1/output/
---
```

With 11ty Serverless, we can map a template to multiple permalinks: one reserved for a build-time static page (with the reserved `build` key) and an arbitrary number of Eleventy serverless routes keyed-in by their lambda function names. When the site builds, the template will initially be used to generate a static page at `/page1/` using our build entry. When a user requests the serverless URL the `page1` function will:

1. Fire on Netlify's servers (or locally with [Netlify Dev](https://cli.netlify.com/netlify-dev/));
2. Process the template with the 11ty Serverless plugin, injecting an `eleventy.serverless` object; and
3. Return the built page for the requested URL (`/page1/output/`) to the user.

This precisely matches the behavior we wanted!

In this template, we can render a form as described in the intro, populating the inputs with either the values from the query string parameters (if this template is being rendered on the server side) or with some fallback values, if the page is being rendered statically at build time. Here's a mock example:

{% raw %}
```liquid {data-file="src/_pages/page1.html" data-copyable="true"}
{%- comment -%}If we're in an SSR context, populate the inputs with values from
the query string. In SSG, these will be undefined, so we add fallbacks.{%- endcomment -%}
{%- assign param1 = eleventy.serverless.query.param1 | default: '' -%}
{%- assign param2 = eleventy.serverless.query.param2 | default: '' -%}
{%- comment -%}Both the SSG and SSR pages will share this form UI{%- endcomment -%}
<form method="GET" action="/page1/output/">
  <label>
    Param1
    <input type="text" name="param1" value="{{ param1 }}">
  </label>
  <label>
    Param2
    <input type="number" name="param2" value="{{ param2 }}">
  </label>
  <button type="submit">Submit</button>
</form>
```
{% endraw %}

{% aside %}
You may have noticed that the form's action endpoint is currently hard-coded in the example above. We'll fix that shortly!
{% endaside %}

We can also check if `eleventy.serverless` is defined in this template and show some output below the form:

{% raw %}
```liquid
{% comment %}Show some output below the form in SSR{% endcomment %}
{% if eleventy.serverless %}
  ...
{% endif %}
```
{% endraw %}


That output won't render for the statically built page, but it will when 11ty Serverless builds the serverless route. I won't show an example of that output since it will vary by use case, but you could rener anything you want using shortcodes or filters to process the query string.

### Automatic Permalink Generation: Computed Data

I don't know about you, but I don't like having to manually create these permalinks for each page in my collection:

```yml
---
permalink:
  build: /page1/
  page1: /page1/output/
---

---
permalink:
  build: /page2/
  page2: /page2/output/
---

---
permalink:
  build: /page3/
  page3: /page3/output/
---

# etc.
```

Can we instead tell 11ty to intelligently generate these URLs from our file slugs or some other front-matter variables? We sure can, thanks to [computed data](https://www.11ty.dev/docs/data-computed/)!

We'll do this with a [directory data file](https://www.11ty.dev/docs/data-template-dir/) for our collection. This assumes that your SSG-and-SSR hybrid pages reside under a common directory, like `_pages/` or `_directory/` or whatever you want to name it. Create a corresponding `_directory.11tydata.js` file under that same directory (replacing `_directory` with the actual name of your directory) and export the following data object from this module:

```js {data-file="src/_pages/_pages.11tydata.js" data-copyable="true"}
module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      return {
        build: `/${data.page.fileSlug}/`,
        [data.page.fileSlug]: `/${data.page.fileSlug}/output/`,
      };
    },
  },
};
```

If you're not familiar with computed data, it allows you to generate variables from pre-existing front matter data. In this example, we're reading the page's data and using it to define a `permalink` data variable for each page in our collection. This example says to map each template in our collection to two URLs: a static build-time URL of the form `/:slug/` (e.g., `page1.html` becomes `/page1/`) and a server-rendered URL of the form `/:slug/output/` (assuming our lambda function name matches the file slug itself). So if we name a template `page1.html`, we should also register a lambda function named `page1` in our 11ty config, as demonstrated before:

```js {data-file=".eleventy.js"}
// This is just a refresher on what we did before
eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
  name: "page1",
  functionsDir: "./netlify/functions/",
});
```

With this example, our data file would spit out the following permalink object for `src/_pages/page1.html`:

```json
{
  "build": "/page1/",
  "page1": "/page1/output/"
}
```

If you don't want to use file slugs to generate your permalinks, you can be more explicit and give each page in your collection a custom unique identifier in its front matter, like this:

```yml {data-file="src/_pages/page1.html" data-copyable="true"}
---
id: page1
---
```

And then you could use that string ID instead of the file slug:

```js {data-file="src/_pages/_pages.11tydata.js" data-copyable="true"}
module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      return {
        build: `/${data.id}/`,
        [data.id]: `/${data.id}/output/`,
      };
    },
  },
};
```

It's up to you how you want to go about doing this. Just be careful not to name your ID or file slug `build`, or the serverless URL will overwrite the static build URL.

### Pointing the Form's `action` to the SSR URL

Currently, our form uses this `action` attribute to point to a hard-coded URL for the server-side rendered URL that we defined earlier:

```html
<form method="GET" action="/page1/output/"></form>
```

Instead of hard-coding this, we can actually read it directly off of the permalink object:

{% raw %}
```html
<form method="GET" action="{{ permalink[page.fileSlug] }}"></form>
```
{% endraw %}

If you're generating your URLs from another variable (like `id` in the example from earlier), you'd just key in with that data instead:

{% raw %}
```html
<form method="GET" action="{{ permalink[id] }}"></form>
```
{% endraw %}

## Summary

Awesome! We managed to reuse a single template in 11ty Serverless to generate both a static page (at build time) and a server-rendered page (at request time). Now, we don't need to copy-paste the source template for these two use cases; instead, we can combine the logic for static generation and server-rendering into a single template. As a bonus, our users can resubmit the form as many times as they want without navigating back and forth between the input and output pages.
