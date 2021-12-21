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

{% assign families = "body,title" | split: "," %}
{% assign steps = "xs,sm,base,md,lg,xl,xxl,xxxl" | split: "," %}

{%- for family in families %}
### {{ family }}
  <table>
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
          <td class="font-{{ step }}" style="font-family: var(--font-family-{{ family }});">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</td>
        </tr>
      {%- endfor -%}
    </tbody>
  </table>
{% endfor %}

## Colors

{% assign surfaceColors = (1..5) %}
{% assign foregroundColors = "text-normal,text-emphasis,text-soft" | split: "," %}

### Background

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 0.8rem;">
{%- for color in surfaceColors -%}
  <div style="background-color: var(--color-surface-{{ color }}); aspect-ratio: 1; outline: solid 1px;"></div>
{%- endfor -%}
</div>

### Text

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 0.8rem;">
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

### Card

<div class="card">
  <h3>Sample h3 title</h3>
  Vivamus pellentesque tellus nisi, id cursus libero scelerisque at. Curabitur pellentesque erat at erat congue, vitae maximus lorem vehicula. Aliquam mollis eros sem, eget commodo dolor dictum at.
</div>

### Labeled Input

<div class="labeled-input" data-flow="vertical">
  <label for="input-demo-vertical">Vertically labeled input</label>
  <input id="input-demo-vertical" class="input" type="text" placeholder="Enter text here" />
</div>

<div class="labeled-input" data-flow="horizontal">
  <label for="input-demo-horizontal">Horizontally labeled input</label>
  <input id="input-demo-horizontal" class="input" type="text" placeholder="Enter text here" />
</div>


### Aside

{% aside %}
  Cras eu aliquet est. Cras tempor ex ut sagittis pharetra. In semper ac nunc id faucibus. Praesent vitae nunc facilisis, porttitor nisi sed, blandit massa. Duis hendrerit lectus quam, ac lobortis lectus euismod et.
{% endaside %}

### Quote

{% quote "Source of the Quote", "http://google.com/" %}
  Sed libero libero, cursus ut lacus at, luctus molestie augue. Nulla vehicula elementum est. Donec tincidunt est sit amet augue sodales auctor. Quisque tincidunt vestibulum lorem sed commodo. Praesent dictum vestibulum cursus. Nullam massa neque, molestie a eleifend at, iaculis et urna. Cras suscipit nibh at risus sollicitudin pretium. Praesent eget sem vitae ante mollis elementum. Nullam sollicitudin est in nisi porttitor, nec suscipit nunc pharetra.
{% endquote %}

### Image

{% include image.html src: "https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", fileName: "parrot", urlPath: "/assets/images/design", alt: "A multi-color parrot tilts its head towards the camera and glances playfully at the viewer." %}

### Figure with Caption

<figure>
  {% include image.html src: "https://images.unsplash.com/photo-1543631936-4019112aee78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", fileName: "parrot", urlPath: "/assets/images/design", alt: "A multi-color parrot tilts its head towards the camera and glances playfully at the viewer." %}
  <figcaption>A multi-color parrot tilts its head towards the camera and glances playfully at the viewer. Photo by <a href="https://unsplash.com/photos/Xxo3-8bqGro">Timothy Dykes</a> on Unsplash.</figcaption>
</figure>
