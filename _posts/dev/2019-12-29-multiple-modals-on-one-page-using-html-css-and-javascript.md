---
title: Multiple Modals on One Page Using HTML, CSS, and JavaScript
description: This quick tutorial shows you how to create modal windows in HTML using just a bit of markup, styling, and JavaScript. We'll also look at how you can open multiple modals on one page, stacked on top of each other.
keywords: ["multiple modals on one page", "how to create modal windows in html"]
tags: [dev, frontend, html, css, javascript]
isCanonical: true
---

I recently tried my hand at creating modal windows from scratch. And as it turns out, doing so is *much* simpler than I thought it would be.

This quick tutorial shows you how to create modal windows in HTML using just a bit of markup, styling, and JavaScript. We'll also look at how you can open multiple modals on one page, stacked on top of each other. Here's a preview of what we'll be building:

{% include posts/picture.html img="demo" ext="GIF" alt="A demo of opening and closing modals." shadow=false %}

{% include linkedHeading.html heading="The Setup: Basic HTML" level=2 %}

Here's some basic markup to get us started:

{% include posts/codeHeader.html name="index.html" %}
```html
<!DOCTYPE html>
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
</html>
```

Go ahead and create `style.css` along with `index.js` while you're at it. We'll fill them in shortly.

{% include linkedHeading.html heading="Throw in Some Styling" level=3 %}

This'll do for now:

{% include posts/codeHeader.html name="style.css" %}
```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 62.5%;
}

body {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-family: Arial;
    font-size: 1.8rem;
    height: 100vh;
    justify-content: center;
}

p {
    margin-bottom: 1em;
}
```

{% include linkedHeading.html heading="Adding Modal Triggers and Modal Windows in HTML" level=2 %}

Alright, time to add some more markup to our HTML.

In our case, a modal will consist of the following:

- `modal` wrapper, which creates an illusion of elevation with a semi-transparent background.
- `modal-content`, which will contain all the elements of our modal.
- `modal-header`, containing a title and the X button to close out of the modal window.

Beyond those essential pieces, you can fill the modal with anything you want, including a footer and buttons if needed.

We'll also need a `modal-trigger` that, when clicked, opens up the modal with which it is associated.

Replace your `body` with this markup:

{% include posts/codeHeader.html name="index.html" %}
```html
<p>Lorem ipsum. <span class="modal-trigger" data-modal-id="modal1">Click this trigger</span> to open a modal.</p>
<p>Close a modal by clicking off to the side, clicking the X, or pressing Escape.</p>
<div class="modal" id="modal1">
    <section class="modal-content">
        <header class="modal-header">
            <h3>Title goes here...</h3>
            <div class="modal-close"></div>
        </header>
        <p>Congrats, you've opened a modal!</p>
        <p>Now open <span class="modal-trigger" data-modal-id="modal2">another modal</span>!</p>
    </section>
</div>
<div class="modal" id="modal2">
    <section class="modal-content">
        <header class="modal-header">
            <h3>Modalception 🤯</h3>
            <div class="modal-close"></div>
        </header>
        <p>Noice.</p>
    </section>
</div>
<script src="index.js"></script>
```

We'll also make it possible to open up an arbitrary number of modals on top of each other. Doing so is easy—you just add a `modal-trigger` to an existing modal. If that trigger is then clicked while the container modal is open, it will open up a new modal on top of the current one.

> **Note**: If Modal A comes before Modal B in your document, it will appear under Modal B when both are open. Thus, for the purpose of stacking modals, the order does matter.

Notice that we gave each `modal-trigger` an additional `data-modal-id` attribute:

```html
<p>...<span class="modal-trigger" data-modal-id="modal1">Click this link</span> to open a modal.</p>
```

Why we did this will become obvious later in the post. We'll also take a closer look at the modal stacking logic.

But before we do that, we'll style our modal windows so we can verify that our code works.

{% include linkedHeading.html heading="Styling Our Modals" level=2 %}

I'm going to break this up into manageable chunks. First up is the modal wrapper:

```css
.modal {
    align-items: center;
    background-color: rgba(100, 100, 100, 0.5);
    bottom: 0;
    display: flex;
    height: 100vh;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: fixed;
    right: 0;
    transition: 0.2s ease-in-out all;
    visibility: hidden;
    width: 100%;
    z-index: 1000;
}
```

This one's pretty straightforward. The modal wrapper is given a `fixed` position and covers the entire screen. It's also given a slightly opaque background for a nice shadow effect when the modal is open. The `z-index` is set to an arbitrarily large number (in this case, `1000`) to ensure that it's above everything else. Finally, the modal uses Flexbox to perfectly center its contents.

As you can see, the modal is hidden by default with `opacity: 0` and `visibility: hidden`. We'll toggle the visibility in our JavaScript. Here's the class that we'll need to do that:

```css
.modal.modal-visible {
    opacity: 1;
    visibility: visible;
}
```

> **Note**: I'm using the `opacity` + `visibility` trick here since visibility transitions aren't gradual and immediately snap from one state to another. Take a look at [this StackOverflow answer](https://stackoverflow.com/a/27900094/5323344) for more details.

Let's also style the header:

```css
.modal-header {
    align-items: center;
    border-bottom: 2px solid black;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
}

.modal-close {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 30px;
    justify-content: center;
    width: 30px;
}

.modal-close::before {
    content: "X";
    color: rgb(112, 112, 112);
}

.modal-close:hover::before {
    color: black;
}
```

We're simply using a pseudo-element for the close button.

Here's the styling for the modal contents:

```css
.modal-content {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    padding: 20px;
    transform: scale(0);
    transition: 0.2s ease-in-out all;
}

.modal-visible .modal-content {
    transform: scale(1);
}
```

Scaling the transform from `0` to `1` gives us a nice pop-in animation.

Finally, we'll style the triggers:

```css
.modal-trigger {
    color: rgb(10, 47, 255);
    cursor: pointer;
    text-decoration: underline;
}
```

And we're done! You can temporarily set `modal1` to be visible by manually adding `modal-visible` to its class list. Here's what the modal should look like:

{% include posts/picture.html img="modal" ext="PNG" alt="One of the modals we created, with its slightly opaque background." shadow=false %}

{% include linkedHeading.html heading="Adding the JavaScript" level=2 %}

Alright, time to make our modal windows interactive!

{% include linkedHeading.html heading="Multiple Modals on One Page: Stack 'Em Up" level=3 %}

The most natural way to represent stacked modals in code is—surprise, surprise—with a stack:

{% include posts/codeHeader.html name="index.js" %}
```javascript
const currentlyOpenModals = [];
```

The topmost modal window is whatever we recently pushed onto the stack; that's the window that's eligible for closing.

{% include linkedHeading.html heading="Opening and Closing Modals" level=3 %}

Let's code up the logic for opening and closing a modal:

```javascript
const openModal = modalId => {
  const modal = document.getElementById(modalId);
  modal.classList.add('modal-visible');
  currentlyOpenModals.push(modal);
};

// By definition, it's always the topmost modal that will be closed first
const closeTopmostModal = () => {
  if (!currentlyOpenModals.length) {
    return;
  }

  const modal = currentlyOpenModals[currentlyOpenModals.length - 1];
  modal.classList.remove('modal-visible');
  currentlyOpenModals.pop();
};
```

The code is pretty simple—to open a modal, we take an ID, find the modal with that ID, give it the `modal-visible` class, and push it to our stack of open modals. To close a modal, we do the opposite—we remove the class and pop the stack.

{% include linkedHeading.html heading="Creating Event Listeners for Our Modals" level=3 %}

We'll need to do the following:

1. Open a modal when its trigger is clicked.
2. Close the topmost modal when the user clicks off to the side.
3. Close a modal when the user clicks the X button.
4. Close the topmost modal when the user presses the Escape key.

Let's knock these out one at a time.

#### 1. Opening a Modal When Its Trigger Is Clicked

```javascript
const modalTriggers = document.querySelectorAll('.modal-trigger');
modalTriggers.forEach(modalTrigger => {
  modalTrigger.addEventListener('click', clickEvent => {
    const trigger = clickEvent.target;
    const modalId = trigger.getAttribute('data-modal-id');
    openModal(modalId);
  });
});
```

Basically, we query all modal triggers and subscribe to their clicks. Given a click event, we get the trigger element by following `clickEvent.target`. This allows us to extract the `data-modal-id` attribute and open up that particular modal.

#### 2. Closing a Modal by Clicking Off to the Side

This is where it gets interesting:

```javascript
document.querySelectorAll('.modal-content').forEach(modalContent => {
  modalContent.addEventListener('click', clickEvent => {
    clickEvent.stopPropagation();
  });
});

const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
  modal.addEventListener('click', () => {
    closeTopmostModal();
  });
});
```

If we don't stop the event propagation for each `modal-content` element, the modals will close if we click just the content area, and that's not what we want. So, we disable propagation for the content area. Next, we simply subscribe to the click event for each `modal` and close the topmost modal when the event fires.

#### 3. Closing a Modal with the X Button

```javascript
document.querySelectorAll('.modal-close').forEach(modalCloseButton => {
  modalCloseButton.addEventListener('click', () => {
    closeTopmostModal();
  });
});
```

#### 4. Closing a Modal with the Escape Key

```javascript
document.body.addEventListener('keyup', keyEvent => {
  if (keyEvent.key === 'Escape') {
    closeTopmostModal();
  }
});
```

And that's it!

{% include linkedHeading.html heading="Wrap-up" level=2 %}

Here are some ideas to make the modals more interesting:

- Add footers with confirmation/cancel buttons and hook up their corresponding listeners.
- Make closing a modal with escape/clicking off to the side optional by using separate classes.
- Make the modals draggable.

You can also [view a live demo of this tutorial on Codepen](https://codepen.io/AleksandrHovhannisyan/pen/wvBqRYL).

