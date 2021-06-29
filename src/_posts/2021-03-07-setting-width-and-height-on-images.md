---
title: Remember to Set a Width and Height on Your Images
description: Layout shifts can be annoying and may even hurt your page's ranking, but you can minimize them by setting a width and height on images.
keywords: [setting width and height on images, setting an image's width and height, width and height, layout shifts]
categories: [dev, webperf, images, html]
commentsId: 78
---

If you're not giving your images an explicit width and height, you may be hurting your [cumulative layout shift (CLS)](https://web.dev/cls/) score. Setting width and height on images is even more important now that Google plans to include [Core Web Vitals](https://moz.com/blog/core-web-vitals) in its ranking algorithm—and CLS is just one metric that Google looks at when auditing your site. But what do images have to do with layout shifts, anyway, and how does giving them a width and height solve this problem?

{% include toc.md %}

## Dimensionless Images Can Cause Layout Shifts

Chances are that you're already using CSS like this on your site to create responsive images that scale with the device width:

```css
img {
  max-width: 100%;
  width: 100%;
  height: auto;
}
```

If so, great! But while this CSS gives you responsive widths and heights, it doesn't ensure that the right amount of vertical space is reserved for your image before it loads in.

If you don't give an image a width and height, it will initially collapse to a height of zero until it has loaded in and the browser is able to calculate the right height for it. If an image is in the viewport when the page loads in, then an initial height of zero means that any content after the image will initially be painted above where it's actually supposed to go, like the second paragraph in this diagram:

{% include img.html src: "not-loaded.png", alt: "A mock browser window with two paragraphs of text spaced a short distance apart." %}

Once the image finishes loading, it will push that content down and take its rightful place:

{% include img.html src: "loaded.png", alt: "A mock browser window with two paragraphs of text and a large image in between." %}

This is known as a **layout shift**. As its name implies, a layout shift is... well, a *shift in layout*. In other words, a layout shift occurs when elements jump around on a page. Common sources of layout shifts include:

- Flash of un-styled text (FOUT) due to `font-display: swap` and a poorly chosen fallback font.
- Images without an explicit width and height. We'll get to why this is a problem in a second.
- Dynamically or conditionally rendered content.

Tools like [Lighthouse](https://web.dev/measure/) mainly measure *unexpected* layout shifts, which are not due to the user interacting with the page but rather factors that are beyond the user's control, like images loading in. You can learn more about [how cumulative layout shift is calculated](https://web.dev/cls/#layout-shift-score) on Web.dev.

Bottom line: Too many layout shifts can create a frustrating user experience, where content noticeably jumps around and users are left confused. Plus, layout shifts are visually unpleasant and can make your design look sloppy or poorly optimized.

In the following sections, we'll specifically look at how images without width and height attributes can cause layout shifts. We'll also discuss why setting a width and height solves that problem.

## Fixing Layout Shifts by Setting Width and Height on Images

To prevent these kinds of layout shifts, we can give our images an explicit width and height. When we do that, certain browsers (like Chrome) define the image's aspect ratio under the hood. This allows the browser to reserve the right amount of vertical space for your image before it loads in.

That's the short answer, at least—but let's also dig deeper into how this really works. Note that I've written about [how to create aspect ratios in CSS](/blog/css-aspect-ratio/) in the past, but I'll do a quick recap here.

### What Is an Aspect Ratio?

An **aspect ratio** describes the relationship between an element's width and height. Common aspect ratios include `16:9`, `4:3`, and `1:1`. For example, an aspect ratio of `1:1` tells us that the width and height of an element are always the same (i.e., it's a square), whereas an aspect ratio of `16:9` tells us that the element has `16` units of width for every `9` units of height.

You may not have considered how aspect ratios impact web performance, but they're *really* important, especially now that Core Web Vitals is part of Google's ranking algorithm. In short, aspect ratios allow us to size our images properly so that they don't cause layout shifts once they finish loading. Let's take a closer look at how this works.

### A Glimpse Into the Future of CSS: `aspect-ratio`

As of Version 88, Chrome automatically applies a new CSS property—aptly named `aspect-ratio`—to any element that has `width` and `height` attributes. For example, if your image is `1280x750`, then you'd set its width and height to be those values via HTML attributes:

```html
<img src="path/to/img.png" alt="" width="1280" height="750" />
```

And Chrome would use those two numbers to compute the image's aspect ratio, applying this CSS:

```css
img {
  aspect-ratio: auto 1280 / 750;
}
```

Here's an example from my article that I linked to earlier, where an image is given width and height attributes of `500` and `300`, respectively; Chrome uses these attributes to compute the image's aspect ratio and applies that CSS, which you can inspect in your dev tools:

{% include figure.html src: "default-aspect-ratio.png", alt: "The default aspect ratio for an image is observed to be 500 / 300 in Chrome dev tools.", caption: "Photo credit: [Bill Stephan, Unsplash](https://unsplash.com/photos/og0C_9Mz6RA)" %}

Cool! But... How does setting an image's aspect ratio prevent layout shifts? Plus, what if the image won't actually load in at that particular width and height? Won't this cause overflow or image distortion issues? Great questions! I'll answer both of these below.

### Reserving Vertical Space for Images with Aspect Ratios

On page load, your browser already knows the width to reserve for content based on your layout's CSS and the device width. But what it *doesn't* know ahead of time is how much *vertical* space it needs to reserve for your images since that can vary from one image to another.

This means that in the brief moment of loading in your content, if there are any images within the viewport, their initial height will be zero until the browser renders them. As previously mentioned, this can cause layout shifts, pushing content after an image down once it finishes loading in.

Aspect ratios solve this problem by reserving the right amount of height ahead of time for your content. Because an aspect ratio describes the relationship between an element's width and height, and the browser already knows the width of the content area, this means it can calculate the precise height that the image will occupy once it finishes loading. Thus, the browser can **reserve that amount of space ahead of time**, preventing a layout shift from occurring!

Using the same diagrams as before, we would have an initial frame with two paragraphs and a collapsed image. The colored rectangle between the paragraphs represents the space that the browser has reserved for the image that has not yet loaded. It knows precisely how much space to reserve thanks to the image's aspect ratio:

{% include img.html src: "space-reserved.png", alt: "A mock browser window with two paragraphs of text spaced a fixed distance apart. That distance is the height that the image between them will occupy once it has loaded in." %}

Once the image loads in, it simply occupies that placeholder space without shifting any of the surrounding content:

{% include img.html src: "loaded.png", alt: "A mock browser window with two paragraphs of text and a large image in between. The spacing between the two paragraphs is the same as it was before the image loaded in." %}

Lighthouse is happy, and so are your users!

### Responsive Images with Fixed Aspect Ratios

Now, let's address the other question: What if the final image isn't going to actually render in at this width and height, even if those are its default dimensions? This is a very common question. And the good news is that you can still apply this CSS to size your images responsively:

```css
img {
  max-width: 100%;
  width: 100%; /* scale with content width */
  height: auto; /* compute a height that preserves the aspect ratio */
}
```

Naturally, the `width` and `height` here will override the default CSS applied by the `width` and `height` attributes that we set in our HTML:

```html
<img src="path/to/img.png" alt="" width="1280" height="750" />
```

So why would we want to do this? Doesn't this defeat the purpose of using HTML attributes in the first place? Nope!

Since `aspect-ratio` is a CSS property computed and applied by the browser itself (only Chrome in this case), this means you can now set *any responsive width and height* on your images via CSS, and the aspect ratio will still be preserved. The aspect ratio will ensure that the right amount of height is always reserved for your images regardless of their final, responsive widths.

In other words, you can think of setting an image's width and height as **initializing its aspect ratio** for the purposes of reserving the right amount of space so that it loads in cleanly. Once an image has loaded in, if you want to apply any CSS to size it differently, you can do so without changing its aspect ratio.

It's a win-win: Your CLS score improves because you're no longer shifting content after images once they load in, but you still get to size your images responsively so that they always assume the width of the content area and size their height automatically based on their aspect ratio.

That's why the `aspect-ratio` property is so exciting—once more browsers support it, it'll allow us to easily create aspect ratios without resorting to hacks.
## Fallback: Aspect Ratio Containers with Percentage Padding

Chrome supports this new CSS property, but what about others browsers? Unfortunately, as of this writing, [they do not yet support `aspect-ratio`](https://caniuse.com/mdn-css_properties_aspect-ratio). This means that if you set an explicit width and height on your images, browsers other than Chrome won't automatically calculate an aspect ratio for you. Thus, you could still see some layout shifts as your images load in.

Fortunately, we can use a fallback for browsers that don't yet support `aspect-ratio`: [percentage padding and **aspect ratio containers**](/blog/css-aspect-ratio/#approach-2-aspect-ratios-with-percentage-padding). To create these aspect ratio containers, we need an outer div to wrap the image:

```html
<div class="aspect-ratio-container">
  <img src="path/to/img.png" alt="" width="1280" height="750" />
</div>
```

And the following CSS, which uses vertical padding to create an aspect ratio:

```css
.aspect-ratio-container {
  position: relative;
  height: 0;
  padding-bottom: 58.6%;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

This works because percentage padding is relative to the width of an element's nearest block-level parent. If the element itself takes up 100% of its parent's width, then we've defined its height as a percentage of its width, and that's the very definition of aspect ratio.

Browsers like Firefox, Safari, and any others that don't yet support `aspect-ratio` will fall back to this aspect ratio container. Either way, regardless of which approach you take, the right amount of space will get reserved for your images, ensuring that they don't shift any content as they load in.

You can verify this by rendering one of the examples above locally and deleting the nested `<img>` tag via devtools. You'll notice that the parent aspect ratio container won't collapse its width and height—it will remain sized correctly, just as if you hadn't deleted the image.

## Summary

You need to put in a bit of work to render images properly on the web. While it sounds like a simple matter of just throwing in a valid source and setting an alt attribute for accessibility, you should also set a width and height—and maybe even create an aspect ratio container—so that your images don't cause layout shifts once they finish loading in.

Liked this post? You may also want to check out my tutorial on [optimizing images for the web](/blog/optimizing-images-for-the-web/).

## Further Reading

While you're at it, I also recommend giving these articles a read:

- Smashing Magazine: [Setting Height And Width On Images Is Important Again](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)
- Web.dev: [Optimize Cumulative Layout Shift](https://web.dev/optimize-cls/)
- Web.dev: [Displays images with incorrect aspect ratio](https://web.dev/image-aspect-ratio/#check-the-image's-width-and-height-attributes-in-the-html)

{% include unsplashAttribution.md name: "Rolands Zilvinskis", username: "rolzay", photoId: "cPxRBHechRc" %}
