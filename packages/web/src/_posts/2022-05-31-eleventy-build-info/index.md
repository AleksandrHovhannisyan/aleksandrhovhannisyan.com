---
title: Add Build Info to an 11ty Site
description: Expose useful information about your Eleventy build to all of your templates using global data.
keywords: [11ty, 11ty build]
categories: [11ty, nodejs, git]
lastUpdated: 2022-07-21
---

In a recent update to my site, I decided to show a helpful notice in my footer that timestamps my build, writes the abbreviated commit hash from Git, and links to the changeset on my GitHub repo for ease of reference. You can expose all of this information and much more to your 11ty templates using a simple JavaScript data file.

Create a file named `buildInfo.js` in your data directory and populate it with this code:

```js {data-file="src/_data/buildInfo.js" data-copyable=true}
module.exports = () => {
  return {};
}
```

Currently, all this does is return an empty object, but our goal is to have this function return all sorts of useful information about our site. For the purposes of this tutorial, I'll just demonstrate how to return three pieces of information:

1. The approximate start time of the build.
2. Our site version, as specified in `package.json`.
3. The git hash associated with the current build.

## 1. Timestamping an 11ty Build

Since we're working with Node, we have access to all the lovely date-related constructors and methods that JavaScript affords us. Using the code below, we can get an approximate timestamp for our 11ty build so we can access this information in our templates:

```js {data-file="src/_data/buildInfo.js" data-copyable=true}
module.exports = () => {
  const now = new Date();
  const timeZone = 'UTC';
  const buildTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone,
  }).format(now);

  return {
    time: {
      raw: now.toISOString(),
      formatted: `${buildTime} ${timeZone}`,
    },
  };
};
```

{% aside %}
  The [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) constructor accepts an additional option named `timeZoneName` that can be used to render the time zone. Unfortunately, this cannot be used together with the `dateStyle` option. Hence why I'm interpolating the time zone manually.
{% endaside %}

You may be wondering why I'm returning an object for the build time instead of just a single string. The main reason for this is so I can later render this information in the [`time` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) for semantics, which expects a `datetime` attribute and the formatted date as its child:

{% raw %}
```html
<time datetime="{{ buildInfo.time.raw }}">
  {{ buildInfo.time.formatted }}
</time>
```
{% endraw %}

Alternatively, you could return a single JavaScript date object and create 11ty filters to format it at the template level. This would require more work from each template, so I've opted to instead calculate that information upfront before supplying it to all my templates.

## 2. Reading the Version from `package.json`

{% aside %}
**Edit**: Before writing this article, I was not aware that 11ty already exposes your `package.json` to templates via the `pkg` global data variable, as noted in the docs on [Eleventy supplied data](https://www.11ty.dev/docs/data-eleventy-supplied/). You can either access `pkg.version` directly or use the approach described below.
{% endaside %}

{% aside %}
If you don't update your `version` regularly and don't intend to show it in your templates, you can [skip this step entirely](#3-getting-the-latest-commit-hash).
{% endaside %}

This step should be the easiest of them all—we'll just import our `package.json` and read any of the metadata we want. For our purposes, the package version will suffice. Note that you may need to adjust the relative import path to your `package.json`:

```js {data-file="src/_data/buildInfo.js" data-copyable=true}
const packageJson = require('../../package.json');

module.exports = () => {
  // code from before omitted for brevity
  return {
    // ... other values here
    version: packageJson.version,
  }
}
```

## 3. Getting the Latest Commit Hash

Using [Antoine Rousseau's solution from StackOverflow](https://stackoverflow.com/a/35778030/5323344), we can synchronously read the latest Git commit hash by executing git itself as a child process of our 11ty build:

```js
// https://stackoverflow.com/a/34518749/5323344
const latestGitCommitHash =
  childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();
```

{% aside %}
If you're hosting your site on Netlify, this will work both locally and on production builds and will only execute git once per build. Locally, you shouldn't notice any performance penalty. However, if you're deploying your site in an environment where Git is unavailable on the server, you can instead refer to [an alternative solution](https://stackoverflow.com/a/34518749/5323344) where the contents of the `.git` directory are read to determine the hash manually.
{% endaside %}

Once we have this final piece of info, we can return it alongside the build timestamp:

```js {data-file="src/_data/buildInfo.js" data-copyable=true}
module.exports = () => {
  // code from before omitted for brevity

  // https://stackoverflow.com/a/34518749/5323344
  const latestGitCommitHash =
    childProcess
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

  return {
    // ... other values here
    hash: latestGitCommitHash,
  }
}
```

And now, we can render this hash anywhere in our templates by accessing `buildInfo.hash`.

We can even take things a step further and link to the changeset on our site's GitHub repo (assuming yours is public):

{% raw %}
```html
<a href="https://github.com/Username/Repo/commit/{{ buildInfo.hash }}" rel="noreferrer noopener" target="_blank">
  {{ buildInfo.hash }}
</a>
```
{% endraw %}

## What Else?

That's all for this tutorial! In practice, you could build on this to include any other information that you think your templates might need, either for debugging purposes or transparency with your readers. For example, you might find this useful when [split-testing a client's Netlify site](https://docs.netlify.com/site-deploys/split-testing/), where the CDN serves different versions of your site to different visitors for the purposes of testing copy or design tweaks. I've yet to try out this feature, and it's still in beta, but the approach outlined in this article could be useful if you decide to give that a go since users would be able to tag any bug reports with your version or Git commit hash.
