---
title: 144 Shades of Gray
description: The one where I create my first generative artwork and still refuse to use any color on my site.
keywords: [generative art, hash art, git hash]
categories: [essay, node, css, math, art]
lastUpdated: 2024-08-23
thumbnail: ./images/hash.png
redirectFrom:
  - /blog/16-shades-of-gray/
---

If you've been following me long enough, you've probably noticed that my site is completely devoid of color, except for in imagery and code blocks. A friend even joked that I must be allergic to color because I've exterminated it from every part of my UI. Admittedly, I do enjoy working in grayscale because it allows me to focus on contrast, typography, and spacing over color, which can be overwhelming to implement.

{% aside %}
This is just a fancy way of saying that I'm too lazy to pick a good color palette.
{% endaside %}

In a recent redesign of my site, I also decided to make my layout wider and bigger, but this left a noticeably big gap to the right of the hero banner on my home page. And thus began my quest to fill that space with something meaningless to stare at. It wouldn't really make sense to show a photo of myself next to my name and intro, so I had to search for more reasonable options.

I enjoy generative art, especially works that are seeded with random hashes—like Jordan Scales's [hashart](https://hash.jordanscales.com/) project, where he draws various math-based artworks using SHA-256 hashes. I also recently had an idea to [show my site's git hash in my footer](/blog/eleventy-build-info/#3-getting-the-latest-commit-hash) as part of my 11ty build. And so I wondered: Could I somehow turn this random string of symbols into a mediocre work of art? Indeed, I could!

I decided to take my git hash and convert it to a 12-by-12 grid of tiles. Naturally, having been confronted about my phobia of color, I had no choice but to redouble my efforts and make this a *grayscale* artwork, in keeping with tradition. To introduce color when I've renounced it for so long would be regressive, a sign of weakness, and cause for rebellion.

The code to do this is short—it just reads my latest Git commit hash at build time and parses it one bit at a time, interpreting a zero as black and a one as white. Note that I'm excluding the last 16 bits to get a perfect square (144).

```js {data-copyable="true"}
// Note: Each git hash is 20 bytes long (160 bits)
const hash = childProcess.execSync(`git rev-parse HEAD`).toString().trim();
// Markup for the grid
let result = `<svg viewBox="0 0 12 12">`;
// Read git hash as an array of bytes. Stop at 18*8 = 144 bits because it's the largest perfect square < 160.
const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
for (let i = 0; i < 18; i++) {
  const byte = bytes[i];
  // Parse byte one bit at a time, in Big Endian order (LTR)
  for (let j = 7; j >= 0; j--) {
    const bitIndex = i * 8 + (7 - j);
    // e.g., 10011010 => [1, 0, 0, 1, 1, 0, 1, 0]
    const bit = (byte >> j) & 0b00000001;
    const x = bitIndex % 12;
    const y = Math.floor(bitIndex / 12);
    result += `<rect x="${x}" y="${y}" width="1" height="1" fill="hsl(0deg 0% ${bit * 100}%)"></rect>`;
  }
}
result += `</svg>`;
```

Since it's an SVG, I can easily scale it to any size I want later.

Below are some examples of the output images this generates:

{%- assign hashes = "d0c50e3e6e5c215b49afe882bce5e382cb16c626,3b203fd5b0bde1a51cb39de0823e64dd27bab798,3b5875ce12be8bd07cf00249732c8edd7da6145f,0f1f9f3e7a5c6cdd8263e20b0afb18cfe64e696c,c32a1cde0eb3d3c99d9b12d6025c1de43b510ed7" | split: "," -%}

<div class="scroll-x" role="region">
  <table>
    <caption>Git hashes interpreted as 12-by-12 grayscale grids</caption>
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

Nothing super exciting, but there is one problem: Mathematically speaking, the hash should eventually generate an embarrassing permutation of tiles. When you consider that I [make frequent and atomic commits](/blog/atomic-git-commits/), this may not end well. On the other hand, there are 144 tiles, each of which can be black or white, which when you do the math comes out to—*counts fingers*—lots and lots of permutations. So it's unlikely that I'll ever run into edge cases where this algorithm produces something silly or even coherent.
