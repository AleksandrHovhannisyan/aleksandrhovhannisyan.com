---
title: Detecting Nested Components in React with the Context API
description: Normally, React's Context API is used to avoid prop drilling. But you can also use it to detect if a component is a child of a particular component.
keywords: [react, nested components, context]
categories: [react, html]
thumbnail: https://images.unsplash.com/photo-1598811629267-faffa0027fe4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80
---

The React Context API was created to solve the problem of prop drilling, where you need to pass a prop from a parent high up in the tree to a descendant lower in the tree. Without this API, you would either need to drill the prop through several intermediate children or read this data from a global store with a higher-order component or hook. But the Context API also has some other interesting uses (and, admittedly, abuses).

In this article, I want to demonstrate how React Context can be used to detect whether a component has a particular parent somewhere higher up in the DOM. More specifically, we'll use React Context to detect if a component is nested within another instance of _itself_, which can be useful for DOM validation. For example, buttons cannot have interactive children (e.g., other buttons), but there are no guardrails in HTML, browsers, or frameworks like React that prevent developers from violating this rule. Linters will only catch such a failure if it's in a single file, but components can be nested arbitrarily deep, across multiple files.

{% aside %}
To React's credit, it already shows built-in console warnings (`validateDOMNesting`) when you attempt to render an invalid DOM structure, but these warnings do little to discourage misuse. They can also easily be missed if a developer isn't constantly monitoring their dev tools as they're building a page. It's better to throw an error.
{% endaside %}

{% include "toc.md" %}

## Using Context to Detect Nested Components

Here's the basic idea:

1. We'll create a React Context that stores a boolean value.
2. The component in question (e.g., `Button`) will render the context provider.
3. Internally, the same component will also consume its own context.

Let's take it one step at a time and understand how this works.

### 1. Creating a Context

First, we'll create a simple React context that stores a boolean value:

```jsx {data-copyable="true"}
import { createContext, useContext } from 'react';

// could also default to undefined
const ButtonAncestryContext = createContext(false);

export const useButtonAncestry = () => useContext(ButtonAncestryContext);
```

For convenience, I also defined a custom `useButtonAncestry` hook to consume this context more easily so I don't have to do `useContext(ButtonAncestryContext)` everywhere; instead, I can just call `useButtonAncestry`.

### 2. Rendering the Provider

Now, we'll render this context provider inside our `Button` component, passing along a value of `true`:

```jsx {data-copyable="true"}
const Button = (props) => {
  return <ButtonAncestryContext.Provider value={true}>
    <button {...props} />
  </ButtonAncestryContext.Provider>
}
```

So far, we're not really doing anything special, and this should be familiar if you've ever worked with React Context. Things are about to get interesting, though...

### 3. Consuming the Context in the Provider

Finally, in the same `Button` component, we'll consume its own context:

```jsx {data-copyable="true"}
const Button = (props) => {
  const hasButtonParent = useButtonAncestry();

  return <ButtonAncestryContext.Provider value={true}>
    <button {...props} />
  </ButtonAncestryContext.Provider>
}
```

Ordinarily, the context value returned by the `useContext` hook in this code sample (`hasButtonParent`) would be the default value for the context (in this case, `false`) because the component consuming the context is, itself, the provider—there are no providers above it in the tree. For example, the React DOM without nested buttons might look like this:

```html
<html>
  <body>
    <main>
      <!-- This Button has no ButtonAncestryContext.Provider
      above it, so consuming the context returns false -->
      <Button></Button>
    </main>
  </body>
</html>
```

For the value to be defined, there would need to be a provider for `ButtonAncestryContext` above the `Button`. But the `Button` is, itself, the provider. The only way this is possible is if `Button` is nested within another instance of itself (assuming we've set up our code correctly to ensure that `Button` is the one and only provider of this context):

```html
  <!-- This Button has no context provider above it -->
<Button>
  <span>
    <!-- But this one does! -->
    <Button></Button>
  </span>
</Button>
```

The inner `Button` in the tree above would get its context value from the parent `Button`, allowing it to detect that it is nested inside another `Button`. All that remains is to check whether the context value is truthy and, if so, throw an error:

```jsx {data-copyable="true"}
const Button = (props) => {
  // true if there's another Button above us in the DOM...
  const hasButtonParent = useButtonAncestry();

  // ...and if that's the case, we have an invalid DOM
  if (hasButtonParent) {
    throw new Error(`Invalid DOM: buttons cannot be children of buttons.`)
  }

  return <ButtonAncestryContext.Provider value={true}>
    <button {...props} />
  </ButtonAncestryContext.Provider>
}
```

The only situation where you'll need to be careful with this is if you're rendering the component conditionally or behind some gating logic. In that case, your app's build process won't fail, resulting in an uncaught runtime error. Alternatively, you could handle the error more gracefully by returning a valid DOM node that is allowed to be nested in a button, although this wouldn't really make sense if the original intent was for it to be an interactive button:

```jsx {data-copyable="true"}
const Button = (props) => {
  const hasButtonParent = useButtonAncestry();

  return <ButtonAncestryContext.Provider value={true}>
    {hasButtonParent ? <span {...props} /> : <button {...props} />}
  </ButtonAncestryContext.Provider>
}
```

## Making It More Reusable

So far, we've only validated buttons nested in other buttons. But this idea can be extended to validate other types of parent-child relationships. For starters, let's rename our context to make it more generic:

```jsx {data-copyable="true"}
import { createContext, useContext } from 'react';

const InteractiveAncestryContext = createContext(false);
```

Rename the hook:

```jsx {data-copyable="true"}
export const useInteractiveAncestry = () => useContext(InteractiveAncestryContext);
```

And export a reusable provider to encapsulate the nested context logic:

```jsx {data-copyable="true"}
export const InteractiveAncestryProvider = ({ children }) => {
  const hasInteractiveParent = useInteractiveAncestry();

  if (hasInteractiveParent) {
    throw new Error(`Invalid DOM: interactive elements cannot be nested in each other.`);
  }

  return <InteractiveAncestryContext.Provider value={true}>
    {children}
  </InteractiveAncestryContext.Provider>
}
```

Now, we can greatly simplify our `Button` component:

```jsx {data-copyable="true"}
const Button = (props) => {
  return <InteractiveAncestryProvider>
    <button {...props} />
  </InteractiveAncestryProvider>
}
```

What does this give us? Well, now we can also have our `Link`, `Input`, and other interactive components render this same provider:

```jsx {data-copyable="true"}
const Link = (props) => {
  return <InteractiveAncestryProvider>
    <a {...props} />
  </InteractiveAncestryProvider>
}
```

So now we also detect if buttons are nested in links and vice versa.

## Other Use Cases

You don't necessarily need to use this technique for just DOM validation. For example, imagine an app that has poppers—tooltips or popovers that show in response to a certain user interaction, like a button click or a hover/focus event. Your app might allow poppers to be nested inside other poppers. Assuming that the library you're using (like Tippy.js) follows accessible patterns, this isn't necessarily a problem in and of itself. However, you can run into some edge cases, as we did in our app at work.

One of my co-workers came up with a clever solution to a tricky problem where multiple button-triggered poppers could remain open simultaneously if a user was navigating the app via keyboard and triggering each popper along the way. The solution wasn't as simple as detecting a blur event and closing all other poppers (e.g., via Tippy.js's [`hideAll` method](https://atomiks.github.io/tippyjs/v6/methods/#hideall)) since there was no way to exclude the parent popper (if one existed). So closing all other poppers would also close the parent, which in turn would close the very popper the user just opened. But the `hideAll` method provides an `exclude` option: a reference to a DOM node to ignore when closing all other poppers. If only we could detect whether a popper is nested within another popper, we could easily exclude the parent... Sound familiar? We can accomplish this with the React Context trick we just learned: The context can store a reference to the popper instance, and any poppers nested inside other poppers will have access to their parent popper instance. Something like this:

```jsx {data-copyable="true"}
const Popper = (props) => {
  // Same idea as before, but now we also expose a setter method
  const { parentPopper, setPopper } = useNestedPoppers();

  return (
    <Popper
      // set context so nested poppers can see this parent
      onCreate={(instance) => setPopper(instance)}
      // hide all other poppers except our parent, if we have one
      onShow={() => hideAll({ exclude: parentPopper })}
      {...props}
    />);
}
```

When the popper is created, it sets the context to itself, meaning any nested poppers will later be able to reference this parent popper. When any popper shows, it hides all other poppers except its parent.

{% aside %}
This won't work if a popper is nested three levels or deeper. In that case, you'll need to keep track of an array of parents rather than just one.
{% endaside %}

{% include "unsplashAttribution.md" name: "Julia Kadel", username: "juliakadel", photoId: "YmULswIbc3I" %}
