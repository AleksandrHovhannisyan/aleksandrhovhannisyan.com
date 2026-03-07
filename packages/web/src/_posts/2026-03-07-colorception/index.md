---
title: Colorception
description: What happens when you derive an element's color from its inherited color in CSS?
keywords: [css, color, color-mix, relative color]
categories: [css, case-study]
scripts:
  - type: module
    src: src/assets/scripts/components/codeDemo.ts
---

While cleaning up some four-year-old old CSS at work, I realized I could greatly simplify the placeholder styles for our text editor. We were manually setting placeholder colors in different areas in the app, but all we really wanted was for the placeholders to be a muted version of the actual text color, whatever that may be.

Oh, the _actual text color_? You mean... [`currentColor`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value#currentcolor_keyword)?

```css
.placeholder {
  color: rgba(from currentColor r g b / 0.5);
}
```

To be honest, I was a bit surprised that you can use `currentColor` with the relative-color syntax. I had only ever used it to set _other_ properties, but I hadn't considered that you could use it to create a _new_ color that you then pass to `color`.

{% aside %}
Also, [relative colors](https://caniuse.com/css-relative-colors) weren't supported when we originally wrote that code.
{% endaside %}

## Why it works

As a reminder, `currentColor` resolves to one of two values:

1. An explicit color set on the current element, or
2. A color set on (and inherited from) the nearest ancestor, or user agent styles.

For example:

```html
<div class="red">
  Red
  <div>
    Inherited red
      <div class="green">
        Green
        <div>
          Inherited green
        </div>
      </div>
  </div>
</div>
```

```css
.red { color: red; }
.green { color: green; }
.green div { border: solid 2px currentColor; }
```

Here's the rendered result:

<code-demo description="Demo of rendering four text elements in different colors" fit-content>
    <template>
        <div class="red">
        Red
            <div>
                Inherited red
                <div class="green">
                    Green
                    <div>
                    Inherited green
                    </div>
                </div>
            </div>
        </div>
        <style>
            .red { color: red; }
            .green { color: green; }
            .green div { border: solid 2px currentColor; }
        </style>
    </template>
</code-demo>

The final `<div>` in this example gets a solid green border because `currentColor` resolves to the `green` explicitly set on (and inherited from) `div#green`.

But what about deriving a new color from `currentColor` and using _that_ new value to set `color` like I showed before?

```css
.placeholder {
  color: rgba(from currentColor r g b / 0.5);
}
```

At first, this may seem circular: We derive a new color from `currentColor`, which is either an explicit `color` or an inherited one, and then we use that to set... `color`? But remember, `color` hasn't been set yet on this element—the CSSOM is constructed in a top-down fashion with right-to-left associativity, meaning the right side of a rule gets evaluated first before it's assigned to the property.

This got me thinking... What if we apply this recursively?

## Infinitely nested colors

I then tried this:

```html
<div id="demo">
  one
  <div>
    two
    <div>
      three
      <div>
        four
        <div>
          five
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
#demo {
  color: red;
}
#demo div {
  color: rgba(from currentColor r g b / 0.5);
}
```

<code-demo description="Demo of rendering five text elements in a red color, with the last four slightly transparent" fit-content>
    <template>
        <div id="colors-demo">
            one
            <div>
                two
                <div>
                three
                <div>
                    four
                    <div>
                    five
                    </div>
                </div>
                </div>
            </div>
        </div>
        <style>
            #colors-demo { color: red; }
            #colors-demo div { color: rgba(from currentColor r g b / 0.5); }
        </style>
    </template>
</code-demo>

But sadly, it didn't work, and all the child `<div>`s received the same transparency of 50% rather than fading out. Why?

In hindsight, the answer should've been obvious, but this question stumped me and several other folks when I asked online. Then, Sara Joy clarified what's going on:

{% quote "@sjoy.lol on Bluesky", "https://bsky.app/profile/sjoy.lol/post/3mg6mmd52kc2r" %}
In the relative color syntax, we're asking to keep the same values of whatever we plop back in as the colour components (here r, g and b) and then ignoring the existing 'a' and giving an entirely new value to the alpha channel.

Each time, you're just saying "0.5 please", not "0.5 of previous"
{% endquote %}

That makes perfect sense! What I _actually_ wanted was for the colors to be progressively more transparent the deeper you went in the DOM, but I was ignoring the alpha channel of the inherited color, so it was always getting set back to `0.5`.

Well, it turns out there's a solution. _Two_, in fact!

### Solution 1: Manipulate the alpha channel

In a follow-up reply, Sara pointed out that the relative-color syntax actually lets you [manipulate the alpha channel](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors#manipulating_the_alpha_channel), rather than just discarding it. Check this out:

```css
#demo div {
  /* or calc(alpha / 2) */
  color: rgb(from currentColor r g b / calc(alpha * 0.5));
}
```

With the same HTML as before, this results in progressive transparency: the first child `<div>` at 50%, the second at 25%, the third at 12.5%, and so on.

<code-demo description="Demo of rendering five text elements in a red color, each more transparent than the previous" fit-content>
    <template>
        <div id="colors-demo">
            one
            <div>
                two
                <div>
                    three
                    <div>
                        four
                        <div>
                            five
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            #colors-demo { color: red; }
            #colors-demo div { color: rgba(from currentColor r g b / calc(alpha * 0.5)); }
        </style>
    </template>
</code-demo>

### Solution 2: Use `color-mix()`

Alternatively, we can use the [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix) function to _mix_ 50% of the previous color with transparency, as both [Sara](https://bsky.app/profile/sjoy.lol/post/3mg6mnhyols2r) and [Konnor Rogers](https://bsky.app/profile/konnorrogers.com/post/3mg6mtrpick2n) suggested:

```css
#demo div {
  color: color-mix(in srgb, currentColor 50%, transparent);
}
```

And that gives us the same end result:

<code-demo description="Demo of rendering five text elements in a red color, each more transparent than the previous" fit-content>
    <template>
        <div id="colors-demo">
            one
            <div>
                two
                <div>
                    three
                    <div>
                        four
                        <div>
                            five
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            #colors-demo { color: red; }
            #colors-demo div { color: color-mix(in srgb, currentColor 50%, transparent); }
        </style>
    </template>
</code-demo>

## But why?

Off the top of my head, I can't think of when this would actually be useful in practice. Still, it was an interesting experiment that led me to learn a couple new CSS tricks. And now you know about them, too!