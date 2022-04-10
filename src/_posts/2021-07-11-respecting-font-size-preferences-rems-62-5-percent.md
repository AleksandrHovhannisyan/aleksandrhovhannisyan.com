---
title: "Respecting Font Size Preferences: Rems and 62.5% Base Font Size"
description: Setting your base font size to 62.5% allows you to think in pixels but use rems to respect users' font size preferences.
keywords: [base font size, "62.5%", font size preferences, rem]
categories: [css, typography, math, accessibility]
commentsId: 97
lastUpdated: 2021-12-14
thumbnail:
  url: https://images.unsplash.com/photo-1624558347497-df07e0096f5a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFnbmlmeWluZyUyMGdsYXNzJTIwYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1600&h=900&q=60
---

In CSS, there are lots of different units that can be used to size elements on a page—`px`, `vw`, `ch`, `em`, `rem`, and [far too many others](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) to list here. Of all these units, `rem` is the most reliable for font sizing, allowing you to scale your UI responsively while also respecting users' font size preferences for accessibility. Let's understand why `rem` is the ideal unit for font size and how setting the root font size to `62.5%` can make our lives easier.

{% include toc.md %}

## Don't Use Pixels for Font Size

The traditional unit for sizing anything on the web is the CSS pixel, but it's not ideal for font size. While pixels do make it easy for you to translate mockups from design software directly into CSS, they're an [absolute-length unit](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#absolute_length_units), which means that one CSS pixel corresponds to a **fixed physical pixel size** (device pixel) on a user's screen. This may be `1/96`th of an inch on `96` DPI devices, or it may be some other physical quantity on a device with a different DPI. For our purposes in this article, the important thing to understand is that while a CSS pixel may not always correspond to the same physical quantity between two devices that have different DPIs, it *does* refer to a fixed quantity on a single device.

CSS pixels are the easiest unit to understand because they're grounded in physical measurements. But like other absolute units, they don't scale with other measurements. In particular, using pixels for font sizing isn't great for accessibility. To understand why, we need to learn about **user font size preferences**.

## Respecting a User's Font Size Preferences

Every browser applies a root font size of `16px` to a document, meaning that unstyled body text will have a rendered font size of `16` CSS pixels. However, both developers and users can change this behavior. Developers can change the font size of the root element (`html`) with CSS so that all elements inherit that new font size. Likewise, users can go into their browser settings (e.g., `chrome://settings/fonts` in Chrome) and configure their font size preferences:

{% include img.html src: "chrome-settings.jpg", alt: "The Chrome settings page for changing one's preferred font size. Two sliders can be seen: one for the font size and another for the minimum font size. Sample sentences are shown below those sliders, along with pickers for the user's preferred font family (which, by default, is Times New Roman)." %}

User preferences for font size should always take precedence over your CSS. This means that using hard-coded pixels for font sizing is inaccessible to users with vision impairments, who may want to scale up the font size of your page so that text is easier to read. When you set a font size in pixels, it will *always* render at that size, regardless of what font size a user prefers. You can learn more about why this matters in [WCAG Criterion 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html).

### Preferred Font Size vs. Browser Zoom Level

Users can also scale a web page using **browser zoom settings**, in which case pixels are not entirely problematic because the page still scales up proportionally.

{% include img.html src: "page-zoom.jpg", alt: "The Chrome settings page shows various groups, one of which is labeled page zoom. There's a dropdown input, with a currently selected value of 100%." %}

For example, changing the base font size from `16px` to `18px` is equivalent to setting the page zoom to be `112.5%`. So you could get away with using pixels for all dimensions and leaving it up to users to zoom in your page if they need to.

However, more commonly, users have a preferred font size for their monitor rather than a preferred zoom percentage—after all, it's much easier for users to reason about pixels than it is some arbitrary percentage zoom. Moreover, as in the example above, percentages may yield floating-point results that don't appear in the browser settings, forcing a user to choose between the two closest values that are available.

This means that we should always respect the user's preferred base font size rather than forcing them to figure out whether we support zooming only, font size scaling only, or both zooming and font size scaling.

{% aside %}
  One thing worth noting is that different font sizes render at different visible sizes depending on your chosen font family. For example, [Libre Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) is a notoriously large font family; a font size of `16px` rendered in this family corresponds to roughly `18px` in most other families.
{% endaside %}

## Scaling Font Sizes with `rem`

So absolute units aren't ideal if we want to honor our users' font size preferences. Fortunately, CSS also offers [relative-length units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units), which reference other elements on the page rather than using fixed CSS pixels. Two such units are `em` and `rem`.

When used for a child element's font size, `em` refers to the parent font size. For example, if an element has a font size of `24px`, then `0.5em` translates to a font size of `12px` for a child element. While in some cases `em` can be useful for padding and margins, it's problematic for font sizing. If you give an element a font size in `em` and a child a font size in `em`, those two `em`s will create a compounding effect. This makes it less than ideal in component-driven development because an element may be nested arbitrarily deep in other `em`-sized containers. Thus, an element's font sizing cannot be determined reliably just by looking at its own CSS.

By contrast, `rem` (which stands for "**root em**") always references the root font size of the document. Assuming that the root font size is `16px`, we get the following values:

- `1rem = 16px`
- `1.5rem = 24px`
- `0.5rem = 8px`

The great thing about `rem` is that we can safely use it for font sizes in nested layouts and component frameworks since it always references the root font size, rather than some unknown parent element's font size. Thus, it's more predictable than `em`. This makes `rem` the ideal unit for font sizing—when users go in and change their preferred font size in their browser settings, all of your `rem`-based sizes will scale accordingly.

Unfortunately, if we use `rem`, we won't have the luxury of translating pixel designs directly into CSS. To render a font size of `12px`, for example, we need to do some math to figure out that `12 ÷ 16 = 0.75rem` (assuming a base font size of `16px`). This is tedious—but we can work around it!

## Setting the Base Font Size to `62.5%`

It would be nice if we could **think in pixels** but also reap the benefits of using `rem`s.

Humans are pretty good at thinking in tens since we're familiar with the decimal (base-10) number system. If instead `1rem` were equal to `10px`, we could easily translate any pixel amount to `rem`s by dividing it by `10`. So `12px` would be `1.2rem`, `24px` would be `2.4rem`, and so on.

How can we do this? Well, `10` is `62.5%` of `16px`, the default root font size of your browser. So if we set the base font size of our document to be `62.5%`, then `1rem` will equal `10px`:

```css
html {
  /* 62.5% of 16px base font size is 10px */
  font-size: 62.5%;
}

.some-element {
  /* 10 * 1.2 = 12px */
  font-size: 1.2rem;
}
```

Of course, if we were to just stop here, our base body font size would be illegibly small at a mere `10px`. We can fix this by setting the font size of our body to be `1.6rem`, which yields an effective font size of `16px` for all visible text on the page:

```css
html {
  /* 10px */
  font-size: 62.5%;
}

body {
  /* 16px */
  font-size: 1.6rem;
}
```

At this point, you may be a little suspicious. We scaled the root font size down, but then we scaled it back up for the body—doesn't that defeat the whole purpose of scaling the root font size down in the first place?

The important thing to understand is that the root font size (on the `html` element) need not be the same as the font size on the `body` element. In this case, we have a root font size of `10px` because we scaled the `html` font size down to `62.5%`, but we did this solely for the convenience of translating pixels into rems. Our body font size—all of the visible text on the page—is still scaled back up to an effective font size of `16px` so that it matches the browser's font size.

These are just two ways of looking at the same equation. Originally, we had to perform this calculation to express a target pixel font size in rems:

```
12px in rems: 12 / 16 = 0.75rem
```

But here, we can express `12` as a multiple of `10`:

```
12px in rems: (1.2 × 10) / 16 = 0.75rem
```

We can then group the `10` with the `16` and expand the division:

```
Grouped:    1.2 × (10 / 16) = 0.75rem
Expanded:   1.2 × 0.625 = 0.75rem
```

Notice that the right-hand side of the equation is still the same as it was originally, but the left-hand side expresses the target font size conveniently as a multiple of `10`. This is just a more formal way of arriving at the same result that we derived intuitively.

The `62.5%` trick makes it easier to reason about pixels as relative units; the alternative is to perform mental calculations, rely on preprocessor math, or use CSS's `calc` utility.

### Is This Accessible?

So far, we've only considered the case where the browser has an unchanged root font size of `16px`. But what if a user changes their browser's font settings?

Well, recall that the body font size is `1.6rem`. And that means that we really have this equation:

```
html font size = 62.5% of browser font size
body font size = 0.625 × 1.6rem = 1 (i.e., 100% of the browser font size)
```

Notice that we really don't care what the browser font size happens to be. Since `1.6` and `0.625` are inverses of each other, they cancel out in this equation, yielding the browser's font size. No matter what root font size a user picks, the CSS will always respect it.

### Example: A User Prefers Larger Font Sizes

Let's look at an example. Assume that we have this CSS:

```css
html {
  font-size: 62.5%;
}
body {
  font-size: 1.6rem;
}
h1 {
  font-size: 4.8rem;
}
```

Now, suppose a user goes into their browser settings and sets their preferred base font size to be `20px`. Does this create any problems for us? Let's see how the math pans out for body text:

```
Browser font size:  20px
html font size:     0.625 × 20px = 12.5px
body font size:     1.6rem = 1.6 × 12.5px = 20px
```

So the body font size equals the browser font size, as expected.

What about the `4.8rem`-sized heading? After the user sets their base font size to `20px`, this heading will have an effective font size of `60px`:

```
Heading font size = 12.5px × 4.8rem = 60px
```

This may seem strange since we actually wanted `4.8rem` to equal `48px`, but remember: That's only true when we assume a base font size of `16px`, which isn't the case here. If a user increases their preferred base font size, all font sizes will scale up proportionally (when using rems). So in this case, it's good that the heading font size is `60px` because it means that the ratio between the `h1`'s size and the browser font size was preserved:

```
Before: 48px ÷ 16px = 3
After:  60px ÷ 20px = 3
```

## Final Thoughts

Using a base font size of `62.5%`, together with `rem`s for font sizing, provides the ideal compromise between respecting user font size preferences and making it easier to translate pixel measurements into responsive units. Everyone wins!

{% include unsplashAttribution.md name: "Chrissie Giannakoudi", username: "chrissiey", photoId: "aVDnC9mgxBY" %}
