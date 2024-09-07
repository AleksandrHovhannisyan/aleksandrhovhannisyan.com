---
title: Is JavaScript Pass by Reference?
description: Developers are often taught that JavaScript passes objects by reference. In reality, JavaScript is a pass-by-value language.
keywords: [javascript pass by reference]
categories: [javascript, memory]
commentsId: 36
lastUpdated: 2024-03-20
thumbnail: https://images.unsplash.com/photo-1529448005898-b19fc13465b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

If you're reading this article, chances are that you've heard the terms "pass by value" and "pass by reference"—whatever those mean. Maybe you were told that JavaScript is a pass-by-value language, or maybe you heard that it's pass by reference. More commonly, you've probably heard that it's both. This explanation is very common:

> Primitives are passed by value; objects are passed by reference.

This sounds simple enough to be true, but it's actually not. JavaScript, like most programming languages, is a pass-by-value language and does not support pass by reference, even though it *does* have what we call "references" (object references).

To make matters more confusing, [there's a lot of misinformation](https://medium.com/nodesimplified/javascript-pass-by-value-and-pass-by-reference-in-javascript-fcf10305aa9c) out there about this topic. It's something that developers struggle with not only in JavaScript but also in other languages. Here's what the Medium article linked above says about passing by reference:

> Changing the argument inside the function affect the variable passed from outside the function. In Javascript objects and arrays follows pass by reference.

Even the highest rated answer on StackOverflow for ["Is JavaScript a pass-by-reference or pass-by-value language?"](https://stackoverflow.com/a/3638034/5323344)—with nearly three times more upvotes than the correct answer—misses the mark, claiming that JavaScript is a special case when it really isn't.

In reality, only a few programming languages actually support passing arguments by reference. Two such languages are C++ and PHP. Other languages—like C, Java, JavaScript, Python, and Go, to name a few that come to mind—pass arguments *by value*.

So why do so many people get this wrong? And does it even matter? That's what we're here to learn! If you'd like the short answer, feel free to jump to the section titled [Passing Pointers ("References") by Value](#passing-pointers-references-by-value).

{% include "toc.md" %}

## Prerequisite Terminology

Before we move on, we'll need a quick terminology primer. Consider this code:

```javascript
function doSomething(arg) {
    // ...
}

const obj = { foo: 'bar' };
doSomething(obj);
```

A <dfn>formal parameter</dfn> (parameter for short) is the local variable declared in a function's signature. Above, the formal parameter of `doSomething` is `arg`. On the other hand, the <dfn>argument</dfn> is the variable (`obj`) whose value gets passed into the function.

When your browser executes this code, it will create two "frames" in its memory stack: one for the main (enclosing) scope and and another for the `doSomething` invocation. Each frame is like a compartment in a drawer, storing values and objects that are not accessible from within other compartments. Diagrammatically, here's what the stack would look like once `doSomething` has been called:

![Two stack frames are shown in memory; one corresponds to the main method. The other, positioned directly above, is a function that was called from main. That stack frame contains the argument that was passed along when the function was invoked.](./images/stack-frame.png){eleventy:formats="png,webp"}

With that out of the way, let's get into the meat of the discussion.

## JavaScript Doesn't Pass by Reference

If there's one thing you should take away from this article, it's this: Passing **a reference** into a function is not the same as passing an argument **by reference**. This muddied terminology is the main source of confusion in understanding pass by value vs. pass by reference in JavaScript and other languages. It's something that trips up many developers.

In JavaScript, variables that store objects are called **object references** (usually "references" for short). The term *reference* is a natural way to talk about these variables in English because we say that a variable *refers to* an object in memory, sort of like how an article might *reference* a source.

![An object resides somewhere in memory. A little black square is shown, representing a variable named person that points to a specific memory address.](./images/object-reference.png){eleventy:formats="png,webp"}

There's nothing wrong with using the term "reference" to talk about objects in this manner, and I don't want to discourage you from doing so. In JavaScript, this is the accepted terminology; if you choose to deviate from it, you'll end up confusing others.

But this terminology is also confusing. Who can blame developers for making the aforementioned connection? It's only natural to think that a language with references must support passing by reference. To suggest otherwise may even seem absurd or pedantic.

So, to clear up this confusion, we'll need to understand two things:

1. What the "reference" in "pass by reference" really means.
2. The difference between pass by value and pass by reference in JavaScript.

## True References Are Aliases

Let's clarify one thing before moving on: The word "reference" in "pass by reference" has a special meaning, and it does *not* mean "object reference." JavaScript does not have these "true" references. Again, terminology can be confusing!

JavaScript—like Java, Python, and other programming languages—uses the term "reference" when talking about variables that point to objects in memory. But as I noted above, while this makes perfect sense in English, it makes it very confusing to talk about "passing references" without losing your mind.

In a class on programming language theory, you'll learn that the "reference" in "pass by reference" is actually something quite different from these "object references" that you're used to hearing about. In fact, a true reference has nothing to do with objects—references can either hold primitive values or objects.

A true **reference variable** is an alias, or another name for an object. If you've mainly worked with languages like C, Java, JavaScript, Python, and others up until now, this notion of aliases may seem a bit foreign to you. And that's because those languages don't have references! For this reason, I'll use C++ to demonstrate how true references work, contrasting them with the behavior of object references in JavaScript.

{% aside %}
By analogy, a reference is like a person's nickname. My real name is Aleksandr, but I sometimes also go by Alex. People can use either identifier to refer to me; they are interchangeable.
{% endaside %}

The following C++ code demonstrates true reference variables in action:

```cpp {data-copyable=true}
#include <iostream>
#include <string>

int main()
{
    // An ordinary variable
    std::string myName = "Aleksandr";

    // A reference variable that aliases myName
    std::string &myNickname = myName;

    // let's change myNickname to store a different string
    myNickname = "Alex";

    // the change is reflected in both variables!
    std::cout << myName << std::endl; // "Alex"
    std::cout << myNickname << std::endl; // "Alex"
}
```

In this example, I created a simple string and bound it to the variable `myName`; then, I created another variable that serves as an alias for `myName` by using the special ampersand syntax for declaring references. I then bound a new string value to this alias. The change was reflected not only in the alias but also in the original (aliased) variable.

In languages that don't support reference variables (e.g., JavaScript), two variables may share **a copy** of a value, but it's guaranteed that those variables will **occupy different memory addresses**. Here's an attempt at the above in JavaScript:

```javascript {data-copyable=true}
let myName = "Aleksandr";
let myNickname = myName;

myNickname = "Alex";

console.log(myName); // "Aleksandr"
console.log(myNickname); // "Alex"
```

On the second line, we're creating a copy of the string `"Aleksandr"` and binding it to a new variable named `myNickname`. Importantly, these two variables occupy different memory addresses—assigning a new value to one variable does not affect the value referred to by the other variable.

Unlike a variable that receives a copy of a value, [a reference variable does not have its own memory address](https://stackoverflow.com/a/1950998/10480032)—it shares the same exact memory address as the original variable, as if we had never declared two variables in the first place. We can verify this in C++ using something called the address-of operator (`&`), which returns the memory address of a variable:

```cpp {data-copyable=true}
#include <iostream>
#include <string>

int main()
{
    std::string myName = "Aleksandr";
    std::string &myNickname = myName;

    // Print the memory address of myName
    std::cout << &myName << std::endl;

    // Print the memory address of myNickname
    std::cout << &myNickname << std::endl;
}
```

If you [run this code](http://cpp.sh/), you'll see that the same exact memory address is logged twice.

It's here that some developers claim that JavaScript *does* have true references, using objects to prove their point:

```javascript
let me = { name: 'Aleksandr' };
let alias = me;

alias.name = 'Alex';

console.log(me); // { name: 'Alex' }
console.log(alias); // { name: 'Alex' }
```

This certainly seems to work the way references behave, but it's not the same at all. What we've done here can be broken down into four simple steps:

1. We've allocated space in memory to store an object (`{ name: 'Aleksandr' }`).
2. We've created a variable named `me` that points to the memory address where this object resides.
3. We've created yet another variable, `alias`, that also points to the same memory address as `me`.
4. We can use either variable to modify the object at that memory address. Since both variables point to the same memory address, any changes to the object at that location will be reflected when we poll either variable in the future.

But these two variables, `me` and `alias`, do not share the same memory address on the stack. In other words, `alias` is not really a true reference. We can easily prove this by creating a new object and pointing `alias` to it:

```javascript
let me = { name: 'Aleksandr' };
let alias = me;
alias = { name: 'Alex' };

console.log(me); // { name: 'Aleksandr' }
console.log(alias); // { name: 'Alex' }
```

If `alias` were in fact a true reference, then the change on line three *would've* been reflected in the original (aliased) variable. But it wasn't!

## "Object References" Are Pointers

You may have noticed that I used the term "point" quite a lot. What's up with that? What—pardon the awful pun—is the *point* I'm trying to get across?

<figure>
<img src="./images/pointers.png" eleventy:formats="png,webp" alt="xkcd comic about pointers. Two stick figures are depicted; one is sitting cross-legged in front of a TV playing video games, and the other is standing beside them. Player: 'Man, I suck at this game. Can you give me a few pointers?' Friend: '0x3A28213A 0x6339392C, 0x7363682E.' Player: 'I hate you." sizes="100vw" />
<figcaption>Source: <a href="https://xkcd.com/138/">xkcd</a>.</figcaption>
</figure>

So far, we've seen that JavaScript does not have "true" references—the ones that are used in "pass by reference"—even though that's the accepted shorthand terminology when talking about "object references." So what exactly *are* object references in JavaScript?

"Object references" in JavaScript are really pointers. A <dfn>pointer</dfn> is a variable that—instead of directly storing a primitive value like an `int`, `bool`, `float`, or `char`—stores the memory address where some data lives. Pointers refer to their data indirectly, using the addresses where those data can be found.

An analogy may help to illustrate this: A pointer is like keeping record of a person's home address instead of directly logging that person's information somewhere. If you later visit that address, you might find data living there: a person with a name, age, and so forth. The person at that address may change their name, grow older, or decide to leave the property and be replaced by another tenant with an entirely different name, age, and so on. The address may even be empty and on the market. As long as we point to the same address, we can visit it to find out what data (person) lives there. We may also one day decide to point to a completely different home address with different residents or, if we're the landlord, evict someone from their home.

It may not be immediately obvious why we need pointers in the first place and how they're even relevant in JavaScript. This deserves some elaboration. If you're already familiar with pointers, feel free to skip forward to the section on [pass by value vs. pass by reference](#pass-by-value-vs-pass-by-reference).

### How Are Objects Stored in Memory?

Computers are good at one thing: Storing, retrieving, and manipulating numbers. So what happens when we want to create compound data like objects, arrays, or strings in a programming language? How is that data stored if, for example, we have no "person" or "array" or "string" data type and computers can only store and retrieve numbers?

Let's consider this JavaScript code as an example:

```javascript
const n = 42;
const bob = { name: 'Bob' };
```

At the hardware level, we can store the primitive integer `42` in a CPU register and save it to the stack directly, instead of having to remember the memory address where we allocated space for this integer. Remember: Numbers are the language of computers. As it so happens, `42` *is* a number. Everything works out, and we store this number directly.

But what if our variable refers to a more complex object (think "composite data"), like an object, array, or string? Then we need to use a pointer to remember where exactly in memory that data was stored. Because at the CPU level, we have no notion of "objects," "arrays," or "strings"—we can only allocate blocks of memory and store raw numbers in those addresses. If you want to store composite data in memory, you need to use a pointer to remember where that composite chunk of data begins.

For example, suppose that people in our world have more attributes:

```javascript
const bob = { name: 'Bob', age: 42, country: 'USA' };
```

How is it possible to cram all of this data into a single memory address? There's really no way to store `{ name: 'Bob', age: 42, country: 'USA' }` in one memory address as-is and call it a day because `{ name: 'Bob', age: 42, country: 'USA' }` is not a literal primitive value that a computer understands. So instead, we start at a particular memory address—called a base memory address—and begin storing these *pieces* of information in consecutive blocks. Then, `bob` points to that base memory address, such that we can work our way up later on and "reassemble" the pieces of information that we need, so to speak.

That takes care of objects, but what about strings? They may *seem* like a primitive data type only because words are the basic building blocks of the English language. But remember: Computers don't understand English, French, or Chinese; they're just concerned with numbers. In reality, a string consists of characters that are stored in consecutive memory addresses and encoded as numbers using the Unicode standard. In programming languages, a string is implemented as a pointer to the memory address of its first character. If we know the specific character encoding that a string uses (e.g., UTF-16 in JavaScript), we can use pointer arithmetic under the hood to figure out what the string is since we already have its base memory address and the number of characters that were stored.

The key takeaway here is that pointers are a fundamental tool in programming that exists in the implementation of nearly every language. Whether they are hidden from plain sight or made explicit by a special syntax is not important. What matters is that you understand how memory works and that most languages do not have "references."

## Pass by Value vs. Pass by Reference

Okay, we've established that "object references" in JavaScript are really pointers and that pointers are good at one thing: storing memory addresses. Objects reside at these memory addresses. We can visit those addresses and modify the objects that live there, or we can have a variable point to an entirely new object at some other location in memory. With this background, we're ready to understand why pass by reference does not exist in JavaScript.

### Pass by Reference

We've learned what references really are: *aliases*. And as it turns out, this is precisely the kind of reference that we're talking about when we say a language has "pass by reference." It's all about aliasing arguments that were passed in!

First, let's understand what pass by reference does *not* mean: Pass by reference does *not* mean, "We can pass in an object to a function, modify that object, and then observe the modified result even after the function returns."

In <dfn>pass by reference</dfn>, the formal parameter is a reference variable (alias) for the argument. It's almost like two functions have temporarily agreed to call a single object by two names (one original and one alias) and to pretend that the two are equivalent. Or, in less accurate terms, you can think of it like a function "borrowing" a variable from another stack frame but calling it something else.

#### A Litmus Test for Pass by Reference

There's a classic litmus test to check if a language supports passing by reference: whether you can swap two numbers by passing them in to a function (the following code is written in JavaScript):

```javascript {data-copyable=true}
function swap(a, b) {
    const temp = a;
    a = b;
    b = temp;

    console.log(a); // 2
    console.log(b); // 4
}

let x = 4;
let y = 2;
swap(x, y);

console.log(x); // 4
console.log(y); // 2
```

If you run this JavaScript, you'll find that `x` and `y` do not swap, whereas `a` and `b` do locally. Therefore, JavaScript doesn't support passing by reference. If it did, then `a` would've been an alias for `x` and `b` would've been an alias for `y`. Any changes to `a` and `b` would have been reflected back to `x` and `y`, respectively. But they weren't!

So, what happened here? The variables `a` and `b` are local to the stack frame of `swap` and receive copies of the values of the arguments that are passed in. This means that the values of `a, b` and `x, y` coincide because they are copies, not because they're aliased.

In contrast, here's an example of swapping two integers by reference in C++:

```cpp
#include <iostream>

 void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
 }

int main()
{
    int x = 5;
    int y = 6;

    // Success! x = 6, y = 5
    swap(x, y);
}
```

Let's break this down: `x` and `y` are the arguments that we pass into `swap`. The method signature of `swap` defines two reference parameters, `a` and `b`. Since these are reference variables, they serve as aliases for whatever two variables are passed in as arguments (`x` and `y`, respectively). Thus, the swap succeeds.

### Pass by Value

In the simplest terms, **passing by value** is about *copying*. We already saw this above with the failed JavaScript swap:

```javascript
function swap(a, b) {
    const temp = a;
    a = b;
    b = a;

    console.log(a);
    console.log(b);
}

let x = 4;
let y = 2;
swap(x, y);

console.log(x);
console.log(y);
```

When an argument is passed by value, the formal parameter receives a copy of the argument's value. The formal parameter and the argument are two different variables that just happen to share the same value. The formal parameter is a local variable on the function's stack frame. The argument we passed in is a variable residing at a completely different memory address, in the caller's stack frame.

### Passing Pointers ("References") by Value

Now comes the most important discussion, and the key to understanding why JavaScript is not pass by reference: What happens when we pass "object references" (pointers) by value?

```javascript
function changeName(person) {
    person.name = 'Jane';
}

let bob = { name: 'Bob' };
changeName(bob);
```

First, let's note again that when we pass something by value, the formal parameter receives a copy of the argument's value.

If we're passing a pointer into a function as an argument, what "value" does the formal parameter receive? Remember: Pointers are nothing fancy—they're just variables that store the memory address of some data.

So, when we pass a pointer into a function as an argument, the formal parameter receives a copy of the *memory address* to which the argument was pointing. We essentially end up having two different variables, on two different stack frames (caller and callee), that point to the same location in memory.

![Left: stack. Right: heap. Stack contains two stack frames: main (with local variable bob) and changeName (local variable person). Both variables point to the same memory address on the heap for an object.](./images/passing-a-pointer-by-value.png){eleventy:formats="png,webp"}

At that memory address is an object. We can follow either the formal parameter pointer or the argument pointer and visit that memory address to modify the object located there. In the case of the code above, we're reading the formal parameter pointer:

![Left: stack. Right: heap. Stack contains two stack frames: main (with local variable bob) and changeName (local variable person). Both variables point to the same memory address on the heap for an object. Sample code shows changeName modifying the name property of the object at this memory address. Text reads: &quot;person here. I'd like to change the name property of whatever object resides at this address. bob here... still pointing to the same location in memory. I wonder if the object has changed since I last saw it?&quot;](./images/modifying-object.png){eleventy:formats="png,webp"}

What we cannot do is have the formal parameter point to a different location in memory and expect the argument to point to that new location once the function returns. This *would* be the case if the argument were passed in by reference. But JavaScript is pass by value!

![Left: stack. Right: heap. Stack contains two stack frames: main (with local variable bob) and changeName (local variable person). Both variables point to the same memory address on the heap for an object. Sample code shows changeName pointing its local variable to a new object. Text reads: &quot;person here. Time to point to a new object!&quot; Local variable bob is still pointing to the original object.](./images/pointing-to-a-new-object.png){eleventy:formats="png,webp"}

Notice that within the scope of the `changeName` function, `person` points to the object with a `name` property of `'Jane'`. But this doesn't affect the pointer argument—it's still pointing to the original location in memory, and the object there is left untouched.

## Call Them Whatever You Want

Object references, references, pointers—**these are all valid terms**. The point isn't to get into terminology wars with people online about pass by value vs. pass by reference. At the end of the day, you may all be talking about the same thing, with just a slightly different understanding.

The reason I recommend using terms like pointer or *point* is because it's a very **tactile** term. You can almost picture a variable pointing to *something* in memory. This can make it easier to visualize memory models and understand what's going on. Plus, as we saw, it's confusing to talk about *pass by reference* when there are really two distinct definitions for the term *reference*.

But now that you understand what references really are in JavaScript, you can continue to use this term just like everyone else does to avoid confusing others.

## Summary

Let's recap what we covered in this post:

1. What some languages call "object references" can be thought of as pointers. It helps to think of them as pointers so we don't confuse the term *reference* as it's used in "object reference" with how it's used in "pass by reference."
2. True references are aliases. The "reference" in "pass by reference" is about aliases, not "object references."
3. Pointers are variables that store data indirectly, via memory addresses.
4. In pass by value, the formal parameter receives a copy of the argument's value.
5. In pass by reference, the formal parameter is an alias for the argument passed in.
6. When we pass a pointer by value, the formal parameter receives a copy of the memory address to which the argument is pointing. This lets us modify the underlying object being pointed to.

And that about sums it up!

{% include "unsplashAttribution.md" name: "Olesya Grichina", username: "lsgr", photoId: "6gKx3ESOoFE" %}
