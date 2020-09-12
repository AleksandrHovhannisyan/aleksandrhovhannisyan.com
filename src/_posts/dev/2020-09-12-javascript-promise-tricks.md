---
title: "JavaScript Promises: Practical Use Cases and Examples"
description: Promises are a powerful tool for writing asynchronous code in JavaScript. Here are a few interesting use cases.
keywords: [javascript promises]
tags: [dev, javascript, promises, async]
comments_id: 57
---

As a general programming concept, promises are nothing new—they've been around for quite some time in other languages. C++11, for example, introduced `std::promise` and `std::future` (and, later, `std::async`) for asynchronous logic.

For the longest time, JavaScript had been lagging behind its counterparts. Asynchronicity was implemented through deeply nested callbacks, and only jQuery offered an alternative: [deferred objects](https://api.jquery.com/category/deferred-object/). With ES2015, JavaScript finally introduced the **Promise**: an object that may or may not contain some value at some point in the future. Promises offer a powerful and legible syntax for writing asynchronous code in JavaScript.

This post assumes a basic understanding of Promises and how they work. We'll look at three practical use cases of Promises in JavaScript to get you comfortable with using them.

{% include toc.md %}

## 1. Mocking API Calls for UI Development

Sometimes, you'll find yourself working on a front-end feature for which an API endpoint does not yet exist. But the data schema has been finalized, so you at least know what the returned JSON will look like.

Now, you *could* just hard-code your data in the UI, like mapping a fixed array of objects to some HTML output (either with vanilla JavaScript or, in this case, React):

{% capture code %}import React from 'react';

const BookList = ({ books }) => {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <section>
      <h2>My Favorite Books</h2>
      <BookList
        books={[
          {
            id: 1,
            title: 'The Count of Monte Cristo'
          },
          {
            id: 2,
            title: 'The Colour of Magic'
          },
          {
            id: 3,
            title: 'Great Expectations'
          }
        ]}
      />
    </section>
  );
};

export default App;{% endcapture %}
{% include code.html file="App.js" code=code lang="jsx" %}

While it's tempting to take this route, it's not a good idea because it neglects the asynchronous nature of a real-world API call. What if the API fails to return the data? Naturally, your UI will need to handle that error state. But it's not possible to test this edge case with a hard-coded array of values that will always exist.

The solution? Use Promises to create a mock API in your frontend:

{% capture code %}export const getData = (data, successRate = 0.98, maxLatencyMs = 1000) =>
  new Promise((resolve, reject) => {
    const successRoll = Math.random();
    // interval: [0, maxLatencyMs]
    const latency = Math.floor(Math.random() * (maxLatencyMs + 1));

    if (successRoll <= successRate) {
      setTimeout(() => resolve(data), latency);
    } else {        
      setTimeout(() => reject('API failed to return data'), latency);
    }
});{% endcapture %}
{% include code.html file="utils/getData.js" code=code lang="javascript" %}

This function accepts one required argument: your fake data. The remaining arguments are optional and have certain defaults. The function returns a Promise and uses a pseudorandom dice roll to simulate a real API call that may or may not succeed. By default, it's assumed that the API has an arbitrary success rate of `0.98`, or 98%. Finally, the mock API will resolve or reject within a certain window of latency.

Now, instead of hardcoding data in our frontend, we can pass along our fake data to the mock API, which will either bounce it back to us after some time or fail:

{% capture code %}import React, { useState, useEffect } from "react";

const BookList = ({ books }) => {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    getData([
      {
        id: 1,
        title: 'The Count of Monte Cristo'
      },
      {
        id: 2,
        title: 'The Colour of Magic'
      },
      {
        id: 3,
        title: 'Great Expectations'
      }
    ]).then(setBooks).catch(e => setFetchFailed(true));
  }, []);

  return (
    <section>
      <h2>My Favorite Books</h2>
      {fetchFailed ? <p>Failed to fetch books</p> : <BookList books={books} />}
    </section>
  );
};

export default App;{% endcapture %}
{% include code.html file="App.js" code=code lang="jsx" %}

Later, we can easily replace the mocked call with a real API call, and voila!

> **Note**: If you later use `fetch` to make the real API call, you'll just need to add an intermediate `.then` that converts the blob to JSON (or just use `async`/`await` and avoid chaining `then`s altogether). If you use a wrapper library like `axios`, you won't even have to worry about this.

## 2. Wrapping Callbacks in Legacy JS (aka Promisification)

Older JavaScript APIs (e.g., the now-deprecated [request](https://github.com/request/request) library) use callbacks. Simply put, a **callback** is a function that's passed as an argument to some *other* function, which may or may not perform async operations. The idea is that once the function finishes its async work (e.g., fetching data from an API), it will call the function argument. Hence the name—the function argument is *called (back)* at a later point in time.

Here's a simulated callback using a simple `setTimeout`:

{% capture code %}function doSomething(arg1, callback) {
  // In reality, the function would do something else and then
  // invoke the callback. The timeout is for demo purposes.
  setTimeout(() => callback('foo'), 1000);
}

doSomething('arg1', console.log);{% endcapture %}
{% include code.html code=code lang="javascript" %}

Promises are, by comparison, much easier to read since they don't lead to the deeply nested **callback hell** that you may have seen in some legacy JavaScript codebases:

```javascript
doSomething(arg1, data1 => {
    doSomethingElse(arg2, data2 => {
        doAnotherThing(arg3, arg33, data3 => {
            pleaseMakeThisStop(arg4, data4 => {
                // ...
            });
        });
    });
});
```

With Promises, we could just chain `.then`s or `await`s:

```javascript
doSomething()
  .then(doSomethingElse)
  .then(doAnotherThing)
  .then(pleaseMakeThisStop);
```

Notice how this reads almost like plain English, making the logic easier to follow. But how do you convert callbacks to Promises? (Spoiler: It's actually really easy!) There are just two steps involved:

1. Have your new function return a Promise.
2. Inside the Promise, use the older callback syntax and either `resolve` or `reject` within the callback.

This process is known as [promisifying](https://javascript.info/promisify) a function.

For example, suppose you have this function that reads a setting asynchronously from some data store and then returns the result:

```javascript
function getSetting(key, callback) {
    // ...
    callback(result);
}

// Consumer code
getSetting('foo', console.log);
```

Our `getSetting` function takes two arguments: the key to use for looking up data, and a callback that should be invoked once the async read operation finishes. In this case, our callback is `console.log`.

To convert this to a simpler Promise-based syntax, we just create our own wrapper function that returns a Promise and either resolves or rejects, depending on the result of `getSetting`:

{% capture code %}function getSettingAsync(key) {
    return new Promise((resolve, reject) => {
        try {
            getSetting(key, value => {
                resolve(value);
            });
        } catch (e) {
            reject(e.message);
        }
    });
}{% endcapture %}
{% include code.html file="getSettingAsync.js" code=code lang="javascript" %}

That's it! Now, we can just do this:

{% capture code %}getSettingAsync('foo')
  .then(console.log)
  .catch(e => setErrorState(true));{% endcapture %}
{% include code.html code=code lang="javascript" %}

Notice that our new function no longer accepts a callback argument—that's taken care of by the Promise wrapper. The function signature is now much cleaner to look at, and our code reads like plain English. But more importantly, we can now chain Promises instead of nesting callbacks.

### Examples of Converting Callbacks to Promises

We've seen that JavaScript Promises can be used to encapsulate callback-based APIs and make your code easier to follow. Let's now look at two examples of promisification.

#### Dynamically Loading Scripts in a Specific Order

For whatever reason, let's say you need to load a script (or image, or any other asset) dynamically via JavaScript and then load another one only after the previous one has loaded. But dynamically loaded scripts don't have a predetermined order, so they could very well load out of order because of their async nature.

The naive approach uses nested `onload` handlers, like so:

{% capture code %}const script2 = document.createElement('script');
script2.src = 'two.js';
document.body.appendChild(script2);

script2.onload = () => {
  console.log('two.js loaded');
  const script1 = document.createElement('script');
  script1.src = 'one.js';
  document.body.appendChild(script1);

  script1.onload = () => {
    console.log('one.js loaded');
    const script3 = document.createElement('script');
    script3.src = 'three.js';
    document.body.appendChild(script3);

    script3.onload = () => {
      console.log('three.js loaded');
    };
  };
};{% endcapture %}
{% include code.html code=code lang="javascript" %}

> Again, you could just as well use images or any other asset with `onload` and `onerror` handlers. Scripts are just easier to work with for the purposes of this demo.

That works, and we'll get this output:

```
index.js:6 two.js loaded
index.js:12 one.js loaded
index.js:18 three.js loaded
```

But the nesting only gets worse from here, and there's already a lot of hard-coded repetition.

Instead, we can use Promises to regulate the order in which our scripts are loaded:

{% capture code %}function loadScript(url) {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = () => {
      console.log(`${url} loaded`);
      resolve();
    };

    script.onerror = () => {
      reject(`Error loading script at ${url}`);
    };
  });
}{% endcapture %}
{% include code.html file="loadScript.js" code=code lang="javascript" %}

Now, all we need to do is chain Promises:

{% capture code %}loadScript('two.js')
  .then(() => loadScript('one.js'))
  .then(() => loadScript('three.js'))
  .catch(console.log);{% endcapture %}
{% include code.html code=code lang="javascript" %}

And we'll get the same order of output:

```
index.js:30 two.js loaded
index.js:30 one.js loaded
index.js:30 three.js loaded
```

Note that there are very few situations in the real world where you'd actually need to do this for scripts; nonetheless, this example offers some good practice with thinking in terms of Promises.

#### Reading Data from a Store (Chrome Extension API)

The Chrome extension API allows you to save and read user preferences. The read operation is performed asynchronously, so you need to pass in a callback for when the data becomes ready:

{% capture code %}chrome.storage.sync.get({ 'foo' }, setting => {
    if (chrome.runtime.lastError) {
        throw new Error(`Failed to read setting.`);
    } else {
        console.log(setting['foo']);
    }
});{% endcapture %}
{% include code.html code=code lang="javascript" %}

That works, but you'll soon grow tired of passing in a callback every single time you want to read a setting.

We can easily convert this to a Promise-based syntax. We'll create a utility function named `readSetting` that abstracts away the callback and either resolves with the value of the setting or rejects if the Chrome runtime encounters an error:

{% capture code %}export default function readSetting(settingName) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      { [settingName]: defaultSettings[settingName] },
      (setting) => {
        if (chrome.runtime.lastError) {
          reject(`Failed to read setting "${settingName}".`);
        } else {
          resolve(setting[settingName]);
        }
      }
    );
  });
}{% endcapture %}
{% include code.html file="readSetting.js" code=code lang="javascript" %}

And now we can use either `async`/`await` or `then` to read settings in a much more legible manner:

{% capture code %}const bar = await readSetting('foo');{% endcapture %}
{% include code.html code=code lang="javascript" %}

## 3. Sleeping in JavaScript

In programming languages like C++ and Java, you can pause a thread's execution with a call to some sleep function, which usually takes a number of milliseconds as its argument and then blocks the executing thread for that set amount of time.

Normally, an [operating system's scheduler](/blog/computer-science/operating-system-scheduling-algorithms/) is responsible for deciding when a program's execution should stop and when another process should get its turn on the CPU. However, a program can also voluntarily request to be blocked, allowing it to resume execution in the future (once an internal clock goes off).

Why would you want to do this? Sleeping is useful if you want to regulate **the rate at which code is executed**. And just to be clear, you can definitely do this in vanilla JavaScript without Promises:

{% capture code %}for (let i = 1; i <= 10; i++) {
    setTimeout(() => console.log(i), i * 1000);
}{% endcapture %}
{% include code.html code=code lang="javascript" %}

> **Note**: You can't just do `setTimeout(() => console.log(i), 1000)`. Since the timeouts don't actually block the loop's execution, each iteration will push a new callback onto the event queue after roughly 1 second *since the start of the loop*, as opposed to *spaced 1 second apart*.

This works, but it's a little difficult to understand compared to the following C++ code:

{% capture code %}#include <chrono>
#include <thread>

for (int i = 1; i <= 10; i++) {
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    std::cout << i << "\n";
}{% endcapture %}
{% include code.html code=code lang="cpp" %}

> Also, the JavaScript version doesn't actually block the thread, whereas the C++ version does.

Fortunately, we can achieve something similar using a Promise that resolves after `ms` time elapses:

{% capture code %}export default function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}{% endcapture %}
{% include code.html file="utils/sleep.js" code=code lang="javascript" %}

Now, with ES7's `async`/`await`, we can write the following:

{% capture code %}import sleep from 'utils/sleep';

for (let i = 1; i <= 10; i++) {
    await sleep(1000);
    console.log(i);
}{% endcapture %}
{% include code.html code=code lang="javascript" %}

> **Note**: The loop should be wrapped in a function that's marked as `async`. However, you can run this code in your browser's dev tools as-is (without the import statement).

Unlike the version with just `setTimeout`, awaiting an unresolved Promise will actually pause the executing function and resume at a later point in time (note that this still doesn't block the main thread, but the observed effect is similar). This is about as close as we can get to true sleeping in JavaScript.

A couple things to note. First, if you want to run some code at even intervals, this isn't the best approach—that's why `setInterval` exists. Second, if all you want to do is fire some callback after `n` milliseconds, you should use a regular old `setTimeout`. The sleep function we defined here mainly comes in handy when you want to slow down the iterations of a loop, for example.

## JavaScript Promises for the Win

Promises are powerful—once you get over the initial fear of using and understanding them, you'll find yourself discovering new patterns and possibilities in JavaScript. I hope you found this tutorial helpful!
