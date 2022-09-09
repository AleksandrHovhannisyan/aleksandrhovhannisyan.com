---
title: "SVG Tutorial: How to Code SVG Icons by Hand"
description: Follow along with the examples in this in-depth guide to learn how to draw SVG icons and simple shapes by hand.
keywords: [svg tutorial, svg icons, how to code svg]
categories: [svg, html, css]
lastUpdated: 2021-08-07
commentsId: 68
isFeatured: true
thumbnail: ./images/thumbnail.png
stylesheets:
  - /assets/styles/demos/svg.css
---

For as long as I can remember, I avoided touching SVGs when working with front-end code. I'd have no trouble with HTML, CSS, or JavaScript, but SVGs always intimidated me with their bizarre syntax and those weird, indecipherable strings of letters and numbers. You know the ones:

```html
<svg viewBox="0 0 24 24" width="24" height="24">
  <path d="M 4 4 h 16 a 2 2 0 0 1 2 2 v 14" />
</svg>
```

If I needed icons for a project, I'd install one of the many icon libraries that are available, but that always left me unsatisfied. Sure, there's nothing wrong with using libraries, but it also doesn't hurt to understand how the tools you use really work under the hood. So why not also learn how to draw your own SVG icons by hand, even if you end up using a library in the end?

As you'll see in this tutorial, coding SVG icons by hand is actually fairly straightforward once you master the basic shapes and syntax. We'll draw a bunch of icons to help you hone your SVG skills. Here's a sneak peek at all of the icons we'll create:

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="leftAlignTitle1 leftAlignDesc1">
      <title id="leftAlignTitle1">Left-alignment</title>
      <desc id="leftAlignDesc1">Four horizontal lines are stacked vertically and aligned to the left-hand margin, with tapering lengths to the right.</desc>
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="2" y1="9.4" x2="16" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="2" y1="19.8" x2="16" y2="19.8"/>
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="textTitle1 textDesc1">
      <title id="textTitle1">Text</title>
      <desc id="textDesc1">A text icon represented with an uppercase letter T, in a serif style.</desc>
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="clockTitle1 clockDesc1">
      <title id="clockTitle1">Clock</title>
      <desc id="clockDesc1">A clock icon represented as a circle with two concentric lines for the hands, pointing in the 8 o'clock direction.</desc>
      <circle cx="12" cy="12" r="10" />
      <polyline points="13 7, 13 14, 9 14" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="infoTitle1 infoDesc1">
      <title id="infoTitle1">Info</title>
      <desc id="infoDesc1">An info icon often used to indicate additional information or notices. Represented as a circle with a concentric lowercase letter i.</desc>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="rightArrowTitle1 rightArrowDesc1">
      <title id="rightArrowTitle1">Right-arrow</title>
      <desc id="rightArrowDesc1">A rightward-pointing arrow centered inside a circle.</desc>
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <polyline points="12 8, 16 12, 12 16" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="warningTitle1 warningDesc1">
      <title id="warningTitle1">Warning</title>
      <desc id="warningDesc1">A warning indicator represented as an upward-pointing equilateral triangle and a concentric exclamation mark.</desc>
      <polygon points="12 2, 22 22, 2 22" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="calendarTitle1 calendarDesc1">
      <title id="calendarTitle1">Calendar</title>
      <desc id="calendarDesc1">A calendar icon with a rectangular body and two parallel vertical lines at the top, with a horizontal line near the top</desc>
      <path
        d="
              M 4 4
              h 16
              a 2 2 0 0 1 2 2
              v 14
              a 2 2 0 0 1 -2 2
              h -16
              a 2 2 0 0 1 -2 -2
              v -14
              a 2 2 0 0 1 2 -2"
       />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="7" y1="2" x2="7" y2="6" />
      <line x1="17" y1="2" x2="17" y2="6" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-labelledby="externalTitle1 externalDesc1">
      <title id="externalTitle1">External link</title>
      <desc id="externalDesc1">An icon used to represent external links and resources. A rectangular shape has a cut-out in the top-right corner; an arrow points out through that gap.</desc>
      <path
        d="M 18 14
          v 6
          a 2 2 0 0 1 -2 2
          H 6
          a 2 2 0 0 1 -2 -2
          V 10
          a 2 2 0 0 1 2 -2
          H 12"
       />
      <line x1="12" y1="14" x2="20" y2="6" />
      <polyline points="16 5.5, 20 5.5, 20 9.5" />
    </svg>
  </li>
</ul>

I took inspiration for these SVG icons from [Feather Icons](https://feathericons.com/), a fantastic library created by [Cole Bemis](https://colebemis.com/). These icons will help us learn how to draw the following SVG shapes:

- Lines
- Polylines
- Circles
- Polygons
- Curved paths

Once you've learned the basics, you can draw almost anything with SVGs.

I hope you're excited to get started! Feel free to jump around if you want, but I've structured this tutorial intentionally so that each section builds on new knowledge.

{% include "toc.md" %}

## What Is an SVG?

**SVG** stands for Scalable Vector Graphics; it's a **vector image format** that allows you to draw shapes using a markup language (XML). The "scalable" part of the name is a key characteristic of SVGs—unlike raster image formats (e.g., PNG, JPEG), vector images don't lose quality when you scale them beyond their original size. Whereas raster images store their data using fixed-size pixels, vector images like SVGs store their data as XML definitions for shapes, which can easily be scaled responsively to any size.

<ul class="svg-tutorial__icon-grid" aria-hidden="true">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="16" height="16" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="24" height="24" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="32" height="32" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="48" height="48" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="96" height="96" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
</ul>

By analogy, this is the difference between drawing something on screen (raster images) and giving your browser *instructions* for how to draw something on screen, relative to a coordinate system (vector images). Vector images give your browser more flexibility since they can be rescaled to any size with a bit of simple math.

As a bonus, you can even fluidly animate SVGs to create really fun and engaging user experiences. Here are a few noteworthy developer blogs that do this:

- [Joshua Comeau](https://www.joshwcomeau.com/react/boop/)
- [Cassie Evans](https://www.cassie.codes/)
- [George Francis](https://georgefrancis.dev/)
- [Will Boyd](https://codersblock.com/)

### How Are SVGs Drawn?

There are two ways to draw SVGs: by hand, where you define the markup explicitly using HTML, or through a **vector image program** like [Inkscape](https://inkscape.org/):

{% include "postImage.html" src: "./images/inkscape.png", alt: "Inkscape's user interface consists of drawing tools on the left-hand side, page alignment and setup options on the right, and a canvas in the center." %}

These programs come with basic shapes, color pickers, drawing tools, and path manipulation, allowing you to create complex drawings with greater ease than if you were to do them by hand. You'll typically see designers and logo artists using GUIs like Inkscape rather than coding SVGs by hand. Still, understanding how SVG markup works is a valuable learning experience. At the end of the day, these programs output `.svg` files; if you inspect those files, you'll find that their markup is just XML, and you can make sense of it if you understand how SVGs work.

## SVG 101: How to Code SVGs by Hand

I know you're itching to get to the examples, but first things first!

All SVG shapes are defined within the SVG element itself, like this:

```html
<svg>
  <!-- stuff goes here -->
</svg>
```

Of course, there's more to it than just that. Let's explore the basic anatomy of an SVG.

### SVG Namespace Declarations

If you've ever inspected the contents of an `.svg` file, like one created by Inkscape or some other vector image program, you may have seen this `xmlns` attribute on the `svg` element itself:

```html
<svg xmlns="http://www.w3.org/2000/svg"></svg>
```

This is known as a [namespace declaration](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#declaring_namespaces). In simple terms, a namespace declaration helps a user agent like your browser to understand and parse an element's syntax. Here, we've declared that our namespace is SVG. A namespace declaration is [not required if you're rendering inline SVG icons](https://stackoverflow.com/a/18468348/5323344), like in HTML. But if you're including SVG *files* (e.g., as an image), then the SVG does need to specify its namespace. I'll omit the namespace in this tutorial since we don't need one.

### SVG `viewBox` and Size

You've probably also seen these three attributes: `width`, `height`, and `viewBox`:

```html
<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
></svg>
```

The `viewBox` attribute defines **the dimensions of the viewport ("canvas") for an SVG**. The first two numbers allow you to pan the SVG viewport horizontally or vertically, giving it an appearance of some sort of inner offset relative to the origin, `(0, 0)`. In the code sample above, we have an offset of `0 0`, meaning the top-left corner of the viewport *is* the origin.

Below are two SVG icons. The one on the left has a `viewBox` of `0 0 24 24`. The one on the right has a `viewBox` of `6 6 24 24`. As a result, the origin of the second viewport is offset by `6` units horizontally and vertically. So instead of being `(0, 0)`, the origin is now `(6, 6)`. This means that the image shifts to the left relative to the `viewBox`. It's as if we've panned our canvas towards the bottom-right corner.

<ul class="svg-tutorial__icon-grid" aria-hidden="true">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="6 6 24 24" width="64" height="64" class="bordered" role="presentation">
      <polyline points="3 8, 3 4, 21 4, 21 8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  </li>
</ul>

The last two numbers control the size (horizontal and vertical, respectively) of this coordinate system, before any scaling is done. Larger numbers lead to a larger viewport and more space to work with, while smaller numbers lead to a smaller viewport and less space to work with. In the examples above, the viewport size is declared to be `24 24`, so our coordinates range from `(0, 0)` (top-left corner) to `(24, 24)` (bottom-right corner):

{% include "postImage.html" src: "./images/coordinates.png", alt: "An SVG's coordinate system has an origin of (0, 0) at the top-left corner. For an SVG whose viewBox is 0 0 24 24, the bottom-right corner is at (24, 24)." %}

Finally, the `width` and `height` attributes work just as you'd expect them to: They define the final (scaled) width and height of your SVG element, in pixels. Alternatively, you can change an SVG's size with CSS using `width` and `height`.

#### Scaling SVGs: `viewBox` vs. `width` and `height`

All SVG shapes are drawn relative to the `viewBox` coordinate system, not to the final `width` and `height` of the SVG. This means that your canvas size may be `24x24`, and any shapes you draw will be confined within this base `576` pixel coordinate space, but you can later scale the vector image as needed.

For example, if our `viewBox` is `0 0 24 24` but we've set the width and height to be `32`, or some other number, then we're still working within a base viewport size of `24x24`, so there's no visible point like `(25, 25)`. Everything will just get scaled up by a factor of `1.3` to give us a bigger SVG drawing. This is really useful because it means we can draw all of our icons using a fixed viewport size, and if we later want to scale it up, we don't have to adjust the shapes and their coordinates—the `width` and `height` will scale everything for us.

For this tutorial, I'll use a `viewBox` of `0 0 24 24` but dimensions of `64x64` so that the icons are easier to see. You can use any values that you want, though, as long as you adjust your markup accordingly.

### SVGs and "Pixels"

Before we move on, a clarifying note on pixels and SVGs: With the most basic SVG, one pixel unit maps to exactly one unit on your screen. But as noted on the MDN docs, [this isn't always the case](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions#what_are_pixels). SVGs are scalable, after all, so `1px` in the SVG coordinate space may actually map to `4px` if the SVG has been scaled to a larger size with `width` and `height`. This is unlike the behavior of raster images, where one "pixel" is always a fixed-size unit of measurement. Key takeaway: Wherever I use `px` as a unit, don't take that to mean one literal output pixel on the user's screen.

## Creating Basic Shapes with SVG

The best way to learn how to draw SVG icons by hand is to work with basic shapes. To get started, we'll draw some icons using lines. This will get us familiar with some of the basics of SVG before we dive into more advanced shapes.

### 1. Lines

We'll practice our line-drawing skills by recreating the three icons below. You'll find these in lots of text editors that offer text alignment options:

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="leftAlignTitle2 leftAlignDesc2">
      <title id="leftAlignTitle2">Left-alignment</title>
      <desc id="leftAlignDesc2">Four horizontal lines are stacked vertically and aligned to the left-hand margin, with tapering lengths to the right.</desc>
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="2" y1="9.4" x2="16" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="2" y1="19.8" x2="16" y2="19.8"/>
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="centerAlignTitle1 centerAlignDesc1">
      <title id="centerAlignTitle1">Center-alignment</title>
      <desc id="centerAlignDesc1">Four horizontal lines are stacked vertically and centered horizontally on the page.</desc>
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="6" y1="9.4" x2="18" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="6" y1="19.8" x2="18" y2="19.8"/>
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="rightAlignTitle1 rightAlignDesc1">
      <title id="rightAlignTitle1">Right-alignment</title>
      <desc id="rightAlignDesc1">Four horizontal lines are stacked vertically and aligned to the right-hand margin, with tapering lengths to the left.</desc>
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="8" y1="9.4" x2="22" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="8" y1="19.8" x2="22" y2="19.8"/>
    </svg>
  </li>
</ul>

Each icon consists of four horizontal lines. And to draw a line in SVG, we need two things:

- A starting point: `(x1, y1)`.
- An ending point: `(x2, y2)`.

As a reminder, an SVG's coordinate system starts with `(0, 0)` at the top-left corner. The `x`-values increase as you move to the right, and the `y`-values increase as you move down.

SVGs allow us to specify the starting and ending points for lines using four attributes: `x1`, `y1`, `x2`, and `y2`. So, to draw a simple horizontal line, we could do the following:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="0" y1="4.2" x2="24" y2="4.2"/>
</svg>
```

You can think of this as telling the browser to put an imaginary pen down at `(0px, 4.2px)` and move it right until it reaches `(24px, 4.2px)`.

If you use this markup on your end, you won't see anything just yet. That's because we haven't told the browser what color to use for the line! There are two ways we can do this:

- Setting the `stroke` attribute on the SVG element or any of its individual shapes.
- Setting the `stroke` property via CSS, on the SVG element or any of its shapes.

Both will do the same thing, but I prefer the CSS approach since it means writing less code. You can either pass in a hard-coded color, like a hex value, or use the magic `currentColor` value:

```css
svg {
  stroke: currentColor;
}
```

In CSS, `currentColor` always references the current text `color`, which is either the color inherited from the parent or whatever color you've explicitly defined for that element. I prefer `currentColor` for SVGs, as it makes it easy for me to insert my icons anywhere I want, and they'll inherit the surrounding text color. Moreover, if that text color is set using CSS custom properties, `currentColor` will change whenever the custom property changes! This is useful for styling SVG icons in apps that have both a light and a dark mode (like this site).

With the stroke color set, we can finally view our line:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" style="stroke-width: 1;" role="img" aria-labelledby="horizontalTitle1">
    <title id="horizontalTitle1">Horizontal line</title>
    <line x1="0" y1="4.2" x2="24" y2="4.2" />
  </svg>
</div>

When you scale this down, that line may actually look a bit thin. That's because it's using a default stroke width of `1` unit. Fortunately, we can change its thickness with the `stroke-width` attribute, either on the parent SVG element or any individual shape. If you set it on the SVG parent, all shapes will inherit that value. Like with the stroke color, though, you can also do this via a CSS property of the same name, like this:

```css {data-copyable=true}
svg {
  stroke-width: 2;
}
```

And the resulting line is thicker:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
    <line x1="0" y1="4.2" x2="24" y2="4.2"/>
  </svg>
</div>

I'll use a stroke width of `2` for the rest of this tutorial. You can pick a different value if you want, so long as you adjust the remaining calculations.

And that's all we need to know to draw the three icons we saw earlier! We'll just tweak the `x` coordinates to get shorter or longer lines, as needed. Here's the full markup for all three icons:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="2" y1="4.2" x2="22" y2="4.2"/>
  <line x1="2" y1="9.4" x2="16" y2="9.4"/>
  <line x1="2" y1="14.6" x2="22" y2="14.6"/>
  <line x1="2" y1="19.8" x2="16" y2="19.8"/>
</svg>
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="2" y1="4.2" x2="22" y2="4.2"/>
  <line x1="6" y1="9.4" x2="18" y2="9.4"/>
  <line x1="2" y1="14.6" x2="22" y2="14.6"/>
  <line x1="6" y1="19.8" x2="18" y2="19.8"/>
</svg>
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="2" y1="4.2" x2="22" y2="4.2"/>
  <line x1="8" y1="9.4" x2="22" y2="9.4"/>
  <line x1="2" y1="14.6" x2="22" y2="14.6"/>
  <line x1="8" y1="19.8" x2="22" y2="19.8"/>
</svg>
```

You may be wondering how I picked the `y` values. They do seem arbitrary, don't they? It turns out that we just have to do a bit of math.

We have four lines, each with a stroke width of `2`; together, they occupy a total of `8px` space. The remaining `16px` of space is distributed evenly among five gaps, giving us `3.2px` of spacing above and below each line. But note that if we place a line at some `y` value, it won't draw itself `2px` down from that point. Rather, it'll center itself at that level, with half its thickness above and below. So, the first line doesn't start at `y = 3.2px` but rather at `y = 3.2 + 1 = 4.2px`.

By the way, you may find it useful to temporarily give your SVG elements a border as you're drawing them so you can better visualize the constraints you're working with:

```css {data-copyable=true}
svg {
  border: 1px solid;
}
```

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
   <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="2" y1="9.4" x2="16" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="2" y1="19.8" x2="16" y2="19.8"/>
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="6" y1="9.4" x2="18" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="6" y1="19.8" x2="18" y2="19.8"/>
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
      <line x1="2" y1="4.2" x2="22" y2="4.2"/>
      <line x1="8" y1="9.4" x2="22" y2="9.4"/>
      <line x1="2" y1="14.6" x2="22" y2="14.6"/>
      <line x1="8" y1="19.8" x2="22" y2="19.8"/>
    </svg>
  </li>
</ul>

I'll do that for most demonstrations in this tutorial.

Before we move on, note that you don't have to draw lines that are perfectly horizontal. You can also draw perfectly vertical lines:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="12" y1="2" x2="12" y2="22" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
</div>

Or even diagonal lines:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <line x1="2" y1="2" x2="22" y2="22" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
</div>

And that's all that you really need to know about SVG lines. As an exercise, I'll challenge you to draw a hamburger icon, like you'd see for a mobile navigation menu.

By the way, have you noticed how all my lines have rounded ends? If you've been following along on your end, you may be seeing flat terminal ends, not round ones. You're not doing anything wrong! We'll go over this in the next section ([`stroke-linejoin` and `stroke-linecap`](#stroke-linejoin-and-stroke-linecap)).

### 2. Polylines

Imagine that we want to draw several line segments, like for the letter `T` in a text icon:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
    <polyline points="3 8, 3 4, 21 4, 21 8" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
</div>

Do we really have to draw an individual `<line>` shape for every single segment, and position each line at the correct location in our `24x24` grid? In this simple case, doing that wouldn't be such a big deal, but you can imagine this would get annoying for anything slightly more complex.

Fortunately for us, that's why `<polyline>` exists! It basically lets us define just the nodes/points for a path consisting of multiple line segments. The browser plays connect-the-dots for us, drawing the actual lines between each node.

A `<polyline>` is defined with the help of the `points` attribute, like this:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 4, 21 4" />
</svg>
```

This is the simplest possible `<polyline>` that you can create; it defines a horizontal line from `(3, 4)` to `(21, 4)`:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polyline points="3 4, 21 4" />
  </svg>
</div>

A `<polyline>` accepts a string consisting of comma-separated `x y` points. You don't have to use commas, but I like to because it makes the pairs of `(x, y)` points clear. Without commas, the above SVG is a little harder to read since you have to group the numbers mentally:

```html
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 4 21 4" />
</svg>
```

Anyway, your browser draws a solid line between the first pair of coordinates, a solid line between the second and third pairs of coordinates, and so on. However, note that a polyline does not automatically close itself. In other words, if you have `n` nodes, the `n-1` node won't cycle back and attach itself to the first node unless you explicitly repeat the first node in `points`. We'll revisit this idea in the [section on polygons](#4-polygons), but just keep that in the back of your mind for now.

We can draw the text icon I showed earlier by combining `<polyline>` and a basic `<line>` shape. We'll start by creating the top-left serif of the letter `T`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 8, 3 4" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polyline points="3 8, 3 4" />
  </svg>
</div>

From `(3, 4)`, we'll travel horizontally until we're an equal distance from the right edge as we were from the left:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 8, 3 4, 21 4" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" style="fill: currentColor !important;" role="presentation">
    <polyline points="3 8, 3 4, 21 4" />
  </svg>
</div>

Hmm, that's not right! The left and top edges of the letter `T` were drawn correctly, but there's a weird fill in between the two that creates an unwanted triangular shape. What's up with that?

This is because of an SVG property that I hid from you until now: `fill`. Just like `stroke` defines the color of the lines of an SVG shape, `fill` defines the background fill of the SVG. For most shapes, `fill` is set to `black` by default. But in this case, since we only want to draw lines and don't want any fill for this icon, we can set the fill to be `none`, either using the `fill` attribute on the SVG element or a CSS property of the same name.

Note that certain icons may actually benefit from having a custom fill, so you wouldn't want to *always* disable this globally in your app. But for our purposes, it's going to get in the way of drawing shapes like polylines, polygons, etc. since we don't actually *need* a fill. So, for the rest of this tutorial, I'll use this additional CSS to clear the fill for all icons:

```css {data-copyable=true}
svg {
  fill: none;
}
```

With that set, our shape should look correct now:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polyline points="3 8, 3 4, 21 4" />
  </svg>
</div>

Now, we'll drop down vertically again to complete the right serif of the letter `T`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 8, 3 4, 21 4, 21 8" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polyline points="3 8, 3 4, 21 4, 21 8" />
  </svg>
</div>

From here, we just need to complete the stem and base of the letter:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 8, 3 4, 21 4, 21 8" />
  <line x1="12" y1="4" x2="12" y2="20" />
  <line x1="8" y1="20" x2="16" y2="20" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polyline points="3 8, 3 4, 21 4, 21 8" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
</div>

Note that you could just as well use polylines for the two lines; you'll get the same shape:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polyline points="3 8, 3 4, 21 4, 21 8" />
  <polyline points="12 4, 12 20" />
  <polyline points="8 20, 16 20" />
</svg>
```

Awesome! You've now created four icons.

Before we move on, I want to discuss some more SVG attributes.

#### `stroke-linejoin` and `stroke-linecap`

In this article, the text icon above has rounded edges and ends:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="96" height="96" class="bordered" role="presentation">
    <polyline points="3 8, 3 4, 21 4, 21 8" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
</div>

But if you copy-paste the markup on your end, you'll get a text icon whose top-left and top-right corners are sharp and whose terminal ends (like for the serifs) are flat:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="96" height="96" class="bordered" role="presentation">
    <polyline points="3 8, 3 4, 21 4, 21 8" stroke-linejoin="miter" stroke-linecap="butt" />
    <line x1="12" y1="4" x2="12" y2="20" stroke-linejoin="miter" stroke-linecap="butt" />
    <line x1="8" y1="20" x2="16" y2="20" stroke-linejoin="miter" stroke-linecap="butt" />
  </svg>
</div>

This is because of two related SVG attributes (and their equivalent CSS properties):

- [`stroke-linejoin`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin): controls the rounding of corners in paths. It's set to `miter` by default, which means corners are sharp. You can use `round` to create rounded corners.
- [`stroke-linecap`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap): controls the rounding of terminal paths ("caps"), like on the ends of lines or polylines. Its default is `butt`, which gives you flat terminal ends. If you set it to `round`, you'll get rounded terminals.

For the remainder of this tutorial, all examples will use the following CSS:

```css {data-copyable=true}
svg {
  stroke-linejoin: round;
  stroke-linecap: round;
}
```

You don't have to use these if you don't want to. You can also apply them conditionally, to certain SVG elements but not to others, using attributes instead of CSS properties.

### 3. Circles

In this section, we'll learn how to draw these three circular SVG icons:

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="clockTitle2 clockDesc2">
      <title id="clockTitle2">Clock</title>
      <desc id="clockDesc2">A clock icon represented as a circle with two concentric lines for the hands, pointing in the 8 o'clock direction.</desc>
      <circle cx="12" cy="12" r="10" />
      <polyline points="13 7, 13 14, 9 14" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="infoTitle2 infoDesc2">
      <title id="infoTitle2">Info</title>
      <desc id="infoDesc2">An info icon often used to indicate additional information or notices. Represented as a circle with a concentric lowercase letter i.</desc>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="rightArrowTitle2 rightArrowDesc2">
      <title id="rightArrowTitle2">Right-arrow</title>
      <desc id="rightArrowDesc2">A rightward-pointing arrow centered inside a circle.</desc>
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <polyline points="12 8, 16 12, 12 16" />
    </svg>
  </li>
</ul>

Our knowledge of polylines will come in handy here, but there's a missing piece: circles!

In geometry class, you probably learned that in order to draw a circle, you need two things:

- The circle's center; we'll call this point `(cx, cy)`.
- The circle's radius, usually denoted as `r`.

Well, it's exactly the same with SVGs! Here's the markup for a simple circle:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
  </svg>
</div>

I chose a radius of `10` to leave `2px` of space on all sides of the circle; otherwise, if we pick a radius of `12`, it'll extend right until the very edge of the SVG and get cut off:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
    <circle cx="12" cy="12" r="12" />
  </svg>
</div>

Alternatively, you can set `overflow: visible` on your SVGs, but I prefer the first method since it gives my SVG icons a bit of padding, and overflows can throw off the spacing in your CSS.

Now that we know how to draw circles in SVG, we can draw the three icons shown earlier:

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
      <circle cx="12" cy="12" r="10" />
      <polyline points="13 7, 13 14, 9 14" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <polyline points="12 8, 16 12, 12 16" />
    </svg>
  </li>
</ul>

#### Clock Icon

We'll start with the face of the clock as a circle:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
  </svg>
</div>

The only thing left is to draw the clock hands, and for that we'll use a polyline:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
  <polyline points="13 7, 13 14, 9 14" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
    <polyline points="13 7, 13 14, 9 14" />
  </svg>
</div>

One down, two to go!

#### Info Icon

Just as before, we'll first create the circle:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
  </svg>
</div>

The rest of the info icon consists of a line and a circle. Here's the body of the `i`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
  <line x1="12" y1="12" x2="12" y2="16" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
</div>

And here's the dot in the `i`; we give it a fill so it's solid:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <circle cx="12" cy="12" r="10" />
  <circle cx="12" cy="8" r="0.5" fill="currentColor" />
  <line x1="12" y1="12" x2="12" y2="16" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
</div>

Observe that the radius is `0.5` because the circle is filled, and we don't want it to be thicker than the body of the `i`.

#### Right-Arrow Circle Icon

Last one! For this icon, I'll just give you the full markup; it's a circle, a line, and a polyline:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64" class="bordered">
  <circle cx="12" cy="12" r="10" />
  <line x1="8" y1="12" x2="16" y2="12" />
  <polyline points="12 8, 16 12, 12 16" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <polyline points="12 8, 16 12, 12 16" />
  </svg>
</div>

The line is the shaft of the arrow; the polyline creates the arrowhead. It's that simple!

### 4. Polygons

Remember how I mentioned that `<polyline>`s are not self-closing? Well, the natural progression from that is a shape that *is* self-closing, and that's the `<polygon>`! It works just like `<polyline>`, except it automatically creates a path between the last node and the first node, cycling back to where we started. While we could technically do this with `<polyline>`, `<polygon>` saves us an extra step, allowing us to easily create shapes like rectangles, octagons, triangles, and more!

For example, `<polygon>` allows us to draw a triangle using just three points:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polygon points="12 2, 22 22, 2 22" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polygon points="12 2, 22 22, 2 22" />
  </svg>
</div>

Cool! Building on this, we can now create the warning indicator icon that I showed you at the start of this tutorial. This should be familiar if you recall how we created the info icon before:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polygon points="12 2, 22 22, 2 22" />
  <line x1="12" y1="10" x2="12" y2="14" />
  <circle cx="12" cy="18" r="0.5" fill="currentColor" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polygon points="12 2, 22 22, 2 22" />
    <line x1="12" y1="10" x2="12" y2="14" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
  </svg>
</div>

By the way, I mentioned above that we can use `<polygon>` to create all kinds of shapes, but some come as pre-built shapes. For example, rectangles *can* be created with `<polygon>`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <polygon points="2 4, 22 4, 22 22, 2 22" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <polygon points="3 5, 21 5, 21 21, 3 21" />
  </svg>
</div>

But they can also be created with `<rect>`, which takes an `x` and a `y` coordinate for its top-left corner along with a `width` and `height`. This is all that's needed to draw a rectangle:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <rect x="4" y="4" width="18" height="18" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <rect x="3" y="5" width="18" height="16" />
  </svg>
</div>

While we're here, why don't we draw a calendar icon? That one is technically created using a `<path>`, which we'll learn about in the very next section. For now, we can use a `<rect>` and see how that looks.

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <rect x="3" y="5" width="18" height="16" />
  <line x1="4" y1="10" x2="20" y2="10" />
  <line x1="7" y1="3" x2="7" y2="7" />
  <line x1="17" y1="3" x2="17" y2="7" />
</svg>
```

This is fine, except the four corners are sharp:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <rect x="3" y="5" width="18" height="16" />
    <line x1="4" y1="10" x2="20" y2="10" />
    <line x1="7" y1="3" x2="7" y2="7" />
    <line x1="17" y1="3" x2="17" y2="7" />
  </svg>
</div>

Whereas the original icon has rounded corners:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
            M 4 4
            h 16
            a 2 2 0 0 1 2 2
            v 14
            a 2 2 0 0 1 -2 2
            h -16
            a 2 2 0 0 1 -2 -2
            v -14
            a 2 2 0 0 1 2 -2"
      />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="2" x2="7" y2="6" />
    <line x1="17" y1="2" x2="17" y2="6" />
  </svg>
</div>

(Whether this looks better is a matter of personal preference.)

For that, we'll need to learn about paths.

### 5. Paths

At long last, we arrive at `<path>`, one of the most powerful elements that SVGs have to offer. A path can be anything—a line, a circle, an arc, and much more. Most of the basic shapes that we've seen can be replicated with paths.

A tutorial on `<path>` alone would take quite some time, as there's a lot to cover. For now, we'll just look at some of the basics—drawing lines and arcs. This alone can get you very far when combined with everything else that we've learned.

#### How to Create Paths with SVG

To create a `<path>`, we need to learn a new syntax. The `<path>` element accepts a `d` attribute (which stands for *definition*). This attribute contains a set of **low-level instructions** that tell your browser what to draw. You can really think of it as an instruction manual, specifying every step in detail and sequentially: "Go here, do this, then go here and do that, and so on and so forth."

Here's what a `<path>` might look like:

```html
<path
  d="
    M 4 4
    h 16
    a 2 2 0 0 1 2 2
    v 14
    a 2 2 0 0 1 -2 2
    h -16
    a 2 2 0 0 1 -2 -2
    v -14
    a 2 2 0 0 1 2 -2"
/>
```

This is one of the most intimidating aspects of coding SVGs by hand, but once you learn the syntax behind the `d` commands, things will get much easier and far less scary. Hang in there!

As I noted above, the attribute takes a list of commands to draw a shape. You can view the [full list of path commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands) on the MDN docs, but I'll copy them here as well:

- MoveTo: `M`, `m`
- LineTo: `L`, `l`, `H`, `h`, `V`, `v`
- Cubic Bézier Curve: `C`, `c`, `S`, `s`
- Quadratic Bézier Curve: `Q`, `q`, `T`, `t`
- Elliptical Arc Curve: `A`, `a`
- ClosePath: `Z`, `z`

Since we're just starting out, we'll ignore some of those commands. I'll cover these ones:

- MoveTo: `M`, `m`
- LineTo: `L`, `l`, `H`, `h`, `V`, `v`
- Elliptical Arc Curve: `A`, `a`
- ClosePath: `Z`, `z`

#### SVG Path Commands: `MoveTo` and `LineTo`

A `<path>` command comes in two variants, as you may have noticed above:

- An uppercase version (e.g., `H`), denoting an absolute command.
- A lowercase version (e.g., `h`), denoting a relative command.

Here are examples of these two:

- `M 4 4`: Browser, please lift up your imaginary pen and move it to the point `(4, 4)`.
- `h 16`: From the location where you currently are, draw a line extending `16px` to the right.

This is easier to remember than it looks: `M` for **m**oving, `H/h` for **h**orizontal lines, `V/v` for **v**ertical lines, `A/a` for **a**rcs, `L/l` for lines in any direction, and so on.

If you're with me so far, then you should understand the first two commands in this path:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16"
  />
</svg>
```

That gives us this line, extending from `(4, 4)` to `(20, 4)`:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16"
    />
  </svg>
</div>

To help this sink in, let's also make a pause icon with two parallel vertical lines:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 8 8
        v 8
        m 8 0
        v -8"
    />
  </svg>
</div>

Here's the code that does that:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 8 8
      v 8
      m 8 0
      v -8"
  />
</svg>
```

Let's interpret these commands one at a time:

1. `M 8 8`: Lift your pen. Move to `(8, 8)` in our `24x24` coordinate system.
2. `v 8`: Put your pen down. Draw a vertical line `8px` down and stop.
3. `m 8 0`: Lift your pen. Move it over to the right by `8px` from where you are now.
4. `v -8`: Put your pen down. Draw a vertical line `8px` up and stop.

Notice how we mixed relative and absolute commands. We could've also said this:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 8 8
      V 8 16
      M 16 16
      V 16 8"
  />
</svg>
```

And that gives us the same exact shape, but requires that we specify absolute coordinates:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 8 8
        V 8 16
        M 16 16
        V 16 8"
    />
  </svg>
</div>

Relative commands are usually easier to work with, but it really depends on what you're drawing.

Finally, note that `L/l` is the more generic version of `H/h` and `V/v`. Whereas the latter two are used to draw lines in a single direction (horizontally or vertically), `L/l` can be used to draw lines in *any direction*. Thus, it always takes two numbers.

Here's an example of drawing a diagonal line with a relative `LineTo` command:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 2 2
      l 20 20"
  />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 2 2
        l 20 20"
    />
  </svg>
</div>

This says: "Move to `(2, 2)` and draw a line `20` units over to the right and `20` units down."

Note that we *could* always use the `L/l` command to draw all lines, but the shortcut variants save us some typing. For example, to draw horizontal lines with `l`, we have to explicitly zero-out the `y`-value, but we don't need to do that with `h`.

#### SVG Path Commands: `ClosePath`

The command `Z` (or `z`) stands for `ClosePath`. Remember when we learned about `<polygon>` and how it automatically closes itself? Well, `Z` is the command used to automatically close a `<path>`. Unlike the other commands that we've looked at so far, `ClosePath`'s lowercase and uppercase version are identical, so just pick one and stick with it (I'll use a lowercase `z`).

For example, to draw a self-closing square with `<path>`, we only need to draw three of the four lines explicitly; the fourth can be drawn automatically for us with the `ClosePath` command:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 2 2
      h 20
      v 20
      h -20
      z"
  />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 2 2
        h 20
        v 20
        h -20
        z"
    />
  </svg>
</div>

Once you get the hang of these basic movement commands, it's actually really easy to use `<path>`—sometimes, it's even *easier* than using separate shapes because you can create anything with a `<path>`, all in one place.

#### SVG Path Commands: `Elliptical Arc Curve`

I've saved the trickiest command for last, but once you understand how this one works, you can create almost any icon you want. By the end of this section, we'll create these two final icons:

<ul class="svg-tutorial__icon-grid">
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="calendarTitle2 calendarDesc2">
      <title id="calendarTitle2">Calendar</title>
      <desc id="calendarDesc2">A calendar icon with a rectangular body and two parallel vertical lines at the top, with a horizontal line near the top</desc>
      <path
        d="
              M 4 4
              h 16
              a 2 2 0 0 1 2 2
              v 14
              a 2 2 0 0 1 -2 2
              h -16
              a 2 2 0 0 1 -2 -2
              v -14
              a 2 2 0 0 1 2 -2"
       />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="7" y1="2" x2="7" y2="6" />
      <line x1="17" y1="2" x2="17" y2="6" />
    </svg>
  </li>
  <li class="svg-tutorial__icon">
    <svg viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="externalTitle2 externalDesc2">
      <title id="externalTitle2">External link</title>
      <desc id="externalDesc2">An icon used to represent external links and resources. A rectangular shape has a cut-out in the top-right corner; an arrow points out through that gap.</desc>
      <path
        d="M 18 14
          v 6
          a 2 2 0 0 1 -2 2
          H 6
          a 2 2 0 0 1 -2 -2
          V 10
          a 2 2 0 0 1 2 -2
          H 12"
       />
      <line x1="12" y1="14" x2="20" y2="6" />
      <polyline points="16 5.5, 20 5.5, 20 9.5" />
    </svg>
  </li>
</ul>

Arcs are how we draw **curved paths**, and just like all other path commands, they come in both an absolute (`A`) and a relative (`a`) variant. I highly recommend giving the MDN docs a read on the [Elliptial Arc Curve command](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#elliptical_arc_curve), but I'll also summarize everything you need to know here.

The parameters for SVG arcs are covered in the table below:

<div class="scroll-x">
  <table>
      <thead>
          <tr>
              <th scope="col">Command</th>
              <th scope="col">Parameters</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td><code>A</code> (absolute)</td>
              <td><code>rx ry x-axis-rotation large-arc-flag sweep-flag x y</code></td>
          </tr>
          <tr>
              <td><code>a</code> (relative)</td>
              <td><code>rx ry x-axis-rotation large-arc-flag sweep-flag dx dy</code></td>
          </tr>
      </tbody>
  </table>
</div>

- `rx`: The x-radius of the ellipse that forms the arc.
- `ry`: The y-radius of the ellipse that forms the arc.
- `x-axis-rotation`: How much to rotate the arc relative to the x-axis (usually, this is just `0`).
- `large-arc-flag`: if `1`, draws a large arc; otherwise, draws a small one.
- `sweep-flag`: if `1`, draws a clockwise arc; if `0`, draws a counter-clockwise arc.

One thing you'll notice is that the absolute and relative versions of the arc command (`A`/`a`) are almost identical except for their last two parameters. Whereas an uppercase `A` arc has an absolute `x` and a `y` that tell you where the arc ends, the lowercase relative arc specifies a delta-x (`dx`) and a delta-y (`dy`) displacement relative to the starting position of the arc.

{% aside %}
  **Note**: "Delta" is how we denote a change in a value in formal mathematical notation (typically using the Greek letter, &Delta;). So "delta-x" (&Delta;x) means "a change in x."
{% endaside %}

The first two parameters, `rx` and `ry`, should be familiar if you've worked with border radii in CSS. Since we're drawing an ellipse and not necessarily always a circle, we need to specify two radii. If our arc is circular, then `rx = ry`.

The `large-arc-flag` and `sweep-flag` parameters are probably the more confusing of all the parameters. Together, they're used to control the arc length and directionality. There's a good [Codepen demo](https://codepen.io/lingtalfi/pen/yaLWJG) that you can mess around with to get a better feel for how these parameters work.

As before, it helps to look at a concrete example. Here's a very simple arc in Quadrant 1:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 22 12
      a 10 10 0 0 0 -10 -10"
    />
</svg>
```

This yields a counter-clockwise arc because we've set `sweep-flag` to be `0`:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 22 12
        a 10 10 0 0 0 -10 -10"
      />
  </svg>
</div>

And, as you may have guessed, we can chain four arcs to create a circle:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 22 12
      a 10 10 0 0 0 -10 -10
      a 10 10 0 0 0 -10 10
      a 10 10 0 0 0 10 10
      a 10 10 0 0 0 10 -10"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 22 12
        a 10 10 0 0 0 -10 -10
        a 10 10 0 0 0 -10 10
        a 10 10 0 0 0 10 10
        a 10 10 0 0 0 10 -10"
      />
  </svg>
</div>

(But I think you'll agree that it's much easier to just use a `<circle>`.)

Great! We know everything needed in order to draw our two icons. Let's do this!

##### 1. Calendar Icon

I'll take this one step at a time so you can visualize the process.

First, we'll draw the top portion of the calendar (you could start elsewhere, though):

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16"
      />
  </svg>
</div>

Then, we draw a `2x2` clockwise arc, moving `2px` to the right and `2px` down:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2"
      />
  </svg>
</div>

From there, we go down `14px`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14"
      />
  </svg>
</div>

Draw the bottom-right corner's arc:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2"
      />
  </svg>
</div>

Move left by `16px`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2
      h -16"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2
        h -16"
      />
  </svg>
</div>

Draw the arc for the bottom-left corner:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2
      h -16
      a 2 2 0 0 1 -2 -2"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2
        h -16
        a 2 2 0 0 1 -2 -2"
      />
  </svg>
</div>

Move up `14px`:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2
      h -16
      a 2 2 0 0 1 -2 -2
      v -14"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2
        h -16
        a 2 2 0 0 1 -2 -2
        v -14"
      />
  </svg>
</div>

And finally, close off the shape with an explicit arc rather than `z` (which will draw a line).

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2
      h -16
      a 2 2 0 0 1 -2 -2
      v -14
      a 2 2 0 0 1 2 -2"
    />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="
        M 4 4
        h 16
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2
        h -16
        a 2 2 0 0 1 -2 -2
        v -14
        a 2 2 0 0 1 2 -2"
      />
  </svg>
</div>

And that's all there is to the rounded rectangle bit! Now, we just throw on a few lines:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="
      M 4 4
      h 16
      a 2 2 0 0 1 2 2
      v 14
      a 2 2 0 0 1 -2 2
      h -16
      a 2 2 0 0 1 -2 -2
      v -14
      a 2 2 0 0 1 2 -2"
    />
  <line x1="2" y1="10" x2="22" y2="10" />
  <line x1="7" y1="2" x2="7" y2="6" />
  <line x1="17" y1="2" x2="17" y2="6" />
</svg>
```

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" role="presentation">
    <path
      d="
            M 4 4
            h 16
            a 2 2 0 0 1 2 2
            v 14
            a 2 2 0 0 1 -2 2
            h -16
            a 2 2 0 0 1 -2 -2
            v -14
            a 2 2 0 0 1 2 -2"
      />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="2" x2="7" y2="6" />
    <line x1="17" y1="2" x2="17" y2="6" />
  </svg>
</div>

Again, you could also draw those lines with a `<path>` if you wanted to.

##### 2. External-Link Icon

We're almost done!

Hopefully, you're now comfortable enough with SVG paths to interpret the code here:

```html {data-copyable=true}
<svg viewBox="0 0 24 24" width="64" height="64">
  <path
    d="M 18 14
      v 6
      a 2 2 0 0 1 -2 2
      H 6
      a 2 2 0 0 1 -2 -2
      V 10
      a 2 2 0 0 1 2 -2
      H 12"
    />
  <line x1="12" y1="14" x2="20" y2="6" />
  <polyline points="16 5.5, 20 5.5, 20 9.5" />
</svg>
```

That gives us the classic external-link icon:

<div class="svg-tutorial__icon">
  <svg viewBox="0 0 24 24" width="64" height="64" class="bordered" role="presentation">
    <path
      d="M 18 14
        v 6
        a 2 2 0 0 1 -2 2
        H 6
        a 2 2 0 0 1 -2 -2
        V 10
        a 2 2 0 0 1 2 -2
        H 12"
      />
    <line x1="12" y1="14" x2="20" y2="6" />
    <polyline points="16 5.5, 20 5.5, 20 9.5" />
  </svg>
</div>

The arrow bit should be familiar from when we created the rightward-facing arrow; now, it's just a diagonal arrow pointing to the top-right. The body of the icon should also be familiar from the calendar, except here it's not closed off and starts at a different location.

And that's our last icon!

## Minifying SVG Paths

For this tutorial, I formatted the SVG paths nicely to make them easier for beginners to read and understand. But in the wild, you're more likely to encounter compact path notations like this:

```html
<path d="M18 14v6a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2" />
```

This may seem strange, but it's still the same syntax that we learned. The trick here is that we can unambiguously remove a space before and after each SVG path command (the letters). As long as we don't squish two consecutive numbers up against each other, we'll still get the same path definition as before.

You may come across this syntax if you've exported a compressed SVG from a drawing tool like Inkscape or if you've manually run it through an [SVG minifier](https://jakearchibald.github.io/svgomg/).

## Further Exploration: Advanced SVG Topics

Now that you've learned how to code SVG icons by hand, I recommend also learning about:

- SVG's [`<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs) and [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) elements.
- [SVG masks](http://tutorials.jenkov.com/svg/mask.html#:~:text=The%20SVG%20masking%20feature%20makes,version%20of%20a%20clip%20path.), which are used to control the opacity of parts of SVGs.
- [SVG curve commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#curve_commands).

All of these build on the concepts that you're already familiar with.

## Conclusion

Coding SVG icons by hand isn't too difficult, but it can certainly feel that way when you're just getting started. There's a lot of new syntax to learn, but it's definitely worth it! Now that you've worked through this tutorial, you should be able to read and interpret SVG markup more confidently and understand how the SVG icon libraries you use really work under the hood.

That does it for this tutorial! I hope you learned something new (and had fun!).
