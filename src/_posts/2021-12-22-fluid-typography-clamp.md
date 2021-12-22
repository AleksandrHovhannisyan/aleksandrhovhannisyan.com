---
title: Effortless Fluid Typography with Clamp and Sass
description: Fluid typography allows each font size in your modular scale to vary responsively between a min and max. Learn how to set up a custom Sass function that automatically computes the preferred value for clamp and allows you to generate a set of fluid typography variables, with a modular type scale to boot.
keywords: [fluid typography, clamp, type scale, sass]
categories: [css, sass, typography, clamp]
thumbnail: thumbnail.png
---

Traditionally, design systems implemented static font sizing, with a set of progressively larger and smaller font size variables. But this ran into a limitation: Since each step in the modular scale was a constant font size, you often needed to write media queries to increase or decrease the font sizing for elements on a range of viewport widths. Not only does this ship more CSS, but it's also tedious to implement. It also means that font sizes will change abruptly when they hit a particular breakpoint, rather than scaling up and down smoothly.

Fluid typography is the modern solution to this problem, allowing each font size to scale between a minimum and a maximum and to take on a responsive value somewhere in between. It's currently one of the hottest topics in CSS—many libraries have come up with their own clever systems for creating a fluid type scale, where each font size variable scales up and down as needed. This is all possible thanks to CSS's `clamp` function and the power of viewport units.

But the biggest pain point with `clamp` is that you have to compute the preferred values by hand, and it's not super intuitive to think in viewport units since those are dependent on a particular device width. To address this problem, we can create a reusable Sass function that wraps CSS's native `clamp` and automatically computes the preferred value for us, based on some simple breakpoint configs. Towards the end of this tutorial, we'll also look at how you can leverage this custom function to programmatically generate CSS custom properties for a modular type scale.

{% include toc.md %}

## How Does `clamp` Work?

If this is your first time using `clamp`, this section will provide a brief primer on how it works and why it's so useful.

In short, `clamp` takes a preferred value and restricts it between a lower and upper bound:

```css
.element {
  font-size: clamp(min, preferred, max);
}
```

`clamp` will always try to return the preferred value, so long as it lies between the min and max. If the preferred value is smaller than the minimum, `clamp` will return the minimum value. Conversely, if the preferred value is larger than the maximum, `clamp` will return the maximum. Hence the function's name!

{% include img.html src: "thumbnail.png", alt: "A graph depicting font size on the y axis and viewport width on the horizontal axis. The plot consists of three line segments. The first is a horizontal line labeled minimum. The second is an upward-sloping line labeled preferred. At the endpoint of the second line is a third horizontal y-intercept that's labeled maximum.", caption: "Figure 1: visualizing clamp. As the viewport width increases, the font size increases fluidly, up until a maximum." %}

It's worth noting that while font sizing is the most popular application of `clamp`, it can actually be used to fluidly scale any numeric property, including padding, margins, dimensions, borders, and much more.

### A Perfect Match: `clamp` and Viewport Units

CSS's clamp function may not seem all that exciting at first glance, but it's especially powerful when the preferred value is expressed in viewport width (`vw`) units because this allows you to define a fluid measurement that gets recomputed whenever the viewport is resized.

One `vw` translates to one percent of the current viewport width. Thus, a value of `10vw` is `10%` of the viewport's current width. So if the viewport is `360px` wide, then `10vw` evaluates to `36px`. We can use `clamp` and `vw` together to create a responsive value that scales with the viewport width but is always confined within the bounds of a minimum and maximum.

For example, suppose that we have the following CSS to set a font size:

```css
p {
  font-size: clamp(1rem, 4vw, 1.5rem);
}
```

We have the following values:

- Minimum: `1rem` (`16px`)
- Preferred: `4vw`
- Maximum: `1.5rem` (`24px`)

The browser will first attempt to return the preferred value, which in this case is `4vw` (`4%` of the viewport width). Thus, the browser must first check the viewport width to see what absolute pixel value it yields. The table below summarizes a few sample scenarios.

<table>
  <thead>
    <tr>
      <th scope="col">Viewport width</th>
      <th scope="col">Min</th>
      <th scope="col">Max</th>
      <th scope="col">Preferred</th>
      <th scope="col">Clamp return value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>320px</code></td>
      <td><code>16px</code></td>
      <td><code>24px</code></td>
      <td><code>12.8px</code></td>
      <td><code>16px</code> (min)</td>
    </tr>
    <tr>
      <td><code>500px</code></td>
      <td><code>16px</code></td>
      <td><code>24px</code></td>
      <td><code>20px</code></td>
      <td><code>20px</code> (preferred)</td>
    </tr>
    <tr>
      <td><code>1000px</code></td>
      <td><code>16px</code></td>
      <td><code>24px</code></td>
      <td><code>40px</code></td>
      <td><code>24px</code> (max)</td>
    </tr>
  </tbody>
</table>

This is promising, but as I noted in the intro, there's one major drawback to using `clamp`: We have to calculate the preferred value by hand, and it's not very easy for us to think in `vw` units unless we're dealing with common ratios. Fortunately, since we're using Sass, we can greatly simplify things by creating a custom clamping function that automatically computes the preferred value and interpolates it inside a CSS `clamp` declaration.

## Creating a Custom Clamp Function in Sass

In short, we want to be able to do this in our CSS, without caring about how the preferred value is calculated under the hood:

```scss
p {
  font-size: clamped(16px, 24px);
}
```

Here, `clamped` is the name of the custom Sass function that we're going to create. Here's a boilerplate skeleton for the function that we'll fill in shortly:

{% include codeHeader.html file: "_functions.scss" %}
```scss
@function clamped($min-px, $max-px) {
  $min-rems: ;
  $max-rems: ;
  $preferred-value: ;
  @return clamp(#{$min-rems}, #{$preferred-value}vw, #{$max-rems});
}
```

We can approach this a few different ways. My preference is to have CSS's `clamp` always return the minimum value on my mobile breakpoint and to scale up linearly from there until it hits the maximum value. In this mobile-first approach, we basically disregard the desktop breakpoint; we just define a minimum and allow the value to scale up. This means that our preferred value is the minimum font size divided by the mobile breakpoint.

Let's look at that example usage again:

```scss
p {
  font-size: clamped(16px, 24px);
}
```

With the logic outlined above, I want this paragraph to have a font size of `16px` at `400px` and to scale up from there. To express the preferred value in viewport width units, all we need to do is divide this font size by the mobile viewport width. I'll assume you've created a Sass map for your breakpoints:

{% include codeHeader.html file: "_functions.scss" %}
```scss
@use "sass:math";
@use "sass:map";

// other breakpoints can go here
$media-breakpoints: (
  mobile: 400px
);

@function clamped($min-px, $max-px) {
  $mobile-min-px: map.get($media-breakpoints, "mobile");
  $preferred-value: math.div($min-px, $mobile-min-px) * 100;
}
```

Next, to ensure that our `clamp` declaration is responsive, we want to be able to express the pixel arguments in `rem`s. To do that, we'll create a simple helper function that converts pixels to rems (maybe you already have such a function):

{% include codeHeader.html file: "_functions.scss" %}
```scss
@function to-rems($px) {
  $value-rems: math.div($value, 16px) * 1rem;
  @return $value-rems;
}
```

And now, we'll use it like so in our custom clamping function:

{% include codeHeader.html file: "_functions.scss" %}
```scss
@function clamped($min-px, $max-px) {
  $mobile-min-px: map.get($media-breakpoints, "mobile");
  $preferred-value: math.div($min-px, $mobile-min-px) * 100;
  $min-rems: to-rem($min-px);
  $max-rems: to-rem($max-px);
}
```

{% aside %}
  Alternatively, you could use the [62.5% font sizing trick](/blog/respecting-font-size-preferences-rems-62-5-percent/) and always pass in rems to the function. It's up to you which approach you take. I've used pixels in this tutorial to limit the complexity and scope of the code I have to show.
{% endaside %}

Finally, all we need to do is interpolate these three values in a standard CSS `clamp` and return that CSS string from our function. Here's the final code:

{% include codeHeader.html file: "_functions.scss" %}
```scss
@function clamped($min-px, $max-px) {
  $mobile-min-px: map.get($media-breakpoints, "mobile");
  $preferred-value: math.div($min-px, $mobile-min-px) * 100;
  $min-rems: to-rem($min-px);
  $max-rems: to-rem($max-px);
  @return clamp(#{$min-rems}, #{$preferred-value}vw, #{$max-rems});
}
```

Awesome! Now, this code:

```scss
p {
  font-size: clamped(16px, 24px);
}
```

Compiles to this CSS:

```css
p {
  font-size: clamp(1rem, 4vw, 1.5rem);
}
```

This is the exact CSS we looked at in the intro, except we didn't have to compute the preferred value by hand—our function did all of the heavy lifting for us. Plus, we can express our values in pixels and lean on the function to automatically convert them to `rem`s under the hood.

{% aside %}
  You could also change this behavior to make conversion to rems optional.
{% endaside %}

Now that we've set up a custom clamp function, it's time to take things a step further and define custom properties for our design system's fluid typography.

## Modular Type Scale with `clamp`

As a first pass, we can create custom properties for all of our font sizes by hand:

```scss
html {
  --font-size-sm: #{clamped(13px, 16px)};
  --font-size-base: #{clamped(16px, 19px)};
  --font-size-md: #{clamped(19px, 23px)};
  --font-size-lg: #{clamped(23px, 28px)};
  --font-size-xl: #{clamped(28px, 34px)};
  --font-size-xxl: #{clamped(34px, 40px)};
  --font-size-xxxl: #{clamped(40px, 48px)};
}
```

{% aside %}
  I like to use semantic names of `sm`, `md`, `lg`, and so on, but feel free to replace these with whatever convention you prefer in your own design system.
{% endaside %}

This gets compiled to the following set of reusable, fluid typography variables:

```css
html {
  --font-size-sm: clamp(0.8125rem, 3.25vw, 1rem);
  --font-size-base: clamp(1rem, 4vw, 1.1875rem);
  --font-size-md: clamp(1.1875rem, 4.75vw, 1.4375rem);
  --font-size-lg: clamp(1.4375rem, 5.75vw, 1.75rem);
  --font-size-xl: clamp(1.75rem, 7vw, 2.125rem);
  --font-size-xxl: clamp(2.125rem, 8.5vw, 2.5rem);
  --font-size-xxxl: clamp(2.5rem, 10vw, 3rem);
}
```

On mobile, `font-size-base` is `16px` (`1rem`). From that breakpoint onward, it scales up linearly until it hits the maximum font size of `19px`. The same logic is repeated for all of the other variables.

Additionally, notice that each font size step's maximum corresponds to the minimum of the next largest step. This creates a set of perfectly fluid typography tokens that scale up and down in a stepwise fashion.

### Programmatically Generating the Type Scale

That approach works great, but what if I told you we can do better? In the example above, I used an implicit [modular type scale](https://type-scale.com/) to ensure that my font size steps are harmoniously related to each other. I used a ratio of roughly `1.2` (with rounding), known formally as *minor third*.

In a modular scale, the next largest font size is just your chosen ratio times the previous font size. Likewise, if you're creating progressively smaller font sizes, you divide the previous font size by your ratio. This relationship can be expressed very naturally with exponents. The table below illustrates some sample values, assuming a base font size of `16px` (`1rem`).

<table>
  <thead>
    <tr>
      <th scope="col">Step</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>xs</code></td>
      <td><code>16 × (1.2)<sup>-2</sup></code></td>
    </tr>
    <tr>
      <td><code>sm</code></td>
      <td><code>16 × (1.2)<sup>-1</sup></code></td>
    </tr>
    <tr>
      <td><code>base</code></td>
      <td><code>16 × (1.2)<sup>0</sup></code></td>
    </tr>
    <tr>
      <td><code>md</code></td>
      <td><code>16 × (1.2)<sup>1</sup></code></td>
    </tr>
    <tr>
      <td><code>lg</code></td>
      <td><code>16 × (1.2)<sup>2</sup></code></td>
    </tr>
    <tr>
      <td><code>xl</code></td>
      <td><code>16 × (1.2)<sup>3</sup></code></td>
    </tr>
  </tbody>
</table>

The good news is that the work is essentially cut out for us. By leveraging Sass's support for looping and math functions, we can automatically generate a fluid typography system in just a few lines of code and a few additional Sass variables:

{% include codeHeader.html file: "_variables.scss" %}
```scss
@use "sass:math";

$type-base: 16px;
$type-scale: 1.2;
$type-steps: "xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl";
$type-base-index: list.index($type-steps, "base");

html {
    @for $i from 1 through length($type-steps) {
      $step: list.nth($type-steps, $i);
      --font-size-#{$step}:
        #{clamped(
          $type-base * math.pow($type-scale, $i - $type-base-index),
          $type-base * math.pow($type-scale, $i - $type-base-index + 1)
        )};
    }
}
```

Really, the only tricky part is the exponent logic here:

```
#{clamped(
  $type-base * math.pow($type-scale, $i - $type-base-index),
  $type-base * math.pow($type-scale, $i - $type-base-index + 1)
)};
```

It's easier to visualize this if you go through the calculations by hand and list out the min and max for each font size step. Here's a table showing some of those calculations:

<table>
  <thead>
    <tr>
      <th scope="col">Modular step</th>
      <th scope="col">Min (mobile)</th>
      <th scope="col">Max (tablet/desktop)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>sm</code></td>
      <td><code>16 × (1.2)<sup>-2</sup></code></td>
      <td><code>16 × (1.2)<sup>-1</sup></code></td>
    </tr>
    <tr>
      <td><code>base</code></td>
      <td><code>16 × (1.2)<sup>0</sup></code></td>
      <td><code>16 × (1.2)<sup>1</sup></code></td>
    </tr>
    <tr>
      <td><code>md</code></td>
      <td><code>16 × (1.2)<sup>1</sup></code></td>
      <td><code>16 × (1.2)<sup>2</sup></code></td>
    </tr>
    <tr>
      <td><code>lg</code></td>
      <td><code>16 × (1.2)<sup>2</sup></code></td>
      <td><code>16 × (1.2)<sup>3</sup></code></td>
    </tr>
    <tr>
      <td><code>xl</code></td>
      <td><code>16 × (1.2)<sup>3</sup></code></td>
      <td><code>16 × (1.2)<sup>4</sup></code></td>
    </tr>
  </tbody>
</table>

{% aside %}
We're doing `$i - $type-base-index` to get the power for the min since our base modular step is not the first element in the list. So we basically just get its index and subtract it from the current index to get the correct offset.
{% endaside %}

The code loops through each font step and generates a min and max using our desired type scale. Effectively, we get the same result as before, but now we're free to customize the base font size and type scale. Everything just works!

### A Reusable Font Size Mixin

If you're anything like I am, you're lazy to a fault. We've already written a bunch of code to automatically generate fluid typography, and we could certainly stop here and call it a day. But typing out all those variable names is going to be annoying:

```scss
p {
  font-size: var(--font-size-base);
}
```

Instead, we can create a reusable Sass mixin that accepts the name of a font size step and returns the `font-size` CSS for us. We can even add validation to prevent accidentally passing in an invalid name:

{% include codeHeader.html file: "_mixins.scss" %}
```scss
@mixin font-size($step) {
  $step-index: list.index($type-steps, $step);
  @if $step-index != null {
    font-size: var(--font-size-#{$step});
  } @else {
    @error "Font size step #{$step} is not recognized.";
  }
}
```

Now, we can just do this:

```scss
p {
  @include font-size("base");
}
```

## Clamp All the Things

This tutorial looked at just one useful application of `clamp`: generating fluid typography variables that scale between a min and max, with a proper type scale to boot. But it's worth reiterating that you don't *have* to limit yourself to just clamping font sizes. On my site, I use `clamp` for padding, margins, and anything else that I want to scale fluidly between mobile and desktop. The nice thing is that our custom clamp function does not make any assumptions about what properties are being used, so you can reuse it for any numeric property.

I hope you enjoyed this post! Let me know what neat things you end up creating with this technique.

## Additional Resources

- Andy Bell: [Consistent, Fluidly Scaling Type and Spacing](https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/)
- Mike Riethmuller: [Precise control over responsive typography](https://www.madebymike.com.au/writing/precise-control-responsive-typography/)
- Adrian Bece: [Modern fluid typography editor](https://modern-fluid-typography.vercel.app)
- Jeremy Church: [Type Scale - A Visual Calculator](https://type-scale.com/)
