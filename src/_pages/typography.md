---
title: Typography
permalink: /typography/
eleventyExcludeFromCollections: true
excludeFromSitemap: true
noindex: true
---

{%- assign steps = "sm,base,md,lg,xl,xxl,xxxl" | split: "," -%}

# Typography Design Variables

<table style="margin-top: var(--line-height);">
  <thead>
    <tr>
      <th scope="col">Step</th>
      <th scope="col">Demo</th>
    </tr>
  </thead>
  <tbody>
    {%- for step in steps -%}
      <tr>
        <td>{{ step }}</td>
        <td class="font-{{ step }}">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</td>
      </tr>
    {%- endfor -%}
  </tbody>
</table>

