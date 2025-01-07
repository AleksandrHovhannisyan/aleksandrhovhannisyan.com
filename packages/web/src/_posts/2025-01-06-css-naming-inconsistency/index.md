---
title: CSS Has a Naming Problem
description: Naming things can be difficult, and CSS has no shortage of poorly named properties and values.
categories: [essay, css]
keywords: [css, confusing]
---

{% quote "Comment by [deleted] on r/ProgrammingHumor", "https://www.reddit.com/r/ProgrammerHumor/comments/16evh4/comment/c7vokn6/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" %}
I believe there are 11 hard things [in computer science]: cache invalidation, naming things, off by one errors, and understanding binary. 
{% endquote %}

Developers like to joke that [naming things](https://martinfowler.com/bliki/TwoHardThings.html) is one of the hardest problems in computer science, but it's true: Put two people in a room and ask them to come up with a name that describes something accurately, and they'll almost certainly argue with each other—until, after decades of warring, they reach an agreement. Eventually, a third person will come along who disagrees so much that he'll write an entire essay complaining about it.

## The Many Ways to Wrap

Do you know the differences between these properties?

- `overflow-wrap`
- `text-wrap`
- `word-wrap`
- `word-break`

Text and word? Wrap and break? These all sound so similar! But they differ in subtle ways. At the end of the day, you're probably only going to use these two properties:

1. `text-wrap` to enable/disable wrapping and the algorithm used.
2. `overflow-wrap` to control how and when/where individual words break.

Meanwhile, `word-wrap` is deprecated, and `word-break` is the older version of `overflow-wrap`... [Well, sort of.](https://stackoverflow.com/a/61866696/5323344)

Confused yet? Don't worry, it gets worse! See, some of these properties accept the same values (or at least they used to):

```css
body {
    overflow-wrap: break-word;
    word-break: break-word;   /* deprecated but not really */
}
```

In most cases, I've found `overflow-wrap: break-word` to be sufficient. But there are edge cases where it doesn't work. For example, at the time when I wrote this article, [Safari still had a bug with `overflow-wrap`](https://github.com/rachelandrew/gridbugs/issues/46) where it wouldn't work in CSS Grid containers; you'd need to use `word-break`... Which suggests that `overflow-wrap: break-word` and `word-break: break-word` _don't_ do the same thing.

### It's `pretty` Confusing

While we're on the topic of wrapping, let's talk a bit more about `text-wrap`.

In 2023, Chrome released two new values for the `text-wrap` property: `balance` and `pretty`. Whereas `text-wrap: balance` ensures that all lines of text in a paragraph have roughly the same length (creating visual _balance_), `text-wrap: pretty` prevents [word orphaning](https://fonts.google.com/knowledge/glossary/widows_orphans), where the last sentence might wrap in such a way that it only has one or two short words. With `text-wrap: pretty`, the browser's rendering engine will wrap a few words from the previous sentence to fix orphaning.

These new properties are some of the best enhancements to typography in modern CSS. For the longest time, stylesheet authors had no good solutions to word orphaning—either you'd use JavaScript to programmatically redistribute lines of text, or you'd truncate your content (or content width) to make it look balanced, only for orphaning to reappear on other screen sizes. But that's no longer a concern.

However, I don't think `pretty` was the clearest naming choice. Sure, `balance` _balances_ text visually, distributing lines evenly. But "pretty" is too open ended. What does it mean for text to wrap in a way that's "pretty"? For example, is balanced text somehow _not_ considered pretty? Is beauty not in the eye of the beholder?

[I've been complaining about this since it landed in Chrome](https://x.com/hovhaDovah/status/1724488515931521028). It's not a hill I'm willing to die on, but it bothers me that a single browser can implement something like this and force everyone else to adopt their chosen naming convention. It would've been slightly clearer if instead `pretty` were named `no-orphans`, although that still wouldn't be entirely accurate because `balance` technically _also_ removes orphaned words as a side effect of balancing lines of text.

In his article on [balancing text in CSS](https://ishadeed.com/article/balancing-text-css/), design engineer Ahmad Shadeed agrees:

{% quote "10. The pretty value naming", "https://ishadeed.com/article/balancing-text-css/#the-pretty-value-naming" %}
I think that the pretty value name is confusing. What does it mean? To make a (sic) text look pretty?
{% endquote %}

Instead, he proposes a new API that allows you to control the _degree_ or _intensity_ of the wrapping behavior. Something like this:

```css
.element {
    text-wrap-style: balance;
    text-wrap-ratio: 0.5;
}
```

I think that's a pretty clever solution.

## Rows and Columns

Flexbox and CSS Grid are two important layout algorithms that work in similar but fundamentally different ways. Whereas Flexbox distributes items along a single axis and mostly relies on intrinsic sizing, growing, shrinking, and wrapping, CSS Grid is a two-axis layout mode that allows items to be positioned on either axis, with explicit sizing for rows and columns. (That's a bit of an oversimplification, but it's sufficient for the purposes of this discussion.)

Both of these algorithms have a default axis of distribution, which you can change using either `flex-direction` or `grid-auto-flow`. The problem is that the terms "row" and "column" mean different things in Flexbox than they do in CSS Grid:

<div class="scroll-x">
    <table id="table-1">
        <thead>
            <tr>
                <th scope="col">Rule</th>
                <th scope="col">Axis of distribution</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>flex-direction: row</code></td>
                <td>Horizontal</td>
            </tr>
            <tr>
                <td><code>flex-direction: column</code></td>
                <td>Vertical</td>
            </tr>
            <tr>
                <td><code>grid-auto-flow: row</code></td>
                <td>Vertical</td>
            </tr>
            <tr>
                <td><code>grid-auto-flow: column</code></td>
                <td>Horizontal</td>
            </tr>
        </tbody>
    </table>
</div>

CSS Grid more accurately captures the meaning of the words "row" and "column," especially in the context of tabular layouts, but the fact that Flexbox interprets these terms differently is confusing.

Essentially, `flex-direction: row` says that items should be distributed _within_ a row, meaning horizontally in a horizontal writing mode. But part of the problem is that Flexbox technically doesn't have the same kinds of "rows" and "columns" that Grid does; it only has a primary and cross axis, and they swap places when switching from `flex-direction: row` to `flex-direction: column`. Plus, flex items can't break out of a row and position themselves along a column like they can in CSS Grid, where _true_ rows and columns do exist (and are always fixed axes).

It's easy to criticize Flexbox in hindsight, but at the time when Flexbox was first implemented, CSS Grid didn't even exist yet. My guess is that the CSS Working Group chose the terms "row" and "column" to wean developers off of table-based layouts—the familiarity of these terms would've made the new API easier to adopt. But now that logical properties and values have gained widespread adoption, I think it would make more sense for Flexbox to use `flex-direction: inline` and `flex-direction: block`—there's no need for terms like "row" and "column" when CSS already has terms that describe these axes.

## Alignment

Speaking of Flexbox and CSS Grid, we need to talk about `align-items` and `justify-content`. Well, we actually need to talk about these four properties:

- `align-items`
- `align-content`
- `justify-items`
- `justify-content`

Most of the time, I use `align-items` and `justify-content`, and I pretend that the other two don't exist because I've simply never needed them.

Again, the naming here is confusing ([care for a mnemonic?](https://css-tricks.com/a-quick-way-to-remember-difference-between-justify-content-align-items/)). For starters, both "align" and "justify" are words one might use to describe how items are _aligned_ along a reference axis. For example, text editors often have an _alignment_ control, with values of start, center, end, and _justify_. Even CSS has `text-align: justify`, which hilariously mixes these two terms in one rule. Second, the distinction between "item" and "content" isn't always obvious. Sure, they're different words, but you could use them interchangeably in certain contexts. "Content" is also too broad—it could refer to the flex items themselves or the entire flex "row" or "column."

I won't waste your time by explaining these terms; instead, I'll refer you to Josh Comeau's [Interactive Guide to Flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/). But I have to admit that even with hands-on demos and visuals like the ones in that article, I always forget how these properties work and have to look up what they do.

## Text Decoration

Here's an interesting one:

```css
a {
    text-decoration-line: underline; /* okay */
    text-decoration-thickness: 1px;  /* okay */
    text-underline-offset: 1px;      /* ??? */
}
```

Why do we refer to it as a _decoration_ in one property but _underline_ in another? Why not just support a `text-decoration-offset` property that works with all decorations? We can change the offset of underlines, but for some reason we can't change the offset of overlines or strikethroughs:

```css
.element {
    text-decoration-line: overline;
    text-decoration-offset: 1px;    /* invalid property */
}
```

Taking this a step further, why are `overline`, `underline`, and `strike-through` separate values when they're all just a horizontal line with different vertical positioning? It would make more sense if all decoration styles could be `offset` by a certain positive or negative amount, or even positioned vertically with keyword values like `center`, `top`, or `bottom`:

```css
/* Purely hypothetical */
.element {
    text-decoration-style: line;
    text-decoration-position: <length>|center|top|bottom;
}
```

{% aside %}
One reason could be that the default positioning of text underlines depends on the typeface being used, whereas overlines and strikethroughs don't need to worry about how the line clips descenders because they're nowhere _near_ the descenders.
{% endaside %}

## Hyphenation

To conclude this article, let's revisit our old friend `text-wrap`:

```css
.no-wrap {
    text-wrap: nowrap;
}
```

As far as I'm aware, `nowrap` is the only multi-word CSS value that isn't hyphenated, unlike the following examples:

- `overflow-wrap: break-word`
- `display: inline-block`
- `display: list-item`
- `justify-content: space-[between|around|evenly]`

This discrepancy is as old as CSS itself, and it's here to stay. It's something that you'll eventually get used to and forget about until you accidentally make a typo.

Moreover, `text-wrap: nowrap` is redundant. I should just be able to say:

```css
.no-wrap {
    text-wrap: none;
}
```

After all, I'm already setting the `text-wrap` property; I shouldn't have to restate that I want "no wrapping." This would also be more consistent with other CSS properties that support a value of `none`, like `display` and `text-decoration`.

## It Could Be Worse

I don't want you to get the wrong idea. CSS is a lovely language: It's a paintbrush that, in the right hands, can turn the blank canvas of the web into a beautiful work of art. (Or, in the wrong hands, an embarrassing mistake.) Sure, it's a bit rough around the edges, but those inconsistencies are just a natural consequence of a language that's had multiple contributors over decades—it's not perfect and probably never will be. However, I do hope that CSS won't _continue_ to introduce confusing terminology—there's already plenty of that to go around.
