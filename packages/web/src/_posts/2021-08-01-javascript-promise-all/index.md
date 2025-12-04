---
title: A Deep Dive on Promise.all
description: Learn how to use JavaScript's Promise.all method to await multiple async operations, as well as how to write a custom implementation.
keywords: [promise.all, promise, async, javascript]
categories: [javascript, nodejs, async]
commentsId: 104
lastUpdated: 2025-12-04
thumbnail: https://images.unsplash.com/photo-1606674556490-c2bbb4ee05e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

Imagine you need to wait for multiple async tasks to finish. If the order of the tasks is important, you'd probably want to await the Promises one at a time:

```js
await asyncTask(1);
await asyncTask(2);
await asyncTask(3);
```

But what if the order doesn't matter? And what if you want to abort the entire operation as soon as one of these Promises rejects? For example, if just a single step in a sequence of time-sensitive operations were to fail (such as during checkout on an e-commerce site), you probably wouldn't want to make the user wait for all of the checks to finish before telling them that something went wrong—you'd want to notify them immediately, before they grow frustrated and leave the page.

This is such a common use case in JavaScript that Promises have a dedicated method for it: `Promise.all`. In this article, we'll learn how to use `Promise.all` to await multiple async tasks. We'll also [implement our own version of `Promise.all`](#bonus-implementing-promiseall) to better understand how it works under the hood.

{% include "toc.md" %}

## Prerequisites

This article uses the terms _fulfilled_, _rejected_, _pending_, and _settled_ to describe the different states of JavaScript Promises. These are defined in the ES6 specification:

{% quote 'ECMAScript® 2015 Language Specification: 25.4 Promise Objects', 'https://262.ecma-international.org/6.0/#sec-promise-objects' %}
Any Promise object is in one of three mutually exclusive states: fulfilled, rejected, and pending:

- A promise `p` is fulfilled if `p.then(f, r)` will immediately enqueue a Job to call the function `f`.
- A promise `p` is rejected if `p.then(f, r)` will immediately enqueue a Job to call the function `r`.
- A promise is pending if it is neither fulfilled nor rejected.

A promise is said to be settled if it is not pending, i.e. if it is either fulfilled or rejected.
{% endquote %}

In other words:

- A <dfn>fulfilled</dfn> (resolved) Promise is one that has "succeeded" (calls `resolve()`).
- A <dfn>rejected</dfn> Promise is one that has "failed" (calls `reject()`).
- A <dfn>settled</dfn> Promise is one that has fulfilled or rejected (not pending).

Additionally, a Promise:

- <dfn>Executor</dfn> is the function you pass to the `Promise` constructor.
- <dfn>Callback</dfn> is the function that runs after it settles (argument to `then/catch`).

```javascript
new Promise(
  // executor
  (resolve, reject) => {}
)
  .then(
    // callback
    (value) => {}
  )
  .catch(
    // callback
    (reason) => {}
  );
```

{% aside %}
**Note**: The term "callback" more generally refers to any function your code calls at a later point in time (usually asynchronously). Even more loosely, it can also refer to any function passed to another function as an argument regardless of when that function is called. For example, a Promise executor is technically also a callback function (just one that's invoked immediately). The key takeaway here is that "callback" is not a term exclusive to Promises—JavaScript is full of callbacks!
{% endaside %}

## Background

Before we look at `Promise.all`, it helps to start from scratch so we can understand what problems it solves. Otherwise, if we jump straight to the solution, you may not fully appreciate why this method exists.

To keep this article simple, I'll use the following helper `sleep` function that resolves a Promise after some delay in milliseconds. This allows us to simulate code that takes some time to run, like a network request:

```javascript {data-copyable=true}
function sleep(durationMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
```

For demo purposes, we'll represent "tasks" as objects of this shape:

```json
{
  "id": "A",
  "durationMs": 2000,
  "fulfills": true
}
```

This represents some async task "A" that takes 2 seconds to fulfill.

Finally, we'll use the following function to run tasks:

```javascript {data-copyable=true}
async function doTask(task) {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Promise ${task.id}: fulfilled ✅`);
    return Promise.resolve();
  }
  console.log(`Promise ${task.id}: rejected ❌`);
  return Promise.reject();
}
```

### Awaiting Multiple Promises

Let's create some mock tasks and await them one by one:

```javascript {data-copyable=true}
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: true },
];

try {
  for (const task of tasks) {
    await doTask(task);
  }
  console.log('success');
} catch (e) {
  console.log('failure');
}
```

{% codeDemo "Demo of simulating async tasks in JavaScript" %}
```html
<button>Start tasks</button>
```
```css
button {
  padding: 8px;
}
```
```js
function sleep(durationMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
  async function doTask(task) {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Promise ${task.id}: fulfilled ✅`);
    return Promise.resolve();
  }
  console.log(`Promise ${task.id}: rejected ❌`);
  return Promise.reject();
}
async function run() {
  console.log('Starting tasks...');
  const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: true },
];

try {
  for (const task of tasks) {
    await doTask(task);
  }
  console.log('success');
} catch (e) {
  console.log('failure');
}
}

document.querySelector('button').addEventListener('click', run);
```
{% endcodeDemo %}

If you run this code, you should see the following messages logged one at a time:

1. `Promise A: fulfilled ✅` after ~2 seconds (`t=2`).
2. `Promise B: fulfilled ✅` ~3 seconds after A (`t=5`).
3. `Promise C: fulfilled ✅` ~1 second after B (`t=6`).

This code works, but it's slow because it _constructs_ one Promise at a time in each iteration of the `for-of` loop. This means that future Promises aren't constructed until previous ones have fulfilled: Before we can construct B, we need to wait for A to settle, and before we can construct C, we need to wait for both A _and_ B to settle.

If the very first Promise takes a long time to fulfill but future Promises take less time, we end up wasting time because we could've potentially scheduled those faster Promise callbacks to run sooner. In fact, in a real-world implementation, `doTask` would likely make a network request to a server via the `fetch` API. With our current approach, we would make network requests one at a time, which is needlessly slow since most JavaScript runtimes support concurrent network requests.

### Constructing Promises Synchronously

It's more efficient to construct all of the Promises ahead of time (synchronously) and _then_ await them. That way, if the Promise executor functions make network requests, those can be handled concurrently by the runtime. Like this:

```javascript {data-copyable=true}
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: true },
];

try {
  // construct the promises synchronously
  const promises = tasks.map((task) => doTask(task));
  // then await them one at a time
  for (const promise of promises) {
    await promise;
  }
  console.log('success');
} catch (e) {
  console.log('failure');
}
```

In this example, we map each task to the result of `doTask`, which returns a Promise. So we get an array of pending Promises:

```js
// [Promise {<pending>}, ..., Promise {<pending>}]
const promises = tasks.map((task) => doTask(task));
```

This time around, if `doTask` makes a network request, the browser can make multiple concurrent requests because we constructed all of the Promises upfront. We'll still _await_ the Promises one at a time in the order in which they were constructed, but the difference here is that the other network requests can be processed in the background without us having to wait. Thus, assuming the browser makes all of these network requests at the same time, the overall time to completion is only as slow as the slowest response (in this case, roughly 3 seconds).

There's just one problem...

### `UnhandledPromiseRejection`

So far, we've only considered the "happy path" where all of the Promises fulfill. Now, let's update the code to force Promise C to reject so we can see what happens:

```javascript {data-copyable=true}
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  // Promise C rejects ❌
  { id: 'C', durationMs: 1000, fulfills: false },
];

try {
  const promises = tasks.map((task) => doTask(task));
  for (const promise of promises) {
    await promise;
  }
  console.log('success');
} catch (e) {
  console.log('failure');
}
```

{% codeDemo "Demo of unhandled promise rejection errors in JavaScript" %}
```html
<button>Test rejection handling</button>
```
```css
button {
  padding: 8px;
}
```
```js
function sleep(durationMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
  async function doTask(task) {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Promise ${task.id}: fulfilled ✅`);
    return Promise.resolve();
  }
  console.log(`Promise ${task.id}: rejected ❌`);
  return Promise.reject();
}
async function run() {
  console.log('Starting tasks...');
  const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  // Promise C rejects ❌
  { id: 'C', durationMs: 1000, fulfills: false },
];

try {
  const promises = tasks.map((task) => doTask(task));
  for (const promise of promises) {
    await promise;
  }
  console.log('success');
} catch (e) {
  console.log('failure');
}
}

document.querySelector('button').addEventListener('click', run);
```
{% endcodeDemo %}

If you run this code, you'll get an `UnhandledPromiseRejection` error when Promise C rejects. In Node.js, the stack trace for the error provides more context:

```
Promise C: rejected ❌
node:internal/process/promises:288
            triggerUncaughtException(err, true /* fromPromise */);
            ^

[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "undefined".] {
  code: 'ERR_UNHANDLED_REJECTION'
}
```

This might confuse you at first since we wrapped all of the code in a `try-catch` block, and the `catch` block did execute because we saw the string `"failure"` logged to the console at the very end. Part of why the problem is so hard to spot is because `async`/`await` hides what's really going on under the hood, which is effectively this:

```js
const promises = tasks.map((task) => doTask(task));

let sequence = Promise.resolve();
for (const promise of promises) {
  sequence = sequence.then(() => promise);
}
sequence
  .then(() => console.log('success'))
  .catch(() => console.log('failure'));
```

Notice how the individual Promises never have `.catch` handlers attached to them in this de-sugared version, so individual rejections will go uncaught. The overall promise rejection will get handled correctly, but individual ones won't.

There are two ways to fix this problem:

1. Go back to the old approach of constructing the Promises one at a time (slow).
2. Construct _and_ await the Promises synchronously.

{% aside %}
Technically there's a third solution, but it's a bit hacky. See Jake Archibald's article here: [The gotcha of unhandled promise rejections](https://jakearchibald.com/2023/unhandled-rejections/).
{% endaside %}

We already tried the first approach, so here's the second one:

```javascript {data-copyable=true}
async function doTask(task) {
  await sleep(task.durationMs);
  return task.fulfills ? Promise.resolve() : Promise.reject();
}

const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: false },
];

tasks.forEach((task) => {
  doTask(task)
    .then(() => console.log(`Promise ${task.id}: fulfilled ✅`))
    .catch(() => console.log(`Promise ${task.id}: rejected ❌`));
});
```

While this refactor fixes the unhandled rejection, it also introduces a major problem.

On the one hand, because we're no longer awaiting the Promises one at a time like we were with the `for-of` loop, the Promise callbacks can now run in a first-come first-served basis in [the event loop's microtask queue](https://www.youtube.com/watch?v=cCOL7MC4Pl0&vl=en). So while we do construct the Promise objects in order—first A, then B, and finally C—we don't need to _await_ the Promises in that same order. Thus, the callback for C will queue up first in the event loop because it's the fastest, followed by the callbacks for A and B.

Unfortunately, this code is also not what we want. While it's faster than what we started with and doesn't throw any `UnhandledPromiseRejection` errors because we're now correctly catching individual Promise rejections, it doesn't actually wait for all of the Promises to settle before it runs any code that comes after the `forEach` loop. We want to await _all_ of the Promises before we do anything else, but we can't do that with this code unless we refactor it even more. Don't get me wrong: It's doable, and we'll look at how it's done in the bonus section on [implementing `Promise.all` from scratch](#bonus-implementing-promiseall), but it's not something you want to do by hand.

At this point, we're ready to learn how `Promise.all` solves all of these problems.

## Solution: `Promise.all`

[`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) takes an iterable of Promises and returns a new outer Promise that fulfills once all of the individual Promises have fulfilled and rejects as soon as a single Promise rejects. Moreover, if `Promise.all` fulfills, [it does so with an array of all individual fulfilled values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#fulfillment).

```javascript {data-copyable=true}
try {
  const values = await Promise.all([p1, p2, ..., pn]);
  console.log('All promises fulfilled', values);
} catch (e) {
  console.log('A promise rejected');
}
```

Like our custom approach in [Constructing Promises Synchronously](#constructing-promises-synchronously), `Promise.all` is faster than awaiting Promises one at a time since the Promises have already been constructed by the time `Promise.all` is invoked:

```javascript {data-copyable=true}
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: true },
];
try {
  const promises = tasks.map((task) => doTask(task));
  await Promise.all(promises);
  console.log('Promise.all fulfilled');
} catch (e) {
  console.log('Promise.all rejected');
}
```

{% codeDemo "Demo of awaiting multiple promises with promise.all" %}
```html
<button>Start tasks (with Promise.all)</button>
```
```css
button {
  padding: 8px;
}
```
```js
function sleep(durationMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
  async function doTask(task) {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Promise ${task.id}: fulfilled ✅`);
    return Promise.resolve();
  }
  console.log(`Promise ${task.id}: rejected ❌`);
  return Promise.reject();
}
async function run() {
  console.log('Starting tasks...');
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: true },
];
try {
  const promises = tasks.map((task) => doTask(task));
  await Promise.all(promises);
  console.log('Promise.all fulfilled');
} catch (e) {
  console.log('Promise.all rejected');
}
}

document.querySelector('button').addEventListener('click', run);
```
{% endcodeDemo %}

If you compare this to output of the very first demo, the difference is substantial: Whereas before we had to wait six seconds for all the tasks to finish because we were constructing and awaiting the Promises one at a time, we are now only waiting at most three seconds total (give or take) because the Promise objects are all constructed synchronously and allowed to settle on a first-come, first-served basis.

Imagine if the Promise executor function for `doTask` initiates a network request. We could see a big boost in performance because those network requests would start concurrently by the browser as soon as the Promises are constructed. By contrast, in our very first `for-of` loop approach, we'd have to make one network request at a time, in each iteration of the loop. If the first request takes a long time to settle, then the construction of future Promises will be needlessly delayed.

{% aside %}
However, don't mistake `Promise.all` for true parallelism; the Promise _callbacks_ will still queue up one at a time in the event loop and never run simultaneously. Queues always pop one item at a time, and the event loop only ever runs one thing at a time.
{% endaside %}

Unlike the code we wrote by hand earlier, the `Promise.all` version won't throw an unhandled promise error. That's because `Promise.all` internally does what we did before by hand: It loops over the Promise objects synchronously and attaches `.then` and `.catch` callbacks to each one. If any individual Promise rejects, it rejects the outer Promise. Only once all of the Promises have fulfilled will it fulfill the outer Promise. (We'll look at how this is implemented [in a future section](#bonus-implementing-promiseall)).

### Fail-Fast Promise Rejection

Consider again the case where Promise C rejects:

```javascript {data-copyable=true}
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: false }, // rejects
];
try {
  await Promise.all(tasks.map((task) => doTask(task)));
  console.log('Promise.all fulfilled');
} catch (e) {
  console.log('Promise.all rejected');
}
```

{% codeDemo "Demo of awaiting multiple promises with promise.all, but one of them rejects" %}
```html
<button>Test fail-fast rejection</button>
```
```css
button {
  padding: 8px;
}
```
```js
function sleep(durationMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
  async function doTask(task) {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Promise ${task.id}: fulfilled ✅`);
    return Promise.resolve();
  }
  console.log(`Promise ${task.id}: rejected ❌`);
  return Promise.reject();
}
async function run() {
  console.log('Starting tasks...');
const tasks = [
  { id: 'A', durationMs: 2000, fulfills: true },
  { id: 'B', durationMs: 3000, fulfills: true },
  { id: 'C', durationMs: 1000, fulfills: false },
];
try {
  const promises = tasks.map((task) => doTask(task));
  await Promise.all(promises);
  console.log('Promise.all fulfilled');
} catch (e) {
  console.log('Promise.all rejected');
}
}

document.querySelector('button').addEventListener('click', run);
```
{% endcodeDemo %}

If you run this code, you'll get the following output:

```
Promise C: rejected ❌
Promise.all rejected
Promise A: fulfilled ✅
Promise B: fulfilled ✅
```

First, notice that Promise C rejects early because we aren't waiting for other Promises to settle before we construct and await it. But more importantly, `Promise.all` rejects immediately after Promise C rejects, and there are no uncaught rejections. This is great because it means we don't have to wait for the remaining Promises to settle—we can immediately begin handling the error case as soon as a single Promise rejects. This behavior is known as <dfn>fail-fast</dfn>; it solves the problem I alluded to in the intro, where you don't want to keep a user waiting if just one task in a pipeline fails.

### `Promise.all` Doesn't Cancel Pending Promises

It may surprise you that Promises A and B still fulfilled after `Promise.all` rejected:

```
Promise.all rejected ❌
Promise A: fulfilled ✅
Promise B: fulfilled ✅
```

This is working as expected because `Promise.all` doesn't _cancel_ the remaining Promise callbacks when it rejects. Thus, the remaining Promise callbacks still get queued in the event loop and run when it's their turn. So even though `Promise.all` rejected after Promise C rejected, Promises A and B still got a chance to settle. It's just that we didn't have to _wait_ for those other Promises to settle before we rejected the outer Promise, allowing us to handle rejections as early as possible.

What would happen if Promises A or B were to also reject after `Promise.all` rejected? Technically, they would just reject `Promise.all`'s already-rejected Promise. And rejecting a settled Promise doesn't do anything.

## Implementing `Promise.all`

We learned what `Promise.all` is and how to use it, but how does it work under the hood? Let's try implementing our own `Promise.all` as an exercise by putting together everything we've learned so far.

Per its specification, `Promise.all` must accept an iterable of Promises and return a new Promise. So the skeleton for the method might look like this:

```javascript {data-copyable=true}
Promise.all = function (promisesIterable) {
  const promises = Array.from(promisesIterable);
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      // ...
    });
  });
};
```

Note that I'm first converting the iterable argument to an array using `Array.from`. This is because `Promise.all`, like other Promise methods, accepts an iterable as an argument; iterables don't have a length property, while arrays do, and we need to know how many Promises there are in total so we can keep track of when all of them have fulfilled. All arrays are iterables, but not all iterables are arrays.

That `forEach` loop may seem familiar, and you may think that this code runs into the original problem, but take a closer look—by the time we enter the loop, we've already constructed all of the Promise objects that we intend to await. So all that remains is to attach `.then` and `.catch` callback functions to each one, independently. Here's the full code:

```javascript {data-copyable=true}
Promise.all = function (promisesIterable) {
  const fulfilledValues = [];
  const promises = Array.from(promisesIterable);
  const promiseCount = promises.length;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      // Await each promise, one at a time, independently.
      // Callbacks will queue up in the order they fulfill.
      promise
        .then((value) => {
          // Keep track of fulfilled values
          fulfilledValues[index] = value;

          // This must mean that all promises fulfilled.
          // So we fulfill the outer promise.
          if (fulfilledValues.length === promiseCount) {
            // Promise.all fulfills with an array of
            // all individual fulfilled values
            resolve(fulfilledValues);
          }
        })
        // If any individual promise was rejected,
        // we immediately reject the outer promise.
        .catch((e) => {
          reject(e);
        });
    });
  });
};
```

Each time a Promise fulfills, we keep track of its value in an array. An important requirement is that `Promise.all` must fulfill with values in the same order as the original Promises, so a simple `Array.prototype.push` wouldn't work here—because if a Promise that appears later in the array fulfills first, then its fulfilled value would appear first in the `push` version, making this code unpredictable:

```javascript
const [a, b, c] = await Promise.all([A, B, C]);
```

So instead, we use the array index of each Promise to set its resolved value:

```javascript
fulfilledValues[index] = value;
```

{% aside %}
(Thanks to Chris Opperwall for clarifying that implementation detail in this article: [Implementing Promise.all](https://medium.com/@copperwall/implementing-promise-all-575a07db509a).)
{% endaside %}

Additionally, whenever a Promise fulfills, we check if `fulfilledValues.length` equals the total number of Promises. If it does, then all Promises have fulfilled, so we fulfill the outer Promise:

```js
if (fulfilledValues.length === promiseCount) {
  resolve(fulfilledValues);
}
```

Otherwise, if at any point a single Promise is rejected or an error is thrown, we reject the outer Promise.

There's one edge case that our code doesn't handle: an empty iterable. [According to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#return_value), `Promise.all` should fulfill immediately in this case. Since we already know the length of `promisesIterable`, we can handle this edge case early.

```javascript {data-copyable=true}
Promise.all = function (promisesIterable) {
  const fulfilledValues = [];
  const promises = Array.from(promisesIterable);
  const promiseCount = promises.length;

  return new Promise((resolve, reject) => {
    if (promiseCount === 0) {
      resolve([]);
      return;
    }
    promises.forEach((promise, index) => {
      promise
        .then((value) => {
          // Keep track of fulfilled values
          fulfilledValues[index] = value;

          // This must mean that all promises fulfilled.
          // So we fulfill the outer promise.
          if (fulfilledValues.length === promiseCount) {
            // Promise.all fulfills with an array of
            // all individual fulfilled values
            resolve(fulfilledValues);
          }
        })
        // If any individual promise was rejected,
        // we immediately reject the outer promise.
        .catch((e) => {
          reject(e);
        });
    });
  });
};
```

That's it for the custom implementation. If you now override `Promise.all` with this and re-run the code from this demo, you should see the same result as before. However, it's worth noting that since this is a naive implementation, it's unlikely to match the behavior of the real `Promise.all` exactly, so you shouldn't ever use this in production. But it's a good exercise nonetheless.
