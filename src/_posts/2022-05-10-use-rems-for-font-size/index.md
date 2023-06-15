---
title: "Use Rems for Font Size to Respect User Preferences"
description: Of all the CSS units, rems are the most accessible for font sizing, allowing you to scale text responsively when users change their preferred font size settings.
keywords: [rems, font size, responsive font size, preferred font size]
categories: [css, typography, accessibility, rems]
lastUpdated: 2023-06-14
thumbnail:
  url: https://images.unsplash.com/photo-1624558347497-df07e0096f5a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFnbmlmeWluZyUyMGdsYXNzJTIwYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1600&h=900&q=60
---

In CSS, there are many different units that can be used to size elements on a page—`px`, `vw`, `ch`, `em`, `rem`, and [far too many others](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) to list here. Of all these units, `rem` is the most reliable for font sizing, allowing you to style text responsively so that it scales whenever users change their preferred browser font size. Let's understand why this matters.

{% include "toc.md" %}

## Don't Use Pixels for Font Size

The traditional unit for sizing anything on the web is the CSS pixel, but it's not ideal for font size. While pixels do make it easy for you to translate mockups from design software directly into CSS, they're an [absolute-length unit](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#absolute_length_units), which means that one CSS pixel corresponds to a **fixed physical pixel size** (device pixel) on a user's screen.

{% aside %}
This may be `1/96`th of an inch on `96` DPI devices, or it may be some other physical quantity on a device with a different DPI. For our purposes in this article, the important thing to understand is that while a CSS pixel may not always correspond to the same physical quantity between two devices that have different DPIs, it *does* refer to a fixed quantity on a single device. You can learn more about this distinction in Elad Schechter's article *[There Is No Such Thing As A CSS Absolute Unit](https://www.smashingmagazine.com/2021/07/css-absolute-units/)*.
{% endaside %}

CSS pixels are the easiest unit to understand because they're grounded in physical measurements. But like other absolute units, they don't scale—`15px` will always be `15px` on the same device. Using pixels is a particularly bad practice for font sizing because it can create some accessibility problems for users with vision impairments. To understand why, we need to learn about **user font size preferences**.

{% aside %}
  This doesn't mean that you can't or shouldn't use pixels *at all*. Pixels are still useful for padding, margin (in certain situations), border width, border radius, and other properties that don't necessarily depend on font size.
{% endaside %}

## User Font Size Preferences

Behind the scenes, every browser defines `1rem` to be `16px` initially, before any custom styling is applied to the page. This means that any unstyled body text will have a rendered font size of `16` CSS pixels (excluding special elements like `<small>` that have a smaller font size due to user-agent styles). However, both developers and users can redefine the value of `1rem`. Developers can change the font size of the root element (`html`) with CSS so that all elements inherit that new font size:

```css
html {
  /* 1rem is now 18px. Note that this example is purely
  illustrative. Don't set font size in pixels! */
  font-size: 18px;
}
```

Likewise, users can go into their browser settings (e.g., `chrome://settings/fonts` in Chrome) and select their preferred font size:

{% include "postImage.html" src: "./images/chrome-settings.jpg", alt: "The Chrome settings page for changing one's preferred font size. Two sliders are seen: one for the font size and another for the minimum font size. Sample sentences are shown below those sliders, along with pickers for the user's preferred font family (which, by default, is Times New Roman).", caption: "Customizing font size in Google Chrome's settings.", isCaptionAriaHidden: true %}

Using pixels for font size is inaccessible to users with vision impairments because they may need to scale up the font size of your page to read the text more easily. But when you set a font size in pixels like we did in the example above, the text will *always* render at that size, regardless of what font size a user prefers. For example, a user might prefer to scale the font size on all pages to be larger than normal (say 125%), but if you set your root font size to be `18px`, it will _always_ render at that size—the user's preference will be ignored. You can learn more about why this matters in [WCAG Criterion 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html).

### Preferred Font Size vs. Browser Zoom Level

Users can also zoom in all web pages globally in their browser settings, in which case it may seem like pixels are not entirely problematic because the page still scales up proportionally.

{% include "postImage.html" src: "./images/page-zoom.jpg", alt: "The Chrome settings page shows various groups, one of which is labeled page zoom. There's a dropdown input, with a currently selected value of 100%.", caption: "The page zoom control in Google Chrome's settings.", isCaptionAriaHidden: true %}

For example, changing the root font size from `16px` to `18px` is equivalent to setting the page zoom to be `112.5%`. So you might be tempted to use pixels for all of your font sizes and leave it up to users to zoom in your page if they have trouble reading the text.

However, more commonly, users have a preferred font size for their monitor rather than a preferred zoom percentage—after all, it's much easier for users to reason about pixels than it is some arbitrary percentage zoom. Moreover, as in the example above, percentages may yield floating-point results that don't appear in the browser settings, forcing a user to choose between the two closest values that are available.

{% aside %}
Although, to be fair, different font families render at different visible sizes. For example, [Libre Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) is a notoriously large font family; a font size of `16px` rendered in this family corresponds to roughly `18px` in most other families. So this issue is more nuanced than it seems.
{% endaside %}

But more importantly, zooming scales the entire page, which isn't necessarily what users want when they decide to increase their preferred font size. Typically, users do this because they want to enlarge *just the visible text* to make it easier to read. Zooming does make text bigger, but since all of the other elements on the page also scale up, they leave less room for text to fit on the screen. On the other hand, scaling just the font size for a page allows a user to read it more easily without enlarging irrelevant elements.

In short, we should always respect the user's preferred font size rather than forcing them to figure out whether we support zooming only, font size scaling only, or both zooming and font size scaling.

If you're still wondering why this matters so much and why we can't just use pixels and let users zoom in the page if they really want bigger text, Kathleen McMahon did a deep dive into [why rems are better for accessible font sizing](https://www.24a11y.com/2019/pixels-vs-relative-units-in-css-why-its-still-a-big-deal/) back in 2019.

## Relative Units and Font Size

Absolute units like pixels aren't ideal if we want to respect our users' font size preferences. Fortunately, CSS also offers [relative-length units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units), which reference other elements on the page rather than using absolute values. Three such units are percentages, ems, and rems. Since percentages and ems behave the same in the context of font sizing, we'll look at just ems and compare them to rems.

### A First Attempt with `em`

Consider the following HTML:

```html
<div class="parent">
  <div class="child"></div>
</div>
```

For the `font-size` property, `1em` is relative to the font size of that element's *parent*. So if the parent element has a font size of `24px`, a child with a font size of `1em` would get a computed font size of `24px`. Likewise, `0.5em` would compute to `12px`:

```css
.parent {
  /* I'm using pixels for illustrative purposes. */
  font-size: 24px;
}
.child {
  /* 0.5 * 24px = 12px */
  font-size: 0.5em;
}
```

Unfortunately, `em` is problematic for font sizing. If you give one element a font size in ems and a child a font size also in ems, those two values will create a compounding effect. For example, suppose we now introduce another element as a child of the child and give that element an `em`-based font size:

```html
<div class="parent">
  <div class="child">
    <div class="deeply-nested"></div>
  </div>
</div>
```

```css
.parent {
  /* I'm using pixels for illustrative purposes. */
  font-size: 24px;
}
.child {
  /* 0.5 * 24px = 12px */
  font-size: 0.5em;
}
.deeply-nested {
  /* 0.5 * 0.5 * 24px = 6px */
  font-size: 0.5em;
}
```

For this reason, ems are not recommended for font sizing because an element may be nested arbitrarily deep in the DOM. Thus, an element's `em`-based font size cannot be determined reliably just by looking at its own CSS—it depends on where that element is inserted into the tree. This makes it very difficult to create independent, reusable components.

{% aside %}
  Again, just because something doesn't work in one situation doesn't mean that you should avoid it entirely. For example, ems can still be useful if you want to define certain properties of an element (like padding) relative to its own font size.
{% endaside %}

### Responsive Font Sizing with `rem`

By contrast, `rem` (which stands for "**root em**") always references the root font size of the document as its single source of truth. Assuming that the root font size is `16px` (as is the case in all modern browsers before user preferences are applied), we get the following values:

- `1rem = 16px`
- `1.5rem = 24px`
- `0.5rem = 8px`

The great thing about `rem` is that it's predictable: we can safely use it for font sizes in nested layouts and component frameworks since it always references the root font size rather than some arbitrary ancestor font size. This makes `rem` the ideal unit for font sizing, allowing us to define font sizes in responsive units that respect user preferences. So if a user changes their preferred font size in their browser settings, all of your `rem`-based sizes will scale accordingly and use the new value as their basis. For example, let's update the code sample from earlier to use rems:

```css
.parent {
  /* 1.5 * 16px = 24px */
  font-size: 1.5rem;
}
.child {
  /* 0.5 * 16px = 8px */
  font-size: 0.5rem;
}
.deeply-nested {
  /* 0.5 * 16px = 8px */
  font-size: 0.5rem;
}
```

Now, suppose the user changes their preferred font size to `18` in their browser settings. Effectively, this initializes `1rem` to be `18px` before the browser evaluates our stylesheet. This scales up the parent and child font sizes (independently): `1.5rem` now computes to a font size of `27px`, and `0.5rem` computes to `9px`. Conversely, if a user were to decrease their preferred font size, our font sizes would decrease proportionally (but still independently). This allows us to design our app for the "normal" use case of browsers with a root font size of `16px` without locking users into a hardcoded font size—they're free to change their settings as they please, and our website will adapt responsively.

## Rems Made Easy

At first, it may take you a bit of practice to get the hang of expressing numbers in rems if you're not used to it. But with time, you'll find that it's actually quite easy, especially if you like to work with powers of two. For example, `8px` in rems is just half of `16px`, so we know it's `0.5rem`. Likewise, `4px` is `0.25rem`, `2px` is `0.125rem`, and so on.

However, in practice, it's unlikely that you'll want to pull random values out of thin air and hardcode them in your styles. This may seem convenient in the short term, but it makes it harder to maintain your CSS in the long term. Instead, it's better to define custom properties upfront for all of your desired sizes using a simple scale (known as a *type scale*):

```css
html {
  --font-size-300: 0.75rem; /* 12px */
  --font-size-400: 1rem;    /* 16px, base */
  --font-size-500: 1.25rem; /* 20px */
  --font-size-600: 1.5rem;  /* 24px */
  --font-size-700: 1.75rem; /* 28px */
  --font-size-800: 2rem;    /* 32px */
  --font-size-900: 2.25rem; /* 36px */
  /* etc. */
}
```

Now, instead of hardcoding font sizes in your CSS, you can reference these variables:

```css
.element {
  font-size: var(--font-size-400);
}
```

Note that this is just one convention. Here's another example:

```css
html {
  --font-size-sm: 0.75rem;   /* 12px */
  --font-size-base: 1rem;    /* 16px, base */
  --font-size-md: 1.25rem;   /* 20px */
  --font-size-lg: 1.5rem;    /* 24px */
  --font-size-xl: 1.75rem;   /* 28px */
  --font-size-xxl: 2rem;     /* 32px */
  --font-size-xxxl: 2.25rem; /* 36px */
  /* etc. */
}
```

The nice thing about using CSS variables is that you don't have to constantly translate pixels to rems on the fly as you implement a design. Rather, you can reference a predefined set of variables and trust that the values correspond to your design system tokens under the hood. You could even ask your designers to use the same naming convention as you do in your code so that you don't have to look up the raw pixel value used in designs—you can just copy the name of the font size variable.

Finally, note that if you do need to convert rems to pixels in one-off situations, you can:

- Work out the math by hand (e.g., `24 / 16 = 1.5rem`).
- Use a CSS calc expression (e.g., `calc(1rem * 24 / 16)`).
- Use a CSS preprocessor like Sass and write a custom `to-rems` utility function.
- [Use the 62.5% font size trick to make the math easier](/blog/62-5-percent-font-size-trick/).

## Final Thoughts

Pixels are the most popular unit for sizing elements on the web, but they're not great for font sizing because they lock users into *just that size*, preventing them from scaling the text on the page except by zooming. Instead, it's recommended that you set your font sizes in rems to respect user preferences.

{% include "unsplashAttribution.md" name: "Chrissie Giannakoudi", username: "chrissiey", photoId: "aVDnC9mgxBY" %}
