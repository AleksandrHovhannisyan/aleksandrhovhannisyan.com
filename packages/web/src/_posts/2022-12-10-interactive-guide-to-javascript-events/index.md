---
title: An Interactive Guide to JavaScript Events
description: Learn how event capturing, targeting, and bubbling work in JavaScript; how to prevent an event's default behavior; how to stop event propagation; and more.
keywords: [javascript events, event]
categories: [javascript, html]
thumbnail: ./images/phases.png
lastUpdated: 2023-02-04
isFeatured: true
openGraph:
  twitter:
    card: summary_large_image
---

{% capture originalHTML %}
```html
<button>Click me!</button>
```
{% endcapture %}
{% assign html = originalHTML %}

{% capture originalCSS %}
```css
button {
  padding: 0.5rem;
}
```
{% endcapture %}
{% assign css = originalCSS %}

When you're first starting out with JavaScript, one of the first things you learn is how to register event listeners on HTML elements so you can respond to user actions, like a button click or an input event. At this early stage in your journey with JavaScript, event handling seems like a simple black box: an event is triggered, your event handler processes the event, and that's all there is to it. But this doesn't tell the whole story.

While it may not be apparent at first, JavaScript events actually go through three phases:

1. Capturing,
2. Targeting, and
3. Bubbling.

Event targeting is what most beginners are familiar with, but the other two phases are also important to understand. In this article, you'll learn how event capturing, targeting, and bubbling work in JavaScript; we'll also touch on event delegation, how to stop event propagation, how to prevent an event's default behavior, and more.

{% include "toc.md" %}

## JavaScript Event Basics

This guide is intended for developers with any level of JavaScript experience, but it's recommended that you at least have the following prerequisite knowledge:

- A basic understanding of the [document object model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model).
- Basic experience using [`EventTarget.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to register event listeners.
- Basic experience working with [the `Event` interface](https://developer.mozilla.org/en-US/docs/Web/API/Event).

We will review some of this information over the next few sections. Some of the later sections will build on examples introduced here, so it's recommended that you work through the prerequisite material even if you're already familiar with these concepts. However, if you'd like to, you can skip ahead to [JavaScript Event Phases](#javascript-event-phases).

### Event-Driven Programming

Beginners are often surprised to learn that each script tag on a page is only parsed and executed once. After a script runs, it will never be executed again. How is that possible? After all, we often write JavaScript that runs long after the page has loaded, such as when a user clicks a button or interacts with some other part of our application. To understand how this is possible, we need to learn about events.

By design, JavaScript is an event-driven programming language involving <dfn>publishers</dfn> (agents that emit events) and <dfn>subscribers</dfn> (code that listens for events). Certain user interactions or code may fire a JavaScript event representing some change in state. Below are just a few examples of events:

- Browsers fire the `load` event when an HTML document has fully loaded.
- HTML images and other media fire the `load` event when their media has fully loaded.
- Elements fire the `click` event when they are clicked with a pointer device or keyboard.
- A region with a scrollbar will fire the `scroll` event when it is scrolled.
- The browser `window` fires the `resize` event when its dimensions change.
- Form elements fire the `input` event when their value changes.

Note that some events can be triggered programmatically. For example, if we have a reference to a button element, we can use JavaScript to click it without input from a user:

{{ html }}

```js
const button = document.querySelector('button');
button.click();
```

Events are just one mechanism that allows JavaScript code to run long after a script has been parsed and executed by the runtime. For the purposes of this article, we'll focus on client-side runtimes since there is no concept of a DOM in server-side runtimes. (Node.js does allow you to define custom events, though.)

### Subscribing to Events with `addEventListener`

All event-driven programming languages provide a way to *listen* for a particular event so you can respond to that event when it fires. In JavaScript, this is done with the [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method, which normally accepts two arguments:

- The name of the event to listen for, as a string (e.g., `'click'`).
- A callback function that should be invoked when the event fires.

The following example registers a click event listener on a button:

{% capture js %}
```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  console.log('click event fired');
});
```
{% endcapture %}

{{ js }}

Try it out!

{% codeDemo 'Registering an event listener for the click event on a button' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

The same event can fire any number of times; our event listener will run each time.

Note that an event handler can optionally accept one argument: [the `Event` object itself](https://developer.mozilla.org/en-US/docs/Web/API/Event):

```js
const button = document.querySelector('button');
button.addEventListener('click', (event) => {
  console.log(event);
});
```

We'll take a closer look at this object in the section on [event targeting](#2-event-targeting).

### Removing Event Listeners

As you may have already guessed, if it's possible to *add* event listeners, then it's also possible to *remove* them. This is useful for memory management (particularly to avoid memory leaks) in situations where an object is no longer needed. There are several ways to remove event listeners, but we won't look at all of them in this article. Instead, we'll briefly look at the most popular approach: [`EventTarget.removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). This method takes the name of the event and a reference to the corresponding event handler that should be removed.

In the code we've written so far, we've been passing anonymous (unnamed) functions to `addEventListener` using JavaScript's arrow function syntax. But a single element can register any number of event listeners for the same event. For example, you can have two, three, or hundreds of click event listeners on the same button. In order for `removeEventListener` to know *which* listener you want to remove, you need to keep a named reference to your event handler, like in the following example:

```js
const handleClick = (e) => {
  console.log('clicked');
}

const button = document.querySelector('button');
button.addEventListener('click', handleClick);

// You'd typically run this code conditionally in response to some action
button.removeEventListener('click', handleClick);
```

Play around with the following demo; click the first button to log a message in the console, then click the second button to remove the event listener on the first button, and then click the first button again to observe that no more messages are logged:

{% codeDemo 'Adding and removing click listeners from a button' %}
```html
<fieldset id="button-demo-fieldset">
  <button id="button-click">Fire click event</button>
  <button id="button-remove">Remove listener</button>
</fieldset>
```
{{ css }}
```css
#button-demo-fieldset {
  border: none;
  display: flex;
  gap: 0.5rem;
}
```
```js
const handleButtonClick = (e) => {
  console.log('clicked');
}

const button1 = document.querySelector('#button-click');
const button2 = document.querySelector('#button-remove');

button1.addEventListener('click', handleButtonClick);
button2.addEventListener('click', () => {
  button1.removeEventListener('click', handleButtonClick);
})
```
{% endcodeDemo %}

### Events Have a Default Behavior

It's important not to confuse event listeners with events themselves. An event listener is just that: a function that eavesdrops on an event. In the original button demo that we looked at, if we didn't add any event listeners and simply clicked the button, the click event would have still fired. By analogy, if a tree falls in a forest and nobody's around to hear it, it will still make a sound.

Because events occur whether we listen to them or not, all JavaScript events have a default behavior. For example:

- The `scroll` event scrolls an overflow container, such as the page itself.
- A form `submit` event reloads the page or redirects the user to another page.
- The `input` event on a checkbox toggles its state on or off.
- The `focus` and `blur` events fire when an element receives or loses focus, respectively.

Later in this article, we'll take a closer look at how we can [prevent this default behavior from occurring](#preventing-an-events-default-behavior). For now, the key takeaway is that events do not *require* event listeners in order to fire—these are two independent concepts.

### A Sneak Peek at Event Propagation

The button example we looked at before would actually render like this in a complete document, so the button is not the only element on the page:

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <button>Click me!</button>
  </body>
</html>
```

What happens when a user clicks this button? If you answered "a `click` event fires on the button," you're right. But what if I told you there's more going on behind the scenes?

In reality, the click event doesn't fire on *just* the button because the button doesn't exist in a vacuum—it's part of the document body, which in turn is a child of the DOM root, which renders in a browser `window`. So when a user clicks the button, they're also implicitly clicking its ancestors—in this case, `document.body`, `document.documentElement`, and `window`.

If that's not clear, perhaps an analogy will help. If I touch the tip of my nose with my finger, all of the following statements will be true:

- I touched my nose.
- I touched my face.
- I touched my head.
- I touched my body.

Each statement is *less precise* than the one before it, but it is true nonetheless because my nose is not detached from my face, head, or body. (And hopefully it stays that way!)

Going back to our code, let's try adding some event listeners so we can tell what's happening. We'll add a click event listener to the button, body, document root, and window to see what gets logged when the button is clicked:

{% capture js %}
```js
const button = document.querySelector('button');
const html = document.documentElement;
const body = document.body;

window.addEventListener('click', () => console.log('window'));
html.addEventListener('click', () => console.log('html'));
body.addEventListener('click', () => console.log('body'));
button.addEventListener('click', () => console.log('button'));
```
{% endcapture %}

{{ js }}

{% codeDemo 'Registering click event listeners on a button and all of its ancestors' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

When the button is clicked, the following messages will be logged in order:

```
"button"
"body"
"html"
"window"
```

This behavior—where an event fires not only on the element that triggered it but also on its ancestors—is known as <dfn>event propagation</dfn>. We say that the event *propagates* through the DOM. The result matches the conclusion we reached intuitively: Clicking the button also clicks its ancestors, all the way up to the browser window. However, this explanation is incomplete and only tells half of the story. More on that shortly.

### The Order of `addEventListener`

In the example we just looked at, I intentionally registered the event handlers in the following order to emphasize the fact that their ordering in our code does not determine their order of invocation once the event actually fires:

```js
const button = document.querySelector('button');
const html = document.documentElement;
const body = document.body;

window.addEventListener('click', () => console.log('window'));
html.addEventListener('click', () => console.log('html'));
body.addEventListener('click', () => console.log('body'));
button.addEventListener('click', () => console.log('button'));
```

We set the event handler on the window first, then the root element, then the body element, and finally the button itself. But the messages were logged in reverse order: the button first, followed by the body, then the root, and finally the window:

```
"button"
"body"
"html"
"window"
```

We'll learn more about *why* they were logged in this order later in this article once we learn about [event bubbling](#3-event-bubbling). For now, suffice it to say that the order in which the event handlers run for different nodes (like button versus body in this example) does not depend on the order in which those event handlers were *registered* in our code.

However, where the order of `addEventListener` *does* matter is when you register multiple event listeners for the same event on the *same element*, like in the following example:

{% capture js %}
```js
const button = document.querySelector('button');
button.addEventListener('click', () => console.log('one'));
button.addEventListener('click', () => console.log('two'));
```
{% endcapture %}

{{ js }}

{% codeDemo 'Registering two click listeners on a button' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

If we click the button, we'll get the following output:

```
"one"
"two"
```

Reversing the order of the event listeners also reverses the order of the output:

{% capture js %}
```js
const button = document.querySelector('button');
button.addEventListener('click', () => console.log('two'));
button.addEventListener('click', () => console.log('one'));
```
{% endcapture %}

{{ js }}

{% codeDemo 'Registering two click listeners on a button' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

When we add multiple event listeners to the same element for the same event, the handlers queue up in order, so the first handler runs first, then the second, and so on.

### Inspecting Event Listeners with Dev Tools

Have you ever wanted to view all of the event listeners that are attached to an element or its ancestors? You can use Chrome Dev Tools to inspect any element by navigating to the `Event Listeners` pane. With a particular node selected in the tree, you'll see both its event listeners as well as any event listeners registered on ancestor elements:

![Inspecting a button in Chrome Dev Tools with a panel open on the right-hand side showing a collapsible tree-list view of four click event listeners: window, html, body, and button. Each node is expanded, revealing more information about its event listener and how it was registered.](./images/event-listeners.png)

This can be useful if you need to debug code where you suspect that an element registered more event listeners than it should have or if an ancestor is reacting to some event from a child when it shouldn't. For example, maybe a browser extension is registering event listeners that are somehow interfering with your app's logic.

## JavaScript Event Phases

With those fundamentals out of the way, we can now take a closer look at JavaScript's event phases.

As a reminder, here's the output from our earlier code demo involving a button click:

```
"button"
"body"
"html"
"window"
```

This output seemed to suggest that an event starts at the node that triggered it—in this case, the button—and propagates up the tree to the root of the DOM, visiting every parent along the way. This is only partially true. In reality, JavaScript events go through three phases, in the following order:

1. <dfn>Capturing</dfn>: the event begins at the root of the DOM and propagates down to the target.
2. <dfn>Targeting</dfn>: the event finally reaches the target element that triggered it.
3. <dfn>Bubbling</dfn>: the event propagates back up the DOM the same way it came.

{% aside %}
Note that in a browser runtime, a JavaScript event will originate at the `window` object and then propagate through the DOM.
{% endaside %}

The diagram below illustrates all three event phases for the button example:

![Three side-by-side panels depicting a top-down tree structure. The levels of the tree are as follows. Root: window; children: html. HTML's children: head, body. Body's children: button. The panels are labeled from left to right: Phase 1: Event capturing. Phase 2: Event targeting. Phase 3: Event bubbling.](./images/phases.png)

We'll explore each phase in depth.

{% aside %}
All events capture and target, but [not all events bubble](#not-all-events-bubble)!
{% endaside %}

You can tell which phase an event is in at any given moment by checking the [`Event.eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase) property of the event object, which can have one of four values:

<div class="scroll-x" role="region" tabindex="0">
  <table id="table-1">
    <caption>Table 1: <code>Event.eventPhase</code> values</caption>
    <thead>
      <tr>
        <th scope="col">Enum</th>
        <th scope="col">Value</th>
        <th scope="col">Phase</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Event.NONE</code></td>
        <td><code>0</code></td>
        <td>None</td>
      </tr>
      <tr>
        <td><code>Event.CAPTURING_PHASE</code></td>
        <td><code>1</code></td>
        <td>Capturing</td>
      </tr>
      <tr>
        <td><code>Event.AT_TARGET</code></td>
        <td><code>2</code></td>
        <td>Targeting</td>
      </tr>
      <tr>
        <td><code>Event.BUBBLING_PHASE</code></td>
        <td><code>3</code></td>
        <td>Bubbling</td>
      </tr>
    </tbody>
  </table>
</div>

You may be wondering why JavaScript has both event capturing and event bubbling. In short, the symmetric nature of the event phases means that we can decide when we want a parent element's event handler to run: before or after the target. We'll learn more about this over the course of the next several sections as we develop a better understanding of event capturing, targeting, and bubbling.

### 1. Event Capturing

All JavaScript events begin their journey at the root of the DOM and propagate down until they reach the target node. On its way to the target, the event fires on each ancestor element in what's known as the <dfn>event capturing</dfn> phase.

![Three side-by-side panels depicting a top-down tree structure. The levels of the tree are as follows. Root: window; children: html. HTML's children: head, body. Body's children: button. The panels are labeled from left to right: Phase 1: Event capturing. Phase 2: Event targeting. Phase 3: Event bubbling. The first panel is active and highlights the nodes that participate in event capturing: window, html, and body.](./images/capturing.png)

The concept of event capturing may seem a little foreign at first, but that's only because `addEventListener` does not use capturing unless you enable it. In fact, you'll rarely need to work with event capturing in practice. (However, just because event capturing is rarely used doesn't mean that you shouldn't *understand* how it works.)

As we learned before, you normally pass in just two arguments to `addEventListener`:

```js
button.addEventListener('eventName', handler);
```

But there's an optional third argument for `addEventListener` that allows an element to not only listen for the event on *itself* but to *also* react to the same event when it originates from one of its children. In other words, the node *captures* the event if it is fired by a child lower in the DOM. Here's what that new usage looks like:

```js
// Option 1
button.addEventListener('eventName', handler, true)

// Option 2 (identical but more readable)
button.addEventListener('eventName', handler, { capture: true })
```

Both do the same thing—they register an event listener on an element that will fire if:

1. The element itself is the event target, or
2. One of the element's children is the event target.

What we're specifically interested in is that second scenario. Because events begin at the root of the DOM in the capturing phase and propagate down the tree to reach the event target, capturing event listeners will *always* run on ancestor elements *before* the target's event listener gets a chance to run.

Using the same button example as before, we'll now pass in `{ capture: true }` for all of the ancestor event handlers but leave the button's event handler as-is:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window');
}, { capture: true });

document.documentElement.addEventListener('click', (e) => {
  console.log('html');
}, { capture: true });

document.body.addEventListener('click', (e) => {
  console.log('body');
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button');
});
```
{% endcapture %}

{{ js }}

What do you think the output will look like this time? Run the demo to find out:

{% codeDemo 'Registering a click listener on a button and capturing click listeners on its ancestors.' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

This time around, when the button is clicked, the order of the output will be reversed:

```
"window"
"html"
"body"
"button"
```

The event begins its journey at the browser `window`, which was technically clicked because there's no way for a user to click a document without also clicking somewhere inside their browser window. It then propagates down the DOM, starting at the root, then reaching the body, then any intermediate parents (none in this case), and then finally propagating to the button itself, where it enters the targeting phase. We can verify this by also logging the `eventPhase` property of the event object:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
}, { capture: true });

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

{% codeDemo 'Registering a click listener on a button and capturing click listeners on its ancestors.' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Output:

```
"window" 1
"html" 1
"body" 1
"button" 2
```

Per [Table 1](#table-1), `1` corresponds to the capturing phase and `2` to the targeting phase.

Before we move on, I want to reiterate that event capturing is really only useful if:

1. You're setting an event listener on a parent element,
2. You anticipate that the event is going to originate from one of its children, and
3. You want the parent's listener to run as early as possible, before the targeting phase.

Otherwise, `{ capture: true }` behaves just like any ordinary event listener: If the element on which it is registered happens to be the event target, then it will run in the targeting phase. In this example, if I were to click the body instead of the button, then the body's event listener would still run like any normal event listener that you're used to, except now it would run in the *targeting* phase because the body would be the event target for the click.

Moreover, in the example we just looked at, I could have also technically added `{ capture: true }` to the button's event listener, but that wouldn't have made a difference—the button's event handler would still have run in the [targeting phase](#2-event-targeting) (our next topic of discussion) because the button was the click target in this particular example.

It may help to think of event capturing as a net that catches events from either the node itself or any of the children hanging below it in the DOM. If the event happens to originate from a child, then the capturing event listener set on the parent will *always* run first before the event has a chance to propagate down to the child. Otherwise, if the element with a capturing event listener is the target itself, then its listener will run like it normally would in the targeting phase.

#### When Is Event Capturing Useful?

You may be wondering: Why would I ever want to set a capturing event listener on a parent? Why not just use `addEventListener` without the third argument? It's a fair question! The answer requires that we understand [event bubbling](#3-event-bubbling). For now, note that not all events bubble, but all events do capture. So there are some situations where we might want a parent to listen for events triggered by one of its children, but registering an event listener without `{ capture: true }` would have no effect if that particular event type does not bubble.

### 2. Event Targeting

Eventually, once the event has propagated down through all of the ancestors in the DOM, it reaches the node that triggered it in the first place: the <dfn>event target</dfn>. In the example that we've been using so far, the button that the user clicked is the event target.

![Three side-by-side panels depicting a top-down tree structure. The levels of the tree are as follows. Root: window; children: html. HTML's children: head, body. Body's children: button. The panels are labeled from left to right: Phase 1: Event capturing. Phase 2: Event targeting. Phase 3: Event bubbling. The second panel is active and highlights the button node, which is the only node that participate in event targeting in this example.](./images/targeting.png)

This is known as the targeting phase.

#### `Event.target`

The target for a particular event is accessible under the [`Event.target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) property. Here are some more examples of event targets:

- If instead we had clicked on the body itself, `document.body` would've been the target.
- If you type in an `<input>`, the event target for the `input` event is the input itself.
- If you `blur` an input by removing focus from it, the event target is the input itself.
- If you `scroll` a container, the event target for the `scroll` event is the container itself.

Importantly, `Event.target` always refers to the same HTML element for a particular event no matter which event listener you are accessing it from. For example, consider this code:

{% capture js %}
```js
function handleClick(e) {
  console.log(e.target.tagName);
}

window.addEventListener('click', handleClick, { capture: true });
document.documentElement.addEventListener('click', handleClick, { capture: true });
document.body.addEventListener('click', handleClick, { capture: true });
document.querySelector('button').addEventListener('click', handleClick);
```
{% endcapture %}

{{ js }}

If you were to click the button this time, you would see `"BUTTON"` logged four times because the event target is the same in all four event listeners.

{% codeDemo 'Logging e.target.tagName' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

#### `Event.currentTarget`

If instead we want to access the node on which the event listener was *registered*, we can do so via [`Event.currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target). The code below logs both `Event.target` and `Event.currentTarget` to compare the two in the capturing and targeting phases:

{% capture js %}
```js
function handleClick(e) {
  const target = e.target.tagName;
  const currentTarget = e.currentTarget.tagName ?? 'WINDOW';
  console.log(`target`, target, `currentTarget`, currentTarget);
}

window.addEventListener('click', handleClick, { capture: true });
document.documentElement.addEventListener('click', handleClick, { capture: true });
document.body.addEventListener('click', handleClick, { capture: true });
document.querySelector('button').addEventListener('click', handleClick);
```
{% endcapture %}

{{ js }}

{% codeDemo 'Logging e.currentTarget.tagName' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Now, when the button is clicked, we should see the following output:

```
"target" "BUTTON" "currentTarget" "WINDOW"
"target" "BUTTON" "currentTarget" "HTML"
"target" "BUTTON" "currentTarget" "BODY"
"target" "BUTTON" "currentTarget" "BUTTON"
```

Most of the time, `Event.currentTarget` won't be all that useful. If you're assigning an event listener to a target, then you already have a reference to that target somewhere in your code, so `Event.currentTarget` will always equal that reference.

#### `Event.relatedTarget`

Finally, some event types (like [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget) and [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)) can have a <dfn>related target</dfn>: another element that participates in a symmetric event. For example, in the `blur` event, one element loses focus while another element might gain focus:

{% capture html %}
```html
<label>One <input name="one"></label>
<label>Two <input name="two"></label>
```
{% endcapture %}

{{ html }}

{% capture js %}
```js
document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('blur', (e) => {
    console.log(`blurred:`, e.target.name, `focused:`, e.relatedTarget.name);
  });
});
```
{% endcapture %}

{{ js }}

Use your mouse or keyboard to focus the two inputs in this demo:

{% codeDemo 'Comparing e.target.name with e.relatedTarget.name' %}
{{ html }}
```css
label + label {
  display: block;
  margin-top: 1rem;
}
```
{{ js }}
{% endcodeDemo %}

If you focus the first input and then focus the second input, the following will be logged:

```
"blurred:" "one" "focused:" "two"
```

If you now blur the second input by focusing the first input, the following will be logged:

```
"blurred:" "two" "focused:" "one"
```

Typically, `relatedTarget` is only relevant for symmetric events, where the event has a related event that also fires. For example, if a `mouseenter` event fires on one element, then a `mouseleave` event likely fired on some other element.

### 3. Event Bubbling

{% assign html = originalHTML %}

This is the example we ran at the beginning of this article:

```js
const button = document.querySelector('button');
window.addEventListener('click', () => console.log('window'));
document.documentElement.addEventListener('click', () => console.log('html'));
document.body.addEventListener('click', () => console.log('body'));
button.addEventListener('click', () => console.log('button'));
```

We found that when the button was clicked, the following messages were logged:

```
"button"
"body"
"html"
"window"
```

This behavior—where an event fires on the target and then propagates back up to its ancestors—is known as <dfn>event bubbling</dfn>. It is the third phase of an event's lifecycle, immediately after the targeting phase.

![Three side-by-side panels depicting a top-down tree structure. The levels of the tree are as follows. Root: window; children: html. HTML's children: head, body. Body's children: button. The panels are labeled from left to right: Phase 1: Event capturing. Phase 2: Event targeting. Phase 3: Event bubbling. The third panel is active and highlights the nodes that participate in event capturing: body, html, and window, in that reverse order.](./images/bubbling.png)

Here is what's really happening when we click the button:

1. Capturing: `window`.
2. Capturing: document root.
3. Capturing: body.
4. Targeting: button.
5. Bubbling: body.
6. Bubbling: document root.
7. Bubbling: `window`.

Remember: The event is still captured even if we don't listen to it in that phase.

If we log `eventPhase`, we should see `3` (bubbling) for everything except the button:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
});

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

{% codeDemo 'Logging Event.eventPhase in the bubbling phase' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

As expected, when we click the button, we get a `2` for the button (targeting phase) and a `3` (bubbling) for its ancestors:

```
"button" 2
"body" 3
"html" 3
"window" 3
```

#### Not All Events Bubble

As I mentioned earlier, not all events bubble in JavaScript. Whether an event bubbles can be determined by checking the [`Event.bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles) boolean property. One of the best examples of an event that doesn't bubble is the [`scroll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) event.

Suppose your page renders a scroll container:

```html
<div class="scroll-container">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
    tincidunt faucibus scelerisque. Vestibulum eros nisl, euismod ut
    tortor non, condimentum porta sapien. Donec malesuada gravida quam,
    sit amet faucibus diam pulvinar a. Quisque congue nec orci a accumsan.
</div>
```

```css
.scroll-container {
  max-width: 100px;
  max-height: 50px;
  overflow-y: auto;
}
```

If the page contains lots of elements, then it likely also has a vertical scrollbar. In some situations, you might want to attach a scroll event listener to the window—like if you want to render a reading progress meter or animate things in response to scroll events (there are better ways of doing this, but humor me):

```js
window.addEventListener('scroll', (e) => {
  console.log('window scrolled');
});

document.querySelector('.scroll-container').addEventListener((e) => {
  console.log('container scrolled');
});
```

If the scroll event *did* bubble up from child elements, then it would lead to some misleading results—scrolling a child container would also fire a scroll event on the window, suggesting that the browser window itself also scrolled even though it *didn't*. Thus, any scroll event handler set on a parent would need to double-check that `Event.target` actually matches `Event.currentTarget` before proceeding any further. But that's not intuitive, so the scroll event does not bubble to prevent this unwanted behavior. There are other events that don't bubble for similar reasons.

## Mixing Event Capturing and Bubbling

{% assign html = originalHTML %}
{% assign css = originalCSS %}

So far in our code demos, we've set all parent event listeners to either capture or bubble. But what happens if we mix and match? And what if we set multiple event listeners of different types on the same parent element? Let's set:

1. Both a capturing and normal event listener on the `window`.
2. A capturing event listener on the body.
3. A normal event listener on the `html` element.

Here's the code that does that:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

What will the output be this time?

{% codeDemo 'Mixing regular and capturing event listeners in the same example' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Output:

```
"window" 1
"body" 1
"button" 2
"html" 3
"window" 3
```

The key to understanding this output is to remember that the event still traces the same exact path as before:

1. Capturing: `window`.
2. Capturing: document root.
3. Capturing: body.
4. Targeting: button.
5. Bubbling: body.
6. Bubbling: document root.
7. Bubbling: `window`.

Let's break this down in terms of the code:

1. The event is captured at the `window`, whose first event handler runs.
2. The event is captured at the root, but its *listener* doesn't capture, so nothing is logged.
3. The event is captured at the body, and `"body", 1` is logged.
4. The event reaches its target, and `"button", 2` is logged.
5. The event bubbles up to the body. Nothing is logged because the listener captures.
6. The event bubbles up to the root. Its listener logs `"html", 3`.
7. The event bubbles up to the window. Its second listener logs `"window", 3`.

## Stopping Event Propagation

{% assign html = originalHTML %}
{% assign css = originalCSS %}

In some situations, we might want to prevent an event from propagating further in the DOM. This might mean that we want to prevent the event from being captured by other nodes *below* it or reaching its intended target, or we might want to prevent it from *bubbling* to other nodes after it has reached the target. Either way, the DOM allows us to stop the event from propagating using [`Event.stopPropagation`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation).

{% aside %}
Many explanations of `Event.stopPropagation` are incomplete and state that it prevents bubbling. This is only true if you're stopping propagation in the targeting or bubbling phases. `Event.stopPropagation` can also prevent nodes further down the tree from capturing or even targeting the event.
{% endaside %}

Let's consider a few different scenarios, all involving the same example where a user clicks a button. What happens if we call `Event.stopPropagation` inside the capturing, targeting, and bubbling phases? To keep things interesting, I'll reuse the code where we [mixed event handlers of different types](#mixing-event-capturing-and-bubbling).

### 1. `Event.stopPropagation` in Event Capturing

Let's update the `window`'s capturing event listener to stop the click event from propagating:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
  // 🛑 Stop propagating!
  e.stopPropagation();
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

In the capturing phase, `Event.stopPropagation` prevents the event from reaching nodes below the current element in the DOM. This means that if we stop propagation at the window, then the element will never enter the DOM—so it won't reach the root, body, or even the button itself. You can verify this in the following demo:

{% codeDemo 'Stopping event propagation during the capturing phase' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

So we only see the following output:

```
"window" 1
```

In fact, if we were to click *anywhere* in the document, we would see the exact same output because the window intercepts the event as early as possible in the capturing phase and prevents it from propagating down any further.

### 2. `Event.stopPropagation` in Event Targeting

What if instead we stop event propagation during the targeting phase?

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
  // 🛑 Stop propagating!
  e.stopPropagation();
});
```
{% endcapture %}

{{ js }}

{% codeDemo 'Stopping event propagation during the targeting phase' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Here's the output when the button is clicked:

```
"window" 1
"body" 1
"button" 2
```

In the targeting phase, `Event.stopPropagation` will prevent the event from propagating back up the DOM (bubbling). So all capturing event listeners will run, and so will the button's own event handler, but none of the event listeners that we set on parent elements will run in the bubbling phase.

### 3. `Event.stopPropagation` in Event Bubbling

Finally, consider what happens when we stop propagation during the bubbling phase, such as on the root element:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.documentElement.addEventListener('click', (e) => {
  console.log('html', e.eventPhase);
  // 🛑 Stop propagating!
  e.stopPropagation();
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

This will prevent the event from bubbling up any further than it already has, meaning the window's second event listener should not be invoked.

{% codeDemo 'Stopping event propagation during the bubbling phase' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Indeed, that's the case if we run this code and inspect the output:

```
"window" 1
"body" 1
"button" 2
"html" 3
```

### `stopPropagation` vs. `stopImmediatePropagation`

You may have also seen a similar method named [`Event.stopImmediatePropagation`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation). To understand the difference between these two methods, we'll modify our example to set multiple event listeners of the same type on the same node. In this case, let's set two capturing event listeners on `document.body`:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
  // 🛑 Stop propagating!
  e.stopPropagation();
}, { capture: true });

document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

In this example, I'm registering:

- One capturing event listener on the window.
- One regular event listener on the window.
- Two capturing event listeners on the body.
- One regular event listener on the button.

The very first capturing event listener on the body calls `Event.stopPropagation`. What do you expect the output to be when the button is clicked this time?

{% codeDemo 'Stopping propagation in the capturing phase on the body, which later registers a second capturing listener' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

`Event.stopPropagation` prevents the event from propagating *to other nodes*, but it does not prevent other event handlers registered on `Event.currentTarget` from running in response to the event in the current phase. So in this example, the capturing event listener on the window runs, and so do both capturing listeners on the body. However, no other event handlers will run because the event is not allowed to propagate further down from the body.

By contrast, `Event.stopImmediatePropagation` is more aggressive than `Event.stopPropagation`, preventing the event from propagating to other nodes in the tree *and* preventing other event handlers set on `Event.currentTarget` from running:

{% capture js %}
```js
window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
}, { capture: true });

window.addEventListener('click', (e) => {
  console.log('window', e.eventPhase);
});

// Body handler 1
document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
  // 🛑 Stop propagating!
  e.stopImmediatePropagation();
}, { capture: true });

// Body handler 2: this will never run
document.body.addEventListener('click', (e) => {
  console.log('body', e.eventPhase);
}, { capture: true });

document.querySelector('button').addEventListener('click', (e) => {
  console.log('button', e.eventPhase);
});
```
{% endcapture %}

{{ js }}

{% codeDemo 'Stopping immediate propagation in the capturing phase on the body, which later registers a second capturing listener' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

Now, if a user clicks the button, we will only see two messages logged:

```
"window" 1
"body" 1
```

Observe that `Event.stopImmediatePropagation` prevented the event from reaching the second event handler on the body. Remember: The order of event handlers on the same node matters! So in this example, because we invoked `Event.stopImmediatePropagation` from the first event listener on the body, the second one did not run. If we had instead called it from the second event handler, then it couldn't have retrospectively prevented the first handler from running.

## Preventing an Event's Default Behavior

Before, I mentioned that all events have a default behavior that depends on the type of event target. Sometimes, these events don't really do anything meaningful, like when you click the empty space on a document or click a button. But other times, events can have noticeable side effects, such as:

- A checkbox that toggles its state,
- A form submission that routes the user to another page,
- The focus and blur events that move your cursor,
- The scroll event that scrolls an overflow container,
- The input event that allows you to type in an input or textarea,
- and much more.

Without default event behaviors, we'd have to reinvent a good chunk of the existing functionality on the web every time we wanted to create a simple interactive web page. Thankfully, that's not the case, and our work is cut out for us.

However, while default event behaviors are useful, we sometimes need to prevent them so we can replace them with our own custom implementations, or to prevent conflicting behaviors from creating confusing user experiences. To do this, we can use the [`Event.preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) method. If [`Event.cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable) is `true`, then this method will, as the name suggests, prevent ("cancel") the default behavior for the event.

{% aside %}
What events aren't cancelable? It varies by browser implementation, but most native events are cancelable. Others, like the `input` event, are not. Additionally, synthetic events—custom ones created with the [`Event()` constructor](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event) as opposed to ones emitted as a result of a user interaction—are also not cancelable.
{% endaside %}

When might you want to prevent the default behavior for an event? Well, perhaps the most classic example of this comes up with HTML forms. When you press the <kbd>Enter</kbd> key anywhere inside a form, it fires the `submit` event. And the default behavior for a form submission is to refresh the page (unless the form uses a `GET` method and has an `action` pointing to a different URL). But that's not always the desired behavior. For example, in an attempt to create a more fluid single-page experience, many apps prevent this default behavior and handle the form data themselves to keep the user on the current page.

Here's an example of preventing the native form submission behavior:

{% capture html %}
```html
<form>
  <label>
    Data
    <input type="text">
    <button type="submit">Submit</button>
  </label>
</form>
```
{% endcapture %}

{% capture js %}
```js
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('submitted form without refreshing');
});
```
{% endcapture %}

{{ html }}

{{ js }}

{% codeDemo 'Preventing the submit event on a form' %}
{{ html }}
{{ js }}
{% endcodeDemo %}

In some cases, preventing the default behavior for an event can have unintended and frustrating consequences for end users if you're not careful. For example, if you prevent the default behavior on key events to implement keyboard shortcuts in your app, you may prevent people from using their familiar browser keyboard shortcuts on your page.

### Default Behavior Runs After the Bubbling Phase

The default behavior for an event only occurs once all event handlers have run for that event and the event has propagated through all of its phases: capturing, targeting, and bubbling. In other words, an event's default behavior will only run after the event completely bubbles as high up as it can go. This means that we have an opportunity to prevent the default event behavior with `Event.preventDefault` not only during the targeting phase but also potentially in the capturing or bubbling phases (if we want to), assuming `Event.cancelable` is `true`.

A simple way to prove this is to run some logic in response to a cancelable event that bubbles (e.g., `submit`) and block the main thread as late as possible in the bubbling phase (i.e., at the `window` level). One way to do this is by showing an `alert`, which opens a browser dialog window that must be dismissed in order for the main thread to resume executing. If our assumption is wrong, and the default behavior doesn't need to wait for the event to fully bubble, then the form should reload the page before the alert appears.

Here's the code for our experiment:

{% capture html %}
```html
<form>
  <label>
    Data
    <input type="text">
    <button type="submit">Submit</button>
  </label>
</form>
```
{% endcapture %}

{% capture js %}
```js
// Log in a 1s timeout so we can tell when the page loads
setTimeout(() => {
  console.log('Page loaded');
}, 1000);

// Submit event bubbles
window.addEventListener('submit', (e) => {
  alert('Pausing. Dismiss this alert to continue.');
});
```
{% endcapture %}

{{ html }}

{{ js }}

{% codeDemo 'Showing a main-thread-blocking JavaScript alert in response to a form submission' %}
{{ html }}
{{ js }}
{% endcodeDemo %}

If you run this code and submit the form, you'll notice that it doesn't reload the frame until *after* the alert is dismissed. Thus, the default behavior for events runs after the bubbling phase, giving us time to run any custom logic we want before the default behavior and potentially even prevent the default behavior in any phase. Here's the same `preventDefault` demo, but this time on the `window` in the bubbling phase:

{% capture js %}
```js
window.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('submitted form without refreshing');
});
```
{% endcapture %}

{{ js }}

{% codeDemo 'Preventing the submit event on a form in the bubbling phase' %}
{{ html }}
{{ js }}
{% endcodeDemo %}

## Performant Event Handling

As we learned, the event handler for an element runs whenever an event propagates to that node. In some cases, event handlers may perform expensive computations or DOM manipulation; we wouldn't want to perform those operations frequently and risk degrading our app's performance. JavaScript apps can use various techniques to address this, including debouncing, throttling, and event delegation.

### Debouncing and Throttling

Some events (like clicks) tend to fire rarely or only during certain user interactions, but other types of events can fire more frequently even under normal circumstances. For example, the `keydown` event fires whenever a user presses a key on their keyboard; if that key remains held down, the `keydown` event will fire continuously, often hundreds of times within just a few seconds. Similarly, the `input` event fires anytime a form input's value changes, which could be often if the user is typing a long message in an HTML input. And the `scroll` event fires *many* times in succession to allow the browser to fluidly animate scroll containers. Type in the textarea below to see just how frequently the event handler logs a message to the console:

{% codeDemo 'Logging a message to the console whenever an HTML textarea value changes' %}
```html
<label for="textarea">Type some text quickly:</label>
<textarea id="textarea"></textarea>
```
```js
document.querySelector('textarea').addEventListener('input', (e) => console.log(e.target.value));
```
{% endcodeDemo %}

Debouncing and throttling are two strategies that can be used to control the number of times a function is called within a given time window. Both are examples of the higher-order function pattern; `debounce` and `throttle` are "wrapper" functions that return an inner function that will ultimately be called, while the outer function manages when the inner function gets to run. The implementation details of these two functions are beyond the scope of this tutorial; see the following post by Josh Comeau for a sample implementation of debounce: [debounce snippet](https://www.joshwcomeau.com/snippets/javascript/debounce/).

#### Debouncing

Debouncing follows a cancel-and-reschedule model; it uses `setTimeout` to schedule expensive callback invocations sometime in the future (specified by a delay in milliseconds) whenever the inner function is called. But whenever the inner function is called, it also cancels any previously scheduled executions. This makes it ideal for event handlers that may run frequently where we don't care about intermediate function calls.

For example, if a user is typing repeatedly in an uncontrolled HTML input, we don't necessarily need to react to every single keystroke since the input already updates its value visually in real time. Instead, we can debounce the input event handler. The following demo uses a handler that's debounced by 200 milliseconds:

{% codeDemo 'Logging a message to the console whenever an HTML textarea value changes, with a debounce of 200 milliseconds' %}
```html
<label for="textarea">Type some text quickly, and then stop:</label>
<textarea id="textarea"></textarea>
```
```js
const debounce = (callback, delayMs) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delayMs);
  }
}

const handleInput = debounce((e) => console.log(e.target.value), 200);
document.querySelector('textarea').addEventListener('input', handleInput);
```
{% endcodeDemo %}

#### Throttling

Throttling is similar to debouncing; it also uses the higher-order function pattern to return an inner function that will eventually be invoked. The main difference is that while debouncing cancels previously queued function calls and doesn't run the inner function if it keeps getting called too frequently, throttling controls the *rate of invocation* for the inner function, ensuring that it gets called in even intervals with a fixed delay between the calls (so long as the function continues to be called). This makes it ideal for scenarios where events naturally fire very frequently and where we care about handling intermediate states. Good candidates for throttling include:

- The `scroll` event,
- The `keydown` event, and
- The `input` event on an HTML slider.

For example, if we were to debounce the `input` handler on an HTML slider, then we wouldn't be able to react to intermediate value changes while the user is sliding it around. Similarly, if we were to debounce a scroll handler on the window, it would fire so frequently that the debounce would cancel every intermediate call until we stopped scrolling. If our event handler updates some UI, it would look like it's janky and lagging between the start and end of the user interaction. By contrast, throttling would slow the rate of updating while still reacting to intermediate states.

### Event Delegation

Other times, we may not need to set event handlers on every single element and can instead take advantage of event propagation to set a single handler on a parent element.

For example, consider this radio group for a website theme picker:

{% capture html %}
```html
<fieldset id="theme-picker">
  <legend>Theme</legend>
  <input id="theme-auto" name="theme" type="radio" value="auto" checked>
  <label for="theme-auto">Auto</label>
  <input id="theme-light" name="theme" type="radio" value="light">
  <label for="theme-light">Light</label>
  <input id="theme-dark" name="theme" type="radio" value="dark">
  <label for="theme-dark">Dark</label>
  <input id="theme-contrast" name="theme" type="radio" value="contrast">
  <label for="theme-contrast">High contrast</label>
</fieldset>
```
{% endcapture %}

{% capture css %}
```css
label {
  display: inline-block;
  margin-inline-start: 4px;
  margin-inline-end: 8px;
}
```
{% endcapture %}

{{ html }}

We _could_ listen for the `input` event on each individual radio button:

{% capture js %}
```js
const themeOptions = document.querySelectorAll('input[name="theme"]');
themeOptions.forEach((option) => {
  option.addEventListener('input', (e) => {
    const theme = e.target.value;
    console.log(theme);
  });
});
```
{% endcapture %}

{{ js }}

And that would give us this result:

{% codeDemo 'Listening to radio input changes without event delegation' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

But we could also take advantage of event bubbling to avoid setting an event listener on each individual radio button. Instead, we can set a single listener on the parent:

{% capture js %}
```js
const themePicker = document.querySelector('#theme-picker');
themePicker.addEventListener('input', (e) => {
  const theme = e.target.value;
  console.log(theme);
});
```
{% endcapture %}

{{ js }}

This is known as <dfn>event delegation</dfn>. We get the same result, but with a minor performance improvement and less code:

{% codeDemo 'Listening to radio input changes with event delegation' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

The reason this works is because the input event bubbles, so we can intercept it not only on the inputs themselves but also on their parents. Also, as we learned, the event target is accessible from any event listener as that event captures or bubbles.

You've probably used event delegation before without realizing it!

## Final Thoughts

While at first it may seem like there's a lot to learn about event handling in JavaScript, it really boils down to understanding the three event phases: capturing, targeting, and bubbling. Once you nail down the basics, you can follow the flow of control more easily in event-driven code and understand when to reach for one technique over another. For example, event delegation is a fairly popular technique, but it requires an understanding of event capturing and bubbling. And since some events don't bubble, you may need to reach for event capturing if you ever need to handle an event higher up in the DOM. Finally, it also helps to understand the differences between `preventDefault`, `stopPropagation`, and `stopImmediatePropagation` so that you don't just try these randomly in the hopes that one of them will work.
