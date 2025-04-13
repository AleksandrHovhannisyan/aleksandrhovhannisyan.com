---
title: How to Open and Close HTML Dialogs
description: Learn how to use the show(), showModal(), and close() methods to toggle an HTML dialog's visibility.
categories: [html, javascript]
keywords: [html dialog, dialog]
---

For such a key UI component, the native `<dialog>` element has had [a long and troubled history in HTML](https://lapcatsoftware.com/articles/2024/2/1.html). It was originally only implemented by Chrome in 2014, and it wasn't until 2022 that other browsers like Safari and Firefox caught up. Now that we've reached an acceptable baseline adoption, `<dialog>` is one of the best ways to include interactive popovers and modals in web apps.

In this short tutorial, I want to share two ways of opening and closing HTML dialog elements. One is a [custom solution](#custom-solution) that works for any number of dialogs on a page, while the other is a sneak peek at [a future syntax](#future-solution-html-commands) with HTML commands that involves zero JavaScript.

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

- A button that should open the dialog when clicked.
- The `<dialog>` element itself.
- A button that should close its parent dialog when clicked.

We need some way to associate these buttons with the dialogs they control. I've chosen to do that with the `aria-controls` ARIA attribute, which gives us a native way to describe a relationship where one element controls another element's visibility. This allows us to query the dialog element if we have a reference to the button that opens it. I've also given each button a custom HTML attribute named `data-dialog-action`; the button that opens the dialog gets a value of [`"showModal"`]((https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)), while the button that closes the dialog gets a value of [`"close"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

The `showModal` method is great for accessibility since it:

- Traps focus inside the dialog,
- Marks the rest of the page as [inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert),
- Focuses the first focusable child of the dialog, and
- Returns focus to the element that opened the dialog on close.

**However**, not all dialogs are modals. These so-called "non-modal" dialogs allow you to still interact with the rest of the page while they're open, and they don't trap focus or open in the [top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) like modal dialogs do. If you'd like to open a non-modal dialog, simply set `data-dialog-action="show"` instead of `showModal`.

Now, let's make our buttons do something when clicked. We'll start by querying all open buttons in the current document:

```js {data-file="dialog.js" data-copyable="true"}
document
  .querySelectorAll('button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls]')
  .forEach((openButton) => {
    const dialogId = openButton.getAttribute('aria-controls');
    const dialog = document.querySelector(`#${dialogId}`);
    const closeButton = dialog.querySelector(`button[data-dialog-action="close"][aria-controls="${dialogId}"]`);

    // NOTE: You might want to throw an error instead
    if (!dialog || !closeButton) return;

    // rest of the code will go here
});
```

Here, I'm using the `:is()` CSS function to query for buttons that open either modal or non-modal dialogs. This code works for any number of dialogs on a page and is more flexible than manually querying the individual elements. We then look at each open button, read the dialog element ID from its `aria-controls` attribute, and then use that ID to query the dialog element that this button controls. Finally, we use the same technique to query the button that closes the same dialog.

{% aside %}
Technically, we don't need to explicitly query for the `aria-controls` attribute on the close button since it's safe to assume that a button with `data-dialog-action="close"` is meant to close its parent dialog element, not a dialog somewhere else in the document. But it doesn't hurt.
{% endaside %}

Now, we can assign `click` event handlers to these buttons:

```js {data-file="dialog.js" data-copyable="true"}
const showDialog = () => dialog[openButton.dataset.dialogAction || 'show']();
const closeDialog = () => dialog.close();

openButton.addEventListener('click', showDialog);
closeButton.addEventListener('click', closeDialog);
```

### Closing by Clicking Outside (Light Dismiss)

Our dialog can be closed either with the <kbd>Escape</kbd> key (natively supported) or with our custom close button. But users are also accustomed to clicking outside dialogs to dismiss them, a behavior known as <dfn>light dismiss</dfn> that's been supported by modal libraries for as long as they've existed.

There's [a proposal to add a `closedby` HTML attribute](https://github.com/whatwg/html/pull/10737) to the spec, which would allow you to do this:

```html
<!-- Pressing escape key or clicking off to the side -->
<dialog closedby="any"></dialog>
```

Unfortunately, at the time of this writing, [`closedby` is only supported in Chrome 134+](https://caniuse.com/mdn-html_elements_dialog_closedby), so we'll need to write a custom solution for now.

Inside our loop, we'll add a click handler to the document element and check if the click originated from an element outside the `<dialog>` or one of its children. If it didn't, then we know that the user clicked outside the dialog.

```js {data-file="dialog.js" data-copyable="true"}
document
  .querySelectorAll('button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls]')
  .forEach((openButton) => {
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
document
  .querySelectorAll('button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls]')
  .forEach((openButton) => {
    const dialogId = openButton.getAttribute('aria-controls');
    const dialog = document.querySelector(`#${dialogId}`);
    const closeButton = dialog?.querySelector(
      `button[data-dialog-action="close"][aria-controls="${dialogId}"]`
    );
    if (!dialog || !closeButton) return;

    const showDialog = () => dialog[openButton.dataset.dialogAction || 'show']();
    const closeDialog = () => dialog.close();
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