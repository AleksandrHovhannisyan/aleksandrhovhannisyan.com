---
title: "Premature Optimization: Code First, Optimize Later"
description: Premature optimization may be hurting the quality of your work. Focus on writing legible code first; optimize it later if you need to.
keywords: [premature optimization, optimization, micro-optimization, big-o]
categories: [math, algorithms, javascript]
layout: mathPost
commentsId: 94
---

Recently, there was a [Twitter thread going around](https://twitter.com/maxfmckay/status/1396252890721918979) that compared two approaches to the same problem in JavaScript: 1) using a single `Array.reduce` call with the ES6 spread operator, or 2) chaining array methods. The two code samples looked something like this (I've renamed the variables to clarify what's going on):

{% include codeHeader.html %}
```javascript
// Version 1: reduce with ES6 spread
users.reduce((offlineUsers, user) => {
  if (user.active) {
    return offlineUsers;
  }
  return { ...offlineUsers, [user.id]: curr.name };
});

// Version 2 (corrected): chaining filter and map, followed by reduce
users
  .filter(user => !user.active)
  .map(user => ({[user.id]: user.name}))
  .reduce((offlineUsers, user) => Object.assign(offlineUsers, user), {});
```

Both of these do the same thing: They take an array of users and turn it into an object that maps each offline user's ID to their name. The result might look something like this:

```json
{
  "id1": "Bob",
  "id2": "Alice"
}
```

Naturally, a question arose: Which version is better? The original tweet favored the second approach, where most of the work is done in chained array methods. I personally think the second version is slightly harder to understand because of the awkward `reduce` logic, where we combine $n$ separate objects into one at the end with `Object.assign`. By comparison, once we've rewritten the first code sample to use clearer variable names, it's a little easier to follow at a glance.

The original tweet was not about performance. But Tech Twitter, being the highly opinionated group that it is, decided to turn this innocent tweet into a (surprisingly civil!) debate about runtime complexity and benchmarking. So, in this article, I want to use this as an opportunity to argue in favor of writing legible code that gets the job done and only optimizing it when you really need to.

Below are just a handful of the noteworthy responses that I saw; they touch on important points about optimizing front-end code (and code in general, really).

{% include quote.html quote: 'Beware of "smart" coding tricks', source: "@jaffathecake", cite: "https://twitter.com/jaffathecake/status/1396447037915336705" %}

{% capture quote %}It's so easy to get sucked into performance micro-optimization territory.

Someone will say that Method X is slow, and inevitably somebody else will point out that it doesn't really matter outside of contrived, unrealistic benchmarks.

I wanna dig into that a bit…{% endcapture %}
{% include quote.html quote: quote, source: "@JoshWComeau", cite: "https://twitter.com/JoshWComeau/status/1397559162477895681" %}

{% include quote.html quote: "Not a reflection on your code, but on the whole, I think us frontend devs are too hung up on perf. You're not gonna run this 100k times in the frontend. (If so, you got other issues to tend to).", source: "@svencodes", cite: "https://twitter.com/svencodes/status/1396839189543587843" %}

Based on these and many other responses, the key takeaway appears to be this: You shouldn't try to optimize your code unless you have a good reason for doing so. You may think you need to worry about an algorithm's performance, but unless you have evidence that it's slow, you're wasting time doing micro-optimizations for little gain.

That's the gist of it, anyway. Let's try to make sense of it all!

{% include toc.md %}

## The Premature Optimization Trap

In some cases, optimizing your code or trying to rewrite it with clever tricks can make it more error prone and difficult to understand. Interestingly, this was the case in the original tweet (which was later corrected)—the proposed reduce logic with `Object.assign` was invalid:

```javascript
users
  .filter(user => !user.active)
  .map(user => ({[user.id]: user.name}))
  .reduce(Object.assign, {});
```

The corrected form is what I showed at the beginning of this post. Note that this is just one option; you could also use `Object.fromEntries`, although that version is even less readable.

```javascript
users
  .filter(user => !user.active)
  .map(user => ({[user.id]: user.name}))
  .reduce((offlineUsers, user) => Object.assign(offlineUsers, user), {});
```

I blame this on the fact that the code prioritizes brevity over clarity. It tries to be clever, and in doing so, it introduces a mistake. Clever code isn't clever if it doesn't work.

Moreover, premature optimization can actually present *more* performance issues. Every additional line of code you write incurs a cost—whether that's wrapping a function component's closure in a `useCallback` when you don't need to or memoizing a component with `React.memo`. You have to be able to justify *why* you're optimizing your code.

{% include quote.html quote: "Performance optimizations ALWAYS come with a cost but do NOT always come with a benefit.", source: "Kent C. Dodds", cite: "https://kentcdodds.com/blog/usememo-and-usecallback" %}

There's a harmful trend in our industry where developers try to cram every ounce of performance out of all the code that they write, citing algorithm theory and Big-O notation to justify their decisions. In all of this, they lose sight of the most important short-term concern: Writing code that works and that other people will understand.

## Optimization, Benchmarking, and Reaction Times

[One of the responses](https://twitter.com/JosiahDahl/status/1396337033262428162) to the original tweet even benchmarked the two code samples in a sandbox environment; the results were as follows:

- Average for reduce + ES6 spread: $0.29684$ ms
- Average for chained array methods: $0.12908$ ms
- Traditional for loop: $0.00985$ ms

There were some [other benchmarks](https://twitter.com/Marty_Rosenberg/status/1396308254276390917) as well that you can dig into. Josh Comeau did a good job of breaking down the process for [benchmarking front-end code](https://twitter.com/JoshWComeau/status/1397559170686234626) using a web performance API built into browsers. If anything, it's a good learning experience.

Let's put these numbers into perspective. The [typical human reaction time](https://spectrum.ieee.org/the-human-os/biomedical/devices/enabling-superhuman-reflexes-without-feeling-like-a-robot) is $0.25$ seconds. Moreover, a duration of $0.1$ seconds [feels almost instantaneous to users](https://www.nngroup.com/articles/response-times-3-important-limits/), meaning there's no noticeable delay between their input and an event occurring on screen.

This means that it's very difficult for you to notice (or react to) something that takes less than $0.25$ seconds to occur. Moreover, it means that you'll have a very hard time sensing the difference between a task that takes $0.2$ seconds to complete and another that takes $0.1$ seconds. When we're dealing with such small numbers, it's easy to use proportions to exaggerate our findings. While it's true that the alternative code is faster than the original code, the performance gains are, *relatively* speaking, negligible.

## Premature Optimization and Missing the Bigger Picture

Putting the numbers aside, notice that we've already lost sight of the bigger picture: writing legible and functional code. Instead, we got dragged into a rabbit hole of micro-optimizations, bickering over whether we should use an algorithm that takes $0.2$ seconds to run (on average) or one that takes a fraction of that time. We didn't stop to ask the questions that *really* matter:

- What is a realistic upper bound for the length of the `users` array, in practice?
- If that number is high, why are we querying such large amounts of data on the frontend?
- How many consecutive times is this algorithm going to run during a single page view?
- If it runs more than once, why? Could we cache the result somehow?
- Are there more important concerns in our UX that need to be addressed?

We spent a whole lot of time and effort on arguing about low-level implementation details, even benchmarking the code to see who's right. Meanwhile, we gained very little in the way of performance. If this happened at work, we essentially wasted our time and our employer's money.

## (Mis)Understanding Big-O Analysis

Many responses to the original tweet cited Big-O notation when comparing these two algorithms. It's a popular metric for measuring an algorithm's performance. Unfortunately, it's also often misunderstood and misused in practice. So, before we look at some additional code samples, let's take a moment to understand what Big-O is and how it's used.

### What Is Big-O Notation?

> Note: There's some math theory up ahead. I've tried to keep things as short and simple as possible. Feel free to skip this section if you're already familiar with Big-O.

**Big-O analysis** approximates the worst-case performance of an algorithm, in terms of runtime (CPU) or space (RAM) complexity. These two computational resources are competing in an endless tug of war: If you make an algorithm faster in terms of time complexity, you'll likely need to rely on auxiliary data structures that may increase its memory usage.

Mathematically, we can think of an algorithm as a function $f$ that operates on some input data of size $n$. In our case, the input is the `users` array (of length $n$). Big-O gives us an upper bound for our function $f(n)$, telling us how poorly we can expect it to perform when we increase the size of the input (in this case, if we pass in longer and longer arrays).

These are some of the most popular Big-O functions that you may have seen:

- $O(1)$: constant time
- $O(n)$: linear time
- $O(n^2)$: polynomial (quadratic) time
- $O(log_{2}(n))$: logarithmic time

But what do these mean?

As a reminder, we're trying to express an upper bound for our algorithm $f(n)$. It turns out that we can do this by introducing a second function as a point of reference. For example, if we say that $f(n)$ has a time complexity of $O(n)$, what we're really saying is that there's some other function out there—let's call it $g(n) = n$—such that our algorithm's performance will never breach some constant multiple of this upper bound:

$$
f(n) \leq k \times n
$$

So, $O(n)$ says that our algorithm runs in linear time in the worst case—i.e., it's bounded from above by a linear function. As the input grows in size, the time that it takes for our algorithm to finish its work grows linearly, too.

More accurately, Big-O measures how well your algorithm scales when it's given *infinitely* large inputs. That is, Big-O expresses the limit of $f(n)$ as $n$ approaches infinity: $\lim_{n \to \infty} f(n)$. This makes it a little impractical in real-world use cases, even though the theory is still important to understand. It's very rare that you'll ever be working with large arrays in JavaScript. And if you are, that's a problem—JavaScript is a single-threaded language, so your app may become unresponsive no matter how efficient your algorithm happens to be.

Finally, it's worth mentioning that Big-O is not the only notation out there—we can also measure an algorithm's best-case (omega notation, $\Omega$) and average-case (theta notation, $\theta$) performance. But we usually care more about the worst-case complexity of our code. If our algorithm scales well for the worst case, then it will likely scale well for smaller inputs, and this gives us more confidence in our algorithm's performance over a range of inputs. You don't plan an afternoon picnic with the best weather forecast in mind, after all.

### Common Mistakes in Big-O Analysis

With that out of the way, let's take a look at some common sources of confusion in Big-O analysis. These tend to mislead developers into preferring one algorithm over another when they are in fact equally good.

#### 1. Not All Inputs Scale in Size

As we learned, Big-O is all about putting algorithms under a theoretical stress test, loading them with larger and larger inputs. But in some cases, your algorithm's input won't scale in size, meaning an $O(n)$ algorithm is no better or worse than an $O(1)$ algorithm. In this case, the legibility of your code is more important than how well it performs.

For example, which of these two versions of code is faster? It's a pretty common scenario where we have to check whether a value is in another list of allowed values.

```javascript
// Version 1
if (value === 'a' || value === 'b' || value === 'c' || value === 'd') {
}
```

```javascript
// Version 2
const allowedValues = ['a', 'b', 'c', 'd'];

if (allowedValues.includes(value)) {
}
```

Technically, the first version *should* be faster, and you can benchmark this if you'd like to. But what we care about is Big-O theory since that's what usually motivates arguments in favor of one algorithm or another, and this does not involve any concrete benchmarking. So I'll leave that up to you if you're interested.

If you're not experienced with Big-O notation, you may think that the second algorithm has a worse Big-O time complexity than the first. But that's not true! In this case, the array always has a fixed size of four elements. We're not passing in a *dynamic* array as a dependency to our algorithm—it's just a static, hard-coded array of items that we look up in an `if` statement.

Moreover, it's unlikely that we'll ever add so many items to this array in the future that the performance penalty of iterating over an array will be perceivable to the end user (if it is, we have bigger problems to worry about—like why we're doing this in the first place). Thus, we can conclude that both algorithms perform on the order of $O(1)$, with the second having *barely perceptible* time and space penalties because it's using an array.

Taking things a step further, we *could* optimize this algorithm to use a set (or, equivalently, an object/map) instead of an array. This would still give us $O(1)$ lookups thanks to hashing. In fact, there's nothing wrong with using an object or set from the get-go. But if doing so harms your code's legibility, or if it means you need to spend more time comparing algorithms, then consider whether you really gained anything meaningful from optimizing your code.

#### 2. Multiple Array Iterations Aren't Inherently Slow

In response to the original tweet, some developers took issue with the fact that the second (proposed) code sample iterates several times over an array. Intuitively, it seems like this should be slower than if we were to iterate over the array just once:

```javascript
users
  .filter(user => !user.active)
  .map(user => ({[user.id]: user.name}))
  .reduce((offlineUsers, user) => Object.assign(offlineUsers, user), {});
```

However, this algorithm still has a runtime complexity of $O(n)$. This means that it's not any better than if we were to use a single loop (at least from a Big-O perspective).

Technically, the algorithm's time complexity is $O(3n)$—but with the limit definition of Big-O, we strip any leading constants from our function because they never scale with the size of the input. What impacts our algorithm's performance is not how many times we iterate over the array ($3$) but rather how big the array can be ($n$). The length of the array is variable and has a much bigger impact on the algorithm's performance; the number of iterations is always a constant.

Three iterations may seem inefficient compared to just one when the size of your array is small relative to the number of iterations. For example, if we only iterate over one, two, or a hundred elements, it becomes obvious that three loops are, in practice, slower than one. However, when the number of elements *far exceeds* the number of iterations, the lines become blurred—we're dealing with limits, and both functions converge to $O(n)$.

So we *could* try to optimize this code by iterating only once over the array, but there's no need to. In fact, in JavaScript, it would probably make our code more verbose than it needs to be. And at the end of the day, both algorithms would still have a time complexity of $O(n)$. Our current version is legible and easy to follow, so there's no immediate need to refactor it.

#### 3. Two Nested Loops Aren't Always $O(n^2)$

Contrary to what you may have been taught, nested loops aren't always $O(n^2)$. Their time complexity depends on a careful analysis of the algorithm's inputs.

For example, what's the time complexity of this code?

```javascript
const logElements = (array) => {
  array.forEach((element) => {
    for (let i = 0; i < 1000000000; i++) {
      console.log(i);
    }
  });
}
```

Most people will see two loops and think that this algorithm has a time complexity of $O(n^2)$. But it's actually $O(n)$. To understand why, we have to remember that the $n$ in Big-O denotes the size of the input. In this case, the input is the array over which we're iterating in the outer loop. This accounts for the $n$ in our answer.

However, the inner loop has a fixed number of iterations—it never scales with the size of the input like the outer loop does. This gives us a time complexity of $O(1000000000n)$. But per the limit definition of Big-O, this collapses to just $O(n)$.

Sure, $1,000,000,000$ is technically huge, but that's irrelevant—it's a constant, just like $3$ or $100$. Remember: Big-O considers our algorithm to be a function of its input, $f(n)$. Here, $n$ is the length of the array. Notice that the constant term in the inner loop is not present anywhere in this notation.  What Big-O notation measures is how well (or poorly) your algorithm scales with an input that's variable in size, not how it's impacted by extraneous constants.

For example, in theory, I could pass in an array with hundreds of billions of elements, and that inner loop would still always run a fixed number of times. In fact, the inner loop would now run *fewer* times than the outer loop! So while this code may in fact be *slow*, it's not *inefficient* in terms of Big-O analysis.

> Mathematically speaking, given a constant $k$, $O(kn)$ always just collapses to $O(n)$ when you take its limit as $n$ approaches $\infty$, no matter how big $k$ may be.

Here's another example that usually throws people off:

```javascript
const doStuff = (array1, array2) => {
  array1.forEach(n => {
    array2.forEach(console.log);
  });
}
```

Again, you might think that this algorithm's time complexity is $O(n^2)$ because of the nested loops. But the correct answer is that *it depends*. It's only $O(n^2)$ if the two arrays always have the same number of elements ($n$). The more accurate notation is $O(nm)$, where $n$ is the size of one array and $m$ is the size of the other.

It may seem like I'm being pedantic, but I'm not. If one array has a fixed size or is always very small, we can ignore its impact on the algorithm's performance for larger inputs because the other array will always overtake it. This is just a generalized form of the first code sample we saw above.

### Example: Reduce with Spread Operator vs. Chaining Array Methods

Now that we've reviewed some sample problems on Big-O analysis and have a better understanding of how it all works and some of the gotchas that you might encounter, we can revisit the original problem to understand why the second code sample is technically faster. Of course, this does not mean that that it's *better*.

As usual, whenever we're doing Big-O analysis, we need to identify the worst-case scenario for the given problem. Here, the worst case is if every single user is offline, meaning we never skip a user. This means that in the first code sample, we'll always invoke the spread operator, once for every element of the array.

#### 1. Reduce and ES6 Spread

```javascript
// Version 1: reduce with ES6 spread
users.reduce((offlineUsers, user) => {
  if (user.active) {
    return offlineUsers;
  }
  return { ...offlineUsers, [user.id]: curr.name };
});
```

This algorithm has a time complexity of $O(n^2)$ due to the use of the nested spread operator. It turns out that the spread operator calls `[Symbol.iterator]` on the accumulated object under the hood. In turn, this requires iterating over every key in the accumulated object.

To make this a little easier to understand, note that we have two loops:

- An explicit outer loop (`reduce`).
- An implicit inner loop (spread operator).

Each one is iterating over a different object. The outer loop is over an array of length $n$. The inner loop is over the accumulated object, whose size changes with each iteration. In fact, the accumulated object is also a function of $n$. This is more obvious if we break down each iteration.

During the first iteration of the outer loop, the spread operator will loop over zero accumulated elements (an initially empty object). During the second iteration, it will loop over one accumulated element, from the previous iteration. During the third iteration, it will loop over two accumulated elements. And so on, until we've looped over every element in the outer loop.

This gives us the classic [Gauss sum](https://stackoverflow.com/a/44255732/5323344) for the total number of iterations:

$$
1 + 2 + 3 + ... + n = \sum_{k=1}^{n} k = \frac{n^2+n}{2}
$$

And this is just $O(n^2)$ when we take its limit.

#### 2. Chaining Array Methods

```javascript
// Version 2 (corrected): chaining filter and map, followed by reduce
users
  .filter(user => !user.active)
  .map(user => ({[user.id]: user.name}))
  .reduce((offlineUsers, user) => Object.assign(offlineUsers, user), {});
```


This code sample has a time complexity of $O(n)$.

It's more obvious if we look at a [sample polyfill of the algorithm for `Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill):

```javascript
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
```

That's a lot of code, but the important bit is this loop:

```javascript
for (var index = 1; index < arguments.length; index++) {
  var nextSource = arguments[index];

  if (nextSource !== null && nextSource !== undefined) {
    for (var nextKey in nextSource) {
      // Avoid bugs when hasOwnProperty is shadowed
      if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
}
```

Don't get tricked into thinking this is $O(n^2)$ just because of the nested loops! We only have two arguments in our case:


```javascript
Object.assign(offlineUsers, user)
```

The outer loop runs only once. The inner loop runs over every key of the object that's getting copied (`user`). Once again, this may seems like it's dangerously close to being $O(n^2)$. But it's not because our `user` object only has one key from the mapping we did earlier:

```javascript
.map(user => ({[user.id]: user.name}))
```

This gives us an array of $n$ objects, each having a single key (a user ID). Something like this:

```json
[
  {"id1": "Bob"},
  {"id2": "Alice"}
]
```

So while it's true that we have two nested loops, each loop is only iterating once. The outer loop iterates once because it goes from $1$ to the number of arguments, exclusive ($2$). The inner loop only iterates over the keys, and each object only has one key.

We have $n$ total iterations, giving us a time complexity of $O(3n)$. Each array method contributes one $n$. But as we've learned, when doing Big-O analysis and considering limits, this becomes just $O(n)$ because constant terms have no impact on the function's behavior.

### A Better Solution (with Mutation)

So the second code sample technically "wins" in terms of Big-O analysis, but it's also a bit more convoluted than it needs to be. Fortunately, we can do better.

We can fix the first code sample by avoiding the spread operator altogether. There's no need to avoid mutation when the object you're mutating is a temporary one that you constructed during runtime to solve an algorithm. It's not as if you run the risk of mutating some external data source, potentially tampering with data. So there's no good reason to avoid mutation here.

{% include quote.html quote: 'Misuse of reduce and "avoid mutation at all costs" seems to come as a pair.' source: "@jaffathecake", cite: "https://twitter.com/jaffathecake/status/1396706523192115203" %}

So while it's poison to functional purists, we could easily do this instead:

```javascript
users.reduce((offlineUsers, user) => {
  if (user.active) {
    return offlineUsers;
  }
  offlineUsers[user.id] = user.name;
  return offlineUsers;
}, {});
```

Voila. $O(n)$ time complexity, just like the second code sample. But I would argue this is easier to understand because we're not creating an array of $n$ separate objects and then coalescing them into one at the end—we're simply assembling the object as we go along.

## Know What You're Optimizing

Admittedly, this was quite a long response to what was a very short and simple tweet (that sparked a debate about performance, algorithms, and, I suppose, the meaning of life). But I think it's important to understand these concepts well. When you do, you realize that writing clean and legible code is more important than obsessing over performance. It's easy to slip into this performance rabbit hole, with no end in sight. You'll frustrate yourself and others.

Sometimes, developers don't fully understand *what* they're optimizing when they decide to refactor their code. I blame this on our industry's tendency to conflate *clever* code with *good* code. People also forget that the time complexity of an algorithm isn't measured by the number of lines of code you write. Packed within a one-liner could be logic that operates on the order of $O(n^2)$, as we saw with the spread operator.

At the end of the day, if your input won't realistically grow in size, it doesn't matter which of the original two approaches you take, as long as others can easily read and understand your code. I've made my preference clear; yours may differ. Either way, take the time to understand the problem you're given and analyze any constraints. If you won't run into scaling issues, there's no point in comparing algorithms—just write the one that comes to mind and is easy to understand.

When you write code—especially front-end code in a language like JavaScript—you shouldn't get bogged down in the details of how well an algorithm performs. Only refactor your code if you run into noticeable, measurable performance bottlenecks. Otherwise, your time is better spent working on other things.

Your goal should always be to solve whatever problem you're given within reasonable time constraints. You can always refactor it later! But it can be tempting to pursue optimizations out of the gate simply because of how much emphasis is placed on algorithm analysis in our industry. This can lead to analysis paralysis, where you waste time comparing different algorithms and arguing with teammates when you could've written a solution in a fraction of the time.

Don't fall into the premature optimization trap. Instead, follow a simple process:

1. Write testable, documented, and legible code.
2. Optimize it when you need to.

Bonus points if you can do one from the start without sacrificing the other.

{% include unsplashAttribution.md name: "Aron Visuals", username: "aronvisuals", photoId: "BXOXnQ26B7o" %}
