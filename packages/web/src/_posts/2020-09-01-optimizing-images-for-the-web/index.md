---
title: Optimizing Images with WebP and Lazy Loading
description: Improve your page load speed by using a modern image format and lazily loading images.
keywords: [optimizing images for the web, optimize images for the web]
categories: [javascript, webperf, images]
commentsId: 56
lastUpdated: 2025-10-17
thumbnail: https://images.unsplash.com/photo-1531845116688-48819b3b68d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

You're a fan of images—who isn't? But those adorable puppy photos, memes, and GIFs don't come without a price. Often, these images range anywhere from a few hundred kB to several megabytes in size. And while that's practically nothing in terms of _storage_ space, it's quite a significant cost in terms of network data usage, especially on slower mobile connections.

The more data that your server needs to return, the longer it will take for your user's browser to receive a response and render the content. If you're not too bothered by this, think again: [Page load speed](https://pagespeed.web.dev/) is one of many factors influencing your search engine ranking.

Two of the best ways to optimize images for the web are by using a modern image format (like WebP) and deferring images until they're actually needed. Combine these strategies, and you'll make Lighthouse happy on even the most image-heavy pages on your website.

{% include "toc.md" %}

## The WebP Image Format

Certain image formats store data more efficiently through compression, sacrificing some image quality in order to save on storage space. WebP is one modern image format that was developed by Google to serve images in a more efficient manner.

{% quote "An image format for the Web, Google", "https://developers.google.com/speed/webp" %}
WebP is a modern image format that provides superior lossless and lossy compression for images on the web.
{% endquote %}

You can learn more about [how WebP works](https://developers.google.com/speed/webp#how_webp_works) if you're curious, but suffice it to say that it provides nearly the same quality of images as PNG and JPEG while requiring 25–34% less space.

Using a modern image format like WebP can:

- Reduce your server's response time because less bandwidth is required to transfer those images.
- Improve your first contentful paint (FCP) and largest contentful paint (LCP) [Lighthouse metrics](https://web.dev/performance-scoring/#lighthouse-6) scores.

Bear in mind that Google uses [mobile-first indexing](https://developers.google.com/search/mobile-sites/mobile-first-indexing) to rank your site, and many mobile plans are throttled at 3G speeds. This means that improving your page load speed can give your users a better mobile experience and potentially improve your ranking on Google.

{% aside %}
Of course, there are [many other Lighthouse metrics](https://web.dev/lighthouse-performance/) that you'll want to consider when optimizing images for the web. Page load speed is just one such factor.
{% endaside %}

All major browsers support WebP, so there's no reason not to use it.

### How to Create WebP Images

Let's say you're convinced. Now how do you actually create WebP images? For that, Google provides a library of [command-line utilities](https://developers.google.com/speed/webp/docs/precompiled) known as `libwebp` that can be used to compress images to WebP. Most images, like PNGs and JPEGs, can be compressed with the `cwebp` executable. You can also use the `gif2webp` utility to convert animated GIFs to animated WebP images.

If you're in the Node ecosystem, you're in luck—there are plenty of open-source packages that can convert images to WebP and many other modern formats. The most popular package is [the `sharp` image processing library](https://github.com/lovell/sharp). But if you're building a site with a meta-framework like Gatsby or Next.js, you can also take advantage of one of the built-in image plugins to do the heavy lifting for you. My personal favorite package is the [Eleventy image plugin](/blog/eleventy-image-plugin/)—which, despite its name, can be used in any server-side Node environment to generate responsively sized images and formats. It uses sharp under the hood, is super fast, and is highly customizable.

Outside the Node ecosystem, there are still libraries that'll do the job for you, like the [jekyll-picture-tag](https://github.com/rbuchberger/jekyll_picture_tag) gem if you use Jekyll. But it does get pretty limited from there.

### Rendering WebP Images

Now, assuming that you've generated your WebP images, the typical way to render them is with the `<picture>`, `<source>`, and `<img>` tags:

```html {data-copyable=true}
<picture>
  <source srcset="/path/to/img.webp" type="image/webp" />
  <img src="/path/to/img.jpeg" alt="Your image's alt" />
</picture>
```

The picture tag accepts any number of `source` tags followed by an `img` tag for the original format and resolution. You list your media sources in the order of preference, with optimized formats first. Moreover, note that you can have as many source tags as needed. For example, if you want to render WebP and AVIF images, you can have one `source` tag for each:

```html
<picture>
  <source srcset="/path/to/img.webp" type="image/webp" />
  <source srcset="/path/to/img.avif" type="image/avif" />
  <img src="/path/to/img.jpeg" alt="" />
</picture>
```

Typically, source tags also feature size descriptors to help your browser pick the right image size based on the current viewport width. You can learn more about this in the MDN docs on [the `srcset` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-srcset).

In short, browsers that support the WebP image format will request and render only the image specified in your `source` tag, while browsers that don't yet support it will fall back to the `img` source.

It's important that you set the `type` attribute of the source element to `image/webp` like we did here so that browsers know what media type you're requesting. You can also view the full list of [supported MIME types for images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Image_types) and other files in the MDN docs.

### Other Image Formats

While WebP isn't the only performant image format on the market, it's the only one that's _widely supported_ by modern browsers at the time of this writing. An emerging image format is AVIF, which is based on the AV1 video coding format developed by the [Alliance for Open Media](https://en.wikipedia.org/wiki/Alliance_for_Open_Media). It was recently [adopted by Netflix](https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4) for its image-intensive user interfaces and apparently offers even better compression than WebP. However, browser support has yet to catch up, at least as of this writing.

## Lazy Loading Images

You've started using the WebP image format—awesome! But is that enough?

Suppose you have a page with around 15–20 images. No matter how much you optimize these images with WebP, you will reach a point of diminishing returns, where the sheer number and size of your images will outweigh the performance gains from having used WebP compression.

So what can you do? One strategy is <dfn>lazy loading</dfn>, where images that are not yet visible in the user's viewport aren't loaded until the user scrolls to them. That way, when the page initially loads, the bandwidth used is capped to just a few kB.

There are two ways you can lazily load images:

1. (Preferred) Using the `loading="lazy"` attribute.
2. (Optional) Swapping low-quality image placeholders with JavaScript.

### 1. Native Lazy Loading

```html
<img src="..." alt="..." loading="lazy" />
```

The `loading="lazy"` attribute offers [native lazy loading](https://web.dev/native-lazy-loading/) for images, and it's supported by all modern browsers. In short, images with the `loading="lazy"` attribute won't trigger an HTTP request until they're [a certain distance from the viewport](https://web.dev/native-lazy-loading/#distance-from-viewport-thresholds). Mathias Bynens created a good demo of [native lazy loading in action](https://mathiasbynens.be/demo/img-loading-lazy) if you want to see how it works.

### 2. Custom Approach

{% aside %}
**Note**: I no longer recommend this approach. Use the HTML attribute.
{% endaside %}

The second option is to use the IntersectionObserver API, which allows you to detect when an element is intersecting with the browser's viewport and to run some code in response. We can leverage this API to implement a custom lazy loading solution, where each image loads an initial placeholder that is then replaced with the real image (temporarily stored in a `data-` attribute) once it intersects with the viewport.

For example, your modified markup might end up looking something like this. Note how the `srcset` and `src` point to placeholder images, while `data-srcset` and `data-src` point to the real WebP and JPEG images, respectively.

```html {data-copyable=true}
<picture class="lazy-picture">
  <source srcset="/path/to/img-placeholder.webp" data-srcset="/path/to/img.webp" type="image/webp" />
  <img src="/path/to/img-placeholder.jpeg" data-src="/path/to/img.jpeg" alt="Your image's alt" loading="lazy" />
</picture>
```

I'm naming these attributes `data-srcset` and `data-src`, respectively, but you can name them anything you want since they're just [custom `data` attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

Next, we'll create an `IntersectionObserver` instance and use it to detect when our images intersect with the browser viewport:

```javascript {data-copyable=true}
const imgObserver = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      lazyLoad(entry.target);
      self.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('.lazy-picture').forEach((picture) => {
  imgObserver.observe(picture);
});
```

And here's how you might implement the `lazyLoad` function:

```javascript {data-copyable=true}
const lazyLoad = (picture) => {
  const img = picture.querySelector('img');
  const sources = picture.querySelectorAll('source');

  sources.forEach((source) => {
    source.srcset = source.dataset.srcset;
    source.removeAttribute('data-srcset');
  });
  img.src = img.dataset.src;
  img.removeAttribute('data-src');
};
```

Now, when users scroll on your site and the viewport intersects with images, the `src` and `srcset` attributes will get replaced with the `data-` attributes. This will initiate new network requests to fetch the higher resolution images, swapping them in.

Note that most lazy-loading tutorials will set the `src` and `srcset` attributes to be empty strings. So they'll show you something like this for the markup:

```html
<img src="" data-src="/path/to/img.jpeg" alt="Your image's alt" />
```

**Don't do this**! If you render an image tag without a `src` attribute or `source` tags without a `srcset` attribute, you'll run into two problems:

- Layout shifts: When the final image is loaded in, it'll shift the text and any content after it down because an image without a `src` attribute has a collapsed box model that doesn't take up space. This could hurt your [cumulative layout shift (CLS) score](https://web.dev/cls/) and isn't a great user experience.
- HTML validation errors: Every `<img>` tag _must_ have a valid `src` path.

Instead, you want to use a temporary placeholder image. This may be a fuzzy placeholder—known as a [low-quality image placeholder](https://cloudinary.com/blog/low_quality_image_placeholders_lqip_explained) (LQIP)—that's the original image but scaled down to a very low resolution. Since there are fewer pixels to work with, the image ends up being blurry, with chunks of color that vaguely resemble the original image's shape. Then, when the viewport intersects with the `<img>` element, you load in the real image with JavaScript. This is precisely what we did in the code above.

As one final enhancement, you'll want to be mindful of situations where users may have disabled JavaScript. You can include some fallback `<noscript>` image markup for those use cases. I'll leave it up to you to learn more about [accessible lazy-loading with a noscript fallback](https://eszter.space/noscript-lazy-load/).

## Final Thoughts

As we saw in this article, optimizing images for the web doesn't require any fancy tooling or complex logic. All you need to do is compress your images in your build process and lazily load them with just a single HTML attribute, or a few lines of JavaScript.

{% include "unsplashAttribution.md" name: "Sarandy Westfall", username: "sarandywestfall_photo", photoId: "qqd8APhaOg4" %}
