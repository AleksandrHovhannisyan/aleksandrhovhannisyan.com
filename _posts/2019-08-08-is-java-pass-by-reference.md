---
title: Is Java Pass by Value or Pass by Reference?
img: No image yet
layout: post
excerpt: "Pass by reference versus pass by value: Which one does Java use? Let's clear this up for good."
keywords: [java pass by value vs pass by reference, pass by value vs pass by reference, does java pass by reference or value, java reference vs value, java pass by reference or value, java pass by value or reference example, pass by reference java, pass by value java, pass by reference vs pass by value, pass by value vs pass by reference]
permalink: /blog/:title/
---

There's a rite of passage that every beginner programmer must endure in their undergraduate studies: taking a programming fundamentals course that, more likely than not, uses Java as the supported language. And there's a nice little song that comes along with it, with practically every teacher singing it to their students:

> *"Primitives are passed by value; objects are passed by reference."*

Sounds simple enough to be true. But is it? Is Java pass by value or pass by reference?

The short answer is that Java uses **pass by value**. Cue the objections!

So what's the deal? And why do so many people seem to get it wrong?

## A Fundamental Misunderstanding... And Confusing Terminology

If there's one thing you should take away from this article, it's this:

> Passing **a** reference to a function is not the same thing as passing **by** reference.

The fact that Java uses the term "reference" when talking about "object references" does not imply that Java is "pass by reference." *This is the ultimate source of confusion!*

So what exactly are object references in Java? They're essentially pointers—with [a few minor differences](https://stackoverflow.com/a/7436674/10480032). If you're familiar with languages like C and C++, or if you've ever written code in assembly, then you're hopefully comfortable with pointers.

> **Note**: Thinking of Java references as pointers, while technically inaccurate, makes it much easier to talk about "passing references" and "pass by reference" without confusing the two. Wherever I use the term "pointer," feel free to substitute it with "reference" for Java.

The real problem is that people are rarely ever taught what pass by reference actually means. It does *not* mean "The ability to modify the underlying (referenced) object that is passed in to a function."

So what *does* it mean? I'm glad you asked.

## Prerequisite Terminology

Before we get to that, let's define two simple terms as they relate to functions, using the following Java snippet as a reference (*yep, that word's officially ruined*):

```java
public static void doSomething(int x) {
    // ... do something
}

public static void main(String[] args) {
    int y = 5;
    doSomething(y);
}
```

Here we go:

- A **formal parameter** (or simply parameter) is the local variable declared in a function's signature. It's like a placeholder for whatever the function accepts. Above, the only parameter is `x`.

- The "things" that actually get passed in to a function are called ***actual* arguments** (or simply arguments). Above, the argument in our call to `doSomething` is the variable `y`.

In practice, you'll hear the terms "parameter" and "argument" be used interchangeably, even though they're technically different. For the sake of clarity, I'll stick with these definitions throughout the rest of this article.

Now let's get to the good stuff.

## Pass by Value vs. Pass by Reference

Just as a reminder:

> Passing by reference does not mean "The ability to modify the underlying (referenced) object that is passed in to a function."

Let's formally define what we mean when we talk about pass by value vs. pass by reference.

### Passing by Value

In the simplest terms, **passing by value** is *copying*. When an argument is passed by value, the formal parameter receives a copy of the argument's contents. These are two distinct variables that happen to share the same value. The formal parameter is a local variable on the function's stack frame and is discarded when the function returns. Thus, any changes to the formal parameter itself—like forcing it to point to a new object—can only be observed within the scope of the function. The argument we passed in is a variable residing at a completely different memory address in the caller's stack frame, so it's unaffected.

Here's a diagram to illustrate passing primitives by value (I'm intentionally avoiding the case of passing references by value so you don't get confused—but don't worry, I *will* show you what that looks like):

![A diagram showing passing primitive values by value in Java.](/assets/img/posts/is-java-pass-by-reference/pass-by-value-primitives.PNG)

### Passing by Reference

A real **reference** (i.e., not Java's "reference") is an alias for a variable: another name for the same exact object. In that sense, a reference is not its own variable; it doesn't have its own distinct identity.

When an argument is **passed by reference**, the formal parameter is not a distinct variable on the function's stack frame. Indeed, it actually happens to occupy [the same exact memory address as the argument](https://stackoverflow.com/a/1950998/10480032) we just passed in. You can think of it as the function "borrowing" a variable from another stack frame if that helps you visualize it better.

Don't get mixed up, though: It's not as though we have two different variables that are somehow squeezed into a single memory address. It's just *one* object that happens to have *two different names*. Any changes to the formal parameter itself—such has having it point to a new object—*are* observable outside the function once it returns because the formal parameter *is* the argument, and vice versa.

If you've primarily worked with Java up until now, this notion of "aliases" may seem foreign to you. And that's because Java doesn't pass by reference :)

Below is a diagram of passing by reference. The sample code to the right is C++. If you don't know C++, don't worry: ignore the code and look at the figure instead.

![A diagram showing the basic concept of passing by reference.](/assets/img/posts/is-java-pass-by-reference/pass-by-reference.PNG)

**Side note**: You can safely ignore this, but for those who are curious: There is a difference between pass by reference and pass by pointer (argh!! so many types!). However, there's really no good way to show pass by reference without using arrows to denote some sort of shared object relationship (reference counting). The above code is pass by reference in C++, and the diagram is intended to reflect that, even though it's using arrow "pointers." References are usually implemented as an abstraction layer on top of pointers anyway, so it's not a big deal.

## The Misguided Objections (And Why They're Wrong)

People tend to bring up a classic counter-example like the following as "proof" that Java uses pass by reference (note: assume the `Person` class has been defined with all the methods and members you'd expect):

```java
class PassByReference {
    public static void doSomething(Person p) {
        p.setName("Jane");
    }

    public static void main(String[] args) {
        Person bob("Bob");
        doSomething(bob);
        System.out.println(bob.getName()); // Output: "Jane"
    }
}
```

*Aha! Now bob is named Jane. Surely this was pass by reference?* After all, if you tried the same thing with a primitive, you wouldn't be able to see the change outside the function.

In doing so, they forget the definition of passing something by reference and what it *doesn't* mean. Remember: Passing by reference does NOT mean "We can modify the object being referenced (pointed to)."

In the above example, we certainly do modify the object being referenced. So what? That doesn't mean it was pass by reference.

So then what's going on here? Why is it that we can modify the argument if it's an object reference, such as a `Person`, but not if it's a primitive (e.g., an `int`)?

### Passing References by Value: How it Works

Java's references—which we're calling pointers—are passed by value. Pointers in many other languages (such as C or C++) can indeed be passed by value, so this isn't something unique to Java.

A pointer is just a variable like any other: It stores a value. In the case of a pointer, though, that value is just the memory address of some object in memory:

![A diagram explaining what pointers are.](/assets/img/posts/is-java-pass-by-reference/pointers.PNG)

Variables can be passed by value. Pointers (and Java references) can be passed by value. So far so good? If not, re-read this section a couple times until it sinks in. *Pointers are variables*. They're not magic.

**This is the most important explanation**: Remember that when we pass any variable by value, the formal parameter simply receives a copy of that variable's value. That's why it's called pass by value, after all. So, when we pass a *pointer* by value, the formal parameter receives a copy of the pointer's value, just like with any other variable. And what is the pointer's value? It's the memory address of whatever object it points to:

![A diagram showing how references are passed by value in Java.](/assets/img/posts/is-java-pass-by-reference/pass-reference-by-value.PNG)

Thus, we end up having two distinct variables that point to the same object. Both can modify the object that they point to. But those two pointers are not the same. To be the same, they'd have to occupy the same memory address. They don't—they're on two different stack frames (as you can see above). One pointer is not an alias for the other.

What we did in the code above is pass a pointer by value. Since the pointer stores the memory address of an object, and the formal parameter receives a copy of that memory address, we can "travel" to the address and modify the contents of whatever object is being pointed to:

![A diagram showing object modification using references that are passed by value.](/assets/img/posts/is-java-pass-by-reference/pass-by-reference-modify.PNG)

What we *cannot* do is change the formal parameter to point to some other object and expect this change to be observable *outside* the function:

![A diagram showing reference reassignment in Java.](/assets/img/posts/is-java-pass-by-reference/point-to-something-else.PNG)

Let's repeat this one more time to hopefully make things clear, this time using the term "reference" as Java does so that you become comfortable with it in conversation:

The argument we passed in (the "original" reference) is not the same variable as the formal parameter (the "second" reference). When we force the formal parameter to reference some other object on the heap, we are in no way affecting the original object reference. So sure, you'll see this effect within the function for as long as it's the active stack frame because the formal parameter is a local variable like any other. But once the function returns, there's no way of observing that new object (unless of course we return it from the function). The second reference is destroyed, and the original reference is left intact, pointing to the same object that it always pointed to.

However, whether or not *the object being pointed to* has been left intact depends on what the function did: If it modified the object... Well, as we saw earlier, then the object will have been modified!

## (Optional) Advanced Example: Containers and Objects

This section is purely optional for those who are curious and want to learn something interesting (and useful!).

Let's say we have an array of object references, and we pass in that array to one of these three methods:

```java
public static void getScoobyGang(Person[] array) {
    // array = new People[]{new Person("Shaggy"), new Person("Scoobs"), new Person("Fred"), new Person("Daphne"), new Person("Velma")};
}

public static void sayGoodbyeToBob(Person[] array) {
    // array[0] = new Person("Definitely Not Bob");
}

public static void changeBobsName(Person[] array) {
    // array[0].setName("Bobicus Maximus");
}

public static void main(String[] args) {
    Person[] people = new Person[]{new Person("Bob"), new Person("Alice"), new Person("Jack")};
    // call one of the methods here
}
```

Assuming we uncomment those lines and don't chain the function calls, consider this question: Which of the above functions' effects will be visible in `main` once they return? Hover over the spoilers to reveal the answers:

- `getScoobyGang`: <span class="spoiler">FALSE—pointer reassignment has no effect.</span>
- `sayGoodbyeToBob`: <span class="spoiler">TRUE—the array's objects can be reassigned.</span>
- `changeBobsName`: <span class="spoiler">TRUE—the array's objects can be modified via their mutators.</span>

Feel free to run these tests on your end to verify the answers. That's the best way to learn!

And if you're still confused, let me explain; it's actually simpler than it seems.

In Java (and many other languages), **arrays are implemented using pointers**. Arrays themselves are not pointers, but at the hardware level, you find that there's really no notion of a "collection" or an array. Rather, arrays are implemented by allocating consecutive, equal-sized chunks of memory, starting at a base memory address. We then return a pointer to the first "chunk" and store that in the array variable. This is most evident when you're working with a language like C/C++ (or, again, assembly).

Then, if we have the starting address of the array, and we know how big each chunk is, we can use pointer arithmetic to obtain the first, second, third, fourth, and nth chunks (elements) of the array. Here's what that looks like:

![A diagram showing what arrays look like in memory.](/assets/img/posts/is-java-pass-by-reference/arrays.PNG)

With that in mind, if we think of arrays as pointers, the above answers should begin to make sense. Remember: Java is pass by value. So, if we pass the array by value, then we cannot force the argument to point to a different array once the function returns. We can certainly observe the new array within the scope of the function because the parameter is just a local variable like any other. But Java is not pass by reference, so the parameter is not an *alias* for the original array.

However, since we have the memory address of the array's first element (and, subsequently, all other elements), we can visit those memory addresses and modify the contents, just like we did before with individual pointers. In this special case, those array elements happen to themselves be objects. We can replace the old objects with new objects—like evicting someone from their home (the array "slot") and allowing someone else to move in. Likewise, we can modify those objects if they have any mutator methods. These two changes *will* persist after the function returns.

### An Interesting (Possibly Dangerous) Implication

If we pass an array of objects to a method, and we can have the array's elements point to new objects, and that change persists even after the function returns... Doesn't that mean we can simulate passing by reference?

**Yes**. And you can do that by [using an array of size one](https://stackoverflow.com/a/7884699/10480032). However, just because we *can* do this doesn't mean that we should. There's a reason why Java is pass by value: To prevent the accidental reassignment of objects within methods.

## Repeat After Me:

1. What Java calls "references" are essentially pointers, with some minor differences. Technically speaking, they're two different things. But it helps to think of them as pointers to avoid confusing the term *reference* as it's used in "object reference" with how it's used in "pass by reference." That's why people find this topic so difficult in the first place.

2. Java is pass by value. Java has no notion of passing by reference, even though it has "references." For examples of passing arguments by reference, see [this article by IBM](https://www.ibm.com/support/knowledgecenter/en/SSLTBW_2.3.0/com.ibm.zos.v2r3.cbclx01/cplr233.htm) (which uses C++).

3. Terminology needs to be precise to ensure that we're talking about the same thing. Java's `NullPointerReference` only makes things more confusing, unfortunately (thanks, Oracle).

## Further Reading

That was a *lot* to get through. If any of this is making sense, congratulations! If not, take some time to let it all sink in, and then re-read this post as many times as you need to.

Below are some additional resources that you may find useful on this subject:

- [C++ Pointers and References](https://www.ntu.edu.sg/home/ehchua/programming/cpp/cp4_pointerreference.html)

- [Java Theory and Practice – Whose Object Is It, Anyway?](https://www.ibm.com/developerworks/library/j-jtp06243/index.html)

- [Java Is Pass by Value and Not Pass by Reference](https://www.journaldev.com/3884/java-is-pass-by-value-and-not-pass-by-reference)

- [Is Java "pass-by-reference" or "pass-by-value"?](https://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value)

- [Java is Pass-by-Value, Dammit!](http://www.javadude.com/articles/passbyvalue.htm)

- [How can I simulate pass by reference in Java?](https://stackoverflow.com/questions/7884581/how-can-i-simulate-pass-by-reference-in-java)