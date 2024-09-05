---
title: Virtual Templates in Eleventy
description: In Eleventy 3.0, virtual templates enable plugin authors to publish and share dynamic templates.
keywords: [virtual templates, eleventy]
categories: [11ty, javascript]
---

Prior to Eleventy 3.0, templates had to physically live on a user's file system so that Eleventy could discover and process them at build time; there was no API for plugins to create shareable templates and inject them into Eleventy sites. This meant that as a plugin author, the best you could do was publish a filter or shortcode, register it with the corresponding Eleventy method inside your plugin (e.g., `addFilter` or `addShortcode`), and then leave it up to your users to call those functions in custom templates.

Sure, this gave users the flexibility to call your functions wherever and however they wanted, but it also meant that everyone had to set up those same template files from scratch. There was no way to share a generic `robots.txt` template, a `sitemap.xml` template, an RSS template, or other files that are common to most static websites.

However, in v3.0, Eleventy introduced virtual templates via a new `addTemplate` API, allowing you to add in-memory templating logic to any Eleventy site.

{% include "toc.md" %}

## Overview: The `addTemplate` Method

Eleventy's new `addTemplate` method accepts three positional arguments:

1. The source-relative name of the virtual template,
2. The template's content as a JavaScript string,
3. Any front matter that you want to pass to the virtual template.

Like this:

```js {data-file=".eleventy.js"}
eleventyConfig.addTemplate(
  'name.njk',
  'content',
  { permalink: '/output.txt' }
);
```

Don't let the first argument confuse you—virtual templates don't get written to your source directory as literal files. Instead, a virtual template's name is more like a key or globally unique ID that allows Eleventy to look it up in a map. The fully qualified source of this virtual template will appear in Eleventy's terminal output when it loops over your site's templates, but that template won't ever live on your file system. However, virtual templates _do_ get written to your _output_ directory if you give them a permalink. So in this example, if my site's source folder is `src`, the virtual template will resolve to `src/name.njk`, with content of `"content"` written to an output file under `/output.txt`. You won't see the input file, but you _will_ see the output file.

### Front Matter

You can use front-matter data in your virtual templates; Eleventy will process the templating logic inside the string just as if it were part of an ordinary template file. Here's an example where a virtual template outputs the value of a front matter variable:

{% raw %}
```js {data-file=".eleventy.js"}
eleventyConfig.addTemplate(
  'name.njk',
 '{{ customFrontMatterVariable }}',
  { customFrontMatterVariable: 'test' permalink: '/output.txt' }
);
```
{% endraw %}

This will generate an output file of `/output.txt` with content of `test`.

Optionally, you can define front matter in the template string itself:

```js {data-file=".eleventy.js"}
const templateContent = `
---
eleventyExcludeFromCollections: true
permalink: /output.txt
---

content
`;

eleventyConfig.addTemplate('name.njk', templateContent);
```

In this example, I gave my template a permalink of `/output.txt` and told Eleventy to exclude the virtual template file from `collections.all` so I don't accidentally loop over it in other templates (like in my sitemap).

Note that you can still use the third argument for front matter overrides even if your template has a front-matter block at the top; the two will get merged.

### Eleventy Globals

Inside virtual templates, you have access to all of your familiar Eleventy globals. So, for example, you can loop over `collections.all` to output dynamic content based on page data. This could be useful for setting up dynamic redirects, as I did in [eleventy-plugin-netlify-redirects](https://github.com/AleksandrHovhannisyan/eleventy-plugin-netlify-redirects/):

{% raw %}
```js {data-file=".eleventy.js"}
const redirects = `
---
eleventyExcludeFromCollections: true
permalink: /_redirects
---

{% for page in collections.all %}
  you can access page data here for all pages!
{% endfor %}
`;
```
{% endraw %}

### Looping

So far, we've looked at examples where we invoke `addTemplate` once, but you can also call it from a loop to create multiple pages synchronously:

```js
[1, 2, 3].forEach((pageNum) => {
  eleventyConfig.addTemplate(
    `test/${pageNum}`,
    '',
    { permalink: `/test/${pageNum}` }
  );
});
```

This example will generate three pages: `/test/1`, `/test/2`, and `/test/3`.

{% aside %}
Note that at the time of this writing, it's unclear how this new API can be used together with other APIs like `addCollection`, such as to programmatically generate tag pages for [custom Eleventy taxonomies](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/). See this GitHub thread for some of the discussion: [Configuration API method to create a content template (aka Virtual Templates)](https://github.com/11ty/eleventy/issues/1612#issuecomment-2065845663).
{% endaside %}

## Advice for Plugin Authors

Let's go over some things to keep in mind if you intend to publish a plugin that creates virtual templates.

### Feature Testing

Virtual templates are only supported in Eleventy v3.0+, but some users might mistakenly try to use your plugin on a site with an older version of Eleventy. Your plugin's installation instructions should clarify this, but the Eleventy docs on [feature testing plugins](https://www.11ty.dev/docs/plugins/#feature-testing) also recommend checking if this new API is available:

```js
module.exports = function (eleventyConfig, pluginOptions) {
	if(!("addTemplate" in eleventyConfig)) {
		console.log( `[my-test-plugin] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin, please use Eleventy v3.0 or newer.` );
	}
};
```

This way, if a user's Eleventy version is incompatible, they'll at least see a helpful message.

### Syntax Highlighting

As your templates grow in complexity, you'll find that defining them in JavaScript template strings isn't very ergonomic because you won't get any syntax highlighting. If you're a plugin author, I recommend that you instead write your template in a separate file:

```liquid {data-file="example.liquid"}
---
front: matter
---

I'm a Liquid template!
```

Then, you can open and read that file as a string with Node's file system API:

```js {data-file=".eleventy.js"}
const fs = require('fs');
const path = require('path');

const templateContent = fs.readFileSync(path.resolve(__dirname, 'example.liquid'), 'utf-8');
eleventyConfig.addTemplate('example.liquid', templateContent);
```

Before publishing your plugin, remember to include the template file in your `package.json`'s `files` entry so that your distributed package includes that file.

```js {data-file="package.json"}
{
  "files": [
    "src/index.js",
    "src/template.liquid",
    "README.md",
    "LICENSE",
    "package.json"
  ]
}
```

{% aside %}
**Note**: One disadvantage of writing your template in a separate file is that you can't easily unit test it. If instead you write your template as a function that returns a JavaScript string, you can easily test that function. This is what I did for [eleventy-plugin-robotstxt](https://github.com/AleksandrHovhannisyan/eleventy-plugin-robotstxt/). Pick whichever approach suits your needs.
{% endaside %}

### Supported Template Languages

When you set up an Eleventy site, you can tell it which template language(s) your website supports via its standard configuration API:

```js
module.exports = (eleventyConfig) => {
  return {
    dataTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    templateFormats: ['html', 'md', 'liquid'],
  };
};
```

But how can plugin authors know which language to use in their virtual templates? For example, the above configuration sets up Liquid as the only valid template language on my site, meaning it opts out of the default of Nunjucks (and any of the other languages that Eleventy supports). How do I use a plugin that tries to write a virtual template in Nunjucks?

For now, the [unofficial solution recommended by Zach Leatherman](https://github.com/11ty/eleventy/issues/1612#issuecomment-2027476340) is for plugin authors to call `eleventyConfig.addTemplateFormats` with the name of the template language you wish to use in your virtual template. For example, if I'm a plugin author and I want to write a virtual template in Liquid, but I know that some of my users' websites might not support Liquid, I would have to do this somewhere in my plugin code:

```js {data-file=".eleventy.js"}
module.exports = (eleventyConfig, options) => {
  eleventyConfig.addTemplateFormats('liquid');
}
```

I'm not a huge fan of adding a template language to a user's site configuration. This could have unintended consequences if, for whatever reason, someone has a file with that extension in their source directory that they don't actually want to treat as a template. Granted, I can't think of why anyone would ever do that, but I suppose it's possible.

Alternatively, your plugin could accept a string option for the template language to use. You could support a limited set of template languages, create one file for each, and then open and read the appropriate file based on this plugin option:

```js {data-file=".eleventy.js"}
module.exports = (eleventyConfig, options) => {
  const language = options.language ?? 'liquid';
  const name = `example.${language}`;
  const content = fs.readFileSync(path.resolve(__dirname, name), 'utf-8');
  eleventyConfig.addTemplate(name, templateContent);
}
```

This isn't ideal either since it means that you'll have to maintain the same code across multiple template languages.

That said, this API is still in beta and will likely improve over time.

## Final Thoughts

Virtual templates help bridge the gap between Eleventy's plugin authors and users, allowing you to share reusable templates with the rest of the community. If you'd like to see more examples of what you can do with virtual templates, here are two npm packages I published that use this new feature:

- [`eleventy-plugin-netlify-redirects`](https://github.com/AleksandrHovhannisyan/eleventy-plugin-netlify-redirects/)
- [`eleventy-plugin-robotstxt`](https://github.com/AleksandrHovhannisyan/eleventy-plugin-robotstxt/)

