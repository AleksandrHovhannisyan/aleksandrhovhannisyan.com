---
title: A Set of Useful 11ty Filters
description: Extend Eleventy's built-in filters with custom logic for these common use cases.
keywords: [11ty filters, filter]
categories: [11ty, javascript, nodejs, liquid]
thumbnail: https://images.unsplash.com/photo-1511225317751-5c2d61819d58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

One of my favorite things about 11ty is its flexibility. Even though Liquid, Nunjucks, and other [template languages](https://www.11ty.dev/docs/languages/) offer many sensible defaults out of the box, they can't possibly account for every use case that you may have. 11ty acts as an adapter between your site and that template language, allowing you to extend its behavior without necessarily knowing how to configure the language *directly*. In this article, we'll look at some of my favorite filters to add to 11ty projects.

{% include "toc.md" %}

## Custom Filters for Any 11ty Project

### 1. Path Manipulation

Working with system paths is a joy in Node.js thanks to the built-in `path` module, which allows you to parse, join, and resolve paths with ease. But sometimes, you may find that you need to do some path manipulation at the template level, like in an include or a layout file. In that case, you may find it useful to add the following two filters to your 11ty site:

```js {data-file=".eleventy.js" data-copyable=true}
/**
 * Parses a file system path and returns either the file name or directory.
 * @param {string} path
 * @param {'name'|'dir'} key
 */
const pathParse = (path, key) => path.parse(path)[key];

/**
 * Joins an arbitrary number of paths using the OS separator.
 * @param {string[]} paths
 */
const pathJoin = (...paths) => path.join(...paths);

eleventyConfig.addFilter('pathParse', pathParse);
eleventyConfig.addFilter('pathJoin', pathJoin);
```

Example usage:

{% raw %}
```liquid
{{ 'src/assets/images/image.png' | pathParse: 'dir' }}
{{ 'src' | pathJoin: 'path1', 'path2', 'path3' }}
```
{% endraw %}

### 2. Working with JSON

Other times, you may need to parse or stringify some object data. For example, if you're using Liquid in 11ty, you may have run into a limitation with shortcodes where you cannot pass along named arguments as key-value pairs. In my article on [how to pass object arguments to Liquid shortcodes in 11ty](/blog/passing-object-arguments-to-liquid-shortcodes-in-11ty), I use a trick with JSON to assemble an object argument from individual pieces of data inside a template, passing that result along to my shortcode.

I recommend adding these two filters to any 11ty project where you work with object data:

```js {data-file=".eleventy.js" data-copyable=true}
eleventyConfig.addFilter('jsonParse', JSON.parse);
eleventyConfig.addFilter('jsonStringify', JSON.stringify);
```

Example usage:

{% raw %}
```liquid
{%- capture json -%}
  {
    "src": "{{ src }}"
    {%- if alt -%},"alt": "{{ alt }}"{%- endif -%}
    {%- if className -%},"className": "{{ className }}"{%- endif -%}
  }
{%- endcapture -%}
{%- assign object = json | jsonParse -%}
```
{% endraw %}

You can then do whatever you want with this JavaScript object.

### 3. Date Formatting

On my site, I often need to render dates in a variety of formats. For example, sometimes I need an [ISO8601 date string](https://en.wikipedia.org/wiki/ISO_8601), like for [the `datetime` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#attr-datetime) of the HTML `time` element or for dates in an RSS feed or sitemap:

```xml
<url>
  <loc>https://www.site.com/</loc>
  <lastmod>2022-05-14T22:11:31.374Z</lastmod>
</url>
```

For this reason, I like to include the following filter in my projects to convert a raw date string to a properly formatted ISO string:

```js {data-file=".eleventy.js" data-copyable=true}
/** Converts the given date string to ISO8601 format. */
const toISOString = (dateString) => new Date(dateString).toISOString();
eleventyConfig.addFilter('toISOString', toISOString);
```

Example usage:

{% raw %}
```html
<time datetime="{{ post.date | toISOString }}">
  {{ post.date }}
</time>
```
{% endraw %}

I also often need to render dates in a specific format. I like using [`dayjs`](https://day.js.org/) for this task since it offers highly readable [date formats](https://day.js.org/docs/en/display/format). Note that since this dependency only gets used in templates at build time, it doesn't actually ship any client-side JavaScript, so you could technically use any library you want. Here's the code:

```js {data-file=".eleventy.js" data-copyable=true}
/** Formats a date using dayjs's conventions.
 * Docs: https://day.js.org/docs/en/display/format
 */
const formatDate = (date, format) => dayjs(date).format(format);
eleventyConfig.addFilter('formatDate', formatDate);
```

Building on the previous example, we can now format the rendered date:

{% raw %}
```html
<time datetime="{{ post.date | toISOString }}">
  {{ post.date | formatDate: 'MM/DD/YYYY' }}
</time>
```
{% endraw %}

This would output something like the following:

```html
<time datetime="2022-05-14T22:11:31.374Z">
  05/14/2022
</time>
```

### 4. Absolute URLs

Relative URLs work fine for many links, but there are some places where you actually need to use absolute URLs. These include:

- OpenGraph and social media preview images (like for Twitter).
- The [canonical URL](https://en.wikipedia.org/wiki/Canonical_link_element) meta tag.
- Sitemap URLs.
- Links to pages in your [JSON-LD structured data](https://json-ld.org/).

Unfortunately, 11ty doesn't have a built-in way of formatting URLs as absolute URLs relative to your site's base URL. But that's okay! We can easily implement this ourselves.

{% aside %}
**Edit**: As [Peter deHaan notes](https://github.com/11ty/eleventy/issues/2387#issuecomment-1126947870), the [11ty RSS plugin](https://www.11ty.dev/docs/plugins/rss/#supplies-the-following-nunjucks-filters) has an `absoluteUrl` filter that does precisely this. It also comes with some other handy filters for formatting RSS output.
{% endaside %}

Following [Pieter Heyvaert's recommended pattern](https://pieterheyvaert.com/blog/2019/02/25/11ty-full-paths-locally/), we can create a custom JavaScript data file to specify our site's base URL:

```js {data-file="src/_data/site.js" data-copyable=true}
const isDev = process.env.ELEVENTY_ENV === 'development';

const baseUrl = isDev ? `localhost:port` : `https://www.your-domain.com/`;

const site = {
  title: 'Your site title',
  description: 'Your site description',
  baseUrl,
}

module.exports = site;
```

Be sure to replace `port` with whatever port you use for your 11ty site. That way, your local development URLs match whatever URL your 11ty dev server spins up on (`8080` by default, but you can customize this with the [`--port` CLI option](https://www.11ty.dev/docs/usage/)).

Next, we'll add a simple filter to our 11ty site that can auto-prefix any URL we give it with our base URL:

```js {data-file=".eleventy.js" data-copyable=true}
const site = require('./src/_data/site');

/**
 * Prefixes the given URL with the site's base URL.
 * @param {string} url
 */
const toAbsoluteUrl = (url) => {
  return new URL(url, site.baseUrl).href;
}

eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
```

Example usage:

{% raw %}
```html
<meta rel="canonical" href="{{ page.url | toAbsoluteUrl }}">
<meta property="og:image" content="{{ 'path/to/og/image' | toAbsoluteUrl }}">
```
{% endraw %}

### 5. Referencing Optimized Image URLs (with the eleventy-img Plugin)

The [11ty image plugin](https://www.11ty.dev/docs/plugins/image/) is an excellent way to optimize images on your site with very little effort. Out of the box, it generates image file names that include a unique hash as well as the width of the image, like this:

```html
<img src="wKpCjAogcy-600.webp" alt="" width="600" height="300" />
```

This makes it easy to cache-bust images since the hash is deterministic—if the image changes, the hash recomputes.

Unfortunately, image hashing comes with one notable drawback: If you want to reference an optimized image somewhere in your templates—like in an OpenGraph meta tag in your document `head`—how do you get the image hash and width from just its source path? You don't know this information ahead of time!

```html
<meta property="og:image" content="???">
```

To get around this problem, we can use use a clever trick. We'll keep our image shortcode as-is so that it generates our custom image markup wherever we need it to, but we'll also create an auxiliary filter that can look up any image and return its URL that will *eventually* get generated once the image is processed. We'll even reuse the `toAbsoluteUrl` filter we created in the previous section:

```js {data-file=".eleventy.js" data-copyable=true}
/** Given a local or remote image source, returns the absolute URL
 * to the image that will eventually get generated once the site is built.
 * @param {string} src The full path to the source image.
 * @param {null|number} width The width of the image whose URL we want to return.
 */
const toAbsoluteImageUrl = async (src, width = null) => {
  const imageOptions = {
    // We only need the original width and format
    widths: [width],
    formats: [null],
    // Where the generated image files get saved
    outputDir: '_site/assets/images',
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: '/assets/images',
  };
  const stats = await Image(src, imageOptions);
  const imageUrl = Object.values(stats)[0][0].url;
  return toAbsoluteUrl(imageUrl);
};
```

{% aside %}
Thanks to caching, it doesn't matter that we may be processing some images twice—once in this filter and again with the image shortcode itself—since we're not *generating* images twice. For safe measure, you may want to enable [the dry-run flag](https://www.11ty.dev/docs/plugins/image/#dry-run).
{% endaside %}

Just be sure to update the `outputDir` and `urlPath` arguments based on where you save images on your site.

Example usage:

{% raw %}
```html
<meta property="og:image" content="{{ 'src/assets/images/image.png' | toAbsoluteImageUrl }}">
```
{% endraw %}

Example output:

```html
<meta property="og:image" content="https://www.site.com/assets/images/wKpCjAogcy-600.webp">
```

## Filters Are Powerful

With 11ty, you can create any filter you want without needing to learn a new language or spend many frustrating hours reading docs. This article only looked at a few filters that you may find useful. There are many others that you can add to your project, like to filter, map, or reduce arrays of objects; group arrays of objects; escape data using a custom sanitizer; minify and inline CSS; and much more. Plus, as we saw in the last example, you can compose filters together, allowing you to greatly simplify your templates.

{% include "unsplashAttribution.md" name: "Nathan Dumlao", username: "nate_dumlao", photoId: "eksqjXTLpak" %}
