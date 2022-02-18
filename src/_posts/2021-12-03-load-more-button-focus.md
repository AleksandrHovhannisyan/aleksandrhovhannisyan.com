---
title: Keeping Focus in Place with Load-More Buttons
description: Load-more buttons are more accessible than infinite scrolling, but they also steal keyboard focus when new content loads in. We can fix this problem by manually focusing the first newly inserted result.
keywords: [load more, load more button, infinite scrolling]
categories: [accessibility, javascript, react]
thumbnail: thumbnail.png
commentsId: 125
lastUpdated: 2021-02-18
---

Many blogging platforms, news sites, and social media platforms use a strategy known as **infinite scrolling** to render a continuously growing list of results in a feed. Unfortunately, while infinite scrolling creates a seamless user experience on social media platforms, it isn't great for accessibility. Not only does it make it impossible for both mouse and keyboard users to reach a site's footer, but it can also create a confusing user experience for screen reader users if the proper ARIA roles and attributes are not used (e.g., [`aria-live`](https://gomakethings.com/how-and-why-to-use-aria-live/), among others).

Load-more buttons are generally preferable to infinite scrolling and create a more accessible user experience for screen reader users since they give you a choice of either loading in new content or breaking out of the feed. But if not implemented correctly, these buttons may still create a frustrating user experience for keyboard users.

In this article, we'll look at a problem with the typical implementation for load-more buttons and explore a simple solution to make them more accessible. Code samples will be shown in React, but the basic idea can be easily extended to any framework.

{% include toc.md %}

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
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Suppose we're rendering a simple grid of results like this:

```jsx {data-file="ResultGrid.jsx"}
const ResultGrid = (props) => {
  return (
    <>
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
    </>
  );
};
```

As I mentioned before, we'll need to maintain a reference to the first newly rendered result so we can later focus that element after the component has rendered. So let's create that ref ahead of time since we know we're going to need it:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
const firstNewResultRef = useRef(null);
```

Now, we just need to figure out how to assign this ref to the first of the newly rendered results. This is easier than it sounds! Whenever the array changes, the index of the first new result is going to be the length of the previous array. For example, if we had `5` items previously, it doesn't really matter how many items we have *now*—the first new item is always going to be at index `5`, or the length of the previous array (due to zero-indexing).

To keep track of this index, we'll create another ref:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
const firstNewResultIndex = useRef(null);
```

And we'll update its value before calling `props.onLoadMore` in our click event handler:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
<button
  onClick={() => {
    firstNewResultIndex.current = props.results.length;
    props.onLoadMore();
  }}
>
  Load More
</button>
```

Then, when rendering the list, we can compare each result's index to the one we just computed and conditionally assign the ref we created earlier only if the indices match:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
props.results.map((result, i) => {
  const isFirstNewResult = i === firstNewResultIndex.current;
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

Finally, we'll leverage the `useEffect` hook to focus the new result after every render. It's important to specify `props.results` as the only dependency of the hook; that way, we only focus the ref if this component re-rendered because new results were loaded:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
useEffect(() => {
  firstNewResultRef?.current?.focus();
}, [props.results]);
```

Now, when users click the load-more button with their keyboard, their focus will jump immediately to the first of the newly inserted items.

{% aside %}
  **Note**: This code will NOT run into race conditions since we only ever focus the first result *after* the list has re-rendered, at which point the ref will have been correctly assigned. So if you're fetching paginated data from an API, `props.results` won't change until you're done setting the state in the parent component.
{% endaside %}

And that's all the logic that we need! Here's the final code from this tutorial:

```jsx {data-file="ResultGrid.jsx" data-copyable=true}
const ResultGrid = (props) => {
  const firstNewResultIndex = useRef(null);
  const firstNewResultRef = useRef(null);

  // Whenever the list grows, focus the first newly inserted result
  useEffect(() => {
    firstNewResultRef?.current?.focus();
  }, [props.results]);

  return (
    <>
      <ol>
        {props.results.map((result, i) => {
          const isFirstNewResult = i === firstNewResultIndex.current;
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
      <button
        onClick={() => {
          firstNewResultIndex.current = props.results.length;
          props.onLoadMore();
        }}
      >
        Load More
      </button>
    </>
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

In this article, we looked at how to fix that problem using refs and by focusing the first new result each time the list grows. Now, after a user clicks the load-more button with their keyboard, their focus will jump to the first newly inserted result. This allows them to continue tabbing forward normally rather than having to backtrack.
