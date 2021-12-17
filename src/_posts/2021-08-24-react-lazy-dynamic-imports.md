---
title: "Dynamically Importing Components with React.lazy"
description: Not all static imports are immediately needed, and unnecessary imports can be costly. With React.lazy, you can dynamically import components at runtime to reduce the size of your static bundle.
keywords: [React.lazy, dynamically import components, dynamic import, lazy]
categories: [react, webperf, javascript, async]
commentsId: 106
lastUpdated: 2021-12-17
thumbnail:
  url: https://images.unsplash.com/photo-1570288685369-f7305163d0e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

In JavaScript frameworks like React, it's tempting to statically import a wide range of components. But not all of them are needed immediately; some components only render after a user interacts with the page or once a certain run-time condition has been met. Some examples of this include:

- Navigable tabs, where each tab renders its own view.
- Switch statements that cycle through IDs and render the corresponding component.
- Feature-flagged components that render different UI based on some conditions.
- Any rendering logic that's dynamic or conditional in nature.

Unfortunately, when you statically import these kinds of components, you're shipping a larger bundle than you may need to, which could lead to a slower initial page load. In this article, we'll learn more about this problem and explore its solution in React.

{% include toc.md %}

## Only Load What You Need

A best practice in web performance is to defer loading resources until they're actually needed on the page. That's why you're told to put your JavaScript at the end of the body (or, these days, to use module scripts or [the `defer` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer)).

The same principle should carry over to optimizing static imports in a framework like React—if a component isn't needed immediately, then we shouldn't *bundle* it immediately.

[Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) might come to mind, but it solves a completely different problem. Module bundlers can only statically analyze your code at compile time and remove dead code—they can't anticipate whether an imported module will be used immediately (or at all!) at *runtime*.

What we really want is [code splitting](https://webpack.js.org/guides/code-splitting/).

### Code Splitting: Dynamic Imports to the Rescue

With the introduction of [dynamic imports](https://javascript.info/modules-dynamic-imports) in ES2020, we can load modules dynamically rather than statically. In just one line of pure JavaScript, we can reduce the final bundle needed for the initial page load by importing modules at runtime:

```js
// Statically imported module (compile time)
import staticModule from 'some/module';

(async () => {
  // Dynamically imported module (runtime)
  const { export1, export2 } = await import('path/to/module');
})();

```

In its function form, `import` returns a `Promise` that resolves with the value of the exported module. This means that you can `await` the import in any async function, loading the module only at runtime. This is incredibly powerful because it allows you to only ship the code that absolutely needs to run after the document has loaded.

Wouldn't it be nice if we could do the same thing in React? Well, we actually can!

## Dynamic Imports with `React.lazy`

For this tutorial, I've prepared a [CodeSandbox demo of dynamic imports in React](https://codesandbox.io/s/react-lazy-imports-demo-5z40f). Feel free to follow along there as you read this post. I'll share a simplified version of the demo code here.

Let's suppose we have a simple React app that renders tab panels and some buttons to change the current tab. Each tab panel is its own component; the ones in this demo are very simple and just display some mock text, but in a real app, a tab panel might contain paragraphs of text, imagery, videos, and more (depending on what the tabs are being used for). We'll import each tab panel statically, like so:

{% include codeHeader.html file: "App.jsx" %}
```jsx
import TabA from './components/TabA';
import TabB from './components/TabB';
import TabC from './components/TabC';
```

Let's also create a config for our tabs. The keys are the tab IDs and the values are objects describing the tabs, like whether they're disabled and what component should be rendered.

{% include codeHeader.html file: "App.jsx" %}
```jsx
const tabs = {
  a: {
    component: TabA,
    disabled: false,
  },
  b: {
    component: TabB,
    disabled: false,
  },
  c: {
    component: TabC,
    disabled: true,
  },
};
```

Finally, we'll render the tabs and maintain some state to toggle the active tab:

{% include codeHeader.html file: "App.jsx" %}
```jsx
const App = () => {
  const [currentTabId, setCurrentTabId] = useState('a');

  const renderTabPanel = () => {
    const TabComponent = tabs[currentTabId].component;
    return <TabComponent />;
  };

  return (
    <>
      <div role="tablist">
        {Object.keys(tabs).map((id) => (
          <button
            key={id}
            role="tab"
            onClick={() => setCurrentTabId(id)}
            aria-selected={id === currentTabId}
            aria-controls={`tab-panel-${id}`}
            disabled={tabs[id].disabled}
          >
            {id}
          </button>
        ))}
      </div>
      <div>{renderTabPanel()}</div>
    </>
  );
};
```

Great! When we load the page, we get this initial UI:

{% include img.html src: "a.png", alt: "Three buttons are arranged horizontally and in the following order: A, B, C. Button A has a dark background and light text color, indicating that it's currently selected. Button C has a slightly shaded color, indicating that it's disabled. The text below the buttons reads Tab A." %}

Notice how we only render `TabA` on mount—the remaining tabs will never render unless we click their buttons. In fact, you may have noticed that I disabled the button for tab C entirely, meaning it's never going to render. However, since we've imported each component statically, **all of them** will be bundled into the code that we ship to the user, regardless of whether they get used.

Fortunately, React allows us to dynamically import components using its `React.lazy` API. This function accepts a callback that's expected to return a dynamically imported component. Here's an example of what its usage might look like:

```jsx
import { lazy } from 'react';

const MyComponent = lazy(() => import('path/to/component'));
```

Unlike static imports, React's dynamic imports don't bundle the module at compile time. Rather, when the component is about to render for the first time, React will resolve the promise and load the corresponding module, swapping it in as the app is running. This saves you some bandwidth since you're able to ship a smaller initial bundle.

There are two things worth noting here. The first is that, as of this writing, [you can't lazily import named exports from modules](https://github.com/facebook/react/issues/14603) in React, even though it's possible in vanilla JavaScript:

```jsx
// this won't work
const { Export1, Export2 } = lazy(() => import('path/to/component'));
```

One workaround is to re-export those modules as default exports from an intermediate module.

The second catch is that you need to specify some sort of fallback UI. That way, between the time when we request the component and the time when the dynamic import resolves, the React tree isn't left in a limbo state where it has no valid UI for a node. We can do this using React's specially made `Suspense` component, which takes a `fallback` prop and wraps the lazy component:

{% include codeHeader.html file: "App.jsx" %}
```jsx
import { lazy, Suspense } from 'react';

const MyComponent = lazy(() => import('path/to/component'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
};
```

You can also specify a fallback of `null` if you don't need a placeholder; this makes sense if the UI you're rendering has a fixed layout, like a grid. But if that's not the case, you might get layout shifts, so you may want to use a placeholder that approximates the real UI.

And that's all there is to it!

Let's refactor our imports from earlier. Instead of doing this:

{% include codeHeader.html file: "App.jsx", copyable: false %}
```jsx
import TabA from './components/TabA';
import TabB from './components/TabB';
import TabC from './components/TabC';
```

We'll do this:

{% include codeHeader.html file: "App.jsx" %}
```jsx
import { lazy, Suspense } from 'react';

const TabA = lazy(() => import('./components/TabA'));
const TabB = lazy(() => import('./components/TabB'));
const TabC = lazy(() => import('./components/TabC'));
```

And then we'll update our render function here to use `Suspense`:

{% include codeHeader.html file: "App.jsx" %}
```jsx
const renderTabPanel = () => {
  const TabComponent = tabs[currentTabId].component;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabComponent />
    </Suspense>
  );
};
```

Now, if you navigate to another tab, you'll notice a momentary delay and a fallback UI:

{% include img.html src: "loading.png", alt: "Three buttons are arranged horizontally and in the following order: A, B, C. Button B has a dark background and light text color, indicating that it's currently selected. Button C has a slightly shaded color, indicating that it's disabled. The text below the buttons reads Loading." %}

Once the dynamic import resolves, the component will be swapped in:

{% include img.html src: "b.png", alt: "Three buttons are arranged horizontally and in the following order: A, B, C. Button B has a dark background and light text color, indicating that it's currently selected. Button C has a slightly shaded color, indicating that it's disabled. The text below the buttons reads Tab B." %}

Subsequent navigation to previously rendered tabs is snappy, with no delay, because those modules have already been loaded. Best of all, components that never rendered won't ever be bundled into the app or loaded at runtime.

## Considerations for Dynamic Imports

Dynamic imports are a great tool when used judiciously. But like all optimizations, they don't come for free.

First, because of their very nature, dynamic imports require your app to make additional network requests at run time to fetch those lazily loaded modules. This is a classic tradeoff: either you bundle everything and create a potentially slower initial load, or you bundle only the essentials and lazily load everything else. The benefit of bundling everything is that users don't have to see a fallback UI while the component loads in the background. On the other hand, dynamic imports take a more conservative approach, saving bandwidth on the initial load at the cost of making users wait later on. However, it's worth noting that this usually won't cause problems, even if a dynamically imported component re-renders several times. This is because the module will have already loaded after the first request, so subsequent renders won't make redundant requests.

Second, as I noted earlier, dynamic imports in React require that you specify a fallback UI that gets shown until the component is fetched at some later point in time. If your fallback UI and the real UI differ drastically in the amount of space that they occupy on the page, then this may cause layout shifts, pushing the surrounding content aside to make room once the component has loaded. A classic workaround for this is to create skeleton loader components that closely approximate the size of the real content. That way, when the dynamically imported component renders for the first time, your app is able to seamlessly transition from placeholder UI to real UI.

## Don't Worry, Be Lazy

Static imports are straightforward—every imported module is included in the final bundle of your app. But this can come at a cost if you import components that aren't used immediately (or at all). Depending on the size of your static bundle, this could cause a more sluggish loading experience or delay the fetching of other key resources.

Dynamic imports solve this problem by allowing you to defer loading modules until they're actually needed, helping you ship smaller bundles. In React, dynamically importing a component is easy—you invoke `React.lazy` with the standard dynamic import syntax and specify a fallback UI. When the component renders for the first time, React will load that module and swap it in.

I encourage you to consider where in your app you may be able to reap performance gains by lazily loading components. You may find the examples from the intro relevant.

{% include unsplashAttribution.md name: "Chris Curry", username: "chriscurry92", photoId: "GYpsSWHslHA" %}
