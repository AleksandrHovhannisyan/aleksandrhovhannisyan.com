---
title: Dynamic Tag Name Props in React (with TypeScript)
description: Sometimes, a React component needs to allow users to render a custom tag. Here's how you can pass dynamic tag names as props.
keywords: [dynamic tag name props]
categories: [dev, react, typescript]
comments_id: 62
---

In React, you'll sometimes want to allow users to pass in a dynamic tag name as a prop to a component. While this is a somewhat rare pattern, you may still come across it in the wild. For example, you may have seen it if you've ever worked with the [`react-intl` library for internationalized strings](https://formatjs.io/docs/react-intl/components/#formattedmessage), where the `<FormattedMessage>` component accepts an optional `tagName` prop:

```tsx
<FormattedMessage id="common.close" tagName="p" />
```

To keep this demo simple, let's say we want to create a reusable `CenteredContainer` component to encapsulate some CSS or other logic (I won't show any of that here):

{% include codeHeader.html file: "components/CenteredContainer/index.tsx" %}
```tsx
import React, { FC } from 'react';

interface CenteredContainerProps {
  className?: string;
}

const CenteredContainer: FC<CenteredContainerProps> = (props) => <div {...props} />;
```

You *could* always render a `<div>` like we're doing here, but that's not a great idea. It pollutes your DOM with an extra decorative `<div>`, making it difficult to write [semantic HTML markup](/blog/semantic-html-accessibility/). Plus, there's no reason why a centered container should *always* be a `<div>`. This may even be invalid HTML depending on where you intend to use the container.

Fortunately, we can take advantage of TypeScript's intellisense and pass a dynamic tag name as a prop to change the rendered tag:

{% include codeHeader.html file: "components/CenteredContainer/index.tsx" %}
```tsx
import React, { FC } from 'react';

interface CenteredContainerProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
}

const CenteredContainer: FC<CenteredContainerProps> = ({ tagName, ...otherProps }) => {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return <Tag {...otherProps} />;
};

CenteredContainer.defaultProps = {
  tagName: 'div',
};

export default CenteredContainer;
```

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

```text
"JSX element type 'Tag' does not have any construct or call signatures"
```

Additionally, notice that our `CenteredContainer` component renders a `<div>` by default:

```tsx
CenteredContainer.defaultProps = {
  tagName: 'div',
};
```

But you can override this by passing in a custom `tagName`:

{% include codeHeader.html file: "components/Navbar/index.tsx" %}
```tsx
import CenteredContainer from 'components/CenteredContainer';
import React, { FC } from 'react';

const MyComponent: FC = ({ children }) => {
  return <CenteredContainer tagName="nav">{children}</CenteredContainer>
};
```

Since we've specified that `tagName` is `keyof JSX.IntrinsicElements`, we'll get auto-complete intellisense whenever we try to set this prop:

{% include img.html src: "example.png", alt: "An example of using the CenteredContainer component and passing in a concrete tagName. VS Code's intellisense shows an auto-complete dropdown for you as you type." %}

In some cases, you may want to instead use [render props](https://reactjs.org/docs/render-props.html), but they're not always needed—sometimes, all you really want is to be able to specify a tag name as a string. You typically only need to use render props if the element being rendered depends on some state. Here, we're just telling the component what to render by passing in a plain string. The syntax is shorter and easier to read.

And that's all there is to it! I hope you found this mini-tutorial helpful.

{% include unsplashAttribution.md name: "Paolo Chiabrando", username: "chiabra", image_id: "do7VUvKBOsg" %}
