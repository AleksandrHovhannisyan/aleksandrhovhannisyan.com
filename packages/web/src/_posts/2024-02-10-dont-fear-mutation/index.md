---
title: (Don't Fear) Mutation
description: The irrational fear of mutation in programming can sometimes do more harm than good.
categories: [essay, webperf, javascript]
keywords: [mutation, javascript]
layout: mathPost
---

A colleague recently shared a GitHub issue from the Airbnb repository titled "[no-param-reassign with props, again](https://github.com/airbnb/javascript/issues/719)." In this thread, the author notes that the Airbnb eslint rule [`no-param-reassign`](https://eslint.org/docs/latest/rules/no-param-reassign) reports errors when writing JavaScript like the following:

```js
['foo', 'bar', 'qux', 'foo'].reduce((accumulator, value) => {
  accumulator[value] = true;
  return accumulator;
}, {});
```

The linter flags line two as an error since that code mutates a function parameter (in this case, the `accumulator` object). Why is that undesirable? One of the contributors defended this decision in the thread:

> This is a rule we use at Airbnb - in the reducer case, if the body of your reducer is return `Object.assign({}, accumulator, { [key]: value })` then you'll avoid mutation as well as satisfy the linter (both in spirit and in fact).
>
> Mutation should be avoided in all its forms, and our style guide tries to be consistent with this belief.

When viewed through this religious lens, mutation is a cardinal sin—a malignant tumor that must be excised from all code that we write.

But oftentimes, reality is more nuanced than dogmas.

## Pure Mutation

In the context of programming, a function or piece of code is considered <dfn>pure</dfn> if it's idempotent: That is, if calling the function with the same input multiple times yields the same output every time, without side effects. Writing pure code is generally a good practice because it makes your program behave predictably. By contrast, if a function behaves erratically when given the same inputs, then it's likely to be unreliable in production and a nightmare to test.

The example code from that GitHub thread is technically pure when represented as a function—there are no side effects that propagate to the outer scope, and the function always returns the same output when given the same input.

```js
// There is no harmful mutation here
const getAccumulatedObject = (array) => {
  array.reduce((accumulator, value) => {
    accumulator[value] = true;
    return accumulator;
  }, {});
};
```

While it's true that `accumulator[value] = true` mutates the accumulator object, that object is local to the scope of the function—it was created on the fly for the very purpose of constructing an object from an array. In fact, `accumulator` is scoped very narrowly to the callback for `Array.prototype.reduce`. Moreover, we're not mutating the array or its elements, nor are we mutating an object in the outer scope (and, thanks to variable shadowing, this still wouldn't be an issue even if there were a global named `accumulator`). Thus, this function is pure.

To their credit, the user who railed against mutation also acknowledged this fact:

> I totally agree that this can be annoying particularly in non-pure reducer functions (even though the overall reduce operation is pure). It's also a good point that an eslint rule will have a very hard time covering the nuances.

To make this function pass the linter rule, we would simply need to construct a new object on every iteration of the reducer rather than mutating the accumulator directly. We can do this either with `Object.assign` (as the response suggested) or the spread operator:

```js
// Object.assign
array.reduce((accumulator, value) => {
  return Object.assign({}, accumulator, { [value]: true });
}, {});

// Spread
array.reduce((accumulator, value) => {
  return { ...accumulator, { [value]: true });
}, {});
```

Still, this example doesn't illustrate *why* mutation is dangerous—because in this case, it isn't. However, there are situations where mutation *can* cause all sorts of problems in your code.

### Accidental Mutation

If you accidentally modify the wrong object—especially an object in the outer scope of a function—then your tests may begin to fail in unexpected ways. You'll then waste hours trying to track down the source of the problem.

Mutation can be particularly insidious when copying nested objects without recursively cloning the nested references (known as <dfn>deep cloning</dfn>). If you mutate one of the nested objects in a shallowly cloned object, you'd accidentally mutate the original copied object because the two references would point to the same memory address.

Consider this exaggerated toy example where we try to copy a two-dimensional array, change one of the cell values, and return the modified matrix:

```js
const DEFAULT_GRID = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const makeGrid = (row, column, initialValue) => {
  const grid = [...DEFAULT_GRID];
  grid[row][column] = initialValue;
  return grid;
}
```

Why would we ever do this? Well, we wouldn't—at least I hope *you* wouldn't. But this simplified example has many real-world analogues, such as when spreading a base config object into a final config object and then mutating one of the values—maybe based on environment variables or some runtime condition. You'd be surprised how often this actually comes up in practice unless you avoid mutation at all costs.

```js
const BASE_CONFIG = {
  key1: [...],
  key2: [...],
};

// Here there be dragons 🐲
const makeConfig = (params) => {
  const config = { ...BASE_CONFIG };
  if (params.shouldMutateKey1) {
    config.key1.push('mutated');
  }
  return config;
};
```

Anyway, at first glance, `makeGrid` appears to be harmless, and our first test passes:

```js
const grid1 = makeGrid(0, 0, 1);
// Passes ✅
expect(grid1).toStrictEqual([
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]);
```

But what happens if we call the function again, in an entirely different test?

```js
const grid2 = makeGrid(1, 1, 1);
// Fails ❌
expect(grid2).toStrictEqual([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
]);
```

The test fails!

What went wrong? If we log `grid2`, we'll see this array:

```js
[
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
]
```

Hmm... The array has changes from both the first and second calls to `makeGrid`!

The reason why this happens may not be clear if you're not used to thinking about pointers and memory. It's true that we're creating a new array in memory here and then referencing it with the `grid` identifier:

```js
const grid = [...DEFAULT_GRID];
```

However, because the spread operator merely copies the keys (indices) of `DEFAULT_GRID` into the target object, the indices of `grid` end up still pointing to the same nested arrays in memory as the keys of `DEFAULT_GRID`. So `grid[row][column] = initialValue` accesses the shared array pointed to by `DEFAULT_GRID[row][column]`. Therefore, when we call `makeGrid` a second time, the mutation from the first call persists in memory, creating a confusing and unpredictable mess.

Note that this was an intentionally contrived example. In reality, you'd want to write a pure function like this that always creates a new two-dimensional array, with zero side effects:

```js
const makeGrid = (numRows, numColumns, initialValue = 0) => {
  return Array.from({ length: numRows }, () => {
    return Array.from({ length: numColumns }, () => initialValue);
  });
}

// Passes ✅
expect(makeGrid(3, 3)).toStrictEqual([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]);
```

{% aside %}
And if you really need to copy an object, remember to deep clone it to avoid accidentally creating shared pointers to objects in memory. You can do this with the [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) web API or with a battle-tested library like [lodash](https://www.npmjs.com/package/lodash.clonedeep).
{% endaside %}

The point of this example was to illustrate just how problematic mutation can be when it sneaks into your code and becomes a widely tolerated practice. It's likely this is why so many teams prophlactically enable the aforementioned Eslint rule, fearing the harm that accidental mutation could cause. Better to be safe than sorry.

On the other hand, that rule wouldn't have protected against this edge case anyway because we weren't modifying a function parameter—we accidentally copied a pointer to a shared object in memory and then mutated it.

But other times, avoiding mutation can do more harm than good.

## The Performance Cost of Avoiding Mutation

Let's revisit the original example:

```js
const getAccumulatedObject = (array) => {
  array.reduce((accumulator, value) => {
    accumulator[value] = true;
    return accumulator;
  }, {});
};
```

Obeying our linter, we refactor it to use the spread operator (or, equivalently, `Object.assign`) to create a new object on every iteration:

```js
const getAccumulatedObject = (array) => {
  array.reduce((accumulator, value) => {
    return { ...accumulator, [value]: true };
  }, {});
};
```

Functionally, the two algorithms are identical. However, their *runtime performance* isn't.

### Big-O Analysis: Mutation vs. Spreading

The original code has a [worst-case runtime complexity](https://en.wikipedia.org/wiki/Big_O_notation) of $O(n)$ (*"Big-oh of n"*), where $n$ is the length of the input array. By definition, this means that as the length of the input array increases to infinity, our function will perform no worse than some generic function that traverses $n$ elements; it will always have this strict upper bound on its performance. In other words, the algorithm scales linearly with the input size.

{% aside %}
Note that Big-O is a measure of the function's worst-case complexity and doesn't reflect the best or average cases; nevertheless, it's a useful heuristic for gauging just how bad things can get when stress-testing our code. Moreover, Big-O analysis is not necessarily representative of real-world input sizes—rarely do you work with JavaScript arrays that have millions or billions of elements.
{% endaside %}

What about the refactored version? It only has a single outer loop, so it's tempting to conclude that it also has a worst-case performance of $O(n)$. But you may be surprised to learn that it's actually $O(n^2)$—almost as if we had an inner loop with another $n$ iterations. But why? And how can we prove it?

#### Spread, Iterators, and Nested Loops

{% aside %}
**Note**: I'll focus on the spread operator, but the same reasoning applies to `Object.assign`.
{% endaside %}

The key to understanding why is that the spread operator invokes an object's iterator, looping over all of the object's elements and terminating when it reaches the last one. So we essentially have a hidden inner loop that's obscured by our language's syntax sugar. If we rewrite the code to instead use `Array.prototype.forEach`, this should become clearer:

```js
array.reduce((accumulator, element) => {
  const newObject = {};
  Object.entries(accumulator).forEach(([key, value]) => {
    newObject[key] = value;
  });
  newObject[element] = true;
  return newObject;
}, {});
```

This is analogous to the spread example, although the two pieces of code work differently under the hood.

Unfortunately, while it's true that we have nested loops, that fact *alone* isn't enough to prove that the algorithm performs on the order of $n \times n = O(n^2)$. We need a more rigorous proof. For example, the following code has a runtime complexity of $O(4n) = O(n)$ despite having nested loops:

```js
const loop = (array) => {
  for (let i = 0; i < 4; i++) {
    array.forEach((element) => {
      console.log(element);
    });
  }
};
```

Here, the outer loop never scales with the size of the array input: It always iterates four times. By contrast, the inner loop does scale with the size of the input. So the $n$ in $4n$ eventually dwarfs the contribution of $4$, and thus we drop the constant from the final term. (This is a simplified explanation of limits and Big-O notation, but hopefully you get the idea.)

In our example, things are different. The outer loop iterates $n$ times over the original array, but the inner loop's number of iterations changes over time as the `accumulator` object grows in size. However, importantly, the inner loop **is still a function of n**. As an exercise, let's manually count the number of iterations of the inner loop:

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col" class="numeric">Outer loop iteration #</th>
        <th scope="col" class="numeric">Number of inner loop iterations</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric">1</td>
        <td class="numeric">0</td>
      </tr>
      <tr>
        <td class="numeric">2</td>
        <td class="numeric">1</td>
      </tr>
      <tr>
        <td class="numeric">3</td>
        <td class="numeric">2</td>
      </tr>
      <tr>
        <td class="numeric">...</td>
        <td class="numeric">...</td>
      </tr>
      <tr>
        <td class="numeric">n</td>
        <td class="numeric">n-1</td>
      </tr>
    </tbody>
  </table>
</div>

The inner loop runs the same number of times as the number of keys in the `accumulator` object. Initially, it runs zero times because `accumulator` is empty; the number of iterations is always off by one. So what is the total number of iterations in this algorithm? Well, that's just the sum of all of the numbers in the second column:

$$
1 + 2 + 3 + ... + (n-1)
$$

A sum of a continuous sequence of integers has a special name: a Gaussian Sum. It's named after the German mathematician Carl Friedrich Gauss who discovered the formula for this pattern:

$$
1 + 2 + 3 + ... + (n-1) + n = \sum_{k=1}^{n} k = \frac{n^2+n}{2}
$$

In our case, we're missing the $n$ term:

$$
1 + 2 + 3 ... + (n-1)
$$

If you compare these two expressions, you'll notice that our sum is the same as subtracting $n$ from the right-hand side of the Gaussian Sum:

$$
1 + 2 + 3 + ... + (n-1) = \frac{n^2+n}{2} - n
$$

Simplifying, we get:

$$
\frac{n^2+n}{2} - n = \frac{n^2 - n}{2}
$$

Like with the $4n$ example before, we can ignore the constant $\frac{1}{2}$ as it contributes nothing to the overall trend of the function. Then, we can also drop the $-n$ term, as it too is dwarfed by the leading $n^2$ term as $n$ goes to infinity. So the Big-O complexity here is $n^2$.

In summary, the refactored version that uses the spread operator (or, equivalently, `Object.assign`) is slower than the original example. We tried to avoid mutation in a scenario where the mutation was harmless, and in the process we made our algorithm slower than it needed to be.

## A Cautionary Tale

There are always tradeoffs in programming. We saw one example of how mutation can wreak havoc in your code by unintentionally modifying variables. But we also saw how unwavering dogmatism can force us to write unoptimized code that could've been just as readable and pure but faster. (Whether this creates a noticeable slowdown for your end users is another matter.)

In the end, it's also important to remember that performance testing doesn't stop with Big-O analysis, and premature optimization could very well be a sunken cost if the algorithm you are optimizing isn't fed increasingly larger inputs. In the context of JavaScript and web performance specifically, there are other factors that can make your apps slower. For example:

- Forgetting to lazily load expensive assets.
- Synchronous, render-blocking code instead of async scripting.
- A lax caching policy, resulting in network overhead and delayed responses.
- ... and more.

As a compromise, the user in the GitHub thread suggests disabling linter rules like this on a case-by-case basis using the special `// eslint-disable-next-line` directive. Indeed, it's good to recognize when rules can be safely broken, rather than following them blindly. Sometimes, mutation is a necessary evil.
