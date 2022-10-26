---
title: Overzealous Destructuring
description: Destructuring in JavaScript has many clever uses that can make your code more expressive and compact. But overusing it can make your code harder to read, trickier to debug, and more error prone.
keywords: [javascript, destructuring]
categories: [javascript, typescript, react, practices]
lastUpdated: 2022-04-17
thumbnail:
  url: https://images.unsplash.com/photo-1615678857339-4e7e51ce22db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

Back when I first learned about destructuring in ES6 JavaScript—and its close siblings, the rest and spread syntax—I did what many other developers do when they learn a new trick: I used it everywhere, trying to cram this newfound square peg into every round hole I stumbled upon. Somehow, I had come to equate destructuring with clean code, and anything that required more typing was unequivocally worse and had to be refactored to destructure All The Things. This was the way:

```jsx
const function = ({
  prop: {
    nestedProperty: {
      wow: { this: isKindaHardToRead },
    },
  },
}) => {};
```

Nowadays, I'm not quite so fond of destructuring. It certainly has its uses, but it can also cause problems if not used carefully. I've found that destructuring is most effective when the unpacked variables are in close proximity to their usage or when the alternative is harder to read. In the next few sections, we'll explore some of the problems with what I'll call _overzealous destructuring_.

{% include "toc.md" %}

## Destructuring Makes It Harder to Identify a Variable's Scope

Programming languages like C++ have a construct known as a **namespace**—a region of code that encapsulates identifiers, preventing them from leaking into the global scope. You can access a namespace's identifiers with the reserved namespace operator, like this: `Namespace1::variable`. Namespacing is really important in big projects because it helps you identify where a particular symbol is coming from. But more importantly, it helps you avoid naming clashes in case two different namespaces happen to use the same name for their variables: `Namespace1::variable` versus `Namespace2::variable`.

In C++, there's also a bad programming practice that is basically analogous to destructuring arguments in JavaScript functions: declaring which namespaces you intend to use at the very top of your file. You'd declare `using namespace Namespace1`, and this would save you quite a bit of typing because you would no longer have to prefix all your variable usages with their corresponding namespace. Instead, you could use them directly, as if they were declared outside the namespace.

{% aside %}
In JavaScript, the closer analog of this is importing an entire module vs. importing named exports. But hopefully you get the idea.
{% endaside %}

Similarly, destructuring can be very tempting in JavaScript because it helps you save some typing, and anything that makes our lives easier must be good. When you destructure arguments in JavaScript, you don't have to repeat yourself like you do here:

```jsx
const function = (props) => {
  // some usage of props.arg1, props.arg2, props.arg3
};
```

Instead, you can can do this:

```jsx
const function = ({ arg1, arg2, arg3 }) => {
  // some usage of arg1, arg2, arg3
};
```

We've all heard that DRY code is good, but this is entirely dependent on context. Sometimes, those few extra keystrokes are worth it, and repeating yourself isn't so bad after all.

The first problem with destructuring is that it strips object properties of their namespace, making it harder to tell, at a glance, where a particular variable is coming from. Was it declared globally in the module? Imported from another module? Passed in as a function argument? Declared as a local variable in the function's scope?

Compare this:

```js
import { a, b } from 'module';

const g = 'global variable';

const function = ({ c, d, e }) => {
  const l = 'local-variable';
  console.log(c, d, e);
};
```

To this:

```js
import { a, b } from 'module';

const g = 'global variable';

const function = (args) => {
  const l = 'local-variable';
  console.log(args.c, args.d, args.e);
};
```

{% aside %}
In practice, you will rarely use single-letter names for your variables. To make this example code easier to follow, I could've renamed the variables to `importA`, `importB`, `globalVariable`, etc. But rarely do you actually see imports prefixed with "import" or global variables prefixed with "global." The point is that while this code is illustrative, it's not necessarily _unrealistic_.
{% endaside %}

Especially in large functions and modules, this sort of namespacing can make your code much easier to follow. You may not think this is a big deal if you're the one writing the code, but you have to remember that other developers may one day have to read your code, too. Don't use clever tricks that sacrifice readability for speed.

### Destructuring May Introduce Naming Clashes

I mentioned that namespaces can help you avoid **naming clashes** in other programming languages, and the same actually goes for function arguments in JavaScript. When you destructure function arguments, you make it harder to reuse the same variable names for final and intermediate values elsewhere in the function.

For example, if you're creating a React component, you might want to derive some state from props. This pattern is common in modals, where users are allowed to discard their changes but the initial state needs to be populated from some persisted data that comes in via props:

```jsx
const Modal = (props) => {
  const [value, setValue] = useState(props.value);
};
```

If we destructure the prop, we'll need to rename either that prop or the state variable (or both) to avoid naming clashes:

```jsx
// Option 1: rename the prop in the interface
const Modal = ({ initialValue }) => {
  const [value, setvalue] = useState(initialValue);
};

// Option 2: alias the prop when destructuring
const Modal = ({ value: initialValue }) => {
  const [value, setvalue] = useState(initialValue);
};

// Option 3: rename the state variable
const Modal = ({ value }) => {
  const [tempValue, setTempValue] = useState(value);
};

// Option 4: rename both
const Modal = ({ initialValue }) => {
  const [tempValue, setTempValue] = useState(props.initialValue);
};
```

Admittedly, this particular example isn't so bad. But there are other situations where these sorts of compromises can hurt the readability of your code, forcing you to rename multiple variables until you no longer recognize what values are coming from which sources, or until the variable names are unnecessarily verbose compared to when they were namespaced. `varProp` is no more readable than `props.var`.

## Destructuring Deeply Nested Properties Harms Readability

Just because you can do something doesn't mean that you should. In JavaScript, you can destructure not only the direct properties of an object but also any deeply nested properties, like this:

```jsx
const Component = ({
  a: {
    deeply: {
      nested: { variable },
    },
  },
}) => {
  console.log(variable);
};
```

This saves you a few keystrokes at the expense of making your function signature much more noisy and difficult to parse. Compare that to the following code, which, despite requiring more effort to type out per usage, is easier to read:

```jsx
const Component = (props) => {
  console.log(props.a.deeply.nested.variable);
};
```

## Destructuring Potentially Nullish Values Is Dangerous

We saw in the previous section that destructuring deeply nested properties makes your code harder to read. But that's not the only problem. A more insidious problem is that destructuring nullish or undefined objects is dangerous and will throw an uncaught runtime error:

```
Uncaught TypeError: Cannot read properties of null
```

This can become a rather nasty source of bugs in your code base if you're not careful, especially if you're frequently destructuring object properties.

One of the nice things about accessing object properties the old-fashioned way is that we can use the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) to safeguard against potentially [nullish values](https://developer.mozilla.org/en-US/docs/Glossary/Nullish) while preserving the readability of our code:

```js
const value = object?.with?.nested?.properties;
```

In the above expression, `value` will evaluate to the value of `properties` if the object and all of its intermediate properties are non-nullish. But if the object or any of its properties is nullish, the entire expression will return `undefined` without throwing any errors. This allows us to safely access deeply nested object properties without checking each property individually. The above code is equivalent to doing this:

```js
const value =
  object && object.with && object.with.nested
    ? object.with.nested.properties
    : undefined;
```

On the other hand, if we destructure those properties, we run into several problems. First, we have no (good) way of safeguarding against nullish values other than using the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) (`??`):

```js
const fallback = { with: { nested: {} } };
const object = undefined;
const {
  with: {
    nested: { properties },
  },
} = object ?? fallback;
```

This says: Attempt to destructure the deeply nested `properties` property from the object. If the object is nullish, fall back to an object containing all properties except the one that we want. This means that `properties` is the value if it exists or `undefined` (because the fallback `nested` object has no properties, so `fallback.with.nested.properties` is `undefined`).

Except... what if the object *is* defined but one of its intermediate properties isn't?

```js
const fallback = { with: { nested: {} } };
const object = {};
const {
  with: {
    nested: { properties },
  },
} = object ?? fallback;
```

Because `object.with` is `undefined`, attempting to access `object.with.nested` will throw the same type error:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'nested')
```

The version with destructuring is *significantly* more complex and error prone than the original, and it sacrifices the readability of our code for absolutely no gain. It's riddled with traps that can catch you off guard if you're not careful, and its syntax is far more verbose than it needs to be.

The code is also not the same as the original! In the original example, we named the final variable `value`. If we want to rename the deeply nested property while destructuring it, we'll need to do so during assignment. This only exacerbates the readability problem:

```js
const fallback = { with: { nested: {} } };
const {
  with: {
    nested: { properties: value },
  },
} = object ?? fallback;
```

After all of this, you might think that TypeScript would help you avoid this problem entirely by warning you whenever you drill deep into a chain of potentially nullish properties. And it will. But it's important to remember that TypeScript does not provide any assurances about a variable's _runtime_ type, especially if the data is coming from an external source (like an API). In those cases, you often need to use type assertions or guards anyway to assert the returned type because TypeScript can't infer the type of dynamically fetched data. So destructuring the data is more dangerous than defensive coding (like using the optional chaining operator or good-old `if` statements).

## Destructuring Makes It Harder to Debug Object Arguments

Occasionally, when debugging functions, I find it helpful to stick a `debugger` statement on the first line or log out the arguments manually to verify that the function is receiving the correct data:

```jsx
const function = (props) => {
  console.log(props);
}
```

But when you destructure function arguments in the signature, you make it impossible to see the whole object unless you log each piece exhaustively.

```jsx
const function = ({ arg1, arg2, arg3, ...others }) => {
  console.log(arg1, arg2, arg3, others);
}
```

If you're going to do this, at least destructure the arguments in the body of the function:

```jsx
const function = (props) => {
  // You can log all of the props at once
  console.log(`props`, props);

  // While still using the destructured values as desired
  const { arg1, arg2, arg3, ...others } = props;
}
```

That way, you still see the full context but can destructure the arguments if the component is small enough.

However, keep in mind all the other problems mentioned so far about destructuring. In my experience, the amount of typing saved from destructuring is not worth the cost.

## Destructuring Makes it Harder to Rename Symbols in TypeScript

In TypeScript projects, if you rename a prop that's being destructured somewhere in your code, VS Code won't rename the destructured variable; instead, it will use the old name as an alias. [This was a known issue for a long time](https://github.com/microsoft/TypeScript/issues/29238) until VS Code eventually introduced some editor-level settings to get around it.

Suppose you had this code originally:

```tsx
type Props = {
  oldName?: string;
};

const function = ({ oldName }: Props) => {};
```

If you now decide to rename `oldName`, VS Code will alias `newName` to `oldName`:

```tsx
type Props = {
  newName?: string;
}

const function = ({ newName: oldName }: Props) => {};
```

You don't run into this issue with properly namespaced props because there's no aliasing to be done:

```tsx
type Props = {
  newName?: string;
};

const function = (props: Props) => {
  console.log(props.newName);
};
```

Again, there's a known workaround for this issue, but it's still something to keep in mind.

## When It's Okay to Destructure

Developers are sometimes overzealous in adopting new features and syntaxes, and this can cause problems if we're not careful. On the flip side, developers also tend to be passionate about avoiding bad practices (like misusing divs in HTML)—to the point that we sometimes avoid using a certain syntax or language feature entirely out of fear of misusing it, even if it's not inherently bad all the time.

While this article looked at some of the pitfalls of overusing destructuring in JavaScript—particularly in function signatures—this doesn't necessarily mean that destructuring is bad and should be avoided. There are certainly legitimate use cases for it; these are briefly covered in the following sections.

### 1. Named Imports in CommonJS

If you've worked with CommonJS modules, you're probably familiar with this old syntax for importing a named export from a module:

```js
// Module 1
module.exports = {
  a: 1,
  b: 2,
};

// Module 2
const { a, b } = require('module-1');
```

This uses object destructuring to extract the properties from the exported module's `exports` object (which is what `require` returns). There's absolutely nothing wrong with doing this, assuming you don't also try to import something from a different module that uses the same name (in which case you'll need to alias one or more imports).

### 2. Arrays

Destructuring arrays can be useful, especially if the alternative is more verbose.

For example, we can use destructuring and rest syntax to isolate the first element of an array while collecting the remaining elements in a separate array:

```js
// first is 3, and rest is [2, 1]
const [first, ...rest] = [3, 2, 1];
```

We can also use a clever trick with array destructuring to swap two values:

```js
let a = 1;
let b = 2;
[b, a] = [a, b];
```

If you've worked with React hooks, you should also be familiar with array destructuring when using built-in hooks such as `useState`:

```jsx
const Component = () => {
  const [state, setState] = useState();
};
```

This is more expressive and readable than doing this:

```jsx
const Component = () => {
  const stateDescriptor = useState();
  const state = stateDescriptor[0];
  const setState = stateDescriptor[1];
};
```

### 3. Small Functions

Destructuring all of your function arguments isn't a great idea, especially if the function has some combination of arguments and locally or globally declared variables. But if the function is compact, accepts a handful of arguments, and returns some result, there's no harm in destructuring those arguments. As mentioned earlier, if you do this, you should at least keep the original object around so it's easier to debug:

```js
const function = (args) => {
  const { arg1, arg2, ...otherArgs } = args;
  return someResult;
}
```

## Everything in Moderation

Destructuring is like salt: Use it judiciously, and it can bring out the flavor in a dish. But overuse it, and you may ruin your meal. Like many practices in programming, destructuring isn't inherently evil—it certainly has many clever uses that can make our code easier to follow. But as we saw, _overdoing_ it can make our code harder to read and debug.

{% include "unsplashAttribution.md" name: "Jiawei Zhao", username: "jiaweizhao", photoId: "W-ypTC6R7_k" %}
