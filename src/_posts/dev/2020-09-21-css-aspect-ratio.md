---
title: "Responsive Aspect Ratios in CSS with Percent Padding"
description: Learn how to give any element on your page a responsive aspect ratio, using a CSS trick with percentage padding.
keywords: [aspect ratio, padding percentage]
tags: [dev, frontend, css, math]
comments_id: 58
---

Here's a neat CSS trick I learned recently: Using percentage `padding`, we can give any element a responsive aspect ratio in just a few lines of styling. This allows you to create `nxn` square grid layouts, responsive embeds that scale with the device resolution (e.g., for YouTube videos), and much more.

Here are some examples of common aspect ratios, rendered using plain old HTML and CSS:

<ul class="tiles">
    <li class="tile aspect-ratio-1-1" data-ratio="1:1"></li>
    <li class="tile aspect-ratio-4-3" data-ratio="4:3"></li>
    <li class="tile aspect-ratio-3-2" data-ratio="3:2"></li>
    <li class="tile aspect-ratio-16-9" data-ratio="16:9"></li>
</ul>

In the sections that follow, we'll look at what *aspect ratio* means and how to define one using CSS.

{% include toc.md %}

## What Is an Aspect Ratio?

An **aspect ratio** is a proportion: a fraction that expresses the width and height of an element relative to each other. For example, an aspect ratio of `16:9` basically says:

> For every 16 units of width, I want there to be 9 units of height.

So, if an element is 32 units wide, its height will scale proportionally to be 18 units tall, allowing it to maintain its same `16:9` aspect ratio.

By definition, if an element has a given aspect ratio, then its width divided by its height can always be reduced to the aspect ratio. For example, with an aspect ratio of `4:3`, an element could have any of the following dimensions (among infinitely many others):

- `500px × 375px`
- `2px × 1.5px`
- `20.5px × 15.375px`

You can verify that all of these are proportional and therefore have the same aspect ratio: the width divided by the height can be reduced to precisely `4 / 3 = 1.333...`.

### Responsive Heights in CSS

In this tutorial, what we'd like to do is define a height that will allow an element to maintain a desired aspect ratio **regardless of its width**. For this reason, it helps to think of aspect ratio in a slightly different (but equivalent) light, using the same example of `16:9`:

> For every 9 units of height, I want there to be 16 units of width.

This shift in perspective allows us to answer the following question: How many units of height do we have *per units of width*? Well, that's just `9 height / 16 width`, which comes out to `0.5625 height/width`. More intuitively, this means that the height of the element will always be `56.25%` of its width.

Thus, given a width, all we have to do is multiply that by the percentage we worked out above, and we'll get precisely the height that we need for the element to fit a given aspect ratio (in this case, `16:9`). Now, all we need is some way to define an element's height as a percentage of its width, using CSS.

## Using Padding Percentages to Define Aspect Ratios in CSS

Unfortunately, we can't just do this:

{% capture code %}.element {
    height: 56.25%;
}{% endcapture %}
{% include code.html code=code lang="css" %}

Percentage values for the `height` CSS property are relative to the height of an element's [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block), or its nearest block-level parent. What we want, though, is for an element's height to be expressed as a percentage of its own width. How do we do that?

Interestingly, it turns out that percentage values for `padding` and `margin` are relative to the width of an element's containing block. For example, if an element's containing block has a width of `500px`, then a child element with `padding: 10%` will get `50px` of padding on all four of its sides.

So clearly, we have a way to define an element's height as a percentage of its *containing block's* width. As long as the child element stretches to fill `100%` of its containing block's width, this will be the same as *defining the element's height as a percentage of its own width* (which is what we're really trying to do!).

### Question: What's the Difference Between a Containing Block and a Parent?

An element's **containing block** is its nearest block-level parent. This could be any block element—like a `<div>`, a paragraph, a heading, a `<section>`, and so on—or even an inline element like a `<span>` that has `display: block`. An element's parent need not *always* define a containing block. This could happen if the parent is an inline element, or if it's a block-level element that's set to `display: inline`. The distinction is important; the W3 specs explicitly use the term *containing block* instead of *parent* when referring to percentage padding and how it works. So I've decided to follow that convention for absolute clarity.

### Example 1: YouTube Videos

Now, consider a practical example. Let's say you want to embed a YouTube video on your page, and you know that YouTube videos have an aspect ratio of `16:9`. But you don't want to give the iframe a *fixed* width and height—rather, you want its width to fill its container and for its height to scale responsively, maintaining the element's `16:9` aspect ratio:

<div class="tile aspect-ratio-16-9" data-ratio="Pretend this is a YouTube iframe" aria-hidden="true"></div>

We can do this using the padding trick that we learned: percentage values for padding reference the containing block's width. So, we can set an element's height to be zero and its vertical padding to be `x` percent, where `x` just comes from the aspect ratio. For example, if the aspect ratio is `w:h`, then we'd compute `h / w * 100`. This expresses the height as a percentage of the width. The final step is to relativly position the element and absolutely position any children so that they don't influence the element's height.

Going back to our example, to create an aspect ratio of `16:9`, we'd set the element's height to be zero and the vertical padding to be `9 / 16 * 100 = 0.5625 * 100 = 56.25%`. Again, in plain English, this just says that the element's height should be `56.25%` of its containing block's width.

Here's the HTML and CSS that'll do that for us:

{% capture code %}<div class="embed-container">
  <iframe>...</iframe>
</div>{% endcapture %}
{% include code.html file="test.html" code=code lang="html" %}

{% capture code %}.embed-container {
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
}{% endcapture %}
{% include code.html file="test.css" code=code lang="css" %}

That's it! Your YouTube iframe will now maintain its intrinsic `16:9` aspect ratio on all device widths.

### Example 2: Creating a 3x3 Square Grid with CSS

Now that we know how to define an element's height as a percentage of its containing block's width, we can easily create a [3x3 square layout](https://tobiasahlin.com/blog/common-flexbox-patterns/#3x3-grid-constrained-proportions-11) with Flexbox or CSS Grid. All you have to do is give each element a `padding-top` or `padding-bottom` that's equal to its width/flex-basis, expressed as a percentage:

{% capture code %}<ul class="square-grid">
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
  <li class="square"></li>
</ul>{% endcapture %}
{% include code.html file="grid.html" code=code lang="html" %}

{% capture code %}.square-grid {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
}

.square {
    height: 0;
    margin: 0.5em;
    /* Subtract 1em for left and right 0.5em margins */
    flex-basis: calc(33.33% - 1em);
    padding-bottom: calc(33.33% - 1em);
}{% endcapture %}
{% include code.html file="grid.css" code=code lang="css" %}

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

One of the more common use cases you'll run into is creating a square image grid with CSS, where each image is cropped to fit a perfect `1:1` aspect ratio. This simply builds on the previous example, where we created a generic square grid. Here, we'll relatively position our squares and absolutely position all children:

{% capture code %}.square {
  height: 0;
  margin: 0.5em;
  flex-basis: calc(33.33% - 1em);
  padding-bottom: calc(33.33% - 1em);
  position: relative;
}

.square * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}{% endcapture %}
{% include code.html file="image-grid.css" code=code lang="css" %}

Each square will nest a `<picture>` child element that in turn contains `<img>` and `<source>` elements. You could also just use an `<img>` tag here instead of a `<picture>`. In any case, the image and source elements will be styled as follows:

{% capture code %}.square img,
.square source {
  object-fit: cover;
  object-position: center;
}{% endcapture %}
{% include code.html file="img-grid.css" code=code lang="css" %}

Putting it all together, we get a `3x3` grid of images that are perfectly centered to a `1:1` (square) aspect ratio. If some of the images don't have an intrinsic `1:1` aspect ratio—as is the case with the puppies below, which have intrinsic dimensions of `500x300`—they'll simply be cropped and centered:

<ol class="square-grid" aria-hidden="true">
  <li class="square">{% include picture.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="puppy.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="kitten.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="parakeet.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="parakeet.png" alt="" clickable=false %}</li>
  <li class="square">{% include picture.html img="parakeet.png" alt="" clickable=false %}</li>
</ol>

Taking this a step further, you could even set a breakpoint to have the grid flow into a `9x1` grid for mobile, or you could just use CSS Grid instead of flexbox. It's up to you!

## Why It Works: Padding Percentages and Aspect Ratios

As mentioned earlier, the reason we're able to create responsive aspect ratios in this manner is because percentage values for `padding` (and `margin`!) are defined relative to the width of an element's containing block. This is the case for block layouts, [flex layouts](https://www.w3.org/TR/css-flexbox-1/#item-margins), and [grid layouts](https://drafts.csswg.org/css-grid-1/#item-margins). Unfortunately, the W3 specification does not actually go into detail regarding why this decision was made, so [the best we can do is speculate](https://stackoverflow.com/questions/11003911/why-are-margin-padding-percentages-in-css-always-calculated-against-width/).

One possible reason for this is that using a single reference axis (the containing block's width or height, but not both) gives you predictable results with `padding: x%` and `margin: x%`, ensuring that you get the same exact value on all four sides of the box model for a given element, just as you would with other units (e.g., `em` or `px`). So, regardless of whether an element is perfectly square, you'll get the same amount of percentage-based padding or margin on all sides. One could argue, however, that this isn't a good motivation. With concrete units like `em`, `rem`, and `px`, it definitely makes sense for the amount of padding to be the same on all four sides when you use the shorthand of `padding: 5px`. But there's nothing suggesting that the same should hold for percentages since these are responsive units. Moreover, this does not address why the containing block's width was chosen over its height since either one would do just fine.

A more logical reason is the [causality dilemma](https://en.wikipedia.org/wiki/Chicken_or_the_egg) (aka the chicken or the egg). Let's pretend that percentage values for vertical padding actually referenced the containing block's height, rather than its width. If that were the case, we'd get an infinite loop:

1. A containing block's height is affected by the heights of its children<sup>2</sup>.
2. A child sets its `padding-top` to be some percentage (e.g., `50%`).
3. The height of the containing block must change since the child now takes up more vertical space.
4. If the height of the containing block increases, the child's padding must increase, too.

> <sup>2</sup>The same does NOT apply for the width of a containing block. By definition, a block-level element such as a `<div>` will fill up 100% of the available width in the [inline direction](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow#Elements_participating_in_a_block_formatting_context). If children exceed this width, they will simply overflow—the parent will not stretch. Hence, the infinite calculation problem does not exist in the horizontal axis.

Another compelling reason is that this CSS "hack" allows us to define responsive aspect ratios. If percentage values for vertical padding were based on the containing block's height and not its width, then we'd have no way of doing this with responsive units—we'd have to rely on hardcoded units.

### Percentage Padding in Horizontal vs. Vertical Writing Modes

So far, I've asserted that percentage padding and margins reference the width of their containing block. While this is true, it only tells half the story. Percentages may also refer to the height of the containing block, depending on the document's **writing mode**.

By default, a web page is set up to use a **horizontal writing mode**, where text flows from left to right (LTR). This is thanks to the `writing-mode` CSS property, which can take on the following values:

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

[The MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow#Elements_participating_in_a_block_formatting_context) provide the following diagrams to clarify the difference between these two writing modes:

<figure>
  {% include picture.html img="horizontal-mode.png" alt="A horizontal writing mode, with text flowing vertically from top to bottom. An arrow points from left to right at the top of the document and is labeled as the inline direction. Another arrow points from top to bottom and is labeled as the block direction." %}
  <figcaption>Horizontal writing mode (default)</figcaption>
</figure>

<figure>
  {% include picture.html img="vertical-mode.png" alt="A vertical writing mode, with text flowing horizontally. The horizontal axis is labeled as the block direction, whereas the vertical axis is now labeled as the inline direction. Text is rendered sideways." %}
  <figcaption>Vertical writing mode</figcaption>
</figure>

Here's the important point: if we change our writing mode to vertical (either left-to-right or right-to-left), and we use percentage values for padding or margin, these percentages will actually be defined relative to the *containing block's height*, not its width! This comes straight from the [CSS3 specs](https://www.w3.org/TR/css-writing-modes-3/#dimension-mapping):

> As a corollary, percentages on the margin and padding properties, which are always calculated with respect to the containing block width in CSS2.1, are calculated with respect to the inline size of the containing block in CSS3.

Here, **inline size** is defined as follows:

> A measurement in the inline dimension: refers to the physical width (horizontal dimension) in horizontal writing modes, and to the physical height (vertical dimension) in vertical writing modes.

To verify this, run the following code:

{% capture code %}<div class="document">
  <div class="parent">
    <div class="child">
      Child
    </div>
  </div>
</div>{% endcapture %}
{% include code.html file="test.html" code=code lang="html" %}

{% capture code %}.document {
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
}{% endcapture %}
{% include code.html file="test.css" code=code lang="css" %}

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

<style>
    .tiles { display: grid; padding: 0 !important; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); row-gap: 1em; column-gap: 1em; }
    .tile { position: relative; height: 0; background-color: var(--tag-bg-color); color: var(--tag-text-color); font-weight: 700; font-size: 1.2em; list-style: none; margin: 0 !important; border-radius: 4px; }
    .tile::after { position: absolute; left: 0; top: 0; width: 100%; height: 100%; content: attr(data-ratio); display: flex; align-items: center; justify-content: center; }
    .aspect-ratio-1-1 { padding-bottom: 100%; }
    .aspect-ratio-4-3 { padding-bottom: 75%; }
    .aspect-ratio-3-2 { padding-bottom: 66.67%; }
    .aspect-ratio-16-9 { padding-bottom: 56.25%; }
    .square-grid { display: flex; flex-wrap: wrap; list-style: none; padding: 0 !important; }
    .square { height: 0; flex-basis: calc(33.33% - 1em); padding-bottom: calc(33.33% - 1em); background-color: var(--tag-bg-color); color: var(--tag-text-color); margin: 0.5em !important; position: relative; }
    .square * { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .square img, .square source { object-fit: cover; object-position: center; }
    .document { writing-mode: vertical-rl; width: 100%; height: 200px; }
    .parent { width: 100%; display: flex; align-items: center; flex-direction: column; justify-content: space-evenly; background-color: var(--navbar-bg-color); color: white; height: 100%; }
    .child { padding: 10%; background-color: white; color: black; }
</style>
