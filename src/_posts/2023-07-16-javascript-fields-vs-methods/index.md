---
title: Class Fields vs. Methods in JavaScript
description: In JavaScript, class fields allow you to define properties on a class instance outside the constructor. In the case of function properties, it's important to understand how fields differ from methods and their potential tradeoffs.
keywords: [class fields, methods, javascript, es2022]
categories: [javascript]
---

ECMAScript 2022 introduced the long-awaited public and private class fields, inching JavaScript closer to traditional object-oriented languages. But what exactly are class fields? And, in the special case of fields that happen to be functions, how do they differ from methods? By the end of this article, we will answer those questions and understand when to use class fields (and when not to).

{% include "toc.md" %}

## Review: Prototypical Inheritance

JavaScript follows a programming language paradigm known as [prototypical inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain), where special constructor functions can be invoked with the `new` keyword to return an object that is an instance of that constructor. These functions are like factories or blueprints that describe an object's properties and behaviors. Each instance of a constructor function has a special property (`__proto__`) pointing back to the prototype of the function that constructed it:

```js
function MyClass(property) {
  this.property = property;
}

MyClass.prototype.method = function() {}

const instance = new MyClass('value');
console.log(instance.property); // 'value'
console.log(instance.__proto__ === MyClass.prototype); // true
```

ES6 formally introduced classes as syntax sugar for prototypical inheritance to make object-oriented code in JavaScript read more naturally, like in other traditional OOP languages. The above code is functionally equivalent to this:

```js
class MyClass {
  constructor(property) {
    this.property = property;
  }

  method() {}
}

const instance = new MyClass('value');

// Just as before
console.log(instance.property); // 'value'
console.log(instance.__proto__ === MyClass.prototype); // true
```

Later, [ES2022 introduced a new concept](https://262.ecma-international.org/14.0/): class fields.

## What Are Class Fields?

In object-oriented languages, instance properties are are typically initialized within the class constructor. In the following example, `MyClass` initializes `this.property` to a string value in its constructor:

```js
class MyClass {
  constructor() {
    this.property = 'value';
  }
}

const instance = new MyClass();
console.log(instance.property); // 'value'
```

But when the properties happen to be functions that span multiple lines, this can harm readability and clutter the constructor with nested, declarative logic that should ideally live outside the constructor:

```js
class MyClass {
  constructor() {
    this.property = 'value';

    // yuck
    this.routine1 = function () {}
    this.routine2 = function () {}
    this.routine3 = function () {}
  }
}
```

Constructors are traditionally responsible for initializing properties, registering event listeners, invoking super methods, and performing similar setup tasks, not defining entire instance functions inline. ES2022's class fields allow you to declare and define instance properties outside the constructor for improved readability:

```js
class MyClass {
  /* Field that's an ordinary string value */
  property = 'value';

  /* Field that happens to be a function */
  routine = function () {}

  /* Ordinary method */
  method() {}
}
```

Importantly, unlike methods, class fields are unique to each instance of the class because of how they are declared on `this`. We can verify this with the following code:

```js
class MyClass {
  routine = () => {}
  method = () => {}
}

const instance1 = new MyClass();
const instance2 = new MyClass();

// false, different functions
console.log(instance1.routine === instance2.routine);

// true, shared method on the prototype
console.log(instance1.method === instance2.method);
```

Note that while class fields are not limited to just functions, this article will focus on that particular usage and compare it to traditional methods. Class fields also allow you to define private properties, but we will not consider that functionality in this article.

## Class Fields and `this` Binding

The example we just looked at raises a question: Why would we ever _want_ to declare a function on a class instance in the first place?

```js
class MyClass {
  routine = function() {}
}
```

Why not just use a method that's shared by all instances of the class? This is what you'd do in any other OOP language:

```js
class MyClass {
  method() {}
}
```

One reason has to do with [`this` binding](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Class fields allow us to use the arrow function syntax, while regular methods don't:

```js
class MyClass {
  // An arrow function
  routine = () => {}
}
```

And in an arrow function, the `this` keyword is always lexically bound to the enclosing scope, which in the case of a class is the instance that's being constructed. Consider this example:

```js
class MyClass {
  constructor() {
    this.property = 'value';
  }

  routine = () => this.property;
}

const instance = new MyClass();

// With a function() declaration or method, `this` would get rebound
// to the global scope here due to how routine is being called (via
// a local variable in the global scope). But since routine is an arrow
// function, `this` is correctly bound to the instance.
const routine = instance.routine;
console.log(routine()); // 'value'
```

Declaring an arrow function on a class instance ensures that `this` within the function is always lexically bound to the class instance itself. These types of functions are particularly useful as handlers in event-driven code, where functions are passed around and later invoked by some other code outside the class:

```js
class MyClass {
  // Arrow function as a class field
  routine = () => {}
}

const instance = new MyClass();
// The click handler's `this` value will be correctly bound to `instance`
document.addEventListener('click', instance.routine);
```

When desugared, this class is essentially equivalent to the following function constructor; its usage remains the same:

```js
function MyClass() {
  this.routine = () => {}
}
```

### Alternatives for `this` Binding

Traditionally, there were two ways to bind `this` to the class instance in JavaScript:

1. Defining functions on the instance in the constructor.
2. Using traditional methods together with [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

The second approach is a special variation of the first.

We already looked at an example of the first approach, which can become unwieldy if many such functions need to be defined:

```js
class MyClass {
  constructor() {
    this.routine = () => {}
  }
}
```

Here's an example of the second approach with `Function.prototype.bind`:

```js
class MyClass {
  constructor() {
    // Create a copy of `MyClass.prototype.routine` with `this` bound to the
    // instance and assign this new function to a property on the instance
    this.routine = this.routine.bind(this);
  }

  // Traditional method. `this` can be unpredictable!
  routine() {}
}
```

Like the first approach, it assigns a function to the instance in the constructor. But unlike the first approach, it does not _clutter_ the constructor with the function's definition. Rather, it defines the function first as an ordinary method on the class prototype, and then it clones that function with `Function.prototype.bind` in the constructor.

That's the same as doing this with a constructor function:

```js
function MyClass() {
  // 2. When constructing a new MyClass instance, ensure it gets a new
  // routine property with `this` bound to the instance itself
  this.routine = this.routine.bind(this);
}

// 1. Declare the "method" on the prototype
MyClass.prototype.routine = function () {}
```

Both the `function.prototype.bind` approach and the class field approach create a new function every time the constructor is invoked, meaning every instance of `MyClass` receives its own copy of that function rather than _sharing_ a single function inherited off of `MyClass.prototype`:

```js
// Old approach: Function.prototype.bind
class MyClass {
  constructor() {
    // Every instance creates a new function
    this.routine = this.routine.bind(this);
  }

  routine() {}
}

// Class field approach
class MyClass {
  // Every instance creates a new function
  routine = () => {}
}
```

However, there's a key difference: The method approach actually uses more memory since it also declares a blueprint method on the prototype that is never used directly—it is always cloned as a newly bound function of the same name, and it still lingers under `MyClass.prototype.routine`. So class fields are marginally superior to `Function.prototype.bind` in this use case.

## Class Field Tradeoffs

While class fields have legitimate use cases, they are _not_ a replacement for ES6 class methods. As we saw in the previous examples, if a method is going to be passed around to event-driven code (where the value of `this` depends on how the function is called), you'll need to create a new function with the value of `this` correctly bound to the instance itself. Otherwise, your code may throw a runtime error when you try to access an undefined property due to `this` getting rebound. However, you should not go through your code and replace all ES6 methods with the new class field syntax, as that can have unintended consequences if you don't know what you're doing. Let's consider some of the pitfalls of class fields.

### 1. Readability vs. Obscurity

Class fields are more readable, but that readability comes at a cost: In the following example, it's not immediately obvious that `routine` is a new function on every instance of the class.

```js
class MyClass {
  routine = () => {}
}
```

The old approach of declaring it in the constructor made this explicit, as did the `Function.prototype.bind` approach:

```js
class MyClass {
  constructor() {
    // It's obvious here that routine exists on the instance
    // rather than on the class prototype.
    this.routine = function () {}
  }
}
```

But functions-as-fields look very similar to methods, and sometimes they may live alongside method definitions:

```js
class MyClass {
  routine1 = function() {}
  routine2 = () => {}
  method() {}
}
```

Beginners may find this confusing, especially if they're not equipped with the right vocabulary to distinguish between these two similar but distinct syntaxes. On the other hand, this is just the unavoidable cost of a language specification that's continually growing. Comparable standards in other languages (like C++) are even more complex, so the onus is still on developers to familiarize themselves with these concepts and use them responsibly.

### 2. Memory Usage

If you need to guarantee that a function always has a stable `this` that always points to the class instance, then it's perfectly fine to use the class fields syntax to avoid having to use the old eyesore that was `Function.prototype.bind` or cluttering your constructor with function definitions. Both approaches essentially do the same thing, with the only key difference being that the `Function.prototype.bind` approach requires declaring a method while class fields don't. But if you know that a function will always be invoked with the dot syntax off of the instance itself, then you may as well stick with methods. Otherwise, you'll needlessly create a new function on every instance of that class, wasting memory. By contrast, with methods, every instance of the class simply points back to a _single function_ that lives on a shared prototype object in memory. In other words, you should use class fields deliberately rather than replacing all methods with this shiny new syntax. This is an especially important consideration if you plan on instantiating a class hundreds of times, in which case fields will consume memory linearly.

### 3. Class Fields and Inheritance

Consider this example of simple inheritance, where a subclass tries to override a base class method with a custom implementation while still calling the base method via the `super` keyword:

```js
class BaseClass {
  field = () => {
    console.log('BaseClass field');
  }
}

class Subclass extends BaseClass {
  field = () => {
    // Will this work?
    super.field();
    console.log('Subclass field');
  }
}

const instance = new Subclass();
instance.field();
```

If you run this code, you'll get the following type error:

```
Uncaught TypeError: (intermediate value).field is not a function
```

This is working as expected because `super` points to `BaseClass.prototype`, but `BaseClass.prototype.field` doesn't exist. Remember, `field` is a class field, so it lives on each _instance_ of `BaseClass` rather than on its prototype. This means that it it's not accessible via the `super` keyword. It _is_, however, accessible via `this` because every instance of `Subclass` is also an instance of `BaseClass`. But then we can't access the base class's field from a field of the same name in the subclass because `this.field` gets reassigned. So doing this would overflow the stack when `field` is called:

```js
class BaseClass {
  field = () => {
    console.log('BaseClass field');
  }
}

class Subclass extends BaseClass {
  field = () => {
    // Yikes! Infinite loop.
    this.field();
    console.log('Subclass field');
  }
}
```

By contrast, methods are declared on class prototypes, allowing us to predictably use `super` the way it was intended in inheritance:

```js
class BaseClass {
  method() {
    console.log('BaseClass method');
  }
}

class Subclass extends BaseClass {
  method() {
    super.method();
    console.log('Subclass method');
  }
}
```

## Summary

Introduced in ES2022, class fields allow you to declare and initialize any value on a class instance outside the constructor. When those properties happen to be functions and are passed around in event-driven code, class fields allow you to leverage the arrow function syntax to bind `this` to the class instance. While class fields have their uses, they are by no means a replacement for prototypical inheritance and methods. To avoid the pitfalls we discussed in this article, follow this rule of thumb: Use methods first, and convert them to class fields as needed.

