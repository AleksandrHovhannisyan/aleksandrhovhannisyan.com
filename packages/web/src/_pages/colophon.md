---
title: Colophon
description: How I built this website.
layout: colophon
permalink: /colophon/
eleventyExcludeFromCollections: true
redirectFrom:
  - /design/
scripts:
  - type: module
    src: /assets/scripts/copyCode.js
---

{% include "toc.md" %}

## Tech Stack

- **Front end**
  - **Static site generator**: [{{ eleventy.generator }}](11ty.dev)
  - **Styling**: [Sass](https://sass-lang.com/) (it's not just for nesting!)
  - **Content**: HTML, Markdown ([markdown-it](https://github.com/markdown-it/markdown-it)), and [Liquid](https://shopify.github.io/liquid/) templating
  - **Interactivity**: JavaScript (minified and bundled with [esbuild](https://esbuild.github.io/))
- **Back end**
  - **Comments API**: [Cloudflare Workers](https://workers.cloudflare.com/), [GitHub API](https://docs.github.com/en/rest/issues), and [TypeScript](https://www.typescriptlang.org/)
  - **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) (free tier)
  - **Domain**: [porkbun](https://porkbun.com/) ($11/year)
- **Also**: My own two hands

## Design System

### Typography

{% assign fontSizeSteps = "xs,sm,base,md,lg,xl,2xl,3xl,4xl" | split: "," %}

#### body

<div class="scroll-x">
  <table>
    <caption>Source Sans rendered at different font sizes</caption>
    <thead>
      <tr>
        <th scope="col">Size</th>
        <th scope="col">Demo</th>
      </tr>
    </thead>
    <tbody>
      {%- for step in fontSizeSteps -%}
        <tr>
          <td>{{ step }}</td>
          <td class="size-font-{{ step }}" style="font-family: var(--font-family-body);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse blandit mi augue, sit amet sagittis ligula pellentesque ac. Donec sed varius arcu.</td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
</div>

#### monospace

<div class="scroll-x">
  <table>
    <caption>Source Code rendered at different font sizes</caption>
    <thead>
      <tr>
        <th scope="col">Size</th>
        <th scope="col">Demo</th>
      </tr>
    </thead>
    <tbody>
      {%- for step in fontSizeSteps -%}
        <tr>
          <td>{{ step }}</td>
          <td class="size-font-{{ step }}" style="font-family: var(--font-family-mono);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse blandit mi augue, sit amet sagittis ligula pellentesque ac. Donec sed varius arcu.</td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
</div>

### Colors

{% assign backgroundColors = (0..9) %}
{% assign foregroundColors = "text-normal,text-emphasis,text-soft" | split: "," %}

#### Background

<div class="scroll-x">
  <table>
    <caption>Background color variables</caption>
    <thead>
      <tr>
        <th scope="col">Variable</th>
        <th scope="col">Preview</th>
      </tr>
    </thead>
    <tbody>
      {%- for color in backgroundColors -%}
        <tr>
          <td><code>color-surface-{{ color }}</code></td>
          <td><div style="aspect-ratio: 1; width: 50px; background-color: var(--color-surface-{{ color }}); border: solid 1px;"></div></td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
</div>

#### Text

<div class="scroll-x">
  <table>
    <caption>Foreground color variables</caption>
    <thead>
      <tr>
        <th scope="col">Variable</th>
        <th scope="col">Preview</th>
      </tr>
    </thead>
    <tbody>
      {%- for color in foregroundColors -%}
        <tr>
          <td><code>{{ color }}</code></td>
          <td style="color: var(--color-{{ color }});">Lorem ipsum dolor sit amet</td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
</div>

### Components

#### Post Previews

{% assign posts = collections.posts | limit: 2 %}
{% include "postPreviews.liquid" posts: posts, titleLevel: 4 %}

#### Pill

<a href="#pill" class="pill" data-shape="round">regular</a>

<a href="#pill" class="pill" data-shape="round" data-size="sm">small</a>

#### Pill Group

<div class="pill-group">
  {%- for i in (1..4) -%}
    <a href="#pill" class="pill" data-shape="round">pill {{ i }}</a>
  {%- endfor -%}
</div>

#### Button

<button class="button primary" type="button">Primary</button>

<button class="button secondary" type="button">Secondary</button>

#### Inline Code

This is a `paragraph` with some inline `code`.

#### Table

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

#### Code Block

##### Plaintext

```
This is plaintext
```

``` {data-copyable=true}
This is copyable plaintext
```

``` {data-copyable=true}
This is copyable plaintext

with multiple lines
```

##### JavaScript

```js {data-file="path/to/some/file.js" data-copyable="true"}
const getEvenNumbers = (array) => {
  return array.filter((n) => n % 2 === 0);
}

console.log(getEvenNumbers([1, 2, 3]));
```

##### CSS

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

##### Liquid

{% raw %}
```liquid {data-file="path/to/some/file.liquid" data-copyable="true"}
{% if someCondition %}{% endif %}
{% for i in (1..3) %}{% endfor %}
{% assign foo = 'bar' %}
```
{% endraw %}

##### Markdown

```md {data-file="path/to/some/file.md" data-copyable="true"}
**This** is [Markdown](https://en.wikipedia.org/wiki/Markdown)

# heading level one would go here

some *italicized text*
```

##### HTML

```html {data-file="path/to/some/file.html" data-copyable="true"}
<div class="foo">
  <div class="div soup">
    It's divs all the way down
  </div>
</div>
```

```html {data-copyable="true"}
<button
  id="theme-toggle"
  type="button"
  aria-label="Enable dark theme"
  aria-pressed="false"
></button>
```

#### Card

<div class="card stack gap-0">
  <h3>Sample h3 title</h3>
  Vivamus pellentesque tellus nisi, id cursus libero scelerisque at. Curabitur pellentesque erat at erat congue, vitae maximus lorem vehicula. Aliquam mollis eros sem, eget commodo dolor dictum at.
</div>

#### Aside

{% aside %}
  Cras eu aliquet est. Cras tempor ex ut sagittis pharetra. In semper ac nunc id faucibus. Praesent vitae nunc facilisis, porttitor nisi sed, blandit massa. Duis hendrerit lectus quam, ac lobortis lectus euismod et.

  In cursus tellus ex, a rhoncus erat bibendum sit amet. Proin sollicitudin pharetra nulla quis dignissim. Phasellus et nibh felis.
{% endaside %}

#### Definition

{% definition "Term" %}
Definition of the term goes here.
{% enddefinition %}

#### Quote

{% quote "Source of the Quote", "https://www.lipsum.com/feed/html" %}
  Sed libero libero, cursus ut lacus at, luctus molestie augue. Nulla vehicula elementum est. Donec tincidunt est sit amet augue sodales auctor. Quisque tincidunt vestibulum lorem sed commodo. Praesent dictum vestibulum cursus. Nullam massa neque, molestie a eleifend at, iaculis et urna. Cras suscipit nibh at risus sollicitudin pretium. Praesent eget sem vitae ante mollis elementum. Nullam sollicitudin est in nisi porttitor, nec suscipit nunc pharetra.

  Duis ultrices nunc in finibus pharetra. Nullam ornare ex sit amet diam interdum porta. Sed non libero vel est auctor suscipit quis eget mi. Phasellus vestibulum neque id luctus imperdiet.
{% endquote %}

#### Vertical Rhythm (`.rhythm`)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et posuere sem. Vestibulum nisl arcu, tempus quis ultrices tincidunt, vehicula sit amet turpis. Integer porttitor faucibus massa. In nec quam at odio egestas maximus non ac elit. In sed euismod urna. Phasellus vehicula mollis urna sit amet vulputate. Sed pulvinar semper ornare. Nam lacinia gravida eros in tempor. Ut fermentum, ipsum sed consequat molestie, dolor diam posuere odio, et fringilla est eros ac massa.

Nullam volutpat finibus felis, vel ornare leo gravida ut. In eu aliquam metus, sit amet pretium orci. Morbi feugiat fringilla convallis. Etiam luctus, augue id tempus placerat, turpis nibh ultricies neque, at posuere ipsum magna at eros. Quisque lectus urna, interdum non varius pharetra, rutrum eget enim. Morbi eleifend odio lobortis ligula pharetra congue. Vestibulum vulputate viverra lacinia. Vivamus sollicitudin scelerisque mi, in facilisis augue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras quis quam turpis. Aenean ut eros mi. Proin id mauris erat. Curabitur a iaculis erat.

Aliquam erat volutpat. Sed velit ex, consectetur vel elementum ac, vulputate id lacus. In ipsum nulla, vestibulum ut consequat nec, iaculis at est. Duis lorem lorem, tempor at eros dignissim, interdum congue mauris. In ullamcorper auctor sapien, eu gravida purus imperdiet et. Phasellus nec ante id leo viverra consequat. Suspendisse augue dui, viverra id finibus sit amet, molestie vitae elit. Nam porta nibh cursus, iaculis orci ut, accumsan sem. Integer eget sem vestibulum, sollicitudin nulla efficitur, varius augue. Nullam libero nulla, congue vitae lectus sit amet, maximus ultrices mauris. Cras efficitur eros id mi vehicula facilisis. Donec et venenatis diam. Nullam elit eros, posuere ut volutpat sed.

#### Lists (with nesting)

##### Unordered List

<ul>
  <li>Lorem ipsum dolor sit amet consectetur
    <ul>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
    </ul>
  </li>
  <li>Lorem ipsum dolor sit amet consectetur
    <ul>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
    </ul>
  </li>
  <li>Lorem ipsum dolor sit amet consectetur</li>
</ul>

##### Ordered List

<ol>
  <li>Lorem ipsum dolor sit amet consectetur
    <ol>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
    </ol>
  </li>
  <li>Lorem ipsum dolor sit amet consectetur
    <ul>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
      <li>Lorem ipsum dolor sit amet consectetur</li>
    </ul>
  </li>
  <li>Lorem ipsum dolor sit amet consectetur</li>
</ol>

#### Image

![A multi-color parrot tilts its head towards the camera and glances playfully at the viewer.](https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)

#### Figure with Caption

<figure>
  <img src="https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="A multi-color parrot tilts its head towards the camera and glances playfully at the viewer." sizes="100vw" />
  <figcaption>A multi-color parrot tilts its head towards the camera and glances playfully at the viewer. Photo by <a href="https://unsplash.com/photos/Xxo3-8bqGro">Timothy Dykes</a> on Unsplash.</figcaption>
</figure>
