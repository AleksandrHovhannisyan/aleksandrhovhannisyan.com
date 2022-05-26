---
title: Design System
description: Design tokens for my website.
layout: design
permalink: /design/
eleventyExcludeFromCollections: true
excludeFromSitemap: true
noindex: true
---

## Fonts

{% assign fontKeys = fonts | keys %}
{% assign steps = "xs,sm,base,md,lg,xl,xxl,xxxl" | split: "," %}

{%- for keyName in fontKeys %}
  {% assign family = fonts[keyName].family %}
### {{ keyName }} ({{ family }})

<div class="scroll-x">
  <table>
    <caption>{{ family }} rendered at different font sizes</caption>
    <thead>
      <tr>
        <th scope="col">Size</th>
        <th scope="col">Demo</th>
      </tr>
    </thead>
    <tbody>
      {%- for step in steps -%}
        <tr>
          <td>{{ step }}</td>
          <td class="fs-{{ step }}" style="font-family: var(--ff-{{ keyName }});">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
</div>
{% endfor %}

## Colors

{% assign surfaceColors = (1..5) %}
{% assign foregroundColors = "text-normal,text-emphasis,text-soft" | split: "," %}

### Background

<div class="col-wrap" style="--columns: {{ surfaceColors | size }}; --container-width: 10rem;">
{%- for color in surfaceColors -%}
  <div style="background-color: var(--color-surface-{{ color }}); aspect-ratio: 1; outline: solid 1px;"></div>
{%- endfor -%}
</div>

### Text

<div  class="col-wrap" style="--columns: 3;">
{%- for color in foregroundColors -%}
  <div style="color: var(--color-{{ color }})"><strong>{{ color }}</strong>: Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
{%- endfor -%}
</div>

## Components

### Post Previews

{% assign posts = collections.posts | limit: 2 %}
{% include postPreviews.html posts: posts, titleLevel: 4 %}

### Pill

<a href="#pill" class="pill" data-shape="round" data-size="sm">pill {{ i }}</a>

### Pill Group

<div class="pill-group">
  {%- for i in (1..4) -%}
    <a href="#pill" class="pill" data-shape="round" data-size="sm">pill {{ i }}</a>
  {%- endfor -%}
</div>

### Button

<button class="button" type="button">Click me</button>

### Inline Code

This is a `paragraph` with some inline `code`.

### Table

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

### Code Block

#### JavaScript

```js {data-file="path/to/some/file.js" data-copyable="true"}
const getEvenNumbers = (array) => {
  return array.filter((n) => n % 2 === 0);
}

console.log(getEvenNumbers([1, 2, 3]));
```

#### CSS

```css {data-file="path/to/some/file.css" data-copyable="true"}
.navbar-link {
  /* comment */
  background-color: #fff;
  color: #000;
}
.navbar-link:is(:hover, :focus, [aria-current="page"]) {
  /* more css */
}
```

#### Liquid

{% raw %}
```liquid {data-file="path/to/some/file.html" data-copyable="true"}
{% if someCondition %}{% endif %}
{% for i in (1..3) %}{% endfor %}
{% assign foo = 'bar' %}
```
{% endraw %}

#### Markdown

```md {data-file="path/to/some/file.html" data-copyable="true"}
**This** is [Markdown](https://en.wikipedia.org/wiki/Markdown)

# heading level one would go here

some *italicized text* perhaps
```

#### HTML

```html {data-file="path/to/some/file.html" data-copyable="true"}
<div class="foo">
  <div class="div soup">
    It's divs all the way down
  </div>
</div>
```


### Card

<div class="card">
  <h3>Sample h3 title</h3>
  Vivamus pellentesque tellus nisi, id cursus libero scelerisque at. Curabitur pellentesque erat at erat congue, vitae maximus lorem vehicula. Aliquam mollis eros sem, eget commodo dolor dictum at.
</div>

### Aside

{% aside %}
  Cras eu aliquet est. Cras tempor ex ut sagittis pharetra. In semper ac nunc id faucibus. Praesent vitae nunc facilisis, porttitor nisi sed, blandit massa. Duis hendrerit lectus quam, ac lobortis lectus euismod et.

  In cursus tellus ex, a rhoncus erat bibendum sit amet. Proin sollicitudin pharetra nulla quis dignissim. Phasellus et nibh felis.
{% endaside %}

### Quote

{% quote "Source of the Quote", "https://www.lipsum.com/feed/html" %}
  Sed libero libero, cursus ut lacus at, luctus molestie augue. Nulla vehicula elementum est. Donec tincidunt est sit amet augue sodales auctor. Quisque tincidunt vestibulum lorem sed commodo. Praesent dictum vestibulum cursus. Nullam massa neque, molestie a eleifend at, iaculis et urna. Cras suscipit nibh at risus sollicitudin pretium. Praesent eget sem vitae ante mollis elementum. Nullam sollicitudin est in nisi porttitor, nec suscipit nunc pharetra.

  Duis ultrices nunc in finibus pharetra. Nullam ornare ex sit amet diam interdum porta. Sed non libero vel est auctor suscipit quis eget mi. Phasellus vestibulum neque id luctus imperdiet.
{% endquote %}

### Image

{% include figure.html src: "https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", alt: "A multi-color parrot tilts its head towards the camera and glances playfully at the viewer." %}

### Figure with Caption

{% include figure.html src: "https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", alt: "A multi-color parrot tilts its head towards the camera and glances playfully at the viewer.", caption: "A multi-color parrot tilts its head towards the camera and glances playfully at the viewer. Photo by [Timothy Dykes](https://unsplash.com/photos/Xxo3-8bqGro) on Unsplash." %}
