---
# title: A Beginner's Guide to Character Encoding
# title: A Deep Dive on Character Encoding
title: An Introduction to Character Encoding
description: In this deep dive, you'll learn about the Unicode character set and how it's encoded and decoded with UTF.
keywords: [character encoding, unicode, utf]
categories: [computer-science, math, binary]
thumbnail: ./images/thumbnail.png
lastUpdated: 2024-08-01
---

If you're familiar with HTML, you've probably seen this tag somewhere in the `<head>` of a document (hopefully at the very start):

```html
<meta charset="utf-8">
```

As you can probably guess from the `charset` HTML attribute, it must have something to do with character sets. But why is it needed?

More generally, if you've ever written code to open a file in a programming language, you've likely had to specify the character encoding standard to use when reading that file. Maybe you've written something similar to this pseudocode:

```
result = readFile(file, "utf-8")
```

What does UTF-8 even mean?

And finally, if you've ever written JavaScript, maybe you've noticed that `String.prototype.length` doesn't always return what you'd expect for code like this:

```js
// This is 4... right?
console.log('Hi 👋'.length)
```

In this article, you'll learn about character sets like ASCII and Unicode and how to encode and decode characters in UTF-8, both by hand and programmatically using a bit of math. By the end, you will hopefully be able to understand the examples above and much more.

{% include "toc.md" %}

## Prerequisites

This article assumes almost no prior knowledge about character sets or encoding. Where possible, I will define new terms and concepts. For a more in-depth introduction to this topic, I strongly encourage you to also read Joel Spolsky's seminal article: [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/).


## A Brief History of Character Encoding

Human languages consist of characters: symbols with curves, loops, and other odd shapes that convey meaning. Within a language, these letters, numbers, punctuation, and other relevant symbols collectively form a <dfn>character set</dfn>. If you've learned more than one language, you've probably noticed that languages often borrow characters from each other. For example, many modern languages like English and German borrowed (and extended) character sets from older languages like Latin.

We've spent millennia inventing new languages and translating writing from one language to another, but it's only in the last century that we needed to _digitize_ writing so that computers could store text files. Computers can't store or work with "characters" directly: they are only able to represent numbers by flipping currents on or off. This is an oversimplification, but the point is that there's no direct physical equivalent of human characters in the world of computing. So to work around this limitation, what we do is substitute (<dfn>encode</dfn>) characters with integers—known as <dfn>code points</dfn>—that computers can easily store and manipulate. Thus, computers don't have to think about "characters" in the way that humans do. Table 1 lists a few characters and their assigned code points.

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <caption><strong>Table 1</strong>: sample code points</caption>
    <thead>
      <tr>
        <th scope="col">Character</th>
        <th scope="col">Hexadecimal</th>
        <th scope="col" class="numeric">Binary</th>
        <th scope="col" class="numeric">Decimal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>A</code></td>
        <td class="numeric"><code>0x0041</code></td>
        <td class="numeric"><code>1000001</code></td>
        <td class="numeric"><code>65</code></td>
      </tr>
      <tr>
      <tr>
        <td><code>€</code></td>
        <td class="numeric"><code>0x20AC</code></td>
        <td class="numeric"><code>10000010101100</code></td>
        <td class="numeric"><code>8364</code></td>
      </tr>
      <tr>
        <td><code>亀</code></td>
        <td class="numeric"><code>0x4E80</code></td>
        <td class="numeric"><code>100111010000000</code></td>
        <td class="numeric"><code>20096</code></td>
      </tr>
      <tr>
        <td><code>🙂</code></td>
        <td class="numeric"><code>0x1F642</code></td>
        <td class="numeric"><code>11111011001000010</code></td>
        <td class="numeric"><code>128578</code></td>
      </tr>
    </tbody>
  </table>
</div>

A one-to-one encoding like this is reversible, so the core meaning of the text is preserved—just in a different form. To restore the original human-readable text, you perform a reverse-lookup and <dfn>decode</dfn> the numbers. As long as everyone on Earth agrees on which code points correspond to which characters, it all works out.

### Unicode

Today, this mapping of characters to numbers is known as <dfn>the Unicode standard</dfn>: the universal character set used by all modern software. It was first formalized in 1991 and has been maintained since then by the non-profit [Unicode Consortium](https://home.unicode.org/). Unicode assigns numbers to every single known character in the world, including control characters and [even emoji](https://apps.timwhitlock.info/emoji/tables/unicode). In fact, Table 1 shows a very tiny subset of Unicode characters and their code points. As of [version 15.1](https://www.unicode.org/versions/Unicode15.1.0/), Unicode encompasses 149,813 code points. Since it's so large, Unicode is divided into semantic chunks of closely related code points known as <dfn>Unicode blocks</dfn>.

By convention, Unicode code points are written in the hexadecimal number system; however, instead of the usual prefix of `0x`, Unicode code points use the special prefix `U+` so they're easily distinguishable. Otherwise, for clarity in reference manuals and articles, we would need to note that those hexadecimal numbers are Unicode code points, rather than just any ordinary number. For example, the code point `0x1F642` from Table 1 would be written as `U+1F642` in Unicode.

### UCS

Before we move on, I want to briefly mention a bit of history that will be relevant in a future section (see [UCS-2 and UCS-4](#ucs-2-and-ucs-4)).

Two years after the first version of Unicode was published, the International Organization for Standardization (ISO) separately defined a character set in [ISO 10646](https://www.iso.org/standard/69119.html) that was identical to Unicode but went by another name: the <dfn>[Universal Coded Character Set](https://en.wikipedia.org/wiki/Universal_Coded_Character_Set)</dfn>. Over time, UCS has maintained parity with Unicode through its own major revisions.

As for why both of these character sets exist, the organizations that created them apparently had different goals in mind:

{% quote "Wikipedia: Unicode Versions", "https://en.wikipedia.org/wiki/Unicode#Versions" %}
While the UCS is a simple character map, Unicode specifies the rules, algorithms, and properties necessary to achieve interoperability between different platforms and languages. Thus, The Unicode Standard includes more information, covering in-depth topics such as bitwise encoding, collation, and rendering.
{% endquote %}

In other words, UCS is just the bare bones character-to-number mapping of Unicode, without the additional semantics.

### ASCII

Going even further back, we'll find that we actually didn't _start_ with Unicode. In the 1960s, text documents on computers used a precursor character set known as ASCII, which is now just a tiny subset of Unicode (specifically, the [Basic Latin block](https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block))). ASCII consists of 128 code points and includes the English alphabet, Arabic numerals, punctuation, and common control characters (like line endings) used in digital text. Table 2 lists some examples of ASCII characters and their code points in hexadecimal, binary, and decimal:

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <caption><strong>Table 2</strong>: sample ASCII code points</caption>
    <thead>
      <tr>
        <th scope="col">Character</th>
        <th scope="col" class="numeric">Unicode (hex)</th>
        <th scope="col" class="numeric">Binary</th>
        <th scope="col">Decimal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>NUL</code> (null)</td>
        <td class="numeric"><code>U+0000</code></td>
        <td class="numeric"><code>00000000</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td><code>CR</code> (carriage return)</td>
        <td class="numeric"><code>U+000F</code></td>
        <td class="numeric"><code>00001111</code></td>
        <td class="numeric"><code>15</code></td>
      </tr>
      <tr>
        <td><code>+</code></td>
        <td class="numeric"><code>U+0035</code></td>
        <td class="numeric"><code>00110101</code></td>
        <td class="numeric"><code>53</td>
      </tr>
      <tr>
        <td><code>A</code></td>
        <td class="numeric"><code>U+0041</code></td>
        <td class="numeric"><code>01000001</code></td>
        <td class="numeric"><code>65</code></td>
      </tr>
      <tr>
        <td><code>DEL</code> (forward-delete)</td>
        <td class="numeric"><code>U+007F</code></td>
        <td class="numeric"><code>01111111</code></td>
        <td class="numeric"><code>127</code></td>
      </tr>
    </tbody>
  </table>
</div>

In the binary number system, we can represent 128 values with exactly seven bits in computer memory since `2^7 = 128` (with values ranging from zero to 127). However, for reasons that we won't get into here, it was agreed upon that eight bits (one <dfn>byte</dfn>) would be used to encode ASCII. Now, this _did_ mean that the leading bit—also known as the <dfn>most significant bit</dfn> (MSB)—was never actually used, so it was always zeroed out. You can observe this in Table 2 above: The last representable character in ASCII is the control character `DEL` with a code point of `127`; all of its bits are `1` except the MSB. Therefore, all ASCII characters are encoded like this in [Big Endian order](https://en.wikipedia.org/wiki/Endianness): `0xxxxxxx`.

{% aside %}
This decision would have some useful (likely unforeseen) implications in the future. See also: [Some possible reasons for 8-bit bytes](https://jvns.ca/blog/2023/03/06/possible-reasons-8-bit-bytes/).
{% endaside %}

At the time, ASCII was a convenient and space-efficient way to represent the Latin characters most commonly used in English text, and it had one big advantage: uniformity. Since all ASCII characters fit within a single byte, you could easily read and write simple text files by always assuming that one byte represented one character. But ASCII's limited space didn't allow us to encode many other character sets, like Hebrew, Arabic, Chinese, and countless others. As the internet expanded globally, it became clear that software would need to be able to encode and decode these character sets rather than forcing everyone to learn English. Thus, Unicode was born as a universal character set.

But this also meant that we could no longer assume each character was only eight bits long. And that was a big problem for software.

### Encoding Unicode

Technically, this wasn't a problem with Unicode _itself_. At the end of the day, Unicode is just a massive character set, not a character encoding standard; it's only concerned with assigning numbers to human-readable characters. If we can represent a character numerically, then we can store that character in a computer's memory. Space is limitless: We can represent infinitely many code points with Unicode, and the standard is ever-expanding.

On the other hand, _how_ we choose to store those code points in memory is entirely up to us: We could represent them in binary and store those numbers as-is, or we could manipulate the bits with some sort of algorithm to create a more useful result. Either way, Unicode doesn't care how we store code points in memory; it just tells us _what_ those numbers are.

In fact, if we were to only ever write and read single-character text documents, Unicode on its own would be unambiguous: If you opened a file and saw two bytes, you'd decode those two bytes to get back a single character. If you saw three bytes, you'd decode three. And so on, for all code points in the Unicode standard. But in practice, text files and network responses consist of an arbitrary-length sequence of bytes representing one or more characters. So it's not enough to just use the code points directly because then we won't know where one code point begins and another ends. That _would_ be trivial if all characters were ASCII, in which case the boundaries would be in 8-bit intervals, but that's no longer the case in a world where we need more than `2^8 = 256` characters. Therefore, we need a way to encode characters with clearly defined boundaries.

How do we do that?

#### UCS-2 and UCS-4

One of the earliest proposed solutions to the character encoding problem came in the form of two algorithms defined in ISO 10646: UCS-2 and UCS-4. These encodings increased the minimum number of bytes required to encode all characters in UCS/Unicode. So instead of using just one byte for ASCII and adding more bytes as needed for everything else, UCS-2 forced _all_ characters to be encoded with two bytes (16 bits), while UCS-4 required four bytes (32 bits). By analogy, this is sort of like raising the minimum wage: It sets a new baseline standard for everyone, across the board.

But there was a glaring flaw: Every single character had to be encoded with 16 or 32 bits for uniformity, which would've needlessly wasted memory. For example, if we had used UCS-4 to encode ASCII characters—which comprised the majority of text at the time—we would've needed three extra bytes, all zeroed out.

Although UCS-2 and UCS-4 are now considered obsolete, these two encodings laid important groundwork for the creation of a character encoding standard for Unicode: UTF.

{% aside %}
UCS-4 is technically still around; it just goes by a different name in UTF. UCS-2 is truly obsolete, as it is no longer capable of representing all characters in Unicode. Meanwhile, because UCS-4 is capable of representing `2^32` code points, it will likely stick around for a long time.
{% endaside %}

#### UTF

The modern encoding scheme for Unicode is known as UTF, short for <dfn>[Unicode Transformation Format](https://en.wikipedia.org/wiki/Unicode#UTF)</dfn>. UTF is a character encoding standard that represents Unicode code points in such a way that entire text documents can be decoded easily.

UTF has three implementations: UTF-8, UTF-16, and UTF-32. The numbers in those names hint at how the algorithms work: UTF-8 uses 8-bit (byte) [code units](https://developer.mozilla.org/en-US/docs/Glossary/Code_unit), UTF-16 uses 16-bit code units, and UTF-32 uses 32-bit code units.

{% aside %}
At some point, you may have heard that one character fits within one byte in computer memory. But from what we've learned so far, you should recognize that this explanation is not only oversimplified but also flat out _wrong_. It's true that ASCII characters are encoded as bytes, but UTF-16, for example, does not use bytes: It uses 16-bit... well, what do we call those things? This is how the term "code unit" came to be. A <dfn>code unit</dfn> is just a contiguous chunk of bits that forms the basic unit of information in a character encoding standard. It may be a byte, or it may be bigger.
{% endaside %}

All three implementations are able to encode the entire Unicode character set; the only difference is in the size of their code units and _how many_ of those code units they use.

UTF-8 and UTF-16 are known as <dfn>variable-width encoding schemes</dfn> since they use additional code units as needed to encode characters beyond ASCII and other low-end Unicode blocks. For example, in UTF-8, characters are encoded with a variable number of 8-bit code units (bytes):

1. One byte for ASCII (8): `xxxxxxxx`.
2. Two bytes (16) for some other range: `xxxxxxxx xxxxxxxx`.
3. Three bytes (24) for another: `xxxxxxxx xxxxxxxx xxxxxxxx`.
4. And four bytes (32) for the final group: `xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx`.

{% aside %}
I'll reveal how Unicode is divided into groups for UTF-8 in [a future section](#utf-8-encoding-and-decoding-lookup-table).
{% endaside %}

By contrast, in UTF-16, characters are encoded using either:

1. One 16-bit code unit for the first `2^16` code points: `xxxxxxxxxxxxxxxx`, or 
2. Two 16-bit code units for the rest: `xxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxx`.

UTF-16 is a smarter version of UCS-2, where it uses 16 bits to encode some characters and starts using two 16-bit code units only once it runs out of space. Those two 16-bit code units are referred to as <dfn>surrogate pairs</dfn> in UTF-16.

Unlike UTF-8 and UTF-16, UTF-32 is a <dfn>fixed-width encoding scheme</dfn> that always uses a single 32-bit code unit to encode everything, even ASCII. [UTF-32 is just UCS-4](https://stackoverflow.com/questions/30186631/what-is-the-difference-between-utf-32-and-ucs-4), with some minor semantic differences defined in Unicode. The only advantage of UTF-32 over UTF-8 and UTF-16 is that you don't have to worry about encoding and decoding characters since you just take your Unicode code point and translate it into a 32-bit binary string. If it doesn't need 32 bits, just pad the start with zeros. But it's also very wasteful from a memory standpoint.

We're going to focus on UTF-8 in the rest of this article, but note that UTF-16 and UTF-32 are still used. For example, while the majority of operating systems and programming languages use UTF-8, Windows uses UTF-16, as do some programming languages like Java and JavaScript. UTF-16's main advantage is that it needs less storage space than UTF-8 for certain higher-order Unicode characters, like those in Asian languages: Whereas UTF-8 would potentially need three bytes (24 bits) to encode those characters, UTF-16 can get away with using only 16 bits.

{% aside %}
How UTF-16 gets away with this will make more sense once we learn that not all of the 8 bits in UTF-8 are used for encoding: some are reserved bits used to uniquely identify bit sequences.
{% endaside %}

With that basic explainer out of the way, let's take a closer look at UTF-8.

## UTF-8 101

UTF-8 is a widely used character encoding standard that saves space and, like its siblings, can encode all known Unicode characters. Most notably, it is the only implementation out of the three that is fully backwards compatible with ASCII because of its choice of 8-bit code units (since ASCII can be fully encoded with just 8 bits). This backwards-compatibility is great because it means that all of the English text documents originally encoded in ASCII can be encoded and decoded as-is, without any bit manipulation. For all these reasons, UTF-8 is the preferred encoding for HTML documents, [per the specification](https://html.spec.whatwg.org/#charset).

But what happens when we want to use UTF-8 to encode more than just ASCII? Well, our only option is to introduce additional bytes, as already mentioned:

- 1 byte = ASCII
- 2 bytes = some other range of Unicode
- 3 bytes = yet another range of Unicode
- 4 bytes = the last range of Unicode

Sounds simple enough: If you need more storage space, just add more bytes. But in reality, it's a bit more complicated than that.

### Character Boundaries

Recall that the MSB of an ASCII code point is an unused `0`, so all ASCII characters look like this in Big Endian order: `0xxxxxxx`. This seemingly wasted bit actually serves a very useful purpose: UTF reserves this leading bit of `0` to identify encoded bytes that are ASCII; for all other characters beyond ASCII, it reserves an explicit MSB of `1` during the encoding process. Thus, when it comes time to decode a UTF-8 byte, the leading bit will tell us a very key piece of information:

1. `MSB == 0`: the code point is in ASCII, which we can decode as-is.
2. `MSB == 1`: a code point that was encoded with two or more bytes.

Let's consider the second case, where a code point is encoded with a reserved MSB of `1` if it requires more than one byte. In all examples that follow, `x` will denote an unknown bit that will be filled in later once we encode a given character. Also, note that the first byte in UTF is referred to as the <dfn>leading byte</dfn>, while the remaining (intermediate and last) bytes are known as <dfn>continuation bytes</dfn>.

```
ASCII:              [0]xxxxxxxx
2-byte code point:  [1]xxxxxxxx xxxxxxxx
3-byte code point:  [1]xxxxxxxx xxxxxxxx xxxxxxxx
4-byte code point:  [1]xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx
```

Let's pretend this model is sufficient. If we try to decode a sample of text—with a mixture of characters, some encoded with one byte and others with two or more—how will we know where one code point begins and another one ends? If all of the code points were to start with a `1`, they would be indistinguishable from each other. For example, in the following bit sequence, do we have a single two-byte code point followed by another two-byte code point, or is this one big four-byte code point whose third byte just happens to start with a `1` because that's how the bit was encoded?

```
1xxxxxxx xxxxxxx 1xxxxxxx xxxxxxx
```

There's no way to tell!

To solve this character-boundary problem, we need unambiguous prefixes. And this means that we need to reserve some additional bits at the start of each leading byte. A single `1` just won't cut it.

Unfortunately, a continuous sequence of ones won't help, either:

```
2-byte code point:  [1]xxxxxxxx xxxxxxxx
3-byte code point:  [11]xxxxxxx xxxxxxxx xxxxxxxx
4-byte code point:  [111]xxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx
```

If a code point's leading byte starts with `111`, you don't know if that's a 2-byte, 3-byte, or 4-byte code point since those sets overlap: any given `x` could be a `1` by coincidence, rather than a reserved `1`. We need unique prefixes that terminate unambiguously.

Maybe something like this:

```
2-byte code point:  [10]xxxxxx xxxxxxxx
3-byte code point:  [110]xxxxx xxxxxxxx xxxxxxxx
4-byte code point:  [1110]xxxx xxxxxxxx xxxxxxxx xxxxxxxx
```

Now, if we see that a byte starts with `10`, we'll expect to see one more byte after it. But if a byte starts with `110`, then there are two more bytes left to process. And if it starts with `1110`, there are three more bytes. During the encoding process, UTF-8 reserves those prefixes, translates a character's code point into binary, and fills in the `x`s from left to right.

This is very close to UTF-8's actual encoding scheme, but there's just one problem.

### Self-Synchronization

In software, we often read text files and network responses with <dfn>streams</dfn>: data structures that operate on one byte at a time. For efficiency, we need to be able to tell if the byte that we are looking at is the beginning or middle of a character at any given point in time. Otherwise, we need additional state to keep track of where we are. But with our current approach, there's no way to tell where we are within a code point because the continuation bytes have no unique prefixes.

For example, it could be that one of the bytes in a code point was improperly encoded or is missing—maybe we received a continuation byte first when we should have received a leading byte. There are two ways to recover from this state:

1. Abort decoding the rest of the input.
2. Skip that code point and jump to the next character boundary.

The first strategy isn't ideal since one improperly encoded character would force us to stop decoding and discard the rest of the input. Thus, a single mistake could be catastrophic. That leaves us with the second option: skip the invalid code point and seek out the next correct byte so we can resume decoding the rest of the input. This auto-correcting behavior is known as <dfn>self-synchronization</dfn>.

But how do we jump ahead to the next valid code point boundary? With our current approach, it's not as simple as looking ahead for the next byte that starts with a `0`, `10`, `110`, or `1110`. By pure coincidence, the continuation bytes within a code point could start with those reserved prefixes, too. Consider this example:

```
Stream
Byte 1: [110]xxxxx
Byte 2: xxxxxxxx
Byte 3: [10]xxxxxx
...
```

We first see a byte with a leading prefix of `110`, signaling that we expect to parse a three-byte code point... Or so we think. But for all we know, it could be a misplaced continuation byte that just so happens to start with `110` because that's how it was encoded. This means we can't even reliably skip ahead to any given byte because there's no guarantee that we're going to be looking at leading bytes.

The fact that continuation bytes have no unique prefix also means that we can't index into a string by an integer offset—as many programming languages allow you to do—and figure out where we are within a given code point. For example, if we randomly index into the input and the byte we are looking at happens to start with `110`, is that a continuation byte that just so happens to start with `110` by pure coincidence, or is that a reserved `110` that identifies a leading byte? Once again, we don't know!

For these reasons, UTF-8 reserves prefixes not only for leading bytes but also for continuation bytes to disambiguate them from each other. All continuation bytes are prefixed with `10`, meaning all leading bytes now need an extra `1` for uniqueness:

```
1-byte code point: [0]xxxxxxx
2-byte code point: [110]xxxxx [10]xxxxxx
3-byte code point: [1110]xxxx [10]xxxxxx [10]xxxxxx
4-byte code point: [11110]xxx [10]xxxxxx [10]xxxxxx [10]xxxxxx
```

Our encoding scheme is now complete!

This allows the leading bytes to differentiate themselves from each other as well as from the continuation bytes. Thus, given any byte _anywhere_ in the input, we can count the number of leading `1s` to detect if it's a continuation byte or a leading byte. If it's a continuation byte, then we know we should be in the middle of a code point. This allows us to move forward or backward in the input sequence until we find the next valid code point boundary, allowing us to process the input one code point at a time. Thus, in UTF-8, we can safely encode and decode text containing a mixture of ASCII and higher Unicode ranges, without wasting space by forcing all code points to use a fixed number of bytes.

Sure, UTF-8 ends up using more space since we need to reserve all these bits for prefixes. But it's nowhere near as wasteful as UCS would have been, and the benefits far outweigh the cost.

{% aside %}
Earlier, I mentioned that UTF-16 can encode some characters with only a single 16-bit code unit, whereas UTF-8 would potentially need 3 bytes (24 bits). If you carefully examine UTF-8's 3-byte encoding scheme, you'll notice that it reserves exactly 8 bits for the prefixes: `[1110]xxxx [10]xxxxxx [10]xxxxxx`. When we ignore those reserved bits, only `24 - 8 = 16` bits actually come from the code point itself.

In UTF-16, we split the entire range of Unicode into two groups: one that only needs 16 bits (one code unit) to encode, and another that needs 32 bits (two code units). That first group doesn't need any unique prefixing in UTF-16: it's just encoded as-is and stuffed into 16 bits, even if that means some bits are unused/zeroed out. So UTF-8 is compatible with UTF-16 in that sense.
{% endaside %}

### UTF-8 Encoding and Decoding Lookup Table

So far, I've been vaguely referring to this notion of `n`-byte code points in UTF-8. But how do we tell whether a given Unicode code point should use one, two, three, or four bytes? Well, UTF-8 divides the entire set of Unicode characters into four groups:

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <caption><strong>Table 3</strong>: code point ranges for UTF-8. Source: <a href="https://en.wikipedia.org/wiki/UTF-8#Encoding" rel="noopener">Wikipedia article on UTF-8</a>.</caption>
    <thead>
      <tr>
        <th scope="col" class="numeric">Range</th>
        <th scope="col" class="numeric">Byte 1</th>
        <th scope="col" class="numeric">Byte 2</th>
        <th scope="col" class="numeric">Byte 3</th>
        <th scope="col" class="numeric">Byte 4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric"><code>U+0000–U+007F</code></td>
        <td class="numeric"><code>0xxxxxxx</code></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="numeric"><code>U+0080–U+07FF</code></td>
        <td class="numeric"><code>110xxxxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="numeric"><code>U+0800–U+FFFF</code></td>
        <td class="numeric"><code>1110xxxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
        <td></td>
      </tr>
      <tr>
        <td class="numeric"><code>U+010000–U+10FFFF</code></td>
        <td class="numeric"><code>11110xxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
        <td class="numeric"><code>10xxxxxx</code></td>
      </tr>
    </tbody>
  </table>
</div>

As expected, the start of one range is one more than the end of the previous range. For example, ASCII ends with code point `U+007F` (127), while the next range starts with `U+007F + 1 = U+0080 = 128`.

We use this lookup table to figure out which range a code point falls under; then, we encode it with one, two, three, or four bytes according to the specified byte schemes. For example, the Euro symbol `€` has a code point of `U+20AC` in Unicode, which falls in the range `U+0800–U+FFFF`. This means that its encoding would look like this:

```
1110xxxx 10xxxxxx 10xxxxxx
```

The placeholder bits will be filled in with bits from the code point itself. In our example, `U+20AC` is `0010000010101100` in binary. Filling in the bits from left to right, we get (prefixes surrounded with brackets for emphasis):

```
[1110]0010 [10]000010 [10]101100
```

And that's all there is to it! We just encoded our first Unicode character with UTF-8.

To decode this same character, we would identify the leading prefix—in this case, `1110`—and determine how many total bytes there are in the encoding. Then, we'd discard the prefixes and extract the remaining bits to get the original code point.

Encoding and decoding by hand isn't too difficult for us humans since it's a mostly visual art—look at a binary string, figure out its prefix, discard the prefixes, and we're done. But how would a computer program do this?

## The Math Behind UTF-8: Bitwise Operations

We're now at a point in this article where we can finally pull back the curtain and try to understand how UTF-8 encoding and decoding works in terms of the underlying math. I'll do my best to explain things in excruciating detail, so bear with me.

### Decoding: Bitwise AND

We can use the bitwise AND (`&`) operator to check a leading byte against the five possible prefixes. The bitwise AND operator works the same as the logical AND operator (implemented as `&&` or `and` in most programming languages), except it operates at the bit level, comparing bits at the same position in two numbers and setting a `1` at that position in the result only if both input bits are `1` at that same position. This is what the truth table looks like for the bitwise AND operator:

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col" class="numeric">a</th>
        <th scope="col" class="numeric">b</th>
        <th scope="col" class="numeric">a & b</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>1</code></td>
      </tr>
    </tbody>
  </table>
</div>

For example:

```
Num1:   110
Num2:   101
AND:    100
```

The leading bit of both numbers is `1`, so `1 & 1 = 1`. The remaining comparisons always do either `1 & 0` or `0 & 1`, both of which are `0`. Thus, `100 & 101 = 100`.

The bitwise AND operator is very useful for ignoring bits we don't care about while extracting bits that we _do_ care about. During the decoding process, it allows us to determine what prefix we are looking at.

Given a `byte`, we can use the bitwise AND operator to determine that it is:

- ASCII if `byte & 10000000 == 00000000 (0)`
- Intermediate byte if `byte & 11000000 == 10000000`
- Leading byte for 2-byte code point if `byte & 11100000 == 11000000`
- Leading byte for 3-byte code point if `byte & 11110000 == 11100000`
- Leading byte for 4-byte code point if `byte & 11111000 == 11110000`

Let me explain where these values come from. 

#### Checking Prefixes with Bitmasks

Suppose we receive a byte: `xxxxxxxx`. We want to start by checking if this represents an ASCII character, encoded as-is. We do this by checking if the byte's MSB is zero.

The way we do this is by constructing a comparison byte that we can bitwise-AND against our input byte to ignore some bits while keeping the ones that we're interested in. This "comparison" byte is known as a <dfn>bitmask</dfn>, or just "mask" for short. Bitmasks are used throughout computer science and are especially popular in game development.

{% aside %}
Bitmasks are used for more than just the bitwise AND operator. In a future section, we'll look at examples of the bitwise OR operator, and we'll still use bitmasks.
{% endaside %}

So how do we construct a bitmask to extract the very first bit of a number? Well, for starters, we don't care about the lower seven bits of the input since we're only interested in the leading bit, so let's zero out the corresponding bits in the mask so that the AND-ed output bits in the same positions will also be zero: `x0000000`. Finally, we'll turn on the leading bit in the mask to signify that we are interested in grabbing that corresponding bit from the input after AND-ing: `10000000`. In other words, we are now doing this:

```
  xxxxxxxx
& 10000000
==========
  x0000000
```

The mask of `10000000` says: "Give me the first bit of the input and ignore the remaining bits." It returns a new number whose MSB is `1` only if the input's MSB was `1`; otherwise, it sets a `0`. Observe that if the MSB is `0`, then _all_ of the output bits will be zero: `00000000`. And this is just the number zero. Thus, we have our first `if` statement:

```
// ASCII
if (byte & 0b1000000 == 0) {}
```

If this condition is `false`, then the input's MSB must be a `1`, which means the byte is not ASCII. Thus, we move on and check the remaining possibilities:

- Intermediate byte: `10xxxxxx`
- Leading byte for 2-byte code point: `110xxxxx`
- Leading byte for 3-byte code point: `1110xxxx`
- Leading byte for 4-byte code point: `11110xxx`

Is the input a continuation byte? Let's find out! We'll follow the same process as before to construct a bitmask. First, we'll set a zero for all of the bits that we want to ignore: `xxxxxxxx & xx000000`. Then, we'll fill in the remaining `x`s in the mask with `1`s to extract the corresponding bits from the input: `xxxxxxxx & 11000000`. Observe that the only time `xxxxxxxx & 11000000` will give us a result of `10000000` is if the input has a leading bit of `1` followed by a `0`—i.e., a leading prefix of `10`. And that prefix is precisely what identifies a continuation byte!

```
// Intermediate byte
if (byte & 0b11000000 == 0b10000000) {}
```

Repeat this process for all remaining prefixes, and for all remaining bytes in the input stream. If you encounter a byte that doesn't match any of these prefixes, then it couldn't have been encoded with UTF-8. Thanks to UTF-8 self-synchronization, you can move backward or forward in the stream to reach the next code point boundary.

### Encoding: Bitwise AND, OR, and Bit Shifting

Decoding is straightforward, but encoding is a bit more involved, so I saved it for last. It uses a clever combination of the bitwise AND and OR operators as well as bit shifting to fill in the placeholder bits. First, let's look at how to encode by hand so you get an intuitive feel for how it works; then, I'll show you how to do the same thing with bitwise operations.

Let's say we have a code point of `U+00FC` (the character `ü`). This falls in the range `U+0080–U+07FF` per Table 3, so we know we will need to encode this code point using two bytes:

```
Code point: 0x00FC
Range:      U+0080–U+07FF
Scheme:     110xxxxx 10xxxxxx
```

First, let's convert the hexadecimal code point to binary:

```
Code point (hex):       00FC
Code point (Binary):    11111100
```

The result is an 8-bit binary string. But if you look carefully, the two-byte encoding scheme has 11 placeholder bits (the `x`s) that need to be filled. To meet this target length, we'll pad the start of our binary string with three zeros, which doesn't change its value:

```
11111100 = 00011111100
```

In fact, any binary string has infinitely many leading zeros, so we don't need to explicitly do this padding. I just wanted you to see how we can't start filling in the placeholder bits with the leading `1` from the code point as-is. Otherwise, if we do that, we'll run out of bits when we try to fill in the second byte.

Great! Now we just fill in the 11 `x`s from left to right:

```
Code point: 00011111100
Scheme:     110xxxxx 10xxxxxx
Encoded:    11000011 10111100
```

Encoding by hand isn't too difficult since we don't need to do any math. But how do we do the same thing using bitwise operations?

Well, we have three tools at our disposal, one of which we're already familiar with from the previous section:

- **Bitwise AND** (`&`): useful for extracting bits we care about while ignoring others
- **Bitwise OR** (`|`): useful for merging/combining bits from two inputs
- **Bitwise right-shifting** (`>>`): shifts bits to the right by the specified number of places, discarding any bits that overflow to the right

The bitwise OR operator returns `0` if both operand are zero and `1` otherwise:

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col" class="numeric">a</th>
        <th scope="col" class="numeric">b</th>
        <th scope="col" class="numeric">a | b</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>0</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>1</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>0</code></td>
        <td class="numeric"><code>1</code></td>
      </tr>
      <tr>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>1</code></td>
        <td class="numeric"><code>1</code></td>
      </tr>
    </tbody>
  </table>
</div>

That takes care of that, but what about bit shifting? If you're not familiar with this concept, here's an example to kick things off:

```
10000001 >> 1 = 01000000
```

When shifting a number one bit to the right (which is what `>> 1` says to do), every bit moves over to the right, and the rightmost bit disappears. There's also left-shifting, but we don't need it for our purposes; it's just the exact opposite of right-shifting.

Recall that our code point `U+00FC` is `11111100` in binary, and it requires two bytes to encode in UTF-8. In the first encoded byte, we're going to have `110xxxxx`, so it's going to take five bits from the code point. In the second byte, we're going to have `10xxxxxx`, so we need to fill in its six missing bits. Here's what we know so far:

```
Code point:     11111100
Range:          U+0080–U+07FF
Byte 1:         110xxxxx
Byte 2:         10xxxxxx
```

{% aside %}
Remember, even though I'm not showing it here, the code point implicitly has infinitely many leading zeros.
{% endaside %}

First, I'll show you all of the calculations upfront, and then I'll explain how it works and where these seemingly arbitrary numbers come from:

```
Byte 1: 11000000 | ((codePoint >> 6) & 00011111)
Byte 2: 10000000 | (codePoint & 00111111)
```

The rightward bit shift of `codePoint >> 6` evaluates to `00000011`. Observe:

```
11111100 >> 1 = 01111110
11111100 >> 2 = 00111111
11111100 >> 3 = 00011111
11111100 >> 4 = 00001111
11111100 >> 5 = 00000111
11111100 >> 6 = 00000011
```

Substituting `codePoint >> 6` and `codePoint`:

```
Byte 1: 11000000 | (00000011 & 00011111)
Byte 2: 10000000 | (11111100 & 00111111)
```

Simplifying:

```
Byte 1: 11000000 | 00000011
Byte 2: 10000000 | 00111100
```

Solving, we get:

```
Byte 1: 11000011
Byte 2: 10111100
```

Which is the same as what we got by hand. Now, let's understand where these values came from.

Consider the first encoded byte, `110xxxxx`. We know we need to fill in the `x`s with bits from the code point, `11111100`. Here, it once again helps to explicitly visualize the code point with additional leading zeros to see all 11 bits that will get used:

```
00011111100
```

These 11 bits will eventually need to be distributed across the two encoded bytes. The upper five bits of this value (`00011`) will go towards the first encoded byte (`110xxxxx`), while the remaining lower `11 - 5 = 6` bits (`111100`) will go towards the second encoded byte (`10xxxxxx`). It helps to see this if we separate the code point into those five- and six-bit groups:

```
Code point: 00011 111100
Byte 1:     110xxxxx
Byte 2:     10xxxxxx
```

Now, how can we keep the upper five bits of the code point but line them up below the `x`s in `110xxxxx`? Another way to think about "keeping the upper five bits" of an 11-bit number is "discarding the lower `11-5=6` bits." If we can discard those six bits and scoot the upper five bits to the right, we'll get the intended outcome. And how do we discard lower bits while moving the upper bits to the right? With bit shifting! (Because remember, bits "drop off" to the right when you shift them.)

```
codePoint:          [00011]111100
codePoint >> 6:     000000[00011]
```

At this point, we are ready to extract the five bits from this shifted result. We do this by creating an appropriate bitmask whose lowest five bits are set to `1` while the upper three bits are `0` (since those are reserved by the first byte's encoding scheme): `00011111`.

```
Shifted:    00000011
Mask:       00011111
AND:        00000011
```

In this case, that just happens to give us the same value back. While masking in this case wasn't necessary, it's important in general, so I showed it here for consistency.

Finally, now that we've successfully extracted the upper five bits of our code point, we take our encoding scheme—in this case, `110xxxxx`—and zero out all of its placeholder bits to create a second mask: `11000000`. Then, we line up the two numbers and bitwise OR them to merge their bits:

```
Byte scheme:    110xxxxx
Mask:           11000000
codePoint >> 6: 00000011
OR:             11000011
```

Effectively, this fills in the five placeholder bits we were interested in. At this point, our first byte is fully encoded: `11000011`.

As for the second byte, we'll use the remaining lower `11 - 5 = 6` bits of the original code point as-is, without any shifting. (If we shifted, we would lose those bits.)

```
00011 [111100] <- we want these lower six bits
```

To extract those bits, we'll once again need to create an appropriate mask. This time, we want to clear the upper five bits and only consider the lower six bits:

```
Code point:             00011111100
Mask for lower 6 bits:  00000111111
AND:                       00111100
```

Then, we take our encoding scheme for the second byte—`10xxxxxx`—and zero out all of the placeholder bits to create a new mask. Finally, we apply the bitwise OR operator to merge the results of the previous two steps:

```
Byte 2: 10000000 | 00111100 = 10111100
```

Done! Putting it all together, we get the same result as before: `11000011 10111100`.

For more complex examples involving three or four bytes, you will just need to shift by larger amounts for the first, second, and third bytes. The last byte will never require any bit-shifting since the bits of interest are already in the lowest possible positions. Again, I'll leave this up to as an exercise.

## Know Your Character Encoding

If we know ahead of time that the encoding scheme used is UTF-8, we can easily follow the procedure outlined in the previous section to decode those bytes. But here's a question: _how_ do we know this?

Well, unless the sender tells us what encoding they used, we don't. Typically, this is done by sending the encoding name (in ASCII) along with the message. If the sender doesn't specify this information, then the receiver has to make an educated guess (maybe by looking for bit prefix patterns, although this could be misleading).

That's why the HTML example from the beginning of this article is so relevant:

```html
<head>
  <meta charset="utf-8">
</head>
```

When a browser or some other user agent parses your HTML document, it sees this meta tag, which assures the browser that you encoded your file in UTF-8, the required standard per the HTML spec. So the browser will do its best to decode the contents of the HTML document using UTF-8. And if it fails to do so, then you lied.

Now, why does this tag need to appear as early as possible in the `<head>` of a document? Well, because there are lots of other HTML tags—like meta descriptions or titles—that can appear elsewhere in the `<head>` or `<body>`, and those tags may contain non-ASCII characters in their `value` attributes. For example, a meta description tag could contain characters from Chinese or some other non-ASCII character set, and the browser needs to know how to decode those characters properly. By pure coincidence, it just so happens that all of the other characters between the very start of an HTML document and this meta tag are part of ASCII, so the browser can safely decode those bytes as-is until it reads the `charset`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <!-- ... -->
```

Hence why you need to declare this as early as possible—specifically, within the first 1024 bytes:

{% quote "HTML Living Standard: 4.2.5.4 Specifying the document's character encoding", "https://html.spec.whatwg.org/#charset" %}
The Encoding standard requires use of the UTF-8 character encoding and requires use of the "utf-8" encoding label to identify it. Those requirements necessitate that the document's character encoding declaration, if it exists, specifies an encoding label using an ASCII case-insensitive match for "utf-8"... The element containing the character encoding declaration must be serialized completely within the first 1024 bytes of the document.
{% endquote %}

## Case Study: String Length in JavaScript

We've covered a lot of interesting topics so far, so here's a bit of a curveball. In the intro to this article, I mentioned that the following JavaScript code doesn't quite behave like you'd expect. Can you guess what value it logs and why? As a reminder, JavaScript uses UTF-16 encoding. Hint: The emoji is special!

```js
console.log('Hi 👋'.length)
```

You may need to do some research to figure this one out. Consider revealing the hint below or looking at the answer if you're confused by the output.

{% details 'View hint' %}
In UTF-16, every character is encoded with either one 16-bit code unit or a maximum of two 16-bit code units. In UTF-16, code points `< 2^16` are encoded with one 16-bit code unit, as-is. Code points `>= 2^16` are encoded with two 16-bit code units.

The waving hand emoji (👋) has a code point of `U+1F44B`. Could translating this number into decimal or binary tell you how many code units it will require when encoded in UTF-16? Maybe that has something to do with the result.
{% enddetails %}

{% details 'View the answer and explanation' %}
If you answered `4`, you may be surprised to learn that you're wrong! The real answer is `5`. This is actually one of the few rare instances where it's not a JavaScript idiosyncrasy but rather the code is working as intended.

The reason this code logs `5` instead of `4` as one would expect is because JavaScript's `String.prototype.length` method counts the number of UTF-16 **code units** in a string, rather than the number of visible character glyphs.

The first three characters in the string are `H`, `i`, and ` ` (space), all three of which are in ASCII and can each be encoded with a single UTF-16 code unit (with a bunch of leading zeros that never get used, of course). This means that those three characters each contribute just one to the overall length of the string. However, unlike those three characters, the emoji `👋` is a very high-order Unicode character that requires two 16-bit code units to encode in UTF-16, so it actually contributes two to the overall string length. Thus, the total length is `3 + 2 = 5` instead of `4`.
{% enddetails %}

Because of this gotcha, many online character counters for text inputs are implemented incorrectly. For example, at the time when I wrote this article, Twitter's character counter went down by two instead of one whenever you used an emoji, whereas a user's expectation would be that the count changes by one.

(So how do you get an accurate character count? Use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)!)

## Summary

Unicode is the universal character set used by all modern software, but it doesn't tell us how to actually represent code points in memory: It simply assigns numbers to characters. With a character encoding standard like UTF, we can take those code points and represent them unambiguously so that they can be easily decoded later on. With UTF-8 specifically, we get backwards-compatibility with ASCII and the added bonus of self-synchronization, where we can easily find our place in a given byte stream and gracefully recover from decoding errors.

## References and Further Reading

- ["The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)" by Joel Spolsky](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
- ["UTF-8: Bits, Bytes, and Benefits" by Russ Cox](https://research.swtch.com/utf8)
- ["The Tragedy of UCS-2" by Una](https://unascribed.com/b/2019-08-02-the-tragedy-of-ucs2.html)
- [StackOverflow: UTF-8, UTF-16, and UTF-32](https://stackoverflow.com/questions/496321/utf-8-utf-16-and-utf-32)
- [StackOverflow: UTF-8 encoding why prefix 10?](https://stackoverflow.com/questions/53009692/utf-8-encoding-why-prefix-10/57750970#57750970)
- [Wikipedia: Universal Coded Character Set](https://en.wikipedia.org/wiki/Universal_Coded_Character_Set)
- [Wikipedia: UTF-8](https://en.wikipedia.org/wiki/UTF-8)
- [Wikipedia: UTF-16](https://en.wikipedia.org/wiki/UTF-16)
