---
title: Implementing the Caesar Cipher
description: The Caesar cipher is named after Roman emperor Julius Caesar, who used the technique to encrypt his military and political communication. Learn how to implement both a simple and keyed Caesar cipher in code.
keywords: [caesar cipher, keyed caesar cipher]
categories: [javascript, cryptography, math, security]
thumbnail:
  url: https://images.unsplash.com/photo-1648739614336-cf2ccf5634ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

The [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher) is named after Roman emperor Julius Caesar, who used the technique to encrypt his military and political communication. In a cipher, individual symbols (letters) of the plaintext message are substituted with other symbols to obscure their meaning. More specifically, the Caesar cipher is a _monoalphabetic cipher_, meaning it maps the input alphabet to a single cipher alphabet. Given a plaintext alphabet that exhaustively lists all of the symbols that could be used in a plaintext message, the Caesar cipher generates a corresponding _cipher alphabet_ by shifting each symbol of the plaintext alphabet `K` spaces to the right or left, wrapping them as needed if the end of the alphabet is reached. To encipher and decipher messages, all you need to know are two pieces of information: the value of `K` and the alphabet being used.

For example, suppose we're using the English alphabet:

```
abcdefghijklmnopqrstuvwxyz
```

A rightward Caesar shift of `K=1` would look like this:

```
plain:  abcdefghijklmnopqrstuvwxyz
cipher: bcdefghijklmnopqrstuvwxyza
```

To encipher a message, you would line up the two alphabets vertically and substitute every symbol in the plaintext message with the corresponding symbol from the cipher alphabet. Using the same example with `K=1` and the English alphabet, suppose we want to encipher the following message:

```
We are discovered. Flee at once!
```

To do this, we would first normalize the message by lowercasing all letters and removing all punctuation and whitespace (this is a standard practice in cryptography and not necessarily specific to this type of cipher). Doing so gives us the following simplified message:

```
wearediscoveredfleeatonce
```

Then, we substitute every plaintext symbol with its corresponding symbol from the cipher alphabet: `w` becomes `x`, `e` becomes `f`, and so on. In the end, we get the following ciphertext:

```
xfbsfejtdpwfsfegmffbupodf
```

Deciphering the message repeats the same process in reverse.

{% aside %}
A popular implementation of the Caesar cipher, known as [ROT13](https://rot13.com/), uses `K=13` and the English alphabet. What makes this so special is that it's perfectly symmetrical due to the fact that `13` is precisely half the length of the plaintext alphabet (there are `26` symbols in English). Thus, enciphering a ciphertext with the same parameters will give you back the original plaintext message.
{% endaside %}

In this article, we'll implement the Caesar cipher in JavaScript, but you can also implement it in whatever programming language you prefer. We'll also implement a variation of the algorithm, known as the _keyed Caesar cipher_, that seeds the cipher alphabet with a secret keyword.

## A Simple Caesar Cipher

Create a module named `caesarShift.js` and define an initially empty function with the following signature:

```js {data-file="caesarShift.js" data-copyable=true}
/**
 * @param {number} shift
 * @param {string[]} plaintextAlphabet
 */
const generateCaesarCipher = (shift, plaintextAlphabet) => {};

module.exports = {
  generateCaesarCipher,
};
```

We'll use this factory function to generate Caesar ciphers; the only two pieces of information we need are the shift value and the plaintext alphabet. This function will eventually return two functions: one to encipher a message and another to decipher a message. Thus, we can initialize a cipher once and reuse it an arbitrary number of times.

In an object-oriented language, you may prefer to implement this as a class rather than a function, but the functional approach works just as well.

### 1. Generating the Cipher Alphabet

Our first order of business is to generate the cipher alphabet from the plaintext alphabet:

```js {data-file="caesarShift.js" data-copyable=true}
const cipherAlphabet = plaintextAlphabet.map((_symbol, index) => {
  const newIndex = (index + shift) % plaintextAlphabet.length;
  return plaintextAlphabet[newIndex];
});
```

This creates a new array whose entries are those of the plaintext alphabet but shifted `shift` spaces to the right. We use the modulo operator (`%`) to account for overflow and wrap back to the start of the array as needed. For example, if we go past the letter `z` in English, our next candidate symbol will be chosen from the start: `a`, then `b`, and so on.

### 2. Enciphering and Deciphering Messages

Next, we'll implement two functions: One to encipher a message and another to decipher it. These will be defined in the scope of the original generator function, so they'll have access to the plaintext alphabet as well as the cipher alphabet we just created.

We'll start by implementing `encipher`, a functon that accepts a plaintext message and returns its corresponding ciphertext:

```js {data-file="caesarShift.js" data-copyable=true}
const encipher = (message) => {
  return message
    .toLowerCase()
    .split('')
    .map((symbol) => {
      const index = plaintextAlphabet.indexOf(symbol);
      return cipherAlphabet[index];
    })
    .join('');
};
```

We loop over each symbol in the plaintext message, look up its index in the plaintext alphabet, and map the symbol to its corresponding symbol in the cipher alphabet. Effectively, this simulates the act of stacking the two alphabets on top of one another.

Deciphering a message is the mirror opposite of enciphering. Rather than looking up a symbol's index in the plaintext alphabet, we'll look it up in the _cipher_ alphabet and then translate it to the corresponding symbol in the _plaintext_ alphabet:

```js {data-file="caesarShift.js" data-copyable=true}
const decipher = (message) => {
  return message
    .toLowerCase()
    .split('')
    .map((symbol) => {
      const index = cipherAlphabet.indexOf(symbol);
      return plaintextAlphabet[index];
    })
    .join('');
};
```

Finally, we'll return these two methods from our factory function:

```js {data-file="caesarShift.js" data-copyable=true}
return { encipher, decipher };
```

Now, we can use our function in another module:

```js {data-file="index.js" data-copyable=true}
const { generateCaesarCipher } = require('./caesarShift.js');
const rot13 = generateCaesarCipher(13, 'abcdefghijklmnopqrstuvwxyz'.split(''));
const encipheredMessage = rot13.encipher('wearediscoveredfleeatonce');
const decipheredMessage = rot13.decipher(encipheredMessage);
```

### Eliminating Duplicate Code

Because enciphering and deciphering are mirror operations in the Caesar cipher, their code is duplicated between the two functions we wrote. The only difference between them is which alphabet gets used to look up a symbol's index; the other alphabet is used to translate that symbol:

```js {data-file="caesarShift.js"}
const encipher = (message) => {
  return message
    .toLowerCase()
    .split('')
    .map((symbol) => {
      const index = plaintextAlphabet.indexOf(symbol);
      return cipherAlphabet[index];
    })
    .join('');
};

const decipher = (message) => {
  return message
    .toLowerCase()
    .split('')
    .map((symbol) => {
      const index = cipherAlphabet.indexOf(symbol);
      return plaintextAlphabet[index];
    })
    .join('');
};
```

Due to their symmetric nature, these functions can be combined into one using a higher-order function. Our new function will accept the source and target alphabets and return the final function that eventually translates a given message:

```js {data-file="caesarShift.js" data-copyable=true}
const makeTranslator = (sourceAlphabet, targetAlphabet) => (message) => {
  return message
    .toLowerCase()
    .split('')
    .map((symbol) => {
      const index = sourceAlphabet.indexOf(symbol);
      return targetAlphabet[index];
    })
    .join('');
};
```

Now, we'll update our return statement to generate the `encipher` and `decipher` functions, supplying the alphabets in the correct order:

```js {data-file="caesarShift.js" data-copyable=true}
return {
  // plaintext -> cipher
  encipher: makeTranslator(plaintextAlphabet, cipherAlphabet),
  // cipher -> plaintext
  decipher: makeTranslator(cipherAlphabet, plaintextAlphabet),
};
```

### Final Version

Here's the full code for the simple (unkeyed) variation of the Caesar cipher:

```js {data-file="caesarShift.js" data-copyable=true}
/**
 * @param {number} shift
 * @param {string[]} plaintextAlphabet
 */
const generateCaesarCipher = (shift, plaintextAlphabet) => {
  const cipherAlphabet = plaintextAlphabet.map((_symbol, index) => {
    const newIndex = (index + shift) % plaintextAlphabet.length;
    return plaintextAlphabet[newIndex];
  });

  const makeTranslator = (sourceAlphabet, targetAlphabet) => (message) => {
    return message
      .toLowerCase()
      .split('')
      .map((symbol) => {
        const index = sourceAlphabet.indexOf(symbol);
        return targetAlphabet[index];
      })
      .join('');
  };

  return {
    cipherAlphabet,
    encipher: makeTranslator(plaintextAlphabet, cipherAlphabet),
    decipher: makeTranslator(cipherAlphabet, plaintextAlphabet),
  };
};

module.exports = {
  generateCaesarCipher,
};
```

## Keyed Caesar Cipher

Observe that if we use a shift of `K=0`, we get the original alphabet back, and the ciphertext is identical to the plaintext. We run into the same problem if we use a shift that's equal to the size of the alphabet since it wraps back around to the start. Thus, the valid keys for a Caesar cipher are limited to the range `[1, L-1]` (inclusive of both endpoints), where `L` is the size of the alphabet. In the case of the English alphabet, that leaves us with just 25 keys. Because the Caesar cipher has such a small number of keys, a ciphertext can easily be deciphered with brute force by testing different keys until the message makes sense: `K=1`, `K=2`, all the way through `K=L-1`.

To work around this issue, we can seed our cipher alphabet with a secret key: an agreed-upon word or phrase that introduces noise into our cipher alphabet. In the keyed Caesar cipher, we first take our chosen keyword and remove duplicate symbols from it. Suppose we've agreed to use the keyword `julius`. If we remove duplicate symbols from this string, we get `julis`.

Next, we filter the plaintext alphabet down to the remaining (unused) symbols while preserving their original order. If we're using the English alphabet, that would leave us with the following symbols:

```
abcdfgijkmnpqrstuvwxyz
```

Then, we prefix the deduped keyword to those remaining symbols, giving us the complete set of 26 English letters, but now rearranged in a more unpredictable manner:

```
heloabcdfgijkmnpqrstuvwxyz
```

Finally, we shift this intermediate result to generate the cipher alphabet. Below is an example with `K=13`:

```
mnpqrstuvwxyzheloabcdfgijk
```

The remainder of the algorithm is the same as before.

Let's implement this variation by allowing our function to accept an optional key as the third argument:

```js {data-file="caesarShift.js" data-copyable=true}
/**
 * @param {number} shift
 * @param {string[]} plaintextAlphabet
 * @param {string} key
 */
const generateCaesarCipher = (shift, plaintextAlphabet, key = '') => {};
```

If a key isn't provided, the function will behave like a normal Caesar cipher.

### 1. Removing Duplicate Symbols from the Key

In the keyed version of the Caesar shift algorithm, we'll begin by filtering out duplicate symbols from the key. This can be easily accomplished with a set. We'll leave the result in set form to make it easier to look up a particular symbol when filtering the plaintext alphabet:

```js {data-file="caesarShift.js" data-copyable=true}
const uniqueKeySymbols = new Set(key.toLowerCase().split(''));
```

### 2. Filtering the Plaintext Alphabet

Next, we'll filter the plaintext alphabet so that only the unused symbols remain:

```js {data-file="caesarShift.js" data-copyable=true}
const unusedPlaintextSymbols = plaintextAlphabet.filter((symbol) => !uniqueKeySymbols.has(symbol));
```

If a key isn't specified, this will just give us back the plaintext alphabet.

### 3. Shifting the Keyed Alphabet

Finally, we'll combine these two arrays and map the result as we did before, shifting each element by the specified number of places:

```js {data-file="caesarShift.js" data-copyable=true}
const cipherAlphabet = Array.from(uniqueKeySymbols)
  .concat(unusedPlaintextSymbols)
  // Shift the keyed alphabet to the right
  .map((_symbol, index, alphabet) => {
    const newIndex = (index + shift) % alphabet.length;
    return alphabet[newIndex].toLowerCase();
  });
```

The rest of the code remains unchanged. Here it is in its entirety:

```js {data-file="caesarShift.js" data-copyable=true}
const generateCaesarCipher = (shift, plaintextAlphabet, key = '') => {
  // Example: julius => julis
  const uniqueKeySymbols = new Set(key.toLowerCase().split(''));

  // Example: abcdefghkmnopqrtvwxyz
  const unusedPlaintextSymbols = plaintextAlphabet.filter((symbol) => !uniqueKeySymbols.has(symbol));

  // Example: If shift = 13 and key = julius, we get kmnopqrtvwxyzjulisabcdefgh
  const cipherAlphabet = Array.from(uniqueKeySymbols)
    .concat(unusedPlaintextSymbols)
    .map((_symbol, index, alphabet) => {
      const newIndex = (index + shift) % alphabet.length;
      return alphabet[newIndex].toLowerCase();
    });

  const makeTranslator = (sourceAlphabet, targetAlphabet) => (message) => {
    return message
      .toLowerCase()
      .split('')
      .map((symbol) => {
        const index = sourceAlphabet.indexOf(symbol);
        return targetAlphabet[index];
      })
      .join('');
  };

  return {
    cipherAlphabet,
    encipher: makeTranslator(plaintextAlphabet, cipherAlphabet),
    decipher: makeTranslator(cipherAlphabet, plaintextAlphabet),
  };
};
```

## Still Not Good Enough

Whereas the Caesar cipher once reigned supreme in the very early days of cryptography, it's now one of the most trivial ciphers to crack. Even the keyed Caesar cipher is not much better than the original—like other monoalphabetic substitution ciphers, it's vulnerable to [frequency analysis](https://en.wikipedia.org/wiki/Frequency_analysis), where the frequency of each symbol in the ciphertext is compared to the known frequencies of symbols in a sufficiently large sample of text from the same alphabet to slowly piece together the plaintext message.

Nevertheless, it's a fun algorithm to play around with and implement in code. If you'd like to see the Caesar cipher in action, you can use this tool that I built to encipher and decipher some sample messages: https://cryptography-algorithms.netlify.app/caesar/. And if you're interested in learning more about this and other algorithms, I recommend reading *[The Code Book](https://openlibrary.org/works/OL31157W/The_Code_Book?edition=ia%3Acodebookevolutio00sing)* by Simon Singh.

{% include unsplashAttribution.md name: "Gertrud", username: "gertrudl", photoId: "oswdQcEop8Q" %}
