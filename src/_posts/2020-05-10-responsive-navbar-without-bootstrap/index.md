---
title: Creating a Responsive Navbar Without Bootstrap
description: Want to create a navbar that works on mobile and desktop? Ditch the frameworks—in this tutorial, we'll create a responsive navbar using HTML, CSS, and JavaScript.
keywords: [responsive navbar]
categories: [html, css, javascript]
commentsId: 28
lastUpdated: 2021-09-18
thumbnail: ./images/thumbnail.png
---

Navigation bars (also known as _navbars_) are practically everywhere on modern websites, so it's good to know how to create one by hand without relying on a component library that does all of the heavy lifting for you. But if you've never created a navbar from scratch, you may find it intimidating to get started.

For this reason, people often turn to CSS frameworks like Bootstrap to build navbars so that they don't have to reinvent the wheel. Yet what usually ends up happening is that you get lost in a sea of obscure class names and behavior that's difficult to customize. You waste many frustrating hours on StackOverflow when instead you could've simply built the thing by hand in less time.

In this tutorial, we'll create a responsive navbar that works on both mobile and desktop, using nothing but HTML, CSS, and JavaScript. That's right—no CSS frameworks needed! We'll also ensure that it remains accessible to users of assistive technologies.

{% include toc.md %}

## What We're Building

Here's the Codepen demo for this tutorial if you want to follow along:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="xxwWama" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/xxwWama">
  Responsive Navbar</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

There's actually not a lot of HTML involved! Navbars aren't all that difficult to create once you go through the process yourself.

We'll design this with a mobile-first approach and simply take care of the desktop case with a media query. Note that I'm not designing with any minimum device width in mind, but this works all the way down to `320px`, one of the narrowest mobile resolutions that you typically need to account for.

{% aside %}
**Note**: I'll also offer alternative design options wherever it's possible with just a few changes. For example, if you don't like the detached/floating navigation menu, I'll show you how to keep it attached or get it to behave like a sidebar.
{% endaside %}

## Responsive Navbar HTML

Below is all of the HTML that we're going to need to create our responsive navbar:

```html {data-file="index.html"}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Responsive Navbar</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <header id="navbar">
      <nav class="navbar-container container">
        <a href="/" class="home-link">
          <div class="navbar-logo"></div>
          Website Name
        </a>
        <button
          type="button"
          id="navbar-toggle"
          aria-controls="navbar-menu"
          aria-label="Toggle menu"
          aria-expanded="false"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div id="navbar-menu" aria-labelledby="navbar-toggle">
          <ul class="navbar-links">
            <li class="navbar-item"><a class="navbar-link" href="/about">About</a></li>
            <li class="navbar-item"><a class="navbar-link" href="/blog">Blog</a></li>
            <li class="navbar-item"><a class="navbar-link" href="/careers">Careers</a></li>
            <li class="navbar-item"><a class="navbar-link" href="/contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
    <script src="index.js"></script>
  </body>
</html>
```

We're going to write some CSS and JavaScript in this post; you can either add the styles an JavaScript inline to your head if you're following along in a local sandbox, or you can create separate files for those. I'll do the latter, but it's up to you how you want to structure your local project.

## Dissecting a Navbar

Before I vomit a bunch of CSS on your screen and leave you clueless as to what's going on, let's take a closer look at the components that make up our navbar.

First up, we're using a `<header>` landmark element with an ID of `navbar` as the outermost parent:

{% include img.html src: "./images/header.png", alt: "A header element" %}

Inside of that is a nested `<nav>` landmark element, which signals the start of a navigation menu to screen readers and browsers. This container's main purpose is to align the left and right ends of our navbar with the page's left and right margins. This assumes that the page content itself is also wrapped with a `.container` for horizontal centering.

{% include img.html src: "./images/nav.png", alt: "A nav landmark element with left and right padding and auto margins" %}

As you may have probably guessed, this is a flex container. It has three children:

- `.home-link`: Anchor wrapped around the website logo and name.
- `#navbar-toggle`: The hamburger button used to toggle the navigation menu on mobile devices.
- `#navbar-menu`: The navigation menu wrapper, containing a list of links to our pages.

Let's take a closer look at that last element:

{% include img.html src: "./images/navbar-menu.png", alt: "The navbar-menu fixed wrapper" %}

This wrapper is given a fixed position and covers the entire screen. It also has a semi-transparent background that elevates it visually above the main content of the page. In some UI libraries, this is known as a **mask layer**. It's a common approach used with things like modal windows and menus.

Within `#navbar-menu` is an unordered list with some padding, margins, and a box shadow:

{% include img.html src: "./images/navbar-links.png", alt: "The navbar-links unordered list element" %}

And finally, that list houses the actual navigation links:

{% include img.html src: "./images/navbar-link.png", alt: "A navigation bar link being inspected in Chrome dev tools" %}

That's it! When we hit the `700px` breakpoint, our media query kicks in and styles the desktop navbar. This media query was determined based on the number of navbar links in this particular setup. If you have more content, you may wish to adjust this breakpoint.

With all of this prep work out of the way, we're ready to begin creating our responsive navbar.

## Styling the Navbar

We're going to take this slowly. I'll add explanations for each bit of CSS and JavaScript that I introduce so you understand what's going on. I'll also show screenshots with each major change we introduce.

First up are some standard CSS resets and base styling:

```css {data-file="style.css"}
:root {
  --navbar-bg-color: hsl(0, 0%, 15%);
  --navbar-text-color: hsl(0, 0%, 85%);
  --navbar-text-color-focus: white;
  --navbar-bg-contrast: hsl(0, 0%, 25%);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}
```

Feel free to remove any of the CSS that doesn't apply to your situation; this is just for the tutorial itself. The variables up at the top will help us avoid copy-pasting colors in our CSS. We reset paddings and margins and use `box-sizing: border-box` to ensure that widths/heights take border and padding into account. Finally, we ensure that the body takes up the entire vertical height of the device with `height: 100vh`.

Before we look at the CSS specific to the responsive navbar, I'd like to introduce one more selector:

```css {data-file="style.css"}
.container {
  max-width: 1000px;
  padding: 0 1.4rem;
  margin: 0 auto;
}
```

This is a pretty popular approach for centering things horizontally in CSS. Basically, you can just slap a class name of `container` on anything that should be horizontally centered on the page. Here, the page is centered to a maximum width of `1000px`. If you'll recall, we applied this class to the `<nav>` element:

```html
<nav class="navbar-container container">...</nav>
```

Alright, time to actually style our responsive navbar. We'll work in a top-down fashion. First up is the outermost `#navbar` element:

```css {data-file="style.css"}
#navbar {
  --navbar-height: 64px;
  position: fixed;
  height: var(--navbar-height);
  background-color: var(--navbar-bg-color);
  left: 0;
  right: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
```

**Result**:

{% include img.html src: "./images/step1.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. Some blue links overflow vertically on its left-hand side." %}

Why we need the CSS variable will become obvious later on. The entire element is given a fixed position so it sticks to the top of the page as the user scrolls. It's also given a slight box shadow. Don't worry about the fact that the links are currently overflowing their parent; we'll fix this soon enough.

Moving on, we have the nested container element:

```css {data-file="style.css"}
.navbar-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
}
```

**Result**:

{% include img.html src: "./images/step2.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. A purple link reads Website Name on the left-hand side; on the right side are some blue-colored vertically overflowing links, rendered with visible bullet points." %}

As I mentioned earlier, this is simply a flex container. We use `justify-content: space-between` to position the home link and hamburger icon on opposite ends of the navbar. But right now, it's positioning all three children: the home link, the hamburger button, and the navigation links themselves; we'll fix this shortly.

Next up is some general styling for the navbar anchors:

```css {data-file="style.css"}
.navbar-item {
  margin: 0.4em;
  width: 100%;
}

.home-link,
.navbar-link {
  color: var(--navbar-text-color);
  text-decoration: none;
  display: flex;
  font-weight: 400;
  align-items: center;
}

.home-link:is(:focus, :hover) {
  color: var(--navbar-text-color-focus);
}

.navbar-link {
  justify-content: center;
  width: 100%;
  padding: 0.4em 0.8em;
  border-radius: 5px;
}

.navbar-link:is(:focus, :hover) {
  color: var(--navbar-text-color-focus);
  background-color: var(--navbar-bg-contrast);
}
```

**Result**:

{% include img.html src: "./images/step3.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. A white link reads Website Name on the left-hand side; on the right side are some white-colored vertically overflowing links, rendered with visible bullet points." %}

Pretty straightforward.

Here's the CSS for the website logo. Note that this is just a placeholder for my demo; in reality, you'll probably want to use an image or SVG:

```css {data-file="style.css"}
.navbar-logo {
  background-color: var(--navbar-text-color-focus);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-inline-start: 0.5em;
}
```

**Result**:

{% include img.html src: "./images/step4.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. A white link reads Website Name on the left-hand side. To its immediate left is a white circle that serves as a logo placeholder." %}

Time for the toggle button!

### Making It Interactive: Navbar Toggle Button

First, here's the markup for the navbar button:

```html
<button
  type="button"
  id="navbar-toggle"
  aria-controls="navbar-menu"
  aria-label="Toggle menu"
  aria-expanded="false"
>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
</button>
```

We're doing several things here, so let's try to unpack it all:

- We set `type="button"` since the default behavior is `submit` (for forms).
- We give the button an ID, to be used for styling and interactivity.
- We use `aria-controls` to associate the button with the element whose ID is `navbar-menu`.
- We set `aria-expanded` to `"false"` by default, indicating that the menu is closed.

That's all that you need to create a semantic and accessible toggle button.

Let's now look at some of the CSS:

```css {data-file="style.css"}
#navbar-toggle {
  cursor: pointer;
  border: none;
  background-color: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
```

We reset some of the default button styles and give it fixed dimensions. It's also a flex container for centering.

Here's the CSS for the icon bars:

```css {data-file="style.css"}
.icon-bar {
  display: block;
  width: 25px;
  height: 4px;
  margin: 2px;
  background-color: var(--navbar-text-color);
}

#navbar-toggle:is(:focus, :hover) .icon-bar {
  background-color: var(--navbar-text-color-focus);
}
```

**Result**:

{% include img.html src: "./images/step5.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. A hamburger toggle button is visible in the center, with three horizontal bars stacked on top of each other with some spacing in between." %}

There are lots of ways to do this, but I think this is the most straightforward to understand. I'm sure you can take advantage of pseudo-elements instead or just [draw an SVG](/blog/svg-tutorial-how-to-code-svg-icons-by-hand/).

When the toggle button is clicked, we'll set `aria-expanded` to `"true"` on the button. Here's how we'll animate the hamburger icon to become a close icon (X):

```css {data-file="style.css"}
#navbar-toggle[aria-expanded='true'] .icon-bar:is(:first-child, :last-child) {
  position: absolute;
  margin: 0;
  width: 30px;
}

#navbar-toggle[aria-expanded='true'] .icon-bar:first-child {
  transform: rotate(45deg);
}

#navbar-toggle[aria-expanded='true'] .icon-bar:nth-child(2) {
  opacity: 0;
}

#navbar-toggle[aria-expanded='true'] .icon-bar:last-child {
  transform: rotate(-45deg);
}
```

The middle bar disappears, the top and bottom bars get centered, the top bar rotates 45 degrees clockwise, and the bottom bar rotates 45 degrees counter-clockwise.

### JavaScript for Toggling the Navbar Visibility

Now's a good time to code up the logic for toggling the navigation menu so we can test that the toggle button works. Ideally, you'd want to put this in a separate module to avoid leaking variables into the global scope, or wrap the whole thing in an immediately invoked function expression the old-fashioned way.

```javascript {data-file="index.js"}
const navbarToggle = navbar.querySelector('#navbar-toggle');
let isNavbarExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';

const toggleNavbarVisibility = () => {
  isNavbarExpanded = !isNavbarExpanded;
  navbarToggle.setAttribute('aria-expanded', isNavbarExpanded);
};

navbarToggle.addEventListener('click', toggleNavbarVisibility);
```

Now, I know what you're thinking:

> _"But Aleksandr, why not just use [the checkbox hack](https://css-tricks.com/the-checkbox-hack/) and avoid writing JavaScript altogether?"_

Because:

1. CSS is for styling. JavaScript is for interactivity.
2. Hacks are called _hacks_ for a reason. Use checkboxes for _forms_, not buttons.

At this point, you can open up your browser and test out the button. The menu itself is still not toggling its visibility, so let's fix that with CSS.

### Responsive Navbar Menu

As I mentioned earlier, the navigation menu wrapper has fixed positioning, with a `top` offset equal to precisely the height of the navbar itself:

```css {data-file="style.css"}
#navbar-menu {
  position: fixed;
  top: var(--navbar-height);
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  left: 0;
  right: 0;
}
```

**Result**:

{% include img.html src: "./images/step6.png", alt: "A black, horizontal navigation bar is positioned at the top of a blank white page. The only visible elements are the home link and a hamburger toggle button, positioned on opposite ends horizontally." %}

While `opacity: 0` and `visibility: hidden` may seem redundant, it's a good practice to apply both if you want to animate the menu's visibility later with the `transition` property. I've omitted transition styles from this tutorial, but you can add them if you'd like.

Below is the CSS for the menu's open state; we style it based on whether it's a sibling of the toggle button in the `aria-expanded="true"` state:

```css {data-file="style.css"}
#navbar-toggle[aria-expanded='true'] + #navbar-menu {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 1;
  visibility: visible;
}
```

Click the hamburger icon to see the following result:

{% include img.html src: "./images/step7.png", alt: "Navigation menu in its opened state, with links visible below the navigation bar against a semi-transparent background" %}

The container for the navigation links is an unordered list:

```css {data-file="style.css"}
.navbar-links {
  list-style: none;
  position: absolute;
  background-color: var(--navbar-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  right: 0;
  margin: 1.4rem;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

#navbar-toggle[aria-expanded='true'] + #navbar-menu .navbar-links {
  padding: 1em;
}
```

**Result**:

{% include img.html src: "./images/step8.png", alt: "Styled navigation link container, with a background color matching the main navigation bar." %}

This is the actual, physical "menu" part of our navigation. The margin ensures that the menu appears detached from the rest of the navbar, as if it's floating on the page. If instead you'd like it to appear as a physical extension of the navigation bar, simply get rid of the margin and border radius and shift the shadow down:

```css {data-file="style.css"}
.navbar-links {
  list-style: none;
  position: absolute;
  left: 0;
  right: 0;
  background-color: var(--navbar-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.3);
}
```

**Result**:

{% include img.html src: "./images/attached-menu.png", alt: "An attached navigation menu that's been opened, with links positioned immediately below the navigation bar itself." %}

And that's it for the mobile version's CSS!

One last thing before we style the desktop version. Add this to your JavaScript:

```javascript {data-file="index.js"}
const navbarMenu = document.querySelector('#navbar-menu');
const navbarLinksContainer = navbarMenu.querySelector('.navbar-links');

navbarLinksContainer.addEventListener('click', (e) => e.stopPropagation());
navbarMenu.addEventListener('click', toggleNavbarVisibility);
```

Basically, this allows the user to close the navigation menu by clicking on the `#navbar-menu` mask layer. But we need to stop click propagation so that any clicks on `.navbar-links` don't [bubble up](https://www.sitepoint.com/event-bubbling-javascript/) and trigger a close.

Go ahead and test this on your end to make sure the mobile version works.

## Responsive Navbar: Desktop Layout

I'll show the media query in its entirety and then we'll look at what each piece is doing:

```css {data-file="style.css"}
@media screen and (min-width: 700px) {
  #navbar-toggle,
  #navbar-toggle[aria-expanded='true'] {
    display: none;
  }

  #navbar-menu,
  #navbar-toggle[aria-expanded='true'] + #navbar-menu {
    visibility: visible;
    opacity: 1;
    position: static;
    display: block;
    height: 100%;
  }

  .navbar-links,
  #navbar-toggle[aria-expanded='true'] + #navbar-menu .navbar-links {
    margin: 0;
    padding: 0;
    box-shadow: none;
    position: static;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
}
```

So first up is this:

```css
#navbar-toggle {
  display: none;
}
```

**Result**:

{% include img.html src: "./images/step9.png", alt: "Styled navbar with no visible elements except for the home link and the logo." %}

We don't want the hamburger button to be visible on desktop, so we hide it with `display: none`.

Now we get to the most important part of making this navbar responsive:

```css
#navbar-menu,
#navbar-toggle[aria-expanded='true'] + #navbar-menu {
  visibility: visible;
  opacity: 1;
  position: static;
  display: block;
  height: 100%;
}
```

Whereas before the `#navbar-menu` wrapper was fixed in position, covering the entire screen, it's now static. This means it assumes its natural position in the DOM based on where it was defined in our HTML. In this case, that's after the home link (since the hamburger is now invisible).

And finally, `.navbar-links` now uses a flex direction of `row` instead of `column`, ensuring that the links appear side by side on the navbar:

```css
#navbar-toggle[aria-expanded='true'] + #navbar-menu .navbar-links {
  margin: 0;
  padding: 0;
  box-shadow: none;
  position: static;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
```

**Result**:

{% include img.html src: "./images/step10.png", alt: "Fully styled desktop version of the navbar, with links positioned in a horizontal layout towards the right-hand side." %}

We're officially done! But you may be wondering if there's room for customization—there sure is!

## Alternative Responsive Navbar Designs

For the purposes of this tutorial, I made lots of assumptions about the default state, appearance, and behavior of the navigation bar. In reality, what you'll want to do is use separate, specialized class names to customize this navbar to your liking.

Here's a codepen with options that you can toggle:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="WNQzawO" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar (Customizable)">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/WNQzawO">
  Responsive Navbar (Customizable)</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

The CSS now involves these classes, which get applied to `#navbar-menu`:

- `detached`: The default type of navigation menu.
- `attached`: The menu is an extension of the navigation bar.
- `sidebar left`: The menu opens as a sidebar from the left.
- `sidebar right`: The menu opens as a sidebar from the right.

## Final Thoughts

Creating responsive navbars in HTML isn't really all that difficult once you master basic positioning and Flexbox, as those two account for a majority of the CSS. The rest is just there to space the content and make things look pretty.

I hope you found this tutorial helpful!

<script defer src="https://static.codepen.io/assets/embed/ei.js"></script>
