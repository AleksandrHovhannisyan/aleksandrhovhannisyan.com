---
title: Managing Keyboard Focus for Load-More Buttons
description: Load-more buttons are more accessible than infinite scrolling, but they also steal keyboard focus when new content loads in. We can fix this problem by manually focusing the first newly inserted result.
keywords: [load more, load more button, infinite scrolling]
categories: [accessibility, javascript, react]
thumbnail: ./images/thumbnail.png
commentsId: 125
lastUpdated: 2022-03-24
scripts:
  - 
    src: https://static.codepen.io/assets/embed/ei.js
    defer: true
---

Many websites use a strategy known as **infinite scrolling** to render a continuously growing list of results in a content feed. Unfortunately, while infinite scrolling creates a seamless user experience on social media platforms, it isn't great for accessibility. Not only does it make it impossible for both mouse and keyboard users to reach a site's footer, but it can also create a confusing user experience for screen reader users if the proper ARIA roles and attributes are not used (e.g., [`aria-live`](https://gomakethings.com/how-and-why-to-use-aria-live/), among others).

Load-more buttons are generally preferable to infinite scrolling and create a more accessible user experience for screen reader users since they give you a choice of either loading in new content or breaking out of the feed. But if not implemented correctly, these buttons may still create a frustrating user experience for keyboard users.

In this article, we'll look at a problem with the typical implementation for load-more buttons and explore a simple solution to make them more accessible. Code samples will be shown in React, but the basic idea can be easily extended to any framework.

{% include "toc.md" %}

## Problem: Keyboard Focus Sticks to Load-More Buttons

Imagine that you're tabbing through a grid of linked cards. Your focus moves moves from one card to the next; eventually, your focus reaches the load-more button at the end of the list. You click the button by pressing the Enter or Space key on your keyboard, and new cards load into the list. Everything appears to be working correctly.

Unfortunately, if you now attempt to tab forward or backward, you'll find that your focus resumes where it had left off—at the load-more button. The newly rendered results are in the list above this button, and the button is now all the way at the end of the page. To get to the new results, you need to tab backwards, and this can create a frustrating user experience.

## Solution: Focus the First New Result

At a high level, the solution is to focus the first newly inserted result every time the list grows. Whenever new items are loaded into the list, we'll determine the index of the first new result in the array and assign a reference to that DOM element. We'll then focus that new element whenever the number of results changes (i.e., after ever render). Effectively, this means that after a user clicks the load-more button with their keyboard, their focus will visibly jump to the first newly inserted result.

Below is a Codepen demo showing this in action:

<p class="codepen" data-height="300" data-slug-hash="rNGOBKv" data-preview="true" data-user="AleksandrHovhannisyan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/rNGOBKv">
  Keeping focus in place with load-more buttons</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

Suppose we're rendering a simple grid of results like this:

```jsx {data-file="ResultGrid.jsx"}
const ResultGrid = (props) => {
  return (
    <div>
      <ol>
        {props.results.map((result) => {
          return (
            <li key={result.id}>
              <a href={result.url}>{result.title}</a>
            </li>
          );
        })}
      </ol>
      {props.canLoadMore && (
        <button onClick={props.onLoadMore}>Load More</button>
      )}
    </div>
  );
};
```

As I mentioned before, we'll need to maintain a reference to the first newly rendered result so we can focus that element after the list has re-rendered. So let's create that ref ahead of time since we know we're going to need it:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
const ResultGrid = (props) => {
  const firstNewResultRef = useRef(null);

  // other code omitted for brevity
}
```

Now, we just need to somehow assign this ref to the first of the newly rendered results. And this is actually easier than it sounds! Whenever we load in more results, the index of the first new result is going to be the length of the previous array. For example, if we had `5` items before but now we have `5 + N`, the first new item's index will always be `5`, or the length of the previous array. We'll keep track of this index at the parent level as part of its state and pass it along as a prop to the list UI:

```jsx {data-file="App.jsx" data-copyable=true}
const App = () => {
  const [state, setState] = useState({ results: [], firstNewResultIndex: -1 });

  const handleLoadMore = async () => {
    // logic omitted for fetching new results
    setState({
      ...state,
      results: newResults,
      firstNewResultIndex: state.results.length,
    });
  };

  return (
    <ResultGrid
      results={state.results}
      firstNewResultIndex={state.firstNewResultIndex}
    />
  );
};
```

{% aside %}
  **Note**: To keep the code simple, this tutorial assumes that the list length only ever grows because a user clicked the load-more button. But in practice, the list may grow and shrink for other reasons. For example, if users are allowed to type search queries to filter the results, then the first new result may need to be reset. You should set this index accordingly wherever you are updating the list of results.
{% endaside %}

{% aside %}
  **Note**: Since we're updating two related state values inside an async function—one for the list itself and another for the index—the code sample uses a single object for the state to minimize re-renders since React doesn't guarantee batching prior to version 18. However, in situations like this where two or more states depend on each other, the recommended pattern is to instead use [the reducer state pattern](/blog/managing-complex-state-react-usereducer/).
{% endaside %}

Now that we have the index of the first new result, we can compare it to the index of each result in our mapping function. If an element's index matches the target index, we'll conditionally assign the ref to that element:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
props.results.map((result, i) => {
  const isFirstNewResult = i === props.firstNewResultIndex;
  return (
    <li key={i}>
      <a
        ref={isFirstNewResult ? firstNewResultRef : undefined}
        href={result.url}
      >
        Result {i + 1}
      </a>
    </li>
  );
})
```

Finally, we'll leverage the `useEffect` hook to focus the new result after every render. It's important to specify `props.firstNewResultIndex` as the only dependency of the hook; that way, we only focus the ref if this component re-rendered because new results were loaded:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
// Whenever the index changes, focus the corresponding ref
useEffect(() => {
  firstNewResultRef.current?.focus();
}, [props.firstNewResultIndex]);
```

Now, when users click the load-more button with their keyboard, their focus will jump immediately to the first of the newly inserted items.

{% aside %}
  **Note**: This code will not run into race conditions since we only ever focus the first result *after* the index has changed, at which point the ref will have been correctly assigned. So if you're fetching paginated data from an API, `props.firstNewResultIndex` won't change until after you're done setting the state in the parent component.
{% endaside %}

And that's all the logic that we need! Here's the final code from this tutorial:

```jsx {data-copyable=true}
import { useRef, useState } from 'react';

const ResultGrid = (props) => {
  const firstNewResultRef = useRef(null);

  // Whenever the index changes, focus the corresponding ref
  useEffect(() => {
    firstNewResultRef.current?.focus();
  }, [props.firstNewResultIndex]);

  return (
    <div>
      <ol>
        {props.results.map((result, i) => {
          const isFirstNewResult = i === props.firstNewResultIndex;
          return (
            <li key={i}>
              <a
                ref={isFirstNewResult ? firstNewResultRef : undefined}
                href={result.url}
              >
                Result {i + 1}
              </a>
            </li>
          );
        })}
      </ol>
      <button onClick={props.onLoadMore}>Load More</button>
    </div>
  );
};

const App = () => {
  const [state, setState] = useState({ results: [], firstNewResultIndex: -1 });

  const handleLoadMore = async () => {
    // logic omitted for fetching new results
    setState({
      ...state,
      results: newResults,
      firstNewResultIndex: state.results.length,
    });
  };

  return (
    <ResultGrid
      results={state.results}
      firstNewResultIndex={state.firstNewResultIndex}
    />
  );
};
```

## Testing Screen Reader Narration

While this article focused on keyboard users, it's important to cover all of our bases to make sure that our solution doesn't exclude other groups of users. In particular, we'll want to test this approach with popular screen readers to verify that they narrate the content appropriately when the keyboard focus moves to the newly inserted items.

The examples below are from running screen readers on [the CodePen demo](https://codepen.io/AleksandrHovhannisyan/pen/rNGOBKv), which originally contains a list of four items. When the load-more button is clicked, the app loads four additional items and focuses the fifth item in the list. At that point, the content is narrated as follows:

- VoiceOver: link, result 5, list 8 items.
- NVDA: list with 8 items, result 5 link.
- JAWS: list with 8 items, result 5 link.

Everything is working as expected!

## Summary

Load-more buttons are great for accessibility, but you need to take care when implementing them so that you don't create a frustrating user experience. By default, when a button is clicked via keyboard, it steals focus from the rest of the document. This is normally the expected behavior, but if the button is being used to load more results, it forces the user to tab *backwards* to find where they left off in the list.

In this article, we looked at how to fix that problem by focusing the first new result each time the list grows. Now, after a user clicks the load-more button with their keyboard, their keyboard focus will jump to the first newly inserted result. This allows them to continue tabbing forward normally rather than having to backtrack.
