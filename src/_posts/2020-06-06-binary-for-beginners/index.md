---
title: "Binary for Beginners: The ABCs of 0s and 1s"
description: The binary number system underlies everything in computation and software. But what's the deal with all those 0s and 1s?
keywords: [binary number system, binary numbers]
categories: [computer-science, math, binary]
commentsId: 44
lastUpdated: 2022-07-23
thumbnail: ./images/thumbnail.png
layout: mathPost
---

What is $10$? If this is your first time learning about the binary number system, then this question may seem odd. Of course it's ten, right?

Let's try something different. Have you ever heard this joke?

> There are $10$ types of people: those who understand binary and those who don't.

Unless you're familiar with binary numbers, this probably doesn't make much sense. But by the end of this article, you'll understand this awful joke!

In this beginner's tutorial, we'll look at everything you need to know about the binary number system, but we'll also take a quick look at decimal and hexadecimal, as they're closely related. I'll include relevant bits of code and real-life examples to help you appreciate the beauty of binary.

{% include toc.md %}

## What Is a Number System?

Before we look at binary, let's take a step back and discuss number systems more generally.

It may seem strange to think of number *systems* in the plural if this is your first time learning about them. That's because the majority of the world is familiar with just one system: the **decimal number system**, also known as the **Arabic number system**. This number system uses the digits $0–9$ to represent numbers symbolically, based on their position in a string.

For example, in the decimal number system, $579$ expands to this:

$$
579 = 5(10^2) + 7(10^1) + 9(10^0) = 500 + 70 + 9
$$

In school, you were taught that the $5$ in $579$ is in the hundredths place, the $7$ is in the tens place, and the $9$ is in the ones place. Notice that the $5$ is multiplied by one hundred ($10^2$), the $7$ by ten ($10^1$), and the $9$ by one ($10^0$) to form the decimal number $579$. We say that the number $579$ is *positional* because the digits, from left to right, correspond to a specific power of ten based on the position of the digit in the number.

Here, the number $10$ is what we call the **base** (aka **radix**) of our number system. Notice the powers of $10$ in the expanded expression above: $10^2$, $10^1$, and $10^0$. For this reason, the terms *decimal* and *base ten* are interchangeable.

In the decimal number system, a number is represented by placing digits into "buckets" that represent **increasing powers of ten**, starting with $10^0$ in the rightmost "bucket," followed by $10^1$ to its immediate left, and so on infinitely:

{% include postImage.html src: "./images/decimal-number-system.png", alt: "Increasing powers of ten from right to left, represented as square slots. From right to left, they are labeled: 10^0 (ones), 10^1 (tens), 10^2 (hundredths), and so on." %}

Any unused buckets to the far left have an implicit value of $0$ in them. We usually trim leading zeros because there is no use in saying $00579$ when that's mathematically identical to $579$.

Why did humans pick $10$ to be the base of their preferred number system? Likely because most people are born with ten fingers and ten toes, and we're used to counting with our fingers when we're young. So it's natural for us to have adopted ten as the base of our number system.

### Bases, Exponents, and Digits

As I've already hinted, the decimal number system (base $10$) isn't the only one in existence. Let's use a more general notation to represent number systems beyond just our familiar one.

In a number system with a fixed base of $b$, the available digits range from $0$ to $b - 1$. For example, in the decimal number system ($b = 10$), we can only use the digits $0, 1, 2, ..., 9$. When you run out of digits to stuff into a single bucket, you carry over a one to the next power of the base. For example, to get to the number after $99$, you carry a one to the bucket representing the next power of ten ($100$).

Now, suppose that we have a string of digits $d_{n-1} d_{n-2} ... d_0$ (where $n$ is the number of digits). Maybe that's $d_2 d_1 d_0 = 579$ from our earlier example. That string expands like this:

$$
d_{n-1} b^{n-1} + d_{n-2} b^{n-2} + ... + d_{0} b^0
$$

And you can visualize it like this:

{% include postImage.html src: "./images/bases.png", alt: "Rectangles arranged side by side representing increasing powers of a generic base of b, with digits represented as d_0 through d_{n-1}." %}

Using our same example, $d_{n-1} b^{n-1} + d_{n-2} b^{n-2} + ... + d_{0} b^0 = 5(10^2) + 7(10^1) + 9(10^0)$. Again, we have buckets from right to left in increasing powers of our base ($10$), as depicted below:

{% include postImage.html src: "./images/579.png", alt: "Expanding 579 in terms of powers of 10. The 5 goes in the hundredths bucket, the 7 in the tens bucket, and the 9 in the ones bucket." %}

{% aside %}
  **Note**: The rightmost bucket, $b^0$, will always represent $d_0$ in any number system because any base raised to the power of $0$ is just $1$.
{% endaside %}

Now, in reality, you can have a number system that uses a base of $2$, $3$, $4$, $120$, and so on. Some of these have special names because they're used more often than others:

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col" class="numeric">Base</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td class="numeric">1</td>
            <td>Unary</td>
            <td>Also known as tallying. A number <code>n</code> is represented by picking an arbitrary character and repeating it <code>n</code> times (e.g., <code>xxxx</code> would be <code>4</code>).</td>
        </tr>
        <tr>
            <td class="numeric">2</td>
            <td>Binary</td>
            <td>Only two digits: zero and one. Most commonly used in computing. Everything on a computer is, at the lowest possible level, stored using the binary number system.</td>
        </tr>
        <tr>
            <td class="numeric">8</td>
            <td>Octal</td>
            <td>Only eight digits are available: <code>0–7</code>.</td>
        </tr>
        <tr>
            <td class="numeric">16</td>
            <td>Hexadecimal</td>
            <td>Fifteen digits: <code>0–9</code> and <code>a–f</code>. Often used to express binary strings more compactly.</td>
        </tr>
        <tr>
            <td class="numeric">60</td>
            <td>Sexagesimal</td>
            <td>How many seconds are in a minute? How many minutes in an hour? This is the basis of the modern circular coordinate system (degrees, minutes, and seconds).</td>
        </tr>
    </tbody>
  </table>
</div>

For this reason, when discussing number systems, we usually subscript a number with its base to clarify its value. Alternatively, you can prepend a number with a certain string (usually `0b` for binary or `0x`/`#` for hexadecimal). So we'd write $579$ as $579_{10}$, or the binary number $1001$ as $1001_2$ (or $\text{0b}1001$). Otherwise, if we were to merely write the number $1001$ without providing any context, nobody would know whether that's in binary, octal, decimal, hexadecimal, and so on because the digits $0$ and $1$ are valid in all of those number systems, too!

{% aside %}
  **Note**: When not comparing number systems, we usually assume that a given number is in decimal unless otherwise noted, and thus the subscript is omitted.
{% endaside %}

## The Binary Number System

We're all familiar with decimal numbers because we use them everyday. But what about the binary number system?

By definition, the **binary number system** has a base of $2$, and thus we can only work with two digits to compose numbers: $0$ and $1$. Technically speaking, we don't call these digits—they're called **bits** in binary lingo. Each "bucket" in a binary string represents an increasing power of two: $2^0$, $2^1$, $2^2$, and so on.

{% include postImage.html src: "./images/binary-number-system.png", alt: "Increasing powers of two from right to left, represented as square slots. From right to left, they are labeled: 2^0 (ones), 2^1 (twos), 2^2 (fours), and so on." %}

The leftmost bit is called the **most significant bit (MSB)**, while the rightmost bit is called the **least significant bit (LSB)**.

Here are some examples of representing decimal numbers in the binary number system:

- Zero: $0_{10} = 0_2$. Expansion: $0 (2^0)$
- One: $1_{10} = 1_2$. Expansion: $1(2^0)$
- Two: $2_{10} = 10_2$. Expansion: $1(2^1) + 0(2^0)$
- Three: $3_{10} = 11_2$. Expansion: $1(2^1) + 1(2^0)$
- Four: $4_{10} = 100_2$. Expansion: $1(2^2) + 0(2^1) + 0(2^0)$
- Five: $5_{10} = 101_2$. Expansion: $1(2^2) + 0(2^1) + 1(2^0)$

{% aside %}
  **Note**: Like in the decimal number system, leading zeros are usually stripped from binary strings. The only exception is if you're working with [a signed binary number system](#signed-binary-number-system-twos-complement), where a leading zero indicates that a number is positive and a leading one indicates that it's negative.
{% endaside %}

Having learned the binary number system, you should now understand the joke from earlier:

> There are $10$ types of people: those who understand binary and those who don't.

Here, we really mean the binary equivalent of two, which *looks* like ten to our eyes when it's not properly subscripted: $10_2 = 1 × 2^1 = 2_{10}$.

### Binary Is Close to the Hardware of a Computer

Why do we bother with using the binary number system in the first place? Doesn't it seem like a whole lot of extra work to represent numbers in this manner when we could instead use the decimal number system? Well, yes—if you're writing these out by hand, it's certainly more work to represent (and manipulate) binary numbers.

You may not see any point in using binary if you haven't learned about computer architecture at a low level. Internally, computers are nothing more than electrical circuits tied to hardware. Current either flows through a wire or doesn't—a **binary state**. Likewise, computers use **logic gates** (AND/OR/NOR/XOR) to control the flow of a program's execution, and these take binary inputs (`true`/`false`). The best way to represent these low-level interactions is to use the binary number system: $0$ means "off" (or `false` in its boolean form) and $1$ means "on" (`true`).

{% aside %}
  **Note**: If the whole world were to agree to it, we could just as well instead treat $0$ as "on" and $1$ as "off." However, it just makes more sense to treat $0$ as off/false—after all, zero denotes the absence of a value. Hence, it's a natural candidate for representing things like falsehood or the lack of a current flowing through a wire.
{% endaside %}

Everything on your computer—the files you save and the software you install—is represented as nothing more than zeros and ones. But how is this possible?

### The Unicode Standard

Suppose you create a file on your computer and store some basic text in it:

```bash {data-copyable=true}
echo Hello, Binary > file
```

At the end of the day, your computer can't store a character like `H`, `e`, `l`, or `o` (or even the space between two words) *literally*. Computers only know how to work with *binary*. Thus, we need some way to convert these characters to numbers. And that's why the Unicode standard was introduced.

Unicode is the most widely accepted **character encoding standard**: a method of representing human-readable characters like `H`, `e`, `,`, `?`, and `9` numerically so that computers can understand and use them like we do. Each character maps to a unique number known as a *code point*.

For example, the chart below shows a very limited subset of Unicode characters (known as the ASCII standard) and their corresponding code points:

{% include postImage.html src: "./images/ascii.gif", alt: "An ASCII table showing characters and their numerical representations" %}

For the sake of brevity, we'll focus on just the ASCII standard for now, even though it doesn't capture the full range of characters in the Unicode standard and the complexities that come with needing to support hundreds of thousands of characters.

The ASCII standard supports only 128 characters, each mapped to a unique number:

- Arabic digits: $0-9$ (10)
- Uppercase Latin letters: $A-Z$ (26)
- Lowercase Latin letters: $a-z$ (26)
- Punctuation and special characters (66)

Again, note that while the ASCII standard only allows us to represent a tiny fraction of Unicode characters, it's simple enough that it can help us better understand how characters are stored on computers.

### 1 ASCII Character = 1 Byte

In the decimal number system, we're used to working with digits. In binary, as we already saw, we're used to working with **bits**. There's another special group of digits in binary that's worth mentioning: A sequence of eight bits is called a **byte**.

Here are some examples of valid bytes:

```
00000000
10000000
11101011
11111111
```

... and any other valid permutation of eight $0$s and $1$s that you can think of.

Why is this relevant? Because on modern computers, **characters are represented using bytes**.

Recall that the ASCII encoding format needs to support a total of **128 characters**. So how many unique number can we represent with $8$ bits (a byte)?

Well, using the product rule from combinatorics, we have eight "buckets," each with two possible values: either a $0$ or a $1$. Thus, we have $2 × 2 × ... × 2 = 2^8$ possible values.

In decimal, this is $2^8 = 256$ possible values. By comparison, $2^7 = 128$. And $128$ happens to be the number of characters that we want to represent.

So... That's weird, and seemingly wasteful, right? Why do we use $8$ bits (one byte) to represent a character when we could use $7$ bits instead and meet the precise character count that we need?

Good question! We use bytes because **it's not possible to evenly divide a group of $7$ bits**, making certain low-level computations difficult if we decide to use $7$ bits to represent a character. In contrast, a byte can be evenly split into powers of two:

```
11101011
[1110][1011]
[11][10][10][11]
```

The key takeaway here is that we only need one byte to store one character on a computer. This means that a string of five characters—like `Hello`—occupies five bytes of space, with each byte being the numerical representation of the corresponding character per the ASCII format.

Remember the file we created earlier? Let's view its binary representation using the `xxd` Unix tool:

```bash {data-copyable=true}
xxd -b file
```

The `-b` flag stands for binary. Here's the output that you'll get:

```
00000000: 01001000 01100101 01101100 01101100 01101111 00101100  Hello,
00000006: 00100000 01000010 01101001 01101110 01100001 01110010   Binar
0000000c: 01111001 00001010                                      y.
```

The first line shows a sequence of six bytes, each corresponding to one character in `Hello,`.

Let's decode the first two bytes using our knowledge of the binary number system and ASCII:

- $01001000 = 1(2^6) + 1(2^3) = 72_{10}$. Per our ASCII table, this corresponds to $H$.
- $01100101 = 1(2^6) + 1(2^5) + 1(2^2) + 1(2^0) = 101_{10}$, which is $e$ in ASCII.

Cool! Looks like the logic pans out. You can repeat this for all of the other bytes as well. Notice that on the second line, we have a leading space (from `Hello, Binary`), represented as $2^5 = 32_{10}$ in ASCII (which is indeed `Space` per the table).

{% aside %}
As a reminder, this was a highly simplified discussion of how characters are stored on modern computers. In reality, we cannot store every possible Unicode character in just a single byte because there are far more than $256$ characters in Unicode. For example, the UTF-16 standard stores characters in two-byte chunks.
{% endaside %}

By the way, what's up with the numbers along the left-hand side of the output? What does $0000000c$ even mean? Time to explore another important number system!

## The Hexademical Number System

As I mentioned in the table from earlier, the hexadecimal number system is closely related to binary because it's often used to express binary numbers more compactly, instead of writing out a whole bunch of zeros and ones.

The **hexadecimal number system** has a base of $16$, meaning its digits range from $0–15$.

{% aside %}
  **Note**: In technical terms, a hexadecimal digit is called a **nibble**, but you'll commonly hear people just call them "hex digits."
{% endaside %}

This is our first time encountering a number system whose digits are made up of more than two characters. How do we squeeze $10$, $11$, or $15$ into a single "bucket" or "slot" for a digit? To be clear, **this is perfectly doable** if you have clear delimiters between digits, like vertical lines—without which you wouldn't know if $15$ is a one followed by a five or a single digit of $15$ in the ones place. But in reality, using delimiters isn't practical.

Let's take a step back and consider a simple hexadecimal number:

$$
0x42
$$

What does this mean to us humans in our decimal number system? Well, all we have to do is multiply each digit by its corresponding power of $16$:

$$
0x42 = 4(16^1) + 2(16^0) = 64_{10} + 2_{10} = 66_{10}
$$

Okay, so that's a simple hex number. Back to the problem at hand: How do we represent the hex digits $10$, $11$, and so on? Here's an example that's pretty confusing unless we introduce some alternative notation:

$$
0x15
$$

Is this a $15$ in a single slot or a $1$ and a $5$ in two separate slots? One way to make this less ambiguous is to use some kind of delimiter between slots, but again, that's not very practical:

$$
0x8[15]29
$$

The better solution that people came up with is to map $10–15$ to the the English letters $a–f$. Note that we could've also used any other symbols to represent these digits. As long as we agree on a convention and stick with it, there's no ambiguity as to what a number represents.

{% aside %}
  **Note**: Capitalization doesn't matter, so you can use $a-f$ or $A-F$. Just be consistent.
{% endaside %}

Here's an example of a hexadecimal number that uses one of these digits:

$$
0xf4
$$

And here's its expansion:

$$
0xf4 = 15(16^1) + 4(16^0) = 240_{10} + 4_{10} = 244_{10}
$$

There's nothing magical about the hexadecimal number system—it works just like unary, binary, decimal, and others. All that's different is the base!

Before we move on, let's revisit the output from earlier when we used `xxd` on our sample file:

```
00000000: 01001000 01100101 01101100 01101100 01101111 00101100  Hello,
00000006: 00100000 01000010 01101001 01101110 01100001 01110010   Binar
0000000c: 01111001 00001010                                      y.
```

The numbers along the left-hand side mark the starting byte for each line of text on the far right. For example, the first line of text (`Hello,`) ranges from byte #0 (`H`) to byte #5 (`,`). The next line is marked as $00000006$, meaning we're now looking at bytes #6 through 11 (`B` to `r`). Finally, the last label should make sense now that you know the hexadecimal number system: `c` maps to $12$, meaning the byte that follows corresponds to the twelfth character in our file.

### How to Convert Between Binary and Hexadecimal

Now that we know a bit about binary and hexadecimal, let's look at how we can convert between the two systems.

#### Binary to Hexadecimal

Say you're given this binary string and you'd like to represent it in hexadecimal:

$$
011011100101
$$

While at first this may seem like a pretty difficult task, it's actually straightforward!

Let's do a bit of a thought exercise: In the hexadecimal number system, we have $16$ digits from $0$ to $15$. Over in binary land, how many bits do we need to represent these $16$ values?

The answer is four because $2^4 = 16$. With four "buckets," we can create the numbers zero ($0000$), one ($0001$), ten ($1010$), all the way up to fifteen ($1111$). This means that when you're given a binary string, all you have to do is **split it into groups of four bits** and evaluate them to convert binary to hexadecimal!

```
011011100101
[0110][1110][0101]
6 14 5
```

Now we just replace $10–15$ with $a-f$ and we're done: $0x6e5$.

#### Hexadecimal to Binary

What about the reverse process? How do you convert a hexadecimal number to binary? Say you're given the hexadecimal number $0xad$. What do we know about each hexadecimal digit?

Well, from our earlier exercise, we know that four bits comprise one hex digit. So we can convert each individual hex digit to its $4$-bit representation and then stick each group together!

$$
a_{16} = 10_{10} = 1010_{2} \\
d_{16} = 13_{10} = 1101_{2} \\
ad_{16} = 10101101_{2}
$$

### Real-World Application: Colors in RGB/Hex

While we're on the topic of binary and hexadecimal, it's worth taking a look at one real-world use case for the things we've learned so far: **RGB and hex colors**.

Colors have three components: red, green, and blue (RGB). With LED (light-emitting diode) displays, each pixel is really split into these three components using a color diode. If a color component is set to $0$, then it's effectively turned off. Otherwise, its intensity is modulated between $0$ and $255$, giving us a color format like `rgb(0-255, 0-255, 0-255)`.

Let's consider this hex color: `#4287f5`. What is it in the RGB format?

Well, we need to split this hex string evenly between red, green, and blue. That's two digits per color:

$$
[42][87][f5]
$$

Now, we interpret the decimal equivalent for each part:

- **Red**: $42_{16} = 4(16^1) + 2(16^0) = 66$
- **Green**: $87_{16} = 8(16^1) + 7(16^0) = 135$
- **Blue**: $f5_{16} = 15(16^1) + 5(16^0) = 245$

That means `#4287f5` is really `rgb(66, 135, 245)`! You can verify this using a [Color Converter](https://www.w3schools.com/colors/colors_converter.asp):

{% include postImage.html src: "./images/color-converter.png", alt: "A color converter verifying that #4287f5 is really rgb(66, 135, 245)" %}

For practice, let's convert this to binary as well. I'll mark the groups of four bits to make it easier to see how I did this (you could also convert from the decimal RGB representation if you want to):

$$
0x4287f5 = 0b[0100][0010][1000][0111][1111][0101]
$$

Now, two groups of four bits will represent one component of the color (red/green/blue):

$$
0b[01000010][10000111][11110101]
$$

Notice that each color *component* takes up a byte ($8$ bits) of space.

#### How Many Colors Are There?

As an additional exercise, how many unique colors can you possibly have in the modern RGB format?

We know that each component (red/green/blue) is represented using one byte ($8$ bits). So the colors we're used to are really $24$-bit colors.

That means there are a whopping $2^{24} = 16,777,216$ possible unique colors that you can generate using hex/rgb! The $24$-bit color system is known as **truecolor**, and it's capable of representing millions of colors.

Note that you could just as well have performed this calculation using hex: `#4287f5`. There are six slots, each capable of taking on a value from $0$ to $f$. That gives us a total of $16 × 16 × ... × 16 = 16^6 = 16,777,216$ values—the same result as before.

Or, if you're using the decimal RGB format, the math still pans out:

$$
256 × 256 × 256 = 16,777,216
$$

#### What Are 8-Bit Colors?

On older systems with limited memory, colors were represented using just eight bits (one byte). These **8-bit colors** had a very limited palette, which meant that most computer graphics didn't have gradual color transitions (so images looked very pixelated/grainy). With only $8$ bits to work with, you are limited to just $2^8 = 256$ colors!

{% include postImage.html src: "./images/8-bit.png", alt: "An 8-bit color palette" %}

Naturally, you may be wondering: How did they split $8$ bits evenly among red, green, and blue? After all, $8$ isn't divisible by three!

Well, the answer is that *they didn't*. The process of splitting these bits among the color components is called [color quantization](https://en.wikipedia.org/wiki/8-bit_color#Color_quantization), and the most common method (known as **8-bit truecolor**) split the bits as 3-3-2 red-green-blue. Apparently, this is because the human eye is less sensitive to blue light than the other two, and thus it simply made sense to distribute the bits heavily in favor of red and green and leave blue with one less bit to work with.

## Signed Binary Number System: Two's Complement

Now that we've covered decimal, binary, and hexadecimal, I'd like us to revisit the binary number system and learn how to represent negative numbers. Because so far, we've only looked at positive numbers. How do we store the negative sign?

To give us some context, I'll assume that we're working with standard $32$-bit integers that most computers support. We could just as well look at $64$-bit or $N$-bit integers, but it's good to have a simple basis for a discussion.

If we have $32$ bits to fiddle with, that means we can represent a total of $2^{32} = 4,294,967,296$ (4 billion) numbers. More generally, if you have $N$ bits to work with, you can represent $2^N$ values. But we'd like to split this number range evenly between negatives and positives.

Positive or negative... positive or negative. One thing or another thing—ring a bell? That sounds like it's binary in nature. And hey—we're already using binary to *store* our numbers! Why not reserve just a single bit to represent *the sign*? We can have the most significant (leading) bit be a $0$ when our number is positive and a $1$ when it's negative!

{% aside %}
  **Note**: This is once again one of those situations where you could just as well do the opposite, except you'd have to convince the whole world to follow your chosen convention.
{% endaside %}

Earlier, when we were first looking at the binary number systems, I mentioned that you can strip leading zeros because they are meaningless. This is true except when you actually care about distinguishing between positive and negative numbers in binary. Now, we need to be careful—if you strip all leading zeros, you my be left with a leading $1$, and that would imply that your number is negative (in a signed number system).

You can think of two's complement as a new *perspective* or lens through which we look at binary numbers. The number $100_2$ ordinarily means $4_{10}$ if we don't care about its sign (i.e., we assume it's **unsigned**). But if we do care, then we have to ask ourselves (or whoever provided us this number) whether it's a signed number.

### How Does Two's Complement Work?

What does a leading $1$ actually represent when you expand a signed binary number, and how do we convert a positive number to a negative one, and vice versa? For example, suppose we're looking at the number $22_{10}$, which is represented like this in unsigned binary:

$$
10110_2
$$

Since we're looking at signed binary, we need to pad this number with an extra $0$ out in front (or else a leading $1$ would imply that it's negative):

$$
010110_2
$$

Okay, so this is positive $22_{10}$. How do we represent $-22_{10}$ in binary?

There are two ways we can do this: the intuitive (longer) approach and the "shortcut" approach. I'll show you both, but I'll start with the more intuitive one.

#### The Intuitive Approach: What Does a Leading 1 Denote?

Given an $N$-bit binary string, a leading $1$ in two's complement represents $-1$ multiplied by its corresponding power of two ($2^{n-1}$). A digit of $1$ in any other slot represents $+1$ times its corresponding power of two.

For example, the signed number $11010_2$ has this expansion:

$$
11010_2 = -1(2^4) + 1(2^3) + 1(2^1) = -16_{10} + 8_{10} + 2_{10} = -6_{10}
$$

We simply treat the leading $1$ as a negative, and that changes the resulting sum in our expansion.

#### Two's Complement Shortcut: Flip the Bits and Add 1

To convert a number represented in two's complement binary to its opposite sign, follow these two simple steps:

1. Flip all of the bits ($0$ becomes $1$ and vice versa).
2. Add $1$ to the result.

For example, let's convert $43_{10}$ to $-43_{10}$ in binary:

```
+43 in binary: 0101011
Flipped:       1010100
Add one:       1010101
```

What is this number? It should be $-43_{10}$, so let's expand it by hand to verify:

$$
-1(2^6) + 1(2^4) + 1(2^2) + 1(2^0) = -64_{10} + 16_{10} + 4_{10} + 1_{10} = -43
$$

Sure enough, the process works!

#### How Many Signed Binary Numbers Are There?

We've seen that in a signed binary system, the most significant bit is reserved for the sign. What does this do to our number range? Effectively, it halves it!

Let's consider $32$-bit integers again. Whereas before we had $32$ bits to work with for the magnitude of an unsigned number, we now have only $31$ for the magnitude of a signed number (because the 32nd bit is reserved for the sign):

```
Unsigned magnitude bits:  [31 30 29 ... 0]
Signed magnitude bits:    31 [30 29 ... 0]
```

We went from having $2^{32}$ numbers to $2^{31}$ positive and negative numbers, which is precisely half of what we started with ($\frac{2^{32}}{2} = 2^{31}$).

More generally, if you have an $N$-bit signed binary string, there are going to be $2^N$ values, split evenly between $2^{n-1}$ positives and $2^{n-1}$ negatives.

Notice that the number zero gets bunched in with the positives and not the negatives:

```
Signed zero:  0  0  0  0 ... 0 0 0 0
Bits:        31 30 29 28 ... 3 2 1 0
```

As we're about to see, this has an interesting consequence.

#### What Is the Largest Signed 32-bit Integer?

The largest signed 32-bit integer is positive, meaning its leading bit is a zero. So we just need to maximize the remaining bits to get the largest possible value:

```
Num:      0  1  1  1 ... 1
Bits:    31 30 29 28 ... 0
```

This is $2^{31} - 1$, which is $2,147,483,647$. In Java, this number is stored in `Integer.MAX_VALUE`, and in C++, it's `std::numeric_limits<int>::max()`.

More generally, for an $N$-bit system, the largest signed integer is $2^{n-1}-1$.

Why did we subtract a one at the end? Because we start counting at one, but computers start at zero. As I mentioned in the previous section, the number zero gets grouped along with the positives when we split our number range (by convention):

```
Signed zero:  0  0  0  0 ... 0 0 0 0
Bits:        31 30 29 28 ... 3 2 1 0
```

So to get the largest signed integer, we need to subtract one.

##### Real-World Application: Video Game Currency

In video games like RuneScape that use $32$-bit signed integers to represent in-game currency, the max "cash stack" that you can have caps out at exactly $2^{31} - 1$, which is roughly 2.1 billion.

{% include postImage.html src: "./images/max-cash-stack.png", alt: "The max cash stack you can have in Runescape is 2147m, or 2.1 billion.", caption: "Image source: [YouTube](https://www.youtube.com/watch?v=c2ZsPPDH08g)" %}

Now you know why! If you're wondering why they don't just use unsigned ints, it's because RuneScape runs on Java, and [Java doesn't support unsigned ints](https://stackoverflow.com/questions/9854166/declaring-an-unsigned-int-in-java) (except in SE 8+).

#### What Is the Smallest Signed 32-bit Integer?

This occurs when we set the leading bit to be a $1$ and set all remaining bits to be a $0$:

```
Num:      1  0  0  0 ... 0
Bits:    31 30 29 28 ... 0
```

Why? Because recall that in the expansion of negative numbers in two's complement binary, the leading $1$ is a $-1$ times $2^{n-1}$, and a $1$ in any other position will be treated as $+1$ times its corresponding power of two. Since we want the smallest negative number, we don't want any positive terms, as those take away from our magnitude. So we set all remaining bits to be $0$.

**Answer**: $-2^{31}$

In Java, this value is stored in `Integer.MIN_VALUE`. In C++, it's in `std::numeric_limits<int>::min()`.

More generally, if we have an $N$-bit system, the smallest representable signed int is $-2^{n-1}$.

Notice that the magnitude of the smallest signed $32$-bit integer is exactly one greater than the magnitude of the largest signed $32$-bit integer. As mentioned previously, this is because of where we chose to group the number zero itself, which "steals" one magnitude from that group's available bits.

## Binary Arithmetic

Spoiler: Adding, subtracting, multiplying, and dividing numbers in the binary number system is **exactly the same** as it is in decimal!

### Adding Binary Numbers

We'll first revisit what we learned in elementary school for decimal numbers and then look at how to add two binary numbers.

To add two numbers in the decimal number system, you stack them on top of one another visually and work your way from right to left, adding two digits and "carrying the one" as needed.

Now you should know what carrying the one really means: When you run out of digits to represent something in your fixed-base number system (e.g., $13$ isn't a digit in base $10$), you represent the part that you can in the current digits place and move over to the next power of your base (the "column" to the left of your current one).

For example, let's add $24$ and $18$ in decimal:

```
  24
+ 18
————
  42
```

We first add the $4$ and $8$ to get $12$, which is not a digit we support in the decimal number system. So we represent the part that we can ($2$) and carry the remaining value (ten) over to the next column as a $1$ ($1 × 10^1 = 10_{10}$). In that column, we have $1_{10} + 2_{10} + 1_{10} = 4_{10}$:

```
      1  <-- carried
      24
    + 18
————————
      42
```

Now, let's add these same two numbers ($24_{10}$ and $18_{10}$) using the binary number system:

```
  11000
+ 10010
———————
 101010
```

We work from right to left:

- Ones place: $0 + 0 = 0$
- Twos place: $0 + 1 = 1$
- Fours place: $0 + 0 = 0$
- Eighths place: $1 + 0 = 1$
- Sixteens place: $1 + 1 = 10_2$ (two)

That last step deserves some clarification: When we try to add the two ones, we get $1_2 + 1_2 = 10_2$ (two), so we put a $0$ in the current column and carry over the $1$ to the next power of two, where we have a bunch of implicit leading zeros:

```
               1      <-- carry bits
0000  ...    00011000
0000  ...  + 00010010
—————————————————————
0000  ...    00101010
```

In that column, $1 (carried) + 0(implicit) = 1$.

If we expand the result, we'll find that it's the same answer we got over in decimal:

$$
1(2^5) + 1(2^3) + 1(2^1) = 32 + 8 + 2 = 42_{10}
$$

Let's look at one more example to get comfortable with carrying bits in binary addition: $22_{10} + 14_{10}$, which we know to be $36_{10}$:

```
  10110
+ 01110
———————
 100100
```

Something interesting happens when we look at the twos place (the $2^1$ column): We add $1_2$ to $1_2$, giving us two ($10_2$), so we put a zero in the $2^1$ column and carry the remaining one.

Now we have three ones in the $2^2$ column: $1_2(carried) + 1_2(operand1) + 1_2(operand2) = 11_2$ (three). So we put a one in the $2^2$ column and carry a one yet again. Rinse and repeat!

```
               1111    <-- carry bits
0000  ...    00010110
0000  ...  + 00001110
—————————————————————
0000  ...    00100100
```

Once again, it's a good practice to expand the result so you can verify your work:

$$
1(2^5) + 1(2^2) = 32_{10} + 4_{10} = 36_{10}
$$

{% aside %}
  **Note**: We've only looked at examples of adding two binary numbers, but you could just as well stack $x$ numbers on top of one another and add them in binary, just like you would in decimal. How far ahead you need to carry your ones depends on the result that you get in a particular column, represented as a binary string.
{% endaside %}

### Subtracting Binary Numbers

Subtraction is addition with a negative operand: $a - b = a + (-b)$. Now that we know how to represent negative numbers in the binary system thanks to two's complement, this should be a piece of cake: **negate the second operand and perform addition**.

For example, what's $12_{10} - 26_{10}$? In decimal, we know this to be $-14_{10}$. Over in binary, we know that $12_{10}$ is $01100$. What about $-26_{10}$? We'll represent that using two's complement.

We start by first representing $26_{10}$ in binary:

$$
+26_{10} = 011010_2
$$

Now we negate it by flipping the bits and adding one:

```
26 in binary: 011010
Flipped:      100101
Add one:      100110  = -26
```

Then, stack up the operands and add them like before:

```
     11    <-- carry bits
    001100
  + 100110
——————————
    110010
```

Notice that the result has a leading one, which we know denotes a negative number in signed binary. So we at least got the sign part right! Let's check the magnitude:

$$
-1(2^5) + 1(2^4) + 1(2^1) = -32_{10} + 16_{10} + 2_{10} = -14_{10}
$$

Adding and subtracting numbers in the binary number system is no different than in the decimal system! We're just working with bits instead of digits.

### Multiplying Binary Numbers

Let's remind ourselves how we multiply numbers in decimal:

```
  21
x 12
————
```

Remember the process? We multiply the $2$ by each digit in the first multiplicand and write out the result under the bar:

```
  21
x 12
————
  42
```

Then we move on to the $1$ in $12$ and repeat the process, but adding a $0$ in the right column of the result. Add the two intermediate products to get the answer:

```
   21
x  12
—————
   42
+ 210
—————
  252
```

Guess what? The process is exactly the same in the binary number system!

Let's multiply these same two numbers in binary. They are $21_{10} = 010101$ and $12_{10} = 01100$:

```
   010101
x   01100
—————————
```

Obviously, this is going to be more involved in binary since we're working with bits (and thus longer strings), but the logic is still the same. In fact, beyond having to write out so many intermediate results, we actually have it much easier over in binary. Whenever a digit is $1$, you simply copy down the first multiplicand, padded with zeros. Whenever it's a zero times the first multiplicand, the result is zero!

```
      010101
x      01100
————————————
      000000
     0000000
    01010100
   010101000
+ 0000000000
————————————
  0011111100
```

Expanding this in binary, we get:

$0011111100_2 = 1(2^7) + 1(2^6) + 1(2^5) + 1(2^4) + 1(2^3) + 1(2^2) = 252_{10}$

Easy peasy. The same process applies regardless of whether your multiplicands are signed or unsigned.

### Dividing Binary Numbers

Let's divide $126_{10}$ by $12_{10}$ using long division:

```
    0 1 0 . 5
   _______
12 |1 2 6
  - 1 2
   ————
      0 6
    -   0
   ——————
        6 0
      - 6 0
      —————
          0
```

Answer: $10.5$.

Now let's repeat the process over in the binary number system. Note that I'm going to strip leading zeros to make my life easier since we're working with two unsigned numbers:

```
      _______
1100 |1111110
```

Take things one digit at a time, and [reference this useful YouTube video](https://www.youtube.com/watch?v=VKemv9u40gc) if you get stuck:

```
         0 0 0 1 0 1 0 . 1
        ______________
1 1 0 0 |1 1 1 1 1 1 0 . 0
        -0
        ——
         1 1
        -  0
        ————
         1 1 1
        -    0
        ——————
         1 1 1 1
       - 1 1 0 0
        ————————
             1 1 1
          -      0
        ——————————
             1 1 1 1
           - 1 1 0 0
           —————————
             0 0 1 1 0
             -       0
             —————————
                 1 1 0
                 -   0
                 —————
                 1 1 0 0
              -  1 1 0 0
                 ———————
                 0 0 0 0
```

Answer: $01010.1$.

What does the $1$ to the right of the decimal point represent? Well, in the decimal number system, anything to the right of the decimal point represents a negative power of ten: $10^{-1}$, $10^{-2}$, and so on.

As you may have guessed, in the binary number system, these are $2^{-1}$, $2^{-2}$, and so on. So $.1$ above really means $1(2^{-1})$, which is $\frac{1}{2} = 0.5_{10}$ in decimal. And of course, the part in front of the decimal point evaluates to $10_{10}$.

That gives us $10_{10} + 0.5_{10} = 10.5$. So our answer using binary long division is **exactly the same** as the one we got over in decimal!

### Integer Overflow and Underflow in Binary

What happens if you try to add one to the largest representable $N$-bit signed integer?

For example, if $N = 32$, we're really asking what happens if we try adding one to the largest representable $32$-bit signed int.

Let's give it a shot:

```
    0111...11111
  + 0000...00001
————————————————
```

In the rightmost column, we'll get $1_2 + 1_2 = 10_2$, so that's a zero carry a one. But as a result, all of the remaining additions will be $1_2 + 1_2$ since we'll always carry a one until we get to the leading bit:

```
    11111111111  <-- carry bits
    0111...11111     (2^{N-1} - 1)
  + 0000...00001     (1)
————————————————
    1000...00000     (-2^{N-1})
```

And what number is that in signed binary? Hmm... Looks like it's the smallest representable negative number! What we've observed here is called **integer overflow**. When you try to go past the largest representable signed integer in a given $N$-bit system, the result *overflows* or *wraps around*.

What if we try to subtract one from the smallest representable $N$-bit signed integer? First, we'll represent $-1_{10}$ as a signed integer in binary:

```
1 in binary: 0000...00001
Flipped:     1111...11110
Add one:     1111...11111  <-- -1
```

Now let's add this to the smallest representable signed integer:

```
   1             <-- carry bits
    1000...00000     (-2^{N-1})
  + 1111...11111     (-1)
————————————————
  1|0111...11111     (2^{N-1} - 1)
```

Notice that the result carries an additional bit over, yielding a result that has $N+1$ bits. But our system only supports $N$ bits, so that leading $1$ is actually discarded. The result is the largest representable $N$-bit signed integer, and this is known as **integer underflow**.

Overflow and underflow are things you should be mindful of in programs that are performing lots of computations, as you may end up getting unexpected results.

## The Binary Number System: Additional Topics for Exploration

That about does it for this introduction to the binary number system! We took a pretty in-depth look at decimal, binary, and hexadecimal, and I hope you now have a greater appreciation for the binary number system and the role that it plays in computing.

In reality, there's much more to learn beyond what we covered here. If you're curious, I encourage you to look into [representing floating point numbers in binary](https://en.wikipedia.org/wiki/Floating-point_arithmetic) using the IEE754 format.
