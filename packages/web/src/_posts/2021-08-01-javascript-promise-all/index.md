---
title: Awaiting Multiple Promises with Promise.all
description: Learn how to use JavaScript's Promise.all method to await multiple async operations, as well as how to write a custom implementation of Promise.all.
keywords: [promise.all, promise, async, javascript]
categories: [javascript, async]
commentsId: 104
lastUpdated: 2024-03-07
thumbnail: https://images.unsplash.com/photo-1606674556490-c2bbb4ee05e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

Imagine you're creating an app that allows users to batch-upload files. You need to wait until all of the files have finished uploading so you can notify the user and update the UI. But the files all depend on each other, so if just one file fails to upload, you want to cancel the entire operation and start over.

{% aside %}
This may not necessarily be true in a real app—if some files were successfully uploaded, you wouldn't want to discard that work and start over. But just humor me here.
{% endaside %}

This sounds like a job for Promises since file uploads are asynchronous. But in this example, each upload would return its own Promise. You know how to await *individual* Promises, but how do you await several Promises to know when they've *all* fulfilled?

Waiting for multiple async operations to finish is such a common task in JavaScript that Promises have a purpose-built method for it: `Promise.all`. In this article, we'll learn how to use `Promise.all` to await multiple async tasks. Towards the end, we'll also write our own implementation of `Promise.all` to better understand how it works under the hood.

{% include "toc.md" %}

## Naive Approach

As a first attempt, we can await each Promise and keep a running tally of how many Promises have fulfilled so far. In our example, we know how many total files the user wants to upload because that's just the length of the input array. So if the number of fulfilled Promises ever equals this length, then we know that all files have finished uploading:

```javascript
const uploadFiles = (files) => {
  let uploadCount = 0;

  const uploadFile = async (file) => {
    try {
      await upload(file);
      uploadCount++;

      if (uploadCount === files.length) {
        console.log(`uploaded all files`);
      }
    } catch (e) {
      console.log(`failed to upload file: ${file.src}`);
    }
  }

  for (const file of files) {
    await uploadFile(file);
  }
}
```

This sort of works, but it's slow—we don't create future Promises until the current one is created and eventually settled. Imagine a scenario where the Promises that appear early in the array take forever to settle, while Promises that come later in the array settle very quickly. We'd end up wasting time because we could've potentially scheduled those faster Promise callbacks to run first, if only we had created all of the Promises in one go before awaiting them. Moreover, what happens if a single file fails to upload? We'll continue waiting for the other Promises to settle even though we don't need to—we know one has already failed, so we want to stop immediately and treat the whole `uploadFiles` operation as having failed.

We could try fixing these problems by hand, but there's a better way.

## Solution: `Promise.all`

[`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) is a method that takes an iterable (e.g., array) of Promises and returns a new, final Promise. This returned Promise fulfills once all of the individual Promises have fulfilled, and it rejects as soon as a single Promises rejects.  Moreover, if `Promise.all` fulfills, [it does so with an array of all individual fulfilled values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#fulfillment).

```javascript
try {
  const values = await Promise.all([p1, p2, ..., pn]);
  console.log('All promises fulfilled', values);
} catch (e) {
  console.log('A promise rejected');
}
```


Notably, `Promise.all` is faster than a `for-of` loop because all of the Promises have already been constructed by the time `Promise.all` is invoked. Consider this example where we initiate three network requests synchronously and then await all of them:

```js
// Create three promises
const p1 = fetch('/p1');
const p2 = fetch('/p2');
const p3 = fetch('/p3');

// p1, p2, p3 are promises that have already
// been constructed by the time Promise.all is called
await Promise.all([p1, p2, p3]);
```

If the Promise executor functions initiate network requests like they do in this example, then we could see a substantial boost in performance because those network requests would be performed concurrently by the browser as soon as the Promises are created on the first three lines. By contrast, in the for-of loop approach, we would have to make one network request at a time, in each iteration of the loop. If the first request takes forever to settle, then future promises would not be created for potentially a very long time.

However, don't mistake `Promise.all` for true parallelism; the promise _callbacks_ will still queue up one at a time in [the event loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0&vl=en) and never run simultaneously. Queues always pop one item at a time, and the event loop only ever runs one thing at a time.

### Example: Awaiting Multiple Async Tasks

All of the code we've looked at so far has been purely hypothetical; let's now start looking at some examples you can run locally.

To keep this article simple, I won't use any real-world data. Instead, I'll simulate asynchronous operations with a helper sleep function that returns a Promise and fulfills it after some time:

```javascript {data-copyable=true}
const sleep = (durationMs) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs);
  });
}
```

{% aside %}
You can learn more about this technique in my article on [practical use cases and examples of JavaScript Promises](/blog/javascript-promise-tricks/).
{% endaside %}

```javascript
const someAsyncFn = async () => {
  doSomething();

  // wait one second before running
  // any code after this line
  await sleep(1000);

  doSomethingElse();
}
```

We can use this function to simulate an async task that takes some time to complete:

```javascript {data-copyable=true}
const doTask = async (task) => {
  await sleep(task.durationMs);
  console.log(`Task ${task.id}: completed ✅`);
};
```

Note that this function implicitly returns a fulfilled promise thanks to the `async/await` syntax sugar. It's basically the same as doing an explicit return statement like this:

```js
return Promise.resolve();
```

Now, let's use `Promise.all` to log a message once all of the Promises have fulfilled:

```javascript {data-copyable=true}
const doTasks = async (tasks) => {
  try {
  const values = await Promise.all(tasks.map(doTask));
  console.log('All tasks completed 🎉');
  } catch (e) {
    console.log('Promise.all rejected 🛑');
  }
};

// Task 0 takes 2 seconds (middle)
// Task 1 takes 3 seconds (slowest)
// File 2 takes 1 second (fastest)
doTasks([
  { id: 0, durationMs: 2000 },
  { id: 1, durationMs: 3000, },
  { id: 2, durationMs: 1000 }
]);
```

In this example, we queue up three Promise callbacks:

- Task 0 after two seconds,
- Task 1 after three seconds, and
- Task 2 after one second.

Note that these delays are relative to when `doTasks` is invoked rather than to each other. So the third Promise's callback function will queue up first even though it's the last Promise in the array. Again, remember that these Promise objects are being constructed synchronously.

In this example, we map each task to the result of `doTask`, which is an async function that implicitly returns a Promise. So we get an array of pending Promises:

```
[Promise {<pending>}, ..., Promise {<pending>}]
```

Then, we await the final Promise returned by `Promise.all`. We know that if this final Promise fulfills, then all individual Promises must have fulfilled by the time we run the next line of code. However, if any individual Promise is rejected, the final Promise will be rejected immediately.

If you run this code, you should see the following logs:

```
Task 2: completed ✅
Task 0: completed ✅
Task 1: completed ✅
All tasks completed 🎉
```

Hopefully this makes sense—since all of the Promises fulfilled, the Promise returned by `Promise.all` also fulfilled. But what if one of them rejects?

### `Promise.all` and Fail-Fast

We can test Promise rejection by updating our code to simulate failure and success:

```javascript {data-copyable=true}
const doTask = async (task) => {
  await sleep(task.durationMs);
  if (task.fulfills) {
    console.log(`Task ${task.id}}: completed ✅`);
    return Promise.resolve();
  }
  console.log(`Task ${task.id}: failed ❌`);
  return Promise.reject();
};

// Example task that rejects after 1 second
doTask({ id: 0, durationMs: 1000, fulfills: false })
	.then(() => console.log('fulfilled'))
  .catch(() => console.log('rejected'))
  .finally(() => 'done');
```

Now, we can run multiple tasks again like we did before:

```javascript {data-copyable=true}
const doTasks = async (tasks) => {
  try {
  const values = await Promise.all(tasks.map(doTask));
  console.log('All tasks completed 🎉');
  } catch (e) {
    console.log('Promise.all rejected 🛑');
  }
};

// Task 0 takes 2 seconds (middle)
// Task 1 takes 3 seconds (slowest)
// File 2 takes 1 second (fastest)
doTasks([
  { id: 0, durationMs: 2000, fulfills: false },
  { id: 1, durationMs: 3000, fulfills: true },
  { id: 2, durationMs: 1000, fulfills: true },
]);
```

But this time around, we'll see this output:

```
Task 2: completed ✅
Task 0: failed ❌
Promise.all rejected 🛑
Task 1: fulfilled ✅
```

First, notice that `Promise.all` rejects immediately after Task 0 rejects. This is great because it means we don't have to wait for the remaining Promises to settle—we can immediately begin handling the error case as soon as a single Promise rejects.

That makes sense, but you may be surprised to see that Task 1 still fulfilled even though `Promise.all` rejected:

```
Promise.all rejected 🛑
Task 1: fulfilled ✅
```

In fact, this is working as intended. `Promise.all` doesn't _cancel_ the remaining pending Promises as soon as it rejects. So even though `Promise.all` rejected after Task 0 rejected, Task 1 still got a chance to do its async work and fulfilled. It's just that we didn't have to _wait_ for that Promise to settle before we rejected the outer Promise. This means we can handle error cases faster (a behavior known as **fail-fast**).

{% aside %}
What happens if the remaining Promises reject after the first rejection? Technically, they'll reject `Promise.all`'s returned Promise, too, but rejecting an already-settled Promise doesn't do anything.
{% endaside %}

## Bonus: Implementing `Promise.all`

We learned what `Promise.all` is and how to use it, but how does it work under the hood? Let's try implementing our own `Promise.all` as a learning exercise.

We know that `Promise.all` accepts an iterable of Promises and returns a new Promise. So the skeleton for the method might look like this:

```javascript {data-copyable=true}
Promise.all = (promisesIterable) => {
  const promises = Array.from(promisesIterable);
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      // ...
    });
  }
}
```

Note that I'm first converting the iterable argument to an array using `Array.from`. This is because `Promise.all`, like other Promise methods, accepts an iterable as an argument; iterables don't have a length property, while arrays do, and we need to know how many Promises there are in total so we can keep track of when all of them have fulfilled. All arrays are iterables, but not all iterables are arrays.

That `forEach` loop may seem familiar, and you may think that this code runs into the original problem, but take a closer look—by the time we enter the loop, we've already constructed all of the Promise objects that we intend to await. So all that remains is to schedule callback functions for each one, independently. Here's the full code:

```javascript {data-copyable=true}
Promise.all = (promisesIterable) => {
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

Each time a Promise fulfills, we keep track of its value in an array. Note that `Promise.all` must fulfill with values in the same order as the original Promises, so a simple `Array.prototype.push` would not work here—if a Promise that appears later in the array fulfills first, its value would appear first in the returned array, and we don't want that. So instead, we key in with the index corresponding to the current Promise. (Thanks to Chris Opperwall for clarifying that implementation detail in this article: [Implementing Promise.all](https://medium.com/@copperwall/implementing-promise-all-575a07db509a).)

Additionally, whenever a Promise fulfills, we check if the length of the fulfilled array equals the total number of Promises. If it does, then we know that all Promises have fulfilled, so we fulfill the outer promise. Otherwise, if at any point a single Promise is rejected or an error is thrown, we reject the outer Promise.

There's one edge case that our code doesn't handle: an empty iterable. [According to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#return_value), the expected behavior is that `Promise.all` should fulfill immediately. Fortunately, the fix is simple in our case since we already computed the size of the input:

```javascript {data-copyable=true}
Promise.all = (promisesIterable) => {
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
        .then((value, index) => {
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

{% include "unsplashAttribution.md" name: "Jon Tyson", username: "jontyson", photoId: "dm9EHhIZm-k" %}
