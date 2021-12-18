---
title: Keeping Focus in Place with Load-More Buttons
description: Load-more buttons are more accessible than infinite scrolling, but they also steal keyboard focus when new content loads in. We can fix this by always focusing and blurring the last rendered result before loading in any new content.
keywords: [load more, load more button, infinite scrolling]
categories: [accessibility, javascript, react]
thumbnail: thumbnail.png
commentsId: 125
---

Many blogging platforms, news sites, and social media platforms use a strategy known as **infinite scrolling** to render a continuously growing list of results in a feed. Unfortunately, while infinite scrolling creates a seamless user experience on social media platforms, it isn't great for accessibility. Not only does it make it impossible for both mouse and keyboard users to reach a site's footer, but it can also create a confusing user experience for screen reader users if the proper ARIA roles and attributes are not used (e.g., [`aria-live`](https://gomakethings.com/how-and-why-to-use-aria-live/), among others).

Load-more buttons are generally preferable to infinite scrolling and create a more accessible user experience for screen reader users since they give you a choice of either loading in new content or breaking out of the feed. But if not implemented correctly, these buttons may still create a frustrating user experience for keyboard users.

In this article, we'll look at a problem with the typical implementation for load-more buttons and explore a simple solution to make them more accessible. Code samples will be shown in React, but the basic idea can be easily extended to any framework.

## Problem: Focus Sticks to Load-More Button

Imagine that you're tabbing through an image grid of results. Your focus moves moves from one interactive element to the next; eventually, your focus reaches the load-more button at the end of the list. You click the button by pressing the Enter or Space key on your keyboard, and new images load into the list. Everything appears to be working correctly.

Unfortunately, if you now attempt to tab forward or backward, you'll find that your focus resumes where it had left off—at the load-more button. The newly rendered results are in the list above this button, and the button is now all the way at the end of the page. To get to the new results, you need to tab backwards, and this can create a frustrating user experience.

## Solution: Focus and Blur the Last Result

At a high level, the solution is straightforward: On every render, we maintain a reference to the DOM element for the last focusable result in the list. In the load-more button's click handler, we check to see if a user clicked the button via their keyboard. If so, we manually focus and immediately blur the last focusable result before rendering the new results. Effectively, this means that before a user starts tabbing, their focus will be in a ghost state hovering over the formerly last result—right before the first newly inserted item. Thus, a user can continue tabbing forward, and their focus will no longer be stuck on the load-more button at the end of the list.

Below is a Codepen demo showing this in action:

<p class="codepen" data-height="300" data-slug-hash="rNGOBKv" data-preview="true" data-user="AleksandrHovhannisyan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/rNGOBKv">
  Keeping focus in place with load-more buttons</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

I'll use React for the code samples, but again, you could extend this to any framework or just vanilla JavaScript. I also won't cover any other considerations, like how to make the UI fully accessible (e.g., with `aria-live` regions) or how to style it since those are beyond the scope of this tutorial.

Suppose we're rendering a simple grid of results like this:

{% include codeHeader.html file: "ResultGrid.jsx", copyable: false %}
```jsx
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
      <button onClick={props.onLoadMore}>Load More</button>
    </>
  );
};
```

As I mentioned, we'll need to maintain a reference to the last rendered result. Fortunately, this is straightforward in React because we're using a mapping function to render the list items, so we can easily determine if we're looking at the last one by checking its index. We can then assign a ref to keep track of the last element:

{% include codeHeader.html file: "ResultGrid.jsx" %}
```jsx
const ResultGrid = (props) => {
  const lastResultRef = useRef(null);

  return (
    <>
      <ol>
        {props.results.map((result, i) => {
          const isLastResult = i === props.results.length - 1;
          return (
            <li key={result.id}>
              <a
                ref={isLastResult ? lastResultRef : undefined}
                href={result.url}
              >
                {result.title}
              </a>
            </li>
          );
        })}
      </ol>
      <button onClick={props.onLoadMore}>Load More</button>
    </>
  );
};
```

The ref will update its current value between renders whenever new results are introduced.

Finally, we need to check to see if the load-more button was clicked via keyboard (i.e., via the Enter or space keys). If so, we'll focus and blur the last result before rendering the new results. We'll create a dedicated handler for these keyboard events:

```js
const handleLoadMoreKeyboard = (e) => {
  if (lastResultRef.current && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    lastResultRef.current.focus();
    lastResultRef.current.blur();
    props.onLoadMore();
  }
}
```

And we'll assign it to the `onKeyDown` handler on the load-more button:

```jsx
<button
  type="button"
  onKeyDown={handleLoadMoreKeyboard}
  onMouseUp={props.onLoadMore}
>
  Load More
</button>
```

There are two things I want to note about this solution:

1. We split the `onClick` handler out into separate handlers: `onMouseUp` for mouse users and `onKeyDown` for keyboard users. This allows us to listen for the enter and spacebar keys.
2. We need to prevent the native key event with `preventDefault`; this ensures that clicking the button with the spacebar does not also cause the page to scroll.

Now, when a user clicks the load-more button, their focus will hover over the formerly last result. The next time the user starts tabbing, their focus will shift to the first of the newly inserted results, allowing them to continue tabbing forward normally rather than having to backtrack to get to where they were before.

