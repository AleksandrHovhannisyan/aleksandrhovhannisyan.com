---
title: Optimizing Images for the Web with WebP and Lazy Loading
description: Images make the web a more beautiful place, but this sometimes comes at a price. Learn how to optimize images for the web using the WebP image format and lazy loading with JavaScript.
keywords: [optimizing images for the web, optimize images for the web]
tags: [dev, javascript, webperf, webp]
comments_id: 56
---

You're a fan of images—who isn't? But those adorable puppy photos, memes, and GIFs don't come without a price. Often, these images range anywhere from a few hundred kB to several megabytes in size. And while that's practically nothing in terms of *storage* space, it's quite a significant cost in terms of network data usage, especially on mobile.

Which... may mean that you'll have to part ways with some of your beloved GIFs.

It's the reality of the web: The more data that your server needs to return, the longer it will take for your user's browser to receive a response and render the content. If you're not too bothered by this, think again: [Page load speed is one of many factors influencing your search engine ranking](https://moz.com/learn/seo/page-speed). Faster pages tend to rank better than sluggish websites.

But let's say you've decided to firmly stand your ground and defend your right to stuff every page with cat photos and GIFs. Or perhaps you're building an image-intensive user interface like GIPHY's. What are your options then?

Two of the best ways to optimize images for the web are by using the WebP image format and lazy loading images with JavaScript. Combine the two, and you'll make Lighthouse happy on even the most image-heavy pages on your website:

{% include picture.html img="lighthouse.png" alt="Lighthouse audit for aleksandrhovhannisyan.com/blog/" %}

{% include toc.md %}

## The WebP Image Format

Certain image formats require less storage space than others, trading some image quality in return for significant performance gains. The most notable and widely supported of these is the **WebP image format**, developed by Google.

Google [describes WebP](https://developers.google.com/speed/webp) in its documentation as follows:

> WebP is a modern image format that provides **superior lossless and lossy compression** for images on the web.

You can learn more about [how WebP works](https://developers.google.com/speed/webp#how_webp_works) if you're curious, but suffice it to say that it provides nearly the same quality of images as PNG and JPEG while requiring **25–34% less space**.

Optimizing images for the web using the WebP format:

- Reduces your server's response time because less bandwidth is required to transfer those images.
- Improves your first contentful paint (FCP) and largest contentful paint (LCP) [Lighthouse metrics](https://web.dev/performance-scoring/#lighthouse-6).
- Respects your user's bandwidth, rather than carelessly consuming several MB of network data.

That last point is especially important since Google uses [mobile-first indexing](https://developers.google.com/search/mobile-sites/mobile-first-indexing) to rank your site, and many mobile plans are throttled at 3G speeds. Translation? Improving your page load speed can give your users a better mobile experience and potentially improve your ranking on Google*.

> *Of course, there are [many other Lighthouse metrics](https://web.dev/lighthouse-performance/) that you'll want to consider when optimizing images for the web. Page load speed is just one such factor.

[Most browsers support WebP](https://caniuse.com/#search=webp), so there's really no reason not to use it:

{% include picture.html img="caniuse.png" alt="The caniuse report for the WebP image format." %}

### How to Create WebP Images

Okay, so let's say you're hooked on the idea. Now how do you actually create WebP images? For that, Google provides a library of [command-line utilities](https://developers.google.com/speed/webp/docs/precompiled) known as `libwebp` that can be used to compress images to WebP.

Most images, like PNGs and JPEGs, can be compressed with the `cwebp` executable. You can also use the `gif2webp` utility to convert animated GIFs to animated WebP images.

> If you want to convert all images in a directory to WebP without doing so by hand, I wrote [a simple Python script](https://github.com/AleksandrHovhannisyan/webp) that'll do that for you.

Then, the typical way to render WebP images is with the `<picture>`, `<source>`, and `<img>` tags:

{% capture code %}<picture>
    <source 
        srcset="/path/to/img.webp" 
        type="image/webp">
    <img 
        src="/path/to/img.png"
        alt="Your image's alt">
</picture>{% endcapture %}
{% include code.html code=code lang="html" %}

Browsers that support the WebP image format will request and render only the `<source>` image, while browsers that don't yet support it will fall back to the `<img>` element.

### Other Optimized Image Formats

While WebP isn't the only performant image format on the market, it's the only one that's *widely supported*. A new image format that's on the web's horizons is AVIF, [developed by Netflix](https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4) for its image-intensive user interfaces. As of this writing, [the only browser supporting it is Chrome 85+](https://caniuse.com/#search=avif).

## Lazy Loading Images with JavaScript

You've started using the WebP image format—awesome! But is that enough?

Suppose you have a page with around 15–20 images. No matter how much you optimize these images with WebP, you will reach a point of **diminishing returns**, where the sheer number and size of your images will outweigh the performance gains from having used WebP compression.

So what can you do? One strategy that's popular on blogging platforms like Medium—and that I use on my own website—is known as **lazy loading**, where images that are not yet visible in the user's viewport aren't loaded until the user scrolls to them. That way, when the page initially loads, the bandwidth used is capped to just a few kB.

There are two ways you can lazily load images in modern browsers:

1. Using the `loading="lazy"` attribute.
2. Using the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

It's important to note that these are NOT mutually exclusive—you can use both.

### 1. Native Lazy Loading

The `loading="lazy"` attribute offers [native lazy loading](https://web.dev/native-lazy-loading/) for images in Chromium browsers and in Firefox. It tells a browser when to start loading images, allowing you to defer network requests until a later point in time.

Here's a demo of [native lazy loading in action](https://mathiasbynens.be/demo/img-loading-lazy) (credit goes to Mathias Bynens):

<video controls="" loop="" muted="">
  <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
</video>

Basically, images with the `loading="lazy"` attribute won't trigger an HTTP request until they're [a certain distance from the viewport](https://web.dev/native-lazy-loading/#distance-from-viewport-thresholds). In Chrome, that distance is `1250px` on a stable connection and `2500px` on a slow 3G connection.

Unfortunately, as of this writing, [browser support for `loading="lazy"` is lacking](https://caniuse.com/#feat=loading-lazy-attr).

### 2. The IntersectionObserver API

The second option is to use the **IntersectionObserver API**, which is [supported in all modern web browsers](https://caniuse.com/#feat=intersectionobserver). Basically, it allows you to detect when an element is intersecting with the browser's viewport and to run some code in response.

First, we'll modify our markup to store the paths to our WebP image and the original image in `data-` attributes. That way, we can look up these paths with JavaScript for any given image:

{% capture code %}<picture class="lazily-loaded-picture">
    <source 
        srcset="/path/to/img-placeholder.webp" 
        data-srcset="/path/to/img.webp"
        type="image/webp"
        class="lazy-source">
    <img 
        src="/path/to/img-placeholder.png"
        data-src="/path/to/img.png"
        alt="Your image's alt"
        loading="lazy"
        class="lazy-img">
</picture>{% endcapture %}
{% include code.html code=code lang="html" %}

> Notice that the `src` and `srcset` attributes now point to placeholder images. We'll discuss how that works in a bit.

I'm naming these attributes `data-srcset` and `data-src`, respectively, but you can name them anything you want since they're just [custom data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

While we're at it, here's some CSS you may find useful:

{% capture code %}.lazy-img {
    max-width: 100%;
    width: 100%;
}{% endcapture %}
{% include code.html code=code lang="css" %}

Next, we'll create an `IntersectionObserver` instance and use it to detect when our images intersect with the browser viewport:

{% capture code %}const imgObserver = new IntersectionObserver(function (entries, self) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      lazyLoad(entry.target);
      self.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.lazy-img').forEach(img => {
  imgObserver.observe(img);
});{% endcapture %}
{% include code.html code=code lang="javascript" %}

And here's how you might implement the `lazyLoad` function:

{% capture code %}function lazyLoad(img) {
  const picture = img.parentElement;
  const source = picture.querySelector('.lazy-source');
  
  source.srcset = source.getAttribute('data-srcset');
  img.src = img.getAttribute('data-src');
}{% endcapture %}
{% include code.html code=code lang="javascript" %}

Super simple! You don't need any libraries to lazily load images in JavaScript.

Here's what that will look like when you inspect the page and start scrolling:

{% include picture.html img="demo.gif" alt="Lazily loading images on my blog page and inspecting the images as they load in using Chrome Dev Tools" %}

As you scroll down the page, the `src` and `srcset` attributes get replaced with the data attributes that we defined. This initiates a new HTTP request to load the images from your server.

Note that most lazy-loading tutorials will set the `src` and `srcset` attributes to be empty strings. So they'll show you something like this for the markup:

```html
<picture class="lazily-loaded-picture">
    <source 
        srcset="" 
        data-srcset="/path/to/img.webp"
        type="image/webp"
        class="lazy-source">
    <img 
        src=""
        data-src="/path/to/img.png"
        alt="Your image's alt"
        class="lazy-img">
</picture>
```

**Don't do this**. If you render `<img>` tags without a `src` attribute or `<source>` tags without a `srcset` attribute, you'll run into two problems:

- **A layout shift**. When the final image is loaded in, it'll shift the text and any content after it down because an image without a `src` attribute has a collapsed box model that doesn't take up space. This could hurt your [cumulative layout shift (CLS) score](https://web.dev/cls/) and isn't a great user experience.
- **HTML validation errors**. Every `<img>` tag *must* have a valid `src` path!

The solution is to use a fuzzy placeholder—the original image but scaled down to some lower resolution, like `32x32px`:

{% include picture.html img="placeholders.png" alt="Blog posts whose thumbnails are fuzzy placeholder images" %}

Since there are fewer pixels to work with, the image ends up being blurry, with chunks of color that vaguely resemble the original image's shape. Then, when the viewport intersects with the `<img>` element, you load in the real image with JavaScript. This is precisely what we did in the code above, with the assumption that you have **four variations for each image**:

- The original (uncompressed) image (e.g., `img.png`).
- The compressed WebP image (e.g., `img.webp`).
- A low-resolution (e.g., 32x32) placeholder for the original image (e.g., `img-placeholder.png`).
- A low-resolution (e.g., 32x32) placeholder for the WebP variant (e.g., `img-placeholder.webp`).

So basically, you'll want to first generate placeholders for all of your images and then compress all of those images (including the placeholders) using WebP.

There are plenty of tools you can use to scale your original image down to `32x32` or any other low resolution. What I ended up doing is [writing another Python script](https://github.com/AleksandrHovhannisyan/thumb) that'll generate `nxn` scaled copies of all images in a given directory.

## Optimizing Images Is All About the Initial Load

Does the approach covered here end up using more data than if you had just loaded in the original image to begin with? Yes (though the placeholders are only a few kB here and there). **But that's the wrong mindset** when optimizing images for the web.

Instead, think about how wasteful it is to load in several megabytes' worth of data *at once*, as soon as the page loads—whether or not those images are currently visible—and to waste a mobile user's precious bandwidth. It's even worse if they only spend a few seconds on your site and navigate away—they gain absolutely nothing from visiting your page and actually lose a few MB of data.

Below is a real example from [my website's blog page](/blog/). Notice that when the page loads, only 60 kB of network data get transferred. Once we scroll all the way down, we can see that the total network data usage eventually exceeds 5 MB. **That's a world of difference**!

{% include picture.html img="network.gif" alt="Inspecting the Network tab of Chrome Dev Tools as my blog's cache is cleared and the page is reloaded" %}

Finally, note that the IntersectionObserver API can be used to lazily load more than just images. For example, you could use it to defer loading comment systems, ads, and even videos.

## Final Thoughts

If you think optimizing images for the web requires some fancy tooling and expertise, think again. All you really need to do is compress your images using the WebP image format (or some other well-supported alternative) and lazily load your images using just a few lines of JavaScript.

I hope you found this tutorial helpful!
