---
title: The Perfect Theme Switch Component
description: Learn how to implement a progressively enhanced theme switch component using HTML, CSS, and JavaScript.
categories: [html, css, javascript]
tags: [dark mode toggle, theme switch, theme toggle]
thumbnail:
  url: https://images.unsplash.com/photo-1422207049116-cfaf69531072?q=80&w=1600&h=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

My site has sported a dark mode toggle for as long as I can remember, but the logic for theming has changed quite a bit over the years. In this article, I want to share the culmination of the lessons learned on my quest to create the perfect theme switch component. We'll take a progressively enhanced approach, first supporting light and dark themes with CSS alone and then adding a few lines of JavaScript to allow users to select their preferred theme. Note that other developers have already written articles on this subject; what I'm presenting here is just how I approach theming on my site, with a few key differences.

{% include "toc.md" %}

## Feature Requirements

For my theme toggle, I wanted to:

1. Rely on CSS for theming and save JavaScript as an enhancement.
2. Respect system preferences first, then site preferences if set via JavaScript.
3. Save the user's preferred theme so it can be read on subsequent visits.
4. Prevent a flash of unthemed content (FOUC) when restoring the saved theme.

Except for a few minor differences, this implementation is similar to those of other developers. I've linked to [some of those implementations](#further-reading) at the end of this article.

## HTML

The minimum required markup for this tutorial is a bare-bones HTML document:

```html {data-file="index.html" data-copyable="true"}
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
```

We'll store all of our color variables on the `html` element in the next section.

I'll share the markup for the toggle button once we start writing JavaScript; it's not relevant yet.

## CSS: Theme Variables

We'll use CSS custom properties to define the colors for our light and dark themes. I'll scope these variables under the html element since it's the only common ancestor of all elements on a web page—and, importantly, the only such element that JavaScript can reference in a script that's placed in the `<head>` of a document (why this matters will become clear later).

For the sake of brevity, I'll use black and white for the colors; you're obviously free to use whatever colors and variable names you want:

```css {data-file="styles.css" data-copyable="true"}
/* Light theme */
html,
html[data-theme="light"] {
  color-scheme: light;
  --color-surface-0: white;
}

/* Dark theme override */
html[data-theme="dark"] {
  color-scheme: dark;
  --color-surface-0: black;
}
/* Dark theme (system preference) */
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    color-scheme: dark;
    --color-surface-0: black;
  }
}
```

Then, when styling components, you can reference these generic variables for background and foreground colors; they'll switch between light and dark themes automatically based on user preferences:

```css
body {
  background-color: var(--color-surface-0);
}
```

You'll notice I'm using the CSS [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) property in addition to my custom properties:

```css
html,
html[data-theme="light"] {
  color-scheme: light;
}
html[data-theme="dark"] {
  color-scheme: dark;
}
```

This property tells the browser to apply the operating system's native color palette when rendering light or dark themes. That way, you don't have to specify color variables for everything if you don't want to. It's totally optional but nice to have. For example, I don't like styling scrollbars myself (even though it's doable), so I just allow the browser to do that for me.

What about all of those `data-theme` attribute selectors, like `html[data-theme="dark"]`? In the next part of this tutorial, we're going to write some JavaScript to allow users to toggle their preferred theme; for the CSS colors to update, we'll set a `data-theme` attribute on the root element as a theme override. With this override, if a user chooses the dark theme, the styles scoped to `html[data-theme="dark"]` will be applied. If the user chooses the light theme or never specifies a preference, we'll either use the default light theme or a dark system theme preference (if that media query matches).

Bramus Van Damme took a similar approach for the CSS in his article on [the quest for the perfect dark mode in vanilla JavaScript](https://www.bram.us/2020/04/26/the-quest-for-the-perfect-dark-mode-using-vanilla-javascript/), but he noted code duplication as one drawback to this approach. In the above stylesheet, I had to duplicate the dark mode CSS: once for the JavaScript override (`data-theme`) and once again for the system preference. However, on my site, I use Sass to compile a higher-level syntax into CSS. One advantage of using Sass is that I can use mixins to improve code reuse, like this:


```scss
@mixin theme-light() {
  color-scheme: light;
  --color-surface-0: white;
}
@mixin theme-dark() {
  color-scheme: dark;
  --color-surface-0: black;
}

html,
html[data-theme="light"] {
  @include theme-light;
}
html[data-theme="dark"] {
  @include theme-dark;
}
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    @include theme-dark;
  }
}
```

So while my compiled CSS still has duplicate styles, I don't have any duplication in the source stylesheet—I can just edit the colors in one of the two mixins.

One last thing worth mentioning is the `html:not([data-theme])` selector in the `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    @include theme-dark;
  }
}
```

This says: Only apply the dark mode system preference if there is no override set via JavaScript. In other words, as soon as a user opts into a site theme preference by clicking the toggle button, we'll stop applying their preferred system colors. Note in particular the use of `:not`—without it, if a user chooses light mode on our site but happens to have a dark mode system preference, their system preference would always override their site preference because the styles in the media query would have a higher specificity.

For now, to test that our theme is working, we can add a `data-theme` attribute to the root element for testing purposes and then write some demo CSS. Alternatively, using your browser's developer tools, you can toggle between light and dark mode to verify that the CSS works as expected.

{% include "postImage.html" src: "./images/emulate-prefers-color-scheme.png" alt: "Emulating the prefers-color-scheme media query in the Rendering tab of Chrome dev tools. Three options are provided in a select menu: no emulation, light, or dark.", caption: "Emulating the preferred system color scheme in Chrome dev tools." %}

## JavaScript Theme Toggle

So far, we have a working demo that switches between light and dark themes based on a user's system preferences. But just because a user prefers one theme _in general_ doesn't mean that they'll like the colors we're using on our site—or maybe they're viewing the site under different lighting conditions, so they may prefer a different theme. Either way, we should give users the option to select a theme. In our progressively enhanced approach, we can add a JavaScript toggle button that cycles between light and dark themes when clicked.

To start, let's go back to our HTML and put this button somewhere in the body. Most sites render these in the top navigation, but you can also put it in your footer or elsewhere:

```html {data-file="index.html" data-copyable="true"}
<button id="theme-toggle">Enable dark theme</button>
```

If you choose to render an icon for the button, remember to give the button an `aria-label`:

```html
<button
  id="theme-toggle"
  aria-label="Enable dark theme"
>
  <svg></svg>
</button>
```

Note the wording for the label: If I just say "Toggle theme," that won't tell a screen reader user what the current theme is. Instead, we'll communicate whether this button is pressed using the `aria-pressed` HTML attribute. We'll use JavaScript to set the value for this attribute to either `true` or `false` depending on whether the current theme is dark. For example, if the button is in a pressed state, then a screen reader would narrate it along the lines of "Enable dark theme toggle button, pressed." See the [W3 Authoring Practices Guide on toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/) for more info on this pattern.

One more thing: In case JavaScript is unavailable or fails to load, we can add this noscript style to our document's head:

```html {data-file="index.html" data-copyable="true"}
<head>
  <noscript>
    <style>
      #theme-toggle {
        display: none;
      }
    </style>
  </noscript>
</head>
```

That way, if JavaScript is unavailable [for whatever reason](https://www.kryogenix.org/code/browser/everyonehasjs.html), we won't show the toggle button to avoid confusing users. After all, we can't get the button to do anything without JavaScript, unless we use HTML forms and cookies (but that implementation would require a back end).

Now, it's time to write the script for our toggle button. Here's a recap of the logic: If the button was never pressed, we'll fall back to user preferences and let CSS do its thing. As soon as the user clicks the button, we'll toggle the theme from light to dark or vice versa, and we'll also save the user's preference in `localStorage` so we can load it the next time they return to our site.

### Flash of Unthemed Content

One important requirement for my theme toggle—and those of other developers who have written on this topic before—is avoiding the dreaded theme flicker on page load. We technically _could_ write our script and stick it at the end of the body or link to a `defer`red script in the `head`:

```html
<html>
  <head>
    <script src="/index.js" defer />
  </head>
  <body>
    <!-- ... -->
    <script src="/index.js" />
  </body>
</html>
```

Both of these approaches would run after the DOM has been fully parsed. Normally, that's what you want so that JavaScript doesn't block rendering, but the problem in our case is that it gives the browser time to render the page _before_ we apply the user's previously saved theme. Thus, the page could momentarily flicker if the user prefers a dark theme but the default is light. To solve this, we'll write a tiny render-blocking script in the `head` of our document and preemptively set the `data-theme` on `html` before the browser has a chance to render the page's body.

To start, add this script to the head somewhere after your stylesheets and other important assets (so that the JavaScript doesn't block their parsing):

```html {data-file="index.html" data-copyable="true"}
<!-- stylesheets and other critical assets should go above this script -->
<script>
  (() => {
    // ... code goes here
  })();
</script>
```

This is an immediately-invoked function expression (IIFE); it's an anonymous function that's created on the fly with no reference to it and then called immediately afterwards. This is the old-fashioned way of achieving encapsulation in scripts to prevent any variables within the function from leaking into the global scope. It's not strictly necessary.

We'll start by defining some constant variables up at the top:

```js {data-file="themeToggle.js" data-copyable="true"}
const Theme = { LIGHT: 'light', DARK: 'dark' };
const THEME_OWNER = document.documentElement;
const THEME_STORAGE_KEY = 'theme';
```

I'm using a JavaScript object as a map/enum for theme names to avoid magic strings. I'm also grabbing a reference to the document root (`html`) and declaring another constant that I'll later use to store the user's preferred theme both in `localStorage` and on the `THEME_OWNER` as a data attribute.

Next, we'll check to see if the user previously set a preferred theme for our site. If they did, we'll apply it immediately to prevent the flash of unthemed content:

```js {data-file="themeToggle.js" data-copyable="true"}
const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (cachedTheme) {
  THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
}
```

{% aside %}
You may also want to validate the cached theme to make sure it matches the supported themes. This is useful in case some other scripts accidentally tamper with your `localStorage`. But it's totally optional.
{% endaside %}

That's it for the render-blocking portion of the code.

### Theme Switch Implementation

For the remainder of the script, we'll register a `DOMContentLoaded` event listener so we run that code after the browser has finished parsing the document and constructing the DOM:

```js {data-file="themeToggle.js" data-copyable="true"}
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
});
```

All remaining code for the toggle button itself will go in this event handler.

As a reminder, there are only two possibilities when a user lands on our page: Either the user previously clicked the toggle button to save a theme, or they didn't. If they never chose a theme, we'll listen to their system theme preference so we can at least keep the button's `aria-pressed` state in sync to reflect the next state the button would transition to if the user _were_ to click it. Meanwhile, we'll rely on CSS to just automatically detect the system preference changes. For example, if the user comes to our site and prefers dark mode at the system level, we need to set `aria-pressed="true"` on our dark mode toggle to reflect the current state, but the `prefers-color-scheme: dark` media query will kick in to give us the right colors without us having to set a `data-theme` attribute. In both cases, we'll also need to register a click listener on the toggle button so that as soon as a user opts into a site theme, we'll save it in `localStorage` and set a `data-theme` attribute on the `html` element so our CSS overrides can kick in from that point onward.

We'll do all of this with the [`matchMedia` web API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), so let's declare this variable at the top of our listener:


```js {data-file="themeToggle.js" data-copyable="true"}
let darkThemePreference;
```

Next, let's write some helper functions to manage the button's `aria-pressed` state and toggle the theme:

```js {data-file="themeToggle.js" data-copyable="true"}
const setIsTogglePressed = (isPressed) => themeToggle.setAttribute('aria-pressed', isPressed);

const toggleTheme = () => {
  const oldTheme = THEME_OWNER.dataset[THEME_STORAGE_KEY];
  const newTheme = oldTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
  THEME_OWNER.dataset[THEME_STORAGE_KEY] = newTheme;
  setIsTogglePressed(newTheme === Theme.DARK);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  darkThemeSystemPreference?.removeEventListener?.('change', handleSystemDarkThemePreferenceChange);
};
```

That last line in `toggleTheme` stops listening to the user's dark system preference if we ever set up a listener.

Speaking of which, let's go ahead and set up the listener next. Remember, we'll only do this if the user landed on our page without a cached theme:

```js {data-file="themeToggle.js" data-copyable="true"}
const handleSystemDarkThemePreferenceChange = ({ matches: isDarkThemePreferred }) => {
  setIsTogglePressed(isDarkThemePreferred);
};

if (!cachedTheme) {
  darkThemeSystemPreference = window.matchMedia('(prefers-color-scheme: dark)');
  darkThemeSystemPreference.addEventListener?.('change', handleSystemDarkThemePreferenceChange);
}
```

{% aside %}
The optional chaining (`?.`) is intentional; the `addEventListener` and `removeEventListener` APIs were not supported in Safari versions lower than 14 at the time of this writing.
{% endaside %}

With this code, `darkThemePreference` will be a [`MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) object of the following shape:

```ts
type MediaQueryList = {
  matches: boolean;
  addEventListener: (eventName, callback) => void;
  removeEventListener: (eventName, callback) => void;
}
```

In this object, `matches` tells us whether the media query we passed in as an argument matches the user's device configuration or system preferences. In our code above, we asked if the user prefers a dark color scheme, so `matches` will be `true` if the user's preferred system theme is dark:

```js
darkThemeSystemPreference = window.matchMedia('(prefers-color-scheme: dark)');
```

The other two properties are methods that allow us to listen to or stop listening to changes in this media query. Recall that we remove the listener in `toggleTheme` once a user opts into a site theme:

```js
darkThemeSystemPreference?.removeEventListener?.('change', handleSystemDarkThemePreferenceChange);
```

Finally, all that's left to do is to initialize the `aria-pressed` state for the theme toggle button and register a `click` listener:

```js {data-file="index.js" data-copyable="true"}
setIsTogglePressed(cachedTheme === Theme.DARK || !!darkThemeSystemPreference?.matches);
themeToggle.addEventListener('click', toggleTheme);
```

And that's all for the code!

To summarize, we:

1. Check if the user has a preferred theme for the site.
    - If they do, we set it as a `data-theme` override.
    - If they don't, we update the toggle button's `aria-pressed` state but let CSS do all the heavy lifting for theming.
2. Once the button is pressed, we save the preferred theme in `localStorage` and set a `data-theme` attribute on the `html` element to force that theme's colors in the CSS. We also unregister the system preference listener since it's no longer relevant.

Here is all of the JavaScript for the theme toggle:

```js
(function () {
  const Theme = { LIGHT: 'light', DARK: 'dark' };
  const THEME_STORAGE_KEY = 'theme';
  const THEME_OWNER = document.documentElement;

  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (cachedTheme) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    let darkThemeSystemPreference;

    const setIsTogglePressed = (isPressed) => themeToggle.setAttribute('aria-pressed', isPressed);

    const toggleTheme = () => {
      const oldTheme = THEME_OWNER.dataset[THEME_STORAGE_KEY];
      const newTheme = oldTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      THEME_OWNER.dataset[THEME_STORAGE_KEY] = newTheme;
      setIsTogglePressed(newTheme === Theme.DARK);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      darkThemeSystemPreference?.removeEventListener?.('change', handleSystemDarkThemePreferenceChange);
    };

    const handleSystemDarkThemePreferenceChange = ({ matches: isDarkThemePreferred }) => {
      setIsTogglePressed(isDarkThemePreferred);
    };

    if (!cachedTheme) {
      darkThemeSystemPreference = window.matchMedia('(prefers-color-scheme: dark)');
      darkThemeSystemPreference.addEventListener?.('change', handleSystemDarkThemePreferenceChange);
    }

    setIsTogglePressed(cachedTheme === Theme.DARK || !!darkThemeSystemPreference?.matches);
    themeToggle.addEventListener('click', toggleTheme);
  });
})();
```

## Bonus Enhancements

Our code works, but can we do better?

### CSS `:has`

You may have noticed that our current implementation stores the state for the active theme in two places: once on the root element as a `data-theme` attribute, and again on the toggle button itself as `aria-pressed`. We always have to keep these two in sync:

<div class="scroll-x">
  <table>
    <caption>Table 1: Possible states for the dark mode toggle button</caption>
    <thead>
      <tr>
        <th scope="col"><code>data-theme</code></th>
        <th scope="col"><code>aria-pressed</code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>light</code></td>
        <td><code>false</code></td>
      </tr>
      <tr>
        <td><code>dark</code></td>
        <td><code>true</code></td>
      </tr>
    </tbody>
  </table>
</div>

But wouldn't it be nice if we could just combine these under one selector? Well, once [CSS `:has`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) receives enough browser support, we actually can! Check it out:

```css {data-copyable="true"}
/* Light (default) */
html {
  color-scheme: light;
  --color-surface-0: white;
}
/* Dark (override) */
html:has(#theme-toggle[aria-pressed="true"]) {
  color-scheme: dark;
  --color-surface-0: black;
}
/* Dark (system preference) */
@media (prefers-color-scheme: dark) {
  html:not(:has(#theme-toggle[aria-pressed="true"])) {
    color-scheme: dark;
    --color-surface-0: black;
  }
}
```

This way, the theme toggle serves as the single source of truth for the theme override state. If the button is pressed (`aria-pressed="true"`), then we have a dark theme override. Otherwise, we render either a light theme or a dark theme based on system preferences.

### Radio Buttons or a Select Menu

The other source of complexity in our current implementation is the fact that we have to manage the `aria-pressed` state at all. If instead we use radio buttons or a select menu, we can just set the default selected option to be something like "Auto" or "System" so we don't have to communicate the raw theme value until a user toggles their preference:

```html {data-copyable="true"}
<fieldset id="theme-picker">
  <legend>Theme:</legend>
  <label>
    <input name="theme" type="radio" value="auto" checked>
    Auto
  </label>
  <label>
    <input name="theme" type="radio" value="light">
    Light
  </label>
  <label>
    <input name="theme" type="radio" value="dark">
    Dark
  </label>
</fieldset>
```

The updated JavaScript is much shorter and easier to read:

```js {data-copyable="true"}
(function () {
  const Theme = { AUTO: 'auto', LIGHT: 'light', DARK: 'dark' };
  const THEME_STORAGE_KEY = 'theme';
  const THEME_OWNER = document.documentElement;

  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (cachedTheme) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themePicker = document.getElementById('theme-picker');
    if (!themePicker) return;

    themePicker.addEventListener('change', (e) => {
      const theme = e.target.value;
      if (theme === Theme.AUTO) {
        delete THEME_OWNER.dataset[THEME_STORAGE_KEY];
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    });

    const initialTheme = cachedTheme ?? Theme.AUTO;
    themePicker.querySelector('input[checked]').removeAttribute('checked');
    themePicker.querySelector(`input[value="${initialTheme}"]`).setAttribute('checked', '');
  });
})();
```

On load, we just reset the default checked input. And since we're no longer using a toggle button, we don't need to query system preferences to keep the theme picker's state in sync since the default is just `Auto`; CSS will apply the right theme.

The other advantage of this approach is that it allows you to support an arbitrary number of themes rather than just the binary light or dark. If space is a concern, you could just use a select menu; I opted for radio buttons in this example since there are only three options to choose from, so it's nice to see them all at once.

## Further Reading

Here are some other articles written on this subject:

- [Joshua Comeau: The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)
- [Bram.us: The Quest for the Perfect Dark Mode Toggle, using Vanilla JavaScript](https://www.bram.us/2020/04/26/the-quest-for-the-perfect-dark-mode-using-vanilla-javascript/)
- [Adam Argyle: Building a theme switch component](https://web.dev/articles/building/a-theme-switch-component)
- [Salma Alam-Naylor: The best light/dark mode theme toggle in JavaScript](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/)

