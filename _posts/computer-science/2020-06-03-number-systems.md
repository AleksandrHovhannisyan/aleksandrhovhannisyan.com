---
title: 
description: 
keywords: []
tags: []
needs_latex: true
---

What does $$10$$ mean to you? Ten? Eight? Sixteen? If this is your first time learning about number systems, you may find this question absurd. Of course it's ten... Right?

Have you ever heard this corny developer joke?

> There are $$10$$ types of people in the world: those who understand binary and those who don't.

Numbers exist naturally in the real world, but they're also a somewhat abstract concept. And it's all about perspective.

## What Is a Number System?

It may be strange to think of number "systems" since we as humans have a default that we're taught in school as little kids and that we use as adults for the majority of our lives.

You are most familiar with the **decimal number system** (base $$10$$), also known as the **Arabic number system**, where the available digits are $$0$$ through $$9$$. We concatenate these digits to form numbers.

For example, in base $$10$$, the number $$579$$ is $$5 \times 10^2 + 7 \times 10^1 + 9 \times 10^0 = 500 + 70 + 9$$.

Here, the number $$10$$ is what we call the **base (aka radix)** of our number system. Notice the powers of $$10$$ in the expanded expression above?

## Ones Place, Tens Place, Hundreds Place...

As a little kid, you were taught that the $$5$$ in $$579$$ is in the "hundreds place," the $$7$$ is in the "tens place," and the $$9$$ is in the ones place. And indeed, in the expanded expression from earlier, we see that the $$5$$ is multiplied by one hundred ($$10^2$$), the $$7$$ by ten ($$10^1$$), and the $$9$$ by one ($$10^0$$) to form the decimal number $$579$$.

In the decimal number system, any given number is represented by entering the appropriate digits into "buckets" of increasing powers of ten, starting with $$10^0$$ on the right, followed by $$10^1$$ to the left, and so on infinitely. Any unused buckets to the far left have an implicit value of $$0$$ in them. Of course, in the decimal number system, we usually trim leading zeros because there is no use in saying $$00579$$ when that's identical to the simpler $$579$$.

The process is exactly the same for number systems that use a base other than ten.

## Bases and Exponents

Let's use a more general mathematical notation to represent a number system.

In a number system with a fixed base of $$b$$, the available digits range from $$0$$ to $$b - 1$$. For example, in the decimal ($$b = 10$$) system, we can only make use of the digits $$0, 1, 2, ..., 9$$.

Suppose that we have a string of digits $$d_1 d_2 \dots d_n$$, where $$n$$ just denotes the number of digits. This string is equivalent to the following expansion:

$$d_1 b^{n-1} + d_2 b^{n-2} + \dots + d_n b^0$$

For example, if $$b = 10$$ and we write out the string $$579$$, then $$d_1 = 5$$, $$d_2 = 7$$, and $$d_3 = 9$$. Here, $$n = 3$$ (there are three digits). Clearly, as we saw before, the expansion of $$579$$ matches the general notation above:

$$d_1 b^{n-1} + d_2 b^{n-2} + \dots + d_n b^0 = 5 \times 10^2 + 7 \times 10^1 + 9 \times 10^0$$

Again, we have buckets from left to right in descending powers of our base.

> **Fun fact**: The rightmost bucket will always be one in any number system. Why? Because any number raised to a power of $$0$$ is $$1$$.

But clearly, there is nothing stopping us from using a base other than $$10$$. Is it the one we default to as humans, having been born with ten fingers and ten toes? Yep! But that doesn't mean that it's the *only* number system in existence.

In reality, you can have a number system that uses a base of $$2$$, $$3$$, $$4$$, $$120,950$$, and so on! Some of these have special names because they're used more often than others:

[TODO TABLE]

> **Fun Fact**: Is it possible to use a base of $$1$$? Yep! It's called the **unary number system**, which is basically just a fancier term for "tallying." In this number system, any single character is chosen to represent the number $$1$$. To represent any number $$N$$ besides zero, simply repeat that character $$N$$ times (e.g., $$xxxx = 4$$).

For this reason, whenever we discuss number systems, we typically subscript a given number with its base. This would mean that we'd write $$579$$ as $$579_{10}$$, or the binary number $$1001$$ as $$1001_{2}$$. Otherwise, if we merely write the number $$1001$$ without providing any context, it's unclear whether this is in binary, octal, decimal, hexadecimal, and so on.

> **Note**: In all other contexts (that is, when you're not comparing number systems), it's safe to assume that a given number is in decimal, and thus the subscript is naturally omitted.

## The Binary Number System (Base 2)

The binary number system is especially interesting. By definition, it has a base of $$2$$, and thus we can only work with two digits to compose numbers: $$0$$ and $$1$$. Technically speaking, we don't call these digits—they're called **bits** in binary.

Each "bucket" or position in a string of bits represents a power of two. From right to left, those are $$2^0$$, $$2^1$$, $$2^2$$, and so on.

Let's look at some examples of representing our familiar decimal numbers in binary:

- $$0_10 = 0_2$$ (i.e., $$0 \times 2^0$$)
- $$1_10 = 1_2$$ (i.e., $$1 \times 2^0$$)
- $$2_10 = 10_2$$ (i.e., $$1 \times 2^1 + 0 \times 2^0$$)
- $$3_10 = 11_2$$ (i.e., $$1 \times 2^1 + 1 \times 2^0$$)
- $$4_10 = 100_2$$ (i.e., $$1 \times 2^2 + 0 \times 2^1 + 0 \times 2^0$$)
- $$5_10 = 101_2$$ (i.e., $$1 \times 2^2 + 0 \times 2^1 + 1 \times 2^0$$)

Hopefully you get the idea!

The joke from earlier should now make sense if you consider it from a binary perspective:

> There are $$10$$ types of people in the world: those who understand binary and those who don't.

Here, we've simply omitted the subscript for the sake of humor, making it seem like "ten" when we really mean the binary equivalent of two: $$10_2 = 1 \times 2^1 = 2_{10}$$.

### Binary Is Close to the Hardware of a Computer

Why do we bother with using binary in the first place? Doesn't it seem like a whole lot of extra work to represent numbers in this manner when we could instead use decimal? Well, yes—if you're doing the work by hand.

You may not see any point in using binary if you haven't learned about computer architecture at a low level. Internally, computers are nothing more than electrical circuits tied to hardware. Current either flows through a wire or doesn't—a **binary state**. The best way to represent this with number systems is to use binary: $$0$$ means OFF (or `false` in its Boolean form) and $$1$$ means ON (or `true`).

> **Note**: If the whole world were to agree to it, we could just as well instead treat $$0$$ as ON and $$1$$ as OFF. However, it just makes more sense to treat $$0$$ as OFF/false—after all, zero denotes the absence of value. Hence, it's a natural candidate for representing things like falsehood or the lack of a current flowing through a wire.

Everything on your computer—the files you save and the software you install—is, at the lowest level, represented as nothing more than zeros and ones. But how is this possible?

### The ASCII Standard

Suppose you create a file on your computer and store some basic text in it:

{% capture code %}echo Hello, Binary > file{% endcapture %}
{% include code.html code=code lang="bash" %}

At the end of the day, your computer can't store a character like `H`, `e`, `l`, or `o`(or even the space between two words) *literally*. Computers only know how to work with *binary*. Thus, we need some way to convert these characters to numbers. And that's why the ASCII standard was introduced.

**ASCII** is a "character encoding standard." Put more simply, it's an agreed-upon method for representing human-readable characters like `H`, `e`, `,`, `?`, and `9` numerically so that computers can understand and use them.

Here is a typical ASCII chart that you may have seen already:

[TODO]

In the ASCII standard, there are a total of 128 characters, each mapped to a unique number in binary (with an equivalent representation in decimal that we humans understand more naturally):

- Arabic digits: `0-9` (10)
- Capital letters of the English alphabet: `A-Z` (26)
- Lowercase letters of the English alphabet: `a-z` (26)
- Punctuation and special characters (66)

### 1 Character = 1 Byte

In the decimal number system, we're used to working with digits. In binary, as we already saw, we're used to working with **bits**. There's another special group of digits in binary that's worth mentioning: A sequence of eight bits is called a **byte**.

Here are some examples of valid bytes:

- $$00000000$$
- $$10000000$$
- $$11101011$$
- $$11111111$$

And any other permutation you can think of.

Why am I mentioning this? **Because characters are represented using bytes**.

Recall that the ASCII standard needs to support a total of **128 characters**.

How many unique number can we represent with 8 bits (a byte)?

Well, using the product rule from combinatorics, we have eight buckets, each with two possible values: either $$0$$ or $$1$$. Thus, we have $$2 \times 2 \times \dots \times 2 = 2^8$$ possible values.

In decimal, this is $$2^8 = 256$$. By comparison, $$2^7 = 128$$.

So... Why do we use a byte to represent characters when we could instead use groups of $$7$$ bits to store precisely the number of characters that we need (128)?

Good question! The answer is simply because it's not possible to evenly divide a group of $$7$$ bits, making certain arithmetic difficult if we decide to use $$7$$ bits to represent a character. In contrast, groups of $$8$$ bits can be evenly divided into powers of two:

- $$11101011$$
- $$1110 1011$$
- $$11 10 10 11$$

Why we would need to do this is not important to understand right now. The key takeaway here is that we only need one byte to store one character on a computer. A string of five characters—like `Hello`—can be stored using five sequential bytes, with each byte being the numerical representation of the corresponding character in the ASCII standard.

Remember the file we created earlier? Let's view its binary representation using the `xxd` Unix tool:

{% capture code %}xxd -b file{% endcapture %}
{% include code.html code=code lang="bash" %}

The `-b` flag stands for binary. Here's the output:

```
00000000: 01001000 01100101 01101100 01101100 01101111 00101100  Hello,
00000006: 00100000 01000010 01101001 01101110 01100001 01110010   Binar
0000000c: 01111001 00001010                                      y.
```

The first line shows a sequence of six bytes, each corresponding to one character in `Hello,` (shown on the right-hand side).

Let's decode the first two bytes by hand and use our ASCII lookup table from before:

- $$01001000 = 1\times 2^6 + 1 \times 2^3 = 72_{10}$$. Per our ASCII table, this corresponds to `H`.
- $$01100101 = 1 \times 2^6 + 1 \times 2^5 + 1 \times 2^2 + 1 \times 2^0 = 101_{10}$$, which is `e` in ASCII.

Cool! Looks like the logic pans out. You can repeat this for all of the other bytes as well. Notice that on the second line, we have a leading space (from `Hello, Binary`), represented as $$2^5 = 32_{10}$$ in ASCII (which is indeed `Space` per the lookup table!).

By the way, what's up with the numbers along the left-hand side of the output? What does `0000000c` even mean? Time to introduce another important number system for computers!

## The Hexademical Number System (Base 16)


## Internet Speed and Disk Space

## Representing Floating Point Numbers

## Rounding Errors

## Bit Shifting

## Representing Characters with Numbers

## Two's complement

## Converting Binary to Decimal/Hex and Back

## Colors and RGB/Hex

## How Many Numbers Are There?

## What's the Largest Number with X digits?