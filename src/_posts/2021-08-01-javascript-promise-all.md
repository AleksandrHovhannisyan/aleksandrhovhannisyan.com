---
title: Awaiting Multiple Promises with Promise.all
description: Learn how to use JavaScript's Promise.all method to await multiple async operations, like batch uploads.
keywords: [promise.all, promise, async, javascript]
categories: [javascript, promises, async]
thumbnail: thumbnail.jpg
---

Imagine you're creating a website where users can batch-upload files. You need to know when all files have finished uploading so you can notify the user and update the UI. This sounds like a job for promises since file uploads are likely to be asynchronous. But in this example, each upload would return its own promise. You know how to await *individual* promises, but how do you await an arbitrary number of promises to know when they've *all* resolved?

Waiting for multiple async operations to finish is such a common task in JavaScript that there's a special method for this very purpose: `Promise.all`. In this article, we'll learn how to use `Promise.all` to await multiple promises. Towards the end, we'll also write our own implementation of `Promise.all` to better understand how it works under the hood.

{% include toc.md %}

## A Naive Approach with Tallying

If we're inclined to reinvent the wheel, we can await each promise and keep a running tally of how many promises have resolved so far. In our example, we know how many total files the user wants to upload because that's just the length of the input array. So if the number of resolved promises ever equals this length, then we know that all files have finished uploading:

```javascript
const uploadFiles = (files) => {
  let uploadCount = 0;

  const uploadFile = async (file) => {
    try {
      await someOperation(file);
      uploadCount++;

      if (uploadCount === files.length) {
        console.log(`uploaded all files`);
      }
    } catch (e) {
      console.log(`failed to upload file: ${file.src}`);
    }
  }

  files.forEach(uploadFile);
}
```

This works—but we can do better thanks to `Promise.all`.

## What Is `Promise.all`?

[`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) is a method that takes an iterable of promises (like an array) and returns a new, final promise. This returned promise resolves once all of the individual promises have resolved, and it rejects as soon as any of the individual promises are rejected:

```javascript
try {
  await Promise.all([promise1, promise2, ..., promiseN]);
  console.log('Here, we know that all promises resolved');
} catch (e) {
  console.log('If any of the promises rejected, so will Promise.all');
}
```

This is really powerful—`Promise.all` allows you to run multiple async tasks independently, notifying you once all tasks have finished or if some of them have failed.

## Using `Promise.all` to Await Multiple Promises

Let's tackle the problem that I described in this article's intro, where a user is uploading several files, and each upload is an async operation with an unknown duration.

### 1. Simulating Async Operations

To keep this article simple, I won't use any real-world data. Instead, I'll simulate the problem with a helper function that returns a promise and resolves it after `n` seconds:

{% include codeHeader.html %}
```javascript
const wait = (delaySeconds) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delaySeconds * 1000);
  });
}
```

You can learn more about this technique in my article on [practical use cases and examples of JavaScript promises](/blog/javascript-promise-tricks/). But essentially, this allows us to wait `n` seconds in any async function:

```javascript
const someAsyncFn = async () => {
  doSomething();

  // wait one second before running
  // any code after this line
  await wait(1);

  doSomethingElse();
}
```

We can use this function to simulate an async task that takes some time to complete, like an upload. We'll use an array of numbers to represent the time it takes each file to upload:

{% include codeHeader.html %}
```javascript
const uploadFile = async (delay, index) => {
  await wait(delay);
  console.log(`uploaded file ${index + 1}`);
}

const uploadFiles = (files) => {
  files.forEach(uploadFile);
}

// File 1 takes 2 seconds
// File 2 takes 4 seconds
// File 3 takes 1 second
uploadFiles([2, 4, 1]);
```

If you run this code on your end, you should see the following messages logged in order:

```plaintext
uploaded file 3
uploaded file 1
uploaded file 2
```

File 3 takes the least amount of time to complete its work, so it resolves first, followed by Files 1 and 2, in that order.

That's it for simulating the problem in code.

### 2. Awaiting Multiple Promises

Now, let's use `Promise.all` to log a message once *all* of the promises have resolved:

{% include codeHeader.html %}
```javascript
const uploadFiles = async (files) => {
  try {
    const fileUploads = files.map((delay, i) => uploadFile(delay, i));
    await Promise.all(fileUploads);
    console.log('all files uploaded');
  } catch (e) {
    console.log('some files failed to upload');
  }
}
```

Remember, `Promise.all` accepts an iterable of promises as its input. In this example, we map each file to the result of `uploadFile`, which is an async function that implicitly returns a promise. So we get an array of promises that may or may not have resolved yet:

```plaintext
[Promise {<pending>}, ..., Promise {<pending>}]
```

Then, we await the final promise returned by `Promise.all`. We know that if this final promise resolves, then all individual promises must have resolved by the time we run the next line of code. However, if any individual promise is rejected, the final promise will be rejected too.

If you run this code, you should see the following logs:

```plaintext
uploaded file 3
uploaded file 1
uploaded file 2
all files uploaded
```

Awesome! That's precisely the behavior we wanted.

## Implementing `Promise.all` from Scratch

We learned what `Promise.all` is and how to use it, but are you curious how it works its magic? Let's try implementing our own `Promise.all` as a learning exercise.

We know that `Promise.all` accepts an iterable of promises and returns a new promise. So the skeleton for the method might look like this:

```javascript
Promise.all = (promises) => {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      // ...
    }
  }
}
```

> I'm using a `for...of` loop since the input is an iterable, which need not be an array.

We know how many promises we have in total—that's just the length of the iterable. So we can borrow the approach I showed in the intro, where we tally the number of resolved promises and check if that count equals the length of the iterable. However, it's worth noting that if `Promise.all` resolves, [it must resolve with an array of all individual resolved values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#fulfillment). Thus, instead of counting the resolved promises directly, we'll just accumulate an array of resolved values and check its length.

Finally, note that there's no straightforward way to get the size of an iterable *in general*—arrays do have `Array.prototype.length`, but arrays are only one type of iterable. So if we want to remain true to `Promise.all`, we'll need two loops: one to get the length of the iterable, and another to loop over the promises and track their resolved values.

Here's the code:

{% include codeHeader.html %}
```javascript
Promise.all = (promises) => {
  const resolvedValues = [];
  let promiseCount = 0;

  for (const promise of promises) {
    promiseCount++;
  }

  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      // Await this promise
      promise
        // Keep track of resolved values
        .then((value) => {
          resolvedValues.push(value);

          // This must mean that all promises resolved.
          // So we resolve the returned promise!
          if (resolvedValues.length === promiseCount) {
            // Promise.all resolves with an array of
            // all individual resolved values
            resolve(resolvedValues);
          }
        })
        // If any individual promise was rejected,
        // we immediately reject the outer promise.
        .catch((e) => {
          reject(e);
        });
    }
  });
};
```

Each time a promise resolves, we push the resolved value to an array and check if its length equals the size of the iterable. If it does, then we know that all promises have resolved, so we resolve the outer promise. Otherwise, if at any point a single promise is rejected or an error is thrown, we reject the outer promise.

There's one edge case that our code doesn't handle: an empty iterable. [According to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#return_value), the expected behavior is that `Promise.all` should resolve immediately. Fortunately, the fix is simple in our case since we already computed the size of the input:

{% include codeHeader.html %}
```javascript
Promise.all = (promises) => {
  const resolvedValues = [];
  let promiseCount = 0;

  for (const promise of promises) {
    promiseCount++;
  }

  return new Promise((resolve, reject) => {
    if (promiseCount === 0) {
      resolve([]);
      return;
    }

    for (const promise of promises) {
      // Await this promise
      promise
        // Keep track of resolved values
        .then((value) => {
          resolvedValues.push(value);

          // This must mean that all promises resolved.
          // So we resolve the returned promise!
          if (resolvedValues.length === promiseCount) {
            // Promise.all resolves with an array of
            // all individual resolved values
            resolve(resolvedValues);
          }
        })
        // If any individual promise was rejected,
        // we immediately reject the outer promise.
        .catch((e) => {
          reject(e);
        });
    }
  });
};
```

And we're done! If you now override `Promise.all` with this custom implementation and re-run the code from this demo, you should see the same result as before:

```plaintext
uploaded file 3
uploaded file 1
uploaded file 2
all files uploaded
```

However, it's worth noting that since this is a naive implementation, it's unlikely to match the behavior of the real `Promise.all` exactly. But it's a good exercise nonetheless.

## Final Thoughts

JavaScript's `Promise.all` is a powerful way to write async code that needs to perform batch operations, such as for uploading items to an app or waiting for a user to take multiple actions in any order. If you ever need to do this, now you know how! And, more importantly, you should have a better understanding of how to implement such a method yourself.

{% include unsplashAttribution.md name: "Jon Tyson", username: "jontyson", photoId: "dm9EHhIZm-k" %}
