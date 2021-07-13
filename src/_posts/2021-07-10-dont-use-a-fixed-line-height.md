---
title: Don't Use a Fixed Line Height
description: In typography, the ideal line height for text depends on a variety of factors, including font size, line length, and font family.
keywords: [line height, ideal line height, typography]
categories: [css, sass, typography, a11y]
thumbnail: thumbnail.jpg
---

Typography is an important element of any design, both in print and on the web. But when typographical decisions are executed poorly, they can harm the readability of your content, leave a bad impression of your brand, and create a poor user experience.

One of the hardest things to get right with typography is picking the ideal line height for your text. Often, developers set a fixed line height on their body text and reduce it for headings:

```css
body {
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3;
}
```

While this may seem sufficient, it's not a good practice from a design and accessibility perspective. Let's understand why and explore a solution with custom properties and Sass mixins.

{% include toc.md %}

## You Need More Line Heights

As mentioned above, it's not enough to just set one line height for body text and another for all headings. In practice, you'll need to use more line heights, at different font sizes, to achieve optimal readability.

### 1. Ideal Line Height Depends on the Font Size

There's an inverse relationship between the line height and font size of a paragraph of text. This means that larger font sizes need smaller line heights, while smaller font sizes need to be paired with larger line heights.

Intuitively, this should make sense. Larger font sizes exaggerate the height of text, meaning your eyes have to move a greater distance vertically to go from one line to another. If you don't reduce the line height of the text, your lines will be unnaturally spaced apart and difficult to read.

Similarly, if you're using smaller font sizes, you need to increase the line height slightly. If you don't, the lines of text will be too close to each other.

### 2. Ideal Line Height Depends on the Line Length

In a similar vein, line height also depends on the *length* of a line of text; this is covered in detail in a Smashing Magazine article on [balancing line length and font size in responsive web design](https://www.smashingmagazine.com/2014/09/balancing-line-length-font-size-responsive-web-design/). As a rule of thumb, shorter lines of text need shorter line heights. Conversely, wider text needs more line height. Striking the right balance between line length and line height makes it easier for readers to scan your text and distinguish paragraphs from sentences. This is why designers typically recommend that you limit the width of your copy to somewhere between 45 and 75 characters. Anything wider than this risks hurting the readability of your text. And the wider your text is, the more line height you're going to need, which can start to look unnatural.

### 3. Ideal Line Height Depends on the Font Family

There's another reason why you can't always set a single line height on your copy: The ideal line height depends on your chosen font family. There are a few font properties you need to consider before you can come up with the right line height:

- The font's **x-height**, or the height of the lowercase letter `x`.
- The **font ascent**, or the distance from the top of the tallest letters to the baseline.
- The **font descent**, or the distance from the lowest hanging letters to the baseline.

These related properties dictate the ideal line height for text. As a general rule of thumb, fonts with a larger x-height or font ascent/descent need more line height to give your sentences more breathing room so that they're not too close to each other. Conversely, fonts with smaller x heights and ascent/descent may need a tighter line height so that there aren't large gaps of spacing between adjacent lines of text.

This means that when you select a font for your website, you need to play around with the line heights until things look right. Together with the considerations above for line length and font size, this means that choosing the perfect line height for your copy is much more nuanced than just selecting one value for paragraphs and another for headings.

#### Be Careful with System Fonts

With a bit of practice, you can train your eyes to approximate the ideal line height for text, given a font family, a particular font size, and a particular line length.

But things aren't so easy if you're using a system font stack—one that specifies fonts supported out of the box by common operating systems:

```css
html {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
}
```

System font stacks are a popular option among sites that want to avoid the network load of serving vendor fonts. But while this is lightweight, it's also unpredictable—because now, you're no longer working with a single reference font. This means that you'll be selecting your line heights and font sizes relative to the system font on whatever operating system you use for design work, which can bias the results in favor of one OS. So while your chosen line heights and font sizes may look good on one operating system, they may look different on another system. This can create accessibility issues because choosing the wrong line height or font size for your copy can harm readability. In some cases, if your line height is *too tight*, Lighthouse may complain that clickable elements (like inline links) are too close to each other.

## Solution: Create a Type Scale

Here are a few steps you can follow to pick the ideal line height for your site:

1. Select a font family so you have a single point of reference.
2. Define multiple font sizes in a [type scale](https://type-scale.com/).
3. For each font size, define a corresponding line height.

Whenever you apply a particular font size to an element, you need to make sure it also gets a matching line height. We can do this with CSS custom properties and Sass mixins.

### CSS Custom Properties

You can easily create design tokens for typography using CSS custom properties (or, if you use Sass, a map). Below is one example of what that might look like; you'll likely need to adjust these values to suit your chosen font.

{% include codeHeader.html file: "global.css" %}
```css
html {
  /* 1rem = 10px if base font size is 16px */
  font-size: 62.5%;

  --fs-sm: 1.6rem;
  --lh-sm: 1.75;

  --fs-base: 1.8rem;
  --lh-base: 1.67;

  --fs-md: 2rem;
  --lh-md: 1.6;
  --ls-md: 0;

  --fs-lg: 2.4rem;
  --lh-lg: 1.4;

  --fs-xl: 3.2rem;
  --lh-xl: 1.37;

  --fs-xxl: 3.6rem;
  --lh-xxl: 1.3;

  --fs-xxxl: 4.4rem;
  --lh-xxxl: 1.2;
}
```

### A Sass Mixin for Consistent Font Sizes and Line Heights

If you're using a preprocessor like Sass, you can then define a mixin to apply both a font size and its corresponding line height *together*:

{% include codeHeader.html file: "_mixins.scss" %}
```scss
@mixin font-size($step) {
  font-size: var(--fs-#{$step});
  line-height: var(--lh-#{$step});
}
```

You would then use the mixin like so:

```scss
.el {
  @include font-size('md');
}
```

And Sass would interpolate the argument to generate this output CSS:

```css
.el {
  font-size: var(--fs-md);
  line-height: var(--lh-md);
}
```

As a final step, you'll want to consider mobile devices and adjust your line height accordingly for those smaller devices to account for shorter line lengths, if needed.

## In Summary

Line heights are tricky to get right, especially since there are so many considerations to keep in mind. Be sure to vary your line height for each font size, pick the right line height based on your chosen font family, and consider the width of your text as it relates to your font metrics.

{% include unsplashAttribution.md name: "Striving Blogger", username: "strivingblogger", photoId: "Hx-4TbpsoIw" %}
