---
title: "Is JavaScript Pass by Reference?"
description: Developers are often taught that JavaScript passes objects by reference. But this isn't true. Here's why JavaScript is actually a pass by value language.
keywords: [javascript pass by reference]
tags: [dev, javascript, memory]
comments_id: 36
---

There's a rite of passage that every beginner programmer must endure in their studies: understanding pass by value vs. pass by reference as it relates to whatever language they're learning. And there's a nice little song that comes with it, with practically every teacher singing it to their students:

> *"Primitives are passed by value; objects are passed by reference."*

Sounds simple enough to be true, right?

Except it's not. JavaScript, like most programming languages, strictly uses pass by value and does not support pass by reference, even though it *does* have what people call "references" (object references).

[There's a lot of misinformation](https://medium.com/nodesimplified/javascript-pass-by-value-and-pass-by-reference-in-javascript-fcf10305aa9c) out there about this topic. It's something that beginners struggle with not only in JavaScript but also in other languages. Here's what that Medium article says:

> Changing the argument inside the function affect the variable passed from outside the function. In Javascript objects and arrays follows pass by reference.

Even the highest rated answer on StackOverflow for [Is JavaScript a pass-by-reference or pass-by-value language?](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language/5314911#5314911)—with nearly three times more upvotes than the correct answer—misses the mark, claiming that JavaScript is a special case when it really isn't.

Here's the truth: Only a limited number of programming languages actually support passing arguments by reference. Two such languages are C++ and PHP. Other languages—like C, Java, JavaScript, Python, and Go, to name a few that come to mind—pass arguments *by value*.

So why do so many people get this wrong? We're about to find out.

If you'd like the TL;DR answer, go ahead and jump to [Passing Pointers ("References") by Value](#passing-pointers-references-by-value).

{% include toc.md %}

## Prerequisite Terminology: Arguments vs. Parameters

Before we move on, we'll need a quick terminology primer:

```javascript
function doSomething(arg) {
    // ...
}

const obj = { foo: 'bar' };
doSomething(obj);
```

A **formal parameter** (parameter for short) is the local variable declared in a function's signature. Above, the formal parameter of `doSomething` is `arg`. On the other hand, the **argument** is the variable (`obj`) whose value gets passed into the function.

Diagrammatically, here's what the stack would look like once `doSomething` has been called:

{% include picture.html img="stack.png" alt="Two stack frames." %}

With that out of the way, let's get into the meat of this post.

## JavaScript Doesn't Pass by Reference

If there's one thing you need to take away from this post, it's this:

> Passing **a reference** into a function is not the same as passing an argument **by reference**.

This muddied terminology is the main source of confusion in understanding pass by value vs. pass by reference in JavaScript and other languages. It's something that trips up lots of developers.

### What Are Object References in JavaScript?

In JavaScript, variables that "refer to" an object somewhere in memory are called **object references** ("references" for short). The term "reference" is a natural way to talk about variables in English because we say that a variable *refers to* an object in memory, sort of like how an essay might *reference* a literary source, for example.

{% include picture.html img="object-reference.png" alt="An object reference in JavaScript." %}

Most beginners assume that a language that has "object references" must naturally support "pass by reference" since they both have "reference" in their name. This is, understandably, confusing.

To clear up that confusion, we'll need to understand two things:

1. What the "reference" in "pass by reference" really means.
2. The difference between pass by value and pass by reference in JavaScript.

## "True" References Are Aliases

Let's get one thing straight: **JavaScript does not have references**.

JavaScript has chosen to [follow in Java's misguided footsteps](http://www.javadude.com/articles/passbyvalue.htm#on-pointers-versus-references) and insists on using the term "reference" when talking about variables that point to objects in memory. As we noted above, while this makes perfect sense in English, it makes it very confusing to talk about "passing references" without completely losing your sanity.

If you go on to work with C++, you'll learn that a reference is actually something quite different from these bastardized "object references" that you're used to hearing about.

A true **reference variable** is an alias: another name for an object. If you've mainly worked with languages like C, Java, JavaScript, Python, and others up until now, this notion of aliases may seem foreign to you. And that's because those languages don't have references.

By analogy, a reference is like a person's nickname. My real name is Aleksandr, but I sometimes also go by Alex. People can call me either one, and they'll still be referring to the same exact person.

Here's some C++ code to illustrate true reference variables in action:

{% capture code %}#include <iostream>
#include <string>

int main()
{
    // An ordinary variable
    std::string myName = "Aleksandr";

    // A reference variable
    std::string &myNickname = myName;

    myNickname = "Alex";

    std::cout << myName << std::endl; // "Alex"
    std::cout << myNickname << std::endl; // "Alex"
}{% endcapture %}
{% include code.html code=code lang="cpp" %}

In languages that don't support reference variables (e.g., JavaScript), two variables may share a copy of a value, but it's guaranteed that those variables will occupy different memory addresses. Here's an attempt at the above in JavaScript:

{% capture code %}let myName = "Aleksandr";
let myNickname = myName;

myNickname = "Alex";

console.log(myName); // "Aleksandr"
console.log(myNickname); // "Alex"{% endcapture %}
{% include code.html code=code lang="javascript" %}

On the second line, what I'm doing is creating a copy of the string `"Aleksandr"` and storing it in a new variable named `myNickname`<sup>1</sup>. These two variables occupy *different memory addresses*. Assigning a new value to one variable does not affect the value referred to by the other variable.

> <sup>1</sup>Experienced developers will note that even this explanation is not entirely accurate because strings cannot be "stored" in variables since they're not primitives. But this explanation is simple enough that it doesn't confuse beginners. We'll look at how strings are stored in memory in the section titled [How Are Objects Stored in Memory?](#how-are-objects-stored-in-memory).

Unlike a variable that receives a copy of a value, [a reference variable does not have its own memory address](https://stackoverflow.com/a/1950998/10480032)—it shares the same exact memory address as the original variable. Strange, isn't it? We can verify this in C++ using something called the address-of operator (`&`), which returns the memory address of a variable:

{% capture code %}#include <iostream>
#include <string>

int main()
{
    std::string myName = "Aleksandr";
    std::string &myNickname = myName;

    // Print the memory address of myName
    std::cout << &myName << std::endl;

    // Print the memory address of myNickname
    std::cout << &myNickname << std::endl;
}{% endcapture %}
{% include code.html code=code lang="cpp" %}

If you [run this code](http://cpp.sh/), you'll see that the same exact memory address is logged twice.

It's here that people will usually stop listening and claim that JavaScript does have true references, using objects to try to prove their point:

```javascript
let me = { name: 'Aleksandr' };
let alias = me;

alias.name = 'Alex';

console.log(me); // { name: 'Alex' }
console.log(alias); // { name: 'Alex' }
```

*Tada*... Right?

Nope. What we've done can be broken down into five simple steps:

1. We've allocated space in memory to store an object (`{ name: 'Aleksandr' }`).
2. We've created a variable named `me` that points to the memory address where this object resides.
3. We've created yet another variable, `alias`, that also points to the same memory address.
4. We can use either variable to modify the object at that memory address.
5. Since both variables point to the same memory address, any changes to the object at that location will be reflected when we "poll"<sup>2</sup> either variable in the future.

> <sup>2</sup>In other words, "interpreting" a pointer, or "visiting" the address that it points to in order to retrieve the data residing there. The proper term is **dereferencing a pointer**. As you can probably guess, I avoided using this term above because "dereference" once again muddies the terminology.

But these two variables, `me` and `alias`, do not share the same memory address on the stack. In other words, `alias` is not really a true "reference." We can easily prove this:

```javascript
let me = { name: 'Aleksandr' };
let alias = me;
alias = { name: 'Alex' };

console.log(me); // { name: 'Aleksandr' }
console.log(alias); // { name: 'Alex' }
```

If `alias` were a reference, then the change on line 3 *would've* been reflected in `me`. But it wasn't!

## "Object References" Are Pointers

Above, you may have noticed that I used the term "point" quite a lot, and one of my footnotes even mentioned something called a "pointer." What's up with that? What—pardon the awful pun—is the *point* I'm trying to get across?

<figure>
    {% include picture.html img="pointers.png" alt="Comic about pointers. Someone asks for pointers, and another person fires off a bunch of memory addresses." %}
    <figcaption>Source: <a href="https://xkcd.com/138/">xkcd</a></figcaption>
</figure>

We've established that JavaScript does not have references in the true sense of the term, even though that's the accepted shorthand when referring to "object references" in conversation. So what exactly are object references?

"Object references" in JavaScript are really **pointers**. A pointer is a variable that—instead of directly storing a primitive value like an `int`, `bool`, `float`, or `char`—stores the memory address where data resides. Pointers refer to data indirectly, using the addresses where those data can be found.

An analogy may help to illustrate this: A pointer is like keeping record of a person's home address instead of directly logging that person's information somewhere. If you later visit that address, you'll find *data* living there (a person with a name, age, and so forth). The person at that address may change their name, grow older with each passing year, or decide to leave the property and be replaced by another tenant with an entirely different name, age, and so on. As long as we point to the same address, we can visit it to find out what data (person) lives there. We may also one day decide to point to a completely different home address with different residents or, if we're the landlord, legally evict someone from their home.

{% include picture.html img="houses.png" alt="Two houses with two residents." %}

It may not be immediately obvious why we need pointers in the first place and how they're even relevant in JavaScript. This deserves some elaboration. If you're already familiar with pointers, feel free to skip forward to the section on [pass by value vs. pass by reference](#pass-by-value-vs-pass-by-reference).

### How Are Objects Stored in Memory?

Computers are good at one thing: Storing, retrieving, and manipulating **numbers**. That's it.

So what happens when we want to create data like objects, arrays, or strings in a programming language of our choice? How is that data stored if, for example, we have no "person" or "array" or "string" data type and computers can only store and retrieve numbers?

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

How on earth is it possible to cram all of this data into a single memory address? There's really no way to store `{ name: 'Bob', age: 42, country: 'USA' }` in one memory address as-is and call it a day because `{ name: 'Bob', age: 42, country: 'USA' }` is not a literal primitive value that a computer understands. So instead, we start at a particular memory address—called a base memory address—and begin storing these *pieces* of information in consecutive blocks. Then, `bob` points to that base memory address, such that we can work our way up later on and "reassemble" the pieces of information that we need, so to speak.

Strings in particular are really interesting because they may *seem* like a primitive data type only because words are the basic building blocks of the English language. But remember: Computers don't understand English, French, or Chinese; they're just concerned with numbers.

In reality, a string is made up of `char`s that are stored in consecutive memory addresses. Recall that in the ASCII standard, a `char` has an equivalent numerical representation:

{% include picture.html img="ascii.gif" alt="An ASCII character table." %}

On most modern computers, a `char` is 1 byte wide. As it so happens, a single memory address is also 1 byte wide. This means one memory address can potentially store one character. Translation? A string of length `n` can be stored in a computer's memory by allocating `n` consecutive bytes and storing one `char` in each, using its numerical representation:

{% include picture.html img="strings.png" alt="How strings are stored in memory." %}

Thus, our string "variable" is really a pointer to the first character of the string. Using **pointer arithmetic**, we can figure out what the string is since we already have the base address and the number of characters that were stored. In the example above, the first character was stored at address `0x1a09d68`. Unsurprisingly, the next character is located one byte away at address `0x1a09d69`.

The key takeaway here is that pointers are a fundamental tool in programming that exists in the implementation of nearly every language. Whether they are hidden from plain sight or made explicit by a special syntax is not important. What matters is that you understand how memory works and that most languages do not have "references."

## Pass by Value vs. Pass by Reference

Okay, we've established that "object references" in JavaScript are really pointers and that pointers are good at one thing: storing memory addresses. Objects reside at these memory addresses. We can visit those addresses and modify the objects that live there, or we can have a variable point to an entirely new object at some other location in memory.

With this background, we're ready to understand why pass by reference does not exist in JavaScript.

### What Is Pass by Reference?

We've learned what references really are: *aliases*. And as it turns out, this is precisely the kind of "reference" in "pass by reference."

First, understand what pass by reference does *not* mean:

> Pass by reference does NOT mean "We can pass in an object to a function, modify that object, and then observe the modified result even after the function returns."

In **pass by reference**, the formal parameter is a reference variable (alias) for the argument. It's almost like two functions have temporarily agreed to give a single object two names (one original and one alias) and to pretend that the two are equivalent. Or, in less accurate terms, you can think of it like a function "borrowing" a variable from another stack frame but calling it something else.

There's a classic **litmus test** to check if a language supports passing by reference: whether you can swap two numbers (the following is JavaScript):

{% capture code %}function swap(a, b) {
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
console.log(y); // 2{% endcapture %}
{% include code.html code=code lang="javascript" %}

Of course, if you run this in your browser, you'll find that `x` and `y` do not swap, whereas `a` and `b` do. This alone is proof that JavaScript does not support pass by reference. If it did support this mechanism, then `a` would be an alias for `x` and `b` would be an alias for `y`. Any changes to `a` and `b` would be reflected back to `x` and `y`, respectively. But they're not.

What happened here? The variables `a` and `b` are merely local to the stack frame of `swap` and receive copies of the values of the arguments that are passed in. This means that the values of `a, b` and `x, y` coincide because they are copies.

Here's a classic example of swapping integers by reference in C++:

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

### What Is Pass by Value?

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

When an argument is passed by value, the formal parameter receives a copy of the argument's value. The formal parameter and the argument are two different variables that happen to share the same value. The formal parameter is a local variable on the function's stack frame. The argument we passed in is a variable residing at a completely different memory address, in the caller's stack frame.

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

{% include picture.html img="pass-pointer-by-value.png" alt="Passing a pointer by value." %}

At that memory address is an object. We can "trace" (dereference) either the formal parameter pointer or the argument pointer and visit that memory address to modify the object located there. In the case of the code above, we're tracing the formal parameter pointer:

{% include picture.html img="modifying-object.png" alt="Modifying an object pointed to in memory." %}

What we cannot do is have the formal parameter point to a different location in memory and expect the argument to point to that new location once the function returns. This *would* be the case if the argument were passed in by reference. But JavaScript is pass by value!

{% include picture.html img="point-to-new-object.png" alt="Pointing the formal parameter to a new object." %}

Notice that within the scope of the `changeName` function, we can indeed observe that `person` points to this object: `{ name: 'Jane' }`. But of course, this doesn't affect the pointer argument—it's still pointing to the original location in memory, and the object there is left untouched.

## Summary: JavaScript Is Not Pass by Reference

Let's recap what we covered in this post:

1. What some languages call "object references" are really pointers. It helps to think of them as pointers explicitly so we don't confuse the term *reference* as it's used in "object reference" with how it's used in "pass by reference."
2. True references are aliases. The "reference" in "pass by reference" is about aliases, not "object references."
3. Pointers are variables that store data indirectly, by means of capturing the memory address where that data resides.
4. In pass by value, the formal parameters receive copies of the arguments' values.
5. In pass by reference, the formal parameters are aliases for the arguments that are passed in.
6. When we pass a pointer by value, the formal parameter receives a copy of the memory address to which the argument is pointing. This lets us modify the underlying object being pointed to.

And that about does it! I hope you now understand why JavaScript is pass by value and not pass by reference.
