---
title: Configuring Web Fonts in 11ty with Global Data
description: Instead of using static font-face declarations for web fonts, you can take advantage of global data in 11ty to create a single source of truth for fonts and reuse those values throughout your templates and CSS.
keywords: [11ty, web fonts, font]
categories: [11ty, css, typography, liquid]
thumbnail: thumbnail.png
commentsId: 120
---

My old strategy for managing web fonts on my site went something like this: Rather than linking to Google Fonts, I would self-host the fonts that I needed for improved performance. To do this, I downloaded a set of optimized font files from the [google-webfonts-helper](https://google-webfonts-helper.herokuapp.com/) app as recommended by Sia Karamalegos in her post on [making Google Fonts faster](https://sia.codes/posts/making-google-fonts-faster/#self-host-your-web-fonts-for-full-control). I then pasted some static `@font-face` declarations in a Sass partial that would get compiled as part of my main stylesheet. I defined CSS custom properties for each of my font families manually and used those variables throughout my stylesheets. If I needed to preload a font on a particular page, I would add a `preloads` key in that page's front matter like so:

{% raw %}
```yml
---
preloads:
  -
    as: font
    type: font/woff2
    href: "/assets/fonts/path-to-font.woff2"
    crossorigin: true
  -
    as: font
    type: font/woff2
    href: "/assets/fonts/path-to-another-font.woff2"
    crossorigin: true
---
```
{% endraw %}

And my base layout would loop over all of the preloads and inject preload tags into the head:

{% raw %}
```liquid
<head>
  {%- if preloads -%}
    {% for preload in preloads %}
      <link rel="preload" as="{{ preload.as }}" type="{{ preload.type }}" href="{{ preload.href }}" {% if preload.crossorigin %}crossorigin{% endif %}>
    {%- endfor -%}
  {%- endif -%}
</head>
```
{% endraw %}

This worked really well, but it was also *very* tedious to manage. If I ever wanted to swap out one font for another, the preloads would break silently. I would have to go through and manually update the font-face declarations, the preload `href`s, and any CSS variables that relied on the old font families.

Instead, I wanted to have a single source of truth for our fonts that I could expose as global data and reuse in my templates, front matter, inline CSS, and wherever else they're needed. Fortunately, it's really easy to set this up in 11ty with JavaScript data files.

{% include toc.md %}

## Creating Global Font Data in 11ty

{% aside %}
  This tutorial assumes that you already self-host fonts on your site and that they're stored somewhere in your source directory—maybe `src/assets/fonts`. It also assumes that you're [passthrough-copying](https://www.11ty.dev/docs/copy/) those font files to your build output directory.
{% endaside %}

To get started, create a file named `fonts.js` in your data directory. I'll define some object enums upfront to avoid typos:

{% include codeHeader.html file: "src/_data/fonts.js" %}
```js
const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

const FontDisplay = {
  SWAP: 'swap',
};

const FontVariant = {
  Light: 'Light',
  Regular: 'Regular',
  Bold: 'Bold',
  Italic: 'Italic',
  BoldItalic: 'Bold Italic',
};
```

We can also define a utility for generating font URLs:

{% include codeHeader.html file: "src/_data/fonts.js" %}
```js
const path = require('path');

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontUrl = (src) => path.join('/assets/fonts', src);
```

Finally, we can export an object describing our fonts. For each font, we'll specify the family name, an array of fallbacks, and the font weights. I'm using the fonts from my site for illustrative purposes; feel free to replace them with whatever fonts you want:

{% include codeHeader.html file: "src/_data/fonts.js" %}
```js
const fonts = {
  body: {
    family: 'Fira Sans',
    fallbacks: [
      `-apple-system`,
      `BlinkMacSystemFont`,
      `Segoe UI`,
      `Roboto`,
      `Oxygen`,
      `Ubuntu`,
      `Cantarell`,
      `Open Sans`,
      `Helvetica Neue`,
      `sans-serif`,
    ],
    weights: {
      light: {
        variant: FontVariant.Light,
        weight: 300,
        style: FontStyle.NORMAL,
        url: getFontUrl('fira-sans-light.woff2'),
        display: FontDisplay.SWAP,
      },
      regular: {
        variant: FontVariant.Regular,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('fira-sans-300.woff2'),
        display: FontDisplay.SWAP,
      },
      regularItalic: {
        variant: FontVariant.Italic,
        weight: 400,
        style: FontStyle.ITALIC,
        url: getFontUrl('fira-sans-italic.woff2'),
        display: FontDisplay.SWAP,
      },
      bold: {
        variant: FontVariant.Bold,
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('fira-sans-700.woff2'),
        display: FontDisplay.SWAP,
      },
      boldItalic: {
        variant: FontVariant.BoldItalic,
        weight: 700,
        style: FontStyle.ITALIC,
        url: getFontUrl('fira-sans-700italic.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  code: {
    family: 'Inconsolata',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    weights: {
      regular: {
        variant: FontVariant.Regular,
        weight: 500,
        style: FontStyle.NORMAL,
        url: getFontUrl('inconsolata-500.woff2'),
        display: FontDisplay.SWAP,
      },
      bold: {
        variant: FontVariant.Bold,
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('inconsolata-700.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
};

module.exports = fonts;
```

Each font config is identified by a generic key, like `body` or `code`. This is going to be useful later on when we generate CSS custom properties corresponding to each font family.

As a future enhancement, you could use a library to open the font files, read their data, and generate this font config programmatically. Doing that is beyond the scope of this tutorial.

## Generating Font-Face Declarations Programmatically

With our global font config in place, we can begin generating `@font-face` declarations for our fonts so we can inline that CSS in the head of our base layout.

To iterate over the fonts, we'll need a custom filter that allows us to loop over object values. This will do the trick:

{% include codeHeader.html file: ".eleventy.js" %}
```js
eleventyConfig.addFilter('values', Object.values);
```

With that out of the way, we can now loop over the font config's values:

{% include codeHeader.html file: "src/_includes/fontFace.liquid" %}
{% raw %}
```liquid
{%- assign allFonts = fonts | values -%}
{%- for font in allFonts -%}
  {%- assign weights = font.weights | values -%}
  {%- for fontEntry in weights -%}
    {%- if fontEntry.url -%}
      {%- assign family = font.family -%}
      {%- assign format = fontEntry.url | split: "." | last -%}
      {%- assign localFontName = family | append: " " | append: fontEntry.variant | replace: "Regular", "" | strip -%}
      {%- assign postscriptVariantName = fontEntry.variant | replace: " ", "" -%}
      {%- assign postscriptName = family | replace: " ", "" | append: " " | append: postscriptVariantName | replace: "Regular", "" | strip | replace: " ", "-" -%}
      @font-face {
        font-family: '{{ family }}';
        font-style: {{ fontEntry.style }};
        font-weight: {{ fontEntry.weight }};
        {% if fontEntry.display -%}font-display: {{ fontEntry.display }};{%- endif -%}
        src: local('{{ localFontName }}'), local('{{ postscriptName }}'), url('{{ fontEntry.url }}') format('{{ format }}');
      }
    {%- endif -%}
  {%- endfor -%}
{%- endfor -%}
```
{% endraw %}

Given our font config, this will produce the following `@font-face` declarations:

```css
@font-face {
  font-family: "Fira Sans";
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local("Fira Sans Light"), local("FiraSans-Light"),
    url("/assets/fonts/fira-sans-v10-latin-300.woff2") format("woff2");
}
@font-face {
  font-family: "Fira Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("Fira Sans"), local("FiraSans"),
    url("/assets/fonts/fira-sans-v10-latin-regular.woff2") format("woff2");
}
@font-face {
  font-family: "Fira Sans";
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: local("Fira Sans Italic"), local("FiraSans-Italic"),
    url("/assets/fonts/fira-sans-v10-latin-italic.woff2") format("woff2");
}
@font-face {
  font-family: "Fira Sans";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local("Fira Sans Bold"), local("FiraSans-Bold"),
    url("/assets/fonts/fira-sans-v10-latin-700.woff2") format("woff2");
}
@font-face {
  font-family: "Fira Sans";
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: local("Fira Sans Bold Italic"), local("FiraSans-BoldItalic"),
    url("/assets/fonts/fira-sans-v10-latin-700italic.woff2") format("woff2");
}
@font-face {
  font-family: "Inconsolata";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: local("Inconsolata"), local("Inconsolata"),
    url("/assets/fonts/inconsolata-v20-latin-500.woff2") format("woff2");
}
@font-face {
  font-family: "Inconsolata";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local("Inconsolata Bold"), local("Inconsolata-Bold"),
    url("/assets/fonts/inconsolata-v20-latin-700.woff2") format("woff2");
}
```

### Inlining Font Face Declarations for Performance

We can now head over to our base layout and inline the CSS string we just created:

{% include codeHeader.html file: "src/_layouts/default.html" %}
{% raw %}
```html
<head>
  {%- capture fontCss -%}
    {%- include fontFace.liquid -%}
  {%- endcapture -%}
  <style>{{ fontCss }}</style>
</head>
```
{% endraw %}

### Minifying the CSS String

Note that you'll actually want to minify this CSS string for performance.

Since I'm using Dart Sass for my site, I have access to Sass as an NPM package, meaning I can add a filter that returns an inlined and minified CSS string:

```js
const sass = require('sass');

/** Given a scss string, compile it to CSS, minify the result, and return the final CSS as a string. */
const compileAndMinifyCss = (data) => {
  return sass.renderSync({ data, outputStyle: 'compressed' }).css.toString();
};

// Later in your 11ty config
eleventyConfig.addFilter('compileAndMinifyCss', compileAndMinifyCss);
```

If you're not using Sass, you could install any other package that can be used to minify CSS, like [clean-css](https://www.npmjs.com/package/clean-css). Either way, you'll want to use your newly created filter to transform the font CSS string:

{% include codeHeader.html file: "src/_layouts/default.html" %}
{% raw %}
```html
<head>
  {%- capture fontCss -%}
    {%- include fontFace.liquid -%}
  {%- endcapture -%}
  <style>{{ fontCss | compileAndMinifyCss }}</style>
</head>
```
{% endraw %}

## Generating Custom Properties for Font Families

Now comes the fun part: Using our same font config, we can create yet another include that loops over all of the fonts and generates CSS custom properties for the font families and weights. Before doing that, just like before, we'll want to add one more filter to help us out:

{% include codeHeader.html file: ".eleventy.js" %}
```js
eleventyConfig.addFilter('entries', Object.entries);
```

We'll use it like so to get the font config entries:

{% include codeHeader.html file: "src/_includes/fontVariables.liquid" %}
{% raw %}
```liquid
{%- assign allFonts = fonts | entries -%}
```
{% endraw %}

For the example fonts used in this tutorial, that will produce this array:

```json
[
  [
    "body",
    { "family": "Fira Sans", "fallbacks": [], "weights": [] }
  ],
  [
    "code",
    { "family": "Inconsolata", "fallbacks": [], "weights": [] }
  ]
]
```

Now, we'll loop over all of the entries and generate custom properties for the font families and weights:

{% include codeHeader.html file: "src/_includes/fontVariables.liquid" %}
{% raw %}
```liquid
html {
  {%- for font in allFonts -%}
    {%- assign fontType = font | first -%}
    {%- assign fontConfig = font | last -%}
    {%- assign fallbackFonts = fontConfig.fallbacks | join: ", " -%}
    --font-family-{{ fontType }}: {{ fontConfig.family }}, {{ fallbackFonts }};
    {%- assign weights = fontConfig.weights | entries -%}
    {%- for weight in weights -%}
      {%- assign weightName = weight | first -%}
      {%- assign weightConfig = weight | last -%}
      {%- comment -%}Italic variants don't need their own weight variables.{%- endcomment -%}
      {%- if weightConfig.style != 'italic' -%}
        --font-weight-{{ fontType }}-{{ weightName }}: {{ weightConfig.weight }};
      {%- endif -%}
    {%- endfor -%}
  {%- endfor -%}
}
```
{% endraw %}

Note that in practice, different web fonts use different numeric weights for light, regular, and bold variants—one font's regular `400` might actually be `500` in another font, depending on how it was designed. Or maybe you want to make the deliberate choice to assign `900` as the bold weight for a particular font, rather than using the standard weight of `700`. For this reason, I prefer to namespace my custom properties for font weight by the family category (`body` `code`, etc.).

Using the same example from the intro, this will output the following CSS:

```css
html {
  --font-family-body: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
  --font-weight-body-light: 300;
  --font-weight-body-regular: 400;
  --font-weight-body-bold: 700;
  --font-family-code: Inconsolata, Monaco, Consolas, Courier New, monospace;
  --font-weight-code-regular: 500;
  --font-weight-code-bold: 700;
}
```

From this point onward, we'll never need to update our CSS again whenever we change fonts. Since we're using generic names like `body` and `code` to designate the font families, and the weights are not dependent on any numeric values, we can use any values we want in the future, and the CSS will still work correctly.

If you're using Sass, I also recommend setting up a mixin to make your life a little easier:

{% include codeHeader.html file: "mixins.scss" %}
{% raw %}
```scss
@mixin font($family, $weight) {
  font-family: var(--font-family-#{$family});
  font-weight: var(--font-weight-#{$family}-#{$weight});
}
```
{% endraw %}

And you would use it like so:

```scss
code {
  @include font($family: 'code', $weight: 'regular');
}
```

This does require keeping your mixin in sync with your chosen naming format for the custom properties. But you only need to decide that once and forget about it. The nice thing about using a mixin for font rules is that if you *do* decide to change the naming convention in the future—maybe shortening `font-weight` to `fw`—you will only need to do this in two places rather than everywhere in your CSS.

### Inlining Font Variables

Just like before, we'll want to go back to our base layout and add the new include as part of the overall CSS string that gets compiled and minified in the head:

{% include codeHeader.html file: "src/_layouts/default.html" %}
{% raw %}
```html
<head>
  {%- capture fontCss -%}
    {%- include fontFace.liquid -%}
    {%- include fontVariables.liquid -%}
  {%- endcapture -%}
  <style>{{ fontCss | compileAndMinifyCss }}</style>
</head>
```
{% endraw %}

## Preloading Fonts for Performance

Now, suppose that we want to preload a particular font for even better performance. With the old approach, we would've had to hardcode the path to the font file, like this:

{% raw %}
```yml
---
preloads:
  -
    as: font
    type: font/woff2
    href: "/assets/fonts/path-to-font.woff2"
    crossorigin: true
  -
    as: font
    type: font/woff2
    href: "/assets/fonts/path-to-another-font.woff2"
    crossorigin: true
---
```
{% endraw %}

But now, we can look up the hrefs programmatically thanks to the magic of 11ty's [computed data](https://www.11ty.dev/docs/data-computed/), which allows us to interpolate other variables in front matter so that they get evaluated before the page is built:

{% raw %}
```yml
---
eleventyComputed:
  preloads:
    -
      as: font
      type: font/woff2
      href: "{{ fonts.body.weights.regular.url }}"
      crossorigin: true
    -
      as: font
      type: font/woff2
      href: "{{ fonts.body.weights.bold.url }}"
      crossorigin: true
---
```
{% endraw %}

You can repeat this for any font families and weights that you know a particular page is going to need. For example, if you only ever use your code font in tutorials, you can add a preload for the font in your post layout's front matter.

{% aside %}
  A word of caution: As Sia warns in her post, you don't want to do this carelessly and preload all fonts on all pages regardless of whether they actually get used. This is because preloads take very high priority when a page is fetching resources, so unnecessary preloads could hurt your performance. In fact, if you preload fonts that aren't needed, you may see console logs warning that the resource was not used within a certain window of time on page load.
{% endaside %}

Like I mentioned in the intro, you'll want to loop over the preloads in your base layout's head:

{% raw %}
```liquid
<head>
  {%- if preloads -%}
    {% for preload in preloads %}
      <link rel="preload" as="{{ preload.as }}" type="{{ preload.type }}" href="{{ preload.href }}" {% if preload.crossorigin %}crossorigin{% endif %}>
    {%- endfor -%}
  {%- endif -%}
</head>
```
{% endraw %}

## Final Thoughts

Hopefully, you see the benefit of this approach—rather than hardcoding information about our fonts across our CSS, markup, and front-matter variables, we unify them into a single source of truth that gets injected into our 11ty build and can be reused anywhere we need it. If we ever need to change a font in the future, all we need to do is replace the font files and update the config. All of our changes will propagate from the top down. And since we're using generic names for the fonts—like `body`, `code`, `title`, and so on—our CSS remains completely agnostic and won't break when we swap out one font for another or change the numeric weight values.

## Attributions

The social preview image for this article uses the [2021 Eleventy mascot designed by Geri Coady](https://www.11ty.dev/blog/new-mascot-from-geri-coady/).
