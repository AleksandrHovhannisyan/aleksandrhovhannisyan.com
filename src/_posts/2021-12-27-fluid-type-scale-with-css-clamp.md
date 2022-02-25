---
title: Creating a Fluid Type Scale with CSS Clamp
description: Fluid typography allows each font size in a modular scale to vary responsively between a min and max. Learn how to programmatically generate a fluid type scale with a custom Sass function and CSS clamp.
keywords: [fluid typography, type scale, clamp, sass, font size]
categories: [css, sass, typography, math, clamp]
thumbnail: thumbnail.png
commentsId: 131
lastUpdated: 2022-01-02
---

For a long time, many design systems implemented static font sizing, with a set of progressively larger and smaller font size variables on either end of a baseline font size:

```css
html {
  --font-size-sm: 0.75rem;
  --font-size-base: 1rem;
  --font-size-md: 1.125rem;
  --font-size-lg: 1.5rem;
}
```

But this ran into a limitation: Since each step in the type scale was a constant font size, you often needed to write media queries to increase or decrease the font sizing for elements on a range of viewport widths to create a readable experience. Not only did this approach end up shipping more CSS, but it was also tedious to implement—designers would often need to provide you with two sets of values for mobile and desktop font sizes. It also meant that font sizes would change abruptly as soon as the screen hit a particular breakpoint, rather than scaling up and down smoothly.

**Fluid typography** is the modern solution to this problem, allowing each font size in a type scale to vary responsively between a minimum and maximum. It's one of the hottest topics in CSS—many articles have been written about how to best approach fluid sizing in CSS, and various open-source tools have cropped up that allow you to copy and paste fluid font-size declarations straight into your project. All of this is possible thanks to CSS's `clamp` function and the power of viewport units.

Arguably the biggest pain point with `clamp` is computing the right preferred value. You could do this by hand, but it's not super intuitive to think in viewport units unless you're dealing with common percentages. To address this problem, we can create a reusable Sass function that wraps CSS's native `clamp` and automatically computes the preferred value for us, given a min and max font size as well as a min and max breakpoint. To top it all off, we can use this function to programmatically generate CSS variables for a modular type scale.

{% aside %}
  If you're not using Sass, the approach outlined in this article can be applied in just about any context where you have access to simple math functions, including in vanilla CSS with the `calc` utility. The latter ends up being slightly more verbose, so I recommend using a preprocessor like Sass if possible.

  Alternatively, you can use [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/), an open-source tool I published that allows you to customize some parameters and copy-paste fluid typography variables into any project:

  {% include img.html src: "fluid-type-scale.png", alt: "The landing page for the Fluid Type Scale Calculator website features a big bold headline that reads: 'Fluid Type Scale Calculator.' Below is a subtitle that reads: 'Generate font size variables for a fluid type scale. Grab the output CSS and drop it into any existing design system.' Below the header is a two-column layout with a form on the left and some output code on the right showing CSS variables for font sizing." %}
{% endaside %}

{% include toc.md %}

## How Does `clamp` Work?

In short, `clamp` takes a preferred value and restricts it between a lower and upper bound:

```css
.element {
  font-size: clamp(min, preferred, max);
}
```

`clamp` will always try to return the preferred value, so long as that value lies between the min and max. If the preferred value is smaller than the minimum, `clamp` will return the minimum value. Conversely, if the preferred value is larger than the maximum, `clamp` will return the maximum. Hence the function's name—it *clamps* a value between two endpoints.

{% aside %}
  All of the examples in this article will use font size since that's the focus of this tutorial. However, it's worth noting that `clamp` can actually be used to fluidly scale any numeric property, including padding, margins, dimensions, borders, and much more.
{% endaside %}

### The Perfect Couple: `clamp` and Viewport Units

CSS's `clamp` function may not seem all that exciting at first glance, but it's especially powerful when the preferred value is expressed in viewport width (`vw`) units because this allows you to define a fluid measurement that gets recomputed whenever the viewport is resized. This allows us to replace media queries for font sizing with dynamic values that scale linearly.

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

The browser will first attempt to return the preferred value, which in this case is `4vw` (`4%` of the viewport width). Thus, the browser must first check the viewport width to see what absolute pixel value it yields. The table below lists a few scenarios.

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Viewport width</th>
        <th scope="col" class="numeric">Min</th>
        <th scope="col" class="numeric">Max</th>
        <th scope="col" class="numeric">Preferred</th>
        <th scope="col">Clamp return value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric"><code>320px</code></td>
        <td class="numeric"><code>16px</code></td>
        <td class="numeric"><code>24px</code></td>
        <td class="numeric"><code>12.8px</code></td>
        <td class="numeric"><code>16px</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>500px</code></td>
        <td class="numeric"><code>16px</code></td>
        <td class="numeric"><code>24px</code></td>
        <td class="numeric"><code>20px</code></td>
        <td class="numeric"><code>20px</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>1000px</code></td>
        <td class="numeric"><code>16px</code></td>
        <td class="numeric"><code>24px</code></td>
        <td class="numeric"><code>40px</code></td>
        <td class="numeric"><code>24px</code></td>
      </tr>
    </tbody>
  </table>
</div>

This is promising, but as I noted in the intro, there's one major drawback to using `clamp` in its raw form: We have to calculate the preferred value by hand, and it's not very easy for us to think in `vw` units unless we're dealing with common ratios. Fortunately, since we're using Sass, we can greatly simplify things by creating a custom clamp function that automatically computes the preferred value and interpolates it inside a vanilla CSS `clamp` declaration. Before we do that, we'll need to take a closer look at the relationship between font size and viewport width to come up with a mathematical solution to this problem.

### Finding the Preferred Value for Clamp with Linear Interpolation

So far, we haven't looked at how the preferred value for `clamp` is actually calculated. Technically, you could throw any arbitrary value in there and hope it works, like I did above. But it turns out that we can compute the right preferred value with mathematical precision.

First, we need to realize that we rarely ever want some arbitrary min and max font size without associating each one with a screen width. So instead of saying that we want our min font size to be `16px` and our max font size to be `19px`, we need to reword the problem. For example:

> "I want a minimum font size of `16px` at a viewport width of `400px` and a max font size of `19px` at a viewport width of `1000px`."

Now, we have four values instead of just two:

- A minimum font size (`16px`).
- A maximum font size (`19px`).
- The breakpoint up until which `clamp` should use the minimum value (`400px`).
- The breakpoint at which `clamp` should begin using the maximum value (`1000px`).

Since the minimum breakpoint corresponds to the minimum font size and the maximum breakpoint corresponds to the maximum font size, it makes more sense for us to pair these values together as a set of two `(x, y)` points of the form `(screenWidth, fontSize)`:

1. Minimum: `(400px, 16px)`
2. Maximum: `(1000px, 19px)`

From the graph shown below, this should make sense—we have viewport widths on the `x`-axis and font sizes on the `y`-axis. As the viewport width increases from the min point to the max, the font size also increases. Observe that the line between the minimum and maximum depicts the preferred value for `clamp`.

{% include img.html src: "thumbnail.png", alt: "A graph depicting font size on the y axis and viewport width on the horizontal axis. The plot consists of three line segments. The first is a horizontal line labeled minimum. The second is an upward-sloping line labeled preferred. At the endpoint of the second line is a third horizontal y-intercept that's labeled maximum.", caption: "As the viewport width increases, the font size increases linearly, up until a maximum." %}

So what's the line's equation? If we can figure that out, we'll have an expression that we can plug in for `clamp`'s preferred value. We already have the min and max, so this is the only missing piece.

Well, this linear relationship can be express mathematically using the slope intercept form `y = mx + b`. In this notation, `m` is the slope and denotes the rate of change for the `y` values (font size) relative to the `x` values (viewport width); meanwhile, `b` denotes the `y`-intercept.

In this case, finding the slope is easy—we get the difference between the two `y`-values (font sizes) and divide that by the difference between the `x`-values (viewport widths):

```
m = (maxFontSize - minFontSize) / (maxBreakpoint - minBreakpoint)
```

Plugging in the numbers from our example, we get this result:

```
m = (19px - 16px) / (1000px - 400px) = 1/20 = 0.005
```

This tells us that in our particular example, the font size increases by `0.005px` for every one unit of viewport width. We can plug this value back into the slope-intercept form along with one of the two original points to work out the `y`-intercept. We can use either point—it doesn't matter (I'll use the minimum).

```
y = mx + b
16px = 0.005(400px) + b
b = 16px - 0.005(400px) = 16px - 2px = 14px
```

Great! We now have two key pieces of information describing our line:

- The slope: `0.005`
- The y-intercept: `14px`

This gives us the following equation for `clamp`'s preferred value:

```
preferredValue = y = mx + b = 0.005(x) + 14px
```

In CSS, we'll need to express the slope using proper viewport units, which is done by multiplying the slope by `100` to get a percentage. This yields the following clamp declaration:

```css
p {
  font-size: clamp(16px, 0.5vw + 14px, 19px);
}
```

We've done it! Given just a min and max point, we've found the right preferred value for `clamp`. If you don't trust the math, try plugging in some numbers. The table below confirms that the preferred value returns the minimum font size at our minimum breakpoint and the maximum font size at our maximum breakpoint. At screen sizes between the minimum and maximum endpoints, the equation for `clamp`'s preferred value yields a responsive value.

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Viewport width</th>
        <th scope="col">Preferred value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>400px</code> (min breakpoint)</td>
        <td><code>0.005 * 400px + 14px = 16px</code></td>
      </tr>
      <tr>
        <td><code>700px</code> (halfway between)</td>
        <td><code>0.005 * 700px + 14px = 17.5px</code></td>
      </tr>
      <tr>
        <td><code>1000px</code> (max breakpoint)</td>
        <td><code>0.005 * 1000px + 14px = 19px</code></td>
      </tr>
    </tbody>
  </table>
</div>

As a final step, we'll want to express the pixel values in rems to respect the browser's font size settings. To do that, we'll divide each pixel value by `16px` (the root font size for all browsers):

```css
p {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.1875rem);
}
```

Great! To summarize, here are the steps we took to arrive at this solution:

1. We took a min and max point, each consisting of a font size and its breakpoint.
2. We found the equation for the line between these two points.
3. We plugged in that equation for `clamp`'s preferred value.
4. Finally, we converted all pixels to rems.

Now that we've gone through this exercise by hand, we can translate it over to code.

## Creating a Custom Clamp Function in Sass

We want to write a Sass function that accepts a min and max value and their corresponding breakpoints:

```scss
p {
  font-size: clamped(16px, 19px, 400px, 1000px);
}
```

{% aside %}
  We'll set default values for the breakpoints so we don't have to always pass them in.
{% endaside %}

Then, the function should return the following CSS, doing all of the math under the hood:

```css
p {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.1875rem);
}
```

To set defaults for the min and max breakpoints, we'll start by creating a map for our media breakpoints and importing some Sass namespaces (only needed if you're using Dart Sass):

```scss {data-file="_functions.scss" data-copyable=true}
@use "sass:math";
@use "sass:map";

$media-breakpoints: (
  mobile: 400px,
  desktop: 1000px,
  // ...other values can go in here
);
```

Next, we'll create our Sass function and set the default min and max breakpoints to mobile and desktop, respectively. That way, we can pass in overrides on a case-by-case basis but fall back to the logic of "min equals mobile" and "max equals desktop."

```scss {data-file="_functions.scss" data-copyable=true}
$default-min-bp: map.get($media-breakpoints, "mobile");
$default-max-bp: map.get($media-breakpoints, "desktop");

@function clamped($min-px, $max-px, $min-bp: $default-min-bp, $max-bp: $default-max-bp) {
  // code here
}
```

Now, we just need to find the slope and intercept of the equation representing the preferred value for clamp—the line between the min and max points. Here's the code for that bit:

```scss {data-file="_functions.scss" data-copyable=true}
$slope: math.div($max-px - $min-px, $max-bp - $min-bp);
$intercept-px: $min-px - $slope * $min-bp;
$slope-vw: $slope * 100;
```

And that's all the information that we need! The final step is to return a vanilla CSS clamp declaration from our Sass function, interpolating all of the relevant values in the string:

```scss
@return clamp(#{$min-px}, #{$slope-vw}vw + #{$intercept-px}, #{$max-px});
```

However, as I mentioned before, we don't want to use pixels for font sizing. To fix this, we can create another Sass function that can convert pixels to rems (maybe you already have one in your code base):

```scss {data-file="_functions.scss" data-copyable=true}
@function to-rems($px) {
  $rems: math.div($px, 16px) * 1rem;
  @return $rems;
}
```

And we'll use it to convert all of our pixels to rems. Here's the final code:

```scss {data-file="_functions.scss" data-copyable=true}
@function clamped($min-px, $max-px, $min-bp: $default-min-bp, $max-bp: $default-max-bp) {
  $slope: math.div($max-px - $min-px, $max-bp - $min-bp);
  $slope-vw: $slope * 100;
  $intercept-rems: to-rems($min-px - $slope * $min-bp);
  $min-rems: to-rems($min-px);
  $max-rems: to-rems($max-px);
  @return clamp(#{$min-rems}, #{$slope-vw}vw + #{$intercept-rems}, #{$max-rems});
}
```

Finally, note that depending on what values you pass into this function, you may get really long floating-point numbers. You can truncate them using a custom rounding function:

```scss {data-file="_functions.scss" data-copyable=true}
@function rnd($number, $places: 0) {
  $n: 1;
  @if $places > 0 {
    @for $i from 1 through $places {
      $n: $n * 10;
    }
  }
  @return math.div(math.round($number * $n), $n);
}

@function clamped($min-px, $max-px, $min-bp: $default-min-bp, $max-bp: $default-max-bp) {
  $slope: math.div($max-px - $min-px, $max-bp - $min-bp);
  $slope-vw: rnd($slope * 100, 2);
  $intercept-rems: rnd(to-rems($min-px - $slope * $min-bp), 2);
  $min-rems: rnd(to-rems($min-px), 2);
  $max-rems: rnd(to-rems($max-px), 2);
  @return clamp(#{$min-rems}, #{$slope-vw}vw + #{$intercept-rems}, #{$max-rems});
}
```

Awesome! Now, this Sass code:

```scss
p {
  font-size: clamped(16px, 19px);
}
```

Compiles to this CSS:

```css
p {
  font-size: clamp(1rem, 0.5vw + 0.88rem, 1.19rem);
}
```

Recall that this is the exact same result (but rounded) as what we got by hand in our earlier exploration. But by leveraging Sass's math capabilities, we were able to abstract this out into a reusable function. Now, we can pass whatever min and max values we want into our `clamp` utility, and it will guarantee responsive and fluid scaling. Even better, this can be reused for more than just font sizing.

But let's not stop there! Now, we'll use this function to create a fluid type scale.

## Creating a Fluid Type Scale with Clamping

In a [modular type scale](https://every-layout.dev/rudiments/modular-scale/), you start with a baseline font size and define a set of progressively larger and smaller "steps" on either end of the baseline. The next largest font size from the baseline is your chosen ratio times the baseline font size. The second largest font size is the baseline font size times the ratio squared. Similarly, if you're creating progressively smaller font sizes, you divide the base font size by your ratio.

This relationship can be expressed very naturally with exponents, where a given step's font size is the baseline font size times a multiple of the modular ratio. The table below lists some sample values, assuming a base font size of `16px` (`1rem`) and a modular ratio of `1.2` (known formally as the *minor third*).

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Step</th>
        <th scope="col" class="numeric">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sm</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>-1</sup></code></td>
      </tr>
      <tr>
        <td><code>base</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>0</sup></code></td>
      </tr>
      <tr>
        <td><code>md</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>1</sup></code></td>
      </tr>
      <tr>
        <td><code>lg</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>2</sup></code></td>
      </tr>
      <tr>
        <td><code>xl</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>3</sup></code></td>
      </tr>
    </tbody>
  </table>
</div>

### Naive Approach: Manually Creating a Type Scale

As a first pass, we could create custom properties for all of our font sizes and use an implicit modular scale, working out the min and max values by hand (e.g., with a calculator):

```scss
html {
  --font-size-sm: clamp(13.33px, 16px);
  --font-size-base: clamp(16px, 19.2px);
  --font-size-md: clamp(19.2px, 23.04px);
  --font-size-lg: clamp(23.04px, 27.65px);
  --font-size-xl: clamp(27.65px, 33.18px);
  --font-size-xxl: clamp(33.18px, 39.81px);
  --font-size-xxxl: clamp(39.81px, 47.78px);
}
```

This gets compiled to the following set of fluid typography variables:

```css
html {
  --font-size-sm: clamp(0.83rem, 0.44vw + 0.72rem, 1rem);
  --font-size-base: clamp(1rem, 0.53vw + 0.87rem, 1.2rem);
  --font-size-md: clamp(1.2rem, 0.64vw + 1.04rem, 1.44rem);
  --font-size-lg: clamp(1.44rem, 0.77vw + 1.25rem, 1.73rem);
  --font-size-xl: clamp(1.73rem, 0.92vw + 1.5rem, 2.07rem);
  --font-size-xxl: clamp(2.07rem, 1.11vw + 1.8rem, 2.49rem);
  --font-size-xxxl: clamp(2.49rem, 1.33vw + 2.16rem, 2.99rem);
}
```

But we can do better!

### Programmatically Generating a Fluid Type Scale

The previous approach works, but it's not ideal. If you ever want to use a different modular scale, you'll need to go through and update all of the min and max values by hand. Instead, we want to set up a reusable and low-effort pattern for fluid font sizing; we don't want to do any calculations by hand. So, in this section, we'll look at how to automate things even further by programmatically generating CSS custom properties for our font sizes using Sass loops.

The good news is that the work is essentially cut out for us, especially if we modify the table from earlier to work out both the min and max font sizes for each modular step. Again, this assumes a baseline font size of `16px` and a desired modular scale ratio of `1.2`.

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Modular step</th>
        <th scope="col" class="numeric">Min font size</th>
        <th scope="col" class="numeric">Max font size</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sm</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>-2</sup></code></td>
        <td class="numeric"><code>16 × (1.2)<sup>-1</sup></code></td>
      </tr>
      <tr>
        <td><code>base</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>0</sup></code></td>
        <td class="numeric"><code>16 × (1.2)<sup>1</sup></code></td>
      </tr>
      <tr>
        <td><code>md</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>1</sup></code></td>
        <td class="numeric"><code>16 × (1.2)<sup>2</sup></code></td>
      </tr>
      <tr>
        <td><code>lg</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>2</sup></code></td>
        <td class="numeric"><code>16 × (1.2)<sup>3</sup></code></td>
      </tr>
      <tr>
        <td><code>xl</code></td>
        <td class="numeric"><code>16 × (1.2)<sup>3</sup></code></td>
        <td class="numeric"><code>16 × (1.2)<sup>4</sup></code></td>
      </tr>
    </tbody>
  </table>
</div>

We'll start by creating the following variables:

```scss {data-file="_variables.scss" data-copyable=true}
@use "sass:math";

$type-base: 16px;
$type-scale: 1.2;
$type-steps: "sm", "base", "md", "lg", "xl", "xxl", "xxxl";
$type-base-index: list.index($type-steps, "base");
```

The `$type-steps` list contains the names of all of the steps in our type scale. We also need to know the index of the baseline font size so we can generate the right exponents for each step.

Now, we'll loop over the modular steps and combine everything we've learned so far to programmatically generate font variables:

```scss {data-file="index.scss" data-copyable=true}
html {
  @for $i from 1 through length($type-steps) {
    $step: list.nth($type-steps, $i);
    $min: $type-base * math.pow($type-scale, $i - $type-base-index);
    $max: $type-base * math.pow($type-scale, $i - $type-base-index + 1);
    --font-size-#{$step}: #{clamped($min, $max)};
  }
}
```

Which outputs the same result as before:


```css
html {
  --font-size-sm: clamp(0.83rem, 0.44vw + 0.72rem, 1rem);
  --font-size-base: clamp(1rem, 0.53vw + 0.87rem, 1.2rem);
  --font-size-md: clamp(1.2rem, 0.64vw + 1.04rem, 1.44rem);
  --font-size-lg: clamp(1.44rem, 0.77vw + 1.25rem, 1.73rem);
  --font-size-xl: clamp(1.73rem, 0.92vw + 1.5rem, 2.07rem);
  --font-size-xxl: clamp(2.07rem, 1.11vw + 1.8rem, 2.49rem);
  --font-size-xxxl: clamp(2.49rem, 1.33vw + 2.16rem, 2.99rem);
}
```

The tricky part here is the exponent logic for the min and max values:

```scss
$min: $type-base * math.pow($type-scale, $i - $type-base-index);
$max: $type-base * math.pow($type-scale, $i - $type-base-index + 1);
```

We're doing `$i - $type-base-index` for each step's minimum font size since our base modular step need not be the first element in the list (e.g., if we have smaller steps, like `sm` in the example above). So we get its index and subtract it from the current index to obtain the correct offset for the min exponent. Adding one to this result gives us the max exponent. The table below illustrates this for a few modular steps.

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Step</th>
        <th scope="col" class="numeric">$i</th>
        <th scope="col" class="numeric">$type-base-index</th>
        <th scope="col" class="numeric">$i - $type-base-index</th>
        <th scope="col" class="numeric">$i - $type-base-index + 1</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sm</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>2</code></td>
        <td class="numeric"><code>-1</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td><code>base</code></td>
        <td class="numeric"><code>2</code></td>
        <td class="numeric"><code>2</code></td>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>1</code></td>
      </tr>
      <tr>
        <td><code>md</code></td>
        <td class="numeric"><code>3</code></td>
        <td class="numeric"><code>2</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>2</code></td>
      </tr>
    </tbody>
  </table>
</div>

In short, the code loops through each font step and generates a min and max using our desired type scale. Then, these min and max values get passed along to our custom `clamped` function, which automatically computes the preferred value. We get the same result as in the previous section, but now we're free to customize the baseline font size and type scale by just tweaking two variables. Everything just works!

{% aside %}
  Once again, you may want to round the values using the function we created earlier.
{% endaside %}

#### Using a Different Type Scale for Mobile vs. Desktop

The approach we just explored involves picking a minimum font size for the base modular step and deriving the maximum font size for each step using some power of our chosen ratio (e.g., `1.2`). But this does not always yield desirable results. Depending on the type scale you've chosen, you may still end up getting font sizes on mobile that are too large, even though your font sizes are technically fluid.

Instead, you may want the min and max font sizes to be independent. In that case, rather than specifying just a min font size and a single type scale, we actually need to have two separate sets of variables: one for the minimum (mobile) and another for the maximum (desktop). So whereas before we had just one base font size, now we'll need two: an explicit minimum and maximum font size.

```scss {data-file="_variables.scss" data-copyable=true}
$type-base-min: 16px;
$type-base-max: 19px;
```

Similarly, we'll need a corresponding minimum and maximum type scale:

```scss {data-file="_variables.scss" data-copyable=true}
$type-scale-min: 1.2;
$type-scale-max: 1.333;
```

And now, we'll adjust our loop to use these new variables for the min and max, respectively:

```scss {data-file="index.scss" data-copyable=true}
html {
  @for $i from 1 through length($type-steps) {
    $step: list.nth($type-steps, $i);
    $power: $i - $type-base-index;
    $min: $type-base-min * math.pow($type-scale-min, $power);
    $max: $type-base-max * math.pow($type-scale-max, $power);
    --font-size-#{$step}: #{clamped($min, $max)};
  }
}
```

This gives you greater control over your font sizing since you're no longer locked into a single type scale for both mobile and desktop. Now, you're free to choose a different ratio for each breakpoint. I recommend using a smaller ratio for mobile than the one used on desktop. This ensures that your font sizing remains optimally legible on smaller devices.

If you're using my [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/), this separation between mobile and desktop is more obvious since you're asked to configure two separate sets of variables for the base font size, screen width, and modular ratio:

{% include img.html src: "groups.png", alt: "A form on the left and some code output on the right. Two groups of inputs can be seen in the form. The first is titled 'Minimum (mobile)', while the second is titled 'Maximum (desktop)'. Each group contains three inputs, in order: font size, screen width, and type scale." %}

## Clamp All the Things

That was quite a lot to get through! But I hope you stuck with me all the way through to the end. Because if you did, you can now harness the power of Sass to generate perfectly fluid values for *anything*. We only looked at one application of this technique: generating a fluid type scale. But the truth is that you can reuse the `clamped` function for margins, padding, and basically any other numeric property.

I hope you enjoyed this post!

## Additional Resources

- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/), an open-source tool I created to help you fine-tune fluid typography for any project.
- Andy Bell: [Consistent, Fluidly Scaling Type and Spacing](https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/)
- Adrian Bece: [Modern fluid typography editor](https://modern-fluid-typography.vercel.app)
- Jeremy Church: [Type Scale - A Visual Calculator](https://type-scale.com/)
