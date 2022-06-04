---
title: A typeof Typo
description: When a pair of quotes makes a world of difference.
keywords: [typeof]
categories: [javascript, typescript, eslint]
---

Do you spot anything wrong with the following JavaScript?

```js
let variable;
const isUndefined = typeof variable === undefined;
console.log(isUndefined);
```

Even TypeScript doesn't flag this code, so the logic pans out and the code logs `true`, right?

Nope! There's a sneaky typo on the second line of code here:

```js
const isUndefined = typeof variable === undefined;
```

This condition will always evaluate to `false`.

## It's `'undefined'`, not `undefined`

The `typeof` unary operator returns a string describing the type of its operand, like `'number'`, `'string'`, '`boolean'`, and so on. But here, we're checking if the type is `undefined`, which is never the case because *everything* in JavaScript has a well-defined type. What we *really* wanted to do is to check if the type is the string literal `'undefined'`:

```js
const isUndefined = typeof variable === 'undefined';
```

The original code logs `false` because the `typeof` operator always returns a value no matter what operand you give it. However, the result may be the *string* `'undefined'` if the operand itself is undefined. There are two scenarios where this may occur—either the operand was declared but never assigned a value, or the operand was never declared in the first place:

```js
let var1;
console.log(typeof var1 === 'undefined'); // true
console.log(typeof var2 === 'undefined'); // true
```

## Preventing the Typo with ESLint

This problem can be very tricky to spot—unless someone intentionally draws your attention to it, you may miss it during code review (unless you have a very good eye for detail). You may think this isn't so bad because at least it doesn't throw a runtime error, but that actually makes it worse. You *want* logical errors to crash your app rather than slipping past you silently.

This is technically one of those things that TypeScript *should* flag since it can be statically analyzed and should always be considered a bug. Unfortunately, as of this writing, TypeScript 4.7.2 doesn't treat this sort of expression as an error.

Thankfully, if you're linting your code with ESLint, there's a built-in rule that can flag this issue for you: [`valid-typeof`](https://eslint.org/docs/rules/valid-typeof). Specifically, you'll want to enable the `requireStringLiterals` option:

```json
"eslint valid-typeof": ["error", { "requireStringLiterals": true }]
```

With this rule enabled, the following expression will now throw an ESLint error:

```js
typeof variable === undefined;
```
