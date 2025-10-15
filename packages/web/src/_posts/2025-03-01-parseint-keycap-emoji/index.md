---
title: To Parse an Int
description: Why does JavaScript's parseInt treat keycap emoji as integers? Is it a bug, a feature, or both?
categories: [javascript, unicode]
keywords: [parseInt, keycap emoji]
lastUpdated: 2025-03-08
---

In a recent thread online, [imlunahey](https://bsky.app/profile/imlunahey.com/post/3lin3nrlaw22q) and [Ryan Winchester](https://bsky.app/profile/winchester.dev/post/3lin4bcvtrs2j) noticed that JavaScript's `parseInt` behaves a bit strangely with keycap emoji:

```js
parseInt('1️⃣', 10) === 1 // true
parseInt('2️⃣', 10) === 2 // true
parseInt('3️⃣', 10) === 3 // true
```

At first glance, this seems like yet another JavaScript quirk. But in reality, it's working as intended... sort of. Let me explain.

## Background: Unicode and UTF

I previously wrote a [deep dive on Unicode and UTF](/blog/introduction-to-unicode/) that will help you understand what's going on here. Since it would take too much effort for me to summarize that article here, I'm going to assume you've already read it or are at least familiar with the following terms:

- Character set
- Unicode
- Code point
- Code unit
- UTF-8
- UTF-16
- Grapheme
- Grapheme clusters

To keep things short, I'll review some of the most important facts.

### UTF-16

First, JavaScript uses UTF-16 for string encoding, which means that every Unicode code point is encoded with either one 16-bit code unit or two 16-bit code units (known as a <dfn>surrogate pair</dfn>):

1. One 16-bit code unit for the first `2^16` code points: `xxxxxxxxxxxxxxxx`, or 
2. Two 16-bit code units for the rest: `xxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxx`.

Again, if none of that makes sense, I encourage you to read my article.

### String Iteration and Length

In most programming languages, string iteration operates at the code unit level rather than the grapheme (visible character) level. For example, in JavaScript, `String.prototype.length` counts the number of UTF-16 code units, not the number of graphemes. This is why certain emoji and other higher order Unicode code points may contribute more than `1` to the length of a string. Importantly, this is true not only in JavaScript but also in lots of other popular programming languages. For example, `strlen("👋")` gives `4` in the programming language C because C uses UTF-8 for string encoding, and the maximum number of bytes for a code point in UTF-8 is four.

### Emoji Presentation Sequences

The most relevant fact for our discussion is that Unicode allows you to combine code points to render special characters. Such a sequence of Unicode code points is known as a <dfn>grapheme cluster</dfn> since individual graphemes (characters) are chained (clustered) in a specific order that is interpreted differently by software.

Accented letters are a popular example of grapheme clusters. While the letter é technically exists on its own in Unicode as the <dfn>precomposed character</dfn> `U+00E9`, it can also be created by chaining two code points one after another:

1. `e` (`U+0065`), the lowercase Latin letter E.
2. &#x301; (`U+0301`), known as Combining Acute Accent in Unicode.

Don't believe me? Try [rendering the following HTML](https://jsfiddle.net/gkdmyqhf/):

```html
&#x0065;&#x0301;
```

You'll get `é`, just as if you had printed the precomposed character.

Additionally, Unicode allows you to take an otherwise ordinary code point and render it as an emoji using something called an <dfn>[emoji presentation sequence](https://www.unicode.org/emoji/charts/emoji-variants.html)</dfn>. For example, 2️⃣ doesn't have its own code point in Unicode, meaning it's technically not an emoji. Instead, it's the result of chaining the following three code points:

1. First, the ASCII number `2` (`U+0032`).
2. Then, something called a "variation selector," (`U+FE0F`).
3. Finally, the combining enclosing keycap character (`U+20E3`).

These code points are summarized in the table below:

<div class="scroll-x" role="region" tabindex="0">
  <table>
    <caption>Code points that comprise the emoji 2️⃣</caption>
    <thead>
      <tr>
        <th scope="col" class="numeric">Code point</th>
        <th scope="col" class="numeric">Character</th>
        <th scope="col">Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="numeric"><code>0x0032</code></td>
        <td class="numeric">2</td>
        <td><a href="https://www.unicode.org/charts/PDF/U0000.pdf">DIGIT TWO</a></td>
      </tr>
      <tr>
        <td class="numeric"><code>0xFE0F</code></td>
        <td class="numeric">&#xFE0F; (invisible)</td>
        <td><a href="https://www.unicode.org/charts/PDF/UFE00.pdf">VARIATION SELECTOR-16</a></td>
      </tr>
      <tr>
        <td class="numeric"><code>0x20E3</code></td>
        <td class="numeric">&#x20E3;</td>
        <td><a href="https://www.unicode.org/charts/PDF/U20D0.pdf">COMBINING ENCLOSING KEYCAP</a></td>
      </tr>
    </tbody>
  </table>
</div>

Software that supports emoji presentation sequences will see these three code points and understand that it should render the ASCII numeral `2` on top of a colored keycap, as if it were an emoji. This behavior depends entirely on implementation and conformance—programs that don't support emoji sequences will fall back to rendering the individual characters.

Again, you can verify this by rendering those individual code points as HTML entities in any HTML document. Assuming your font supports emoji, and your browser respects and understands emoji presentation sequences (as most, if not all, browsers do), these entities should render as 2️⃣:

```html
<!-- This should render as 2️⃣ -->
&#x0032;&#xFE0F;&#x20E3;
```

Now, let's apply this knowledge to the following code:

```js {data-file="test.js"}
console.log('2️⃣'.length);
```

You might expect to see `1` because there's only one grapheme on screen, but the output is `3`. Again, the reason for this has to do with all the aforementioned facts. First, 2️⃣ isn't a single code point. If it were, its maximum possible length would be `2` since JavaScript uses UTF-16, and a single character can't be encoded with more than two UTF-16 code units. Instead, as we learned, 2️⃣ is rendered from a very specific sequence of three code points (characters).

However, that fact _alone_ doesn't explain why the length is `3`—because as previously mentioned, some code points in UTF-16 may be encoded with two code units instead of just one, contributing `2` to the length of a string. Rather, the reason why we get `3` is because all three of the code points that comprise 2️⃣ happen to fall within the first `2^16` code points in Unicode (known as the [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane)). As previously mentioned, this means that each character can fit within one UTF-16 code unit. Thus, `1+1+1=3`.

Let's try iterating over the string to inspect the individual characters and their corresponding code points:

```js {data-copyable="true"}
for (const char of '2️⃣') {
  console.log(`"${char}"="0x${char.codePointAt(0).toString(16)}"`);
}
```

Output:

```
"2"="0x32"
"️"="0xfe0f"
"⃣"="0x20e3"
```

As you can imagine, this could produce unexpected results in algorithms that parse "characters" from strings and try to interpret them as numbers. And that leads us to our next discussion.

## How `parseInt` Works

The `parseInt` function takes two arguments:

1. An input string to parse, and
2. An optional radix (base) in which to operate.

Then, `parseInt` attempts to parse the given input string in the specified radix, returning `NaN` if it fails. For example, `parseInt('100', 2)` returns `4` since the radix of `2` tells the function to parse the input in base-two (binary), while `parseInt('100', 10)` returns `100`. Although the radix argument is optional, not specifying it can produce unexpected results, so you should always pass it in.

With all of that in mind, why does `parseInt('2️⃣', 10)` return `2` instead of `NaN`? Well, this is where JavaScript behaves somewhat unexpectedly. Consulting MDN, we find the following explanation:

{% quote "parseInt, MDN Web Docs", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt" %}
If `parseInt` encounters a character in the input string that is not a valid numeral in the specified radix, it ignores it and all succeeding characters and returns the integer value parsed up to that point. For example, `parseInt("2", 2)` returns `NaN` because `2` is not a valid numeral in the binary number system. Likewise, although `1e3` technically encodes an integer (and will be correctly parsed to the integer `1000` by `parseFloat()`), `parseInt("1e3", 10)` returns `1`, because `e` is not a valid numeral in base 10. Because `.` is not a numeral either, the return value will always be an integer.
{% endquote %}

Now that we know how string iteration and emoji presentation sequences work, we can make sense of how `parseInt` sees the string `"2️⃣"`:

1. `parseInt` iterates over the input string one code unit at a time.
2. First, it sees `U+0032` (`2`), which is a valid base-10 digit.
3. Next, it encounters `U+FE0F`, which isn't a valid base-10 digit.

At this point, the algorithm terminates and ignores everything after the `2`, returning `2` just as if we had done `parseInt('2', 10)`.

Now, you may think that this is unintuitive or incorrect, and I agree. I'd argue that the code should return `NaN` or throw an error instead of simply discarding the rest of the input string and assuming that you _wanted_ to parse just the numeric prefix. As the MDN docs note, it's the same reason why `parseInt` is unable to understand scientific notation, so `parseInt('2e1', 10)` returns `2` instead of `20`.

{% aside %}
This behavior is disappointing, sure, but web development wouldn't be nearly as exciting if JavaScript were a sane and predictable language.
{% endaside %}

## Further Reading

Thanks for reading! I hope you learned something new. In addition to [my article on Unicode](/blog/introduction-to-unicode/), I also encourage you to read the following articles to learn more:

- ["The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)" by Joel Spolsky](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
- ["It's Not Wrong that "🤦🏼‍♂️".length == 7" by Henri Sivonen](https://hsivonen.fi/string-length/)