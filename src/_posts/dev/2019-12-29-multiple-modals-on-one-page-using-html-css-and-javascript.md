---
title: Multiple Modals on One Page Using HTML, CSS, and JavaScript
description: Learn how to create modal windows in HTML using just a bit of HTML, CSS, and JavaScript. We'll look at how you can open multiple modals on one page, either stacked on top of each other or side by side.
keywords: [multiple modals on one page, two modals on the same page, how to create modal windows in html]
tags: [dev, html, css, javascript]
last_updated: 2020-09-07
comments_id: 31
is_popular: true
---

> **09/07/2020**: Consider whether this is something you really want to do. Opening multiple modals on one page isn't great for accessibility or your user experience.

This tutorial shows you how to create multiple modals on one page using nothing but HTML, CSS, and JavaScript. We'll look at two versions; the first is stacking multiple modals on top of one another:

{% include picture.html img="demo.gif" alt="A demo of opening and closing stacked modals." %}

The second is opening multiple modals on one page side by side:

{% include picture.html img="side-by-side-demo.gif" alt="A demo of opening and closing side-by-side modals." %}

They'll share some of the same underlying structure and logic, but I've split them into separate sections to make it easier for you to find what you're looking for.

Each one will include a CodePen demo with the full source code. The examples will show me opening just two modals on the same page to keep things simple, but you can still open more with the same code.

{% include toc.md %}

## Shared Code for Modals (Stacked + Side by Side)

Here's the basic HTML skeleton that we need for our page:

{% capture code %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css" />
    <title>Modal Demo</title>
</head>
<body>
    <script src="index.js"></script>
</body>
</html>{% endcapture %}
{% include code.html file="index.html" code=code lang="html" %}

Go ahead and create `style.css` along with `index.js` while you're at it.

And here's some CSS to get us started:

{% capture code %}* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial;
    font-size: 18px;
}

p {
    margin-bottom: 1em;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Note that these styles are not necessary; they just make my demos look nicer.

Now, let's take a look at what constitutes a "modal." In our case, a modal window will consist of the following:

- `.modal-wrapper`, which has a semi-transparent background to create a sense of depth.
- `.modal-window`, containing all of the modal's actual contents (header and body).
- `.modal-header`, containing a title and the X button to close out of the modal window.

Let's add two modals to our HTML:

{% capture code %}<p>Lorem ipsum. <a href="#" class="modal-trigger" data-modal-id="modal1">Click this trigger</a> to open a modal.</p>
<p>Close a modal by clicking off to the side, clicking the X, or pressing Escape.</p>

<div class="modal-wrapper" id="modal1">
    <section class="modal-window">
        <header class="modal-header">
            <h3>Title goes here...</h3>
            <button type="button" class="close-modal-button" aria-label="Close modal window">X</button>
        </header>
        <p>Congrats, you've opened a modal!</p>
        <p>Now open <a href="#" class="modal-trigger" data-modal-id="modal2">another modal</a>!</p>
    </section>
</div>

<div class="modal-wrapper" id="modal2">
    <section class="modal-window">
        <header class="modal-header">
            <h3>Modalception 🤯</h3>
            <button type="button" class="close-modal-button" aria-label="Close modal window">X</button>
        </header>
        <p>Noice.</p>
    </section>
</div>{% endcapture %}
{% include code.html file="index.html" code=code lang="html" %}

We also need a way to open modals on our page. We'll do that with a `modal-trigger`:

```html
<p>Lorem ipsum. <a href="#" class="modal-trigger" data-modal-id="modal1">Click this trigger</a> to open a modal.</p>
```

A trigger can be any interactive element on your page, such as an anchor, as long as it has two things:

- A class of `modal-trigger`.
- A `data-modal-id` attribute specifying the ID of the modal to open.

In the example above, our trigger is associated with the modal wrapper that has the ID of `modal1`. When this trigger is clicked, we'll want to open up `modal1`. We'll look at the logic behind this when we get to the JavaScript. For now, just know that we have two things: modals and modal triggers.

### Styling Our Modal Windows

I'm going to break this up into manageable chunks. First up is the modal wrapper:

{% capture code %}.modal-wrapper {
    align-items: center;
    background-color: rgba(100, 100, 100, 0.5);
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: fixed;
    right: 0;
    transition: all 0.2s ease-in-out;
    visibility: hidden;
    width: 100%;
    z-index: 1000;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

This one's pretty straightforward. The modal wrapper is given a `fixed` position and covers the entire screen. It's also given a slightly opaque background for a nice shadow effect when the modal is open. The `z-index` is set to an arbitrarily large number (in this case, `1000`) to ensure that it appears above everything else. Finally, the modal uses Flexbox to perfectly center its contents.

As you can see, the modal wrapper is hidden by default with `opacity: 0` and `visibility: hidden`. We'll toggle the visibility in our JavaScript. Here's the class that we'll need to do that:

{% capture code %}.modal-wrapper.visible {
    opacity: 1;
    visibility: visible;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

> **Note**: I'm using the `opacity` + `visibility` trick here since visibility transitions aren't gradual and immediately snap from one state to another. Take a look at [this StackOverflow answer](https://stackoverflow.com/a/27900094/5323344) for more details.

Okay, that's it for the wrapper. What about the modal window itself?

{% capture code %}.modal-window {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    padding: 20px;
    transform: scale(0);
    transition: 0.2s ease-in-out all;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Notice that the initial transform is set to `scale(0)`. When we open the modal, we want to scale it up to give us a nice pop-in animation:

{% capture code %}.modal-wrapper.visible .modal-window {
    transform: scale(1);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Next up is the modal header:

{% capture code %}.modal-header {
    align-items: center;
    border-bottom: 2px solid black;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
}

.close-modal-button {
    border: none;
    background-color: transparent;
    color: rgb(112, 112, 112);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.2em;
}

.close-modal-button:hover {
    color: black;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Finally, we'll style the triggers:

{% capture code %}.modal-trigger {
    color: rgb(10, 47, 255);
    cursor: pointer;
    text-decoration: underline;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

That's it for now. You can temporarily make `modal1` visible by manually adding `visible` to its class list. Here's what that will look like:

{% include picture.html img="modal.png" alt="One of the modals we created, with its slightly opaque background." %}

From here, things start to diverge depending on what whether you want to open multiple modals stacked on top of each other or side by side. We'll look at both versions.

## Multiple Modals on One Page (Stacked)

Here's the CodePen for this section, if you'd like to test the result and take a peek at the code:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="AleksandrHovhannisyan" data-slug-hash="wvBqRYL" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Demo: Multiple Modals on One Page">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/wvBqRYL">
  Demo: Multiple Modals on One Page</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

In this example, we have two modals on the same page, one stacked on top of the other. When you open the second modal, the background dims even more than before, signaling that an additional "layer" has been stacked on the UI.

> **Note**: The order in which the modal windows are defined in your HTML does matter! For a modal window to appear on top of another one, it will need to come later in the HTML relative to the "bottom" modal.

Let's get to work!

### Stack 'Em Up

The most natural way to represent stacked modals in code is—surprise, surprise—with a stack:

{% capture code %}const currentlyOpenModals = [];{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

The topmost modal window is whatever we recently pushed onto the stack; that's the window that's eligible for closing.

We'll also add a helper function that tells us if we have no modals open:

{% capture code %}const noModalsOpen = () => !currentlyOpenModals.length;{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

This is just to reduce code repetition later on.

### Opening and Closing Stacked Modals

Let's code up the logic for opening and closing stacked modals:

{% capture code %}const openModal = modalId => {
  const modalWrapper = document.getElementById(modalId);
  modalWrapper.classList.add("visible");
  currentlyOpenModals.push(modalWrapper);
};

// By definition, it's always the topmost modal that will be closed first
const closeTopmostModal = () => {
  if (noModalsOpen()) {
    return;
  }

  const modalWrapper = currentlyOpenModals[currentlyOpenModals.length - 1];
  modalWrapper.classList.remove("visible");
  currentlyOpenModals.pop();
};{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

The code is pretty simple—to open a modal, we take an ID, find the modal wrapper with that ID, give it the `visible` class, and push it to our stack of open modals. To close a modal wrapper, we do the opposite: We remove the class and pop the stack.

### Creating Event Listeners for Our Stacked Modals

We'll need to do the following:

1. Open a modal when its trigger is clicked.
2. Close the topmost modal when the user clicks off to the side.
3. Close a modal when the user clicks the X button.
4. Close the topmost modal when the user presses the Escape key.

Let's knock these out one at a time.

#### 1. Opening a Modal When Its Trigger Is Clicked

{% capture code %}const modalTriggers = document.querySelectorAll(".modal-trigger");
modalTriggers.forEach(modalTrigger => {
  modalTrigger.addEventListener("click", clickEvent => {
    const trigger = clickEvent.target;
    const modalId = trigger.getAttribute("data-modal-id");
    openModal(modalId);
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

Basically, we query all modal triggers and subscribe to their clicks. Given a click event, we get the trigger element by following `clickEvent.target`. This allows us to extract the `data-modal-id` attribute and open up that particular modal wrapper.

#### 2. Closing a Stacked Modal by Clicking Off to the Side

This is where it gets interesting:

{% capture code %}document.querySelectorAll(".modal-window").forEach(modal => {
  modal.addEventListener("click", clickEvent => {
    clickEvent.stopPropagation();
  });
});

const modalWrappers = document.querySelectorAll(".modal-wrapper");
modalWrappers.forEach(modalWrapper => {
  modalWrapper.addEventListener("click", () => {
    closeTopmostModal();
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

If we don't stop the event propagation for each `modal-window` element, the modal wrappers will close if we click just the content area, and that's not what we want. So, we disable propagation for the content area. Next, we simply subscribe to the click event for each `modal-wrapper` and close the topmost modal whenever the event fires.

#### 3. Closing a Stacked Modal with the X Button

By definition, we can only ever click the X button for the topmost modal window. Thus, we don't have to check which modal window the button belongs to—we can safely assume that it belongs to the topmost modal and just close that window.

{% capture code %}document.querySelectorAll(".close-modal-button").forEach(closeModalButton => {
  closeModalButton.addEventListener("click", () => {
    closeTopmostModal();
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

#### 4. Closing a Stacked Modal with the Escape Key

{% capture code %}document.body.addEventListener("keyup", keyEvent => {
  if (keyEvent.key === "Escape") {
    closeTopmostModal();
  }
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

That's it for the code to open multiple modals stacked on top of one another. Check out the Codepen link for the relevant HTML, CSS, and JavaScript all in one place.

## Multiple Modals on One Page (Side by Side)

Okay, so we saw how we can open two modals on the same page that are stacked on top of one another. This works because each modal has a wrapper element that gives it an increasing sense of elevation above the modal underneath (thanks to the alpha channel on each wrapper's background color).

Now, we want to open multiple modals on one page *side by side* instead of stacking them on top of one another:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="AleksandrHovhannisyan" data-slug-hash="RwPYWWB" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Demo: Multiple Modals on One Page (Side by Side)">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/RwPYWWB">
  Demo: Multiple Modals on One Page (Side by Side)</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

Some things will need to change in order for this to work.

First, we will no longer nest each modal inside a `.modal-wrapper`. Instead, we'll have a single wrapper (container) that houses all of the modals:

{% capture code %}<p>Lorem ipsum. <a href="#" class="modal-trigger" data-modal-id="modal1">Click this trigger</a> to open a modal.</p>
<p>Close a modal by clicking off to the side, clicking the X, or pressing Escape.</p>

<div class="modal-wrapper">
    <section class="modal-window" id="modal1">
        <header class="modal-header">
            <h3>Title goes here...</h3>
            <button type="button" class="close-modal-button" aria-label="Close modal window">X</button>
        </header>
        <p>Congrats, you've opened a modal!</p>
        <p>Now open <a href="#" class="modal-trigger" data-modal-id="modal2">another modal</a>!</p>
    </section>
    <section class="modal-window" id="modal2">
        <header class="modal-header">
            <h3>Modalception 🤯</h3>
            <button type="button" class="close-modal-button" aria-label="Close modal window">X</button>
        </header>
        <p>Noice.</p>
    </section>
</div>{% endcapture %}
{% include code.html file="index.html" code=code lang="html" %}

When we open the very first modal, we'll make the wrapper visible. When we close the very last modal, we'll make the wrapper disappear. This will give us the appearance of each modal "sharing" a single semi-transparent background that's elevated above the page.

Additionally, because of this change, the modal IDs will now need to belong to each `.modal-window`, not to their wrappers:

```html
<section class="modal-window" id="modal1">
  <!-- Content here -->
</section>
```

Only three lines will need to change in our CSS. Here's a diff between the two versions:

{% include picture.html img="diff.png" alt="New lines of code added." %}

And here's the new CSS if you want to copy it over and replace what you had before:

{% capture code %}.modal-window {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    padding: 20px;
    transform: scale(0);
    transition: 0.2s ease-in-out all;
    position: absolute;
    margin: 1em;
}

.modal-window.visible {
    transform: scale(1);
    position: relative;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Finally, the JavaScript logic will be a little different for opening and closing modals.

Perhaps the most important change is that we're **no longer going to use a stack data structure**. That made sense for stacked modals, but it won't for modals that need to be open side by side, without any relative hierarchy*. Instead, we'll use an object to associate IDs with modal elements:

{% capture code %}let currentlyOpenModals = {};
const noModalsOpen = () => !Object.keys(currentlyOpenModals).length;{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

> *You may still want to establish some sort of dependency relationship between modals that opened other modals. That way, if you close the parent modal, its children would close as well. We won't look at that in this tutorial, but it's something to keep in mind.

We'll also want to get a reference to the single `.modal-wrapper` at the top of our script:

{% capture code %}const modalWrapper = document.querySelector(".modal-wrapper");{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

We'll still need to do all of the following, but with slight differences:

1. Open a modal when its trigger is clicked.
2. Close a modal when the user clicks its X button.
3. Close all modals when the user clicks off to the side.
4. Close all modals when the user presses the Escape key.

Let's knock these out one at a time, just like we did before.

### 1. Opening a Modal When Its Trigger Is Clicked

The code for subscribing to trigger clicks hasn't changed:

{% capture code %}const modalTriggers = document.querySelectorAll(".modal-trigger");
modalTriggers.forEach(modalTrigger => {
  modalTrigger.addEventListener("click", clickEvent => {
    const trigger = clickEvent.target;
    const modalId = trigger.getAttribute("data-modal-id");
    openModal(modalId);
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

What *does* need to change is the code for `openModal`:

{% capture code %}const openModal = modalId => {
  // If we're opening the first modal, make sure the wrapper becomes visible too
  if (noModalsOpen()) {
    modalWrapper.classList.add("visible");
  }

  const modal = document.getElementById(modalId);
  modal.classList.add("visible");
  currentlyOpenModals[modalId] = modal;
};{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

Notice that we check if we're opening a modal for the first time at the top. If that's the case, then we also make sure that the wrapper becomes visible.

Since we're using an associative data structure now instead of a stack, we'll hash into it with the modal ID that we were provided. Since it's assumed that you don't have any duplicate IDs on your page, each entry in this object will have a unique key used to identify a particular modal window.

### 2. Closing a Particular Modal with Its X Button

Since we're no longer working with stacked modals, there is no notion of the "topmost" modal. Instead, our `closeModal` function will now need to accept an ID to find the right modal to close.

First, here's the new `closeModal` code:

{% capture code %}const closeModal = modalId => {
  if (noModalsOpen()) {
    return;
  }

  const modal = currentlyOpenModals[modalId];
  modal.classList.remove("visible");
  delete currentlyOpenModals[modalId];

  // If we closed the last open modal, hide the wrapper
  if (noModalsOpen()) {
    modalWrapper.classList.remove("visible");
  }
};{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

And here's the code for closing a modal window with the X button:

{% capture code %}document.querySelectorAll(".close-modal-button").forEach(closeModalButton => {
  closeModalButton.addEventListener("click", clickEvent => {
    const modalToClose = clickEvent.target.closest(".modal-window");
    closeModal(modalToClose.id);
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

We use the DOM's `closest` method to figure out which modal the clicked close button belongs to. Then, we get that modal's ID and close it.

### 3. Closing All Modals by Clicking Off to the Side

Just like before, we'll stop click propagation whenever we click on the modal window itself:

{% capture code %}document.querySelectorAll(".modal-window").forEach(modal => {
  modal.addEventListener("click", clickEvent => {
    clickEvent.stopPropagation();
  });
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

But we'll need to add a click listener to the single `.modal-wrapper` for when we click off to the side:

{% capture code %}modalWrapper.addEventListener("click", () => {
  closeAllModals();
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

Notice that we're now calling a new function named `closeAllModals`, but we haven't yet implemented that. Let's define it somewhere at the top of our script, preferably under `closeModal` to keep things organized:

{% capture code %}const closeAllModals = () => {
  // Iterate over the IDs in our map and close each modal with that ID
  Object.keys(currentlyOpenModals).forEach(closeModal);
};{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

What's going on here? Well, `Object.keys(currentlyOpenModals)` gives us an array of modal IDs. For example, suppose `currentlyOpenModals` looks like this:

```javascript
{
  "modal1": ...,
  "modal2": ...,
  "modal9000": ...,
}
```

If that's the case, then `Object.keys(currentlyOpenModals)` will return `["modal1", "modal2", "modal9000"]`. Then, we invoke `closeModal` for each modal ID in this array.

### 4. Closing All Modals with the Escape Key

Basically, the code is 99% the same except we now call `closeAllModals` instead of `closeTopmostModal`:

{% capture code %}document.body.addEventListener("keyup", keyEvent => {
  if (keyEvent.key === "Escape") {
    closeAllModals();
  }
});{% endcapture %}
{% include code.html file="index.js" code=code lang="javascript" %}

That's it!

## Wrap-up

Here are some ideas to make the modals more interesting:

- Add footers with confirmation/cancel buttons and hook up their corresponding listeners.
- Make closing a modal with escape/clicking off to the side optional by using separate classes.
- Make the modals draggable.

I hope you found this tutorial helpful! If you run into any problems, please let me know.

<script defer src="https://static.codepen.io/assets/embed/ei.js"></script>
