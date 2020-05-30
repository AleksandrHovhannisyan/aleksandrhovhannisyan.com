---
title: Create a Responsive Navbar Without Bootstrap
description: Want to create a navbar that works on mobile and desktop? Ditch the frameworks—in this tutorial, we'll create a responsive navbar using HTML, CSS, and JS.
keywords: [responsive navbar]
tags: [dev, frontend, html, css, javascript]
comments_id: 28
---

**Navigation bars** ("navbars") are everywhere on modern websites, so it's definitely good to know how to create one by hand without relying on a component library.

People often turn to CSS frameworks like Bootstrap to build navbars because they feel that this will save them time. Unfortunately, what usually ends up happening is that these developers get lost in a sea of obscure class names and behavior that's difficult to customize. They waste many frustrating hours on StackOverflow when instead they could've simply built the thing by hand in less time.

In this tutorial, we'll create a **responsive navbar** using nothing but HTML, CSS, and JavaScript. That's right—no frameworks needed :) It'll work on both mobile and desktop devices. Let's dig in!

{% include linkedHeading.html heading="What We're Building" level=2 %}

Here's the codepen for this tutorial:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="xxwWama" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/xxwWama">
  Responsive Navbar</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

You may be surprised to learn that there's actually not a lot of HTML involved. Navigation bars aren't really all that difficult to create once you go through the process yourself.

Here's a GIF demonstrating the responsive navbar states and behavior:

{% include picture.html img="demo" ext="GIF" alt="A responsive navbar" shadow=false %}

We'll design this with a mobile-first approach and simply take care of the desktop case with a media query. Note that I'm not designing with any minimum device width in mind, but this works all the way down to `320px`, one of the narrowest mobile resolutions that you typically need to account for.

> **Note**: I'll also offer alternative design options wherever it's possible with just a few changes. For example, if you don't like the detached/floating navigation menu, I'll show you how to keep it attached or get it to behave like a sidebar.

{% include linkedHeading.html heading="Responsive Navbar HTML" level=2 %}

Below is all of the HTML that we're going to need to create our responsive navbar, complete with semantic and legible markup and none of that Bootstrap nonsense:

{% capture code %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Navbar</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <header id="topnav">
        <nav class="nav-container container">
          <a href="/" class="home-link">
            <div class="logo"></div>
          </a>
          <button type="button" class="menu-toggle" aria-label="Open navigation menu">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
          </button>
          <div class="nav-menu">
            <ul class="nav-links">
              <li class="nav-link"><a href="/about">About</a></li>
              <li class="nav-link"><a href="/blog">Blog</a></li>
              <li class="nav-link"><a href="/careers">Careers</a></li>
              <li class="nav-link"><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </nav>
    </header>
    <script src="index.js"></script>
</body>
</html>{% endcapture %}
{% include code.html file="index.html" code=code lang="html" %}

We're going to need two more files: `style.css` and `index.js`. Go ahead and create those before moving on. Note that you can place them under an assets folder if you'd like; just be sure to update the link and script in the above HTML to point to the correct files.

{% include linkedHeading.html heading="How Does It Work?" level=2 %}

Before I vomit a bunch of CSS on your screen and leave you clueless as to what's going on, it's worth taking a closer look at the components at play here.

First up, we're using a `header` landmark element with an ID of `topnav`:

{% include picture.html img="header" ext="PNG" alt="A header element" shadow=false %}

Inside of that is a nested `nav` landmark element, which signals the start of a navigation menu to screen readers and browsers. This container/wrapper element ensures that the contents of our navbar are horizontally aligned with whatever content is on the page itself, so long as that content is also wrapped in a `container`:

{% include picture.html img="nav" ext="PNG" alt="A nav landmark element with left and right padding and auto margins" shadow=false %}

As you may have probably guessed, this is a flex container; it has three children:

- `.home-link`: Anchor wrapped around the website logo and name.
- `.menu-toggle`: The hamburger button used to toggle the navigation menu on mobile devices.
- `.nav-menu`: The navigation menu wrapper, containing a list of links to our pages.

Let's take a closer look at that last element:

{% include picture.html img="nav-menu" ext="PNG" alt="The nav-menu fixed wrapper" shadow=false %}

This wrapper is given a fixed position and covers the entire screen. It also has a semi-transparent background that elevates it visually above the main content of the page.

Within that is an unordered list with some padding, margins, and a box shadow:

{% include picture.html img="nav-links" ext="PNG" alt="The nav-links unordered list element" shadow=false %}

In the demo, you may have noticed that users can close the navigation menu not only by clicking the X icon but also by clicking off to the side. The code for that is actually very simple, as we'll see later.

That's it! When we hit the `700px` breakpoint, our media query kicks in and styles the desktop navbar.

With all of these insights, we're ready to begin creating our responsive navbar.

{% include linkedHeading.html heading="Responsive Navbar CSS and JavaScript" level=2 %}

We're going to take this slowly. I'll add explanations for each bit of CSS and JavaScript that I introduce so you understand what's going on. I'll also show screenshots with each major change we introduce.

First up are some standard CSS resets and base styling:

{% capture code %}:root {
    --nav-bg-color: hsl(0, 0%, 20%);
    --nav-text-color: hsl(0, 0%, 80%);
    --nav-text-color-emphasis: white;
    --nav-bg-contrast: hsl(0, 0%, 30%);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 18px;
}

body {
    height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

The variables up at the top will help us avoid copy-pasting colors in our CSS. We reset paddings and margins and use `box-sizing: border-box` to ensure that widths/heights take border and padding into account. Finally, we set the base font size to `18px` and ensure that the body takes up the entire vertical height of the device with `height: 100vh`.

Before we look a the CSS specific to the responsive navbar, I'd like to introduce one more selector:

{% capture code %}.container {
    max-width: 1000px;
    padding-left: 1.4rem;
    padding-right: 1.4rem;
    margin-left: auto;
    margin-right: auto;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Basically, you can just slap a class name of `container` on anything that should be horizontally centered on the page. Here, the page is centered to a maximum width of `1000px`. If you'll recall, we applied this to the `nav` wrapper element:

```html
<nav class="nav-container container">...</nav>
```

Alright, time to actually style our responsive navbar. We'll work in a top-down fashion. First up is the outermost `#topnav` element:

{% capture code %}#topnav {
    --topnav-height: 64px;
    position: fixed;
    height: var(--topnav-height);
    background-color: hsl(0, 0%, 20%);
    left: 0;
    right: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step1" ext="PNG" alt="Styled topnav header element" shadow=false %}

Why we need the CSS variable will become obvious later on. The entire element is given a fixed position so it sticks to the top of the page as the user scrolls. It's also given a slight box shadow. Don't worry about the fact that the links are currently overflowing their parent; we'll fix this soon enough.

Moving on, we have the nested container element:

{% capture code %}.nav-container {
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items: center;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step2" ext="PNG" alt="Styled nav-container element" shadow=false %}

As I mentioned earlier, this is simply a flex container. We use `justify-content: space-between` to position the home link and hamburger icon on opposite ends of the navbar. But right now, it's positioning all three children: the home link, the hamburger button, and the navigation links themselves; we'll fix this shortly.

Next up is some general styling for anchors:

{% capture code %}#topnav a {
    color: var(--nav-text-color);
    transition: color 0.2s ease-in-out;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

#topnav a:focus,
#topnav a:hover {
    color: var(--nav-text-color-emphasis);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step3" ext="PNG" alt="Styled anchor elements" shadow=false %}

Pretty straightforward. The links themselves are flex containers.

Here's the logo styling (this is just a placeholder for my demo—you'll want to use an image or SVG):

{% capture code %}#topnav .logo {
    background-color: var(--nav-text-color-emphasis);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 0.5em;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step4" ext="PNG" alt="Styled logo" shadow=false %}

Time for the toggle button.

{% include linkedHeading.html heading="Navbar Hamburger Icon" level=3 %}

{% capture code %}#topnav .menu-toggle {
    cursor: pointer;
    border: none;
    background-color: transparent;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Basically, we reset some of the default `button` styles and give the button fixed dimensions. It's also a flex container. Note that the actual bars of the hamburger icon are three `span`s:

```html
<button type="button" class="menu-toggle" aria-label="Open navigation menu">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
</button>
```

I'm not using `div`s because it's invalid HTML to put divs inside buttons. Here's the CSS:

{% capture code %}.icon-bar {
    display: block;
    width: 25px;
    height: 4px;
    margin: 2px;
    transition: background-color 0.2s ease-in-out,
                transform 0.2s ease-in-out,
                opacity 0.2s ease-in-out;
    background-color: var(--nav-text-color);
}

#topnav .menu-toggle:focus .icon-bar,
#topnav .menu-toggle:hover .icon-bar {
    background-color: var(--nav-text-color-emphasis);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step5" ext="PNG" alt="Styled hamburger button" shadow=false %}

There are lots of ways to do this, but I think this is the most straightforward to understand. I'm sure you can take advantage of pseudo-elements instead. But this works just fine, so we'll leave it at that.

When the button is clicked, we'll apply a class name to `#topnav` in our JavaScript. Here's how we'll animate the hamburger icon to become a close icon (X):

{% capture code %}#topnav.opened .menu-toggle .icon-bar:first-child,
#topnav.opened .menu-toggle .icon-bar:last-child {
    position: absolute;
    margin: 0;
    width: 30px;
}

#topnav.opened .menu-toggle .icon-bar:first-child {
    transform: rotate(45deg);
}

#topnav.opened .menu-toggle .icon-bar:nth-child(2) {
    opacity: 0;
}

#topnav.opened .menu-toggle .icon-bar:last-child {
    transform: rotate(-45deg);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Basically, the middle bar disappears, the top and bottom bars get absolute positioning at the center of the button, the top bar rotates 45 degrees clockwise, and the bottom bar rotates 45 degrees counter-clockwise.

{% include linkedHeading.html heading="Toggling the Hamburger Icon" level=3 %}

Now's a good time to code up the logic for toggling the navigation menu:

{% capture code %}const topnav = document.getElementById("topnav");
const topnavToggle = topnav.querySelector(".menu-toggle");

function openMobileNavbar() {
  topnav.classList.add("opened");
  topnavToggle.setAttribute("aria-label", "Close navigation menu.");
}

function closeMobileNavbar() {
  topnav.classList.remove("opened");
  topnavToggle.setAttribute("aria-label", "Open navigation menu.");
}

topnavToggle.addEventListener("click", () => {
  if (topnav.classList.contains("opened")) {
    closeMobileNavbar();
  } else {
    openMobileNavbar();
  }
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

Now, I know what you're thinking:

> *"But Aleksandr, why not just use [the checkbox hack](https://css-tricks.com/the-checkbox-hack/) and avoid writing JavaScript altogether?"*

Because:

1. CSS is for styling. JavaScript is for interactivity.
2. Hacks are called *hacks* for a reason. Use checkboxes for *forms*, not buttons.

We also take care of an accessibility issue here and apply a different `aria-label` depending on the current state of the button. If the navigation menu is open, the user's screen reader will indicate that clicking the button again will close the menu. And vice versa.

At this point, you can hop on over to your browser and test that the button works.

{% include picture.html img="button" ext="GIF" alt="Toggling the navigation menu button" shadow=false %}

The menu, of course, is still not functional. Let's fix that!

{% include linkedHeading.html heading="Responsive Navbar Menu" level=3 %}

As I mentioned earlier, the navigation menu wrapper has fixed positioning, with a `top` offset equal to precisely the height of the navbar itself:

{% capture code %}.nav-menu {
    position: fixed;
    top: var(--topnav-height);
    right: 0;
    bottom: 0;
    left: 0;
    transition: all 0.2s ease-in-out;
    opacity: 0;
    visibility: hidden;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step6" ext="PNG" alt="Styled nav-menu wrapper" shadow=false %}

While `opacity: 0` and `visibility: hidden` may seem redundant, it's a good idea to animate both of these properties because `visibility` alone tends to snap/animate very rapidly, whereas `opacity` is more gradual.

Here's its opened state:

{% capture code %}#topnav.opened .nav-menu {
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 1;
    visibility: visible;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Click the hamburger icon to see the following result:

{% include picture.html img="step7" ext="PNG" alt="Navigation menu in its opened state, with links visible below the navigation bar" shadow=false %}

The container for the navigation links is an unordered list:

{% capture code %}.nav-links {
    list-style-type: none;
    max-height: 0;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--nav-bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1.4rem;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

#topnav.opened .nav-links {
    padding: 1em;
    max-height: none;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step8" ext="PNG" alt="Styled nav-links container" shadow=false %}

This is the actual, physical "menu" part of our navigation. The margin ensures that the menu appears detached from the rest of the navbar, as if it's floating on the page. If instead you'd like it to appear as a physical extension of the navigation bar, simply get rid of the margin and border radius and shift the shadow down:

{% capture code %}.nav-links {
    list-style-type: none;
    max-height: 0;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--nav-bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 20px 20px rgba(0, 0, 0, 0.3);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="attached-menu" ext="PNG" alt="An attached navigation menu that's been opened" shadow=false %}

Finally, here's the CSS for all of the navbar links:

{% capture code %}.nav-link {
    margin: 0.4em;
    width: 100%;
}

.nav-link a {    
    width: 100%;
    font-weight: 400;
    padding: 0.4em 0.8em;
    border-radius: 5px;
    transition: background-color 0.2s ease-in-out,
                color 0.2s ease-in-out;
}

.nav-link a:focus,
.nav-link a:hover {
    background-color: var(--nav-bg-contrast);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

**Result**:

{% include picture.html img="step9" ext="PNG" alt="Styled anchor links" shadow=false %}

And that's it for the mobile version's CSS!

One last thing before we style the desktop version. Add this to your JavaScript:

{% capture code %}const topnavMenu = topnav.querySelector(".nav-menu");
const topnavLinks = topnav.querySelector(".nav-links");

topnavLinks.addEventListener("click", (clickEvent) => {
  clickEvent.stopPropagation();
});

topnavMenu.addEventListener("click", closeMobileNavbar);
{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

Basically, this lets the user close the navigation menu when they click on `.nav-menu`. But we need to stop click propagation so that any clicks on `.nav-links` don't [bubble up](https://www.sitepoint.com/event-bubbling-javascript/) and trigger a close.

Go ahead and test this on your end to make sure the mobile version works.

{% include linkedHeading.html heading="Responsive Navbar: Desktop Layout" level=2 %}

I'll show the media query in its entirety and then we'll look at what each piece is doing:

{% capture code %}@media screen and (min-width: 700px) {
    #topnav .menu-toggle {
        display: none;
    }
    
    #topnav .nav-menu,
    #topnav.opened .nav-menu {
        all: unset;
        position: static;
        display: block;
        height: 100%;
    }

    #topnav .nav-links,
    #topnav.opened .nav-links {
        all: unset;
        list-style-type: none;
        display: flex;
        flex-direction: row;
        max-height: max-content;
        width: 100%;
        height: 100%;
        align-items: center;
        padding: 0;
    }

    #topnav .nav-link:last-child {
        margin-right: 0;
    }
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

So first up is this:

```css
 #topnav .menu-toggle {
    display: none;
}
```

**Result**:

{% include picture.html img="step10" ext="PNG" alt="Hamburger menu button hidden" shadow=false %}

Obviously, we don't want the hamburger button to be visible on desktop, so we remove it altogether.

Now we get to the most important part of making this navbar responsive:

```css
#topnav .nav-menu,
#topnav.opened .nav-menu {
    all: unset;
    position: static;
    display: block;
    height: 100%;
}
```

Whereas before the `.nav-menu` wrapper was fixed in position, covering the entire screen, it's now static. This means it assumes its natural position in the DOM based on where it was defined in our HTML. In this case, that's after the home link (since the hamburger is now invisible). `all: unset` is a simple way to reset all of the styles on the element so we don't have to reset them by hand.

And finally, `.nav-links` now uses a flex direction of `row` instead of `column`, ensuring that the links appear side by side on the navbar:

```css
#topnav .nav-links,
#topnav.opened .nav-links {
    all: unset;
    list-style-type: none;
    display: flex;
    flex-direction: row;
    max-height: max-content;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 0;
}
```

**Result**:

{% include picture.html img="step11" ext="PNG" alt="Fully styled desktop version of the navbar" shadow=false %}

We're officially done! But you may be wondering if there's room for customization—there sure is!

{% include linkedHeading.html heading="Alternative Responsive Navbar Designs" level=2 %}

For the purposes of this tutorial, I made lots of assumptions about the default state, appearance, and behavior of the navigation bar. In reality, what you'll want to do is use separate, specialized class names to customize this navbar to your liking.

Here's a codepen with options that you can toggle:

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="html,result" data-user="AleksandrHovhannisyan" data-slug-hash="WNQzawO" data-preview="true" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Navbar (Customizable)">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/WNQzawO">
  Responsive Navbar (Customizable)</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The CSS now involves these classes, which get applied to `.nav-menu`:

- `detached`: The default type of navigation menu.
- `attached`: The menu is an extension of the navigation bar.
- `sidebar left`: The menu opens as a sidebar from the left.
- `sidebar right`: The menu opens as a sidebar from the right.

{% include linkedHeading.html heading="That's It!" level=2 %}

Creating responsive navbars in HTML isn't really all that difficult once you master basic positioning and Flexbox, as those two account for a majority of the CSS. The rest is just there to space the content and make things look pretty.

I hope you found this tutorial helpful!
