---
title: Always Set a Width and Height on Your Images
description: Layout shifts can be annoying and may even hurt your page's ranking, but you can minimize them by setting a width and height on images.
keywords: [setting width and height on images, setting an image's width and height, width and height, layout shifts]
categories: [webperf, images, html]
commentsId: 78
lastUpdated: 2021-08-26
---

If you're not giving your images an explicit width and height, you may be hurting your [cumulative layout shift (CLS)](https://web.dev/cls/) score. Setting a width and height on images is even more important now that Google uses [Core Web Vitals](https://moz.com/blog/core-web-vitals) as a ranking signal—and cumulative layout shift is just one metric that Google looks at when auditing your site. But what do images have to do with layout shifts, and how does giving them a width and height fix this problem?

{% include toc.md %}

## Images Do Not Have an Explicit Width and Height

If you've ever [run your site through Lighthouse](https://web.dev/measure/), then you've probably seen this message:

> *"Set an explicit width and height on image elements to reduce layout shifts and improve CLS."*

{% include img.html src: "lighthouse.png", alt: "A Lighthouse audit for a website. An expanded panel has a summary that reads: 'Image elements do not have explicit width and height.' Below the panel, a more detailed description reads: 'Set an explicit width and height on image elements to reduce layout shifts and improve CLS.'" %}

In short, this means that one or more images on the audited page use this markup:

```html
<img src="path/to/img" alt="Alt text" />
```

However, the best practice is to always set a width and height on your images, like this:

```html
<img src="path/to/img" alt="Alt text" width="1280" height="720" />
```

At this point, you probably have many questions:

- What is CLS and why does Lighthouse flag it as a problem?
- How does setting a width and height fix CLS?
- How do I responsively size my images if I give them a fixed width and height?
- Doing this by hand is tedious. Can I automate the process?

I'll answer all of those questions in this article.

## The Problem: Layout Shifts

The message above mentioned something called "CLS"—what's up with that?

> *"Set an explicit width and height on image elements to reduce layout shifts and improve CLS."*

CLS stands for **cumulative layout shift**, one of many metrics that Lighthouse considers in a typical audit. As its name implies, a layout shift occurs when elements jump around as a page is loading.

The "cumulative" part of CLS means that Lighthouse considers layout shifts in the aggregate—many different things can cause layout shifts, and those are factored into a final CLS score. In this article, we'll focus on a specific source of layout shifts: images that don't have a width and height.

### Dimensionless Images Cause Layout Shifts

When the page loads, your browser already knows the width to reserve for content like images based on your layout's CSS and the device width. But what it *doesn't* know ahead of time is how much *vertical* space it needs to reserve for your images since that can vary from one image to another—there's no good rule of thumb to approximate all possible images.

This means that while your content is loading, your images will initially have a height of zero until they fully load in and the browser adjusts the space they occupy. Thus, elements after the image will initially be positioned above their true location, like the second paragraph in this diagram:

{% include img.html src: "not-loaded.png", alt: "A mock browser window with two paragraphs of text spaced a very short distance apart." %}

Once the image finishes loading in, it will push its siblings down and take its rightful place:

{% include img.html src: "loaded.png", alt: "A mock browser window with two paragraphs of text and a large image positioned in between them." %}

Layout shifts are unpleasant and can make your design look sloppy or poorly optimized. In the following sections, we'll learn how setting a width and height on images can reduce layout shifts.

## Solution: Set a Width and Height on Images

To prevent these kinds of layout shifts, you should give your images an explicit width and height. When you do this, your browser is able to compute the image's aspect ratio under the hood to reserve the right amount of vertical space for the image before it loads in.

That's the short answer, but let's also dig deeper into how this works. I've previously written about [aspect ratio in CSS](/blog/css-aspect-ratio/), but I'll do a quick recap here.

### What Is an Aspect Ratio?

An **aspect ratio** describes the relationship between an element's width and height. Common aspect ratios include `16:9`, `4:3`, and `1:1`. For example, an aspect ratio of `1:1` says that the width and height of an element are always the same (i.e., it's a square), whereas an aspect ratio of `16:9` says that the element has `16` units of width for every `9` units of height.

You may not have considered how aspect ratios impact web performance, but they're *really* important. Aspect ratios allow us to size images properly so that they don't cause layout shifts.

### Reserving Space for Images with `aspect-ratio`

Chromium browsers automatically apply the `aspect-ratio` CSS property to any element that has explicit `width` and `height` HTML attributes. For example, if your image is `1280x750`, then you'd set its width and height to be those values, like this:

```html
<img src="path/to/img.png" alt="" width="1280" height="750" />
```

Your browser uses those two numbers to compute the image's aspect ratio, applying this CSS:

```css
img {
  aspect-ratio: auto 1280 / 750;
}
```

Here's an example where an image is given width and height attributes of `500` and `300`, respectively; Chrome uses these attributes to compute the image's aspect ratio and applies that CSS, which you can inspect in your dev tools:

{% include figure.html src: "default-aspect-ratio.png", alt: "The default aspect ratio for an image is observed to be 500 / 300 in Chrome dev tools.", caption: "Photo credit: [Bill Stephan, Unsplash](https://unsplash.com/photos/og0C_9Mz6RA)" %}

Here's the key point to understand about aspect ratios: If you know only one dimension of an element and its aspect ratio, then you can easily compute the other dimension. If I tell you that the width of an image is `1200px` and its width is always twice its height, then you know that the image must be `600px` tall.

Because your browser already knows the width of the content area, and it knows the image's aspect ratio because you've given it a width and height, it can calculate the precise height that the image will occupy once it finishes loading. Thus, the browser can **reserve that amount of space ahead of time**, preventing a layout shift from occurring.

Using the same diagrams from before, we would have an initial frame with two paragraphs and a collapsed image. The rectangle between the paragraphs represents the space that the browser has reserved for the image that has not yet loaded. It knows precisely how much space to reserve thanks to the image's aspect ratio:

{% include img.html src: "space-reserved.png", alt: "A mock browser window with two paragraphs of text spaced a fixed distance apart. That distance is the height that the image between them will occupy once it has loaded in." %}

Once the image loads in, it simply occupies that placeholder space without shifting any of the surrounding content:

{% include img.html src: "loaded.png", alt: "A mock browser window with two paragraphs of text and a large image in between. The spacing between the two paragraphs is the same as it was before the image loaded in." %}

Lighthouse is happy, and so are your users!

### Responsive Images and Aspect Ratios

Chances are that you're applying some CSS like this on your site to responsively size images with the content area:

```css
img {
  max-width: 100%;
  width: 100%;
  height: auto;
}
```

Naturally, the `width` and `height` you set in your CSS will override the default CSS the browser applies when you set the `width` and `height` attributes:

```html
<img src="path/to/img.png" width="1280" height="750" />
```

So why would you want to do this?

While it may seem like this defeats the purpose of setting the width and height HTML attributes in the first place, it doesn't. Since `aspect-ratio` is a CSS property computed and applied by the browser, you can actually set any responsive width and height on your images via CSS, but **the aspect ratio will still be preserved**.

You can think of setting an image's width and height as **initializing its aspect ratio**, rather than dictating the final width and height of the image. Once an image has loaded in, if you want to apply any CSS to size it differently, you can do so without changing the underlying aspect ratio.

It's a win-win: Your CLS score improves because you're no longer shifting content after images once they load in, but you still get to size your images responsively so that they always assume the width of the content area and size their height automatically based on their aspect ratio.

## Automate Setting Width and Height on Images

If you're not using any frameworks, I have some bad news: You have to set a width and height on your images by hand if you want Lighthouse to stop flagging this issue. This can be tedious if you have lots of images.

However, if you're using frameworks like Gatsby, Next.js, Jekyll, 11ty, and many others, then you're in luck: Many of these frameworks and static site generators offer image plugins that automatically set a width and height for you at build time. As long as you use your framework's image plugin correctly, you should get responsive images that have a width and height set.

## Summary

You need to put in a bit of work to render images properly on the web. While it sounds like a simple matter of just throwing in a valid source and setting an alt attribute for accessibility, you should also set a width and height on your images to minimize layout shifts.

Liked this post? You may also want to check out my other [web performance articles](/categories/webperf/).

## Further Reading

While you're at it, I also recommend giving these articles a read:

- Smashing Magazine: [Setting Height And Width On Images Is Important Again](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)
- Web.dev: [Optimize Cumulative Layout Shift](https://web.dev/optimize-cls/)
- Web.dev: [Displays images with incorrect aspect ratio](https://web.dev/image-aspect-ratio/#check-the-image's-width-and-height-attributes-in-the-html)

{% include unsplashAttribution.md name: "Rolands Zilvinskis", username: "rolzay", photoId: "cPxRBHechRc" %}
