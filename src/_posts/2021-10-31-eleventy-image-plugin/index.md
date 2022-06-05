---
title: Optimizing Images with the 11ty Image Plugin
description: While imagery can enrich your content, it can also slow down your site if it's not used responsibly. Learn how to use the official 11ty image plugin to create optimized and responsive images.
keywords: [11ty image, 11ty image plugin]
categories: [webperf, 11ty, images, node]
commentsId: 118
lastUpdated: 2022-05-17
isFeatured: true
redirectFrom:
  - /blog/eleventy-image-lazy-loading/
thumbnail:
  url: https://images.unsplash.com/photo-1631739408670-38319df9c5c1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

{% aside %}
  **Update {% include date.html date: 2022-05-16 %}**: Originally, this article showed how to lazily load images using low-quality image placeholders (LQIPs) and the `IntersectionObserver` API. However, I no longer endorse that approach because it's more difficult to maintain. Instead, I recommend relying on native lazy loading with the `loading` and `decoding` attributes. If you'd like to, you can read the original article [on my site's GitHub repo](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/blob/edbfd9295b64e9f747ae48a4edf9942fe0e3e48e/src/_posts/2021-10-31-eleventy-image-lazy-loading/index.md).
{% endaside %}

Images are a core part of the web, but they don't come for free. While imagery can enrich your content and create a more engaging user experience, it can also slow down your site and create a poor user experience if it's not used responsibly. Now that Google uses page load speed as a ranking factor, developers need to put in more effort to create responsive and optimized images and deliver the best possible experience to their users.

Unfortunately, this is all easier said than done. Optimizing images requires:

1. Using next-generation image formats like WebP or AVIF, with fallbacks.
2. Serving the right image sizes based on the device width ([resolution switching](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)).
3. Deferring off-screen images (a strategy known as lazy loading).

If all of that seems like a lot of work, that's because it is!

You _could_ optimize your images by hand with CLI tools like [ImageMagick](https://imagemagick.org/index.php), but this is difficult to maintain for projects that need to scale. For example, if you ever want to generate new image formats in the future, you're going to need to go through and update all of your images by hand. Instead, it's better to store a single source image in your repository and generate the output formats and sizes at build time.

For this reason, many modern frameworks like Gatsby and Next.js offer image plugins that can automatically do all of this work for you out of the box, with minimal configuration. However, while these plugins do the heavy lifting of optimizing images at build time, they also typically render inflexible markup that can only be customized in limited ways through props. This can make it difficult to tailor those image plugins to meet your specific needs. They also typically lead to slower build times, particularly in Gatsby.

Fortunately, Eleventy offers a better alternative: the [official eleventy-image plugin](https://www.11ty.dev/docs/plugins/image/), which can be used to resize and transform both local and remote images. Since the plugin is written entirely as a standalone Node package powered by Sharp—with no 11ty-specific dependencies or logic—you can actually [use it in any framework](https://bholmes.dev/blog/picture-perfect-image-optimization/). This makes it a highly flexible tool for generating optimized, responsive images like the one below:

{% include figure.html src: "https://images.unsplash.com/photo-1639800559828-4f34bac7bcee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80", alt: "A possum clings sideways to a tree as it attempts to descend it from top to bottom.", caption: "Photo by [Jennifer Uppendahl](https://unsplash.com/@j_a_uppendahl) on Unsplash." %}

But where this plugin _really_ shines is in an 11ty project, where you can create an image shortcode to return custom image markup, complete with responsively sized images and modern image formats. In this in-depth tutorial, I'll show you how to optimize images with the official 11ty image plugin.

{% include toc.md %}

## An Introduction to the Eleventy Image Plugin

Before we dive deep into the code specific to this tutorial, I want us to take some time to explore the 11ty image plugin and familiarize ourselves with its API. There are lots of good resources out there on this topic, but a great place to start is the [11ty image plugin documentation](https://www.11ty.dev/docs/plugins/image/). I'll also cover everything you need to know here. If you're already familiar with the plugin, feel free to skip ahead to the section on [creating a custom image shortcode](#creating-an-11ty-image-shortcode).

To get started, install the 11ty image plugin:

```bash {data-copyable=true}
yarn add -D @11ty/eleventy-img
```

And import it into any Node script:

```js {data-copyable=true}
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
    formats: ['webp', 'jpeg'],
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

Instead of rendering opinionated markup out of the box, the 11ty image plugin takes a **data-driven approach**, exposing every single piece of information about the images that it processes and generates. It then leaves it up to you to use the output data however you want. As you can imagine, this makes it highly flexible, allowing you to even use it as a standalone Node script in your build pipeline.

For our purposes, we'll be using this plugin to not only generate the optimized images but also return some image markup for us that we can then use in our templates. In the next section, we'll set up a custom 11ty image shortcode that we can use like this:

{% raw %}
```liquid
{% image "src/assets/images/image.png", "alt text here", ...otherProps %}
```
{% endraw %}

{% aside %}
New to 11ty? You can learn more about [template shortcodes](https://www.11ty.dev/docs/shortcodes/) in the official docs.
{% endaside %}

## Creating an 11ty Image Shortcode

Not all 11ty projects are structured in the same way. Some developers prefer to keep all of their configuration logic in the same file, while others prefer to export testable modules for things like collections, filters, and so on. To keep this post as simple as possible, I'll assume that you're defining everything in `.eleventy.js`; feel free to restructure the code however you see fit.

Our first step is to create an image shortcode and register it in the 11ty config:

```js {data-file=".eleventy.js" data-copyable=true}
const Image = require('@11ty/eleventy-img');

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  // we'll fill this in shortly
};

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('image', imageShortcode);
};
```

{% aside %}
  I'm using Liquid as my template language, and [Liquid does not yet support object parameters for partials](https://github.com/11ty/eleventy/issues/1263). Hence why I'm using positional arguments, although this can be cumbersome. If you're using Nunjucks, you can change this method signature to accept a single object parameter. Thanks to Nunjucks's support for named shortcode arguments, all named arguments will be aggregated into an object. In the meantime, if you use Liquid, you can [implement a workaround](/blog/passing-object-arguments-to-liquid-shortcodes-in-11ty/) by creating an intermediate include that accepts named arguments, assembles a JSON string, parses the string to a JavaScript object, and passes that along to the shortcode under the hood. That's a bit involved for this simple tutorial and assumes too much about the template language you are using, so I'll leave that up to you.
{% endaside %}

{% aside %}
  If you use Nunjucks, may need to register your shortcode with `eleventyConfig.addNunjucksAsyncShortcode`. There's one gotcha, though: [You cannot use async shortcodes inside Nunjucks macros](https://github.com/11ty/eleventy/issues/1613).
{% endaside %}

Let's start writing some of the logic for our image shortcode. We'll start by passing along all the necessary arguments to the image plugin and awaiting the result:

```js {data-file=".eleventy.js" data-copyable=true}
const Image = require('@11ty/eleventy-img');

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: '_site/assets/images',
    urlPath: '/assets/images',
  });
};
```

Confused? Let's take a closer look at what these options do.

### 11ty Image Plugin Options

#### Image `widths` and `formats`

`widths` is an array of image widths to generate, while `formats` is an array of image formats to generate (like `'jpeg'` or `'webp'`). Each option also accepts `null`, which acts as a placeholder for the original image width/format (determined at build time). For example, if we pass in a source image that's `2400px` wide, then the following `widths` would generate images that are `300`, `600`, and `2400` pixels wide:

```js
widths: [300, 600, null];
```

Similarly, if the source image is `image.jpeg`, the following `formats` array would generate `jpeg` and `webp` images:

```js
formats: ['webp', null];
```

For this tutorial, I'll use the following fallback widths:

```js
[400, 800, 1280]
```

And the following fallback formats:

```js
['webp', 'jpeg']
```

And I'm spreading both in alongside `null`, the original width/format:

```js
widths: [...widths, null],
formats: [...formats, null]
```

{% aside %}
Whereas the `widths` array is automatically sorted by the plugin, the formats array is not. Be sure to always list your optimized formats first so that their source tags appear first in the rendered markup.
{% endaside %}

That way, when I use the shortcode, I don't have to worry about passing along `null` (which isn't possible in Liquid).

For your target image widths, pick values that make sense given the max width of your content area or the rendered image. You also typically want to generate 2x and 3x copies of your images for high-density displays. If some of this seems confusing, here are some resources you may find useful:

- [Understanding image optimization feat. 11ty image with Ben Holmes](https://www.youtube.com/watch?v=7n_QLWs1Yrw)
- [Halve the size of images by optimising for high density displays](https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/)

Not all images will need the same widths and formats, and you don't always have to lean on the fallback values. Since the image shortcode accepts arguments for all of these values, you can customize them on a case-by-case basis wherever you use the shortcode.

#### `outputDir` and `urlPath`

Recall that each output image had this shape in the JSON returned by the plugin:

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

Notice that each image has a `url`, a root-relative path to the output image. This is constructed from the `outputDir` and `urlPath` options:

```js
const imageMetadata = await Image(src, {
  outputDir: '_site/assets/images',
  urlPath: '/assets/images',
});
```

`outputDir` tells Eleventy where to write the generated image files (assuming the `dryRun` flag is disabled). By default, this directory is `./img/`, meaning that unless you override the default, 11ty will generate an `img` folder at the root of your project directory and dump your images in there. If the output directory and any intermediate paths do not already exist, 11ty will create them for you. Notice that in the JSON above, the `outputPath` is `img/6dfd7ac6-300.jpeg`. This consists of:

- `outputDir` (`img`),
- A unique hash for the image (`6dfd7ac6`),
- The image's width (`300`), and
- The file extension (`jpeg`).

For this tutorial, I'm setting my output directory to be `_site/assets/images` since my [11ty output directory](https://www.11ty.dev/docs/config/#output-directory) is `_site`:

```js
outputDir: '_site/assets/images'
```

So in this case, `outputPath` will look something like this in the returned JSON:

```json
{
  "outputPath": "_site/assets/images/6dfd7ac6-300.jpeg"
}
```

Similarly, the `urlPath` option tells 11ty how to assemble the final image URLs in the JSON output. These are the URLs that get referenced in your image tag's `src` or a source element's `srcset`. By default, that value looks something like this:

```json
{
  "url": "/assets/images/6dfd7ac6-300.jpeg"
}
```

In our example, we need the URL path to be the root-relative path to the output image, starting with a leading slash and excluding the name of our output directory:

```js
urlPath: '/assets/images'
```

For example, if an image is written to `_site/assets/images/image.png`, then we want its `urlPath` to be `/assets/images/` instead of the full output path.

##### Image Filename Hash

You may be worried about writing all your images to the same directory, but fear not!

In the examples above, we saw that the output image file names have hashes in them:

```json
{
  "url": "/img/6dfd7ac6-300.jpeg"
}
```

By default, the hashing algorithm uses an alphabet of eight alphanumeric characters (`a-z`, `A-Z`, and `0-9`), giving us a total of `36^8` (2 trillion) possible file names. Since we're outputting all our images to the same directory, this means that it's highly improbable that we'll ever get a naming collision. This is more than sufficient for most sites. But if for some reason you're concerned that it may not be enough, you can increase the hash length using [the `hashLength` option](https://www.11ty.dev/docs/plugins/image/#change-the-default-hash-length):


```js
await Image(src, {
  hashLength: 10
});
```

Just don't make it too short! Otherwise, you'll increase the likelihood of two images getting the same hash.

##### Custom Image Filename

If you don't like using hashed image file names, or if you want to change how the file names are formatted, the image plugin accepts a [`filenameFormat` option](https://www.11ty.dev/docs/plugins/image/#custom-filenames), which is a function that takes all the relevant parameters for an image and returns whatever custom file name you want. This is what the default does:

```js
new Image(src, {
  filenameFormat: function (hash, src, width, format, options) {
    return `${hash}-${width}.${format}`;
  }
})
```

For example, you could return just the source image name along with its width using Node.js's `path` module:

```js
new Image(src, {
  filenameFormat: function (hash, src, width, format, options) {
    const { name } = path.parse(src);
    return `${name}-${width}.${format}`;
  }
})
```

Just note that if you decide to take this route, you may also need to change your `outputDir` and `urlPath` to avoid naming conflicts since you'd be writing unhashed image files to a single directory.

## Returning Optimized Image Markup

When all is said and done, we want our image shortcode to return markup that follows best practices for image optimization. This includes:

- Using the `picture` tag along with `source` elements listing the formats and sizes.
- Listing the source tags in order of preference, with optimized formats first.
- Giving each `source` element a `type`, `srcset`, and `sizes` attribute.
- Rendering an `<img>` tag with all relevant attributes (like `width` and `height` to [prevent layout shifts](/blog/setting-width-and-height-on-images/) or `loading="lazy"` for native lazy loading).

So the final output might look something like this:

```html
<picture>
  <source
    type="image/webp"
    srcset="/assets/images/6dfd7ac6-400.webp 400w, /assets/images/6dfd7ac6-800.webp 800w, /assets/images/6dfd7ac6-1200.webp 1200w"
    sizes="100vw"
  />
  <source
    type="image/jpeg"
    srcset="/assets/images/6dfd7ac6-400.jpeg 400w, /assets/images/6dfd7ac6-800.jpeg 800w, /assets/images/image-1200.jpeg 1200w"
    sizes="100vw"
  />
  <img
    src="/assets/images/6dfd7ac6-1200.jpeg"
    width="1200"
    height="600"
    alt=""
    loading="lazy"
  />
</picture>
```

Thankfully, most of the hard work is already cut out for us because the 11ty image plugin supplies all of this metadata for every single image that it generates, so we don't have to do any path manipulation or image processing ourselves. Even better, the plugin already has a built-in method that can generate some image markup for us out of the box.

### Default Markup with `Image.generateHTML`

`Image.generateHTML` accepts two arguments: The array of the image data returned by the plugin (which we already have), and an object containing our image tag's HTML attributes. Here's the updated code:

```js {data-file=".eleventy.js" data-copyable=true}
const Image = require('@11ty/eleventy-img');
const path = require('path');

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: '_site/assets/images',
    urlPath: '/assets/images',
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
};
```

### Custom Image Markup

`Image.generateHTML` works great for most use cases, so you could stop at this point and call it a day. However, I prefer to generate the markup by hand so I have greater control over it. For example, you'll note that our `imageShortcode` accepts a `className` argument, but the 11ty image plugin doesn't currently provide a way for us to apply a class name to the outer `picture` tag (or even the `img` tag), even with the `attributes` argument.

Thankfully, it's not too difficult to generate the markup ourselves.

#### 1. Creating a `stringifyAttributes` Utility

To make our lives a little easier, we'll create a custom utility function that can take an object of attributes and stringify them for us:

```js {data-copyable=true}
/** Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};
```

Later, we'll use this to interpolate attribute objects in template literal strings, like this:

```js
// attribute1="value1" attribute2="value2"
const attributes = stringifyAttributes({
  attribute1: 'value1',
  attribute2: 'value2',
});
```

{% aside %}
Ideally, we would've just used sindresorhus's [`stringify-attributes` package](https://github.com/sindresorhus/stringify-attributes). Unfortunately, that package is ESM only, whereas 11ty does not yet support ESM.
{% endaside %}

#### 2. Generating `<source>` Tags

Per the example output from earlier, we'll need to generate one `<source>` tag for each image format. Sounds like the job for some array methods! As a reminder, `imageMetadata` looks something like this:

```json
{
  "webp": [],
  "jpeg": [],
  "etc": []
}
```

Where each array contains objects describing the images that fall under that format.

We don't really care about the keys here—we just want to loop over the arrays of images in the correct order (optimized formats followed by our other formats since browsers load the first valid source format they encounter). To do this, we'll use `Object.values`, mapping each array of images to its corresponding `<source>` string:

```js {data-file=".eleventy.js" data-copyable=true}
const sourceHtmlString = Object.values(imageMetadata)
  // Map each format to the source HTML markup
  .map((images) => {
    // The first image's sourceType is the same as those of all other images
    // belonging to this format (e.g., image/webp).
    const { sourceType } = images[0];

    // Use our util from earlier to make our lives easier
    const sourceAttributes = stringifyAttributes({
      type: sourceType,
      // srcset needs to be a comma-separated attribute
      srcset: images.map((image) => image.srcset).join(', '),
      sizes,
    });

    // Return one <source> per format
    return `<source ${sourceAttributes}>`;
  })
  .join('\n');
```

#### 3. Generating an `<img>` Tag

For our `img` tag's `src` attribute, we want to use the largest unoptimized image format (e.g., `jpeg`). Since the 11ty image plugin [sorts images by width in ascending order](https://github.com/11ty/eleventy-img/blob/5baf31fda00e0d25df7d7d537141990f82d5165d/img.js#L200), this is just the last image in that format's array. For example, to get the largest `jpeg` image, we'd look up the last image in the `imageMetadata.jpeg` array. We'll get that image, stringify the image tag's attributes, and assign the resulting HTML string to a variable so we can interpolate it later:

```js {data-file=".eleventy.js" data-copyable=true}
const getLargestImage = (format) => {
  const images = imageMetadata[format];
  return images[images.length - 1];
}

const largestUnoptimizedImg = getLargestImage(formats[0]);

const imgAttributes = stringifyAttributes({
  src: largestUnoptimizedImg.url,
  width: largestUnoptimizedImg.width,
  height: largestUnoptimizedImg.height,
  alt,
  loading: 'lazy',
  decoding: 'async',
});

const imgHtmlString = `<img ${imgAttributes}>`;
```

If you'd like to, you can learn more about the optimization-related attributes in the following MDN articles:

- [HTMLImageElement.loading](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading)
- [HTMLImageElement.decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)

#### 4. Returning a `<picture>` Tag

Finally, we'll interpolate our `source` and `img` strings in a `picture` tag:

```js {data-file=".eleventy.js" data-copyable=true}
const pictureAttributes = stringifyAttributes({
  class: className,
});

const picture = `<picture ${pictureAttributes}>
  ${sourceHtmlString}
  ${imgHtmlString}
</picture>`;

return picture;
```

Don't forget the return statement! Otherwise, your shortcode won't output anything.

##### Outdenting the Custom Image Markup

A [common pitfall](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output) in 11ty is to return shortcode strings and attempt to render them as-is in templates. The result can be surprising: If your shortcode returns a string that contains any static indentation (like our code does), those indents will get interpreted as Markdown code blocks and render as `<pre>` tags, breaking your page.

To fix this, first install the `outdent` package:

```bash {data-copyable=true}
yarn add -D outdent
```

Then, use it to remove static indentation from the returned string:

```js {data-copyable=true}
const outdent = require('outdent');

// ...

return outdent`${picture}`;
```

## The Final Code

That was a lot to get through, but it was worth it—we're done!

Here's the final code from this tutorial:

```js {data-file=".eleventy.js" data-copyable=true}
const Image = require('@11ty/eleventy-img');

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: '_site/assets/images',
    urlPath: '/assets/images',
  });

  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(', '),
        sizes,
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  }

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    alt,
    loading: 'lazy',
    decoding: 'async',
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return outdent`${picture}`;
};
```

You can modify this markup however you want. For example, on my site, I like to link some of my images so users can click them and view the enlarged asset. All of the information needed for this is already provided by the 11ty image plugin, so it's just a matter of writing some code and modifying the returned markup to include anchor tags. That's beyond the scope of this tutorial, so I'll leave it up to you to implement.

## The 11ty Image Plugin in Review

We covered lots of different topics in this tutorial, all the way from how the 11ty image plugin works to generating custom image markup with a shortcode. To summarize, we provide the image plugin with the source image path or URL (for remote images) along with some options, and it returns metadata describing all of the generated images. Then, we can either return the default HTML string using the plugin's built-in method or just do it by hand. Either way, we get responsive, optimized, and lazily loaded images, all with zero client-side JavaScript!

{% include unsplashAttribution.md name: "Robert Linder", username: "rwlinder", photoId: "5YNdnOjlPyE" %}
