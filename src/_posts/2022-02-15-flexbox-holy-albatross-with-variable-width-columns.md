---
title: Flexbox Holy Albatross with Variable-Width Columns
description: The Holy Albatross technique allows a flex container to auto-wrap from multiple columns to a single column at a target container width. Let's modify the original code to control the number and widths of columns.
keywords: [holy albatross]
categories: [css, flexbox, layout]
thumbnail:
  url: https://images.unsplash.com/photo-1562073970-0c7e6b68428b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

I recently took the time to learn how Heydon Pickering's [Flexbox Holy Albatross](https://heydonworks.com/article/the-flexbox-holy-albatross/) works so I could use it on my own site in lieu of container queries. In the process of implementing the technique, I realized that I would sometimes need to force a particular child in the layout to always span the full width of its row rather than getting pulled in alongside other siblings. To accomplish this, I implemented a variation of the Holy Albatross technique that allows you to control the number of columns at either the layout or child level.

## Recap: What Is the Flexbox Holy Albatross?

If you're already familiar with the technique and how it works, feel free to skip ahead to the section on [controlling the number of columns](#controlling-the-number-of-columns).

"Holy Albatross" is a term coined by [Heydon Pickering](https://heydonworks.com/) to describe a CSS technique where a flex container automatically switches from a multi-column layout to a single column at a target container breakpoint. This method was later incorporated into Every Layout and dubbed [The Switcher](https://every-layout.dev/layouts/switcher/). The code below is a slightly modified version of the one in Heydon's article; it includes some auxillary variables to clarify what's going on, but note that those intermediate variables are not necessary:

```css
.switcher {
  display: flex;
  flex-wrap: wrap;
  --sign-flag: calc(var(--breakpoint, 40rem) - 100%);
  --multiplier: 999;
}
.switcher > * {
  min-width: 33%;
  max-width: 100%;
  flex-grow: 1;
  flex-basis: calc(var(--sign-flag) * var(--multiplier));
}
```

The layout specifies a target container breakpoint (`--breakpoint`) at which it should switch from a multi-column arrangement to a single column; this value can be overridden as needed. *How* and *when* the layout wraps its children is determined by the combination of `min-width`, `max-width`, and `flex-basis` set on the flex children. In this example, each child is given a `min-width` of `33%`, yielding three columns at most. Each child is also given a `max-width` of `100%`, meaning that when the layout width becomes sufficiently narrow, each flex child will occupy its own row.

The trick relies on the fact that if a flex item's `flex-basis` is negative or zero, then its `min-width` will take effect. Conversely, if the `flex-basis` is positive and exceeds the child's `max-width`, then the `max-width` will win out.

In practice, this "switching" behavior is achieved by subtracting `100%`—the current width of the layout—from the target breakpoint. This produces a positive, negative, or zero value:

```css
.switcher {
  --sign-flag: calc(var(--breakpoint, 40rem) - 100%);
}
```

Or, in simpler terms:

```
signFlag = breakpoint - 100%
```

This variable is:

1. Positive when `100% < breakpoint` (the container is narrower than the breakpoint).
2. Negative when `100% > breakpoint` (the container is wider than the breakpoint).
3. Zero when `100% === breakpoint` (the container's width matches the target breakpoint).

We then multiply this sign flag by an arbitrarily large value (`999`) to scale it to either extreme—*very negative* or *very positive*—and apply this as the `flex-basis` for each child:

```css
.switcher > * {
  flex-basis: calc(var(--sign-flag) * var(--multiplier));
}
```

When the calculation yields a negative or zero flex basis, each child spans three columns (`min-width: 33%`). When the calculation yields a positive flex basis, each child spans the full width of the layout (`max-width: 100%`). The table below explores a few scenarios:

<table>
  <thead>
    <tr>
      <th scope="col" class="nowrap numeric">Container width</th>
      <th scope="col" class="nowrap numeric">Breakpoint</th>
      <th scope="col" class="nowrap numeric">flex-basis</th>
      <th scope="col" class="nowrap numeric">min-width</th>
      <th scope="col" class="nowrap numeric">max-width</th>
      <th scope="col" class="nowrap">Columns</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="nowrap numeric"><code>41rem</code></td>
      <td class="nowrap numeric"><code>40rem</code></td>
      <td class="nowrap numeric"><code>-999rem</code></td>
      <td class="nowrap numeric"><code>33%</code> (<code>13.53rem</code>)</td>
      <td class="nowrap numeric"><code>100%</code> (<code>41rem</code>)</td>
      <td class="nowrap numeric"><code>3</code></td>
    </tr>
    <tr>
      <td class="nowrap numeric"><code>40rem</code></td>
      <td class="nowrap numeric"><code>40rem</code></td>
      <td class="nowrap numeric"><code>0rem</code></td>
      <td class="nowrap numeric"><code>33%</code> (<code>13.2rem</code>)</td>
      <td class="nowrap numeric"><code>100%</code> (<code>40rem</code>)</td>
      <td class="nowrap numeric"><code>3</code></td>
    </tr>
    <tr>
      <td class="nowrap numeric"><code>39rem</code></td>
      <td class="nowrap numeric"><code>40rem</code></td>
      <td class="nowrap numeric"><code>999rem</code></td>
      <td class="nowrap numeric"><code>33%</code> (<code>12.87rem</code>)</td>
      <td class="nowrap numeric"><code>100%</code> (<code>39rem</code>)</td>
      <td class="nowrap numeric"><code>1</code></td>
    </tr>
  </tbody>
</table>

It's important to emphasize that this entire technique relies on the container width rather than a viewport width; the latter is not very useful when you want to create a truly reusable container that adjusts its behavior based on the context in which it is rendered.

{% aside %}
  Technically, as Heydon notes in [The Flexbox Holy Albatross Reincarnated](https://heydonworks.com/article/the-flexbox-holy-albatross-reincarnated/), you don't actually need `min-width` and `max-width` and can rely on the beauty of the Flexbox algorithm to pull in any number of children, wrapping them only as needed.
{% endaside %}

## Controlling the Number of Columns

In the original article, Heydon used the example of a three-column layout, which as we saw is achieved by setting `min-width: 33%` on the flex children. What if we could abstract this into a custom property specifying the number of desired columns in the layout and derive the percentage from that value? Perhaps something like this:

```css {data-copyable=true}
.switcher > * {
  min-width: calc(100% / var(--columns, 3));
  /* all other CSS from before */
}
```

This layout has `3` columns per row by default, but we can override that value later.

If we add gaps to our layout, we'll need to factor those into the `min-width` calculation:

```css {data-copyable=true}
.switcher {
  --gap: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
}
.switcher > * {
  --num-gaps: calc(var(--columns, 3) - 1);
  min-width: calc(calc(100% / var(--columns, 3)) - var(--num-gaps) * var(--gap));
}
```

More generally, a gapped layout with `n` columns has `n - 1` gutters. We multiply this by the size of each gap (`--gap`) to get the final, accurate `min-width` for each flex child.

Here's a demo of what the default UI might look like:

<div class="col-wrap col-3" role="img" aria-label="A grid of 9 items">
  {% for i in (1..9) %}
  <div style="background-color: var(--color-surface-3); aspect-ratio: 16/9;"></div>
  {%- endfor %}
</div>

Finally, we can set up utility classes to switch the number of columns at either the layout level or on any individual child:

```css {data-copyable=true}
.col-1 {
  --columns: 1;
}
.col-2 {
  --columns: 2;
}
/* etc */
```

When set at the layout level, this dictates the maximum number of columns globally:

```html
<!-- An auto-wrapping flex layout with 2 columns max -->
<div class="switcher col-2"></div>
```

<div class="col-wrap col-2" role="img" aria-label="A grid of 6 lightly shaded tiles, each row containing two columns.">
  {% for i in (1..6) %}
  <div style="background-color: var(--color-surface-3); aspect-ratio: 16/9;"></div>
  {% endfor %}
</div>

But where it gets interesting is if we set it on a specific child:

```html
<div class="switcher">
  <div></div>
  <div></div>
  <div></div>
  <div class="col-1"></div>
  <div></div>
  <div></div>
</div>
```

Rather than defining a column span like in a traditional grid layout, this utility class tells the parent how many columns it should create on that child's row. In this case, even though the layout allows for a maximum of three columns, the fourth child will always be on its own row (`--columns: 1`):

<div class="col-wrap col-3" role="img" aria-label="A grid of 6 lightly shaded tiles. The first row contains three tiles arranged side by side. The second row contains one tile that spans the full width of the layout. The last row contains two equal-width tiles.">
  {% for i in (1..6) %}
  <div style="background-color: var(--color-surface-3); aspect-ratio: 16/9;" {% if i == 4 %} class="col-1"{% endif %}></div>
  {% endfor %}
</div>

All other children will obey the default number of columns, unless they have room to grow (like that last row, where only two children can fit).

That's it! This modified version of the Flexbox Holy Albatross technique allows you to create auto-switching layouts with granular control over the number of columns on any particular row.

{% include unsplashAttribution.md name: "Karin Hiselius", username: "silverkakan", photoId: "EROxfjSym1g" %}
