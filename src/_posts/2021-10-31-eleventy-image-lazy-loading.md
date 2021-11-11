---
title: Lazily Loading Images with the 11ty Image Plugin
description: While imagery can enrich your content, it can also slow down your site if it's not used responsibly. Learn how to use the official 11ty image plugin to create optimized, responsive, and lazily loaded images.
keywords: [11ty image, lazy load, lazily load]
categories: [webperf, 11ty, images, javascript]
commentsId: 118
lastUpdated: 2021-11-30
thumbnail: https://images.unsplash.com/photo-1631739408670-38319df9c5c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80
---

Images are a core part of the web, but they don't come for free. While imagery can enrich your content and create a more engaging user experience, it can also slow down your site and create a poor user experience if it's not used responsibly. Now that Google uses page load speed as a ranking factor, developers need to put in more effort to create responsive and optimized images and deliver the best possible experience to their users.

Unfortunately, this is all easier said than done. Optimizing images requires:

1. Using next-generation image formats like WebP or AVIF, with fallbacks.
2. Serving the right image sizes based on the device width ([resolution switching](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)).
3. Deferring off-screen images (a strategy known as lazy loading).

If all of that seems like a lot of work, that's because it is!

You _could_ optimize your images by hand with CLI tools like [ImageMagick](https://imagemagick.org/index.php), but this is difficult to maintain for projects that need to scale. For example, if you ever want to generate new image formats in the future, you're going to need to go through and update all of your images by hand. Instead, it's better to store a single source image in your repository and generate the output formats and sizes at build time.

For this reason, many modern frameworks like Gatsby and Next.js offer image plugins that can automatically do all of this work for you out of the box, with minimal configuration. However, while these plugins do the heavy lifting of optimizing images at build time, they also typically render inflexible markup that can only be customized in limited ways through props. This can make it difficult to tailor those image plugins to meet your specific needs. They also typically lead to slower build times, particularly in Gatsby.

Fortunately, Eleventy offers a better alternative: the [official eleventy-image plugin](https://www.11ty.dev/docs/plugins/image/), which can be used to resize and transform both local and remote images. Since the plugin is written entirely as a standalone Node package powered by Sharp—with no 11ty-specific dependencies or logic—you can actually [use it in any framework](https://bholmes.dev/blog/picture-perfect-image-optimization/). This makes it a highly flexible tool for generating optimized, responsive images.

But where this plugin _really_ shines is in an 11ty project, where you can create an image shortcode to return custom image markup, complete with responsively sized images and modern image formats. In this article, I'll show you how to optimize images with the 11ty image plugin and lazily load them for blazing-fast load times. We'll use modern strategies like resolution-switching and low-quality image placeholders.

{% include toc.md %}

## An Introduction to the Eleventy Image Plugin

Before we dive deep into the code specific to this tutorial, I want us to take some time to explore the 11ty image plugin and familiarize ourselves with its API. There are lots of good resources out there on this topic, but a great place to start is the [11ty image plugin documentation](https://www.11ty.dev/docs/plugins/image/). I'll also cover everything you need to know here. If you're already familiar with the plugin, feel free to skip ahead to the section on [creating a custom image shortcode](#creating-an-11ty-image-shortcode).

To get started, install the 11ty image plugin:

{% include codeHeader.html %}
```bash
yarn add -D @11ty/eleventy-img
```

And import it into any Node script:

{% include codeHeader.html %}
```js
const Image = require('@11ty/eleventy-img');
```

### 11ty Image Example

To use the 11ty image plugin, we need to give it:

- An image source: either a URL to a remote image or a path to a local file.
- Options to customize its behavior.

The 11ty image plugin then returns an array of objects describing all of the images that it generated. For example, if we tell the plugin that we want JPEG and WebP images in three different sizes, then we'll get an array describing six output images, one for each combination of size and format, grouped by format in ascending size.

Here's an example usage taken from the docs:

```js
const Image = require('@11ty/eleventy-img');

(async () => {
  const url = 'https://images.unsplash.com/photo-1608178398319-48f814d0750c';

  const stats = await Image(url, {
    formats: ['jpeg', 'webp'],
    widths: [null, 300, 600],
    dryRun: true,
  });
  console.log(stats);
})();
```

This particular example uses [the `dryRun` flag](https://www.11ty.dev/docs/plugins/image/#dry-run-new-in-image-0.7.0); when this option is enabled, the plugin won't write the generated image files to an output directory—instead, it will operate entirely in memory, returning JSON data describing the images that it _would've_ outputted if we had allowed it to do so. This is useful for exploring the plugin's API without polluting your directory with image files that you don't yet need. Later on, when we use the plugin to generate actual images for our site, we'll want to omit this flag (it's `false` by default) and specify an output directory for the generated images.

Notably, the 11ty image plugin supports both **asynchronous** and **synchronous** usage. The synchronous API returns information about the images before they're actually written to your output directory, allowing your 11ty build to complete sooner while the images continue to be written to your build folder in the background. However, in most cases, you'll actually want to use the asynchronous API so that your 11ty build waits until all of the images have been written to your output directory before it starts up the server.

The code sample above generates images asynchronously and returns an array of objects describing each image. In this example, we requested two formats (JPEG and WebP) and three widths: `300px`, `600px`, and the intrinsic width of the source image (which Eleventy identifies using `null` and reads from the image at build time). Thus, we should see a total of six images in the JSON output, grouped by format. Here's what that might look like:

```json
{
  "jpeg": [
    {
      "format": "jpeg",
      "width": 300,
      "height": 300,
      "url": "/img/6dfd7ac6-300.jpeg",
      "sourceType": "image/jpeg",
      "srcset": "/img/6dfd7ac6-300.jpeg 300w",
      "filename": "6dfd7ac6-300.jpeg",
      "outputPath": "img/6dfd7ac6-300.jpeg",
      "size": 15616
    },
    {
      "format": "jpeg",
      "width": 600,
      "height": 601,
      "url": "/img/6dfd7ac6-600.jpeg",
      "sourceType": "image/jpeg",
      "srcset": "/img/6dfd7ac6-600.jpeg 600w",
      "filename": "6dfd7ac6-600.jpeg",
      "outputPath": "img/6dfd7ac6-600.jpeg",
      "size": 48285
    },
    {
      "format": "jpeg",
      "width": 2406,
      "height": 2411,
      "url": "/img/6dfd7ac6-2406.jpeg",
      "sourceType": "image/jpeg",
      "srcset": "/img/6dfd7ac6-2406.jpeg 2406w",
      "filename": "6dfd7ac6-2406.jpeg",
      "outputPath": "img/6dfd7ac6-2406.jpeg",
      "size": 489900
    }
  ],
  "webp": [
    {
      "format": "webp",
      "width": 300,
      "height": 300,
      "url": "/img/6dfd7ac6-300.webp",
      "sourceType": "image/webp",
      "srcset": "/img/6dfd7ac6-300.webp 300w",
      "filename": "6dfd7ac6-300.webp",
      "outputPath": "img/6dfd7ac6-300.webp",
      "size": 10184
    },
    {
      "format": "webp",
      "width": 600,
      "height": 601,
      "url": "/img/6dfd7ac6-600.webp",
      "sourceType": "image/webp",
      "srcset": "/img/6dfd7ac6-600.webp 600w",
      "filename": "6dfd7ac6-600.webp",
      "outputPath": "img/6dfd7ac6-600.webp",
      "size": 27714
    },
    {
      "format": "webp",
      "width": 2406,
      "height": 2411,
      "url": "/img/6dfd7ac6-2406.webp",
      "sourceType": "image/webp",
      "srcset": "/img/6dfd7ac6-2406.webp 2406w",
      "filename": "6dfd7ac6-2406.webp",
      "outputPath": "img/6dfd7ac6-2406.webp",
      "size": 205726
    }
  ]
}
```

{% aside %}
  Note that the resized images will preserve their [aspect ratio](/blog/css-aspect-ratio/), so we only need to specify one dimension (width).
{% endaside %}

Instead of rendering opinionated markup out of the box, the 11ty image plugin takes a **data-driven approach**, exposing every single piece of information about the images that it processes and generates. It then leaves it up to you to use the output data however you want. As you can imagine, this makes it highly flexible, allowing you to implement any custom image processing pipeline that you need.

In this tutorial, we'll use the 11ty image plugin to:

1. Generate low-quality image placeholders alongside our other image widths,
2. Set these placeholder images to be the `src`/`srcset` in the initial markup,
3. Store the real image sources in temporary `data-` attributes on the image/source tags, and
4. Lazily load our images using just a few lines of JavaScript.

In the next section, we'll set up a custom 11ty image shortcode that we can use like this:

{% raw %}
```liquid
{% image "/assets/images/image.png", "alt text here", ...otherProps %}
```
{% endraw %}

## Creating an 11ty Image Shortcode

Not all 11ty projects are structured in the same way. Some developers prefer to keep all of their configuration logic in the same file, while others prefer to export testable modules for things like collections, filters, and so on. To keep this post as simple as possible, I'll assume that you're defining everything in `.eleventy.js`; feel free to restructure the code however you see fit.

Our first step is to create an image shortcode and register it in the 11ty config:

{% include codeHeader.html file: ".eleventy.js" %}
```js
const Image = require('@11ty/eleventy-img');

const imageShortcode = async (relativeSrc, alt, className, widths, formats, sizes) => {
  // we'll fill this in shortly
};

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('image', imageShortcode);
};
```

{% aside %}
  I'm using Liquid as my template language, and [Liquid does not yet support object parameters for partials](https://github.com/11ty/eleventy/issues/1263). That's why I'm listing all of my parameters out, which can be cumbersome. If you're using Nunjucks, you can change this method signature to accept a single object parameter. Thanks to Nunjucks's support for named shortcode arguments, all named arguments will be aggregated into an object. In the meantime, if you use Liquid, you can [implement a hacky workaround](/blog/passing-object-arguments-to-liquid-shortcodes-in-11ty/).
{% endaside %}

{% aside %}
  If you're using Nunjucks, you may need to use `eleventyConfig.addNunjucksAsyncShortcode` to register your image shortcode. There is one limitation worth noting: [You cannot yet use async shortcodes inside Nunjucks macros](https://github.com/11ty/eleventy/issues/1613).
{% endaside %}

Let's start writing some of the logic for our image shortcode. We'll define fallbacks for some of the optional arguments, read the absolute path to the image on the file system, and pass along all of the relevant options to the image plugin. Note that I won't be covering remote images in this tutorial, so you may need to write some of your own logic to handle those (it should be fairly straightforward).

{% include codeHeader.html file: ".eleventy.js" %}
```js
const Image = require('@11ty/eleventy-img');
const path = require('path');

const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [null, 400, 800, 1280],
  formats = ['jpeg', 'webp'],
  sizes = '100vw'
) => {
  const { dir: imgDir } = path.parse(relativeSrc);
  const fullSrc = path.join('src', relativeSrc);

  const imageMetadata = await Image(fullSrc, {
    widths,
    formats,
    outputDir: path.join('_site', imgDir),
    urlPath: imgDir,
  });
};
```

Let's break down how this works.

### Specifying an Image Source

For convenience, this image shortcode expects to receive a root-relative path to the image rather than the fully qualified path that starts with the source directory. So instead of `src/assets/images/image.png`, we can pass along just `/assets/images/image.png`:

{% raw %}
```liquid
{% image "/assets/images/image.png" ... %}
```
{% endraw %}

However, the 11ty image plugin needs the fully qualified path to the image so it can find it on the file system. Thus, we need to join the source directory name with this relative path:

```js
const fullSrc = path.join('src', relativeSrc);
```

And pass that along to the Image plugin as the first argument:

```js
const imageMetadata = await Image(fullSrc, {});
```

{% aside %}
  To support remote images, you can add a simple regex check to see if `relativeSrc` matches `https?`. If so, you can pass along that string to the image plugin as the source. Otherwise, you can assume that the image resides on the file system.
{% endaside %}

### `outputDir` and `urlPath`

Recall the JSON output from earlier—each image had this shape:

```json
{
  "format": "jpeg",
  "width": 300,
  "height": 300,
  "url": "/img/6dfd7ac6-300.jpeg",
  "sourceType": "image/jpeg",
  "srcset": "/img/6dfd7ac6-300.jpeg 300w",
  "filename": "6dfd7ac6-300.jpeg",
  "outputPath": "img/6dfd7ac6-300.jpeg",
  "size": 15616
}
```

Notice that the image has some path- and URL-related properties, like `outputPath` and `url`. These are constructed from the `outputDir` and `urlPath` options, respectively.

`outputDir` tells Eleventy where to write the generated image files (assuming the `dryRun` flag is disabled). By default, this directory is `./img/`. If the output directory and any intermediate paths do not already exist, 11ty will create them for you. Notice that in the JSON above, the `outputPath` is `img/6dfd7ac6-300.jpeg`. This is assembled from `outputDir` along with a unique hash for the image (`6dfd7ac6`), its width (`300`), and the file extension (`jpeg`).

For this tutorial, I'm setting my output directory to be my site's root output directory plus the relative path to the image:

```js
outputDir: path.join('_site', imgDir)
```

For example, if my image resides under `src/assets/images/image.png`, then `outputDir` will be `_site/assets/images`. So in that case, `outputPath` might look like this:

```json
{
  "outputPath": "_site/assets/images/6dfd7ac6-300.jpeg"
}
```

The `urlPath` option tells 11ty how to assemble the final image URLs in the JSON output; these are the URLs that will get referenced in the image tag's `src` or a source element's `srcset`. By default, that value looks something like this:

```json
{
  "url": "/img/6dfd7ac6-300.jpeg"
}
```

In our example, it makes sense for the URL path to be just the relative path to the source image, starting with a leading slash:

```js
urlPath: imgDir
```

For example, if an image is written to `_site/assets/images/image.png`, then we want its `urlPath` to `/assets/images/` instead of `_site/assets/images/`.

### Image `widths` and `formats`

Both options are arrays; `widths` is an array of image widths to generate, while `formats` is an array of image formats to generate (like `jpeg` or `webp`). Each option also accepts `null`, which 11ty uses as an alias for the original image width (determined at build time). So if we have a source image that's `2406px` wide, then the following `widths` would generate images that are `300`, `600`, and `2406` pixels wide:

```js
widths: [null, 300, 600];
```

Similarly, if the source image is `image.jpeg`, the following `formats` array would generate `jpeg` and `webp` images:

```js
formats: [null, 'webp'];
```

For this tutorial, I'll use the following fallback widths:

```js
[null, 400, 800, 1280];
```

And the following fallback formats:

```js
['jpeg', 'webp'];
```

For your target image widths, pick values that make sense given the max width of your content area or the rendered image. You also typically want to generate 2x and 3x copies of your images for high-density displays. If some of this seems confusing, here are some resources you may find useful:

- [Understanding image optimization feat. 11ty image with Ben Holmes](https://www.youtube.com/watch?v=7n_QLWs1Yrw)
- [Halve the size of images by optimising for high density displays](https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/)

Not all images will need the same widths and formats, and you don't always have to lean on the fallback values. Since the image shortcode accepts arguments for all of these values, you can customize them on a case-by-case basis wherever you use the shortcode.

## Lazily Loading Images in 11ty

Sites like Medium use a modern lazy-loading strategy that involves generating **low-quality image placeholder** (LQIP) images. Here's how it works: Rather than immediately requesting the target image on page load, you instead request a very tiny version of the image that consumes only a few hundred bytes of network bandwidth. You then render this tiny image at its original resolution, scaling it up beyond its intrinsic dimensions. This yields a blurry, pixelated result, which you can smooth out with the CSS `blur` filter. Once the user scrolls to the image, you swap out the placeholder image for the real image with JavaScript and remove the blur filter.

Below is a sample image demonstrating this; refresh the page to see it in action:

{% include img.html src: "floofy-birb.jpg", alt: "A white-and-blue parakeet with puffy feathers and an orange beak.", caption: "Photo by [Hugo WAI](https://unsplash.com/@hugowaiii) on [Unsplash](https://unsplash.com/photos/MEborZA-3Ps)." %}

On a slightly more technical level, here are the necessary steps for implementing this technique:

1. Generate a low-resolution copy for the image that you want to render.
2. Set the `src` and `srcset` attributes for the image to be the LQIP; store the image's real `src` and `srcset` in `data-src` and `data-srcset` attributes.
3. When an image intersects with the viewport, swap in the real image.

Before an image loads in, its markup might look like this:

```html
<picture class="lazy-picture">
  <source
    type="image/webp"
    srcset="/assets/images/image-24.webp"
    data-srcset="/assets/images/image-280.webp 280w, /assets/images/image-400.webp 400w, /assets/images/image-1024.webp 1024w"
    data-sizes="100vw"
  />
  <source
    type="image/jpeg"
    srcset="/assets/images/image-24.jpeg"
    data-srcset="/assets/images/image-280.jpeg 280w, /assets/images/image-400.jpeg 400w, /assets/images/image-1024.jpeg 1024w"
    data-sizes="100vw"
  />
  <img
    src="/assets/images/image-24.jpeg"
    data-src="/assets/images/image-1024.jpeg"
    width="1024"
    height="1024"
    alt=""
    class="lazy-img"
    loading="lazy"
  />
</picture>
```

And after it loads in, it'll look like this:

```html
<picture class="lazy-picture">
  <source
    type="image/webp"
    srcset="/assets/images/image-280.webp 280w, /assets/images/image-400.webp 400w, /assets/images/image-1024.webp 1024w"
    sizes="100vw"
  />
  <source
    type="image/jpeg"
    srcset="/assets/images/image-280.jpeg 280w, /assets/images/image-400.jpeg 400w, /assets/images/image-1024.jpeg 1024w"
    sizes="100vw"
  />
  <img
    src="/assets/images/image-1024.jpeg"
    width="1024"
    height="1024"
    alt=""
    class="lazy-img"
    loading="lazy"
  />
</picture>
```

Let's tackle the steps outlined above.

### 1. Generating Low-Quality Image Placeholders

Since 11ty allows us to specify widths for our images, we can also include a tiny placeholder width. You can use any width you like for this. Smaller widths will produce more pixelated and distorted placeholders, but they'll also use less space. I'll use `24` in this tutorial.

{% include codeHeader.html file: ".eleventy.js" %}
```js
const ImageWidths = {
  ORIGINAL: null,
  PLACEHOLDER: 24,
};

const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [400, 800, 1280],
  formats = ['jpeg', 'webp'],
  sizes = '100vw'
) => {
  const { dir: imgDir } = path.parse(relativeSrc);
  const fullSrc = path.join('src', relativeSrc);

  const imageMetadata = await Image(fullSrc, {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, ...widths],
    formats,
    outputDir: path.join('_site', imgDir),
    urlPath: imgDir,
  });
};
```

The modified version of our shortcode no longer expects to receive a placeholder width or the original image width (`null`) when it's invoked. This makes it easier to use the image shortcode from within a Liquid or Nunjucks template, where we don't have access to values like `null` or the placeholder width. That way, if we want to use different widths somewhere in a Nunjucks or Liquid template, we don't have to worry about passing in `null` or keeping our template in sync with the placeholder value.

### 2. Generating Custom Image Markup

So far, we've looked at how the 11ty image plugin works and how we can leverage its API to generate low-quality image placeholders. The most important step is to return some custom image markup from our shortcode.

As a starting point, we could lean on 11ty to [generate some default markup for us](https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates) via the plugin's built-in `generateHTML` method. Here's a condensed view of what that might look like in action:

```js
const imageShortcode = async (args) => {
  const metadata = await Image(src, props);

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}
```

However, we want to lazily load images by hand. The reason I recommend doing this is because the `loading="lazy"` attribute alone isn't quite as efficient as manual lazy loading. Rather than deferring *all* images that are below the viewport, `loading="lazy"` will actually defer images that are *beyond a certain distance from the viewport*. So images within a certain threshold will still get requested at their full resolution even if they're not yet visible. This creates a fluid user experience because images are loaded well in advance of a user scrolling to them, and it may improve your largest contentful paint score if your LCP element is an image. However, it also comes at the cost of requesting larger images on page load. You can learn more about this tradeoff in my post on [optimizing images for the web](/blog/optimizing-images-for-the-web/#1-native-lazy-loading).

So, instead of using `Image.generateHTML`, we can assemble a custom HTML string:

{% include codeHeader.html file: ".eleventy.js" %}
```js
const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [400, 800, 1280],
  formats = ['jpeg', 'webp'],
  sizes = '100vw'
) => {
  const { dir: imgDir } = path.parse(relativeSrc);
  const fullSrc = path.join('src', relativeSrc);

  const imageMetadata = await Image(fullSrc, {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, ...widths],
    formats,
    outputDir: path.join('_site', imgDir),
    urlPath: imgDir,
  });

  return `<picture></picture>`;
};
```

This doesn't do anything exciting just yet—it just returns an empty picture tag. If you were to invoke this shortcode in one of your templates, you would now see this output result in the markup (but of course, it wouldn't be visible on the page). Here's what we want for our responsive image markup:

- `source` elements for the optimized variants (e.g., WebP).
- `source` elements for the resized base variants (e.g., JPEG).
- `img` element for the base image (original size and format).

It's important to list the optimized formats (like WebP and AVIF) before any of the other formats so that browsers will load the optimized formats first and only then fall back to the base format. Since our image shortcode needs to know what image formats to pass along, there are two ways we can accomplish this:

1. Always assume that the unoptimized format (e.g., JPEG) comes first in the `formats` array.
2. Pass in the unoptimized format (string) and optimized formats (array) separately.

I prefer the second approach since it's more flexible:

```js
const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [400, 800, 1280],
  baseFormat = 'jpeg',
  optimizedFormats = ['webp'],
  sizes = '100vw'
) => {
  // ...
};
```

Now, we'll assemble the `formats` array from these two arguments:

{% include codeHeader.html file: ".eleventy.js" %}
```js
const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [400, 800, 1280],
  formats = ['jpeg', 'webp'],
  sizes = '100vw'
) => {
  const { dir: imgDir } = path.parse(relativeSrc);
  const fullSrc = path.join('src', relativeSrc);

  const imageMetadata = await Image(fullSrc, {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, ...widths],
    formats: [...optimizedFormats, baseFormat],
    outputDir: path.join('_site', imgDir),
    urlPath: imgDir,
  });

  return `<picture></picture>`;
};
```

We'll need one more bit of information before we can define our markup: the placeholder image and largest image corresponding to each format (WebP, JPEG, and whatever other formats you've defined). Here's a `reduce` over the metadata object that'll do that for us:

{% include codeHeader.html file: ".eleventy.js" %}
```js
// Map each unique format (e.g., jpeg, webp) to its smallest and largest images
const formatSizes = Object.entries(imageMetadata).reduce((formatSizes, [format, images]) => {
  if (!formatSizes[format]) {
    const placeholder = images.find((image) => image.width === ImageWidths.PLACEHOLDER);
    // 11ty sorts the sizes in ascending order under the hood
    const largestVariant = images[images.length - 1];

    formatSizes[format] = {
      placeholder,
      largest: largestVariant,
    };
  }
  return formatSizes;
}, {});
```

In our case, this returns an object whose keys are `jpeg` and `webp`; for each key, the values contain two entries: `placeholder` and `largest`, pointing to their respective image sizes. If you add more formats in the future, this will automatically pick them up and identify the smallest and largest images for that variant.

We now have everything that we need to define our image markup:

{% include codeHeader.html file: ".eleventy.js" %}
```js
// Chain class names w/ the classNames package; optional
const picture = `<picture class="${classNames('lazy-picture', className)}">
${Object.values(imageMetadata)
  // Map each format to the source HTML markup
  .map((formatEntries) => {
    // The first entry is representative of all the others since they each have the same shape
    const { format: formatName, sourceType } = formatEntries[0];

    const placeholderSrcset = formatSizes[formatName].placeholder.url;
    const actualSrcset = formatEntries
      // We don't need the placeholder image in the srcset
      .filter((image) => image.width !== ImageWidths.PLACEHOLDER)
      // All non-placeholder images get mapped to their srcset
      .map((image) => image.srcset)
      .join(', ');

    return `<source type="${sourceType}" srcset="${placeholderSrcset}" data-srcset="${actualSrcset}" data-sizes="${sizes}">`;
  })
  .join('\n')}
  <img
    src="${formatSizes[baseFormat].placeholder.url}"
    data-src="${formatSizes[baseFormat].largest.url}"
    width="${width}"
    height="${height}"
    alt="${alt}"
    class="lazy-img"
    loading="lazy">
</picture>`;

return picture;
```

{% aside %}
  You may have noticed that I still set `loading="lazy"` on the image tag. Isn't this redundant if we're using a custom lazy loading solution? Yes and no. But mostly no—it's still contributing to a better page load speed because the browser won't even bother requesting *placeholder* images that are too far from the viewport. In short, it helps reduce the number of network requests on page load.
{% endaside %}

Notice that I'm setting an explicit width and height on the image tag. This is an important optimization that [prevents layout shifts caused by dimensionless images](/blog/setting-width-and-height-on-images/).

You may have also noticed that I'm storing `sizes` in a `data-` attribute. If you don't do this, your browser will attempt to look up a size in the placeholder string upon page load, fail to find it, and complain.

Finally, note that if your image `alt`s contain special characters, you may want to use a utility to escape those strings before passing them to the `alt` attribute. I do this on my site with lodash's `escape` function.

#### Custom File Name Format

If you want to give the placeholder images a special name rather than appending the placeholder size to the file name, you can customize that behavior using the image plugin's `filenameFormat` option. This is a function that takes in some basic information about the image; it's then your job to return a custom string from that function. Here's one that you could use:

```js
// from before, but modified to extract the original image file name
const { name: imgName, dir: imgDir } = path.parse(relativeSrc);

const imageMetadata = await Image(fullSrc, {
  // ...other options omitted for brevity
  // custom file name
  filenameFormat: (hash, _src, width, format) => {
    const suffix = width === ImageWidths.PLACEHOLDER ? 'placeholder' : width;
    return `${imgName}-${hash}-${suffix}.${format}`;
  },
});
```

#### Outdenting the Custom Image Markup

A [common pitfall](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output) in 11ty is to return shortcode strings and attempt to render them as-is in templates. The result can be surprising: If your shortcode returns a string that contains any static indentation (like our markup does here), those indents will get interpreted as Markdown code blocks and render as `<pre>` tags. The solution is simple—install the `outdent` package:

```bash
yarn add -D outdent
```

And use it to wrap the return value:

```js
return outdent`picture`;
```

### 3. Lazily Loading Images with `IntersectionObserver`

As a reminder, we're storing all of the real image sources and srcsets in `data-` attributes. The only images that get requested on page load are the low-quality placeholders images. Now, it's time to write the JavaScript that will swap in the real images once they intersect with the viewport. And as it turns out, this is the easy part.

We'll start by creating a utility function that takes two arguments: an iterable containing all of the DOM nodes that we want to watch for intersections with the viewport, and the callback to fire when those elements intersect with the viewport. Under the hood, this utility will use the [`IntersectionObserver` API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API):

{% include codeHeader.html %}
```js
const lazyLoad = (targets, onIntersection) => {
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersection(entry.target);
        self.unobserve(entry.target);
      }
    });
  });
  targets.forEach((target) => observer.observe(target));
};
```

We can then use it like so:

{% include codeHeader.html file: "src/assets/scripts/index.mjs" %}
```js
const lazyPictures = document.querySelectorAll('.lazy-picture');
lazyLoad(lazyPictures, (pictureElement) => {
  const img = pictureElement.querySelector('img');
  const sources = pictureElement.querySelectorAll('source');

  // Cleanup tasks after the image loads. Important to
  // define this handler before setting src/srcsets.
  img.onload = () => {
    pictureElement.classList.add('loaded');
    img.removeAttribute('data-src');
  };

  // Swap in the media sources
  sources.forEach((source) => {
    source.sizes = source.dataset.sizes;
    source.srcset = source.dataset.srcset;
    source.removeAttribute('data-srcset');
    source.removeAttribute('data-sizes');
  });

  // Swap in the image
  img.src = img.dataset.src;
});
```

Note that it's important to define the image's `onload` handler before swapping in the real `src`. Otherwise, the image may load in before you get a chance to hook up the listener, and the load event will never fire. You may also want to add an `onerror` handler for images that fail to load in.

Now, the only thing left to do is to include the script somewhere in your base layout (or some other layout, if you only want to do this on specific pages). I'm not going to show the steps for how to do this since it depends entirely on how you're managing JavaScript in your project.

## Additional Enhancements

This is all of the core logic that you need for the custom lazy loading solution, but there are a few more enhancements that we can make to improve our image shortcode.

### Styling the Lazily Loaded Images

If you want your images to fade in more smoothly, you can use the CSS `blur` filter:

{% include codeHeader.html file: "image.css" %}
```css
.lazy-img {
  filter: blur(8px);
  transition: filter 0.3s ease-in;
}
.loaded .lazy-img {
  filter: unset;
}
```

By analogy, this is like taking your thumb and smearing a drawing to meld all of the colors and shapes into one blurry blob. That way, the placeholder isn't so pixelated, and it fades in smoothly when the image finishes loading.

### Noscript Tag in Case JavaScript is Disabled

If a user disables JavaScript and visits your site, they'll encounter a blurry placeholder image, which isn't great for accessibility. To get around this, you can include a `noscript` tag in the output returned by the image shortcode. The `noscript` tag would basically include all of the same markup as before (sources and the base `img` tag), but it would reference the real images for `src`/`srcset` rather than the placeholders. You can then include some styles in your `head` for the `noscript` case to hide the lazy images and only show the noscript images:

```html
<head>
  <noscript><style>noscript { display: contents; } .lazy-img { display: none; }</style></noscript>
</head>
```

I'll leave this up to you to implement since it's fairly straightforward; you'll just need to consolidate some of the shared logic for the markup. You can also learn more about this strategy in this post: [Accessible lazy-loading with a noscript fallback](https://eszter.space/noscript-lazy-load/).

## 11ty Image Plugin in Review

We covered lots of different topics in this tutorial, all the way from how the 11ty image plugin works to creating a custom lazy loading solution. Now, we have the best of both worlds: highly responsive and performant images like in most frameworks but without a hefty JavaScript payload (or inflexible markup). We have full control over our lazy-loading solution, allowing us to tweak it in the future if our needs change.

{% include unsplashAttribution.md name: "Robert Linder", username: "rwlinder", photoId: "5YNdnOjlPyE" %}
