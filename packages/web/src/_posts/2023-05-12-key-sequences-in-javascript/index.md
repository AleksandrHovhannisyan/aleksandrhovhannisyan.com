---
title: Listening for Key Sequences in JavaScript
description: Learn how to implement a simple algorithm that listens for a specific sequence of keystrokes in JavaScript, with an optional delay between keys.
keywords: [key sequence]
categories: [javascript]
lastUpdated: 2024-10-20
commentsId: 193
---

Most programming languages have standard libraries or APIs that allow you to listen for keystrokes. Sometimes, though, you need to listen for a particular _sequence_ of keystrokes and not just a _single_ keystroke. For example, many old video games had cheat codes that required players to press some secret combination of buttons to unlock hidden superpowers that the developers embedded in the game. Another example of this can be found on the web: If you've ever visited localhost in Chrome with an expired SSL dev certificate, you've probably been greeted by the "Your connection is not private" warning page, which you can temporarily bypass by ghost-typing the passphrase `thisisunsafe` anywhere on the page. Both of these are use cases for key sequence listeners.

We can take this idea a step further and even enforce an optional delay between keystrokes, as we'll do in this tutorial. You can play around with this idea in the following interactive demo:

{% capture html %}
```html
<table>
  <thead>
    <tr>
      <th scope="col">Key</th>
      <th scope="col">Time to next key (ms)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>a</code></td>
      <td><code>2000</code></td>
    </tr>
    <tr>
      <td><code>b</code></td>
      <td><code>1000</code></td>
    </tr>
    <tr>
      <td><code>c</code></td>
      <td></td>
    </tr>
  </tbody>
</table>
```
{% endcapture %}
{% capture css %}
```css
table {
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
  margin-bottom: 4px;
}
table,
th,
td {
  border: solid 1px;
}
td,
th {
  padding: 0.25em 0.5em;
}
th {
  background-color: hsl(0, 0%, 95%);
}
:is(td,th):nth-child(2) {
  text-align: end;
}
tr[aria-current="true"] {
  background-color: #f6f6b1;
}
tr[aria-selected="true"] {
  background-color: #d4f5c8;
}
```
{% endcapture %}
{% capture js %}
```js
const table = document.querySelector('tbody');
const keys = Array.from(table.querySelectorAll(':is(td,th):nth-child(1)')).map((cell) => cell.textContent);
const timeToNextKeyMs = Array.from(table.querySelectorAll(':is(td,th):nth-child(2)')).map((cell) => Number(cell.textContent) || undefined);

const keySequenceJson = keys.map((key, index) => ({
  key,
  timeToNextKeyMs: timeToNextKeyMs[index]
}));

const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;
  let timeoutId;

  const setIndex = (newIndex) =>
    requestAnimationFrame(() => {
      // Resetting
      if (newIndex === 0) {
        index = newIndex;
        Array.from(table.rows).forEach((row, index) => {
        	// When resetting, all rows must clear their success state
          row.setAttribute('aria-selected', false);
          // When resetting, the first row becomes active and all others inactive
          row.setAttribute('aria-current', index === 0);
        });
        return;
      }
      // Previous row is no longer active
      table.rows[index].setAttribute('aria-current', false);
      // But it was selected
      table.rows[index].setAttribute('aria-selected', true);
      // Update index
      index = newIndex;
      // New row is active/next target
      table.rows[index].setAttribute('aria-current', true);
    });

	// Init
  setIndex(0);

	// This handler can be passed to any key listener
  return (e) => {
    // Clear previous timer (if any)
    clearTimeout(timeoutId);

    const {
      key,
      timeToNextKeyMs
    } = keySequence[index];

    // Keystroke matches the target one for our current position
    if (e.key === key) {
      console.log(`✅ ${key} was pressed`);
      // Success! Invoke the callback.
      if (index === keySequence.length - 1) {
        callback();
      }
      // Set up new timer if there's a specified delay
      else if (typeof timeToNextKeyMs !== 'undefined') {
        timeoutId = setTimeout(() => {
            console.log("⏰ Time's up!");
            setIndex(0);
        }, timeToNextKeyMs);
      }
      // Move up, wrapping as needed
      setIndex((index + 1) % keySequence.length);
    } else {
      console.log(`❌ expected ${key} but received ${e.key}`)
      // Key didn't match; start over
      setIndex(0);
    }
  };
};

const listener = makeKeySequenceListener(keySequenceJson, () => console.log("🎉 Key sequence completed!"));
document.addEventListener('keyup', listener);
```
{% endcapture %}

{% codeDemo 'Listening for the key sequence abc, with a two-second delay between a and b and a one-second delay between b and c.' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

In this article, we'll implement a simple algorithm to listen for key sequences in JavaScript. Note that while certain code constructs are specific to JavaScript, the logic can still be easily ported to other programming languages.

## Naive Approach

A first-pass approach is to build up a string from individual keystrokes and, on each keystroke, check if the assembled string matches the target sequence. We'll write a higher-order function that accepts two arguments:

1. A list of keys to listen for, and
2. A callback to invoke once the key sequence has been completed.

Our factory function will return a function that can be passed to any event subscription. This keeps our API flexible since consumers can register the returned function as either a `keydown` or `keyup` handler on any element:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let keys = '';

  return (e) => {
    // Add the current key to the chain
    keys += e.key;
    // If we matched the target key sequence, invoke callback
    if (keys === keySequence) {
      callback();
      // Reset so we can loop back around again
      keys = '';
    } else if (!keySequence.startsWith(keys)) {
      // Key sequence doesn't match, reset
      keys = '';
    }
  };
};
```

Resetting `keys` to an empty string in the success and error cases ensures that the next keystroke starts from the beginning. For example, if a user enters an incorrect key at any point, we'll reset without invoking the callback.

Here's an example of how you might use this code:

```js {data-copyable="true"}
const listener = makeKeySequenceListener('thisisunsafe', () => {
  alert('done')
});
document.addEventListener('keyup', listener);
```

While building up a string from individual keystrokes is an intuitive way of visualizing this problem, we can do better.

## Sliding Index

Rather than building up a string character by character, we can use a sliding index pointer and an array (or string) of keys to listen for. The index will start off at zero. On each keystroke, we'll check if the input key matches the expected key at the current index. If it does, we'll increment the index. If it doesn't, we'll clear all progress by resetting the index to zero. On each successful key match, we'll also check if the index happens to be the last in the sequence, which signals that the user correctly entered all keys. In that case, we'll invoke the callback. Here's the updated code:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;

  return (e) => {
    // Keystroke matches the target one for our current position
    if (e.key === keySequence[index]) {
      // Success! Invoke the callback.
      if (index === keySequence.length - 1) {
        callback();
      }
      // Move up, wrapping as needed
      index = (index + 1) % keySequence.length;
    } else {
      // Key didn't match; start over
      index = 0;
    }
  };
};
```

This works exactly the same as before, except it doesn't require assembling a string as we go along. The string is already provided to us as an argument, so all we need to do is check one key at a time as those events come in.

## Key Sequence with Delays

Currently, our key listener is generous and doesn't care how long it takes for a user to enter the next key in the sequence. If instead we wanted to enforce a delay between keys, we could do so by turning our key sequence into an array of objects of this shape:

```json
[
  {
    "key": "a",
    "timeToNextKeyMs": 2000
  },
  {
    "key": "b",
    "timeToNextKeyMs": 1000
  },
  {
    "key": "c"
  }
]
```

In this example, we're listening for the key sequence `abc`, with a two-second window between the `a` and `b` and one second between `b` and `c`. If the user inputs `a` and two seconds pass without us receiving the next key in the sequence, our code should reset to the beginning. Otherwise, if the user inputs `b` within two seconds, we should move on to the next key and kick off its timer (if it has one).

Let's first update our code to account for the new data shape, which uses an array of objects rather than a string of characters:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;

  return (e) => {
    // 👇 keySequence is now an array of objects
    if (e.key === keySequence[index].key) {
      if (index === keySequence.length - 1) {
        callback();
      }
      index = (index + 1) % keySequence.length;
    } else {
      index = 0;
    }
  };
};
```

To implement the new timing requirement, we can use `setTimeout` to reset `index` to `0` once the timer goes off. If the user manages to input the next key before the timeout fires, we'll cancel the pending timeout. We'll actually want to clear the timeout on any keystroke: both correct and incorrect. Here's the updated code:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;
  let timeoutId;

  return (e) => {
    // Clear previous timer (if any) on each key press
    clearTimeout(timeoutId);

    const { key, timeToNextKeyMs } = keySequence[index];

    // Keystroke matches the target one for our current position
    if (e.key === key) {
      // Success! Invoke the callback.
      if (index === keySequence.length - 1) {
        callback();
      }
      // Set up new timer if there's a specified delay
      else if (typeof timeToNextKeyMs !== 'undefined') {
        timeoutId = setTimeout(() => index = 0, timeToNextKeyMs);
      }
      // Move up, wrapping back to the start as needed
      index = (index + 1) % keySequence.length;
    } else {
      // Key didn't match; start over
      index = 0;
    }
  };
};
```

And that's it for the code.

