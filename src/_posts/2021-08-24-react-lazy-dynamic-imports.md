---
title: "Dynamically Importing Components with React.lazy"
description: Certain static imports may increase your bundle size, potentially hurting performance. With React.lazy, you can dynamically import components at runtime.
keywords: [React.lazy, dynamically import components, dynamic import, lazy]
categories: [react, webperf, javascript, async]
thumbnail: thumbnail.jpg
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

With the introduction of [dynamic imports](https://javascript.info/modules-dynamic-imports) in ESM, we can load modules dynamically rather than statically. In just one line of pure JavaScript, we can reduce the final bundle needed for the initial page load by importing modules at runtime:

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

For this article, I've prepared a [CodeSandbox demo of dynamic imports in React](https://codesandbox.io/s/react-lazy-imports-demo-5z40f). Feel free to follow along there as you read this post. I'll share a simplified version of the demo code here.

Let's suppose we have a simple React app that renders tab panels and some buttons to change the current tab. Since we don't need to over-complicate this demo, I'll just assume that each tab panel is defined as its own component somewhere; we'll import them into our app like so:

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

## Don't Worry, Be Lazy

Static imports are straightforward, but they have their limitations. If you import components that may not get used immediately on the page, you'll waste your users' bandwidth and potentially increase your app's memory usage.

Dynamic imports are powerful—they allow you to defer loading modules until they're actually needed, helping you ship smaller bundles. In React, dynamically importing a component is easy—you invoke `React.lazy` with the standard dynamic import syntax and specify a fallback UI. When the component renders for the first time, React will load that module and swap it in.

I encourage you to consider where in your app you may be able to reap performance gains by lazily loading components. You may find the examples from the intro relevant.

However, as with all optimizations, you shouldn't abuse this newfound knowledge. As I noted in an earlier section, `Suspense` fallbacks may create unwanted layout shifts that may hurt your page's [Core Web Vitals](https://web.dev/vitals/) score on indexed pages; be sure to test and refine your changes as needed.

{% include unsplashAttribution.md name: "Chris Curry", username: "chriscurry92", photoId: "GYpsSWHslHA" %}
