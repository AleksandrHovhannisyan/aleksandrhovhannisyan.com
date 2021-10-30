---
title: Don't Use a Fixed Line Height
description: In typography, the ideal line height for text depends on a variety of factors, including font size, line length, and font family.
keywords: [line height, ideal line height, typography]
categories: [css, sass, typography, a11y]
thumbnail: thumbnail.jpg
lastUpdated: 2021-08-17
commentsId: 96
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

While this may seem sufficient, it's not a good practice from a design and accessibility perspective. Let's understand why and explore two solutions to this problem: one with custom properties and Sass mixins, and another with the `ex` unit and a calc function.

{% include toc.md %}

## You Need More Line Heights

The ideal line height for text depends on a variety of factors. In practice, this means that you'll need more line heights than just one or two.

### 1. Ideal Line Height Depends on the Font Size

When exploring the relationship between font size and line height, it's important to distinguish between **absolute-unit line height** and **relative line height**.

The former expresses line height in absolute units, usually pixels:

```css
.element {
  font-size: 16px;
  line-height: 25.6px;
}
```

The latter expresses line height using relative measurements—typically a unitless line height like `1.6`, which translates to "`1.6` times the current font size." The code below specifies a unitless line height that corresponds to the same pixel line height as in the code above:

```css
.element {
  font-size: 16px;
  /* 1.6 × 16px = 25.6px */
  line-height: 1.6;
}
```

The only key difference is that a unitless line height expresses a proportional relationship, whereas absolute line heights do not reference the font size at all.

#### Absolute Line Height

Absolute font sizes and absolute line heights have a **direct relationship** with one another, meaning that larger font sizes need larger line heights, and smaller font sizes need smaller line heights. Intuitively, this should make sense—at larger font sizes, characters take up more vertical space, so we need to increase the line height to provide sufficient space between lines of text.

However, it's important to understand that while font size and line height are directly related in this manner, this doesn't mean that the line height should increase *proportionally* as the font size increases. This becomes clearer when we consider unitless line height.

#### Unitless Line Height

Unitless line heights are **inversely related** to font size. As the rendered font size increases, the rendered line height should increase too, but by a *lesser amount than before*. Put differently, the line height needs to slow its growth so that it's not too exaggerated at larger font sizes. Thus, unitless line heights must *decrease* with larger fonts. If we had a line height of `1.6` before, we'll need a smaller line height for larger font sizes—maybe `1.4` or `1.3`. Similarly, as the font size decreases, we need to *increase* our unitless line height.

Let's look at an example. Imagine that we have a `48px` heading that uses the same `1.6` unitless line height as the body text. Thus, it has a rendered line height of `76.8px`. This creates too much spacing between lines, making the heading difficult to read:

{% include img.html src: "too-much-line-height.png", alt: "A sample paragraph with a large heading rendered above it at 48px size and with a line height of 1.6. The body font also has a line height of 1.6 but a smaller font size. The heading is uncomfortable to read.", caption: "The gap is too big between adjacent lines of heading text, creating a visual imbalance." %}

So while the rendered line height for this font size does in fact need to be greater than the rendered line height for body text, the *ratio* needs to decrease to tighten the gap and improve readability. For this particular font, we might opt for a unitless line height of `1.2`. That gives us a rendered line height of `57.6px`. In absolute terms, this is still larger than the body's line height, but the ratio has decreased, making the heading easier to read:

{% include img.html src: "right-line-height.png", alt: "A sample paragraph with a large heading rendered above it at 48px size and with a line height of 1.2. The heading is now much easier to read.", caption: "Takeaway: At larger font sizes, unitless line heights need to decrease to maintain readability." %}

#### Absolute vs. Unitless Line Height: Which Should You Use?

As we saw from the examples above, unitless line height can be deceptive because it creates a false sense of scalability. The traditional advice is to [always use unitless line height](https://allthingssmitty.com/2017/01/30/nope-nope-nope-line-height-is-unitless/) as a best practice. But practically speaking, there's no difference between the two if you're going to have to change the line height at each font size anyway.

With that in mind, it makes more sense to use absolute line heights since they're easier to reason about; design tools and font inspectors typically yield pixel values (which you should convert to `rem`s) rather than unitless proportions.

The one advantage of using unitless line height is that it's easier to verify, at a glance, that the proportion between your line height and font size decreases as the font size increases. This is a little harder to tell when you express line height using absolute units.

In the end, it's up to you to decide which one you want to use. Both have their advantages.

### 2. Ideal Line Height Depends on the Line Length

Line height also depends on *line length*, or the number of characters in a line of text. This is covered in detail in a Smashing Magazine article on [balancing line length and font size in responsive web design](https://www.smashingmagazine.com/2014/09/balancing-line-length-font-size-responsive-web-design/). As a rule of thumb, shorter lines of text need shorter line heights. Conversely, wider text needs more line height.

Striking the right balance between line length and line height makes it easier for readers to scan your text and distinguish paragraphs from sentences. This is why designers typically recommend that you limit the width of your copy to somewhere between **45 and 80 characters** (and so does [WCAG Criterion 1.4.8](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-visual-presentation.html)). Anything wider than this risks hurting the readability of your text. And the wider your text is, the more line height you're going to need, which can start to look unnatural.

### 3. Ideal Line Height Depends on the Font Family

There's another reason why you can't always set a single line height on your copy, especially from one site to another: The ideal line height also depends on your chosen font family. There are a few font properties you need to consider before you can come up with the right line height:

- The font's **x-height**, or the height of the lowercase letter `x`.
- The **font ascent**, or the distance from the top of the tallest letters to the baseline.
- The **font descent**, or the distance from the lowest hanging letters to the baseline.

These related properties dictate the ideal line height for text. As a general rule of thumb, fonts with a larger x-height or font ascent/descent need more line height to give your sentences more breathing room so that they're not too close to each other. Conversely, fonts with smaller x heights and ascent/descent may need a tighter line height so that there aren't large gaps of spacing between adjacent lines of text.

When you select a font family, you need to inspect it carefully and play around with the line heights until things look right. Together with the considerations above for line length and font size, this means that choosing the perfect line height for your copy is much more nuanced than just selecting one value for paragraphs and another for headings.

#### Be Careful with System Font Stacks

With a bit of practice, you can train your eyes to approximate the ideal line height for text, given a font family, a particular font size, and a particular line length.

But things aren't so easy if you're using multiple fallback system fonts:

```css
html {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
}
```

System font stacks are a popular option among sites that want to avoid the network load of serving vendor fonts. But while this is lightweight, it's also unpredictable—because now, you're no longer working with a single reference font. Thus, you'll be selecting your line heights and font sizes relative to the system font on whatever operating system you use for design work, which can bias the results in favor of one OS.

So while your chosen line heights and font sizes may look good on one OS, they may look different on another. This can create accessibility issues because choosing the wrong line height or font size for your copy can harm readability. In some cases, if your line height is *too tight*, Lighthouse may complain that clickable elements (like inline links) are too close to each other.

If you really want to take the system font route, I recommend picking a font that exists on most operating systems, like Georgia (serif) or Verdana (sans-serif). That way, you still have a single reference font against which you can design your site, and you have more of an assurance that your UI will look consistent from one OS to another.

## Solution 1: Create a Type Scale

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
  --fs-sm: 14px;
  --lh-sm: 24px;

  --fs-base: 16px;
  --lh-base: 26px;

  --fs-md: 20px;
  --lh-md: 30px;

  --fs-lg: 24px;
  --lh-lg: 34px;

  --fs-xl: 32px;
  --lh-xl: 44px;

  --fs-xxl: 36px;
  --lh-xxl: 46px;

  --fs-xxxl: 44px;
  --lh-xxxl: 52px;
}
```

{% aside %}
  In reality, you'd want to use rems for font sizes and line heights to [respect users' font size preferences](/blog/respecting-font-size-preferences-rems-62-5-percent/). I used pixels to keep this tutorial simple.
{% endaside %}

Notice how the absolute line height increases as you move up the scale, but the ratio between the line height and font size decreases. In other words, they're getting closer to each other. As I mentioned earlier, this is easier to spot with unitless line heights:

```css
html {
  --fs-sm: 14px;
  --lh-sm: 1.71;

  --fs-base: 16px;
  --lh-base: 1.625;

  --fs-md: 20px;
  --lh-md: 1.5;

  --fs-lg: 24px;
  --lh-lg: 1.42;

  --fs-xl: 32px;
  --lh-xl: 1.375;

  --fs-xxl: 36px;
  --lh-xxl: 1.278;

  --fs-xxxl: 44px;
  --lh-xxxl: 1.182;
}
```

{% aside %}
  **Note**: You may want to rename the variable to make it clear that `lh-lg` is not a "large line height," but that's more of a semantic concern than a functional one. It's up to you.
{% endaside %}

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
.element {
  @include font-size('md');
}
```

And Sass would interpolate the argument to generate this output CSS:

```css
.element {
  font-size: var(--fs-md);
  line-height: var(--lh-md);
}
```

As a final step, you'll want to consider mobile devices and adjust your line height accordingly for those smaller devices to account for shorter line lengths, if needed.

## Solution 2: Use the `ex` Unit

In an article on [using calc to figure out optimal line height](https://kittygiraudel.com/2020/05/18/using-calc-to-figure-out-optimal-line-height/), Jesús Ricarte proposes that we instead use the `ex` unit together with pixels in a calc function, like this:

```css
.element {
  line-height: calc(4px + 2ex);
}
```

The `ex` unit measures a font's x-height at a particular font size. Unlike percentages, unitless values, rems, and other units, `ex` corresponds to measurable font metrics that are closely related to a font's line height, making it the perfect unit for our needs. We just need to add a bit of padding with pixel values to account for the fact that the font has some intrinsic leading above and below its glyphs. You'll need to tweak this value based on the font you're using.

This approach provides a sufficiently accurate approximation of a font's ideal line height. The main benefit to this method is that you don't have to define a unique line height variable corresponding to each font size step in your type scale. However, it's worth noting that you'll still need to reapply this calculation every time you change an element's font size, especially for nested children. This is because children won't inherit the calc equation but rather the *computed value*, which is relative to the parent's font size. This can lead to unexpected results.

Fortunately, if we take the mixin approach that I showed earlier, the fix is rather simple—instead of looking up a particular line height step in our variables, we can just plug in this equation alongside the font size:

{% include codeHeader.html file: "_mixins.scss" %}
```scss
@mixin font-size($step) {
  font-size: var(--fs-#{$step});
  line-height: calc(4px + 2ex);
}
```

## In Summary

Line heights are tricky to get right, especially since there are so many considerations to keep in mind. Be sure to vary your line height for each font size, pick the right line height based on your chosen font family, and consider the width of your text as it relates to your font metrics.

{% include unsplashAttribution.md name: "Striving Blogger", username: "strivingblogger", photoId: "Hx-4TbpsoIw" %}
