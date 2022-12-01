---
title: Modular Arithmetic and the Diffie-Hellman Algorithm
description: Using the properties of congruence modulo, Alice and Bob can generate a shared private key and communicate publicly, while Eve will struggle to decipher their messages.
keywords: [diffie hellman, congruence modulo, key exchange]
categories: [cryptography, security, math, number-theory]
layout: mathPost
lastUpdated: 2022-12-01
---

I recently took an interest in cryptography and began working through Simon Singh's *The Code Book* and some supplementary resources for beginners. For the most part, it was smooth sailing until I arrived at the chapter on public key cryptography and [the Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange). The concept itself made sense after I read through some analogies involving color mixing, especially in this video by Art of the Problem: [Public key cryptography - Diffie-Hellman Key Exchange (full version)](https://www.youtube.com/watch?v=YEBfamv-_do&t=162s). But I knew that anything more than a superficial understanding of this algorithm was going to require that I become comfortable with the math.

What bothered me is that I couldn't find many good resources on the Diffie-Hellman key exchange algorithm that really took the time to explain all the math in depth, from start to finish. And most resources assumed I'd fill in the gaps myself. For example, the Computerphile YouTube channel has a great introductory video on [the math behind Diffie-Hellman](https://www.youtube.com/watch?v=Yjrfm_oRO0w), but it glosses over one of the most important parts—namely, why congruence modulo guarantees that Alice and Bob will arrive at the same private key. So, in this article, I want to first explain congruence modulo in a way that made it click for me and then apply that understanding to the Diffie-Hellman key exchange.

{% include "toc.md" %}

## Prerequisite Knowledge

### Modular Arithmetic and the Modulo Operator

In number theory, the binary <dfn>modulo operation</dfn> gives the remainder of dividing one number by another number. For example, the remainder of dividing $7$ by $3$ is $1$. We say that $7 \bmod 3 = 1$; we refer to the $3$ as the <dfn>modulus</dfn> or <dfn>base</dfn> of the operation.

Remainders are closely related to the [division algorithm](https://sites.math.washington.edu/~lee/Courses/300-2017/division-theorem.pdf):

{% definition "Division algorithm" %}
Let $a$ and $b$ be integers such that $b \neq 0$. Then there exist unique integers $q$ and $r$ such that $a = qb + r$, where $0 \leq r < |b|$.
{% enddefinition %}

All this says is that if we have two integers $a$ and $b$, we can express $a$ as a multiple of $b$ plus some constant remainder. Or, said differently, if we divide some integer $a$ (*dividend*) by a non-zero integer $b$ (*divisor*), we'll get an integer known as the *quotient* ($q$) and a *remainder* ($r$). This should sound familiar from your days of long division. Notice that the remainder can be zero if the quotient divides evenly into the dividend, as in $4 \div 2$.

The binary modulo operator ($a \bmod b$) just gives us the remainder ($r$) in this equation. For example:

- $0 \bmod 4 = 0$ because $0 = 0(4) + 0$
- $1 \bmod 4 = 1$ because $1 = 0(4) + 1$
- $2 \bmod 4 = 2$ because $2 = 0(4) + 2$
- $3 \bmod 4 = 3$ because $3 = 0(4) + 3$
- $4 \bmod 4 = 0$ because $4 = 1(4) + 0$
- $5 \bmod 4 = 1$ because $5 = 1(4) + 1$
- $6 \bmod 4 = 2$ because $6 = 1(4) + 2$
- $7 \bmod 4 = 3$ because $7 = 1(4) + 3$
- etc.

Modular arithmetic also works with negative integers:

- $-1 \bmod 4 = 3$ because $-1 = -1(4) + 3$
- $-2 \bmod 4 = 2$ because $-2 = -1(4) + 2$
- $-3 \bmod 4 = 1$ because $-3 = -1(4) + 1$
- $-4 \bmod 4 = 0$ because $-4 = -1(4) + 0$
- $-5 \bmod 4 = 3$ because $-5 = -2(4) + 3$
- etc.

The modulo operation always has a finite range of $[0, b-1]$. In other words, if we divide any number by $b$, we're always going to get a result in the set $\{0, 1, 2, 3, ..., b - 1\}$. Once we evaluate $b \bmod b$, we wrap back around to zero. $(b + 1) \bmod b$ gets us back to $1$, and so on. In the examples above, our range is $\{0, 1, 2, 3\}$ because $b = 4$.

#### Modulo as a One-Way Function

One useful property of the modulo operator is that it's a **one-way function**: Given some modulus $p$, there are infinitely many possible inputs that can generate the same remainder. For example, if I tell you that $x \bmod 4 = 3$, you'll have a hard time figuring out what value of $x$ I used to generate this output. There are infinitely many candidates—I could've used $x = 3$, $x = -1$, $x = -5$, $x = 12358712385235$, and so on.

{% aside %}
In the context of the Diffie-Hellman key exchange algorithm, which we'll look at later, the problem is more about finding a value of $x$ in $r = g^x \bmod p$, where the values of $r$, $g$, and $p$ are all known and only $x$ remains to be found. This is known as the [discrete logarithm problem](https://en.wikipedia.org/wiki/Discrete_logarithm), and it's very difficult to solve if we pick a large prime number for $p$.
{% endaside %}

### Divisibility

Since modular arithmetic is about remainders, and remainders arise from division, it's important to understand the concept of divisibility and the notation that we use:

{% definition "Divisibility" %}
If $b$ divides $a$, then there exists some integer $k$ such that $a = kb$. We use the notation $b|a$ to mean that $b$ divides $a$.
{% enddefinition %}

Here are some examples of this notation:

- $2|4$ because $4 = 2(2)$ (two divides four)
- $3|15$ because $15 = 3(5)$ (three divides fifteen)
- $1|a$ because $a = 1(a)$ (one divides any number)
- If $x \neq 0$, then $x|x$ because $x = 1(x)$ (any nonzero number divides itself)

This notation for divisibility will be important in the next section on congruence modulo.

### Congruence Modulo

Now that we have a better understanding of the modulo operator and some of its related notations, let's understand one of the most important concepts underlying the Diffie-Hellman key exchange: [**congruence modulo**](https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/congruence-modulo).

Earlier, we observed that there are many numbers that, when divided by $p$, give us the same remainder. For example:

- $9 \bmod 4 = 1$
- $5 \bmod 4 = 1$
- $1 \bmod 4 = 1$
- ... and so on.

It would be inconvenient to have to spell out this relationship with words every time we want to express this "sameness," so we can instead use a special notation to mean the same thing:

$$
a \equiv b \pmod{p}
$$

You would read this as: "$a$ and $b$ are congruent modulo $p$." In plain terms, this says that $a$ and $b$ have the same remainder when divided by $p$.

{% aside %}
**Heads up!** Don't mistake the $(\bmod\; p)$ on the right-hand side for the *binary modulo operation* itself or for multiplication. In other words, this is NOT saying that $a$ is equal to $b \bmod p$. Rather, $(\bmod\; p)$ in parentheses is merely there to remind us that we're *working in modulo $p$*, but we're not saying that $a = b \bmod p$. Whenever you see $(\bmod\; p)$ in a congruence relation with parentheses, you should think of it as a label identifying our "modulo world," so to speak. We say that $a$ and $b$ are equivalent under these circumstances.
{% endaside %}

{% aside %}
Another important point is that the equivalence symbol, $\equiv$, is not the same as the *equality* symbol, $=$. Two numbers are equal if they are exactly the same. But in an equivalence relation, we get to define what exactly "equivalence" means. In *congruence modulo*, equivalence means "having the same remainder when divided by a number $p$." So two numbers may be *congruent under a relation*, but they need not be the same number. For example, $1 \neq 5$, but $1 \equiv 5 \pmod{4}$. By analogy, apples don't equal oranges, but apples and oranges are equivalent under the relation of "belonging to the set of fruits."
{% endaside %}

For example, in our earlier exploration, we found that many numbers map to the same remainder when divided by $4$. Here are just some of those congruence relations:

- $0 \equiv 4 \pmod{4}$ because $0 = 0(4) + 0$ and $4 = 1(4) + 0$
- $1 \equiv 5 \pmod{4}$ because $1 = 0(4) + 1$ and $5 = 1(4) + 1$
- $-3 \equiv 5 \pmod{4}$ because $-3 = -1(4) + 1$ and $5 = 1(4) + 1$
- $3 \equiv 7 \pmod{4}$ because $3 = 0(4) + 3$ and $7 = 1(4) + 3$

#### Congruence Modulo and Divisibility

Okay, so congruence modulo means that two numbers $a$ and $b$ have the same remainder when divided by $p$, so we say that $a \equiv b \pmod{p}$. But we can also express this relationship in equation form by applying the division algorithm to $a \div p$ and $b \div p$:

$$
a = q_1(p) + r \\
b = q_2(p) + r
$$

For some $q_1, q_2 \in \Z$.

Observe that $p$ and $r$ are the same in both equations; this is because $p$ is the shared modulus, and $r$ is the shared remainder. This is just another way of expressing the same idea behind $a \equiv b \pmod{p}$.

Subtracting the second equation from the first gives us:

$$
(a - b) = (q_1 - q_2)p
$$

Since $q_1 \in \Z$ and $q_2 \in \Z$, it follows that $q_1 - q_2 \in \Z$, so this goes back to our definition of divisibility, which says that $a - b$ is divisible by $p$ if it can be written as some integer multiple of $p$. Indeed, that's the case here! So we can conclude that:

$$
p|a-b
$$

This leads us to an equivalent and very useful definition of congruence modulo:

{% definition "Congruent modulo" %}
Two integers $a$ and $b$ are congruent modulo $p$ if $p|a - b$. (Or, equivalently, if $p|b-a$ since we can factor out a $(-1)$ from both sides: $b - a = (q_2 - q_1)p = q_3p$. In other words, $a \equiv b \pmod{p}$ is symmetric.)
{% enddefinition %}

This fact may not seem all that exciting, but it makes it easier for us to prove several useful properties of congruence modulo that are essential to understanding the math in the Diffie-Hellman exchange. And that's precisely what we'll do in the next section.

#### Congruence Modulo Rules

A big thanks to the following resources for helping me with these proofs:

- [Bill Dubuque's answer on the Math StackExchange forum](https://math.stackexchange.com/a/762060/287621)
- https://proofwiki.org/
- [Quantitative Reasoning: Computers, Number Theory and Cryptography (PDF)](https://www.math.nyu.edu/~hausner/congruence.pdf).

I highly recommend working through them yourself—these proofs are going to help us understand how the math works in the Diffie-Hellman key exchange.

Note that there are more modulo rules than the ones we're going to focus on here for the purposes of understanding Diffie-Hellman. For example, congruence modulo also obeys a sum rule that, while interesting, is not relevant to our discussion.

##### Congruence of Remainder

{% definition "Congruence of remainder" %}
Let $r = a \bmod p$ be the remainder of dividing $a$ by $p$. Then $r \equiv a \pmod{p}$. That is, both $r$ and $a$ generate the same remainder when divided by $p$. Intuitively, this just means that a remainder keeps returning itself if we repeatedly divide it by the modulus that generated it in the first place.
{% enddefinition %}

Proof: This is an if-and-only-if statement, so we'll prove both directions.

First, suppose $r = a \bmod p$ is the remainder of dividing $a$ by $p$. Then, by applying the division algorithm to $a$ and $p$, we can also express this fact as $a = qp + r$, where $q \in \Z$ is the quotient of dividing $a$ by $p$ and $r \in \Z$ is the same remainder as in our statement. Now, we want to show that $p|r-a$ to prove that $r \equiv a \pmod{p}$. We can do this by rearranging the equation:

$$
a = qp + r \\
a - r = qp \\
r - a = p(-q) \\
p|r-a \\
r \equiv a \pmod{p}
$$

{% aside %}
Note that we could've just as well proven that $a \equiv r \pmod{p}$, in which case we'd need to show that $p|a-r$, which is the second equation in the work we did above. Congruence modulo is a symmetric relation, meaning it doesn't matter whether we write $a \equiv b \pmod{p}$ or $b \equiv a \pmod{p}$.
{% endaside %}

Now, for the reverse direction, suppose that $r \equiv a \pmod{p}$. Then it follows by the definition of congruence modulo that $p|r-a$, which in turn means we can write $r-a$ as a multiple of $p$ for some constant $k_1 \in \Z$:

$$
r - a = k_1p \\
-a = k_1p - r \\
a = (-k_1)p + r \\
a = k_2p + r
$$

Where $k_2 = -k_1 \in Z$.

Per the division algorithm, this equation tells us that $r = a \bmod p$ is the remainder of dividing $a$ by $p$.

{% aside %}
**Example**: $2 = 6 \bmod 4$ is the remainder of dividing $6$ by $4$. Per the fact we just proved, this means that the remainder of dividing $2$ by $4$ must also be $2$. Indeed, it is! Thus, $2 \equiv 6 \pmod{4}$.
{% endaside %}

##### Congruence of Product

{% definition "Congruence of product" %}
If $a \equiv b \pmod{p}$ and $c \equiv d \pmod{p}$, then $ac \equiv bd \pmod{p}$.
{% enddefinition %}

Proof: By definition of congruence modulo, if $a \equiv b \pmod{p}$ and $c \equiv d \pmod{p}$, then $p|a-b$ and $p|c-d$. This allows us to write two equations:

$$
a-b = k_1(p) \\
c-d = k_2(p)
$$

For some $k_1, k_2 \in \Z$.

Rearranging these equations to solve for $a$ and $c$, we get:

$$
a = k_1(p) + b \\
c = k_2(p) + d
$$

Finally, multiplying the two equations together gives us:

$$
ac = (k_1p + b)(k_2p + d) \\
ac = k_1k_2p^2 + k_1dp + k_2bp + bd \\
ac - bd = p(k_1k_2p + k_1d + k_2b) \\
$$

Since $k_1, k_2, p, b, d \in \Z$, it must be true that $k_3 = k_1k_2p + k_1d + k_2b \in \Z$. Thus, this simplifies to:

$$
ac - bd = p(k_3)
$$

Therefore, $p|ac-bd$, which means that $ac \equiv bd \pmod{p}$.

{% aside %}
**Example**: $3 \equiv 7 \pmod{4}$ because $3 \bmod 4 = 3$ and $7 \bmod 4 = 3$. Likewise, $2 \equiv 6 \pmod{4}$ because $2 \bmod 4 = 2$ and $6 \bmod 4 = 2$. Then, from the fact we just proved, it should be the case that $3\times2 \equiv 7\times6 \pmod{4}$, or $6 \equiv 42 \pmod{4}$. This is true because $42 = 10(4) + 2$ and $6 = 1(4) + 2$.
{% endaside %}

##### Congruence of Powers

Congruence modulo also has the following useful property:

{% definition "Congruence of powers" %}
If $a \equiv b \pmod{p}$, then $a^n \equiv b^n \pmod{p}$.
{% enddefinition %}

In other words, this says that if two integers have the same remainder when divided by $p$, then they will still have the same remainder as each other when divided by $p$ if we raise both of them to the same power. (But the remainder need not be the same as before.)

Proof: We will use a [proof by weak induction](https://en.wikipedia.org/wiki/Mathematical_induction).

Suppose that $a \equiv b \pmod{p}$. For the base step of $n = 1$, this is tautologically true because $a^1 \equiv b^1 \pmod{p} \iff a \equiv b \pmod{p}$, which we're told is the case. Next, suppose $n > 1$. We will show that if $a^n \equiv b^n \pmod{p}$, then $a^{n+1} \equiv b^{n+1} \pmod{p}$.

Induction step: Suppose $a^n \equiv b^n \pmod{p}$ for $n > 1$. We're given that $a \equiv b \pmod{p}$, so we can use the [the product rule](#congruence-of-product) to multiply the left-hand side of this relation by $a$ and the right-hand side by $b$:

$$
a^{n}a \equiv b^nb \pmod{p}
$$

But that's just $a^{n+1} \equiv b^{n+1} \pmod{p}$.

Therefore, by induction, $a^n \equiv b^n \pmod{p}$.

{% aside %}
**Example**: $2 \equiv 6 \pmod{4}$ because both $2$ and $6$ generate a remainder of $2$ when divided by $4$. Raising both sides to the power of three, we get: $8 \equiv 216 \pmod{4}$. This is true because both $8$ and $216$ are evenly divisible by four, meaning the remainder is zero in both cases. Again, as noted before, the remainder need not be the same after raising both sides to the same power as it was before—all that matters is that the congruence relation is preserved.
{% endaside %}

##### Transitive Property of Congruence

Finally, one of the steps in the Diffie-Hellman algorithm will make use of this property:

{% definition "Transitive property" %}
If $a \equiv x \pmod{p}$ and $b \equiv x \pmod{p}$, then $a \equiv b \pmod{p}$.
{% enddefinition %}

Proof: Suppose $a \equiv x \pmod{p}$ and $b \equiv x \pmod{p}$. Then, by definition:

$$
a - x = (k_1)p \\
b - x = (k_2)p
$$

For some $k_1, k_2 \in \Z$.

Subtracting the second equation from the first gives:

$$
a-b = (k_1-k_2)p
$$

Since $k_1, k_2 \in \Z$, it follows that $k_1-k_2 \in \Z$, and thus $p|a-b$. Therefore, $a \equiv b \pmod{p}$.

## The Diffie-Hellman Key Exchange

We're done with the theoretical part. Now, it's time to look at the Diffie-Hellman key exchange itself and understand why the math works. Armed with the proofs we just completed, we should be able to show that Alice and Bob are able to generate the same private key using information they shared with each other publicly (known as **public-key exchange**).

In public key exchange, Alice and Bob want to communicate private information with each other, but they must do so over a public (and therefore insecure) communication network where Eve is eavesdropping on them. The Diffie-Hellman key exchange allows Alice and Bob to establish a shared key for deciphering each other's messages by sharing information publicly in such a way that it's difficult for Eve to figure out what private keys they used independently.

### Alice and Bob Go Public

To do this, Alice and Bob are going to leverage modular arithmetic and their knowledge of congruence modulo. First, they agree on two numbers:

1. $g$, known as the *generator*, and
2. $p$, a very large prime number, which we'll call the *prime modulus*.

They share $g$ and $p$ publicly, so Eve also knows what they are. But as we're about to discover, this won't compromise the security of Alice and Bob's communication.

The key exchange proceeds as follows:

1. Alice and Bob privately choose secret numbers $A$ and $B$, respectively. These are their private keys, and they will never share them with each other or anyone else.
2. Alice computes $g^A \bmod p$ privately. Let's call this remainder $r_A$. Observe that [by congruence of a remainder](#congruence-of-remainder), $r_A ≡ g^A \pmod{p}$. Similarly, Bob computes $g^B \bmod p$ privately. Let's call this result $r_B$. Again, by congruence of a remainder, $r_B ≡ g^B \pmod{p}$. These two facts will be very important later. Refer back to the proof if you're unsure why these relations are true.
3. Alice sends $r_A$ to Bob publicly, and Bob sends $r_B$ to Alice publicly. Eve can intercept both numbers, but she'll have a *very* difficult time working out what $A$ and $B$ were used, especially if Alice and Bob chose a large prime modulus $p$.
4. Alice privately computes $(r_B)^A \bmod p$ to get another remainder, $r_k$. Bob privately computes $(r_A)^B \bmod p$ and somehow gets the same remainder, $r_k$. Here, $r_k$ is their shared private key.
5. Now, Alice and Bob use this shared private key, $r_k$, to secure their communication. To arrive at the same key, Eve would need to know either $A$ or $B$, which were never shared publicly.

But how is this possible?

### How Did Alice and Bob Get the Same Number?

In step two, Alice calculated the remainder of dividing $g^A$ by $p$, which we defined to be $r_A$:

$$
r_A = g^A \bmod p
$$

And Bob calculated the remainder of dividing $g^B$ by $p$, which we defined to be $r_B$:

$$
r_B = g^B \bmod p
$$

By [congruence of remainder](#congruence-of-remainder), we also concluded the following:

$$
r_A \equiv g^A \pmod{p} \\
r_B \equiv g^B \pmod{p} \\
$$

In other words, $r_A$ and $g^A$ generate the same remainder when divided by the prime modulus, $p$. Likewise, $r_B$ and $g^B$ generate the same remainder when divided by $p$. This is a trivial fact that follows from the nature of modular arithmetic: remainders just wrap back around to themselves upon repeat division with the same modulus.

Here is where the magic happens. Using [congruence of powers](#congruence-of-powers), we can keep these congruence relations intact and raise both sides to the same power, as Alice and Bob did in the final step:

$$
(r_A)^B \equiv (g^A)^B \pmod{p} \\
(r_B)^A \equiv (g^B)^A \pmod{p} \\
$$

Simplifying the right-hand side of each relation, we get:

$$
(r_A)^B \equiv g^{AB} \pmod{p} \\
(r_B)^A \equiv g^{AB} \pmod{p} \\
$$

The right-hand side of each relation is the same. Per the transitive property of congruence modulo, this implies that:

$$
(r_A)^B \equiv (r_B)^A \pmod{p}
$$

In other words, $(r_A)^B$ and $(r_B)^A$ generate the same remainder, $r_k$, when divided by $p$. So when Alice and Bob compute their remainders privately in the final step, they actually get the same value for $r_k$—just as if they had both shared their private keys $A$ and $B$ and then calculated $g^{AB} \bmod p$ publicly. But in reality, Alice doesn't know $B$, Bob doesn't know $A$, and Eve is completely stumped!

## Summary

Admittedly, that was a lot of math and theory just for a few paragraphs' worth of explanation, but this foundational knowledge is what finally made the Diffie-Hellman algorithm click for me. It wasn't until I worked through these proofs myself and put them all together that I understood how it all works. I mainly wrote this article for myself as a post-mortem, in the spirit of learning by teaching and in case I ever forget the proofs. I hope it also helped you!

## Sources and Further Reading

- [The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography](https://simonsingh.net/books/the-code-book/)
- [Congruence modulo (article), Khan Academy](https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/congruence-modulo)
- [Proving the congruence power rule](https://math.stackexchange.com/questions/762010/proving-ab-a-bmod-nb-pmod-n-congruence-power-rule)
- [Public key cryptography - Diffie-Hellman Key Exchange (full version)](https://www.youtube.com/watch?v=YEBfamv-_do&t=162s)
- [Diffie Hellman -the Mathematics bit- Computerphile](https://www.youtube.com/watch?v=Yjrfm_oRO0w)
