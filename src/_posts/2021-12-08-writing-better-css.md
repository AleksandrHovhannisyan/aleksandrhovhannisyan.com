---
title: Modern Techniques for Writing Better CSS
description: CSS has come a long way since the early days of web development. Using modern CSS strategies, you can write far fewer lines of CSS to accomplish tasks that previously required more lines of code.
keywords: [better css, modern css, fewer lines of css, css]
categories: [css, layout, practices]
thumbnail: thumbnail.png
commentsId: 126
---

CSS has come a long way since the early days of web development, when tables and various other hacks were used for layout and positioning. Today's developers can enjoy writing modern CSS that works in all major browsers, without having to bend over backwards to implement tricky layout requirements.

Not only does modern CSS make it easier to create dynamic layouts, but it also allows you to ship smaller (and simpler) stylesheets by removing unnecessary cruft. In this article, I want to review some common scenarios where modern techniques can significantly reduce the complexity of your code and allow you to write better CSS.

{% include toc.md %}

## Modern CSS: When Less Is More

### 1. Chaining Selectors with `:is` and `:where`

A common task in CSS is to apply some styling to multiple selectors. Perhaps you want to apply the same styling to an element's focus, hover, and ARIA states, like for a navigation link:

```css
.nav-link:focus,
.nav-link:hover,
.nav-link[aria-current="page"] {}
```

For each new selector, you need to repeat the base selector (`.nav-link`). While that may not seem like a big deal in this isolated example, it does add up the more you have to write CSS like this. It's even more verbose if you need to chain additional modifiers, like with `:not`:

```css
.button:not(.disabled):focus,
.button:not(.disabled):hover {}
```

The dev experience is not quite as bad in Sass thanks to the ampersand operator:

```scss
.nav-link {
  &:focus,
  &:hover,
  &[aria-current="page"] {}
}
```

But you still end up shipping the same amount of output CSS. It would be nice if we could cut down on the repetition and only specify the primary selector once. And it turns out that we can!

All major browsers now support the two pseudo-classes [`:is` and `:where`](https://developer.mozilla.org/en-US/docs/Web/CSS/:is). Both accept a comma-separated list of selectors to match, allowing you to write fewer lines of CSS to accomplish the same task as before. I'll discuss the differences between these two pseudo-classes [at the end of this section](#should-you-use-is-or-where), but for now, let's look at an example:

```css
.nav-link:is(:focus, :hover, [aria-current="page"]) {}
```

This selector will match all elements with the `nav-link` class that also have a `:focus` pseudo-class, a `:hover` pseudo-class, or an `aria-current` attribute equal to `"page"`. This allows you to consolidate all of your styling for the element under a single selector.

We can also refactor the second example, where we chained additional modifiers with `:not`:

```css
.button:not(.disabled):is(:focus, :hover) {}
```

This is great because it means that we don't have to repeat any intermediate classes or pseudo-classes—we only need to list them once and chain an `:is` or `:where` to supply an additional list of selectors to match.

The `:is` and `:where` pseudo-classes are even nicer in Sass since you don't need to retype the base selector at all and can just leverage the ampersand operator:

```css
.nav-link {
  /* base styling */

  &:is(:focus, :hover, [aria-current="page"]) {
    /* active styling */
  }
}
```

Here's another real-world example: If you've ever tried writing CSS to customize a syntax highlighter like Prism (like for a blog), then you know that you typically need to scope the token selectors aggressively, like this:

```css
.token.tag,
.token.keyword,
.token.someOtherThing {}
```

In some cases, the list of modifier classes can be quite long, meaning you're shipping more CSS than you really need to. Fortunately, with the `:is` pseudo-class, we only need to repeat the root class once:

```css
.token:is(.tag, .keyword, .someOtherThing) {}
```

#### Should You Use `:is` or `:where`?

The primary difference between `:is` and `:where` is that `:is` assumes the highest specificity from among its selector set, whereas `:where` always resolves to a specificity of zero. If all of the selectors in `:is` have the same specificity, this isn't a big deal. That's the case in the example we saw, where all of the selectors share [class specificity](https://web.dev/learn/css/specificity/#class-pseudo-class-or-attribute-selector):

```css
.nav-link:is(:focus, :hover, [aria-current="page"]) {}
```

But if one of the selectors is more specific, you'll get a higher overall specificity for the ruleset with `:is`. In that case, you may want to opt for `:where` instead to keep the specificity low and rely on the cascade for overrides.

Another key difference between the two is that `:where` is a forgiving selector, meaning that if one of its selectors is invalid, the whole selector set won't be invalidated. On the other hand, if you list an invalid selector in `:is`, the whole selector *will* be invalidated. You can learn more about the differences between these two in the [CSS Tricks article on `:where`](https://css-tricks.com/almanac/selectors/w/where/).

Generally speaking, I like to use `:where` for safe global CSS resets and `:is` for compound selectors. But there's no hard-and-fast rule for this. The key takeaway is that you now have two tools at your disposal for reducing repetition in CSS; which one you use will depend on your preferences, requirements, and conventions.

### 2. RTL Styling with Logical Properties and Values

If your app isn't internationalized and only supports a single locale (like `en-US`), then you probably don't find yourself differentiating between left-to-right (LTR) and right-to-left (RTL) text directionality when writing CSS. So you can safely use properties like `margin-left` and `padding-right`, text alignment values like `left` and `right`, absolute positioning, and so on.

But if your app is internationalized and needs to support multiple locales, then it's a completely different story. In the so-called **RTL locales**—like Arabic, Hebrew, and [various others](https://en.wikipedia.org/wiki/Right-to-left)—text flows from right to left rather than from left to right. As a rule of thumb, this means that most other visual elements on the page need to mirror themselves and flow in the same direction as the text (although there are rare exceptions to this rule).

The traditional approach to RTL styling is to first write your CSS from an LTR perspective and then scope the RTL styling using the attribute selector and [the `dir` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir). This typically involves using **physical properties and values**, which refer to a fixed cardinal direction ("top", "right", "bottom", and "left"). Here's an example of how that might be done:

```css
.element {
  /* LTR CSS */
  margin-left: 8px;
}
html[dir="rtl"] .element {
  /* RTL CSS */
  margin-left: unset;
  margin-right: 8px;
}
```

In LTR mode, our element has a left margin. In RTL mode, it needs to have a right margin. So we unset the left margin and apply the same value as a right margin. This works because the LTR and RTL rulesets are mutually exclusive (and the RTL version has a higher specificity). But this gets very tedious and repetitive the more you have to do it, and you end up having to ship way more CSS than you actually need.

Below are a few more examples of physical properties that you've probably used:

- `margin-[top|right|bottom|left]`
- `padding-[top|right|bottom|left]`
- `border-[top|right|bottom|left]`

However, instead of using physical properties and values, we can take advantage of the fact that CSS also supports **logical properties and values**, which refer to semantic regions—like "start" and "end"—that automatically respect the page's text direction. For example, the following yields the same result as before but with significantly fewer lines of CSS:

```css
.element {
  margin-inline-start: 8px;
}
```

Logical properties typically consist of three parts: the property name (`margin`), the writing mode direction ([`block` vs. `inline`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties#block_vs._inline)), and the generic location (`start` or `end`). So a property like `border-left-color` would become `border-inline-start-color`. In LTR mode, `start` translates to `left`. In RTL mode, it translates to `right`. Both versions of the UI look just as you'd expect them to, but you only need to write a single ruleset to accommodate both.

Of all the recent improvements to CSS, the introduction of logical properties is probably one of my favorites. Even if your app doesn't currently support RTL, you can still use logical properties and values because they work seamlessly for LTR, with the added benefit of future-proofing your app in case you ever *do* internationalize it. There are no downsides to using logical properties; all it requires is a shift in perspective.

You won't appreciate the savings from this kind of a refactor until you have to do it in a large code base. Just this year, I put in a PR at work to use logical properties and values (since our app supports RTL), and I ended up removing nearly 500 net lines of unnecessary CSS:

{% include img.html src: "pr.png", alt: "The header metadata for a pull request, showing 6 commits, 80 files changed, 236 lines added, and 709 lines deleted." %}

There are [many other logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) that you can use. Below is just a small sampling:

- `margin-inline-start`
- `padding-inline-end`
- `margin-block-start`
- `border-inline-start`
- `border-inline-start-width`
- `border-inline-start-color`

There are even CSS properties that automatically adjust based on the document's writing mode, like [`inline-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size) instead of `width` and [`block-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/block-size) instead of `height`. There are also logical *values*, like `start` and `end` for text alignment or `start` and `end` for flex/grid alignment and justification. However, it's also worth noting that certain physical properties and values do not have a logical equivalent. Some examples include transform translations, box shadow offsets, and absolute positioning.

Certain other logical values are experimental and are only supported in a limited number of browsers as of this writing. One such example is direction-aware floating with the `inline-start` and `inline-end` values. As always, be sure to check browser compatibility before refactoring any existing CSS in your code base.

### 3. Writing Fewer Media Queries with Clamp

Another common requirement is to have elements change their styling between two breakpoints, perhaps for font sizing:

```css
.element {
  font-size: 1rem;
}
@media screen and (min-width: 768px) {
  .element {
    font-size: 1.25rem;
  }
}
```

Certain layout changes cannot be achieved without media queries. But for numerical properties—like spacing, font sizing, dimensions, and so on—you may actually want to scale the value linearly between two breakpoints rather than having it jump from one discrete value to another. Fortunately, if you write modern CSS, you can take advantage of [the `clamp` utility function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()) to declare values that **scale fluidly** between a minimum and a maximum.

#### How `clamp` Works

While it may seem complicated, `clamp` is actually rather straightforward. It's a function that takes three arguments: a minimum value, a preferred value, and a maximum value (in that order):

```css
.element {
  property: clamp(<min>, <preferred>, <max>);
}
```

`clamp` attempts to return the preferred value, so long as that value lies between the minimum and maximum. If the preferred value overshoots, `clamp` returns the maximum. If the preferred value undershoots, `clamp` returns the minimum. Hence the name—the preferred value is *clamped* between a ceiling and a floor. Under the hood, this is equivalent to chaining the `min` and `max` functions separately.

At first glance, `clamp` may not seem useful, especially if you consider an example like this:

```css
.element {
  font-size: clamp(12px, 16px, 20px);
}
```

In this case, `clamp` will always return `16px` since that's a static value. Where `clamp` *really* shines is when you give it a **dynamic preferred value**. And one way to do that is to use viewport units (`vw`), where `1vw` is defined to be one percent of the current viewport width. If the viewport is `400px` wide, then `1vw` evaluates to `4px`. The keyword here is "evaluates"—whenever the viewport width changes, the browser needs to recompute the value and resolve it to a CSS pixel. And this is the key ingredient that allows us to replace media queries with [linearly interpolated](https://en.wikipedia.org/wiki/Linear_interpolation) values.

The best way to understand how this works is to visualize it. Check out Adrian Bece's [Modern Fluid Typography Editor](https://modern-fluid-typography.vercel.app/) to get a better feel for how `clamp` works:

{% include img.html src: "fluid-typography-editor.jpg", alt: "Adrian Bece's Fluid Typography editor tool. A sidebar contains toggles and inputs for root font size, min size, max size, and fluid size. The main content region shows a plot of the clamping function, which starts at a y-intecept corresponding to the minimum, extends horizontally for a few units, and then scales linearly up to a maximum.", caption: "The leftmost horizontal line represents the minimum value returned by `clamp`; the rightmost horizontal line corresponds to the maximum. Between these two endpoints is the preferred value, which scales upward linearly.", isCaptionAriaHidden: true %}

So, if we set our preferred value in `vw` units, clamp will guarantee that it never falls outside the bounds of the min and max, while the nature of viewport units will allow the value to scale fluidly between those two endpoints. Here's an example:

```css
.element {
  font-size: clamp(1rem, 4vw, 1.25rem);
}
```

This says:

- The element's font size should be at least `1rem`.
- The element's font size should be at most `1.25rem`.
- The element's preferred font size is `4vw`, which depends on the viewport width.

Why did I pick `4vw`? And more generally, how do you pick the right value for `clamp`? It turns out that you can do a bit of math to figure this out. I prefer to start by phrasing my requirement like so: "I want my element to have a minimum font size of `16px` at a mobile width of `400px` and to scale up from there." In that case, `16 / 400 = 0.04`, or `4vw`. So on mobile, the element's preferred font size is equal to its minimum, or `1rem`. As the viewport width increases, the font size will increase fluidly, up until it hits a maximum allowed value of `1.25rem`.

Keep in mind that while the examples I showed here are for font sizing, `clamp` can be applied to any numerical properties, including padding, margin, borders, and much more. I encourage you to experiment with `clamp` to see if it's right for your designs.

#### The Limitations of `clamp`

There are some caveats to using `clamp` that I want to briefly touch on.

While fluid scaling looks great, it may not be the right tool for the job if your design does not account for this behavior. So you may actually want to flip a property between two discrete states rather than allowing it to scale linearly, in which case media queries are your only option.

Additionally, `clamp` is not suitable if you want a value to *decrease* as the viewport width increases; this is because an inverse viewport width unit does not yet exist. As an alternative, you may be tempted to try an expression like `clamp(min, calc(1px / 4vw), max)`, but that won't work as far as I can tell.

In short, it's important to understand that while `clamp` is useful and has many applications for creating fluidly scaling designs, it's not a drop-in replacement for media queries.

### 4. Simplifying Layouts with Gap

Before CSS grid, the only viable option for creating dynamic layouts on the web was Flexbox. But it had one major limitation: lack of support for gaps. Whereas design tools supported the notion of gaps, CSS did not, and most stylesheets relied on margins to space flex children apart. This usually involved inconvenient hacks to exclude the last flex item from the selector list:

```css
.flex-item:not(:last-of-type) {
  margin-right: 8px;
  margin-bottom: 8px;
}
```

But there was no way to exclude the last *row* of the flex layout from getting bottom margins, meaning your flex layout had unnecessary spacing underneath it. Sure, you could offset this with [negative margins at the layout level](https://www.rawkblog.com/2019/01/flexbox-gutters-negative-margins-solved/). But at that point, you end up having to write too much CSS to accomplish such a seemingly simple task.

{% aside %}
  Generally speaking, I also like to avoid using margins at the child level in layouts. The reason for this is that children should not dictate how their siblings are positioned in the layout—that's the layout's job! You can learn more about this in Max Stoiber's article on why [margin is considered harmful](https://mxstbr.com/thoughts/margin/). However, it's worth noting that there are good exceptions to this rule, such as for spacing elements in an article layout. Gaps offer uniform spacing, which is not always what you want.
{% endaside %}

Nowadays, this is no longer an issue because [Flexbox gaps are supported in all major browsers](https://caniuse.com/flexbox-gap). Safari used to be the odd one out and held the web back for a while, but it's supported Flexbox gaps since version 14.1. This means that unless you need to support older browsers, you can easily get away with writing simple and declarative CSS like this:

```css
.flex-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

Alternatively, you could use grid, which also supports gaps and auto-wrapping columns:

```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(some-min, 1fr));
  gap: 8px;
}
```

Either way, you no longer have to worry about the spacing at the edges of the layout—the browser automatically performs these calculations for you and spaces the children accordingly to distribute the gap only between adjacent siblings. If your layout doesn't need to wrap, there won't be any unnecessary spacing along its outer edges. Moreover, since flex and grid layouts automatically flip themselves for RTL, this makes them perfect for creating RTL-safe layouts since you don't have to worry about text directionality.

## CSS Is Only Getting Better

While new frameworks and libraries are born every minute, CSS will always be here to stay, and it's only getting better each year. CSS has many promising developments on the horizon, including [leading-trim](https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries), [relative colors](https://blog.jim-nielsen.com/2021/css-relative-colors/), and many other exciting features. Now is one of the best times to be writing CSS. And the more you learn about the language, the more you'll be able to simplify your styling and write cleaner CSS.
