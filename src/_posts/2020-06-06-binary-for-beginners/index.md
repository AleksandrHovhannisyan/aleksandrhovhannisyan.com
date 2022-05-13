---
title: "Binary for Beginners: The ABCs of 0s and 1s"
description: The binary number system underlies everything in computation and software. But what's the deal with all those 0s and 1s?
keywords: [binary number system, binary numbers]
categories: [computer-science, math, binary]
commentsId: 44
thumbnail: ./images/thumbnail.png
---

What is <code>10</code>? If this is your first time learning about the binary number system, then this question may seem odd. Of course it's ten, right?

Let's try something different. Have you ever heard this joke?

> There are <code>10</code> types of people in the world: those who understand binary and those who don't.

Unless you're familiar with binary numbers, this probably doesn't make much sense. But by the end of this post, you'll come to appreciate this and many other awful developer jokes!

In this beginner's tutorial, we'll look at everything you need to know about the binary number system, but we'll also take a quick look at decimal and hexadecimal, as they're closely related. I'll include relevant bits of code and real-life examples to help you appreciate the beauty of binary.

{% include toc.md %}

## What Is a Number System?

Before we look at binary, let's take a step back and discuss number systems *in general*.

Now, it may be strange to think of number "systems" in the plural if this is your first time learning about them. That's because the majority of the world is familiar with just one: the **decimal number system** (aka "base ten"), also known as the **Arabic number system**. This system has digits ranging from <code>0</code> to <code>9</code>, which we use to form numbers in our daily lives.

For example, in the decimal number system, <code>579</code> expands to this:

<code>579 = 5(10<sup>2</sup>) + 7(10<sup>1</sup>) + 9(10<sup>0</sup>) = 500 + 70 + 9</code>

As a kid, you were taught that the <code>5</code> in <code>579</code> is in the "hundreds place," the <code>7</code> is in the "tens place," and the <code>9</code> is in the ones place. Notice that the <code>5</code> is multiplied by one hundred (<code>10<sup>2</sup></code>), the <code>7</code> by ten (<code>10<sup>1</sup></code>), and the <code>9</code> by one (<code>10<sup>0</sup></code>) to form the decimal number <code>579</code>. Makes sense, right?

Here, the number <code>10</code> is what we call the **base** (aka **radix**) of our number system. Notice the powers of <code>10</code> in the expanded expression above: <code>10<sup>2</sup></code>, <code>10<sup>1</sup></code>, and <code>10<sup>0</sup></code>. For this reason, the terms *decimal* and *base 10* are interchangeable.

In the decimal number system, a number is represented by placing digits into "buckets" that represent **increasing powers of ten**, starting with <code>10<sup>0</sup></code> in the rightmost "bucket," followed by <code>10<sup>1</sup></code> to its immediate left, and so on infinitely:

{% include img.html src: "./images/buckets.png", alt: "Increasing powers of ten from right to left, represented as square slots." %}

Any unused buckets to the far left have an implicit value of <code>0</code> in them. We usually trim leading zeros because there is no use in saying <code>00579</code> when that's mathematically identical to <code>579</code>.

Why did humans pick <code>10</code> to be the base of their preferred number system? Most likely because we're born with ten fingers and ten toes, and we're used to counting with our fingers when we're young. So it's simply natural for us to use this number system!

### Bases, Exponents, and Digits

As I've already hinted, the decimal number system (base <code>10</code>) isn't the only one in existence. Let's use a more general mathematical notation to represent number systems beyond just our familiar one.

In a number system with a fixed base of <code>b</code>, the available digits range from <code>0</code> to <code>b - 1</code>. For example, in the decimal number system (<code>b = 10</code>), we can only use the digits <code>0, 1, 2, ..., 9</code>. When you "run out" of digits in a single bucket, you carry over a one to the next power of the base. For example, to get to the number after <code>99</code>, you carry a one to the next power of ten: <code>100</code>.

Now, suppose that we have a string of digits <code>d<sub>1</sub> d<sub>2</sub> ... d<sub>n</sub></code> (where <code>n</code> is just the number of digits). Maybe that's <code>d<sub>1</sub> d<sub>2</sub> ... d<sub>n</sub> = 579</code> from our earlier example. That string expands like this:

<code>d<sub>1</sub>b<sup>n-1</sup> + d<sub>2</sub>b<sup>n-2</sup> + ... + d<sub>n</sub>b<sup>0</sup></code>

And you can visualize that like this:

{% include img.html src: "./images/bases.png", alt: "A generic base of b with digits d" %}

Using our same example, <code>d<sub>1</sub>b<sup>n-1</sup> + d<sub>2</sub>b<sup>n-2</sup> + ... + d<sub>n</sub>b<sup>0</sup> = 5(10<sup>2</sup>) + 7(10<sup>1</sup>) + 9(10<sup>0</sup>)</code>

{% include img.html src: "./images/579.png", alt: "Expanding 579 in terms of powers of 10" %}

Again, we have buckets from right to left in increasing powers of our base (<code>10</code>).

{% aside %}
  **Note**: The rightmost bucket will always represent <code>d<sub>n</sub></code> in any number system. Why? Because any base raised to the power of <code>0</code> is just <code>1</code>.
{% endaside %}

Now, in reality, you can have a number system that uses a base of <code>2</code>, <code>3</code>, <code>4</code>, <code>120</code>, and so on. Some of these have special names because they're used more often than others:

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

For this reason, when discussing number systems, we usually subscript a number with its base to clarify its value. Alternatively, you can prepend a number with a certain string (usually <code>0b</code> for binary or <code>0x</code>/<code>#</code> for hexadecimal). So we'd write <code>579</code> as <code>579<sub>10</sub></code>, or the binary number <code>1001</code> as <code>1001<sub>2</sub></code> (or <code>0b1001</code>). Otherwise, if we were to merely write the number <code>1001</code> without providing any context, nobody would know whether that's in binary, octal, decimal, hexadecimal, and so on because the digits <code>0</code> and <code>1</code> are valid in all of those number systems, too!

{% aside %}
  **Note**: When not comparing number systems, we usually assume that a given number is in decimal unless otherwise noted, and thus the subscript is omitted.
{% endaside %}

## The Binary Number System (Base 2)

So far so good—we're all familiar with decimal numbers because we use them everyday. But what's the deal with the binary number system?

By definition, the **binary number system** has a base of <code>2</code>, and thus we can only work with two digits to compose numbers: <code>0</code> and <code>1</code>. Technically speaking, we don't call these digits—they're called **bits** in binary lingo.

Each "bucket" in a binary string represents an increasing power of two: <code>2<sup>0</sup></code>, <code>2<sup>1</sup></code>, <code>2<sup>2</sup></code>, and so on.

{% include img.html src: "./images/binary.png", alt: "The binary number system uses powers of two" %}

The leftmost bit is called the **most significant bit (MSB)**, while the rightmost bit is called the **least significant bit (LSB)**.

Here are some examples of representing decimal numbers in the binary number system:

- Zero: <code>0<sub>10</sub> = 0<sub>2</sub></code>. Expansion: <code>0 (2<sup>0</sup>)</code>
- One: <code>1<sub>10</sub> = 1<sub>2</sub></code>. Expansion: <code>1(2<sup>0</sup>)</code>
- Two: <code>2<sub>10</sub> = 10<sub>2</sub></code>. Expansion: <code>1(2<sup>1</sup>) + 0(2<sup>0</sup>)</code>
- Three: <code>3<sub>10</sub> = 11<sub>2</sub></code>. Expansion: <code>1(2<sup>1</sup>) + 1(2<sup>0</sup>)</code>
- Four: <code>4<sub>10</sub> = 100<sub>2</sub></code>. Expansion: <code>1(2<sup>2</sup>) + 0(2<sup>1</sup>) + 0(2<sup>0</sup>)</code>
- Five: <code>5<sub>10</sub> = 101<sub>2</sub></code>. Expansion: <code>1(2<sup>2</sup>) + 0(2<sup>1</sup>) + 1(2<sup>0</sup>)</code>

{% aside %}
  **Note**: Like in the decimal number system, leading zeros are usually stripped from binary strings. The only exception is if you're working with [a signed binary number system](#signed-binary-number-system-twos-complement), where a leading zero indicates that a number is positive and a leading one indicates that it's negative.
{% endaside %}

Having learned the binary number system, you should now understand the joke from earlier:

> There are <code>10</code> types of people in the world: those who understand binary and those who don't.

Here, we really mean the binary equivalent of two, which *looks* like ten to our eyes when it's not properly subscripted: <code>10<sub>2</sub> = 1 × 2<sup>1</sup> = 2<sub>10</sub></code>.

### Binary Is Close to the Hardware of a Computer

Why do we bother with using the binary number system in the first place? Doesn't it seem like a whole lot of extra work to represent numbers in this manner when we could instead use the decimal number system? Well, yes—if you're writing these out by hand, it's certainly more work to represent (and manipulate) binary numbers.

You may not see any point in using binary if you haven't learned about computer architecture at a low level. Internally, computers are nothing more than electrical circuits tied to hardware. Current either flows through a wire or doesn't—a **binary state**. Likewise, computers use **logic gates** (AND/OR/NOR/XOR) to control the flow of a program's execution, and these take binary inputs (<code>true</code>/<code>false</code>). The best way to represent these low-level interactions is to use the binary number system: <code>0</code> means OFF (or <code>false</code> in its logical form) and <code>1</code> means ON (or <code>true</code>).

{% aside %}
  **Note**: If the whole world were to agree to it, we could just as well instead treat <code>0</code> as ON and <code>1</code> as OFF. However, it just makes more sense to treat <code>0</code> as OFF/false—after all, zero denotes the absence of a value. Hence, it's a natural candidate for representing things like falsehood or the lack of a current flowing through a wire.
{% endaside %}

Everything on your computer—the files you save and the software you install—is represented as nothing more than zeros and ones. But how is this possible?

### The ASCII Standard

Suppose you create a file on your computer and store some basic text in it:

```bash {data-copyable=true}
echo Hello, Binary > file
```

At the end of the day, your computer can't store a character like <code>H</code>, <code>e</code>, <code>l</code>, or <code>o</code> (or even the space between two words) *literally*. Computers only know how to work with *binary*. Thus, we need some way to convert these characters to numbers. And that's why the ASCII standard was introduced.

Formally, ASCII is referred to as a **character encoding standard**. Put more simply, it's a method of representing human-readable characters like <code>H</code>, <code>e</code>, <code>,</code>, <code>?</code>, and <code>9</code> numerically so that computers can understand and use them like we do.

Here is a typical [ASCII chart](http://www.asciitable.com/) that you may have seen before:

{% include img.html src: "./images/ascii.gif", alt: "An ASCII table showing characters and their numerical representations" %}

In the ASCII standard, there are a total of 128 characters, each mapped to a unique number in binary (with an equivalent representation in decimal that we humans understand more naturally):

- Arabic digits: <code>0-9</code> (10)
- Capital letters of the English alphabet: <code>A-Z</code> (26)
- Lowercase letters of the English alphabet: <code>a-z</code> (26)
- Punctuation and special characters (66)

### 1 Character = 1 Byte

In the decimal number system, we're used to working with digits. In binary, as we already saw, we're used to working with **bits**. There's another special group of digits in binary that's worth mentioning: A sequence of eight bits is called a **byte**.

Here are some examples of valid bytes:

```
00000000
10000000
11101011
11111111
```

... and any other valid permutation of eight <code>0</code>s and <code>1</code>s that you can think of.

Why is this relevant? Because on modern computers, **characters are represented using bytes**.

Recall that the ASCII standard needs to support a total of **128 characters**. So how many unique number can we represent with <code>8</code> bits (a byte)?

Well, using the product rule from combinatorics, we have eight "buckets," each with two possible values: either a <code>0</code> or a <code>1</code>. Thus, we have <code>2 × 2 × ... × 2 = 2<sup>8</sup></code> possible values.

In decimal, this is <code>2<sup>8</sup> = 256</code> possible values. By comparison, <code>2<sup>7</sup> = 128</code>. And <code>128</code> happens to be the number of characters that we want to represent.

So... That's weird, and seemingly wasteful, right? Why do we use <code>8</code> bits (one byte) to represent a character when we could use <code>7</code> bits instead and meet the precise character count that we need?

Good question! We use bytes because **it's not possible to evenly divide a group of <code>7</code> bits**, making certain low-level computations difficult if we decide to use <code>7</code> bits to represent a character. In contrast, a byte can be evenly split into powers of two:

```
11101011
[1110][1011]
[11][10][10][11]
```

The key takeaway here is that we only need one byte to store one character on a computer. This means that a string of five characters—like <code>Hello</code>—occupies five bytes of space, with each byte being the numerical representation of the corresponding character per the ASCII standard.

Remember the file we created earlier? Let's view its binary representation using the <code>xxd</code> Unix tool:

```bash {data-copyable=true}
xxd -b file
```

The <code>-b</code> flag stands for binary. Here's the output that you'll get:

```
00000000: 01001000 01100101 01101100 01101100 01101111 00101100  Hello,
00000006: 00100000 01000010 01101001 01101110 01100001 01110010   Binar
0000000c: 01111001 00001010                                      y.
```

The first line shows a sequence of six bytes, each corresponding to one character in <code>Hello,</code>.

Let's decode the first two bytes using our knowledge of the binary number system and ASCII:

- <code>01001000 = 1(2<sup>6</sup>) + 1(2<sup>3</sup>) = 72<sub>10</sub></code>. Per our ASCII table, this corresponds to <code>H</code>.
- <code>01100101 = 1(2<sup>6</sup>) + 1(2<sup>5</sup>) + 1(2<sup>2</sup>) + 1(2<sup>0</sup>) = 101<sub>10</sub></code>, which is <code>e</code> in ASCII.

Cool! Looks like the logic pans out. You can repeat this for all of the other bytes as well. Notice that on the second line, we have a leading space (from <code>Hello, Binary</code>), represented as <code>2<sup>5</sup> = 32<sub>10</sub></code> in ASCII (which is indeed <code>Space</code> per the lookup table!).

By the way, what's up with the numbers along the left-hand side of the output? What does <code>0000000c</code> even mean? Time to explore another important number system!

## The Hexademical Number System (Base 16)

As I mentioned in the table from earlier, the hexadecimal number system is closely related to binary because it's often used to express binary numbers more compactly, instead of writing out a whole bunch of zeros and ones.

The **hexadecimal number system** has a base of <code>16</code>, meaning its digits range from <code>0–15</code>.

{% aside %}
  **Note**: In technical terms, a hexadecimal digit is called a **nibble**, but you'll commonly hear people just call them "hex digits."
{% endaside %}

This is our first time encountering a number system whose digits are made up of more than two characters. How do we squeeze <code>10</code>, <code>11</code>, or <code>15</code> into a single "bucket" or "slot" for a digit? To be clear, **this is perfectly doable** if you have clear delimiters between digits. But in reality, that's not practical.

Let's take a step back and consider a simple hexadecimal number:

<code>0x42</code>

What does this mean to us humans in our decimal number system? Well, all we have to do is multiply each digit by its corresponding power of <code>16</code>:

<code>0x42 = 4(16<sup>1</sup>) + 2(16<sup>0</sup>) = 64<sub>10</sub> + 2<sub>10</sub> = 66<sub>10</sub></code>

Okay, so that's a simple hex number. Back to the problem at hand: How do we represent the hex digits <code>10</code>, <code>11</code>, and so on? Here's an example that's pretty confusing unless we introduce some alternative notation:

<code>0x15</code>

Is this a <code>15</code> in a single slot or a <code>1</code> and a <code>5</code> in two separate slots? One way to make this less ambiguous is to use some kind of delimiter between slots, but again, that's not very practical:

<code>0x8[15]29</code>

The better solution that people came up with is to map <code>10–15</code> to the the English letters <code>a–f</code>.

{% aside %}
  **Note**: Capitalization doesn't matter, so you can use <code>a-f</code> or <code>A-F</code>. Just be consistent.
{% endaside %}

Here's an example of a hexadecimal number that uses one of these digits:

<code>0xf4</code>

And here's its expansion:

<code>0xf4 = 15(16<sup>1</sup>) + 4(16<sup>0</sup>) = 240<sub>10</sub> + 4<sub>10</sub> = 244<sub>10</sub></code>

There's nothing magical about the hexadecimal number system—it works just like unary, binary, decimal, and others. All that's different is the base!

Before we move on, let's revisit the output from earlier when we used <code>xxd</code> on our sample file:

```
00000000: 01001000 01100101 01101100 01101100 01101111 00101100  Hello,
00000006: 00100000 01000010 01101001 01101110 01100001 01110010   Binar
0000000c: 01111001 00001010                                      y.
```

The numbers along the left-hand side mark the starting byte for each line of text on the far right. For example, the first line of text (<code>Hello,</code>) ranges from byte #0 (<code>H</code>) to byte #5 (<code>,</code>). The next line is marked as <code>00000006</code>, meaning we're now looking at bytes #6 through 11 (<code>B</code> to <code>r</code>). Finally, the last label should make sense now that you know the hexadecimal number system: <code>c</code> maps to <code>12</code>, meaning the byte that follows corresponds to the twelfth character in our file.

### How to Convert Between Binary and Hexadecimal

Now that we know a bit about binary and hexadecimal, let's look at how we can convert between the two systems.

#### Binary to Hexadecimal

Say you're given this binary string and you'd like to represent it in hexadecimal:

<code>011011100101</code>

While at first this may seem like a pretty difficult task, it's actually **very easy**.

Let's do a bit of a thought exercise:

In the hexadecimal number system, we have <code>16</code> digits from <code>0</code> to <code>15</code>. Over in binary land, how many bits do we need to represent these <code>16</code> values?

The answer is four because <code>2<sup>4</sup> = 16</code>. With four "buckets," we can create the numbers zero (<code>0000</code>), one (<code>0001</code>), ten (<code>1010</code>), all the way up to fifteeen (<code>1111</code>).

This means that when you're given a binary string, all you have to do is **split it into groups of four bits** and evaluate them to convert binary to hexadecimal!

```
011011100101
[0110][1110][0101]
6 14 5
```

Now we just replace <code>10–15</code> with <code>a-f</code> and we're done: <code>0x6e5</code>.

#### Hexadecimal to Binary

What about the reverse process? How do you convert a hexadecimal number to binary?

Say you're given the hexadecimal number <code>0xad</code>. What do we know about each hexadecimal digit? Well, from our earlier thought exercise, we know that four bits = one hex digit. So now we just have to convert each indiviual digit to its <code>4</code>-bit binary representation and then stick each group together!

<code>0xad = 0b10101101</code>

Super easy, just like I promised.

### Real-World Application: Representing Colors with RGB/Hex

While we're on the topic of binary and hexadecimal, it's worth taking a look at one real-world use case for the things we've learned so far: **RGB and hex colors**.

Colors have three components: red, green, and blue (RGB). With LED (light-emitting diode) displays, each pixel is really split into these three components using a color diode. If a color component is set to <code>0</code>, then it's effectively turned off. Otherwise, its intensity is modulated between <code>0</code> and <code>255</code>, giving us a color format like <code>rgb(0-255, 0-255, 0-255)</code>.

Let's consider this hex color: <code>#4287f5</code>. What is it in the RGB format?

Well, we need to split this hex string evenly between red, green, and blue. That's two digits per color:

<code>[42][87][f5]</code>

Now, we simply interpret the decimal equivalent for each part:

- **Red**: <code>42<sub>16</sub> = 4(16<sup>1</sup>) + 2(16<sup>0</sup>) = 66</code>
- **Green**: <code>87<sub>16</sub> = 8(16<sup>1</sup>) + 7(16<sup>0</sup>) = 135</code>
- **Blue**: <code>f5<sub>16</sub> = 15(16<sup>1</sup>) + 5(16<sup>0</sup>) = 245</code>

That means <code>#4287f5</code> is really <code>rgb(66, 135, 245)</code>! You can verify this using a [Color Converter](https://www.w3schools.com/colors/colors_converter.asp):

{% include img.html src: "./images/color-converter.png", alt: "A color converter verifying that #4287f5 is really rgb(66, 135, 245)" %}

For practice, let's convert this to binary as well. I'll mark the groups of four bits to make it easier to see how I did this (note: you can also convert from the decimal RGB representation if you want to):

<code>0x4287f5 = 0b[0100][0010][1000][0111][1111][0101]</code>

Now, two groups of four bits will represent one component of the color (red/green/blue):

<code>0b[01000010][10000111][11110101]</code>

Notice that each color *component* takes up a byte (<code>8</code> bits) of space.

#### How Many Colors Are There?

As an additional exercise, how many unique colors can you possibly have in the modern RGB format?

We know that each component (red/green/blue) is represented using one byte (<code>8</code> bits). So the colors we're used to are really <code>24</code>-bit colors.

That means there are a whopping <code>2<sup>24</sup> = 16,777,216</code> possible unique colors that you can generate using hex/rgb! The <code>24</code>-bit color system is known simply as **truecolor**. And as you can see, it's capable of representing millions of colors.

Note that you could just as well have performed this calculation using hex: <code>#4287f5</code>. There are six slots, each capable of taking on a value from <code>0</code> to <code>f</code>. That gives us a total of <code>16 × 16 × ... × 16 = 16<sup>6</sup> = 16,777,216</code> values—the same result as before.

Or, if you're using the decimal RGB format, the math still pans out: <code>256 × 256 × 256 = 16,777,216</code>.

#### What Are 8-Bit Colors?

On older systems with limited memory, colors were represented using just eight bits (one byte). These **8-bit colors** had a very limited palette, which meant that most computer graphics didn't have gradual color transitions (so images looked very pixelated/grainy). With only <code>8</code> bits to work with, you are limited to just <code>2<sup>8</sup> = 256</code> colors!

{% include img.html src: "./images/8-bit.png", alt: "An 8-bit color palette" %}

Naturally, you may be wondering: How did they split <code>8</code> bits evenly among red, green, and blue? After all, <code>8</code> isn't divisible by three!

Well, the answer is that *they didn't*. The process of splitting these bits among the color components is called [color quantization](https://en.wikipedia.org/wiki/8-bit_color#Color_quantization), and the most common method (known as **8-bit truecolor**) split the bits as 3-3-2 red-green-blue. Apparently, this is because the human eye is less sensitive to blue light than the other two, and thus it simply made sense to distribute the bits heavily in favor of red and green and leave blue with one less bit to work with.

## Signed Binary Number System: Two's Complement

Now that we've covered decimal, binary, and hexadecimal, I'd like us to revisit the binary number system and learn how to represent negative numbers. Because so far, we've only looked at positive numbers. How do we store the negative sign?

To give us some context, I'll assume that we're working with standard <code>32</code>-bit integers that most (all?) modern computers support. We could just as well look at <code>64</code>-bit or <code>N</code>-bit integers, but it's good to have a concrete basis for a discussion.

If we have <code>32</code> bits to fiddle with, that means we can represent a total of <code>2<sup>32</sup> = 4,294,967,296</code> (4 billion) numbers. More generally, if you have <code>N</code> bits to work with, you can represent <code>2<sup>N</sup></code> values. But we'd like to split this number range evenly between negatives and positives.

Positive or negative... positive or negative. One thing or another thing—ring a bell? That sounds like it's binary in nature. And hey—we're already using binary to *store* our numbers! Why not reserve just a single bit to represent *the sign*? We can have the most significant (leading) bit be a <code>0</code> when our number is positive and a <code>1</code> when it's negative!

{% aside %}
  **Note**: This is once again one of those situations where you could just as well do the opposite, except you'd have to convince the whole world to follow your chosen convention.
{% endaside %}

Earlier, when we were first looking at the binary number systems, I mentioned that you can strip leading zeros because they are meaningless. This is true except when you actually care about distinguishing between positive and negative numbers in binary. Now, we need to be careful—if you strip all leading zeros, you my be left with a leading <code>1</code>, and that would imply that your number is negative (in a signed number system).

You can think of two's complement as a new *perspective* or lens through which we look at binary numbers. The number <code>100<sub>2</sub></code> ordinarily means <code>4<sub>10</sub></code> if we don't care about its sign (i.e., we assume it's **unsigned**). But if we do care, then we have to ask ourselves (or whoever provided us this number) whether it's a signed number.

### How Does Two's Complement Work?

What does a leading <code>1</code> actually represent when you expand a signed binary number, and how do we convert a positive number to a negative one, and vice versa?

For example, suppose we're looking at the number <code>22<sub>10</sub></code>, which is represented like this in unsigned binary:

<code>10110<sub>2</sub></code>

Since we're looking at signed binary, we need to pad this number with an extra <code>0</code> out in front (or else a leading <code>1</code> would imply that it's negative):

<code>010110<sub>2</sub></code>

Okay, so this is positive <code>22<sub>10</sub></code>. How do we represent <code>-22<sub>10</sub></code> in binary?

There are two ways we can do this: the intuitive (longer) approach and the "shortcut" approach. I'll show you both, but I'll start with the more intuitive one.

#### The Intuitive Approach: What Does a Leading 1 Denote?

Given an <code>N</code>-bit binary string, a leading <code>1</code> in two's complement represents <code>-1</code> multiplied by its corresponding power of two (<code>2<sup>N-1</sup></code>). A digit of <code>1</code> in any other slot represents <code>+1</code> times its corresponding power of two.

For example, the signed number <code>11010<sub>2</sub></code> has this expansion:

<code>11010<sub>2</sub> = -1(2<sup>4</sup>) + 1(2<sup>3</sup>) + 1(2<sup>1</sup>) = -16<sub>10</sub> + 8<sub>10</sub> + 2<sub>10</sub> = -6<sub>10</sub></code>

We simply treat the leading <code>1</code> as a negative, and that changes the resulting sum in our expansion.

#### Two's Complement Shortcut: Flip the Bits and Add a 1

To convert a number represented in two's complement binary to its opposite sign, follow these two simple steps:

1. Flip all of the bits (<code>0</code> becomes <code>1</code> and vice versa).
2. Add <code>1</code> to the result.

For example, let's convert <code>43<sub>10</sub></code> to <code>-43<sub>10</sub></code> in binary:

```
+43 in binary: 0101011
Flipped:       1010100
Add one:       1010101
```

What is this number? It should be <code>-43<sub>10</sub></code>, so let's expand it by hand to verify:

<code>-1(2<sup>6</sup>) + 1(2<sup>4</sup>) + 1(2<sup>2</sup>) + 1(2<sup>0</sup>) = -64<sub>10</sub> + 16<sub>10</sub> + 4<sub>10</sub> + 1<sub>10</sub> = -43</code>

Sure enough, the process works!

#### How Many Signed Binary Numbers Are There?

We've seen that in a signed binary system, the most significant bit is reserved for the sign. What does this do to our number range? Effectively, it halves it!

Let's consider <code>32</code>-bit integers to give us a concrete basis for discussion. Whereas before we had <code>32</code> bits to work with for the magnitude of an unsigned number, we now have only <code>31</code> for the magnitude of a signed number:

```
Unsigned magnitude bits:  [31 30 29 ... 0]
Signed magnitude bits:    31 [30 29 ... 0]
```

We went from having <code>2<sup>32</sup></code> numbers to <code>2<sup>31</sup></code> positive and negative numbers, which is precisely half of what we started with!

More generally, if you have an <code>N</code>-bit signed binary string, there are going to be <code>2<sup>N</sup></code> values, split evenly between <code>2<sup>N-1</sup></code> positives and <code>2<sup>N-1</sup></code> negatives.

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

This is <code>2<sup>31</sup> - 1</code>, which is <code>2,147,483,647</code>. In Java, this number is stored in <code>Integer.MAX_VALUE</code>, and in C++, it's `std::numeric_limits<int>::max()`.

More generally, for an <code>N</code>-bit system, the largest signed integer is <code>2<sup>N-1</sup>-1</code>.

Why did we subtract a one at the end? Because as I mentioned in the previous section, the number zero gets grouped along with the positives when we split our number range:

```
Signed zero:  0  0  0  0 ... 0 0 0 0
Bits:        31 30 29 28 ... 3 2 1 0
```

So to get our largest signed integer, we need to subtract one—we've effectively "lost" a magnitude of one.

##### Real-World Application: Video Game Currency

In video games like RuneScape that use <code>32</code>-bit signed integers to represent in-game currency, the max "cash stack" that you can have caps out at exactly <code>2<sup>31</sup> - 1</code>, which is roughly 2.1 billion.

{% include img.html src: "./images/max-cash-stack.png", alt: "The max cash stack you can have in Runescape is 2147m, or 2.1 billion.", caption: "Image source: [YouTube](https://www.youtube.com/watch?v=c2ZsPPDH08g)" %}

Now you know why! If you're wondering why they don't just use unsigned ints, it's because RuneScape runs on Java, and [Java doesn't support unsigned ints](https://stackoverflow.com/questions/9854166/declaring-an-unsigned-int-in-java) (except in SE 8+).

#### What Is the Smallest Signed 32-bit Integer?

This occurs when we set the leading bit to be a <code>1</code> and set all remaining bits to be a <code>0</code>:

```
Num:      1  0  0  0 ... 0
Bits:    31 30 29 28 ... 0
```

Why? Because recall that in the expansion of negative numbers in two's complement binary, the leading <code>1</code> is a <code>-1</code> times <code>2<sup>N-1</sup></code>, and a <code>1</code> in any other position will be treated as <code>+1</code> times its corresponding power of two. Since we want the smallest negative number, we don't want any positive terms, as those take away from our magnitude. So we set all remaining bits to be <code>0</code>.

**Answer**: <code>-2<sup>31</sup></code>

In Java, this value is stored in <code>Integer.MIN_VALUE</code>.

In C++, it's in `std::numeric_limits<int>::min()`.

Generalizing things once again, if we have an <code>N</code>-bit system, the smallest representable signed int is <code>-2<sup>N-1</sup></code>.

## Basic Arithmetic in the Binary Number System

Spoiler: Adding, subtracting, multiplying, and dividing numbers in the binary number system is **exactly the same** as it is in decimal!

### Adding Binary Numbers

We'll first revisit what we learned in elementary school for decimal numbers and then look at how to add two binary numbers.

To add two numbers in the decimal number system, you stack them on top of one another visually and work your way from right to left, adding two digits and "carrying the one" as needed.

Now you should know what carrying the one really means: When you run out of digits to represent something in your fixed-base number system (e.g., <code>13</code> isn't a digit in base <code>10</code>), you represent the part that you can in the current digits place and move over to the next power of your base (the "column" to the left of your current one).

For example, let's add <code>24</code> and <code>18</code> in decimal:

```
  24
+ 18
————
  42
```

We first add the <code>4</code> and <code>8</code> to get <code>12</code>, which is not a digit we support in the decimal number system. So we represent the part that we can (<code>2</code>) and carry the remaining value (ten) over to the next column as a <code>1</code> (<code>1 × 10<sup>1</sup> = 10<sub>10</sub></code>). There, we have <code>1 + 2 + 1 = 4</code>:

```
      1  <-- carried
      24
    + 18
————————
      42
```

Now, let's add these same two numbers (<code>24<sub>10</sub></code> and <code>18<sub>10</sub></code>) using the binary number system:

```
  11000
+ 10010
———————
 101010
```

We work from right to left:

- Ones place: <code>0 + 0 = 0</code>
- Twos place: <code>0 + 1 = 1</code>
- Fours place: <code>0 + 0 = 0</code>
- Eights place: <code>1 + 0 = 1</code>
- Sixteens place: <code>1 + 1 = 10<sub>2</sub></code> (two)

That last step deserves some clarification: When we try to add the two ones, we get <code>1<sub>2</sub> + 1<sub>2</sub> = 10<sub>2</sub></code> (two), so we put a <code>0</code> in the current column and carry over the <code>1</code> to the next power of two, where we have a bunch of implicit leading zeros:

```
               1      <-- carry bits
0000  ...    00011000
0000  ...  + 00010010
—————————————————————
0000  ...    00101010
```

In that column, <code>1 (carried) + 0(implicit) = 1</code>.

If we expand the result, we'll find that it's the same answer we got over in decimal:

<code>1(2<sup>5</sup>) + 1(2<sup>3</sup>) + 1(2<sup>1</sup>) = 32 + 8 + 2 = 42<sub>10</sub></code>

Let's look at one more example to get comfortable with carrying bits in binary addition: <code>22<sub>10</sub> + 14<sub>10</sub></code>, which we know to be <code>36<sub>10</sub></code>:

```
  10110
+ 01110
———————
 100100
```

Something interesting happens when we look at the twos place (the <code>2<sup>1</sup></code> column): We add <code>1<sub>2</sub></code> to <code>1<sub>2</sub></code>, giving us two (<code>10<sub>2</sub></code>), so we put a zero in the <code>2<sup>1</sup></code> column and carry the remaining one.

Now we have three ones in the <code>2<sup>2</sup></code> column: <code>1<sub>2</sub>(carried) + 1<sub>2</sub>(operand1) + 1<sub>2</sub>(operand2) = 11<sub>2</sub></code> (three). So we put a one in the <code>2<sup>2</sup></code> column and carry a one yet again. Rinse and repeat!

```
               1111    <-- carry bits
0000  ...    00010110
0000  ...  + 00001110
—————————————————————
0000  ...    00100100
```

Once again, it's a good idea to expand the result so you can verify your work:

<code>1(2<sup>5</sup>) + 1(2<sup>2</sup>) = 32<sub>10</sub> + 4<sub>10</sub> = 36<sub>10</sub></code>

{% aside %}
  **Note**: We've only looked at examples of adding two binary numbers, but you could just as well stack <code>x</code> numbers on top of one another and add them in binary, just like you would in decimal. How far ahead you need to carry your ones depends on the result that you get in a particular column, represented as a binary string.
{% endaside %}

### Subtracting Binary Numbers

Subtraction is addition with a negative operand: <code>a - b = a + (-b)</code>. Now that we know how to represent negative numbers in the binary system thanks to two's complement, this should be a piece of cake: **negate the second operand and perform addition**.

For example, what's <code>12<sub>10</sub> - 26<sub>10</sub></code>? In decimal, we know this to be <code>-14<sub>10</sub></code>. Over in binary, we know that <code>12<sub>10</sub></code> is <code>01100</code>. What about <code>-26<sub>10</sub></code>? We'll represent that using two's complement.

We start by first representing <code>26<sub>10</sub></code> in binary:

<code>+26<sub>10</sub> = 011010<sub>2</sub></code>

Now we negate it by flipping the bits and adding one:

```
26 in binary: 011010
Flipped:      100101
Add one:      100110  = -26
```

Stack up your operands and add them like we did before:

```
     11    <-- carry bits
    001100
  + 100110
——————————
    110010
```

Notice that the result has a leading one, which we know denotes a negative number in signed binary. So we at least got the sign part right! Let's check the magnitude:

<code>-1(2<sup>5</sup>) + 1(2<sup>4</sup>) + 1(2<sup>1</sup>) = -32<sub>10</sub> + 16<sub>10</sub> + 2<sub>10</sub> = -14<sub>10</sub></code>

See what I mean? Adding and subtracting numbers in the binary number system is just as easy as it is over in decimal.

### Multiplying Binary Numbers

Let's remind ourselves how we multiply numbers in decimal:

```
  21
x 12
————
```

Remember the process? We multiply the <code>2</code> by each digit in the first multiplicand and write out the result under the bar:

```
  21
x 12
————
  42
```

Then we move on to the <code>1</code> in <code>12</code> and repeat the process, but adding a <code>0</code> in the right column of the result. Add the two intermediate products to get the answer:

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

Let's multiply these same two numbers in binary. They are <code>21<sub>10</sub> = 010101</code> and <code>12<sub>10</sub> = 01100</code>:

```
   010101
x   01100
—————————
```

Obviously, this is going to be more involved in binary since we're working with bits (and thus longer strings), but the logic is still the same. In fact, beyond having to write out so many intermediate results, we actually have it much easier over in binary. Whenever a digit is <code>1</code>, you simply copy down the first multiplicand, padded with zeros. Whenever it's a zero times the first multiplicand, the result is zero!

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

<code>0011111100<sub>2</sub> = 1(2<sup>7</sup>) + 1(2<sup>6</sup>) + 1(2<sup>5</sup>) + 1(2<sup>4</sup>) + 1(2<sup>3</sup>) + 1(2<sup>2</sup>) = 252<sub>10</sub></code>

Easy peasy. The same process applies regardless of whether your multiplicands are signed or unsigned.

### Dividing Binary Numbers

Let's divide <code>126<sub>10</sub></code> by <code>12<sub>10</sub></code> using long division:

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

Answer: <code>10.5</code>.

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

Answer: <code>01010.1</code>.

What does the <code>1</code> to the right of the decimal point represent? Well, in the decimal number system, anything to the right of the decimal point represents a negative power of ten: <code>10<sup>-1</sup></code>, <code>10<sup>-2</sup></code>, and so on.

As you may have guessed, in the binary number system, these are <code>2<sup>-1</sup></code>, <code>2<sup>-2</sup></code>, and so on. So <code>.1</code> above really means <code>1(2<sup>-1</sup>)</code>, which is <code>1 / 2 = 0.5<sub>10</sub></code> in decimal. And of course, the part in front of the decimal point evaluates to <code>10<sub>10</sub></code>.

That gives us <code>10<sub>10</sub> + 0.5<sub>10</sub> = 10.5</code>. So our answer using binary long division is **exactly the same** as the one we got over in decimal!

### Integer Overflow and Underflow in Binary

What happens if you try to add one to the largest representable <code>N</code>-bit signed integer?

For example, if <code>N = 32</code>, we're really asking what happens if we try adding one to the largest representable <code>32</code>-bit signed int.

Let's give it a shot:

```
    0111...11111
  + 0000...00001
————————————————
```

In the rightmost column, we'll get <code>1<sub>2</sub> + 1<sub>2</sub> = 10<sub>2</sub></code>, so that's a zero carry a one. But as a result, all of the remaining additions will be <code>1<sub>2</sub> + 1<sub>2</sub></code> since we'll always carry a one until we get to the leading bit:

```
    11111111111  <-- carry bits
    0111...11111     (2^{N-1} - 1)
  + 0000...00001     (1)
————————————————
    1000...00000     (-2^{N-1})
```

And what number is that in signed binary? Hmm... Looks like it's the smallest representable negative number! What we've observed here is called **integer overflow**. When you try to go past the largest representable signed integer in a given <code>N</code>-bit system, the result *overflows* or *wraps around*.

What if we try to subtract one from the smallest representable <code>N</code>-bit signed integer? First, we'll represent <code>-1<sub>10</sub></code> as a signed integer in binary:

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

Notice that the result carries an additional bit over, yielding a result that has <code>N+1</code> bits. But our system only supports <code>N</code> bits, so that leading <code>1</code> is actually discarded. The result is the largest representable <code>N</code>-bit signed integer, and this is known as **integer underflow**.

Overflow and underflow are things you should be mindful of in programs that are performing lots of computations, as you may end up getting unexpected results.

## The Binary Number System: Additional Topics for Exploration

That about does it for this introduction to the binary number system! We took a pretty in-depth look at decimal, binary, and hexadecimal, and I hope you now have a greater appreciation for the binary number system and the role that it plays in computing.

In reality, there's much more to learn beyond what we covered here. If you're curious, I encourage you to look into [representing floating point numbers in binary](https://en.wikipedia.org/wiki/Floating-point_arithmetic) using the IEE754 format.

I hope you found this helpful! If you struggled with anything in particular, please let me know and I'll try my best to help you out.

