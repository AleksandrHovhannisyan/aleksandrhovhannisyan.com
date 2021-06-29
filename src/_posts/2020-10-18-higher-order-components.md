---
title: What Are Higher-Order Components in React?
description: Higher-order components are one of React's most popular design patterns, allowing you to define reusable stateful logic and create powerful, flexible components.
keywords: [higher-order components]
categories: [dev, react, design-patterns]
lastUpdated: 2020-11-10
commentsId: 61
---

If you're new to React, or even if you've been using it for a while, you may have heard about these things called **higher-order components (HOCs)**, and shuddered at the apparent complexity of the term. It certainly *sounds* like something fancy that's beyond a beginner's comprehension. But that's not the case at all—the truth is that higher-order components in React are a very intuitive (and powerful!) design pattern.

In this tutorial, we'll explore what higher-order components are and why you might want to use them. We'll also learn how you can combine them with the React Context API to create reusable components and behaviors. Let's dig in!

{% include toc.md %}

## Prerequisite Terminology

As a super-quick refresher, note that a React **component** is just a function that returns a React element:

```jsx
// This is a component
function Component(props) {
  return React.createElement("img", {
    className: "img",
    width: 1000
  });
}

// This is basically the same component but using JSX
function Component(props) {
  return <img className="image" width={1000} />;
}
```

That's all you really need to know before moving on.

## What Are Higher-Order Components?

Simply put, a **higher-order component** is a function that returns a component. At the end of the day, it's *just a function*, like any other that you're used to working with by now in JavaScript and other languages.

To go a bit more into detail, a higher-order component is a special kind of function that:

1. Accepts a React component as one of its arguments (among others, potentially).
2. Injects certain props into the component to "decorate" it or extend its behavior.
3. Returns this "decorated" component so that others can render it later on.

In other words, a higher-order component is essentially a **component factory**. It's a design pattern that allows you to create new versions of existing components by injecting additional props into them. Notably, higher-order components are used to consolidate reusable, **stateful logic** in a single place.

{% include img.html src: "diagram.png", alt: "A higher-order component returns a component, which returns a React element." %}

Don't get confused—an HOC is not itself a component. Remember: Components are functions that return a React element; higher-order components are functions that return *components*.

At a high level, without going into any specifics, here's what a higher-order component might look like:

```jsx
// A higher-order component...
function hoc(Component, other, args) {
  // ... returns a component...
  return function(props) {
    // ...which is just a function that returns an element!
    return <Component someProp="someValue" {...props}>Awesome!</Component>
  }
}
```

Of course, this doesn't tell you much about why you might want to use a higher-order component. To truly see the benefits, we'll now look at a practical example of higher-order components.

## Example of Higher-Order Components

Suppose we're using React to create a blog (e.g., with a static site generator like Gatsby). You can follow along with the code in this tutorial or view the [companion CodeSandbox demo](https://codesandbox.io/embed/higher-order-components-demoexample-fvlhy).

To kick things off, we'll create a basic presentational component named `PostList` that represents a generic list of posts. Nothing fancy here:

{% include codeHeader.html file: "components/PostList/index.js" %}
```jsx
import React from "react";

const PostList = ({ posts }) => (
  <ol>
    {posts.map((post) => (
      <li key={post.id}>
        <a href={post.href}>{post.title}</a>
        <p>{post.description}</p>
      </li>
    ))}
  </ol>
);

export default PostList;
```

Your blog is going to have three different kinds of posts: recent, popular, and archived. Since we don't actually have any real data to work with here, we'll create some fake data and use that for this tutorial:

{% include codeHeader.html file: "containers/Posts/api.js" %}
```js
const recentPosts = [
  {
    id: 1,
    title: "Recent Post 1",
    href: "/recent-post-1/",
    description: "Recent post 1 description"
  },
  {
    id: 2,
    title: "Recent Post 2",
    href: "/recent-post-2/",
    description: "Recent post 2 description"
  },
  {
    id: 3,
    title: "Recent Post 3",
    href: "/recent-post-3/",
    description: "Recent post 3 description"
  }
];

const popularPosts = [
  {
    id: 1,
    title: "Popular Post 1",
    href: "/popular-post-1/",
    description: "Popular post 1 description"
  },
  {
    id: 2,
    title: "Popular Post 2",
    href: "/popular-post-2/",
    description: "Popular post 2 description"
  },
  {
    id: 3,
    title: "Popular Post 3",
    href: "/popular-post-3/",
    description: "Popular post 3 description"
  }
];

const archivedPosts = [
  {
    id: 1,
    title: "Archived Post 1",
    href: "/archived-post-1/",
    description: "Archived post 1 description"
  },
  {
    id: 2,
    title: "Archived Post 2",
    href: "/archived-post-2/",
    description: "Archived post 2 description"
  },
  {
    id: 3,
    title: "Archived Post 3",
    href: "/archived-post-3/",
    description: "Archived post 3 description"
  }
];

export const getRecentPosts = () => recentPosts;
export const getPopularPosts = () => popularPosts;
export const getArchivedPosts = () => archivedPosts;
```

In the real world, you'd hit an actual API endpoint rather than returning local, static data. For the purposes of this tutorial, though, we've hardcoded our data for recent, popular, and archived posts in arrays. And at the bottom, we've exported three functions that return these arrays.

Our blog will consist of the following container component:

{% include codeHeader.html file: "containers/Posts/index.js" %}
```jsx
import React from "react";
import {
  ArchivedPosts,
  PopularPosts,
  RecentPosts
} from "../../components/PostList";

const Posts = (props) => {
  return (
    <article>
      <section>
        <h2>Recent Posts</h2>
        <RecentPosts />
      </section>
      <section>
        <h2>Popular Posts</h2>
        <PopularPosts />
      </section>
      <section>
        <h2>Archived Posts</h2>
        <ArchivedPosts />
      </section>
    </article>
  );
};

export default Posts;
```

Of course, the three components you see here don't exist just yet, so let's go ahead and create them now. We'll use the fetch functions we defined just a few seconds ago to do that. Keep in mind that in the real world, you'd probably use some Promise-based fetch function to get your data, and thus you'd need to either `await` your data or chain `then`s:

{% include codeHeader.html file: "components/PostList/index.js" %}
```jsx
import React, { useEffect, useState } from "react";
import {
  getArchivedPosts,
  getPopularPosts,
  getRecentPosts,
} from "../../containers/Posts/api";

// Same as before
const PostList = ({ posts }) => (
  <ol>
    {posts.map((post) => (
      <li key={post.id}>
        <a href={post.href}>{post.title}</a>
        <p>{post.description}</p>
      </li>
    ))}
  </ol>
);

export const RecentPosts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getRecentPosts());
  }, []);

  return <PostList posts={posts} {...props} />;
};

export const PopularPosts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getPopularPosts());
  }, []);

  return <PostList posts={posts} {...props} />;
};

export const ArchivedPosts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getArchivedPosts());
  }, []);

  return <PostList posts={posts} {...props} />;
};

export default PostList;
```

Basically, each component fetches its respective type of posts after it mounts and renders a `PostList`, passing along the result of our fake API call to the `posts` prop.

This works just fine, but notice how we ended up repeating a lot of common logic. Each component:

1. Initializes an empty array as its state.
2. Makes an API call on mount and updates its state.
3. Returns a `PostList`, injecting the `posts` prop and spreading the rest.

The only thing that differs is the fetch function that gets called on mount: it's either `getRecentPosts`, `getPopularPosts`, or `getArchivedPosts`. What if we could instead create a helper function—a factory, really—that consolidates this shared logic in a function that spits out specialized `PostList` components?

That's precisely the idea behind higher-order components in React.

### Creating Reusable Stateful Logic with Higher-Order Components

I'll show the higher-order component for this scenario now, in its entirety, and then explain how it works:

{% include codeHeader.html file: "components/PostList/withPosts.js" %}
```jsx
import React, { useState, useEffect } from "react";

function withPosts(Component, getPosts) {
  return function (props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      setPosts(getPosts());
    }, []);

    return <Component posts={posts} {...props} />;
  };
}

export default withPosts;
```

Again, it's worth reiterating that a higher-order component is just a function like any other in JavaScript:

```javascript
function withPosts(Component, getPosts) {
  // ...
}
```

The key difference between an ordinary function and a higher-order component is that an HOC returns a React component, rather than some other result. If you're curious, the term "higher-order component" is derived from "higher-order function." A **higher-order function** is one that returns another function. This concept exists not only in JavaScript but also many other languages, especially functional ones.

Our `withPosts` higher-order component accepts two arguments in this particular case: a React component and a function that should be called to fetch posts (recent, popular, or archived) from our API. Inside the higher-order component, all we're doing is returning a **functional React component**:

```jsx
function withPosts(Component, getPosts) {
  return function (props) {
    // ...
  };
}
```

In fact, if we had wanted to, we could've used the legacy React syntax and returned a class instead, to make it perfectly clear that a higher-order component returns a React component:

{% include codeHeader.html file: "components/PostList/withPosts.js" %}
```jsx
import React, { useState, useEffect } from "react";

function withPosts(Component, getPosts) {
  // Same as before, but more verbose without hooks
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        posts: [],
      };
    }

    componentDidMount() {
      // Again, you'd most likely await this
      const posts = getPosts();
      this.setState({ posts });
    }

    render() {
      return <Component posts={posts} {...props} />;
    }
  };
}

export default withPosts;
```

In both versions of the code, the inner component accepts props (just like all React components do), initializes an empty array of posts as its state, and calls the fetch function on mount. Once the API call finishes, the component updates its state. Finally, it returns the original `Component` that we passed in, but injecting the `posts` array as an additional prop and spreading the remaining props.

Now, using this higher-order component couldn't be easier:

{% include codeHeader.html file: "components/PostList/index.js" %}
```jsx
export const RecentPosts = withPosts(PostList, getRecentPosts);
export const PopularPosts = withPosts(PostList, getPopularPosts);
export const ArchivedPosts = withPosts(PostList, getArchivedPosts);
```

Notice that we're calling the higher-order component three times here, once for each type of post. Each time, we're passing in two things:

- The component to modify (in this case, our presentational component `PostList`).
- The function that fetches posts (`getRecentPosts`, `getPopularPosts`, or `getArchivedPosts`).

Since the result of a call to a higher-order component is just another component, these exported variables can be rendered. Thus, the code from earlier should make sense:

{% include codeHeader.html file: "containers/Posts/Posts.js" %}
```jsx
import React from "react";
import {
  ArchivedPosts,
  PopularPosts,
  RecentPosts
} from "../../components/PostList";

const Posts = (props) => {
  return (
    <article>
      <section>
        <h2>Recent Posts</h2>
        <RecentPosts />
      </section>
      <section>
        <h2>Popular Posts</h2>
        <PopularPosts />
      </section>
      <section>
        <h2>Archived Posts</h2>
        <ArchivedPosts />
      </section>
    </article>
  );
};

export default Posts;
```

Additionally, if we had wanted to, we could've also passed along more props to these components:

{% include codeHeader.html file: "containers/Posts/Posts.js" %}
```jsx
import React from "react";
import {
  RecentPosts,
  ArchivedPosts,
  PopularPosts
} from "components/PostList";

const Posts = (props) => {
  return (
    <article>
      <section>
        <h2>Recent Posts</h2>
        <RecentPosts prop1="foo" prop2={42} />
      </section>
      <section>
        <h2>Popular Posts</h2>
        <PopularPosts prop1="xyz" />
      </section>
      <section>
        <h2>Archived Posts</h2>
        <ArchivedPosts />
      </section>
    </article>
  );
};

export default Posts;
```

We're able to do this because of the following two lines of code in our higher-order component:

```jsx
import React, { useState, useEffect } from "react";

function withPosts(Component, getPosts) {
  // the component accepts props
  return function (props) {
   ...

   // and spreads them here
   return <Component posts={posts} {...props} />;
  };
}
```

One last thing worth noting with this example: You may be wondering why we didn't just return a `PostList` from the higher-order component instead of accepting a generic reference to some `Component`.

In other words, why not do this:

{% include codeHeader.html file: "components/PostList/withPosts.js" %}
```jsx
import React, { useState, useEffect } from "react";
import PostList from "./PostList";

function withPosts(getPosts) {
  return function (props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      getPosts().then(setPosts);
    }, []);

    return <PostList posts={posts} {...props} />;
  };
}

export default withPosts;
```

That would certainly save us some typing here, as we'd no longer have to specify `PostList` as the first argument to each function call:

{% include codeHeader.html file: "components/PostList/index.js" %}
```jsx
export const RecentPosts = withPosts(getRecentPosts);
export const PopularPosts = withPosts(getPopularPosts);
export const ArchivedPosts = withPosts(getArchivedPosts);
```

However, this isn't a good idea in general, as you may run into a situation later on where you actually want to pass in a more customized version of `PostList`—like one that only shows the first five posts, or one that renders posts as cards instead of in a list, and so on. By accepting a generic reference to a component, our higher-order component is not only more flexible but also easier to test, as we've no longer hard-coded a dependency in the implementation. Instead, we allow the consumer to specify the component to render.

## Higher-Order Components and the Power of Composition

If you're with me so far, you may have noticed an interesting fact: Higher-order components accept a component as one of their arguments, but they also *return* a component. Naturally, this means we can pass the result of one higher-order component as an argument to another, like nested Matryoshka dolls:

{% include figure.html src: "matryoshka-dolls.png", alt: "The classic Russian Matryoshka dolls, in decreasing size, can be nested in one another.", caption: "Image source: [Wikimedia Commons user Fanghong](https://en.wikipedia.org/wiki/Matryoshka_doll#/media/File:Russian-Matroshka.jpg)" %}

Consider this toy example:

{% include codeHeader.html %}
```jsx
const Div = (props) => <div {...props} />;

function withX(Component) {
  return function(props) {
    const [x, setX] = useState("");

    useEffect(() => {
      // simulate async fetch/call
      setTimeout(() => {
        setX("x");
      }, 1000);
    }, []);

    // inject x
    return <Component x={x} {...props} />;
  }
}

function withY(Component) {
  return function(props) {
    const [y, setY] = useState("");

    useEffect(() => {
      // simulate async fetch/call
      setTimeout(() => {
        setY("y");
      }, 1000);
    }, []);

    // inject y
    return <Component y={y} {...props} />;
  }
}

export default withY(withX(Div));
```

The composition happens here:

```jsx
export default withY(withX(Div));
```

If you work your way from the inside out, you should understand why we're able to do this: `withX` returns the `Div` component with the state variable `x` injected into it. So, you can think of the export as being this:

```jsx
export default withY((props) => <Div x="x" {...props} />);
```

And `withY` is yet another higher-order component that accepts a generic component and injects the `y` prop into it. In the end, we get an exported component that has `x` and `y` injected dynamically based on the stateful logic in each HOC. So you can think of the export as really being this component:

```jsx
export default (props) => <Div x="x" y="y" {...props} />);
```

You'll see this pattern of composing higher-order components frequently in React. For example, your app may have a higher-order component that injects user login information into a component, another that injects theme variables, yet another that injects internationalization settings, and so on:

```jsx
export default withIntl(withTheme(withUserLogin(MyComponent)));
```

We'll actually look at a concrete example of one of these in the section on [using higher-order components with the Context API](#using-higher-order-components-with-the-react-context-api). But the key takeaway from this section is that you can compose higher-order components together, allowing you to customize your components by combining HOCs in various ways.

## Higher-Order Components vs. Wrapper Components

Throughout this tutorial, I described higher-order components as factories that accept a reference to a component and decorate it with certain props. How does this differ from wrapper components, which accept props and return a component? The two certainly sound similar, but consider this example:

```jsx
// Option 1: Wrapper component
const Wrapper = (props) => {
  const [state, setState] = useState("");

  // ... mounts and useEffect logic here somewhere (optional)

  return <Component prop1={state} {...props} />;
}

// Option 2: Higher-order component
const HOC = (Component) => {
  const [state, setState] = useState("");

  // ... mounts and useEffect logic here somewhere (optional)

  return function (props) {
    return <Component prop1={state} {...props} />;
  }
}
```

Notice the difference?

The higher-order component doesn't render anything—it just returns a **component definition**:

```jsx
return function (props) {
  return <Component prop1={state} {...props} />;
}
```

That component instance can be rendered later.

In contrast, the wrapper component returns the result of actually rendering the `Component`:

```jsx
return <Component prop1={state} {...props} />;
```

That's the [key distinction between higher-order components and wrapper components](https://stackoverflow.com/questions/36960675/difference-between-using-a-hoc-vs-component-wrapping#comment75670399_36970073):

> HOCs are called with **component instances**, to which the HOC can inject props before the component is rendered. Container components are called with **the result of rendering a component instance**, not the component instance itself.

Because of this, you can't compose wrapper components like you can higher-order components. The result of a wrapper component is a rendered component, not a reference to a component instance, so it's not nearly as flexible as the HOC pattern.

## Using Higher-Order Components with the React Context API

In practice, higher-order components are especially useful when combined with React's [Context API](https://reactjs.org/docs/context.html). The Context API solves the problem of [prop-drilling hell](https://kentcdodds.com/blog/prop-drilling), without introducing a state management library like Redux, immer, zustand, and the many others that are currently competing in React.

By **combining higher-order components with the Context API**, we can give any deeply nested component in our app access to a particular context's value, without having to write tedious boilerplate or drilling props.

[Here's a CodeSandbox demonstrating this](https://codesandbox.io/embed/ecstatic-wiles-0c2qv). We have an app where every component needs a `theme` variable, as well as potentially the ability to toggle that theme (e.g., for light and dark modes).

We *could* define the theme in our App as a local state variable and simply drill it down to every component in the app that needs it. But that's not maintainable at all. Another option is to use a state management library like Redux, although one could argue it's a bit overkill for this scenario, especially now that we can take advantage of React's powerful Context API.

So, let's break down how the demo code works.

We've created a theme context here:

```jsx
const ThemeContext = React.createContext("light");
```

By default, our theme starts with the value `"light"`.

Looking at our app's `render` method, we see it's creating a provider for this context and setting its value to be the app's state:

```jsx
export default class App extends React.Component {
  state = {
    theme: "light",
    setTheme: (theme) => this.setState({ theme })
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <Article />
        <Div />
        <ThemeToggle />
      </ThemeContext.Provider>
    );
  }
}
```

That state consists of:

- The current value of the theme (`"light"` initially).
- A method to update the theme.

Finally, the most relevant part of the code is the following higher-order component, `withTheme`:

```jsx
export function withTheme(Component) {
  return function (props) {
    return (
      <ThemeContext.Consumer>
        {(value) => (
          <Component theme={value.theme} setTheme={value.setTheme} {...props} />
        )}
      </ThemeContext.Consumer>
    );
  };
}
```

This higher-order component accepts a reference to any generic component and returns a new component that's wrapped in `ThemeContext.Consumer`. Effectively, the HOC consumes the theme's current `value` and injects this into the component as additional props.

This allows us to then do the following in any of our components:

```jsx
export default withTheme(MyComponent);
```

Check it out—here's the code for the `ThemeToggle` button:

{% include codeHeader.html file: "ThemeToggle/index.js", copyable: false %}
```jsx
import React from "react";
import { themeMap, withTheme } from "../App";

const ThemeToggle = (props) => (
  <button onClick={() => props.setTheme(themeMap[props.theme])}>
    Toggle theme (current: {props.theme})
  </button>
);

// This gives us access to two additional props: theme and setTheme
export default withTheme(ThemeToggle);
```

We've defined a simple functional component like any other that you're used to by now, except we inject the theme variables into this component before exporting it. This gives the button access to the theme value as well as the ability to toggle said theme. We do precisely that in the button's `onClick` handler.

Now, anytime we want a component to be aware of the current theme, all we have to do is wrap it with the higher-order component, and we're done!

As I mentioned earlier, other real-world examples of higher-order components include:

- Injecting internationalization settings into a component to regulate text formatting.
- Injecting user login info into a component to check permissions.
- ... and much, *much* more.

One thing worth noting is that when the value of the context changes, all components that consume it will re-render. But you'd get the same behavior if you were to use a state management library like Redux. When you map state to props in Redux, a state change triggers a prop change, and a prop change causes your connected components to re-render.

## Are Higher-Order Components Still Relevant?

One question that comes up often is whether higher-order components are relevant in the age of React hooks. Truth be told, higher-order components *are* an older design pattern in React, dating back to a time when class components were all that we had. With the introduction of hooks, HOCs are not nearly as relevant as they once were. Previously, they were the only way to dynamically inject stateful logic as props into components. With hooks, this is a matter of creating a custom hook, managing your stateful logic in there, returning whatever values are relevant for your purposes, and using the hook in your function component. Hooks can do everything that HOCs could, but they're arguably easier to understand and read.

Returning to our blog example, we could instead create a reusable `usePosts` hook to consolidate the fetching logic and return the list of posts and a method to optionally update those posts:

{% include codeHeader.html file: "components/PostList/usePosts.js" %}
```jsx
import React, { useState, useEffect } from "react";

export default function usePosts(getPosts) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // again, you'd use promises in the real world
    setPosts(getPosts());
  });

  return [posts, setPosts];
}
```

And here's how we might use that:

{% include codeHeader.html file: "components/PostList/index.js" %}
```jsx
import React from "react";
import usePosts from "./usePosts";
import {
  getArchivedPosts,
  getPopularPosts,
  getRecentPosts,
} from "../../containers/Posts/api";

const PostList = ({ posts }) => (
  <ol>
    {posts.map((post) => (
      <li key={post.id}>
        <a href={post.href}>{post.title}</a>
        <p>{post.description}</p>
      </li>
    ))}
  </ol>
);

export const RecentPosts = (props) => {
  const [posts] = usePosts(getRecentPosts);
  return <PostList posts={posts} {...props} />;
};

export const PopularPosts = (props) => {
  const [posts] = usePosts(getPopularPosts);
  return <PostList posts={posts} {...props} />;
};

export const ArchivedPosts = (props) => {
  const [posts] = usePosts(getArchivedPosts);
  return <PostList posts={posts} {...props} />;
};

export default PostList;
```

Naturally, hooks can also be combined with the React Context API. The hooks version of our theme example is much simpler than the one with higher-order components:

```jsx
import React, { createContext, useContext } from "react";

const ThemeContext = createContext("light");

// And that's it! Just call this hook in your component.
export const useThemeContext = () => useContext(ThemeContext);

export default class App extends React.Component {
  state = {
    theme: "light",
    setTheme: (theme) => this.setState({ theme })
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <Article />
        <Div />
        <ThemeToggle />
      </ThemeContext.Provider>
    );
  }
}
```

Here's how you'd use the hook:

```jsx
const ThemeToggle = (props) => {
  const { theme, setTheme } = useThemeContext();

  return (<button onClick={() => setTheme(themeMap[theme])}>
    Toggle theme (current: {theme})
  </button>);
};
```

One thing worth noting is that higher-order components are still relevant if your code base uses class components since they cannot utilize hooks. Sometimes, you may actually see a code base exporting both higher-order components and hooks to give developers the option of creating either class or function components.

## Conclusion

The higher-order component design pattern is pretty powerful once you get comfortable with it and realize what it's doing. In a nutshell, higher-order components are **component factories** that take a component, inject props into it, and return the modified component. As we saw, you can compose higher-order components and even combine them with React's Context API to write powerful, reusable code.

## Attributions

The copyright for the React logo used in this blog post's thumbnail [belongs to Facebook](https://commons.wikimedia.org/wiki/File:React-icon.svg).

The image of the factory was taken by [Patrick Hendry](https://unsplash.com/photos/6xeDIZgoPaw) on Unsplash.
