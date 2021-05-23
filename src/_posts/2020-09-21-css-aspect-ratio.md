---
title: "Responsive Aspect Ratios in CSS with Percent Padding"
description: Learn how to give any element on your page a responsive aspect ratio, using a CSS trick with percentage padding.
keywords: [aspect ratio, padding percentage]
tags: [dev, css, math]
is_popular: true
last_updated: 2021-02-26
comments_id: 58
---

If you're not sure how to define aspect ratios in CSS, or if you have no clue what an "aspect ratio" is to begin with, then you're in luck! This tutorial covers everything that you need to know about creating aspect ratio boxes in CSS, including all the whys and hows of the underlying mechanics.

Here's the short version: Using percentage values for padding, we can give any element a responsive aspect ratio in just a few lines of CSS. This allows you to create `nxn` square grid layouts, responsive embeds that scale with the device width, and much more. Below are some examples of popular aspect ratios, rendered using HTML and CSS:

<ul class="tiles">
  <li class="tile aspect-ratio-1-1" data-ratio="1:1"></li>
  <li class="tile aspect-ratio-4-3" data-ratio="4:3"></li>
  <li class="tile aspect-ratio-3-2" data-ratio="3:2"></li>
  <li class="tile aspect-ratio-16-9" data-ratio="16:9"></li>
</ul>

In the sections that follow, we'll look at what *aspect ratio* means and how to define one using CSS.

{% include toc.md %}

## What Is an Aspect Ratio?

An **aspect ratio** describes the relationship between an element's width and height. Aspect ratios (and mathematical ratios in general) are usually expressed using a colon, like `16:9` or `4:3`. You can also use fractional notation since ratios are just proportions: `16/9` and `4/3`.

Intuitively, an aspect ratio of `16:9` says that an element has `16` units of width for every `9` units of height. For example, if an element has an aspect ratio of `4:3` and is `32` units wide, then its height must be `24`. Squares are one of the best examples of this behavior—they have an aspect ratio of `1:1`, meaning their width and height are always the same!

If we know an element's aspect ratio and only one of its dimensions, we can easily compute the other dimension. So, if we want an element to have an aspect ratio of `4:3` and its height is `90px`, then we know that its width should be `90 * 4 / 3 = 67.5px`.

### The Utility of Aspect Ratios

Aspect ratios are useful because they allow us to change one dimension of an element (like its width) while the other one scales accordingly, without us having to worry about the math.

Sound familiar? If you've ever worked with images in a browser, then you know that this is their default behavior—if you change the width or height of an image with CSS but don't touch the other dimension, it will scale accordingly such that the image maintains its **intrinsic aspect ratio**, which is the image's original width divided by its original height. For example, an image that's originally `500px x 300px` has an intrinsic aspect ratio of `500 / 300 = 5/3`, or `5:3`.

With the release of the `aspect-ratio` property in Chrome 88, you can view this behavior in your browser using dev tools by inspecting an image that has an explicit `width` and `height` set. The browser preserves the image's aspect ratio as you resize the page:

<figure>
  {% include img.html img="default-aspect-ratio.png" alt="The default aspect ratio for an image is observed to be 500 / 300 in Chrome dev tools." width="1290" height="414" %}
  <figcaption>Photo credit: <a href="https://unsplash.com/photos/og0C_9Mz6RA">Bill Stephan, Unsplash</a></figcaption>
</figure>

> We'll briefly look at this new CSS property [in a future section](#the-future-of-css-aspect-ratios-aspect-ratio). For now, we'll learn how to enforce an element's aspect ratio the old-fashioned way since it's the only one that's supported by all browsers, as of this writing.

While images are the most popular example where aspect ratios come in handy, they're not the only ones. You can also use aspect ratios to size YouTube videos appropriately so that they never become too narrow or too tall. And, of course, you can use aspect ratios to create dynamically sized squares with CSS. This lets you implement designs like the once-dreaded [3x3 grid](#example-3-a-3x3-square-grid-of-images-cropped).

## Responsive Heights in CSS with Aspect Ratios

In this tutorial, we'd like to allow an element's width to change dynamically as the screen width shrinks or widens, but we'd also like to give the element a height that will allow it to maintain a certain aspect ratio **regardless of its width**. For this reason, it helps to invert the aspect ratio and express the element's *height* as a fraction of its *width*. For an aspect ratio of `16:9`, this means we're looking at the inverse ratio `9:16`, which translates to the following:

> *For every 9 units of height, there should be 16 units of width.*

Notice that **we haven't actually changed the definition of aspect ratio**—it's just two sides to the same coin. We can either think of aspect ratio as expressing an element's width relative to its height, or we can think of it as expressing the height relative to the width. The latter is going to be more useful for our purposes because we want to let the width of our element change with the device width, but we need some way to express the height relative to that dynamic width so that the aspect ratio is preserved.

In particular, this shift in perspective allows us to answer the following question: How many units of height do we need *per units of width*? Well, for an aspect ratio of `16:9`, we know that this is just `9 height / 16 width`, which comes out to `0.5625 height/width`. Expressed as a percentage, this ratio tells us that the height of the element will always be `56.25%` of its width.

Thus, given an element's width, all we have to do is multiply it by the percentage we worked out above, and we'll get the height that is needed in order for the element to maintain a certain aspect ratio (in this case, `16:9`). Now, all we need is some way to define an element's height as a percentage of its dynamic width, using CSS. And that's where percentage padding comes into play.

## How to Define Aspect Ratios in CSS

For starters, we can't just do this:

```css
.element {
  height: 56.25%;
}
```

Percentage values for the `height` CSS property are relative to the height of an element's [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block), or its nearest block-level parent. What we want, though, is for an element's height to be expressed as a percentage of *its own width*. How do we do that if there's no way for an element to reference its own width in CSS? Plus, we intentionally want the element's width to be *dynamic*, rather than some hard-coded, fixed value like `500px`.

Interestingly, for reasons that we'll [explore later](#why-it-works-padding-percentages-and-aspect-ratios), percentage values for `padding` (and also `margin`!) are relative to the width of an element's containing block—which, again, is just the nearest block-level parent. For example, if an element's containing block has a width of `500px`, then a child element with `padding: 10%` will get `50px` of padding all around.

Specifically, we're interested in **vertical padding** since it influences an element's height. See where this is going? We can zero-out an element's height and give it a vertical padding equal to the aspect ratio percentage. For example, for an aspect ratio of `16:9`, we'd do:

```css
.element {
  height: 0;
  padding-bottom: 56.25%; /* or top, doesn't matter */
}
```

More generally, we can define an element's aspect ratio using four simple steps:

1. Set the element's width to be its containing block's width: `width: 100%`.
2. Forcibly zero-out the element's height so that only vertical padding influences its height.
3. Set the element's vertical padding to be `(h / w) * 100` percent, for an aspect ratio of `w:h`.
4. Relatively position the element and absolutely position all of its children so they don't influence its height.

In plain English, all we're doing is setting an element's height using padding alone. Step one is optional if the element we're sizing is already a block-level element, like a `<div>`. Step three just expresses the element's height as a percentage of the containing block's width. Since the child element stretches to fill `100%` of its containing block, this is the same as **defining the element's height as a percentage of its own width**. This is the definition of aspect ratio!

### What's the Difference Between a Containing Block and a Parent?

Before we look at some examples, I want to clarify something. Above, you may have noticed that I used the term *containing block* instead of *parent*. Most tutorials will use the term "parent," but this is technically inaccurate in the context of percentage padding.

An element's **containing block** is its nearest block-level parent. This could be anything that's a block-level element by default—like a `<div>`, a paragraph, a heading, and so on—or even an inline element (e.g., `<span>` or `<a>`) that has `display: block` set via CSS.

Basically, it's important to make this distinction because an element's immediate parent need not *always* be a containing block. This could happen if the parent is an inline element or if it's using `display: inline` in its CSS.

The W3 specification defines percentage padding as relative to the width of an element's *containing block*, not just to any *parent*. For accuracy and consistency, I'll continue to use the term "containing block" throughout this article.

Anyway, enough boring definitions! Time to look at some examples of aspect ratios in CSS.

### Example 1: YouTube Videos

Let's say you want to embed a YouTube video on your page, and you know that [YouTube videos have an aspect ratio of `16:9`](https://support.google.com/youtube/answer/6375112). But you don't want to give the iframe a *fixed* width and height—rather, you want its width to fill its container and for its height to scale responsively, maintaining the element's `16:9` aspect ratio:

<div class="tile aspect-ratio-16-9" data-ratio="Pretend this is a YouTube iframe" aria-hidden="true"></div>

We can do this using the padding trick that we learned. To create an aspect ratio of `16:9`, we set the element's height to be zero and its vertical padding to be `9 / 16 * 100 = 0.5625 * 100 = 56.25%`. Again, this just says that the element's height should be `56.25%` of its containing block's width. The final step is to relatively position the element and absolutely position any children so that they don't influence the element's height.

Here's the HTML and CSS that'll do that for us:

{% include codeHeader.html file="test.html" %}
```html
<div class="embed-container">
  <iframe>...</iframe>
</div>
```

{% include codeHeader.html file="test.css" %}
```css
.embed-container {
  position: relative;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
  /* Not needed if it's a block element, like a div */
  width: 100%;
}

.embed-container * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

That's it! Your YouTube iframe will now maintain a `16:9` aspect ratio on all device widths.

### Example 2: Creating a 3x3 Square Grid with CSS

Now that we know how to define an element's height as a percentage of its own width, we can easily create a [3x3 square layout](https://tobiasahlin.com/blog/common-flexbox-patterns/#3x3-grid-constrained-proportions-11) with Flexbox or CSS Grid. As we learned before, squares have an aspect ratio of `1:1`, so all you have to do is give each element vertical padding equal to `100%` of its width. This is straightforward with CSS Grid:

{% include codeHeader.html file="grid.html" %}
```html
<ul class="square-grid">
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
</ul>
```

{% include codeHeader.html file="grid.css" %}
```css
.square-grid {
  --gap: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: var(--gap);
  grid-row-gap: var(--gap);
  list-style: none;
  padding: 0;
}

.square {
  height: 0;
  padding-bottom: 100%;
}
```

That gives us a perfect 3x3 grid of squares:

<ol class="square-grid" aria-hidden="true">
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
</ol>

You can now put whatever absolutely positioned content you want in these squares, relatively position the list items, and hide any overflowing content. Speaking of which...

### Example 3: A 3x3 Square Grid of Images (Cropped)

One of the more common use cases you'll run into is creating a square image grid with CSS, where each image is cropped to fit a perfect `1:1` aspect ratio. This simply builds on the previous example, where we created a generic square grid with CSS grid and percentage padding. Here, we'll relatively position our squares and absolutely position all of its children (images) to get a nice little image gallery:

{% include codeHeader.html file="image-grid.css" %}
```css
.square-grid {
  --gap: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: var(--gap);
  grid-row-gap: var(--gap);
  list-style: none;
  padding: 0;
}

.square {
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.square img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

Putting it all together, we get a `3x3` grid of images that are perfectly centered to a `1:1` (square) aspect ratio. If some of the images don't have an intrinsic `1:1` aspect ratio—as is the case with the puppies below, which have intrinsic dimensions of `500x300`—they'll simply be cropped and centered:

<ol class="square-grid" aria-hidden="true">
  <li class="square">{% include img.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="parakeet.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="parakeet.png" alt="" clickable=false %}</li>
  <li class="square">{% include img.html img="parakeet.png" alt="" clickable=false %}</li>
</ol>

But wait... Why does this work? Didn't we say that percentage padding is relative to the width of the containing block? In this case, isn't the containing block the entire grid, and not the grid cells? Good question! We'll discuss this [very shortly](#the-curious-case-of-flexbox-and-css-grid). For now, let's take a look at some of the reasons why percentage padding behaves this way.

## Why It Works: Padding Percentages and Aspect Ratios

As mentioned earlier, the reason we're able to create responsive aspect ratios in this manner is because percentage values for `padding` (and `margin`) are defined relative to the width of an element's containing block. This is the case for block layouts, [flex layouts](https://www.w3.org/TR/css-flexbox-1/#item-margins), and [grid layouts](https://drafts.csswg.org/css-grid-1/#item-margins). Unfortunately, the W3 specification does not actually go into detail regarding why this decision was made, so [the best we can do is speculate](https://stackoverflow.com/questions/11003911/why-are-margin-padding-percentages-in-css-always-calculated-against-width/).

One possible reason for this is that using a single reference axis (the containing block's width or height, but not both) gives you predictable results with `padding: x%` and `margin: x%`, ensuring that you get the same exact value on all four sides of the box model for a given element, just as you would with other units (e.g., `em` or `px`). So, regardless of whether an element is perfectly square, you'll get the same amount of percentage-based padding or margin on all sides. One could argue, however, that this isn't a good motivation. With concrete units like `em`, `rem`, and `px`, it definitely makes sense for the amount of padding to be the same on all four sides when you use the shorthand of `padding: 5px`. But there's nothing suggesting that the same should hold for percentages since these are responsive units. Moreover, this does not address why the containing block's width was chosen over its height since either one would do just fine.

A more logical reason is the [causality dilemma](https://en.wikipedia.org/wiki/Chicken_or_the_egg) (aka the chicken or the egg). Let's pretend that percentage values for vertical padding actually referenced the containing block's height, rather than its width. If that were the case, we'd get an infinite loop:

1. A containing block's height is affected by the heights of its children<sup>1</sup>.
2. A child sets its `padding-top` to be some percentage (e.g., `50%`).
3. The height of the containing block must change since the child is now taller.
4. If the height of the containing block increases, the child's padding must increase, too.
5. Repeat steps 2-4 infinitely.

> <sup>1</sup>The same does NOT apply to the width of a containing block. By definition, a block-level element such as a `<div>` will fill up 100% of the available width in the [inline direction](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow#Elements_participating_in_a_block_formatting_context). If children exceed this width, they will simply overflow—the parent will not stretch. Hence, the infinite calculation problem does not exist in the horizontal axis.

Another reason is that this CSS trick allows us to define responsive aspect ratios. If percentage values for vertical padding were based on the containing block's height and not its width, then we'd have no way of doing this with responsive units—we'd have to rely on hardcoded units.

### The Curious Case of Flexbox and CSS Grid

We learned that percentage padding for an element will reference the width of its containing block. But what happens if the element in question is a flex item or grid item? In that case, is the containing block the grid itself?

The simple answer is no. And the key to understanding this is to learn about **block formatting contexts** (BFCs). From the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts):

> Everything on a page is part of a formatting context, or an area which has been defined to lay out content in a particular way. A block formatting context (BFC) will lay child elements out according to block layout rules, a flex formatting context will lay its children out as flex items, etc. Each formatting context has specific rules about how layout behaves when in that context.

In its documentation on [identifying the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block), MDN notes that flex items and grid items create their own block formatting context, separate from the flex container or grid container:

> If the position property is static, relative, or sticky, the containing block is formed by the edge of the content box of the nearest ancestor element that is either a block container (such as an inline-block, block, or list-item element) or establishes a formatting context (such as a table container, flex container, grid container, or the block container itself).

[And the W3 specs back this up](https://www.w3.org/TR/css-flexbox-1/#flex-items):

> A flex item establishes an independent formatting context for its contents. However, flex items themselves are flex-level boxes, not block-level boxes: they participate in their container’s flex formatting context, not in a block formatting context.

Thus, for flex and grid items, you can think of the containing block as an invisible content region that wraps the items. With CSS grid, this grid formatting context is very easy to identify in your dev tools, appearing as a dotted outline around each item:

{% include img.html img="grid.png" alt="Inspecting a grid of four items with the Chrome dev tools reveals that each grid items has its own block formatting context, shown with a dashed outline." %}

You can prove this with a simple experiment with two grid items that have the same aspect ratio but whose formatting contexts have differing widths, as defined by the `grid-template-columns` property:

<ul class="grid" aria-label="A grid of two items, one of which is 1fr and the other is 2fr">
  <li class="tile aspect-ratio-16-9" data-ratio="16:9"></li>
  <li class="tile aspect-ratio-16-9" data-ratio="16:9"></li>
</ul>

If the formatting context for grid items were the grid parent itself, then the two items would have the same padding-based height. But they don't because each item has its own formatting context.

### Percentage Padding in Horizontal vs. Vertical Writing Modes

So far, I've asserted that percentage padding and margins reference the width of their containing block. While this is true, it only tells half the story. Percentages may also refer to the height of the containing block, depending on the document's **writing mode**.

By default, a web page is set up to use a **horizontal writing mode**, where text flows from left to right (LTR). This is thanks to the `writing-mode` CSS property, which can take on these values:

<table>
  <thead>
    <tr>
      <th scope="col">Value</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>horizontal-tb</code></td>
      <td>Content flows horizontally, from top to bottom (default).</td>
    </tr>
    <tr>
      <td><code>vertical-rl</code></td>
      <td>Content flows vertically, from the right edge of the page to the left.</td>
    </tr>
    <tr>
      <td><code>vertical-lr</code></td>
      <td>Content flows vertically, from the left edge of the page to the right.</td>
    </tr>
  </tbody>
</table>

With vertical layouts, paragraphs appear sideways—you'll have to tilt your head to read them:

<p aria-hidden="true" style="writing-mode: vertical-rl; height: 200px; width: 100%; display: flex; align-items: center; line-height: 1.3;">
  Hello, World! This is a paragraph with writing-mode: vertical-rl set in its CSS. Neat, huh? Notice how the text flows from the right side of the page to the left.
</p>

[The MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow#Elements_participating_in_a_block_formatting_context) use the following diagrams to clarify the difference between these two writing modes:

<figure>
  {% include img.html img="horizontal-mode.png" alt="A horizontal writing mode, with text flowing vertically from top to bottom. An arrow points from left to right at the top of the document and is labeled as the inline direction. Another arrow points from top to bottom and is labeled as the block direction." %}
  <figcaption>Horizontal writing mode (default)</figcaption>
</figure>

<figure>
  {% include img.html img="vertical-mode.png" alt="A vertical writing mode, with text flowing horizontally. The horizontal axis is labeled as the block direction, whereas the vertical axis is now labeled as the inline direction. Text is rendered sideways." %}
  <figcaption>Vertical writing mode</figcaption>
</figure>

Here's the important point: if we change our writing mode to vertical (either left-to-right or right-to-left), and we use percentage values for padding or margin, these percentages will actually be defined relative to the *containing block's height*, not its width! This comes straight from the [CSS3 specs](https://www.w3.org/TR/css-writing-modes-3/#dimension-mapping):

> As a corollary, percentages on the margin and padding properties, which are always calculated with respect to the containing block width in CSS2.1, are calculated with respect to the inline size of the containing block in CSS3.

Here, **inline size** is defined as follows:

> A measurement in the inline dimension: refers to the physical width (horizontal dimension) in horizontal writing modes, and to the physical height (vertical dimension) in vertical writing modes.

To verify this, run the following code:

{% include codeHeader.html file="test.html" %}
```html
<div class="document">
  <div class="parent">
  <div class="child">
    Child
  </div>
  </div>
</div>
```

{% include codeHeader.html file="test.css" %}
```css
.document {
  writing-mode: vertical-rl;
  width: 100%;
  height: 100vh;
}

.parent {
   width: 100%;
   height: 200px;
   background-color: black;
   color: white;
}

.child {
  padding: 10%;
  background-color: white;
  color: black;
  border: solid 1px;
}
```

The result is shown below, with some additional CSS to make things prettier and easier to identify. Using your dev tools, you can verify that the child `<div>` has a padding of `20px`, which is precisely `10%` of the containing block's height (`200px`):

<div class="document" aria-hidden="true">
  <div class="parent">
  Parent (200px tall)
  <div class="child">
    Child
  </div>
  </div>
</div>

So padding percentages are not always relative to the containing block's width! This is the case the majority of the time since most documents use the default writing mode, but if you've set yours to be vertical, then padding and margin percentages are going to be relative to the containing block's *height*. Thus, our understanding of percentage padding and margin should really be the following:

> Percentage values for padding and margin are relative to the containing block's dimensions in the **inline direction**. For horizontal layouts, this is the containing block's width. For vertical layouts, this is the containing block's height. (See the reference diagrams above.)

## The Future of CSS Aspect Ratios: `aspect-ratio`

Early on in this article, I mentioned that CSS has a new property on the horizon: [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio). And it couldn't be easier to use:

{% include codeHeader.html %}
```css
.element {
  aspect-ratio: 16 / 9;
}
```

Based on what you've learned so far, it should be clear what this will do: As the element is resized, the browser will ensure that the element maintains a `16:9` aspect ratio.

As of this writing, browser support for this new property is lacking since it's experimental. Once it's fully supported, you'll be able to define aspect ratios in CSS much more expressively and without relying on the percentage padding trick.

## A Note on Rounding Errors

Because computers use fixed-precision floating-point systems, there are some numbers that cannot be fully represented in binary using the IEEE754 standard. Thus, they must either be **truncated** or **rounded** to the nearest representable number.

Since rounding may occur at various steps in percentage-based calculations with CSS, an element may actually end up having a **slightly inaccurate aspect ratio** (though this will be barely perceptible to the user).

In Chrome, for example, all pixel dimensions are truncated after two decimal points, so a width of `1280.858585px` would get truncated to `1280.85px`. Multiply that by `0.5625`, and you'll get `720.478125`, which is rounded to `720.48px`. If you now compute the resulting aspect ratio, you'll find that it's `1.7777731512325116588940706195869`, which differs slightly from the true aspect ratio of `16:9 = 1.7777777777777777777777777777778`.

## Final Thoughts

Clearly, CSS can be a little weird sometimes—who would've thought that padding could be used to create aspect ratios? That thought certainly never crossed my mind until I dug deep into this topic.

With an understanding of padding percentages, you now know how to define responsive aspect ratios in CSS for all kinds of elements, including images, videos, and more. As a bonus, you now also understand how percentage values work for padding and margins and that they depend on the writing mode.

I hope you found this helpful!

### References and Further Reading

- [Maintain the aspect ratio of a div with CSS](https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css)
- [W3 Schools How TO - Aspect Ratio](https://www.w3schools.com/howto/howto_css_aspect_ratio.asp)
- [Why are margin/padding percentages in CSS always calculated against width?](https://stackoverflow.com/questions/11003911/why-are-margin-padding-percentages-in-css-always-calculated-against-width/11004839)
- [How to set the margin or padding as percentage of height of parent container?](https://stackoverflow.com/questions/4982480/how-to-set-the-margin-or-padding-as-percentage-of-height-of-parent-container#:~:text=If%20you%20set%20an%20element's,to%20height%20instead%20of%20width.)
- [Common CSS Flexbox Layout Patterns with Example Code](https://tobiasahlin.com/blog/common-flexbox-patterns/)

{% include unsplashAttribution.md name="Rolands Zilvinskis" username="rolzay" photo_id="cPxRBHechRc" %}

<style>
  .post-content .tiles {
    display: grid;
    padding: 0 !important;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    row-gap: 1em;
    column-gap: 1em;
  }
  .post-content .tile {
    position: relative;
    height: 0;
    background-color: var(--tag-bg-color);
    color: var(--tag-text-color);
    font-weight: 700;
    font-size: 1.2em;
    list-style: none;
    margin: 0 !important;
    border-radius: 4px;
  }
  .post-content .tile::after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: attr(data-ratio);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .aspect-ratio-1-1 {
    padding-bottom: 100%;
  }
  .aspect-ratio-4-3 {
    padding-bottom: 75%;
  }
  .aspect-ratio-3-2 {
    padding-bottom: 66.67%;
  }
  .aspect-ratio-16-9 {
    padding-bottom: 56.25%;
  }
  .post-content .square-grid {
    --gap: 1.6rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: var(--gap);
    grid-column-gap: var(--gap);
    list-style: none;
    padding: 0;
  }
  .post-content .square {
    height: 0;
    padding-bottom: 100%;
    background-color: var(--tag-bg-color);
    color: var(--tag-text-color);
    position: relative;
  }
  .square * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .square img,
  .square source {
    object-fit: cover;
    object-position: center;
  }
  .document {
    writing-mode: vertical-rl;
    width: 100%;
    height: 200px;
  }
  .parent {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: var(--navbar-bg-color);
    color: white;
    height: 100%;
  }
  .child {
    padding: 10%;
    background-color: white;
    color: black;
  }
  .post-content .grid {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
    column-gap: 1em;
  }
</style>
