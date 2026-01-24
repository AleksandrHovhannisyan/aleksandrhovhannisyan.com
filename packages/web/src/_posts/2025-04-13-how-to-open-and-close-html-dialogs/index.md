---
title: How to Open and Close HTML Dialogs
description: Learn how to use the show(), showModal(), and close() methods to toggle an HTML dialog's visibility.
categories: [html, javascript]
keywords: [html dialog, dialog]
lastUpdated: 2026-01-23
---

Despite the popularity of modals on the web, the native `<dialog>` element has unfortunately had [a long and troubled history in HTML](https://lapcatsoftware.com/articles/2024/2/1.html). It was originally only implemented by Chrome in 2014, and it wasn't until 2022 that other browsers like Safari and Firefox caught up. This meant that developers had to rely on external libraries to implement such an integral component. But now that we've reached an acceptable baseline adoption, `<dialog>` is one of the best ways to include interactive popovers and modals in web apps.

In this short tutorial, we'll look at two ways of opening and closing HTML dialog elements. One is a [custom solution](#custom-solution) that works for any number of dialogs on a page, while the other is a sneak peek at [a future syntax](#future-solution-html-commands) with HTML commands that involves zero JavaScript.

## Custom Solution

Let's start with the following HTML:

```html {data-file="dialog.html" data-copyable="true"}
<button data-dialog-action="showModal" aria-controls="my-dialog">
  Open dialog
</button>
<dialog id="my-dialog">
  <button data-dialog-action="close" aria-controls="my-dialog">
    Close dialog
  </button>
  <!-- other HTML can go here -->
</dialog>
```

Here, we have:

- A button that will open the dialog when clicked.
- The `<dialog>` element itself.
- A button that will close its parent dialog when clicked.

We need some way to associate our buttons with the dialogs they control. We could use `data-` attributes, but `aria-controls` already gives us a native way to describe a relationship where one element controls another element's visibility. The attribute doesn't add any interactivity by itself; we will just read its value later to query the dialog that each button controls.

I've also given each button a custom HTML attribute named `data-dialog-action`, with three possible values that mirror their corresponding `HTMLDialogElement` methods:

- `"show"`
- `"showModal"`
- `"close"`

{% details "What's the difference between show and showModal?", true %}
There are two types of dialogs: modals and non-modals (sometimes referred to as popovers).

A <dfn>modal dialog</dfn>:

- Traps focus and returns focus to the element that opened it on close,
- Focuses its first focusable child when it's opened,
- Marks the rest of the page as [inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert),
- Renders with a `::backdrop` that can be styled, and
- Is promoted to the [top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) to avoid z-indexing conflicts.

Calling the [`HTMLDialogElement.showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method opens a dialog as a modal.

By contrast, a <dfn>non-modal dialog</dfn> behaves more like a popover trigger, and you use [`HTMLDialogElement.show()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).
{% enddetails %}

In my example, I'm using `data-dialog-action="showModal"` to create a modal dialog. Meanwhile, the button that closes the dialog gets a value of [`"close"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

Let's make our buttons do something when clicked. We'll first query all dialogs with IDs in the current document and then grab a reference to their corresponding open and close buttons:

```js {data-file="dialog.js" data-copyable="true"}
document.querySelectorAll('dialog[id]').forEach((dialog) => {
  const openButton = document.querySelector(
    `button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls="${dialog.id}"]`
  );
  const closeButton = document.querySelector(
    `button[data-dialog-action="close"][aria-controls="${dialog.id}"]`
  );
  // rest of the code will go here
});
```

I'm using the `:is()` CSS function to query for buttons that open either modal or non-modal dialogs.Now, we can assign `click` event handlers to these buttons. I've chosen to handle both modal and non-modal dialogs in one function, but you could separate the logic for these if you wanted to:

```js {data-file="dialog.js" data-copyable="true"}
const showAction = openButton.dataset.dialogAction || 'show';
const isNonModalDialog = showAction !== 'showModal';

const showDialog = () => {
  dialog[showAction]();
  if (isNonModalDialog) {
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.setAttribute('aria-expanded', 'true');
  }
};

const closeDialog = () => {
  dialog.close();
  if (isNonModalDialog) {
    openButton.setAttribute('aria-expanded', 'false');
    closeButton.setAttribute('aria-expanded', 'false');
  }
};

openButton.addEventListener('click', showDialog);
closeButton.addEventListener('click', closeDialog);
```

Importantly, we're setting the [`aria-expanded`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded) attribute on both the open and close buttons if they control a non-modal dialog. This attribute isn't relevant for modal dialogs because modals cause the rest of the document to become `inert`, so only one button (open or close) will be navigable at any given time.

Note that we're not handling the case where the button that opens a non-modal dialog happens to be the same button that closes it (a popover trigger). If you want to handle this, it's a simple refactor. Where we query for the close button, we'll just add a fallback if one doesn't exist:

```js
const closeButton = document.querySelector(
  `button[data-dialog-action="close"][aria-controls="${dialog.id}"]`
) ?? openButton;
```

This says: Use an explicit close button if one is found, or assume the open button both opens and closes the same dialog.

### Closing by Clicking Outside (Light Dismiss)

Our dialog can be closed either with the <kbd>Escape</kbd> key (natively supported) or with our custom close button. But users are also accustomed to clicking outside dialogs to dismiss them, a behavior known as <dfn>light dismiss</dfn> that's been supported by modal libraries for as long as they've existed.

There's [a proposal to add a `closedby` HTML attribute](https://github.com/whatwg/html/pull/10737) to the spec, which would allow you to do this:

```html
<!-- Pressing escape key or clicking off to the side -->
<dialog closedby="any"></dialog>
```

Unfortunately, at the time of this writing, [`closedby` is only supported in Chrome 134+](https://caniuse.com/mdn-html_elements_dialog_closedby), so we'll need to write a custom solution for now.

Inside our loop, we'll add a click handler to the document element and check if the `<dialog>` or one of its children was clicked. If they weren't, then we know that the user must have clicked _outside_ the dialog.

```js {data-file="dialog.js" data-copyable="true"}
document.querySelectorAll('dialog[id]').forEach((dialog) => {
  // ...other code...

  // Add this
  document.addEventListener('click', (e) => {
    if (dialog.open && !e.composedPath().includes(dialog)) {
      closeDialog();
    }
  });
});
```

This handler will run when [the `click` event bubbles](/blog/interactive-guide-to-javascript-events/#3-event-bubbling) up from any element.

There's just one problem... well, really two problems.

#### Dialog Backdrop Intercepts Clicks

Every dialog element has a `::backdrop` pseudo-element that represents the surface behind the dialog. Backdrops can be styled with CSS:

```css {data-file="dialog.css" data-copyable="true"}
dialog::backdrop {
  background-color: hsl(0deg 0% 0% / 60%);
  backdrop-filter: blur(4px);
}
```

The problem is that the `::backdrop` element also intercepts click events. And since the backdrop is just an extension of the dialog element itself, you're really just clicking the dialog whenever you click "outside" it. Thus, the dialog won't close because `!e.composedPath().includes(dialog)` will evaluate to `false` in the code that we wrote.

To fix this, we need to ignore pointer events on the backdrop:

```css {data-file="dialog.css" data-copyable="true"}
dialog::backdrop {
  pointer-events: none;
}
```

#### Dialog Closes After Opening

The second problem is a race condition. When a user clicks the open button for a dialog, that button's click handler will fire in the [event targeting phase](/blog/interactive-guide-to-javascript-events/#2-event-targeting) before it bubbles up to the document, and the dialog element will open as expected. But if the click event bubbles _after_ the dialog opens, then the document click handler will see that `dialog.open` is `true`, and it will also see that the click event originated on an element (`openButton`) that doesn't include the dialog in its composed path. Thus, the dialog will sometimes instantly close after opening if the timing is right, which isn't what we want.

There are two ways to fix this bug. One is to [stop the `click` event from propagating](/blog/interactive-guide-to-javascript-events/#stopping-event-propagation) when it originates from `openButton` so that it doesn't bubble up to the document:

```js {data-file="dialog.js" data-copyable="true"}
openButton.addEventListener('click', (e) => {
  e.stopPropagation();
  showDialog();
});
```

Another option is to use [event capturing](/blog/interactive-guide-to-javascript-events/#2-event-capturing) for the document `click` handler so that this function always runs before the click handlers for other elements:

```js {data-file="dialog.js" data-copyable="true"}
document.addEventListener(
  'click',
  (e) => {
    if (dialog.open && !e.composedPath().includes(dialog)) {
      closeDialog();
    }
  },
  { capture: true }
);
```

It's up to you which one you use, but I prefer event capturing.

### Final Code

Here's the custom script that we wrote:

```js {data-file="dialog.js" data-copyable="true"}
document.querySelectorAll('dialog[id]').forEach((dialog) => {
  const openButton = document.querySelector(
    `button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls="${dialog.id}"]`
  );
  const closeButton = document.querySelector(
    `button[data-dialog-action="close"][aria-controls="${dialog.id}"]`
  ) ?? openButton;

  const showAction = openButton.dataset.dialogAction || 'show';
  const isNonModalDialog = showAction !== 'showModal';
  
  const showDialog = () => {
    dialog[showAction]();
    if (isNonModalDialog) {
      openButton.setAttribute('aria-expanded', 'true');
      closeButton.setAttribute('aria-expanded', 'true');
    }
  };
  
  const closeDialog = () => {
    dialog.close();
    if (isNonModalDialog) {
      openButton.setAttribute('aria-expanded', 'false');
      closeButton.setAttribute('aria-expanded', 'false');
    }
  };

  openButton.addEventListener('click', showDialog);
  closeButton.addEventListener('click', closeDialog);

  // Detect outside clicks. NOTE: This only works if the ::backdrop ignores pointer events.
  // Once closedby has enough support, remove this https://github.com/whatwg/html/pull/10737
  document.addEventListener(
    'click',
    (e) => {
      if (dialog.open && !e.composedPath().includes(dialog)) {
        closeDialog();
      }
    },
    // Fixes a race condition where clicking the open button would cause a dialog to open and then close instantly.
    // Could also stopPropagation() on the open button's click event.
    { capture: true }
  );
});
```

## Future Solution: HTML Commands

In his article on [HTML dialogs](https://nerdy.dev/have-a-dialog#commando), Adam Argyle presents [a future HTML proposal](https://open-ui.org/components/invokers.explainer/) that will allow buttons in HTML to call methods on other elements without any custom JavaScript. Check this out:

```html {data-copyable="true"}
<button commandfor="my-dialog" command="show-modal">
  Open dialog
</button>
<dialog id="my-dialog">
  <button commandfor="my-dialog" command="close">
    Close dialog
  </button>
</dialog>
```

Here, the `commandfor` attribute registers a button as an "invoker" for the element with the given ID (in this case, a `<dialog>`), effectively replacing the `aria-controls` pattern we were using before in our custom solution.

The `command` attribute identifies the method to call on that element when the button is clicked, similar to our custom `data-dialog-action` attribute from earlier. In the code above, the open button will call the `HTMLDialogElement.showModal` method when clicked, while the close button will call `HTMLDialogElement.close`. This works without any JavaScript, and it's my recommended approach if browser support is acceptable at the time when you're reading this.

## Summary

HTML dialogs are a great addition to HTML, allowing you to show modal and non-modal UI that would've previously required libraries. Now, with just a few lines of HTML and a bit of custom JavaScript—or even _zero_ JavaScript—you can easily wire up buttons that open and close dialogs anywhere on a page.

## References and Further Reading

- ["Invoker Commands (Explainer)" by Keith Cirkel and Luke Warlow](https://open-ui.org/components/invokers.explainer/)
- ["Have a dialog" by Adam Argyle](https://nerdy.dev/have-a-dialog)
- ["Is &lt;dialog&gt; enough" by Mayank](https://blog.mayank.co/is-dialog-enough)
- ["A couple CSS tricks for HTML Dialog elements" by Cassidy Williams](https://cassidoo.co/post/css-for-dialogs/)