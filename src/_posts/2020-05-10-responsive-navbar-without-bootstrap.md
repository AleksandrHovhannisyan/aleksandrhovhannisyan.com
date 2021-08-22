---
title: Creating a Responsive Navbar Without Bootstrap
description: Want to create a navbar that works on mobile and desktop? Ditch the frameworks—in this tutorial, we'll create a responsive navbar using HTML, CSS, and JS.
keywords: [responsive navbar]
categories: [html, css, javascript]
commentsId: 28
isPopular: true
lastUpdated: 2021-08-22
---

Navigation bars (also known as *navbars*) are practically everywhere on modern websites, so it's good to know how to create one by hand without relying on a component library that does all of the heavy lifting for you. But if you've never created a navbar from scratch, you may find it intimidating to get started.

For this reason, people often turn to CSS frameworks like Bootstrap to build navbars so that they don't have to reinvent the wheel. Yet what usually ends up happening is that you get lost in a sea of obscure class names and behavior that's difficult to customize. You waste many frustrating hours on StackOverflow when instead you could've simply built the thing by hand in less time.

In this tutorial, we'll create a responsive navbar that works on both mobile and desktop, using nothing but HTML, CSS, and JavaScript. That's right—no CSS frameworks needed! We'll also ensure that it remains accessible to users of assistive technologies.

{% include toc.md %}

## What We're Building

Here's the codepen for this tutorial:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="xxwWama" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/xxwWama">
  Responsive Navbar</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

There's actually not a lot of HTML involved! Navbars aren't all that difficult to create once you go through the process yourself.

We'll design this with a mobile-first approach and simply take care of the desktop case with a media query. Note that I'm not designing with any minimum device width in mind, but this works all the way down to `320px`, one of the narrowest mobile resolutions that you typically need to account for.

> **Note**: I'll also offer alternative design options wherever it's possible with just a few changes. For example, if you don't like the detached/floating navigation menu, I'll show you how to keep it attached or get it to behave like a sidebar.

## Responsive Navbar HTML

Below is all of the HTML that we're going to need to create our responsive navbar:

{% include codeHeader.html file: "index.html" %}

```html
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
        <button type="button" class="navbar-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="navbar-menu">
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

We're going to need two more files: `style.css` and `index.js`. Go ahead and create those before moving on. Note that you can place them under an assets folder if you'd like; just be sure to update the link and script in the above HTML to point to the correct files.

## How Does It Work?

Before I vomit a bunch of CSS on your screen and leave you clueless as to what's going on, let's take a closer look at the components that make up our navbar.

First up, we're using a `<header>` landmark element with an ID of `navbar` as the outermost parent:

{% include img.html src: "header.png", alt: "A header element" %}

Inside of that is a nested `<nav>` landmark element, which signals the start of a navigation menu to screen readers and browsers. This container's main purpose is to align the left and right ends of our navbar with the page's left and right margins. This assumes that the page content itself is also wrapped with a `.container` for horizontal centering.

{% include img.html src: "nav.png", alt: "A nav landmark element with left and right padding and auto margins" %}

As you may have probably guessed, this is a flex container. It has three children:

- `.home-link`: Anchor wrapped around the website logo and name.
- `.navbar-toggle`: The hamburger button used to toggle the navigation menu on mobile devices.
- `.navbar-menu`: The navigation menu wrapper, containing a list of links to our pages.

Let's take a closer look at that last element:

{% include img.html src: "navbar-menu.png", alt: "The navbar-menu fixed wrapper" %}

This wrapper is given a fixed position and covers the entire screen. It also has a semi-transparent background that elevates it visually above the main content of the page. In some UI libraries, this is known as a **mask layer**. It's a common approach used with things like modal windows and menus.

Within `.navbar-menu` is an unordered list with some padding, margins, and a box shadow:

{% include img.html src: "navbar-links.png", alt: "The navbar-links unordered list element" %}

And finally, that list houses the actual navigation links:

{% include img.html src: "navbar-link.png", alt: "A navigation bar link being inspected in Chrome dev tools" %}

That's it! When we hit the `700px` breakpoint, our media query kicks in and styles the desktop navbar. This media query was determined based on the number of navbar links in this particular setup. If you have more content, you may wish to adjust this breakpoint.

With all of this prep work out of the way, we're ready to begin creating our responsive navbar.

## Responsive Navbar CSS and JavaScript

We're going to take this slowly. I'll add explanations for each bit of CSS and JavaScript that I introduce so you understand what's going on. I'll also show screenshots with each major change we introduce.

First up are some standard CSS resets and base styling:

{% include codeHeader.html file: "style.css" %}

```css
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

{% include codeHeader.html file: "style.css" %}

```css
.container {
  max-width: 1000px;
  padding-left: 1.4rem;
  padding-right: 1.4rem;
  margin-left: auto;
  margin-right: auto;
}
```

This is a pretty popular approach for centering things horizontally in CSS. Basically, you can just slap a class name of `container` on anything that should be horizontally centered on the page. Here, the page is centered to a maximum width of `1000px`. If you'll recall, we applied this class to the `<nav>` element:

```html
<nav class="navbar-container container">...</nav>
```

Alright, time to actually style our responsive navbar. We'll work in a top-down fashion. First up is the outermost `#navbar` element:

{% include codeHeader.html file: "style.css" %}

```css
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

{% include img.html src: "step1.png", alt: "Styled navbar header element" %}

Why we need the CSS variable will become obvious later on. The entire element is given a fixed position so it sticks to the top of the page as the user scrolls. It's also given a slight box shadow. Don't worry about the fact that the links are currently overflowing their parent; we'll fix this soon enough.

Moving on, we have the nested container element:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
}
```

**Result**:

{% include img.html src: "step2.png", alt: "Styled navbar-container element" %}

As I mentioned earlier, this is simply a flex container. We use `justify-content: space-between` to position the home link and hamburger icon on opposite ends of the navbar. But right now, it's positioning all three children: the home link, the hamburger button, and the navigation links themselves; we'll fix this shortly.

Next up is some general styling for the navbar anchors:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-item {
  margin: 0.4em;
  width: 100%;
}

.home-link,
.navbar-link {
  color: var(--navbar-text-color);
  transition: color 0.2s ease-in-out;
  text-decoration: none;
  display: flex;
  font-weight: 400;
  align-items: center;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.home-link:focus,
.home-link:hover {
  color: var(--navbar-text-color-focus);
}

.navbar-link {
  justify-content: center;
  width: 100%;
  padding: 0.4em 0.8em;
  border-radius: 5px;
}

.navbar-link:focus,
.navbar-link:hover {
  color: var(--navbar-text-color-focus);
  background-color: var(--navbar-bg-contrast);
}
```

**Result**:

{% include img.html src: "step3.png", alt: "Styled anchor elements" %}

Pretty straightforward.

Here's the CSS for the website logo. Note that this is just a placeholder for my demo; in reality, you'll probably want to use an image or SVG:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-logo {
  background-color: var(--navbar-text-color-focus);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 0.5em;
}
```

**Result**:

{% include img.html src: "step4.png", alt: "Styled logo" %}

Time for the toggle button!

### Navbar Hamburger Icon

{% include codeHeader.html file: "style.css" %}

```css
.navbar-toggle {
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

Basically, we reset some of the default `<button>` styles and give the button fixed dimensions. It's also a flex container. Note that the actual bars of the hamburger icon are three `<span>`s:

```html
<button type="button" class="navbar-toggle" aria-label="Toggle menu" aria-expanded="false">
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
</button>
```

> **Note**: I'm not using `div`s because it's invalid HTML to put divs inside buttons.

Here's the CSS for that:

{% include codeHeader.html file: "style.css" %}

```css
.icon-bar {
  display: block;
  width: 25px;
  height: 4px;
  margin: 2px;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  background-color: var(--navbar-text-color);
}

.navbar-toggle:focus .icon-bar,
.navbar-toggle:hover .icon-bar {
  background-color: var(--navbar-text-color-focus);
}
```

**Result**:

{% include img.html src: "step5.png", alt: "Styled hamburger button" %}

There are lots of ways to do this, but I think this is the most straightforward to understand. I'm sure you can take advantage of pseudo-elements instead.

When the toggle button is clicked, we'll apply a class name of `.opened` to the navbar via JavaScript. Here's how we'll animate the hamburger icon to become a close icon (X):

{% include codeHeader.html file: "style.css" %}

```css
.navbar-toggle[aria-expanded='true'] .icon-bar:first-child,
.navbar-toggle[aria-expanded='true'] .icon-bar:last-child {
  position: absolute;
  margin: 0;
  width: 30px;
}

.navbar-toggle[aria-expanded='true'] .icon-bar:first-child {
  transform: rotate(45deg);
}

.navbar-toggle[aria-expanded='true'] .icon-bar:nth-child(2) {
  opacity: 0;
}

.navbar-toggle[aria-expanded='true'] .icon-bar:last-child {
  transform: rotate(-45deg);
}
```

Basically, the middle bar disappears, the top and bottom bars get centered, the top bar rotates 45 degrees clockwise, and the bottom bar rotates 45 degrees counter-clockwise.

### Toggling the Hamburger Icon

Now's a good time to code up the logic for toggling the navigation menu so we can test that the toggle button works:

{% include codeHeader.html file: "index.js" %}

```javascript
const navbar = document.getElementById('navbar');
const navbarToggle = navbar.querySelector('.navbar-toggle');

function openMobileNavbar() {
  navbar.classList.add('opened');
  navbarToggle.setAttribute('aria-expanded', 'true');
}

function closeMobileNavbar() {
  navbar.classList.remove('opened');
  navbarToggle.setAttribute('aria-expanded', 'false');
}

navbarToggle.addEventListener('click', () => {
  if (navbar.classList.contains('opened')) {
    closeMobileNavbar();
  } else {
    openMobileNavbar();
  }
});
```

Now, I know what you're thinking:

> *"But Aleksandr, why not just use [the checkbox hack](https://css-tricks.com/the-checkbox-hack/) and avoid writing JavaScript altogether?"*

Because:

1. CSS is for styling. JavaScript is for interactivity.
2. Hacks are called *hacks* for a reason. Use checkboxes for *forms*, not buttons.

We also take care of an accessibility issue here and set the [`aria-expanded`](https://www.w3.org/WAI/GL/wiki/Using_aria-expanded_to_indicate_the_state_of_a_collapsible_element) attribute to signal the menu's expanded or contracted state to screen readers. If the navigation menu is open, the user's screen reader will indicate that clicking the button again will close the menu. And vice versa.

At this point, you can hop on over to your browser and test that the button works. But the menu is still not functional, so let's fix that.

### Responsive Navbar Menu

As I mentioned earlier, the navigation menu wrapper has fixed positioning, with a `top` offset equal to precisely the height of the navbar itself:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-menu {
  position: fixed;
  top: var(--navbar-height);
  bottom: 0;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  opacity: 0;
  visibility: hidden;
  left: 0;
  right: 0;
}
```

**Result**:

{% include img.html src: "step6.png", alt: "Styled navbar-menu wrapper" %}

While `opacity: 0` and `visibility: hidden` may seem redundant, it's a good idea to animate both of these properties because `visibility` alone tends to snap/animate very rapidly, whereas `opacity` is more gradual.

Here's the code for the menu's opened state:

{% include codeHeader.html file: "style.css" %}

```css
#navbar.opened .navbar-menu {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 1;
  visibility: visible;
}
```

Click the hamburger icon to see the following result:

{% include img.html src: "step7.png", alt: "Navigation menu in its opened state, with links visible below the navigation bar" %}

The container for the navigation links is an unordered list:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-links {
  list-style-type: none;
  max-height: 0;
  overflow: hidden;
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

#navbar.opened .navbar-links {
  padding: 1em;
  max-height: none;
}
```

**Result**:

{% include img.html src: "step8.png", alt: "Styled navbar-links container" %}

This is the actual, physical "menu" part of our navigation. The margin ensures that the menu appears detached from the rest of the navbar, as if it's floating on the page. If instead you'd like it to appear as a physical extension of the navigation bar, simply get rid of the margin and border radius and shift the shadow down:

{% include codeHeader.html file: "style.css" %}

```css
.navbar-links {
  list-style-type: none;
  max-height: 0;
  overflow: hidden;
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

{% include img.html src: "attached-menu.png", alt: "An attached navigation menu that's been opened" %}

And that's it for the mobile version's CSS!

One last thing before we style the desktop version. Add this to your JavaScript:

{% include codeHeader.html file: "index.js" %}

```javascript
const navbarMenu = navbar.querySelector('.navbar-menu');
const navbarLinksContainer = navbar.querySelector('.navbar-links');

navbarLinksContainer.addEventListener('click', (clickEvent) => {
  clickEvent.stopPropagation();
});

navbarMenu.addEventListener('click', closeMobileNavbar);
```

Basically, this lets the user close the navigation menu when they click on `.navbar-menu`. But we need to stop click propagation so that any clicks on `.navbar-links` don't [bubble up](https://www.sitepoint.com/event-bubbling-javascript/) and trigger a close.

Go ahead and test this on your end to make sure the mobile version works.

## Responsive Navbar: Desktop Layout

I'll show the media query in its entirety and then we'll look at what each piece is doing:

{% include codeHeader.html file: "style.css" %}

```css
@media screen and (min-width: 700px) {
  .navbar-toggle {
    display: none;
  }

  #navbar .navbar-menu,
  #navbar.opened .navbar-menu {
    visibility: visible;
    opacity: 1;
    position: static;
    display: block;
    height: 100%;
  }

  #navbar .navbar-links,
  #navbar.opened .navbar-links {
    margin: 0;
    padding: 0;
    box-shadow: none;
    position: static;
    flex-direction: row;
    list-style-type: none;
    max-height: max-content;
    width: 100%;
    height: 100%;
  }

  #navbar .navbar-link:last-child {
    margin-right: 0;
  }
}
```

So first up is this:

```css
.navbar-toggle {
  display: none;
}
```

**Result**:

{% include img.html src: "step9.png", alt: "Hamburger menu button hidden" %}

We don't want the hamburger button to be visible on desktop, so we hide it with `display: none`.

Now we get to the most important part of making this navbar responsive:

```css
#navbar .navbar-menu,
#navbar.opened .navbar-menu {
  visibility: visible;
  opacity: 1;
  position: static;
  display: block;
  height: 100%;
}
```

Whereas before the `.navbar-menu` wrapper was fixed in position, covering the entire screen, it's now static. This means it assumes its natural position in the DOM based on where it was defined in our HTML. In this case, that's after the home link (since the hamburger is now invisible).

And finally, `.navbar-links` now uses a flex direction of `row` instead of `column`, ensuring that the links appear side by side on the navbar:

```css
#navbar .navbar-links,
#navbar.opened .navbar-links {
  margin: 0;
  padding: 0;
  box-shadow: none;
  position: static;
  flex-direction: row;
  list-style-type: none;
  max-height: max-content;
  width: 100%;
  height: 100%;
}
```

**Result**:

{% include img.html src: "step10.png", alt: "Fully styled desktop version of the navbar" %}

We're officially done! But you may be wondering if there's room for customization—there sure is!

## Alternative Responsive Navbar Designs

For the purposes of this tutorial, I made lots of assumptions about the default state, appearance, and behavior of the navigation bar. In reality, what you'll want to do is use separate, specialized class names to customize this navbar to your liking.

Here's a codepen with options that you can toggle:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="WNQzawO" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar (Customizable)">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/WNQzawO">
  Responsive Navbar (Customizable)</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

The CSS now involves these classes, which get applied to `.navbar-menu`:

- `detached`: The default type of navigation menu.
- `attached`: The menu is an extension of the navigation bar.
- `sidebar left`: The menu opens as a sidebar from the left.
- `sidebar right`: The menu opens as a sidebar from the right.

## Final Thoughts

Creating responsive navbars in HTML isn't really all that difficult once you master basic positioning and Flexbox, as those two account for a majority of the CSS. The rest is just there to space the content and make things look pretty.

I hope you found this tutorial helpful!

<script defer src="https://static.codepen.io/assets/embed/ei.js"></script>
