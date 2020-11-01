---
title: Dynamic Tag Name Props in React (with TypeScript)
description: Sometimes, a React component needs to allow users to render a custom tag. Here's how you can pass dynamic tag names as props.
keywords: [dynamic tag name props]
tags: [dev, react, typescript]
comments_id: 62
---

In React, you'll sometimes need to allow users to pass along a dynamic tag name as a prop to a component, changing the rendered tag in the output HTML. Admittedly, this is a somewhat rare pattern in React. But it does exist in the wild. For example, you may have seen it if you've ever worked with the [`react-intl` library for internationalization](https://formatjs.io/docs/react-intl/components/#formattedmessage), where `<FormattedMessage>` can optionally render strings in the specified tag:

```tsx
<FormattedMessage id="common.close" tagName="p" />
```

For the purposes of this demo, let's say you want to create a reusable `CenteredContainer` wrapper component to center content on your page:

{% capture code %}const CenteredContainer: FC = (props) => {
  const { className, children } = props;
  return <div className={classnames('centered', className)}>{children}</div>;
}{% endcapture %}
{% include code.html file="components/CenteredContainer/index.tsx" code=code lang="tsx" %}

You *could* always render a `<div>` like we're doing here, but that's not a great idea. Not only does it pollute your DOM with an extra decorative `<div>`, but it also makes it more difficult for you to write [semantic HTML markup](/blog/dev/semantic-html-accessibility/) that's accessible and easy to parse at a glance. Plus, there's no reason why a centered container should *always* be a `<div>`.

One potential solution is to just create a reusable, globally scoped `.centered` class name and style it accordingly. Instead of using a component, simply slap that class name on any component that needs it. This certainly works, but it also has its downsides. Namely, if you're working with Next.js or any React project that enforces CSS modules or scoped styling, this is somewhat of an anti-pattern since you're introducing global styling that may or may not conflict with class names elsewhere in the DOM.

A better solution is to take advantage of TypeScript's intellisense and pass a dynamic tag name as a prop to change the rendered tag:

{% capture code %}import { FC } from 'react';
import classnames from 'classnames';

export interface CenteredContainerProps
  extends React.HTMLAttributes<HTMLOrSVGElement> {
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
}

const CenteredContainer: FC<CenteredContainerProps> = (props) => {
  const { className, children, tagName } = props;
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return (
    <Tag className={classnames('centered', className)}>
      {children}
    </Tag>
  );
};

CenteredContainer.defaultProps = {
  tagName: 'div',
};

export default CenteredContainer;{% endcapture %}
{% include code.html file="components/CenteredContainer/index.tsx" code=code lang="tsx" %}

> **Note**: If you're not using the [`classnames` package](https://www.npmjs.com/package/classnames), I highly recommend that you install it. It's a nice little utility that generates class strings and takes care of undefined/nullish values for you.

There are two things worth noting here.

First, [React expects element types to start with a capital letter](https://reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized). Lowercase element names are reserved for built-in tags like `<div>`, for example. But we want to follow the convention of using lowercase names for props. To get around this, we create a new, uppercase variable `Tag` that gets a copy of `tagName`:

```typescript
const Tag = tagName as keyof JSX.IntrinsicElements;
```

Second, you may be wondering why we're using a type assertion here (as well as in the interface):

```tsx
as keyof JSX.IntrinsicElements
```

That addresses the following error, letting TypeScript know that our `Tag` variable does in fact resolve to one of the built-in (intrinsic) callable element types, like `<div>`, `<button>`, and so on:

```
"JSX element type 'Tag' does not have any construct or call signatures"
```

Additionally, notice that our `CenteredContainer` component renders a `<div>` by default:

```tsx
CenteredContainer.defaultProps = {
  tagName: 'div',
};
```

But you can override this by passing in a custom `tagName`:

{% capture code %}import CenteredContainer from '@components/CenteredContainer';
import { FC } from 'react';

const MyComponent: FC = (props) => {
  return (<CenteredContainer tagName="nav">
    {props.children}
  </CenteredContainer>);
}{% endcapture %}
{% include code.html file="components/Navbar/index.tsx" code=code lang="tsx" %}

Since we've specified that `tagName` is `keyof JSX.IntrinsicElements`, we'll get auto-complete intellisense whenever we try to set this prop:

{% include picture.html img="example.png" alt="An example of using the CenteredContainer component and passing in a concrete tagName. VS Code's intellisense shows an auto-complete dropdown for you as you type." %}

Note that [render props](https://reactjs.org/docs/render-props.html) are yet another alternative pattern, but they're not always needed. You typically only need to use render props if the element being rendered depends on some state. Here, we're just telling the component what to render by passing in a plain string. The syntax is shorter and easier to read.

That said, you may want to use render props if you want to pass any other dynamic props to your component, aside from a class and some children. Otherwise, you'll need to spread those remaining props in your component and extend the appropriate interfaces.

That's it! I hope you found this helpful.

## Attributions

Thumbnail photo by [Paolo Chiabrando](https://unsplash.com/@chiabra) via [Unsplash](https://unsplash.com/photos/do7VUvKBOsg).
