---
title: "Respecting Font Size Preferences: Rems and 62.5% Base Font Size"
description: Setting your base font size to 62.5% allows you to think in pixels but use rems to respect users' font size preferences.
keywords: [base font size, "62.5%", font size preferences, rem]
categories: [css, typography, browsers, a11y]
thumbnail: thumbnail.jpg
---

In CSS, there are lots of different units that can be used to size elements on a page—`px`, `vw`, `ch`, `em`, `rem`, and [far too many others](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) to list here. Of all these units, `rem` happens to be the most reliable for sizing elements responsively, allowing you to scale your UI with the browser's base font size and to respect user preferences for accessibility. Let's understand why `rem` is the ideal unit for font size and how setting the base font size to `62.5%` can make our lives easier while also honoring user preferences.

{% include toc.md %}

## Don't Use Pixels for Font Size

The traditional unit for sizing anything on the web is the pixel, but it's not the ideal unit for font size. While pixels do make it easy for you to translate mockups from design software directly into CSS, they're an [absolute-length unit](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#absolute_length_units), which means that one pixel always corresponds to a **fixed physical size** on a user's screen. More precisely, one CSS pixel is equal to `1/96` of an inch.

Pixels are the easiest unit to understand because they're grounded in physical measurements. But like other absolute units, they're not very scalable. And using pixels for font sizing even harms accessibility. To understand why, we need to learn a bit more about user font size preferences.

## Respecting Users' Font Size Preferences

Every browser applies a base font size of `16px` to a document, meaning that unstyled body text will have a font size of `16px` out of the box. However, both developers and users can change this behavior. As developers, we can change the font size of the root element (`html`) with CSS so that all elements inherit that new font size. Users can go into their browser's settings (e.g., `chrome://settings/fonts` in Chrome) and configure their font preferences:

{% include img.html src: "chrome-settings.jpg", alt: "The Chrome settings page for changing one's preferred font size. Two sliders can be seen: one for the font size and another for the minimum font size. Sample sentences are shown below those sliders, along with pickers for the user's preferred font family (which, by default, is Times New Roman)." %}

This means that using hard-coded pixels for font sizing is inaccessible to people with vision impairments, who may want to scale up the font size of your page so that text is easier to read. When you set a font size in pixels, it will *always* be rendered at that size, regardless of what font size a user prefers.

### Preferred Font Size vs. Browser Zoom Level

Users can also scale a web page using **browser zoom settings**, in which case pixels are not entirely problematic because the page still scales up proportionally.

{% include img.html src: "page-zoom.jpg", alt: "The Chrome settings page shows various groups, one of which is labeled page zoom. There's a dropdown input, with a currently selected value of 100%." %}

For example, changing the base font size from `16px` to `18px` is equivalent to setting the page zoom to be `112.5%`. So you could get away with using pixels for all dimensions and leaving it up to users to zoom in your page if they need to.

However, more commonly, users have a preferred font size for their monitor rather than a preferred zoom percentage—after all, it's much easier for users to reason about pixels than it is some arbitrary percentage zoom. Moreover, as in the example above, percentages may yield floating-point results that don't appear in the browser settings, forcing a user to choose between the two closest values that are available.

This means that we should **always respect the user's preferred base font size** rather than forcing them to figure out whether we support zooming only, font size scaling only, or both zooming and font size scaling. You can learn more about respecting user font size preferences in [WCAG Criterion 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html).

## Scaling Font Sizes with `rem`

So absolute units won't do if we care about honoring a user's font size preferences. Fortunately, CSS also offers [relative-length units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units), which reference other elements on the page rather than always corresponding to a fixed physical quantity. Two such units are `em` and `rem`.

When used for a child element's font size, `em` refers to the parent font size. For example, if an element has a font size of `24px`, then `0.5em` translates to a font size of `12px` for a child element. While in some cases `em` can be useful for padding and margins, it's problematic for font sizing. If you give an element a font size in `em` and a child a font size in `em`, those two `em`s will create a compounding effect. This makes it less than ideal in component-driven development because an element may be nested arbitrarily deep in other `em`-sized containers. Thus, an element's font sizing cannot be determined reliably just by looking at its own CSS.

By contrast, `rem` (which stands for "root em") always references **the base font size of the document**. Assuming that the base font size is `16px`, we get the following values:

- `1rem = 16px`
- `1.5rem = 24px`
- `0.5rem = 8px`

The great thing about `rem` is that we can safely use it for font sizes in nested layouts and component frameworks since it always references the root font size, rather than some unknown parent element's font size. Thus, it's more predictable than `em`. This makes `rem` the ideal unit for sizing elements responsively on a page—you can use it for padding, margins, font sizes, border radii, and even width and height. When users go in and change their base font size preference at the browser level, all `rem`-based dimensions will scale accordingly.

Unfortunately, if we use `rem`, we won't have the luxury of translating pixel designs directly into CSS. To render a font size of `12px`, for example, we need to do some math to figure out that `12 ÷ 16 = 0.75rem` (assuming a base font size of `16px`). This is tedious—but we can work around it!

## Setting the Base Font Size to `62.5%`

It would be nice if we could **think in pixels** but also reap the benefits of using `rem`s. And it turns out that we can, with the help of a clever math trick.

Currently, `1rem = 16px`, which is inconvenient for translating pixels into `rem`s. If instead `1rem` were equal to `10px`, we could easily convert any pixel amount to `rem`s by dividing it by `10`. So `12px` would be `1.2rem`, `24px` would be `2.4rem`, and so on.

How can we do that? Well, `10` is precisely `62.5%` of `16`. So if we set the base font size of our document to be `62.5%`, then `1rem` will equal `10px`:

```css
html {
    /* 62.5% of 16px base font size is 10px */
    font-size: 62.5%;
}

.el {
    /* 10 * 1.2 = 12px */
    font-size: 1.2rem;
}
```

If we were to just stop here, our body font size would be illegibly small at a mere `10px`. We can fix this by setting the font size of our body to be `1.6rem`:

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

Now, all elements in the body will inherit a font size of `1.6rem`, or `16px`. Effectively, this means that the base font size of the page is still respected (`16px`), but we can now express pixels using relative units because the root element still has a font size of `10px`.

### Is This Accessible?

I've read lots of arguments online about whether it's okay to set a document's base font size to be `62.5%`. Some people argue that this hurts accessibility because we've set the base font size to be anything other than `100%`, which no longer respects the user's preferred font size settings.

However, this isn't true and overlooks a critical point. While we did scale *down* the root font size, we also scaled *up* the body font size. The equation remains unchanged because we multiplied both sides by the same quantity:

```plaintext
1rem = 16px
0.625rem = 10px
```

If we then multiply both sides by `1.6`, we get right back to our original equation:

```plaintext
0.625rem = 10px
1.6 × 0.625rem = 1.6 × 10px
1rem = 16px
```

This is because `1.6` and `0.625` are inverses of each other:

```plaintext
10 ÷ 16 = 0.625
16 ÷ 10 = 1.6
```

So multiplying both sides by `0.625` is canceled out by multiplying both sides again by `1.6`. However, the root font size on the `html` element is still `10px`, which means we have a single source of truth for scalable font sizing. **Everything scales proportionally**.

It helps to look at an example, so let's assume that we have this CSS:

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

Now, suppose that a user goes into their browser settings and sets their preferred base font size to `20px`. Does this create any problems for us? Let's see how the math pans out for body text:

```plaintext
1rem = 20px
0.625rem = 12.5px
1.6 × 0.625rem = 1.6 × 12.5px
1rem = 20px
```

So we get right back to where we started for the body font size.

What about the `4.8rem`-sized heading? After the user sets their base font size to `20px`, this heading will have an effective font size of `60px`:

```plaintext
0.625 × 20 = 12.5
12.5 × 4.8 = 60
```

This may seem strange since we actually wanted `4.8rem` to equal `48px`, but remember: That's only true when we assume a base font size of `16px`, which isn't the case here. If a user increases their preferred base font size, all font sizes will scale up proportionally (when using rems).

So in this case, the fact that the heading is `60px` is a good thing because it means that the ratio between the `h1`'s size and the base font size remained unchanged:

```plaintext
Before: 48px ÷ 16px = 3
After:  60px ÷ 20px = 3
```

Our math trick works!

## Final Thoughts

Using a base font size of `62.5%`, together with `rem`, provides the ideal compromise between respecting user font size preferences and making it easier to translate pixel measurements into responsive units. Everyone wins!

{% include unsplashAttribution.md name: "Chrissie Giannakoudi", username: "chrissiey", photo_id: "aVDnC9mgxBY" %}
