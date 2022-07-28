---
title: "Dynamically Importing Components with React.lazy"
description: Not all static imports are immediately needed, and unnecessary imports can be costly. With React.lazy, you can dynamically import components at run time to reduce the size of your static bundle.
keywords: [React.lazy, dynamically import components, dynamic import, lazy]
categories: [react, webperf, javascript, async]
commentsId: 106
lastUpdated: 2022-06-10
thumbnail:
  url: https://images.unsplash.com/photo-1570288685369-f7305163d0e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

In JavaScript frameworks like React, it's tempting to statically import a wide range of components. But not all of them are needed immediately; some components only render after a user interacts with the page or once a certain run-time condition has been met. Some examples of this include:

- Navigable tabs, where each tab renders its own corresponding tab panel.
- Switch statements that cycle through IDs and render the corresponding component.
- Feature-flagged components that render different UI based on some conditions.
- Any rendering logic that's dynamic or conditional in nature.

Unfortunately, when you statically import these kinds of components, you're shipping a larger bundle than you may need to, which could lead to a slower initial page load. In this article, we'll learn more about this problem and explore its solution in React.

{% include "toc.md" %}

## Only Load What You Need

A best practice in web performance is to defer loading resources until they're actually needed on the page. That's why you're told to put your JavaScript at the end of the body (or, these days, to use module scripts or [the `defer` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer)). The same principle carries over to optimizing static imports in a framework like React—if a component isn't needed immediately, then we shouldn't *bundle* it immediately.

[Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) might come to mind, but it solves a completely different problem. Module bundlers can only statically analyze your code at compile time and remove dead code—they can't anticipate whether an imported module will be used immediately (or at all!) at *run time*.

What we really want is [code splitting](https://webpack.js.org/guides/code-splitting/).

### Code Splitting: Dynamic Imports to the Rescue

With the introduction of [dynamic imports](https://javascript.info/modules-dynamic-imports) in ES2020, we can load modules dynamically rather than statically. In just one line of pure JavaScript, we can reduce the final bundle needed for the initial page load by importing modules at run time:

```js
// Statically imported module (compile time)
import staticModule from 'some/module';

(async () => {
  // Dynamically imported module (runtime)
  const { export1, export2 } = await import('path/to/module');
})();

```

In its function form, `import` returns a `Promise` that resolves with the value of the exported module once the network request has fetched that [chunk](https://webpack.js.org/guides/code-splitting/). This means that you can `await` the import in any async function, loading the module only at run time. This is powerful because it allows you to only ship the code that absolutely needs to run after the document has loaded.

Wouldn't it be nice if we could do the same thing for React components? Well, we actually can!

## Demo: Statically Imported Components

For this tutorial, I've prepared a [CodeSandbox demo of dynamic imports in React](https://codesandbox.io/s/react-lazy-imports-demo-5z40f) (you can also find the full source [on GitHub](https://github.com/AleksandrHovhannisyan/react-dynamic-imports-demo)). Feel free to follow along as you read this post; I'll share a simplified version of the code here and show video demos as we go along. We'll first look at the static import version and then optimize it with dynamic imports.

Let's suppose we have a simple React app that renders tab panels and some buttons to change the current tab. Each tab panel is its own component; the ones in this demo are very simple and just display some mock text, but in a real app, a tab panel might contain paragraphs of text, imagery, videos, and more (depending on what the tabs are being used for). We'll first import each tab panel statically, like so:

```jsx {data-file="App.jsx" data-copyable=true}
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import Tab4 from './components/Tab4';
```

Let's also create a static array for our tabs. Each entry contains an object config with two properties: the component to render for the tab panel, and whether the tab is disabled (optional).

```jsx {data-file="App.jsx" data-copyable=true}
const tabs = [
  { component: Tab1 },
  { component: Tab2 },
  { component: Tab3, isDisabled: true },
  { component: Tab4 },
];
```

Finally, we'll render the tabs and maintain some state to toggle the active tab:

```jsx {data-file="App.jsx" data-copyable=true}
const App = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const renderTabPanel = () => {
    const TabPanel = tabs[currentTabIndex].component;
    return <TabPanel />;
  };

  return (
    <>
      <div role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            onClick={() => setCurrentTabIndex(index)}
            aria-selected={index === currentTabIndex}
            aria-controls={`tab-panel-${index}`}
            disabled={tab.isDisabled}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div>{renderTabPanel()}</div>
    </>
  );
};
```

Let's load the app and inspect our network tab:

{% include "postImage.html" src: "./images/static.jpg", alt: "A tab bar shows four numbered tabs, 1-4, with the third tab slightly grayed out to indicate that it's disabled. The first tab has a dark background to indicate that it's currently selected. Below it is the corresponding content for the first tab panel, which reads: 'Tab 1 contents'. Chrome dev tools are open below and show the Network tab, with two requests: main.chunk.js (5.3 kilobytes) and vendors~main.chunk.js (415 kilobytes)." %}

Only two bundles get loaded: the main chunk (`5.3kB`) and some vendor chunks (`415kB` cache of third-party NPM modules). Notice how we only render `Tab1` on mount—the remaining tab panels will never mount unless we click their respective buttons. In fact, you may have noticed that I disabled the button for the third tab entirely, meaning it's *never* going to mount. However, since we've imported each component statically, **all of them** will be bundled into the code that we ship to the user, regardless of whether they get used.

## Dynamic Imports with `React.lazy`

Fortunately, React allows us to dynamically import components using its `React.lazy` API. This function accepts a callback that's expected to return a dynamically imported component. Here's an example of what its usage might look like:

```jsx
import { lazy } from 'react';

const MyComponent = lazy(() => import('path/to/component'));
```

Unlike static imports, React's dynamic imports don't bundle the module at compile time. Rather, when the component is about to render for the first time, React will resolve the promise and load the corresponding module, swapping it in as the app is running. This saves you some bandwidth since you're able to ship a smaller initial bundle on page load—the component and any other assets it imported (e.g., CSS or images) will also be deferred.

There's just one catch: We need to specify some fallback UI for the dynamically imported component. That way, between the time when we request the component and the time when the dynamic import resolves, the React tree isn't left in a limbo state where it has no valid UI for a node. We can do this using React's specially made `Suspense` component, which takes a `fallback` prop and wraps the lazy component:

```jsx {data-file="App.jsx" data-copyable=true}
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

And that's all there is to it! Let's refactor our imports from earlier. Instead of doing this:

```jsx {data-file="App.jsx"}
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import Tab4 from './components/Tab4';
```

We'll do this:

```jsx {data-file="App.jsx" data-copyable=true}
import { lazy, Suspense } from 'react';
const Tab1 = lazy(() => import('./components/Tab1'));
const Tab2 = lazy(() => import('./components/Tab2'));
const Tab3 = lazy(() => import('./components/Tab3'));
const Tab4 = lazy(() => import('./components/Tab4'));
```

And then we'll update our render function here to use `Suspense`:

```jsx {data-file="App.jsx" data-copyable=true}
const renderTabPanel = () => {
  const TabPanel = tabs[currentTabId].component;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabPanel />
    </Suspense>
  );
};
```

Now, if you navigate to another tab, the fallback UI will render while the module is being fetched. Here's a video demo:

{% include "video.html" src: '/assets/videos/react-dynamic-import-demo.mp4', width: 1224, height: 586, sourceType: 'video/mp4' %}

I've throttled my network speed to Slow 3G to artificially delay the duration of each network request so the placeholder is noticeable (otherwise, because of the small size of the chunks in this demo, we'd get an almost instantaneous load time). Notice how each tab navigation requests a new chunk; the request status is pending until that module is fully loaded. Once the status comes back as 200 (success), the module becomes available to our app. At that point, the placeholder UI gets swapped out, and the real component renders. Additionally, observe that the size of the main chunk is now `4.8kB`, whereas previously it was `5.3kB`. We don't see significant savings in this case because the tab panels themselves are quite small in size, but this could make quite the difference for larger bundles.

Moreover, subsequent navigation to previously rendered tabs is snappy, with no delay. Because those modules have already been loaded, no additional network requests need to be made—the app just re-renders. Best of all, components that never rendered won't ever be bundled into the app or loaded at run time. In this case, the module for the third tab was never requested.

## Considerations for Dynamic Imports in React

Dynamic imports are a great tool when used judiciously. But like all optimizations, they don't come for free.

First, as we saw, dynamic imports require your app to make additional network requests at run time to fetch those lazily loaded modules. This is a classic tradeoff: either you bundle everything and create a potentially slower initial load, or you bundle only the essentials and lazily load everything else. The benefit of bundling everything is that users don't have to see a fallback UI while the component loads in the background. On the other hand, dynamic imports take a more conservative approach, saving bandwidth on the initial load at the cost of making users wait later on. However, it's worth noting that this usually won't cause problems, even if a dynamically imported component re-renders several times. This is because the module will have already loaded after the first request, so subsequent renders won't make redundant requests.

Second, as I noted earlier, dynamic imports in React require that you specify a fallback UI that gets shown until the component is fetched at some later point in time. If your fallback UI and the real UI differ drastically in the amount of space that they occupy on the page, then this may cause layout shifts, pushing the surrounding content aside to make room once the component has loaded. The original demo used a placeholder with roughly the same dimensions as the real content, so no layout shifts occurred. But here's another version of the same app with a poorly styled placeholder:

{% include "video.html" src: '/assets/videos/react-dynamic-import-layout-shift.mp4', width: 1230, height: 586, sourceType: 'video/mp4' %}

A classic workaround for this is to create skeleton loader components that closely approximate the size of the real content. That way, when the dynamically imported component renders for the first time, your app is able to seamlessly transition from placeholder UI to real UI.

Finally, it's worth noting that as of this writing, [you can't lazily import named exports from modules](https://reactjs.org/docs/code-splitting.html#named-exports) in React, even though it's possible in vanilla JavaScript. So this won't work:

```jsx
const { Export1, Export2 } = lazy(() => import('import/path'));
```

One workaround is to re-export those modules as default exports from an intermediate module and then lazily import those default exports:

```js {data-file="Export1.js"}
export { Export1 as default } from 'import/path';
```

```js {data-file="Export2.js"}
export { Export2 as default } from 'import/path';
```

## Don't Worry, Be Lazy

Static imports are straightforward—every imported module is included in the final bundle of your app. But this can come at a cost if you import components that aren't used immediately (or at all). Depending on the size of your static bundle, this could cause a more sluggish loading experience or delay the fetching of other key resources.

Dynamic imports solve this problem by allowing you to defer loading modules until they're actually needed, helping you ship smaller bundles. In React, dynamically importing a component is easy—you invoke `React.lazy` with the standard dynamic import syntax and specify a fallback UI. When the component renders for the first time, React will load that module and swap it in.

I encourage you to consider where in your app you may be able to reap performance gains by lazily loading components. You may find the examples from the intro relevant.

{% include "unsplashAttribution.md" name: "Chris Curry", username: "chriscurry92", photoId: "GYpsSWHslHA" %}
