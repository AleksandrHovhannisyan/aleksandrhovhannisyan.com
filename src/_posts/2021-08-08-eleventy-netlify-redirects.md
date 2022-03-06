---
title: Automate Netlify Redirects with 11ty
description: Tired of listing all of your Netlify redirects by hand? Generate them programmatically with a bit of 11ty templating magic!
keywords: [netlify redirects, 11ty, eleventy]
categories: [11ty, netlify, liquid, seo]
thumbnail: thumbnail.jpg
commentsId: 105
---

Proper 301 redirects are essential for SEO, but not all frameworks and hosting services provide a straightforward way to set them up. Most static site generators like Gatsby and Jekyll require additional plugins and configuration to support redirects.

While you can try to force [client-side redirects](http://www.w3.org/TR/WCAG20-TECHS/H76.html) with the meta refresh tag, it's preferable to configure 301 redirects on the server side so that there are no unwanted delays on the client side.

Fortunately, Netlify offers a simple way to [set up server-side redirects for any site](https://docs.netlify.com/routing/redirects/). All you have to do is create a `_redirects` file and ensure that it ends up in the root of your build output directory. This file consists of tab-delimited rules that map old URLs to the new ones:

```
/old/url/1  /new/url/1
/old/url/1  /new/url/2
```

{% aside %}
**Note**: Optionally, you can also specify redirects in your `netlify.toml` config.
{% endaside %}

After your site gets built, Netlify's redirects engine processes and registers these rules. When a user requests an old URL listed under the left-hand column, Netlify will respond with the corresponding URL under the right-hand column.

You can create this file and list all of your redirects by hand. Then, all you need to do is tell 11ty to pass-through copy this file to your output directory so that Netlify sees it:

```js {data-file=".eleventy.js" data-copyable=true}
module.exports = (eleventyConfig) => {
  // Assuming your file resides under src/_redirects
  eleventyConfig.addPassthroughCopy('src/_redirects');
}
```

This works, but it isn't ideal. Whenever you change a page's URL, you'll need to go in and update not only the page's file slug but also the new URL listed under the right-hand column of the `_redirects` file. Effectively, you've doubled your work.

Wouldn't it be nice if we could derive the new URLs from our static files? Well, with 11ty and a bit of templating, we can!

## Programmatically Generating the Netlify `_redirects` File

Create a file named `redirects.liquid` in your Eleventy source folder. I'm using Liquid for this tutorial; if you use a different templating language (like Nunjucks), you'll want to adjust the file extension and code accordingly.

Declare this front matter to start things off:

{% raw %}
```liquid {data-file="src/redirects.liquid" data-copyable=true}
---
permalink: /_redirects
eleventyExcludeFromCollections: true
---
```
{% endraw %}

This doesn't do anything special just yet. The permalink tells 11ty to create a `_redirects` file in the root of our build output directory, and `eleventyExcludeFromCollections` excludes this page from `collections.all` so that it doesn't show up when we iterate over our collections.

Since this is just your ordinary template file, you can put whatever content you want in here, including static redirect rules. So you could list all of your redirects by hand:

{% raw %}
```liquid
---
permalink: /_redirects
eleventyExcludeFromCollections: true
---
/blog/my-first-post/  /blog/hello-11ty/
```
{% endraw %}

But the whole point of using a template file is so that we can take advantage of templating logic to generate the Netlify redirects programmatically rather than coding it statically.

Instead, what if we introduce a custom front-matter variable, like `redirectFrom`, that a page can use to specify the URL from which it redirects? We can then loop through all pages like this and generate our Netlify redirect rules:

{% raw %}
```liquid {data-file="src/redirects.liquid" data-copyable=true}
---
permalink: /_redirects
eleventyExcludeFromCollections: true
---
{%- for page in collections.all -%}
  {%- if page.url and page.data.redirectFrom %}
{{ page.data.redirectFrom }}  {{ page.url }}
  {%- endif -%}
{%- endfor -%}
```
{% endraw %}

We check to see if a page has a valid URL and if its front matter specifies a `redirectFrom` URL. If it does, we map that old URL to the page's current URL. If you want to exclude a particular page from this loop, just set `eleventyExcludeFromCollections` to `true` in its front matter.

{% aside %}
  One thing worth noting is how I've intentionally formatted the file's indentation to comply with Netlify's [syntax for the `_redirects` file](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file). This ensures that each line is left-aligned properly and doesn't have any leading spaces. You *could* remove those spaces with Liquid's [whitespace control](https://shopify.github.io/liquid/basics/whitespace/), but that would also remove newlines.
{% endaside %}

Now, whenever you want to change a page's URL structure, all you need to do is track the old URL in its front matter and update the file name/permalink/slug to be the new URL:

{% raw %}
```liquid {data-file="_posts/2021-08-07-new-url.md"}
---
redirectFrom: /blog/old-url/
---
```
{% endraw %}

For this particular example, assuming that your blog post permalinks are derived from the file slug, 11ty would output the following Netlify `_redirects` file:

``` {data-file="_redirects"}
/blog/old-url/  /blog/new-url/
```

## Redirecting From Multiple Old URLs

Above, we assumed that `redirectFrom` is a single string. But if a URL changes several times, you may want to redirect all of the old URLs to the new one, especially if there are links to the old URLs on social media.

To handle this case, we can make `redirectFrom` an array:

{% raw %}
```liquid {data-file="_posts/2021-08-07-new-url.md"}
---
redirectFrom: [url1, url2]
---
```
{% endraw %}

This would just require an additional loop to iterate over each URL for a given page:

{% raw %}
```liquid {data-file="src/redirects.liquid" data-copyable=true}
---
permalink: /_redirects
eleventyExcludeFromCollections: true
---
{%- for page in collections.all -%}
  {%- if page.url and page.data.redirectFrom -%}
    {%- for oldUrl in page.data.redirectFrom %}
{{ oldUrl }}  {{ page.url }}
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
```
{% endraw %}

And that's all there is to it! Now, you have proper server-side redirects thanks to Netlify, and you've automated the process of generating the rules with 11ty.

{% include unsplashAttribution.md name: "Jamie Templeton", username: "jamietempleton", photoId: "6gQjPGx1uQw" %} Modified to include the Eleventy mascot designed by [Phineas X. Jones](http://octophant.us/).
