---
title: The Perfect Theme Switch Component
description: Learn how to implement a progressively enhanced theme switch component using HTML, CSS, and JavaScript.
categories: [html, css, javascript]
keywords: [dark mode toggle, theme switch, theme toggle, theme picker]
lastUpdated: 2024-04-08
commentsId: 189
thumbnail:
  url: https://images.unsplash.com/photo-1422207049116-cfaf69531072?q=80&w=1600&h=900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

My site has sported a [dark mode toggle](#theme-picker) for as long as I can remember, but the logic for theming has changed quite a bit over the years. In this article, I want to share the culmination of the lessons learned on my quest to create the perfect theme switch component. We'll take a progressively enhanced approach, first supporting light and dark themes with CSS alone and then adding a few lines of JavaScript to allow users to select their preferred theme. Note that other developers have already written articles on this subject; what I'm presenting here is just how I approach theming on my site, with a few key differences.

{% include "toc.md" %}

## Feature Requirements

For my theme toggle, I wanted to:

1. Rely on CSS for theming and use JavaScript only as an enhancement.
2. Respect system preferences first, then site preferences if set via JavaScript.
3. Save the user's preferred theme so it can be read on subsequent visits.
4. Prevent a flash of unthemed content (FOUC) when restoring the saved theme.

Except for a few minor differences, this implementation is similar to those of other developers. I've linked to [some of those implementations](#further-reading) at the end of this article.

## CSS: Theming with Custom Properties

We'll use CSS custom properties to define the colors for our light and dark themes. I'll scope these variables under the root element since it's the only common ancestor of all elements on a web page—and, importantly, the only such element that JavaScript can reference in a script that's placed in the `<head>` of a document (why this matters will become clear later).

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

This says: Only apply the dark mode system preference if there is no override set via JavaScript. That is, as soon as a user opts into a site theme preference via our picker, we'll stop applying their preferred system colors because they're no longer relevant. Note in particular the use of `:not`—without it, if a user chooses light mode on our site but happens to have a dark mode system preference, their system preference would always override their site preference because the styles in the media query would have a higher specificity.

For now, to test that our theme is working, we can add a `data-theme` attribute to the root element for testing purposes and then write some demo CSS. Alternatively, using your browser's developer tools, you can toggle between light and dark mode to verify that the CSS works as expected.

{% include "postImage.html" src: "./images/emulate-prefers-color-scheme.png" alt: "Emulating the prefers-color-scheme media query in the Rendering tab of Chrome dev tools. Three options are provided in a select menu: no emulation, light, or dark.", caption: "Emulating the preferred system color scheme in Chrome dev tools." %}

## HTML: The Theme Picker

So far, we have a site that switches between light and dark themes based on system preferences, using only CSS. But just because a user prefers one theme _in general_ doesn't mean that they'll like the colors we're using on our site—or maybe they're viewing the site under different lighting conditions, so they may prefer a different theme. Either way, we should give users the option to select their preferred theme via a JavaScript toggle.

So how should we go about structuring the HTML? For starters, most websites implement a light-dark mode toggle using the [toggle button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) pattern:

```html
<button
  id="theme-toggle"
  type="button"
  aria-label="Enable dark theme"
  aria-pressed="false"
></button>
```

This pattern works, but a complete implementation requires a lot of extra JavaScript to manage the button's [`aria-pressed`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) state and to keep it in sync with a first-time visitor's system preferences. And if that system preference changes while the user is on the page, you'll likely want to listen to the change with the [`MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) `addEventListener` method so that your website theme automatically refreshes. Now, don't get me wrong: This _is_ doable. However, not only does it require a lot of extra code, but it also locks you into only ever using two themes: light or dark. If you ever want to add more themes in the future, you'll need to abandon this implementation anyway.

For this reason, I recommend implementing a theme picker using radio buttons or a `<select>`. The latter makes more sense if you have lots of options and need to save on space; I'm using radio buttons in this tutorial since there are only three options to choose from, so it's nice to see them all at once without any interaction.

```html {data-file="index.html" data-copyable="true"}
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

That `Auto` option will come in handy soon; rather than reading a first-time visitor's preferred theme on page load, we'll just set this option as the default and let CSS do all the hard work for us.

### Noscript Styles

One more thing: In case JavaScript is unavailable or fails to load, we can add this noscript style to our document's head:

```html {data-file="index.html" data-copyable="true"}
<head>
  <noscript>
    <style>
      #theme-picker {
        display: none;
      }
    </style>
  </noscript>
</head>
```

That way, if JavaScript is unavailable [for whatever reason](https://www.kryogenix.org/code/browser/everyonehasjs.html), we won't show the theme picker to avoid confusing users. After all, we can't get the picker to do anything without JavaScript, unless we use HTML forms and cookies (but that implementation would require a back end).

Now, it's time to write the script for our theme picker.

## JavaScript: Making It Interactive

Typically, as a best practice, you'd link to your JavaScript either at the end of the body or as a `defer`red script in the `head` to avoid blocking the render process:

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

Both of these scripts run after the DOM has been fully parsed. Normally, that's what you want so that JavaScript doesn't block rendering, but the problem in our case is that it gives the browser time to render the page _before_ we apply the user's previously saved theme. Thus, the page could momentarily flicker between two themes as it loads, a problem known as a <dfn>flash of unthemed content (FOUC)</dfn>. For example, if a user's system theme preference is dark but they previously saved a light theme preference on our site, then the page would flash from dark (system) to light (website) as it loads. Admittedly, this isn't the end of the world, but it can be a bit unpleasant to look at.

To avoid this problem, we'll write a tiny render-blocking script in the `head` of our document and preemptively set the `data-theme` on `html` before the browser has a chance to render the page's body. That way, by the time the content is rendered, the correct theme will have already been set.

To start, add this script to the head somewhere after your stylesheets and other important assets (so that the JavaScript doesn't delay their parsing):

```html {data-file="index.html" data-copyable="true"}
<!-- stylesheets and other critical assets should go above this script -->
<script>
  // ... all of our code goes here
</script>
```

{% aside %}
You may want to use the [immediately-invoked function expression (IIFE)](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression) pattern here to avoid leaking any variables from this script into the global/window scope. I use this in my implementation, but I omitted it from this article to minimize indentation.
{% endaside %}

We'll start by defining some constant variables up at the top of our script:

```js {data-file="themePicker.js" data-copyable="true"}
const THEME_OWNER = document.documentElement;
const THEME_STORAGE_KEY = 'theme';
```

This code just grabs a reference to the document root (`html`) and declares another constant that we'll later use to store the user's preferred theme both in `localStorage` and on the `THEME_OWNER` as a data attribute.

Next, we'll check to see if the user previously set a preferred theme for our site. If they did, we'll apply it immediately to prevent the flash of unthemed content:

```js {data-file="themePicker.js" data-copyable="true"}
const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (cachedTheme) {
  THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
}
```

That's it for the render-blocking portion of the code. For the remainder of the script, we'll register a `DOMContentLoaded` event listener so we run that code after the browser has finished parsing the document and constructing the DOM:

```js {data-file="themePicker.js" data-copyable="true"}
document.addEventListener('DOMContentLoaded', () => {
  const themePicker = document.getElementById('theme-picker');
  if (!themePicker) return;
});
```

In this event handler, we need to do two things. First, we'll check/toggle the radio button corresponding to the cached theme so that the initial UI correctly reflects our state:

```js {data-file="themePicker.js" data-copyable="true"}
const initialTheme = cachedTheme ?? 'auto';
themePicker.querySelector('input[checked]').removeAttribute('checked');
themePicker.querySelector(`input[value="${initialTheme}"]`).setAttribute('checked', '');
```

On load, we find the default checked input and turn it off; then, we enable whichever input corresponds to the initial theme, which is either the user's last-saved theme or `'auto'` to fall back to system preferences. This is one of the really nice things about using a radio button group or select menu for a theme picker: Since we're not using a toggle button, we don't need to query system preferences from inside JavaScript to keep the theme picker's state in sync. The default is `'auto'`; CSS will apply the right theme.

Finally, we'll listen for theme changes and save the user's preference in `localStorage`:

```js {data-file="themePicker.js" data-copyable="true"}
themePicker.addEventListener('change', (e) => {
  const theme = e.target.value;
  if (theme === 'auto') {
    delete THEME_OWNER.dataset[THEME_STORAGE_KEY];
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
});
```

Note that if a user reselects the `'auto'` option, we just remove the `data-theme` attribute from the root element and clear `localStorage` so that our CSS `@prefers-color-scheme` media query kicks in again.

That's it! This is all of the JavaScript for the theme toggle:

```js
const THEME_STORAGE_KEY = 'theme';
const THEME_OWNER = document.documentElement;

const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (cachedTheme) {
  THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
}

document.addEventListener('DOMContentLoaded', () => {
  const themePicker = document.getElementById('theme-picker');
  if (!themePicker) return;

  const initialTheme = cachedTheme ?? 'auto';
  themePicker.querySelector('input[checked]').removeAttribute('checked');
  themePicker.querySelector(`input[value="${initialTheme}"]`).setAttribute('checked', '');

  themePicker.addEventListener('change', (e) => {
    const theme = e.target.value;
    if (theme === 'auto') {
      delete THEME_OWNER.dataset[THEME_STORAGE_KEY];
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  });
});
```

And with that, our progressively enhanced theme switch is complete.

## Optional Enhancement: CSS `:has`

You may have noticed that our current implementation stores the theme state in two places: once on the root element as a `data-theme` attribute, and implicitly on the theme picker itself as the currently selected option (which the browser manages for us as the user changes their selection). It would be nice if we could consolidate this duplication and store the state on a single element.

Well, I have both good news and bad news.

The good news is that we can do this with [CSS `:has`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) and the `:checked` pseudo-class:

```css {data-file="styles.css" data-copyable="true"}
/* Light (default) */
html,
html:has(input[name="theme"][value="light"]:checked) {
  color-scheme: light;
  --color-surface-0: white;
}
/* Dark (override) */
html:has(input[name="theme"][value="dark"]:checked) {
  color-scheme: dark;
  --color-surface-0: black;
}
/* Dark system preference (light is treated as implicit default) */
@media (prefers-color-scheme: dark) {
  html:has(input[name="theme"][value="auto"]:checked) {
    color-scheme: dark;
    --color-surface-0: black;
  }
}
```

Let's also update our JavaScript to remove all of the `THEME_OWNER`-related code:

```js {data-file="themePicker.js" data-copyable="true"}
const THEME_STORAGE_KEY = 'theme';
const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);

const themePicker = document.getElementById('theme-picker');
if (!themePicker) return;

const initialTheme = cachedTheme ?? 'auto';
themePicker.querySelector('input[checked]').removeAttribute('checked');
themePicker.querySelector(`input[value="${initialTheme}"]`).setAttribute('checked', '');

themePicker.addEventListener('change', (e) => {
  const theme = e.target.value;
  if (theme === 'auto') {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
});
```

The bad news is that this reintroduces the flash of unthemed content that we were originally trying to avoid. Why? Because we can't initialize the default-checked radio input until after the body has been parsed, at which point we can grab a reference to the theme picker element with JavaScript. So with this updated approach, when the page loads for the first time, the CSS will default to reading system preferences, and the system theme may not be the same as the author's previously saved theme.

If you decide to take this approach, note that you'll no longer need to place this script in the `<head>` of your document since the whole point of doing that was to avoid FOUC. In fact, technically, the script only needs to be positioned after the theme picker element in the DOM and not necessarily at the very end of the body. If your theme picker and script appear very early in the DOM, such as in a top navigation bar, you may not even observe any FOUC. I recommend testing this and weighing the pros and cons of each approach before picking one over the other.

## Further Reading

Here are some other articles written on this subject:

- [Joshua Comeau: The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)
- [Bram.us: The Quest for the Perfect Dark Mode Toggle, using Vanilla JavaScript](https://www.bram.us/2020/04/26/the-quest-for-the-perfect-dark-mode-using-vanilla-javascript/)
- [Adam Argyle: Building a theme switch component](https://web.dev/articles/building/a-theme-switch-component)
- [Salma Alam-Naylor: The best light/dark mode theme toggle in JavaScript](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/)

