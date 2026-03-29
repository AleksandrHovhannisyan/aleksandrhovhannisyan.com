---
title: Fully Local Code Embeds
description: A simple web component for rendering isolated code embeds using HTML, CSS, and JavaScript.
categories: [html, javascript]
keywords: [iframe, code demo, code sandbox, local iframe]
scripts:
  - type: module
    src: src/assets/scripts/components/codeDemo.ts
---

A few years ago, I was looking for a way to add interactive code sandboxes to my Markdown files without embedding third-party iframes, like the ones from Codepen or Codesandbox. Those services are great and I use them all the time to share demos, but I've never been a fan of using them on a blog since you have to jump back and forth between your local Markdown file and an external site to make changes to the demos. Plus, they typically load lots of JavaScript.

The first solution I came up with was inspired by [Maciej Mionskowski's article on `iframe` code previews](https://mionskowski.pl/posts/iframe-code-preview/), in which he describes how he used the iframe `srcdoc` attribute to add fully local code demos to his Hugo blog. Most iframes use the `src` attribute to point to a webpage, but `srcdoc` allows you to define the content document for an iframe using an inline HTML string, like this:

```html
<iframe srcdoc="<!doctype html><body>...</body>"></iframe>
```

Typing this out by hand isn't practical or legible; code embeds typically do the heavy lifting for you behind the scenes by taking the code you type and feeding it to an iframe's `srcdoc` attribute. I did a similar thing in Eleventy in 2022 and published my solution as a community plugin ([`eleventy-plugin-code-demo`](https://www.npmjs.com/package/eleventy-plugin-code-demo)), which allowed me to write code like this to produce code demos:

{% raw %}
````md
{% codeDemo "My iframe's title" %}
```html
<p>hello world!</p>
```
```css
p { color: red; }
```
```js
console.log("test");
```
{% endcodeDemo %}
````
{% endraw %}

At build time, this shortcode gets compiled to an iframe containing the markup defined in those Markdown fenced code blocks. It worked great, but the syntax felt awkward, and it could only be used in Eleventy. And I've learned my lesson enough times to know that you should never depend too heavily on framework semantics in case it's abandoned and no longer maintained in the future.

Recently, I wanted to see if I could refine this idea and come up with a framework-agnostic solution that lets you render isolated code sandboxes wherever HTML and client-side JavaScript are supported. And after quite a bit of trial and error, I eventually figured it out.

Now, I can write code like this:

```html
<code-demo description="Registering click event listeners on a button and all of its ancestors" style="height: 310px">
  <template>
    <button>Click me!</button>
    <script>
      const button = document.querySelector('button');
      const html = document.documentElement;
      const body = document.body;
      window.addEventListener('click', () => console.log('window'));
      html.addEventListener('click', () => console.log('html'));
      body.addEventListener('click', () => console.log('body'));
      button.addEventListener('click', () => console.log('button'));
    </script>
  </template>
</code-demo>
```

To produce fully local, isolated code embeds like this:

<code-demo description="Registering click event listeners on a button and all of its ancestors" style="height: 310px">
  <template>
    <button>Click me!</button>
    <script>
      const button = document.querySelector('button');
      const html = document.documentElement;
      const body = document.body;
      window.addEventListener('click', () => console.log('window'));
      html.addEventListener('click', () => console.log('html'));
      body.addEventListener('click', () => console.log('body'));
      button.addEventListener('click', () => console.log('button'));
    </script>
  </template>
</code-demo>

Check out my solution on npm: [`local-iframe`](https://www.npmjs.com/package/local-iframe).

## How it works

In my mind, I wanted to create a web component that could be used like this:

```html
<local-iframe>
  <h1>Hello world</h1>
  <style>h1 { color: red }</style>
  <script>console.log("hi")</script>
</local-iframe>
```

This web component would then create an iframe with a `srcdoc` that's an exact copy of its light DOM (in this example, a heading, a stylesheet, and a script).

But there's a problem: All of the scripts and styles in this web component's light DOM will affect the outer document when it's initially parsed. What I wanted was to tell the web component what HTML, CSS, and JS it should _eventually_ use to render an iframe, but to avoid actually parsing that content on page load.

That's when I realized I could use the [HTML `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) to do just that:

```html
<local-iframe>
  <template>
    <h1>Hello world</h1>
    <style>h1 { color: red }</style>
    <script>console.log("hi")</script>
  </template>
</local-iframe>
```

This is the same example as before, except now all of the markup is defined in a `<template>` tag that the browser ignores during page load. However, the web component can still query for this template, copy its inner HTML, construct an `iframe` with a `srcdoc` set to that template's inner HTML, and append the iframe to its own light DOM, eventually producing this HTML:

```html
<local-iframe>
  <template><!-- omitted for brevity --></template>
  <iframe srcdoc="whatever html you put in the template"></iframe>
</local-iframe>
```

You may be wondering: Why not just render the iframe yourself by hand? You totally could do that. But the authoring experience would be a nightmare since you'd need to write all your HTML, CSS, and JavaScript as one long unbroken string, and you would also need to manually escape characters like `"`, `<`, and `>` yourself to avoid breaking the outer HTML. Plus you miss out on syntax highlighting. But with `local-iframe`, anyone reading your source code can see exactly what the final document structure will be simply by looking at it.

My web component has a flexible API too, so you can either define the template as a child or reference an external one by its ID:

```html
<template id="my-template">
  <h1>Hello world</h1>
  <style>h1 { color: red }</style>
  <script>console.log("hi")</script>
</template>
<!-- same result as before -->
<local-iframe template="my-template"></local-iframe>
```

## Custom rendering

On my blog, I wanted to customize the iframes a bit more. For example, some of my code demos log messages to the console, so I thought it would be fun to have a console output region at the bottom of each frame that intercepts messages and displays them along with a timestamp. Here's an example from one of my articles that measures your display's FPS using `requestAnimationFrame` and logs some messages in each frame:

<code-demo description="Demo of requestAnimationFrame timing" style="height: 400px">
  <template>
    <div id="demo">
      <h1>Measure FPS with requestAnimationFrame</h1>
      <p>Tests run over a 5-second interval.</p>
      <div>
        <button id="start-demo">Start recording</button>
      </div>
    </div>
    <style>
      #demo h1 {
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 0.5lh;
      }
      #demo p {
        text-align: center;
        margin-bottom: 1lh;
      }
      #demo button {
        text-align: center;
        padding: 0.5em;
        display: block;
        margin: 0 auto;
      }
      #demo button[aria-disabled='true'] {
        opacity: 0.7;
        cursor: not-allowed;
      }
    </style>
    <script>
      let isRunning = false;
      const MAX_ALLOWED_TIME_MS = 5000;
      const startDemoButton = document.querySelector('#demo button');
      startDemoButton.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        startDemoButton.setAttribute('aria-disabled', 'true');
        let demoStartTimeMs = 0;
        let demoEndTimeMs;
        let previousTimeMs = 0;
        let numFrames = 0;
        function update() {
          requestAnimationFrame((currentTimeMs) => {
            numFrames++;
            if (!demoStartTimeMs) {
              demoStartTimeMs = currentTimeMs;
              previousTimeMs = currentTimeMs;
            }
            const deltaTimeMs = currentTimeMs - previousTimeMs;
            console.log(
              `Frame ${numFrames}. previousTimeMs: ${previousTimeMs.toFixed(2)}, currentTimeMs: ${currentTimeMs.toFixed(2)}, deltaTimeMs: ${deltaTimeMs.toFixed(2)}`
            );
            previousTimeMs = currentTimeMs;
            demoEndTimeMs = currentTimeMs;
            if (currentTimeMs - demoStartTimeMs >= MAX_ALLOWED_TIME_MS) {
              demoEndTimeMs = currentTimeMs;
              const demoTimeElapsedMs = demoEndTimeMs - demoStartTimeMs;
              const averageFPS = ((numFrames - 1) / MAX_ALLOWED_TIME_MS) * 1000;
              console.log(`End of demo. Average recorded FPS: ${Math.floor(averageFPS)}`);
              startDemoButton.setAttribute('aria-disabled', 'false');
              isRunning = false;
            } else {
              update();
            }
          });
        }
        update();
      });
    </script>
  </template>
</code-demo>

I could've just made this part of the base component, but not everyone would want that UI, and it would be very difficult for users to customize to their liking. Instead, the way I did this is by exposing two usage patterns for my npm package:

1. Import the auto-registered `local-iframe` web component from the index.
2. Import the `LocalIframe` class, extend it, and register your own component.

The first pattern is the simplest and allows you to just drop the web component into any page and start using it. For more advanced use cases, users can follow the second pattern to customize the HTML document for all rendered frames. To do that, you import the `LocalIframe` class and subclass it:

```ts
import { LocalIframe } from 'local-iframe/LocalIframe';

class CodeDemo extends LocalIframe {
  protected _render(templateHtml: string): string {
    const hasScripts = templateHtml.includes('<script>');
    return `<!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"></head>
    <body>
        <main><div>${templateHtml}</div></main>
        ${hasScripts ? `${consoleHTML}<script>${consoleJS}</script>` : ''}
    </body>
  </html>
    `;
  }
}

window.customElements.define('code-demo', CodeDemo);
```

The `_render` method is inherited from the base `LocalIframe` class; it accepts the incoming template HTML as an argument, and you can return whatever iframe document structure you want from it. By default, `_render` returns a bare-bones HTML document with no extra frills, but you can override the method like we're doing here to return whatever custom HTML you want.

For the actual console, the basic idea is that the iframe hijacks `console.log` to intercept its arguments and appends those values to an auto-scrolling list that is styled to look like a console output region. Here's some of the code I used to do that:

```ts
const consoleHTML = `
<footer id="console-root">
    <div id="console-header">
        <p id="console-label">Console output</p>
        <button id="console-clear-button">Clear console</button>
    </div>
    <div id="console-wrapper" role="region" tabindex="0" aria-labelledby="console-label">
        <ol id="console" aria-live="polite" aria-atomic="true" aria-relevant="additions"></ol>
    </div>
</footer>
`;

const consoleJS = `
(function initConsole(){
    const consoleRoot = document.querySelector('#console-root');
    const consoleOutput = consoleRoot.querySelector('#console');
    const consoleScrollContainer = consoleRoot.querySelector('[tabindex]');
    const clearButton = consoleRoot.querySelector('#console-clear-button');

    const makeLogger = (level) => (...args) => {
      const li = document.createElement('li');
      const time = document.createElement('time');
      const now = new Date();
      time.setAttribute('datetime', now.toISOString());
      time.innerHTML = Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(now);
      if (level) { li.classList.add(level); }
      li.append([...args].map((arg) => {
        const isUndefined = typeof arg === 'undefined';
        return isUndefined ? 'undefined' : JSON.stringify(arg);
      }).join(" "));
      li.appendChild(time);
      consoleOutput.appendChild(li);
      consoleScrollContainer.scrollBy({ top: consoleScrollContainer.scrollHeight });
    };

    console.log = makeLogger();
    console.error = makeLogger("error");

    window.addEventListener("unhandledrejection", (event) => {
        console.error('Uncaught (in promise) ' + event.reason);
    }, { capture: true });

    window.addEventListener('click', (e) => {
        if (e.target === consoleRoot || consoleRoot.contains(e.target)) {
            e.stopPropagation();
        }
        if (e.target === clearButton) {
            consoleOutput.innerHTML = '';
        }
    }, { capture: true });
})();
`;
```

The only confusing part is the capturing `click` event handler on the `window` object. You may be inclined to just set click listeners on the individual elements that need them, but there's a good reason why I wrote the code this way.

TL;DR: One of my articles is an [interactive guide on JavaScript events](/blog/interactive-guide-to-javascript-events/), and in that article I have a few code demos that register capturing event listeners on `window`, `document.documentElement`, `document.body`, and other elements. The problem is that capturing event listeners always run before the targeting phase and before events bubble, so clicking the console output or one of its children could trigger one of the click listeners set on an ancestor to run. For example, you might click the `Clear console` button, and it would clear the console, but then the capturing click listener on `window` might log another message. `stopPropagation` wouldn't help because again, a capturing listener on `document.body` would _always_ run before any event handler set on one of its children. To work around this, I registered a capturing click listener at the highest level possible—on `window`—and ignored all clicks that originate from the output region. I then handled the special case of the "clear console" button in that same listener.

{% aside %}
In theory, you'd need to do the same for other types of events too, not just clicks. But I can't be bothered to do that.
{% endaside %}

My logger hijacks `console.log` and `console.error` and redirects their output to a dedicated console region in the iframe's UI. I then style that region with CSS to look like a console pane:

```ts
const consoleCSS = `
* {
    box-sizing: border-box;
    margin: 0;
}
:root {
    --color-border: hsl(0, 0%, 80%);
    --color-surface-1: hsl(0, 0%, 95%);
    --color-surface-2: hsl(0, 0%, 88%);
    --color-text-soft: hsl(0, 0%, 40%);
    --color-danger: #c10000;
}
html,
body {
    background-color: white;
    min-height: 100%;
    height: 100%;
}
body {
    font-family: sans-serif;
    display: grid;
}
body:has(#console-root) {
    padding: 0;
    grid-template-rows: 1fr 50%;

    main {
        display: grid;
        place-content: center;
        overflow-y: auto;
        margin-block: auto;
    }
}
main {
    padding: 28px;
    height: 100%;
}
button {
    cursor: pointer;
    font: inherit;
    padding: 0.5rem;
}
#console-root {
    font-size: medium;
    background-color: var(--color-surface-1);
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto;
}
#console-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-block: solid 1px var(--color-border-0);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    background-color: var(--color-surface-2);
}
#console-clear-button {
    background: transparent;
    font-size: inherit;
    border: none;
    padding: 0.25rem;
    text-decoration: underline;
}
#console-wrapper {
    padding: 0.5rem;
    background-color: inherit;
    overflow-y: auto;
}
#console {
    list-style: none;
    display: block;
    font-family: monospace;
    padding: 0;
}
#console > * {
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 0.25rem;
    padding-inline-end: 0.5rem;
}
#console .error {
    color: var(--color-danger);
}
#console time {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-soft);
}`;
```

## Own your content

Like I mentioned in the intro, part of the reason why I wanted to make this web component was to reduce my dependency on third-party code embeds and framework specifics. Now, I can finally write HTML to produce fully isolated, local code sandboxes without ever leaving my local development environment. My only dependency is my `local-iframe` package, which in turn has [zero dependencies](https://github.com/AleksandrHovhannisyan/local-iframe/blob/master/package.json).

You can do anything with `local-iframe` that you can in normal HTML documents: load Google Fonts, import a JavaScript framework via CDN, whatever. The only thing you can't do is use non-native syntaxes like TypeScript or JSX.

Try it out, and let me know what you think!