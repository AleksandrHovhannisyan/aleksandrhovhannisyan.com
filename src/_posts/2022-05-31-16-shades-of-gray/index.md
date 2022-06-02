---
title: 16 Shades of Gray
description: The one where I create my first generative artwork and still refuse to use any color on my site.
keywords: [generative art, hash art, git hash]
categories: [node, css, math, art]
lastUpdated: 2022-06-01
thumbnail: ./images/hash.png
---

If you've been following me long enough, you've probably noticed that my site is completely devoid of color, except for in imagery and code blocks. A friend even joked that I must be allergic to color because I've exterminated it from every part of my UI. Admittedly, I do enjoy working in grayscale because it allows me to focus on contrast, typography, and spacing over color, which can be overwhelming to implement.

{% aside %}
This is just a fancy way of saying that I'm too lazy to pick a good color palette.
{% endaside %}

In a recent redesign of my site, I also decided to make my layout wider and bigger, but this left a noticeably big gap to the right of the hero banner on my home page. And thus began my quest to fill that space with something meaningless to stare at. It wouldn't really make sense to show a photo of myself next to my name and intro, so I had to search for more reasonable options.

I'm a fan of generative art, especially those that are seeded with random hashes—like Jordan Scales's [hashart](https://hash.jordanscales.com/) project, where he draws various math-based artworks using SHA-256 hashes. I also recently had an idea to [show my site's git hash in my footer](/blog/eleventy-build-info/#3-getting-the-latest-commit-hash) as part of my 11ty build. And so I wondered: Could I somehow turn this random string of symbols into a mediocre work of art? Indeed, I could!

The code to do this is short—it just reads my latest Git commit hash, interprets it as an array of bytes, and maps every group of three consecutive bytes (minus the last one) to an RGB color:

```js
const hash = childProcess.execSync(`git rev-parse HEAD`).toString().trim();
const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
let result = `<div class="hash-art-grid">`;
for (let i = 0; i < bytes.length - 4; i++) {
  const [r, g, b] = bytes.slice(i, i + 3);
  result += `<div style="background-color: rgb(${r}, ${g}, ${b})"></div>`;
}
result += `</div>`;
```

Naturally, having been confronted about my phobia of color, I had no choice but to redouble my efforts and make this a *grayscale* artwork, in keeping with tradition. To introduce color when I've renounced it for so long would be regressive, a sign of weakness, and cause for rebellion.

{% aside %}
Also, I'm lazy.
{% endaside %}

```css
.hash-art-grid {
  filter: grayscale(1);
}
```

Here's an example that was seeded with a hash of `3b5875ce12be8bd07cf00249732c8edd7da6145f`:

{% include postImage.html src: "./images/hash.png", alt: "A four-by-four grid of grayscale tiles, rendered using the hash 3b5875ce12be8bd07cf00249732c8edd7da6145f", isLinked: false %}

There is just one problem: Mathematically speaking, the hash should eventually generate an embarrassing permutation of tiles. When you consider that I [make frequent and atomic commits](/blog/atomic-git-commits/), this may not end well. On the other hand, there are 256 grayscale values for each of the 16 tiles, which when you do the math comes out to—*counts fingers*—lots and lots of permutations. So it's unlikely that I'll ever run into edge cases where this algorithm produces something silly.
