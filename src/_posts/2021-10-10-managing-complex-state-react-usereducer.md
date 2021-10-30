---
title: Managing Complex State in React with useReducer
# title: Managing Paginated API State in React with useReducer
description: React's useState hook works well for managing simple state. But once your component starts to grow, useReducer may be a better fit for managing state.
categories: [react, design-patterns, typescript]
keywords: [useReducer, react, complex state, managing state, state management]
thumbnail:
  url: https://images.unsplash.com/photo-1492552085122-36706c238263?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

Imagine that you're asked to create a component where users can search for images returned by a paginated API. The component should render a search box followed by a list of image results. When a user types in the search box, the component should fetch images from the API using their query. The component should also render a load-more button at the end of the list to allow the user to fetch the next page of images. Each API response returns the current chunk of images along with pagination information. All of this means that the component needs a state for:

- The image results to render (a growing array for a paginated query).
- The user's current search query.
- The total number of pages that can be fetched for the current query.
- The current page number to request from the API.
- A high-level description of the UI state: `'idle'`, `'error'`, or `'no-results'`.

That's a lot of information to keep track of, but it's also a fairly common task in any app that needs to store paginated results in state. You could certainly manage all of this state using separate `useState` calls, but that can cause headaches for a few different reasons. The biggest reason why `useState` doesn't work well for managing complex state is because those separate state variables sometimes depend on each other: when you set one variable, some of the other states may need to respond accordingly or get reset.

For example, when a user enters a search query, you'll want to clear the previous image results, clear the pagination page number, update the query state, and set some kind of loading state before making an API request. Similarly, when you set the image results themselves, you also need to set some related state, like the total number of pages that can be requested, whether there are any results to show, or maybe an error message if one was thrown.

You can create inline functions to encapsulate all of this logic for you, but that creates additional noise inside the component and is not very flexible. Every time you add new state to your component, you need to remember to go back and update your functions with the correct logic to reset or update those variables.

In this article, we'll explore some of the problems with trying to manage complex state using separate `useState` calls. We'll also look at how the `useReducer` hook can solve many of those problems and allow us to manage state in a cleaner and more scalable manner.

{% include toc.md %}

## Problem: Managing Complex State with `useState`

In this tutorial, we'll explore a simplified version of the scenario I described in the intro, where you need to fetch paginated image results from an API. We won't look at any extraneous details, like what API is being used. I'm just going to mock things out to keep this tutorial simple and focused. I'll also be using TypeScript, but feel free to ignore any types if you're just using JavaScript. I may omit types and imports that aren't too important.

Let's first look at a naive approach, where we use multiple `useState` calls to manage state:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
type Mode = 'idle' | 'loading' | 'no-results' | 'error';

const ImageSearch = () => {
  const [mode, setMode] = useState<Mode>('idle');
  const [images, setImages] = useState<ImageResult>([]);
  const [query, setQuery] = useState('');
  const [queryPage, setQueryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
};
```

We'll use the following `useEffect` hook to fetch images from the API whenever the user enters a new search query or requests the next page of images:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
useEffect(() => {
  const fetchImages = async () => {
    try {
      setMode('loading');
      if (!api) {
        throw new Error(`Unable to connect to API`);
      }
      const { results, total } = await api.fetchImages({ query, page: queryPage });
      if (!results.length) {
        setMode('no-results');
      } else {
        setMode('idle');
      }
      setImages([...images, ...results]);
      setTotalPages(total);
    } catch (e) {
      setMode('error');
    }
  };

  fetchImages();
}, [query, queryPage]);
```

Notice that whenever we're setting the image results, we're also setting the app mode and the total number of pages allowed. If you find yourself setting two or more state variables in parallel like this, then it's a good indication that you may want to consider using a different pattern.

Finally, we can define some event handlers and render our UI:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
const handleQueryChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);
  setImages([]);
  setTotalPages(1);
}, 300);

const loadMoreImages = () => {
  const nextPage = queryPage + 1;
  if (nextPage >= totalPages) return;
  setQueryPage(nextPage);
};

const canLoadMoreImages = queryPage < totalPages;

return (
  <div>
    <label>
      Enter a search term:
      <input type="search" onChange={handleQueryChange} />
    </label>
    {mode === 'loading' && <p>Loading...</p>}
    {mode === 'no-results' && <p>No results found</p>}
    {mode === 'error' && <p>Something went wrong</p>}
    {mode === 'idle' && (
      <ol>
        {images.map((image) => {
          return (
            <li key={image.id}>
              <img src={image.src} alt={image.alt} />
            </li>
          );
        })}
      </ol>
    )}
    {canLoadMoreImages && (
      <button type="button" onClick={loadMoreImages}>
        Load more
      </button>
    )}
  </div>
);
```

Most of this logic is straightforward, except for `handleQueryChange`. This function has a lot going on because it's implicitly trying to reset all of the other state variables to their initial values, even though this is not immediately obvious at a glance. Comments can help clarify what's going on:

```tsx
const handleQueryChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
  // Update the user's search query, triggering another API call
  setQuery(e.target.value);
  // New search term means we need to clear the previous results
  setImages([]);
  // Also reset the total pages since it's no longer accurate
  setTotalPages(1);
}, 300);
```

Here's the problem: If we ever introduce new state variables in the future, we'll have to remember to reset those new variables to their initial values in this function. Moreover, if we ever change those default values, this function will need to be updated as well.

It would be nice if our state were instead stored in an object so we could define an initial state and spread it in whenever we want to reset our UI. We can actually still do this with `useState`, but we'll still run into some of the problems I mentioned (and a few others). This leads us to our next section, where we'll refactor our code to use the `useReducer` hook. This will allow us to greatly simplify our state management logic.

## Solution: Manage Complex State with `useReducer`

We saw one problem with managing React state using multiple `useState` calls: It's not obvious, at a glance, that some of those state variables are dependent on each other because they're all declared separately. Moreover, if you need to reset your function component to its initial state, then you need to remember to do this for all of the individual state variables. This makes it difficult to scale the component in the future if it needs to manage additional state.

There are some additional drawbacks to managing complex state in this manner:

1. It's harder to document the state variables themselves (e.g., you can't use jsDoc).
2. We can't directly test the core state logic because it's encapsulated within the component.
3. Multiple state updates aren't batched (at least [prior to React 18](https://github.com/reactwg/react-18/discussions/21)).
4. It's harder to visualize the initial state because it's spread out across multiple declarations.

Like I mentioned above, a stop-gap solution is to store an object in `useState`. But as we're about to see, there's an even better solution: React's `useReducer` hook.

### What Is a Reducer?

Before we look at what `useReducer` does in the context of React, let's understand what a reducer is in principle and why this might be useful for state management.

If you've worked with Redux, you may already be familiar with the term "reducer." It's a pattern that allows you to think of a component's state in terms of **transformations** and **state slices**.

At a high level, it works like this: Rather than spreading a component's state across multiple variables, you store them all in a single object. Whenever you want to update some part of the state, you dispatch an "action" that **describes how you want the state to change**. You then define a **reducer function** to facilitate these transformations. The reducer takes two arguments: the current state and the dispatched action. It determines what type of action is being dispatched and returns a new state based on what the action tells it to do.

In many ways, a reducer is like a blender: It takes in some food that you want to transform into a different shape (your state), and it provides you with an interface that allows you to specify _how_ you want this transformation to occur: all the way from dicing to liquefying (actions). You pick the action you want to take and press a button to _dispatch_ that action, transforming the input from one shape to another. Thus, a blender (reducer) requires just two things: the food that you're about to transform (current state) and a description of how you want to transform it (an action).

By convention, an action is just a JavaScript object with two properties:

- `type`: a unique identifier for the type of state transformation you want to perform.
- `payload` (optional): the value that should be used to update some part of the state.

Here's what an action might look like:

```js
const action = { type: 'set-images', payload: [...] };
```

This action has a `type` identifier, along with a payload consisting of an array of objects. Presumably, this is going to update an array somewhere in our component's state to be this payload array that we're passing in. How an action changes state is entirely up to you to define.

Again, it's worth emphasizing that actions only take this shape by convention—it's not a strict requirement. Moreover, it's not always the case that you need to deliver a payload as part of your state update. For example, a `'reset'` action doesn't need any payload—it'll just return the initial state. In the context of reducers, an action can actually take any shape you want. It can even be just a plain string or some other unique identifier:

```js
const action = 'do-something';
const otherAction = 2;
```

(However, numbers are rarely used for actions because they're not descriptive. An enum would be better, but strings are generally preferred.)

Once you have a set of actions and some state, you can run through all of the possible action types in a reducer, like this:

```js
const initialState = {};

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'update-query': {
      return { ...state, query: action.payload };
    }
    case 'fetch-next-page': {
      return { ...state, queryPage: state.queryPage + 1 };
    }
    default:
      return initialState;
  }
};
```

That's the gist of how a reducer works. And as it turns out, things are not so different over in React. We just need to familiarize ourselves with the `useReducer` hook, the arguments that it accepts, and its return value.

### React's `useReducer` Hook

Like `useState`, `useReducer` is a hook that can be used to manage state in a function component. But unlike its counterpart, `useReducer` doesn't just accept a single argument for the initial value. Rather, `useReducer` can take up to three arguments:

1. `reducer`: The reducer function.
2. `initialState`: The initial state of your component.
3. `initializer`: An optional function that can be used to populate the initial state.

The initializer function is useful if you need to derive some parts of your initial state from props or other conditions, like the initial value of another hook. In this tutorial, we'll focus on the version of `useReducer` that takes just two arguments: the reducer function and the initial state.

The `useReducer` hook then returns an array containing two elements: the state object, and a function that can be used to dispatch an action:

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

This is analogous to destructuring a `useState` call for a slice of state:

```tsx
const [stateVar, setStateVar] = useState(initialValue);
```

That's all you really need to know about `useReducer`. Let's use what we know to refactor our code!

## Replacing `useState` with `useReducer`

If you're using TypeScript, you should start by documenting your component's state with a type/interface. At this point, you can also add jsDoc comments to each of the state properties to clarify their usage whenever a developer hovers over them or tries to access them in their editor.

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
type State = {
  /** A high-level description of the current state of the app
   * (e.g., if it's loading or encountered an error). */
  mode: Mode;
  /** The current set of image results returned by the API. */
  images: ImageResult[];
  /** The search query the user entered. Defaults to an empty string. */
  query: string;
  /** The current page whose images we're requesting. */
  queryPage: number;
  /** The total number of pages that can be requested for the current search query. */
  totalPages: number;
};
```

From this type, we can derive an initial state:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
const initialState: State = {
  mode: 'idle',
  images: [],
  query: '',
  queryPage: 1,
  totalPages: 1,
};
```

In the original code sample, our component's state was initialized with multiple `useState` calls, which made it difficult to visualize the state as a whole. Now, we can just look at the `initialState` variable since all of the initial values are stored alongside each other. Another benefit of having an explicit initial state is that you can use it later on to reset some or all of a component's state.

Now, we need to define a reducer. Recall that a reducer is a function that takes two arguments: the current state (of type `State`) and an action to dispatch. If you're using TypeScript, you'll want to create a type union to list all of the allowed actions. I'll follow the `type/payload` convention:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
type Action = |
 | { type: 'set-mode'; payload: Mode }
 | { type: 'set-images'; payload: { images: ImageResult[]; totalPages: number; } }
 | { type: 'set-query'; payload: string }
 | { type: 'fetch-next-page' }
 | { type: 'reset' };
```

Observe two things about these action types:

- Not all actions need a payload.
- One action may be used to update multiple state properties at once.

Now that we've defined the types for our state and actions, we can create the reducer. I'll use a switch statement to cycle through all of the possible action types. In the default case statement, when the reducer is initializing the component's state for the first time, we'll return the initial state that we defined earlier.

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-mode': {
      return state;
    }
    case 'set-images': {
      return state;
    }
    case 'set-query': {
      return state;
    }
    case 'fetch-next-page': {
      return state;
    }
    case 'reset': {
      return initialState;
    }
    default:
      return initialState;
  }
};
```

This doesn't really do anything meaningful just yet. Right now, the reducer will always return the current state (in this case, the initial state) regardless of what actions we dispatch. We'll revisit this reducer in the next section and flesh it out with concrete logic for each action type. But this should suffice for now to help you get the lay of the land.

Finally, we can use the `useReducer` hook to initialize our function component's state:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
const ImageSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ...
};
```

Great! Notice how cleanly and compactly the component's state is represented at a high level. For this reason, I don't recommend destructuring your state. That way, you can tell where a particular value is coming from in your code: state versus props versus other local variables.

Now, let's define the logic for each action type and refactor our component to use `dispatch` instead of separate `setState` calls.

### 1. Returning New State Based on Action Type

We have this reducer template from earlier:

```tsx
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-mode': {
      return state;
    }
    case 'set-images': {
      return state;
    }
    case 'set-query': {
      return state;
    }
    case 'fetch-next-page': {
      return state;
    }
    case 'reset': {
      return initialState;
    }
    default:
      return initialState;
  }
};
```

If you're using TypeScript, you'll enjoy a much better developer experience thanks to type narrowing. This means that when TypeScript looks at a particular case statement, it'll know what shape the action object has if it falls into that case statement. For example, if we're in the case statement for `'reset'`, TypeScript knows that there's no `payload` on the action object because that's how we originally typed it:

```ts
{ type: 'reset' }
```

Alright, let's fill in these case statements one by one.

Here's `'set-mode'`:

{% include codeHeader.html  file: "ImageSearch.tsx" %}
```tsx
case 'set-mode': {
  return { ...state, mode: action.payload };
}
```

Pretty straightforward—we spread in the current state and override the `mode` property with the payload. If we later dispatch this action:

```tsx
dispatch({ type: 'set-mode', payload: 'loading' });
```

Then `state.mode` will be `'loading'`.

Next up is `'set-images'`, which has a bit more logic than just updating a single state property. In our example, this action gets dispatched once we receive an API response:

{% include codeHeader.html file: "ImageSearch.tsx" %}

```tsx
case 'set-images': {
  const { images, totalPages } = action.payload;
  const newImages = [...state.images, ...images];
  const mode = !newImages.length ? 'no-results' : 'idle';
  return { ...state, images: newImages, totalPages, mode };
}
```

The great thing about the reducer pattern is that it allows us to bundle all of our logic for state updates right there in the case statement and change multiple state variables at once. That way, the component doesn't need to worry about checking for edge cases or updating any other variables inline. We can also write some additional logic in the reducer, like filtering duplicate results, before we return the new state.

Next up is `'set-query'`, for when a user enters a search term in the input box:

{% include codeHeader.html file: "ImageSearch.tsx" %}
```tsx
case 'set-query': {
  return { ...initialState, query: action.payload };
}
```

This time around, we spread in the initial state rather than the current state. That's because every time the user types a new search query, we need to start from scratch to avoid mixing different image results together. Unlike in the original code sample, where we had to manually reset all of the other state variables, we can simply spread in the initial state.

Here's `'fetch-next-page'`, for when a user clicks the load-more button:

{% include codeHeader.html file: "ImageSearch.tsx" %}

```tsx
case 'fetch-next-page': {
  const nextPage = state.queryPage + 1;
  if (nextPage >= state.totalPages) return state;
  return { ...state, queryPage: nextPage };
}
```

And that's it for the reducer! Now, let's refactor the rest of our component to use `dispatch`.

### 2. Dispatching Actions to a Reducer

Here's the old `useEffect` code, with lots of inline checks and sequential state updates. It's a little hard to follow because so many things are going on at once:

```tsx
useEffect(() => {
  const fetchImages = async () => {
    try {
      setMode('loading');
      if (!api) {
        throw new Error(`Unable to connect to API`);
      }
      const { results, total } = await api.fetchImages({ query, page: queryPage });
      if (!results.length) {
        setMode('no-results');
      } else {
        setMode('idle');
      }
      setImages([...images, ...results]);
      setTotalPages(total);
    } catch (e) {
      setMode('error');
    }
  };

  fetchImages();
}, [query, queryPage]);
```

Here's what it looks like if we refactor it to use the dispatcher returned by `useReducer`:

{% include codeHeader.html %}
```tsx
useEffect(() => {
  const fetchImages = async () => {
    try {
      dispatch({ type: 'set-mode', payload: 'loading' });
      if (!api) {
        throw new Error(`Unable to connect to API`);
      }
      const response = await api.fetchImages({ query, page: queryPage });
      const { results: images, total: totalPages } = response;
      dispatch({ type: 'set-images', payload: { images, totalPages }});
    } catch (e) {
      dispatch({ type: 'set-mode', payload: 'error' });
    }
  };

  fetchImages();
}, [query, queryPage]);
```

Since we've offloaded the main complexity of the state updates to the reducer, our code is now much easier to read. If we dispatch a particular action, we can be confident that all of the possible side effects and edge cases will be taken care of at the reducer level, and thus we don't have to worry about doing any of those checks inline.

Finally, here are the two event handlers from before:

```tsx
const handleQueryChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);
  setImages([]);
  setTotalPages(1);
}, 300);

const loadMoreImages = () => {
  const nextPage = queryPage + 1;
  if (nextPage >= totalPages) return;
  setQueryPage(nextPage);
};
```

We can now rewrite them using our dispatch function:

{% include codeHeader.html %}
```tsx
const handleQueryChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: 'set-query', payload: e.target.value });
}, 300);

const loadMoreImages = () => {
  dispatch({ type: 'fetch-next-page' });
};
```

In fact, `loadMoreImages` is unnecessary—we can just use an inline arrow function:

```tsx
<button type="button" onClick={() => dispatch({ type: 'fetch-next-page' })}>
  Load more
</button>
```

Awesome! We've significantly cut down on the noise and complexity of our function component. With all of these enhancements in place, the component now looks like this:

```tsx
const ImageSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Derived variable, no need to store in state.
  const canLoadMoreImages = state.queryPage < state.totalPages;

  // Re-fetch images when a user updates their query or clicks Load more
  useEffect(() => {
    const fetchImages = async () => {
      try {
        dispatch({ type: 'set-mode', payload: 'loading' });
        if (!api) {
          throw new Error(`Unable to connect to API`);
        }
        const response = await api.fetchImages({ query, page: queryPage });
        const { results: images, total: totalPages } = response;
        dispatch({ type: 'set-images', payload: { images, totalPages }});
      } catch (e) {
        dispatch({ type: 'set-mode', payload: 'error' });
      }
    };

    fetchImages();
  }, [query, queryPage]);

  const handleQueryChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'set-query', payload: e.target.value });
  }, 300);

  return (
    <div>
      <label>
        Enter a search term:
        <input type="search" onChange={handleQueryChange} />
        <button type="button" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </label>
      {state.mode === 'loading' && <p>Loading...</p>}
      {state.mode === 'no-results' && <p>No results found</p>}
      {state.mode === 'error' && <p>Something went wrong</p>}
      {state.mode === 'idle' && (
        <ol>
          {state.images.map((image) => {
            return (
              <li key={image.id}>
                <img src={image.src} alt={image.alt} />
              </li>
            );
          })}
        </ol>
      )}
      {canLoadMoreImages && (
        <button type="button" onClick={() => dispatch({ type: 'fetch-next-page' })}>
          Load more
        </button>
      )}
    </div>
  );
};
```

Notice how we're also able to easily implement a reset button:

```tsx
<button type="button" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
```

Originally, we had to manually reset all of the state variables one by one, and that wasn't great—so I didn't even bother showing a reset button in that example because it would've been too complicated. But with `useReducer`, the dispatcher just returns the initial state for this particular action type, so implementing reset functionality is trivial.

## Summary

When you first learn how to manage React state in function components, you're introduced to the wonders of the `useState` hook. It returns a reactive state variable initialized to a particular value, along with a function to update the state. But as your state grows in complexity, you'll find yourself using more and more `useState` calls, and this can quickly become overwhelming.

Fortunately, React allows us to manage more complex state using `useReducer`, which follows the state reducer pattern. In this pattern, we dispatch actions, which are really just objects that describe how we want the state to change from one render to another. This approach allows us to update multiple state properties at once, as well as offload the complexity of state management to a testable and self-contained function.

In this article, we looked at just one application of `useReducer`: maintaining state for paginated API results. There are lots of other scenarios where `useReducer` can be useful; I encourage you to consider where in your code you may be able to leverage this hook to simplify the complexity of your state management.

{% include unsplashAttribution.md name: "Katherine Hanlon", username: "tinymountain", photoId: "bd_fCZhy_W8" %}
