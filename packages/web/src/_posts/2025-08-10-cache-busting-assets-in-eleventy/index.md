---
title: Cache-Busting Assets in Eleventy
description: Generate a sourcemap and add it to Eleventy's global data.
keywords: [eleventy, cache bust]
categories: [note, 11ty, nodejs]
---

In Eleventy, you're probably referencing assets like this in your templates:

```liquid {data-file="layout.liquid"}
<link rel="stylesheet" href="/assets/css/main.css">
<script type="module" src="/assets/scripts/main.js"></script>
```

Whether you're [passthrough-copying](https://www.11ty.dev/docs/copy/) these files to your build folder or running a separate script, it works as expected.

As I recently discovered, things become a little more complicated if you want to cache-bust your assets by appending hashes to their file names. While this is something that most build tools and frameworks support out of the box, Eleventy unfortunately does not. However, we can implement it ourselves using a custom build script that generates a sourcemap and adds it to Eleventy's global data.

## 1. Generate a Sourcemap

On my site, I use [esbuild](https://esbuild.github.io) to compile my CSS and TypeScript. You can use any tool you want, as long as it has a similar API that allows you to build files and generate a sourcemap. Here's the code I use:

```js {data-copyable="true" data-file="build.js"}
import fs from 'node:fs/promises';
import esbuild from 'esbuild';

const isProductionBuild = process.env.ELEVENTY_ENV === 'production';

export async function buildAssets() {
  const outputs = (
    await esbuild.build({
      entryPoints: ['src/assets/styles/main.css', 'src/assets/scripts/main.ts'],
      entryNames: isProductionBuild ? '[dir]/[name]-[hash]' : '[dir]/[name]',
      outdir: 'dist/assets',
      format: 'esm',
      bundle: true,
      splitting: true,
      sourcemap: !isProductionBuild,
      minify: isProductionBuild,
      metafile: true,
      loader: { '.css': 'css' },
    })
  ).metafile.outputs;

  const sourceMap = {};
  for (const [outputPath, { entryPoint }] of Object.entries(results)) {
    sourceMap[entryPoint] = outputPath.replace(/^dist/, '');
  }
  return sourceMap;
}
```

Note how the following code appends a hash only in production builds:

```js
entryNames: isProductionBuild ? '[dir]/[name]-[hash]' : '[dir]/[name]';
```

I set that environment variable in my scripts:

```json{data-file="package.json"}
{
  "scripts": {
    "dev": "ELEVENTY_ENV=development eleventy --serve --incremental --port=4001",
    "build": "ELEVENTY_ENV=production eleventy",
  }
}
```

It's important to cache-bust only in production to avoid polluting your dev server with hundreds of files as you make changes.

In dev mode, `buildAssets` will return a map that looks like this:

```json
{
  "src/assets/styles/main.css": "/assets/styles/main.css",
  "src/assets/scripts/main.ts": "/assets/scripts/main.js"
}
```

In production, the output paths will have hashes:

```json
{
  "src/assets/styles/main.css": "/assets/styles/main-QGSRYKSL.css",
  "src/assets/scripts/main.ts": "/assets/scripts/main-7NMOYWTQ.js"
}
```

When we call this function, it'll build the specified files and return a reverse sourcemap. So let's go ahead and do that.

## 2. Add Global Data to Eleventy

In our Eleventy config, we'll use the [`addGlobalData` configuration API](https://www.11ty.dev/docs/data-global-custom/#functions) to make this sourcemap available to all templates:

```js {data-copyable="true" data-file=".eleventy.js"}
eleventyConfig.addGlobalData('sourceMap', buildAssets);
```

I'm setting the value to the `buildAssets` function itself, rather than _calling_ the function and passing along the returned value. This ensures that the function is reinvoked whenever Eleventy rebuilds my site in development, rather than only on the first build. The main downside to this approach is that it rebuilds the assets even if they didn't change, but so far this has been an acceptable tradeoff for my site and hasn't slowed things down noticeably.

{% aside %}
Newer static site generators and frameworks have built-in asset management through Vite so you don't need to do any of this work yourself.
{% endaside %}

Finally, we can update our templates to look up the output path for each asset:

{% raw %}

```liquid {data-file="layout.liquid"}
<link rel="stylesheet" href="{{ sourceMap['src/assets/styles/main.css'] }}">
<script type="module" src="{{ sourceMap['src/assets/scripts/main.ts'] }}"></script>
```

{% endraw %}

I'm referencing the original file path and extension in my templates, such as `.ts` for TypeScript source files instead of the `.js` they will eventually be compiled to. This follows the convention of build tools like Vite, where you can just reference input files directly and the paths will be transformed at build time.

## Further Reading

- [Bryce Wray: "Hashing out a cache-busting fix for Eleventy"](https://www.brycewray.com/posts/2020/12/hashing-out-cache-busting-fix-eleventy/)
- [Bernard Nijenhuis: "Cache busting in Eleventy"](https://bnijenhuis.nl/notes/cache-busting-in-eleventy/)
- [Evan Sheehan: "Asset Pipelines in Eleventy"](https://darthmall.net/2020/eleventy-asset-pipeline/)
