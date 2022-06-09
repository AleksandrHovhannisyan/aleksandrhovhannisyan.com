---
title: Design Mode in 11ty
description: Sometimes, I prefer to compose text right in my browser and copy it over to my source files. In 11ty, we can enable this behind a keyboard shortcut in our development environment using environment variables.
keywords: [designMode, 11ty]
categories: [11ty, javascript, environment-variables]
commentsId: 152
---

Sometimes, I prefer to compose text right in my browser and copy it over to my source files, especially if the text has a constrained width, if I want to test certain overflow edge cases, or if I'm worried about getting the wording right. The painful way of doing this is by editing the text node in dev tools, but a much better alternative is to enable [document design mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode). When `designMode` is set to `'on'`, all of the text and elements on the page become editable; this mode even includes helpful squiggly underlines to point out any spelling mistakes on the page. I find this useful when I'm tweaking copy or designing UIs with constrained widths—rather than waiting for my page to hot reload, I can just edit it directly in my browser and then copy the final result over to my source file.

But I'll be honest: I'm *extremely* lazy. I don't want to open up my dev tools every time and type `document.designMode='on'` or press the up arrow key if that was my last executed line of code. If only there were a way I could enable this behavior behind a custom keyboard shortcut. Bonus points if this could only be enabled in my development environment.

Well, it turns out that this is not only *possible* but also really easy to implement thanks to 11ty's data cascade and environment variables.

## Setting `ELEVENTY_ENV`

Since we only want to enable this behavior in our development environment, we'll use environment variables. Update your scripts accordingly to set `ELEVENTY_ENV`:

```json {data-copyable=true}
"serve": "cross-env ELEVENTY_ENV=development npx @11ty/eleventy --serve --incremental",
"build": "cross-env ELEVENTY_ENV=production npx @11ty/eleventy"
```

{% aside %}
  Refer to Stephanie Eckles's article on [managing environment variables in 11ty](https://11ty.rocks/tips/env-variables/) if you need help with this step.
{% endaside %}

## Creating a Feature Flag

Let's create a JavaScript data file named `featureFlags.js` and check `process.env.ELEVENTY_ENV` to see if we're in development or production:

```js {data-file="src/_data/featureFlags.js" data-copyable=true}
module.exports = {
  enableDesignMode: process.env.ELEVENTY_ENV === 'development',
};
```

This exposes a `featureFlags` object in the 11ty data cascade that's accessible anywhere you would normally see data: templates, includes, pages, and more. I've opted for this approach rather than exposing the environment variables object in its entirety to my templates as data, which would look like this:

```js
module.exports = process.env;
```

The nice thing about transforming our environment variables into a custom data shape is that we can temporarily turn off any feature whenever we want without having to delete any of the code related to it or change our environment.

```js {data-file="src/_data/featureFlags.js" data-copyable=true}
module.exports = {
  // Example of disabling this behavior without deleting its associated logic
  // or simulating a production environment.
  enableDesignMode: false,
};
```

## Adding a Keyboard Shortcut Script

Finally, we'll check if this flag is enabled in our default layout. If it's turned on, we'll run a bit of custom JavaScript that sets up a keyboard event listener to toggle `document.designMode`. We'll also cache our preference in `localStorage` so it persists between hot reloads.

{% raw %}
```html {data-file="src/_layouts/default.html" data-copyable=true}
{%- if featureFlags.enableDesignMode -%}
  <script>
    (function() {
      const DESIGN_MODE_STORAGE_KEY = 'design-mode';
      const cachedDesignMode = localStorage.getItem(DESIGN_MODE_STORAGE_KEY);
      document.designMode = cachedDesignMode;

      document.addEventListener('keyup', (e) => {
        if (e.ctrlKey && e.key === '.') {
          const newDesignMode = document.designMode === 'on' ? 'off' : 'on';
          document.designMode = newDesignMode;
          localStorage.setItem(DESIGN_MODE_STORAGE_KEY, newDesignMode);
        }
      });
    })();
  </script>
{%- endif -%}
```
{% endraw %}

{% aside %}
  You can stick this script in your head or body; it doesn't really matter where since this is in development mode only.
{% endaside %}

I've chosen to bind the keyboard shortcut to `Ctrl+.`, but feel free to use whatever key combination makes sense for your site.

Now, all you need to do is start up your 11ty dev server. `ELEVENTY_ENV` will get set to `development`, and the default layout will include this script to allow you to toggle design mode on and off.

Don't find the inline script to be ergonomic, or plan on adding more functionality and keyboard shortcuts to your 11ty site? Just throw your code into a separate script and link it here like you normally would.

And that's all there is to it—happy designing!

{% include unsplashAttribution.md name: "Amélie Mourichon", username: "amayli", photoId: "sv8oOQaUb-o" %}
