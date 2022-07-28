---
title: Be Careful with Async Functions that Return Booleans
description: Suppose an async function returns a boolean. What happens if you check the return value without awaiting it?
keywords: [async functions]
categories: [javascript, promises]
thumbnail: ./images/thumbnail.png
---

Here's a fun bug I recently encountered... Let's say we have this `async` JavaScript function:

```javascript {data-copyable=true}
const isBroken = async () => {
  return false;
}

if (isBroken()) {
  throw new Error("Oopsie woopsie");
}
```

I've kept the code simple for this post so it's easier to analyze. In reality, you'd probably fetch data or perform some other async operation:

```javascript
const isBroken = async () => {
  const result = await someAsyncOperation();
  return result !== 'the expected value';
}

if (isBroken()) {
  throw new Error("Oopsie woopsie");
}
```

Either way, does the body of the `if` statement execute? Take a second to think this through. You can check if you're right by copying the first code sample and executing it in your dev tools.

(You can probably already guess the answer, though, just based on the fact that I'm writing this post.)

## Async Functions, Booleans, and Truthiness: A Slippery Bug

The `if` statement in this code will *always* execute its body, regardless of what the async function returns. ESLint won't flag this as an error. TypeScript technically *should*, [but it has not yet implemented this warning](https://github.com/microsoft/TypeScript/issues/25330) for un-awaited async functions.

To understand why the expression always evaluates to `true`, recall that `async/await` is just syntactic sugar for Promises. In JavaScript, an `async` function actually wraps its return value in a `Promise` object—even if it seems like the function is directly returning a value, and even if the function does not `await` anything.

We can verify this by logging the function call:

```
> console.log(isBroken())
Promise {<fulfilled>: false}
```

Our async function's return value is not `false` itself but rather a Promise object that *resolved* with the value `false`. In other words, it's the same as doing this:

```javascript {data-copyable=true}
const isBroken = () => {
  return Promise.resolve(false);
}

if (isBroken()) {
  throw new Error("Oopsie woopsie");
}
```

Spot the problem? This is an issue of **truthiness**: a `Promise` object is not one of the [eight falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) in JavaScript, so checking its truthiness is pointless: When coerced to a boolean, a Promise is *always* `true`.

For the code above to work as intended, you'll need to `await` the result in another `async` function (or, equivalently, chain a `.then` call on the returned Promise object):

```javascript {data-copyable=true}
const isBroken = async () => {
  return false;
}

const main = async () => {
  const somethingIsWrong = await isBroken();

  if (somethingIsWrong) {
    throw new Error("Oopsie woopsie");
  }
}
```

Basic tests will catch this bug before you ever need to go looking for it yourself. But if you don't have any in place, it could easily slip right past you unless you remember that the function is async.

{% include "unsplashAttribution.md" name: "STIL", username: "stilclassics", photoId: "wtqe5nd5MYk" %}
