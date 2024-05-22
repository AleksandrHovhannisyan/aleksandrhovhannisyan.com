---
title: The 62.5% Font Size Trick
description: Once you get used to thinking in rems for font sizing, you'll find that it's easy to express familiar powers of two. But for other values, you may find it helpful to use the 62.5% font size trick.
keywords: [62.5% font size, rems, font size]
categories: [css, typography, math]
commentsId: 97
lastUpdated: 2024-05-22
redirectFrom:
  - /blog/respecting-font-size-preferences-rems-62-5-percent/
thumbnail: https://images.unsplash.com/photo-1612620485998-fe926eccbe18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

{% aside %}
**Note**: This article explains a popular but old CSS technique. I did not come up with it; I'm not sure who did, or else I'd have credited them here.
{% endaside %}

Of all the units that CSS has to offer, rems are the preferred way to express font size because they scale with user settings. Ordinarily, `1rem = 16px` in all modern browsers, but a user can actually go into their browser settings and increase or decrease this value as they prefer; all of your rem-based font sizes will scale relative to that new base value.

Once you get used to thinking in rems, you'll find that it's actually quite easy to express familiar powers of two as fractions of `16`. For example:

- `24` is two and a half times `16`: `1.5rem`.
- `8` is half of `16`: `0.5rem`.
- `4` is a fourth of `16`: `0.25rem`.
- `2` is an eighth: `0.125rem`.
- ... and so on.

But if you need to express any other value in rems—like odd numbers or very large numbers—you'll need to do the math by hand, convert it with CSS `calc`, or use a preprocessor like Sass. Alternatively, you can use a math trick that sets the root font size to 62.5%. Let's look at how and why this works.

{% aside %}
In general, I don't recommend using this technique. Still, I think it's useful to understand how it works in case you encounter it in the wild.
{% endaside %}

{% include "toc.md" %}

## Setting the Root Font Size to 62.5%

Many designs use multiples of two for their spacing and font size tokens, usually for convenience and even divisibility. Since `16` happens to be a multiple of two, it's quite straightforward to translate an even pixel value into rems: `8px` is `0.5rem`, `4px` is half that (`0.25rem`), and so on, all the way down to `1px` (`0.125rem`).

Where it gets a little trickier is if you need to use rems to express larger numbers or odd values. For example, `5px` in rems is `0.3125rem`. This isn't *super* difficult to work out by hand, but it's becoming slightly more involved. Instead, it would be nice if we could think in pixels while still reaping the benefits of rems.

Humans are better at thinking in tens since we're familiar with the decimal (base-10) number system. If `1rem` were equal to `10px`, we could easily translate any pixel amount to rems by dividing it by `10`. So `12px` would be expressed as `1.2rem`, `24px` would be `2.4rem`, and so on. We would no longer need to divide by `16`.

But the root font size of browsers *isn't* `10px`—it's `16px`! So how can we *make* the root font size be `10px`? Well, one way we could do this is by setting the root font size in pixels:

```css
html {
  font-size: 10px;
}
```

**Forget about this approach**—[you should never use pixels for font sizing](/blog/use-rems-for-font-size/#dont-use-pixels-for-font-size)! While this does work, it also locks users into a hardcoded root font size of `10px`. If they later change their font size preferences in their browser settings, the root font size on your site won't update. My other article linked above goes into greater detail on why this is such a big deal, but suffice it to say that this is not accessible.

So if a hard-coded font size is out of the question, our only other option is to use a relative unit like percentages or ems. Since `10px` is 62.5% of `16px`, we could set the root font size to be this percentage:

```css
html {
  /* 62.5% of 16px user agent font size is 10px */
  font-size: 62.5%;
}

.some-element {
  /* 1.2 * 10px = 12px */
  font-size: 1.2rem;
}
```

If we were to just stop here, the text on our page would be illegibly small at a mere `10px`. We can fix this by setting the font size of our body to be `1.6rem`, which scales us back up to an effective font size of `16px` for all visible text on the page:

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

## Why 62.5% Font Size Works

At this point, you may be a little suspicious. We scaled the root font size down, but then we scaled it back up for the body—doesn't that defeat the whole purpose of scaling the root font size down in the first place?

The important thing to understand is that the root font size (on the `html` element) need not be the same as the font size on the `body` element. In this case, we have a root font size of `10px` because we scaled the `html` font size down to 62.5% of the user agent's font size, but we did this solely for the convenience of translating pixels into rems. Our body font size—all of the visible text on the page—is still scaled back up to an effective font size of `16px` so that it matches the browser's font size.

These are just two ways of looking at the same equation. Before, we would've had to perform this calculation to express a target pixel font size in rems:

```
12px in rems: 12 / 16 = 0.75rem
```

Here, we can rewrite `12` as a multiple of `10` without changing the equation:

```
12px in rems: (1.2 × 10) / 16 = 0.75rem
```

We can then group the `10` with the `16` and simplify that fraction:

```
Grouped:     1.2 × (10 / 16) = 0.75rem
Simplified:  1.2 × 0.625 = 0.75rem
```

Notice that the right-hand side of the equation is still the same as it was originally, but the left-hand side expresses the target font size conveniently in base-`10`. This is just a more formal way of arriving at the same result that we derived intuitively.

In short, the 62.5% trick just makes it easier to express pixels in rems.

### Is This Accessible?

So far, we've only considered the case where the browser has the default root font size of `16px`. But what if a user changes their browser's font settings?

Well, recall that we've set the body font size to be `1.6rem`. So we really have this equation:

```
html font size = 62.5% of browser font size (0.625)
body font size = 0.625 × 1.6rem = 1 (i.e., 100% of the browser font size)
```

Notice that we really don't care what the browser font size is. Since `1.6` and `0.625` are inverses of each other, they cancel out in this equation, yielding the browser's font size every time. Our CSS will *always* respect the user's font size preferences.

{% aside %}
I've often seen debates online about the 62.5% font size trick—such as in response to [this contentious tweet from the CSS Tricks account](https://twitter.com/css/status/1523700789083996160). Most of the arguments against it state that you should never change the root font size because it harms accessibility. This *would* be true if we didn't scale the body font size back up to `1.6rem`.
{% endaside %}

#### Example: A User Prefers Larger Font Sizes

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

Now, suppose a user goes into their browser settings and sets their preferred font size to `20px`. Does this create any problems for us? Let's see how the math pans out for body text:

```
Browser font size:  20px
html font size:     0.625 × 20px = 12.5px
body font size:     1.6rem = 1.6 × 12.5px = 20px
```

The body font size equals the browser font size, as expected.

What about the `4.8rem`-sized heading? After the user sets their base font size to `20px`, this heading will have a computed font size of `60px`:

```
Heading font size = 12.5px × 4.8rem = 60px
```

This may seem strange since we actually wanted `4.8rem` to equal `48px`, but remember: That's only true when we assume the root font size is `16px`, which isn't the case here. If a user increases their preferred font size, all `rem`-based font sizes need to scale up proportionally. So in this case, it's actually *good* that the heading font size is `60px` because it means that the ratio between the `h1`'s size and the browser font size was preserved:

```
Before: 48px ÷ 16px = 3
After:  60px ÷ 20px = 3
```

Sure, this doesn't match the design provided to you, which called for a heading that's 48px. But if you think about it, that's not actually a problem. If your goal is to make the font sizes on the page match the ones in your design composition exactly, then you should use pixels... But you actually _shouldn't_ use pixels because they don't respect user preferences. Remember, that 48px-heading doesn't live in isolation; the designer chose that value because it looked good relative to other font sizes on the page. So if all of the font sizes scale up by the same ratio, they will still be proportional.

## What About 6.25%?

The 62.5% trick makes the math easier because we now divide by `10` instead of `16` whenever we want to express pixels in rems. But why stop there? For example, we could take this a step further and make `1rem` equal `1px` if we set our root font size to `6.25%`, which is the same as `1/16` (`0.0625`). In that case, we get a one-to-one equivalence between pixels and rems and don't even have to do any math:

```css
html {
  /* 0.0625 * 16px = 1 (i.e., 1rem = 1px) */
  font-size: 6.25%;
}
body {
  /* resolves to 16px */
  font-size: 16rem;
}
h2 {
  /* resolves to 24px */
  font-size: 24rem;
}
h1 {
  /* resolves to 40px */
  font-size: 40rem;
}
```

For example:

```
1rem * 0.0625 = 0.0625rem = 0.0625 * 16 = 1px
2rem * 0.0625 = 0.125rem = 0.125 * 16 = 2px
4rem * 0.0625 = 0.25rem = 0.25 * 16 = 4px
8rem * 0.0625 = 0.5rem = 0.5 * 16 = 8px
```

I wouldn't recommend taking this approach, as older WebKit browsers historically had a minimum computed font size restriction of `9px`. So the root font size couldn't drop below this computed value, meaning the best that you could do is rely on the 62.5% trick (which resolves to a computed root font size of `10px`). See [this Twitter thread](https://twitter.com/jantimon/status/1512714756867637254) for more context. This is technically no longer an issue as of 2023, but it may cause issues for users on older devices and browsers.

## Should You Use This Technique?

We saw that this math trick doesn't fundamentally change font size scaling and is still accessible. But just because you *can* do something doesn't mean that you *should*.

In fact, there's one major drawback to using this approach that we haven't talked about yet: It makes it much harder to integrate with libraries that don't use this technique. For example, if your CSS has a root font size of 62.5%, and you import a library component that was styled under the assumption that `1rem = 16px`, then the computed values are going to be way off.

So while the 62.5% trick can be useful, I don't recommend using it unless you know you're never going to need to import other UI component libraries (or that other teams won't need to import your components into *their* code). Alternatively, you could opt to use an unstyled UI library and apply the styling yourself.

{% include "unsplashAttribution.md" name: "Annie Spratt", username: "anniespratt", photoId: "eIlJ2CtQezU" %}
