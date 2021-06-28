---
title: Creating a Vertical Rhythm with CSS Grid
description: Margins are what you typically use to define a layout's vertical rhythm. But CSS Grid offers a better alternative.
keywords: [css grid, vertical rhythm]
categories: [dev, css, css-grid, typography]
---

Margins are the gold standard for spacing paragraphs, images, and block-level elements in a typical web layout. But what if I told you that CSS Grid offers a much better alternative for creating a consistent [vertical rhythm](https://24ways.org/2006/compose-to-a-vertical-rhythm)? Let's take a look at how you can use CSS Grid as a drop-in replacement for margin-based spacing.

{% include toc.md %}

## A Typical Article Layout, with Margins

Suppose we have this markup for an article:

{% include codeHeader.html %}
```html
<article id="post">
  <h1>My Awesome Post Title</h1>
  <p>
    Lorem Khaled Ipsum is a major key to success. You see the hedges, how I got it
    shaped up? It’s important to shape up your hedges, it’s like getting a
    haircut, stay fresh.
  </p>
  <p>
    How’s business? Boomin. Find peace, life is like a water fall, you’ve gotta
    flow. Hammock talk come soon.
  </p>
</article>
```

> *That's [Khaled Ipsum](http://khaledipsum.com/), for all you Lorem Ipsum normies out there.*

Nice and simple. Now, let's apply a line height to our body and some margins to those paragraphs to establish a vertical rhythm. Note that the choice of font size and line height is entirely dependent on the font. I recommend picking a `line-height` that gives you some multiple of your base spacing unit (I prefer to use a `4px` [linear scale](https://www.designsystems.com/space-grids-and-layouts/)). In this particular example, I'll go with a font size of `1.125rem = 18px` and a `line-height` of `1.33 = 24px`.

{% include codeHeader.html %}
```css
body {
  font-size: 1.125rem;
  line-height: 1.33;
}

#post h1 {
  margin-bottom: 16px;
}

#post p {
  margin-bottom: 24px; /* same as line height */
}
```

(I recommend using `rem` or `em` units for margins, but pixels will keep this tutorial simple. In this case, we could've used `1.33em` for paragraphs since that works out to precisely `24px`.)

That's all well and good:

{% include img.html src: "0.png", alt: "A basic article layout with a title and two paragraphs." %}

But a few minutes later, you decide to spice things up with some headings and maybe an image.

{% include codeHeader.html %}
```html
<article id="post">
  <h1>My Awesome Post Title</h1>
  <p>
    Lorem Khaled Ipsum is a major key to success. You see the hedges, how I got it
    shaped up? It’s important to shape up your hedges, it’s like getting a
    haircut, stay fresh.
  </p>
  <h2>Another One</h2>
  <p>
    How’s business? Boomin. Find peace, life is like a water fall, you’ve gotta
    flow. Hammock talk come soon.
  </p>
  <img src="http://khaledipsum.com/img/khaled.jpg" alt="DJ Khaled" />
  <p>
    Let me be clear, you have to make it through the jungle to make it to
    paradise, that’s the key, Lion!
  </p>
</article>
```

And that gives us this:

{% include img.html src: "1.png", alt: "An article with some headings, paragraphs, and an image of DJ Khaled." %}

The image doesn't have any bottom margin, and neither does the subheading. Let's fix that!

{% include codeHeader.html %}
```css
#post img {
  display: block;
}

#post p,
#post img {
  margin-bottom: 24px;
}

#post h1,
#post h2,
#post h3,
#post h4,
#post h5,
#post h6 {
  margin-bottom: 16px;
}
```

Beautiful:

{% include img.html src: "2.png", alt: "An article with spaced paragraphs and an image." %}

Honestly, the CSS isn't bad at all, and it'll serve you well most of the time. But as you introduce more elements to your page, you'll have to remember to go back into your CSS and give them margins to maintain your article's vertical rhythm. Chances are that you'll eventually forget to style some element, and it'll slip past you into production.

A typical article on the web uses a variety of other elements:

- Lists
- Blockquotes
- Code blocks
- Videos
- Iframes
- Interactive demos

...and many others.

Things can get a little tricky when spacing list items (if you decide to do this at all). For starters, we might try doing something like this:

```css
#post ul,
#post ol {
  margin-bottom: 24px;
}

#post li {
  margin-bottom: 4px;
}
```

But then, we have to remember to exclude the last list item, or our lists will actually get a bottom margin of `24px + 4px = 28px`, which looks slightly off. We can use `:not(:last-child)` to do this:

```css
#post ul,
#post ol {
  margin-bottom: 24px;
}

#post ul li:not(:last-child),
#post ol li:not(:last-child) {
  margin-bottom: 4px;
}
```

Let's also consider blockquotes: They can contain paragraphs, as well as images and other block elements... And, as you may have guessed, we have to apply the same kind of reset to the last child, or the blockquote will look like it has some unnecessary bottom padding:

```css
#post blockquote *:last-child {
  margin-bottom: 0;
}
```

Depending on how specific your selectors were, you may even have to throw in a dreaded `!important` directive. Not good. Fortunately, there's a much better way of going about all of this!

## CSS Grid to the Rescue

Watch as we reduce all of those lines of CSS to just a few, all thanks to CSS Grid:

```css
#post,
#post blockquote {
  display: grid;
  grid-row-gap: 24px;
}

#post ul,
#post ol {
  display: grid;
  grid-row-gap: 4px;
}

#post h2,
#post h3,
#post h4,
#post h5,
#post h6 {
  margin-bottom: -8px;
}
```

And we're done:

{% include img.html src: "final.png", alt: "The final result of styling our article with CSS grid." %}

Here's what it looks like when we inspect it using dev tools:

{% include img.html src: "3.png", alt: "An article layout whose elements are spaced with grid gutters." %}

Now, you can add **whatever elements you want** to your article layout, and they'll get spaced automatically with CSS Grid row gutters. This is more intuitive than using margins because it establishes a consistent baseline of spacing at the *parent* level, without you worrying about which immediate children need to have a margin. Every single child will get at least `24px` of spacing around it, thus enforcing your vertical rhythm and future-proofing your site.

Let's say you're still skeptical, though. Maybe you don't like the fact that we're now using negative margins to adjust our headings, or the fact that we've locked our layout to a minimum of `24px` baseline spacing between all elements. For example, what if you want a certain element in your article to only have `16px` margins all around?

```html
<article id="post">
  <p>Paragraph with some text in it.</p>
  <div>Some weird element that needs less spacing around it.</div>
  <p>Another paragraph!</p>
</article>
```

This may be a bit of a strawman argument because I can't actually think of a scenario where you'd want or need to do that. But assuming that there is one, this misses an important point: You run into the same exact problem with margins. Because if all paragraphs have a bottom margin of `24px`, your `<div>` has no way of undoing that except through a negative top margin since there's no parent selector in CSS.

## Real Examples of Using CSS Grid to Establish Vertical Rhythm

Want to see this used in a real site? Inspect this very article's CSS! And if you're not convinced that this is realistic or worth pursuing for a production site, consider that [Smashing Magazine](https://www.smashingmagazine.com/) uses this very technique for its desktop article layouts:

{% include img.html src: "smashing-magazine.png", alt: "Inspecting a Smashing Magazine article in Chrome dev tools reveals that paragraphs and other elements are spaced using CSS Grid gutters." %}

I'm sure that there are more examples of this out in the wild. Will your site will join the ranks? Give it a try—I guarantee that you won't want to go back to using margins for article layouts.

## Benefits of CSS Grid Gutters

The best thing about using CSS Grid is that it lets you do some really awesome stuff, like creating a [full-bleed layout](https://www.joshwcomeau.com/css/full-bleed/) that you might see in a magazine or newspaper, or a [full-fledged article layout](https://mastery.games/post/article-grid-layout/). Not only do you get the benefits of consistent baseline spacing throughout an article, but you can also now create three-, twelve-, or X-column layouts to suit your needs.

## Drawbacks of CSS Grid Gutters

*But What About Internet Explorer™*, you harp. I know, *I know*. But truth be told, I don't actually care; support for CSS Grid is excellent, save for legacy browsers that continue to hold the web back from realizing its full potential. On the bright side, if you're creating your site with a React-based SSG like Gatsby or Next.js, they already support IE11 and all modern browsers with polyfills, so you can safely use CSS Grid.

Another drawback is that Chrome's dev tools apparently don't like to paint a hundred or so of these pretty purple gutters:

{% include img.html src: "gutter.png", alt: "Chrome's dev tools show grid gutters using a purple hatch pattern.", clickable: false %}

Translation? Your browser may lag a bit as you open your dev tools to inspect large grids. This can get annoying when debugging CSS, but it has no impact on your user experience, like your [cumulative layout shift](https://web.dev/cls/) score or load times—everything is just as if you had used margins instead. This is mainly a developer experience issue.

## Margins Are Still Useful

Just don't get carried away with this approach. We developers have a tendency to find a shiny new solution to a problem and to try to apply it anywhere and everywhere, regardless of whether it's the right tool for the job. CSS Grid definitely doesn't make margins obsolete—it just gives us a nicer way of creating certain layouts that traditionally relied on margins alone.

## Grid On!

In its current state, CSS Grid gives us a very bright glimpse into the future of CSS and web layouts. It already has widespread browser support and is super easy to use once you master the basics. I hope you found this tutorial helpful!
