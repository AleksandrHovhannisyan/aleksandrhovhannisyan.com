---
title: Listening for Key Sequences in JavaScript
description: Learn how to implement a simple algorithm that listens for a specific sequence of keystrokes in JavaScript, with an optional delay between keys.
keywords: [key sequence]
categories: [javascript]
---

Most programming languages have standard libraries or APIs that allow you to listen for keystrokes. Sometimes, though, you need to listen for a particular _sequence_ of keystrokes and not just a _single_ keystroke. For example, many old video games had cheat codes that required players to press some secret combination of buttons to unlock hidden superpowers that the developers embedded in the game. Another example of this can be found on the web: If you've ever visited localhost in Chrome with an expired SSL dev certificate, you've probably been greeted by the "Your connection is not private" warning page, which you can temporarily bypass by ghost-typing the passphrase `thisisunsafe` anywhere on the page. Both of these are use cases for key sequence listeners.

We can take this idea a step further and even enforce an optional delay between keystrokes, as we'll do in this tutorial. You can play around with this in the following interactive demo.

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
const timeToNextKey = Array.from(table.querySelectorAll(':is(td,th):nth-child(2)')).map((cell) => Number(cell.textContent) || undefined);

const keySequenceJson = keys.map((key, index) => ({
  key,
  timeToNextKey: timeToNextKey[index]
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
    const {
      key,
      timeToNextKey
    } = keySequence[index];

    // Keystroke matches the target one for our current position
    if (e.key === key) {
      console.log(`✅ correct!`);
      // Success! Invoke the callback.
      if (index === keySequence.length - 1) {
        callback();
      }
      // Clear previous timer (if any)
      clearTimeout(timeoutId);
      // Set up new timer if there's a specified delay
      if (timeToNextKey) {
        timeoutId = setTimeout(() => {
            console.log("⏰ time's up!");
            setIndex(0);
        }, timeToNextKey);
      }
      // Move up, wrapping as needed
      setIndex((index + 1) % keySequence.length);
    } else {
      console.log(`❌ incorrect, expected ${key} but received ${e.key}`)
      // Key didn't match; start over
      setIndex(0);
      // Not strictly necessary
      clearTimeout(timeoutId);
    }
  };
};

const listener = makeKeySequenceListener(keySequenceJson, () => console.log("🎉 Well done!"));
document.addEventListener('keyup', listener);
```
{% endcapture %}

{% codeDemo 'Listening for the key sequence abc, with a two-second delay between a and b and a one-second delay between b and c.' %}
{{ html }}
{{ css }}
{{ js }}
{% endcodeDemo %}

In this article, we'll implement a simple algorithm to detect key sequences in JavaScript. Note that while certain code constructs will be specific to JavaScript, the logic can still be easily ported to other programming languages.

## Naive Approach

A first-pass approach is to build up a string from individual keystrokes and, on each keystroke, check if the assembled string matches the one that we're looking for. We'll write a higher-order function that accepts a list of keys to listen for and a callback that we'll invoke when the key sequence is completed. Our factory function returns a key listener that we can pass to any event subscription:

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

Here's a sample usage of this code:

```js {data-copyable="true"}
const listener = makeKeySequenceListener('thisisunsafe', () => alert('done'));
document.addEventListener('keyup', listener);
```

While building up a string from individual keystrokes is certainly an intuitive way to visualize this problem, it isn't strictly necessary.

## Sliding Index

Rather than building up the string character by character, we can instead use a sliding index pointer and an array of keys to listen for. The index will start off at zero. On each keystroke, we'll check if the input key matches the expected key at the current index. If it does, we'll increment the index. If it doesn't, we'll clear all progress by resetting the index to zero. On each key match, we'll also check if the index happens to be the last in the sequence, which signals that the user correctly entered all keys. In that case, we'll invoke the callback. Here's the updated code:

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
    "timeToNextKey": 2000
  },
  {
    "key": "b",
    "timeToNextKey": 1000
  },
  {
    "key": "c"
  }
]
```

In this scenario, we're listening for the key sequence `abc`, with a two-second window between the `a` and `b` and one second between `b` and `c`. Once two seconds have elapsed after inputting `a` without inputting the next key in the sequence, we should restart. Otherwise, if the user inputs `b` within two seconds, we should move on to the next key and kick off its timer (if it has one).

Let's first update our code to account for the new data shape, which uses an array of objects rather than a simple array of key characters:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;

  return (e) => {
    // keySequence is now an array of objects
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

To implement the new timing requirement, we can use `setTimeout` to kick off a timer that resets `index` to `0`. If the user manages to enter the next key in time before this timeout has a chance to fire, we'll simply cancel the timeout. Otherwise, the timeout will fire and the user's progress will reset:

```js {data-copyable="true"}
const makeKeySequenceListener = (keySequence, callback) => {
  let index = 0;
  let timeoutId;

  return (e) => {
    const { key, timeToNextKey } = keySequence[index];

    // Keystroke matches the target one for our current position
    if (e.key === key) {
      // Success! Invoke the callback.
      if (index === keySequence.length - 1) {
        callback();
      }
      // Clear previous timer (if any)
      clearTimeout(timeoutId);
      // Set up new timer if there's a specified delay
      if (timeToNextKey) {
        timeoutId = setTimeout(() => index = 0, timeToNextKey);
      }
      // Move up, wrapping as needed
      index = (index + 1) % keySequence.length;
    } else {
      // Key didn't match; start over
      index = 0;
      // Clear any lingering timer
      clearTimeout(timeoutId);
    }
  };
};
```

