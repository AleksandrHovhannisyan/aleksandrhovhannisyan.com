---
title: How to Perform Numerical Integration Error Analysis
description: Learn how to perform numerical integration error analysis to understand how well you've approximated the true integral of a function.
keywords: ["numerical integration error analysis", "midpoint rule error estimate", "trapezoid rule error estimate", "simpson's rule error estimate"]
tags: [computer-science, math]
needsLatex: true
isCanonical: true
---

There's a lot of math coming up. Numerical integration error analysis isn't difficult conceptually—the key is to work very slowly to avoid getting lost in the sea of notation.

We'll do error estimates for three Newton-Cotes rules: the Midpoint rule, the Trapezoid rule, and Simpson's rule.

{% include linkedHeading.html heading="Midpoint Rule Error Estimate" level=2 %}

We'd like to estimate the integral of $$f(x)$$ over the interval $$[a, b]$$ using the midpoint, $$m = \frac{a+b}{2}$$.

That is, our goal is to estimate $$I(f) = \int_{a}^{b} f(x)dx$$.

Here's what the midpoint rule looks like graphically:

{% include posts/picture.html img="midpoint" ext="JPG" alt="Numerical integration using the midpoint rule." shadow=false %}

Since we don't know what $$f(x)$$ actually is, we'll approximate the function using a Taylor series expansion centered at $$m$$:

$$f(x) = f(m) + f^{(1)}(m)(x-m) + \frac{f^{(2)}(m)(x-m)^2}{2!} + \frac{f^{(3)}(m)(x-m)^3}{3!} + \frac{f^{(4)}(m)(x-m)^4}{4!}$$

We'll stop here. Let's plug this $$f(x)$$ into $$I(f) = \int_{a}^{b} f(x)dx$$ (and expand the factorials):

$$I(f) = \int_{a}^{b} \Big(f(m) + f^{(1)}(m)(x-m) + \frac{f^{(2)}(m)(x-m)^2}{2} + \frac{f^{(3)}(m)(x-m)^3}{6} + \frac{f^{(4)}(m)(x-m)^4}{24}\Big) dx$$

Let's now take the antiderivative of each piece and evaluate it from $$a$$ to $$b$$:

$$I(f) = f(m)x \Big|_a^b + \frac{f^{(1)}(m)(x-m)^2}{2} \Big|_a^b + \frac{f^{(2)}(m)(x-m)^3}{6} \Big|_a^b + \frac{f^{(3)}(m)(x-m)^4}{24} \Big|_a^b + \frac{f^{(4)}(m)(x-m)^5}{120} \Big|_a^b$$

From here on out, you just have to carefully follow along.

$$I(f) = \Big[(b-a)f(m)\Big] + \Big[\frac{f^{(1)}(m)}{2}\Big((b-m)^2 - (a-m)^2\Big)\Big] + \Big[\frac{f^{(2)}(m)}{6}\Big((b-m)^3 - (a-m)^3\Big)\Big] + \Big[\frac{f^{(3)}(m)}{24}\Big((b-m)^4 - (a-m)^4\Big)\Big] + \Big[\frac{f^{(4)}(m)}{120}\Big((b-m)^5 - (a-m)^5\Big)\Big]$$

Recall that we defined $$m$$ to be $$\frac{a+b}{2}$$. Let's plug this into some of those nested $$b$$ and $$a$$ expressions. You'll see why we do this shortly:

$$I(f) = \Big[(b-a)f(m)\Big] + \Big[\frac{f^{(1)}(m)}{2}\Big((b-\frac{a+b}{2})^2 - (a-\frac{a+b}{2})^2\Big)\Big] + \Big[\frac{f^{(2)}(m)}{6}\Big((b-\frac{a+b}{2})^3 - (a-\frac{a+b}{2})^3\Big)\Big] + \Big[\frac{f^{(3)}(m)}{24}\Big((b-\frac{a+b}{2})^4 - (a-\frac{a+b}{2})^4\Big)\Big] + \Big[\frac{f^{(4)}(m)}{120}\Big((b-\frac{a+b}{2})^5 - (a-\frac{a+b}{2})^5\Big)\Big]$$

Before you panic, consider one such pair of $$a$$ and $$b$$ terms:

$$\Big(b - \frac{a+b}{2}\Big)^2 - \Big(a - \frac{a+b}{2}\Big)^2$$

And let's combine the fractions:

$$\Big(\frac{2b - (a+b)}{2}\Big)^2 - \Big(\frac{2a - (a+b)}{2}\Big)^2$$

And simplify:

$$\Big(\frac{b-a}{2}\Big)^2 - \Big(\frac{a-b}{2}\Big)^2$$

So far so good? Let's plug this back in and repeat the same logic for the rest:

$$I(f) = \Big[(b-a)f(m)\Big] + \Big[\frac{f^{(1)}(m)}{2}\Big((\frac{b-a}{2})^2 - (\frac{a-b}{2})^2\Big)\Big] + \Big[\frac{f^{(2)}(m)}{6}\Big((\frac{b-a}{2})^3 - (\frac{a-b}{2})^3\Big)\Big] + \Big[\frac{f^{(3)}(m)}{24}\Big((\frac{b-a}{2})^4 - (\frac{a-b}{2})^4\Big)\Big] + \Big[\frac{f^{(4)}(m)}{120}\Big((\frac{b-a}{2})^5 - (\frac{a-b}{2})^5\Big)\Big]$$

That may look awful, but the math will simplify quite a bit in a second.

Time for a really useful and simple math trick. Let's take one pair again:

$$\Big(\frac{b-a}{2}\Big)^2 - \Big(\frac{a-b}{2}\Big)^2$$

And let's look at the second term:

$$\Big(\frac{a-b}{2}\Big)^2$$

What can we do to make this look more like the first term? Well, with some simple factoring, we get that this is equal to:

$$\Big(\frac{-1(b-a)}{2}\Big)^2$$

And of course, that power of $$2$$ turns the $$-1$$ into a $$1$$. What does that do for us? 🤔 Let's plug this back in:

$$\Big(\frac{b-a}{2}\Big)^2 - \Big(\frac{b-a}{2}\Big)^2$$

Well, we got the same value as the first term! And what's a value minus itself? Zero!

What about when the power is odd, like $$3$$?

$$\Big(\frac{a-b}{2}\Big)^3 = \Big(\frac{-1(b-a)}{2}\Big)^3 = -\Big(\frac{b-a}{2}\Big)^3$$

Recall that we have pairs that look like this:

$$\Big(\frac{b-a}{2}\Big)^n - \Big(\frac{a-b}{2}\Big)^n$$

If $$n$$ is odd, then substituting the above, we'll get:

$$\Big(\frac{b-a}{2}\Big)^n - \Big(-\Big(\frac{b-a}{2}\Big)^n\Big) = 2\Big(\frac{b-a}{2}\Big)^n$$

> **Key finding**: Wherever we see a term like $$\Big(\frac{b-a}{2}\Big)^n - \Big(\frac{a-b}{2}\Big)^n$$ where $$n$$ is a positive power, we know that the entire expression that it's multiplied with is $$0$$. Whenever $$n$$ is odd, we just get twice the first term!

Let's use this discovery to simplify things:

$$I(f) = \Big[(b-a)f(m)\Big] + 0 + \Big[\frac{f^{(2)}(m)}{6}\Big(2(\frac{b-a}{2})^3\Big)\Big] + 0 + \Big[\frac{f^{(4)}(m)}{120}\Big(2(\frac{b-a}{2})^5\Big)\Big]$$

You've got this—hang in there! Let's do some simplifying by applying the powers to the scalar denominators:

$$I(f) = \Big[(b-a)f(m)\Big] + \Big[\frac{f^{(2)}(m)}{6}\Big(\frac{2(b-a)^3}{8}\Big)\Big] + \Big[\frac{f^{(4)}(m)}{120}\Big(\frac{2(b-a)^5}{32}\Big)\Big]$$

Now we'll simplify with the $$2$$s in the numerators:

$$I(f) = \Big[(b-a)f(m)\Big] + \Big[\frac{f^{(2)}(m)(b-a)^3}{24}\Big] + \Big[\frac{f^{(4)}(m)(b-a)^5}{1920}\Big]$$

We're almost there! The second trick is to recognize that the very first term is just the midpoint rule:

$$M(f) = (b-a)f(m)$$

So let's substitute that in:

$$I(f) = M(f) + \Big[\frac{f^{(2)}(m)(b-a)^3}{24}\Big] + \Big[\frac{f^{(4)}(m)(b-a)^5}{1920}\Big]$$

And we're essentially done! We usually label those last two terms as error terms. The book I studied with uses $$E(f)$$ and $$F(f)$$ respectively:

$$I(f) = M(f) + E(f) + F(f)$$

{% include linkedHeading.html heading="Trapezoid Rule Error Estimate" level=2 %}

This time, instead of just the midpoint, we have two points for the Trapezoid rule: $$x = a$$ and $$x = b$$. This gives us two equations:

$$f(a) = f(m) + f'(m)(a-m) + \frac{f''(m)(a-m)^2}{2} + \dots$$

$$f(b) = f(m) + f'(m)(b-m) + \frac{f''(m)(b-m)^2}{2} + \dots$$

Now, I'm regrettably going to use the old trick that math teachers love: "If you work it out, you'll get..."

$$I(f) = T(f) - 2E(f) - 4E(f)$$

Where $$E(f)$$ and $$F(f)$$ are the same errors as we got for the midpoint rule. I'm not going to pretend I understand how the integration is performed here. Maybe one day I'll have the patience to work it out by hand 🤷

{% include linkedHeading.html heading="Simpson's Rule Error Estimate" level=2 %}

We know the following for Simpson's rule:

$$S(f) = \frac{2}{3}M(f) + \frac{1}{3}T(f)$$

And we have these two equations:

$$I(f) = M(f) + E(f) + F(f)$$

$$I(f) = T(f) - 2E(f) - 4E(f)$$

How do we get an error estimate for Simpson's rule? Well, we have an $$M(f)$$ in the first equation and a $$T(f)$$ in the second. Let's rearrange the first equation to solve for $$M(f)$$ and rearrange the second to solve for $$T(f)$$:

$$M(f) = I(f) - E(f) - F(f)$$

$$T(f) = I(f) + 2E(f) + 4E(f)$$

If $$S(f) = \frac{2}{3}M(f) + \frac{1}{3}T(f)$$, then just multiply the first equation by $$\frac{2}{3}$$, the second by $$\frac{1}{3}$$, and then add them together!

$$\frac{2}{3}M(f) = \frac{2}{3}I(f) - \frac{2}{3}E(f) - \frac{2}{3}F(f)$$

$$\frac{1}{3}T(f) = \frac{1}{3}I(f) + \frac{2}{3}E(f) + \frac{4}{3}F(f)$$

Now add these two equations to each other:

$$\frac{2}{3}M(f) + \frac{1}{3}T(f) = S(f) = I(f) + \frac{2}{3}F(f)$$

## That's It!

I hope you found this helpful in understanding how we get numerical integration error estimates.

If you notice a typo in any of that LaTeX, [please let me know about it!](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.github.io/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug+Report%3A+%5BConcise+Summary+Here%5D)

