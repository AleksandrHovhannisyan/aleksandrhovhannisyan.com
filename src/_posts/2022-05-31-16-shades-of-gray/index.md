---
title: 16 Shades of Gray
description: The one where I create my first generative artwork and still refuse to use any color on my site.
keywords: [generative art, hash art, git hash]
categories: [essay, node, css, math, art]
thumbnail: ./images/hash.png
---

If you've been following me long enough, you've probably noticed that my site is completely devoid of color, except for in imagery and code blocks. A friend even joked that I must be allergic to color because I've exterminated it from every part of my UI. Admittedly, I do enjoy working in grayscale because it allows me to focus on contrast, typography, and spacing over color, which can be overwhelming to implement.

{% aside %}
This is just a fancy way of saying that I'm too lazy to pick a good color palette.
{% endaside %}

In a recent redesign of my site, I also decided to make my layout wider and bigger, but this left a noticeably big gap to the right of the hero banner on my home page. And thus began my quest to fill that space with something meaningless to stare at. It wouldn't really make sense to show a photo of myself next to my name and intro, so I had to search for more reasonable options.

I enjoy generative art, especially works that are seeded with random hashes—like Jordan Scales's [hashart](https://hash.jordanscales.com/) project, where he draws various math-based artworks using SHA-256 hashes. I also recently had an idea to [show my site's git hash in my footer](/blog/eleventy-build-info/#3-getting-the-latest-commit-hash) as part of my 11ty build. And so I wondered: Could I somehow turn this random string of symbols into a mediocre work of art? Indeed, I could!

I decided to take my git hash and convert it to a four-by-four grid of colored tiles. Naturally, having been confronted about my phobia of color, I had no choice but to redouble my efforts and make this a *grayscale* artwork, in keeping with tradition. To introduce color when I've renounced it for so long would be regressive, a sign of weakness, and cause for rebellion.

The code to do this is short—it just reads my latest Git commit hash at build time and converts it to an array of bytes. Since one byte represents <code>2<sup>8</sup> = 256</code> values, and there are `256` values per channel in the RGB true color model, it makes sense to just interpret each byte as a color value. Grays are achieved by setting red, green, and blue to all be the same value. Note that I'm excluding the last four bytes because there are 20 bytes in a Git hash, and I'm only interested in the first 16 for the sake of symmetry.

```js {data-copyable="true"}
const hash = childProcess.execSync(`git rev-parse HEAD`).toString().trim();
const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
let result = `<div class="hash-art-grid">`;
for (let i = 0; i < bytes.length - 4; i++) {
  const gray = bytes[i];
  const color = `rgb(${gray}, ${gray}, ${gray})`;
  result += `<div style="background-color: ${color}"></div>`;
}
result += `</div>`;
```

Below are some examples of the output images this generates:

{%- assign hashes = "d0c50e3e6e5c215b49afe882bce5e382cb16c626,3b203fd5b0bde1a51cb39de0823e64dd27bab798,3b5875ce12be8bd07cf00249732c8edd7da6145f,0f1f9f3e7a5c6cdd8263e20b0afb18cfe64e696c,c32a1cde0eb3d3c99d9b12d6025c1de43b510ed7" | split: "," -%}

<div class="scroll-x" role="region">
  <table>
    <caption>Git hashes interpreted as four-by-four grayscale grids</caption>
    <thead>
      <tr>
        <th scope="col">Hash</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      {% for hash in hashes %}
      <tr>
        <td><code>{{ hash }}</code></td>
        <td>{% hashArt hash %}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

Nothing super exciting, but there is one problem: Mathematically speaking, the hash should eventually generate an embarrassing permutation of tiles. When you consider that I [make frequent and atomic commits](/blog/atomic-git-commits/), this may not end well. On the other hand, there are 256 grayscale values for each of the 16 tiles, which when you do the math comes out to—*counts fingers*—lots and lots of permutations. So it's unlikely that I'll ever run into edge cases where this algorithm produces something silly. Plus, there are only so many ways to draw things in the confines of a four-by-four grid.
