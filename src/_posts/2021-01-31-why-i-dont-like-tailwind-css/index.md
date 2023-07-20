---
title: Why I Don't Like Tailwind CSS
description: On paper, Tailwind CSS sounds like a great idea. In reality, it suffers from the same problems that it tries to solve.
keywords: [tailwind css, tailwind, don't like tailwind]
categories: [essay, css, tailwind]
lastUpdated: 2021-12-18
commentsId: 77
thumbnail: ./images/thumbnail.png
---

{% aside %}
  Based on feedback, I've updated this post to clarify some points and to offer a more balanced perspective. This isn't a hill I'd die on; at the end of the day, what matters is that you're productive writing CSS. If that means using Tailwind, nobody's stopping you. Below are just some reasons why *I* don't enjoy using it.
{% endaside %}

You're at a restaurant, and there's an odd item on the menu that you've never heard of before, but it piques your interest. It sounds like it might be worth a try, though you're not sure.

When the waiter approaches your table, you inquire about the dish; he notes that while most people are initially repulsed by its appearance, they should still give it a try because the chef swears that it's *supremely delicious*. So, trusting his judgment, you order the dish and wait.

When your meal arrives, it looks just as unpleasant as it did in the menu. But you're not one to judge—you're willing to try new things. You carve into a slice of it and take a reluctant bite. And... well, it's really not that great.

In a nutshell, this was my experience with Tailwind CSS. It's by no means the worst thing to happen to CSS, but it's also not the panacea that its supporters claim it is—and, in fact, it has a lot of drawbacks that put me off.

The strange thing is that I actually read through all of [Adam Wathan's article on semantic CSS](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/), and I found myself initially agreeing with his points. Adam argues that the whole "semantic CSS" paradigm does not pan out in practice, and that developers tend to gravitate towards a **Utility CSS** approach over the course of their careers. According to this paradigm, your class names should be as granular as possible, responsible for one main task. These utility classes serve as the basic building blocks ("tokens") of your UI, allowing you to chain them together to implement complex designs. For example, if you find yourself repeating `display: flex` or `flex-wrap: wrap` in your CSS, you may want to abstract these out into utility classes, like `flex` or `flex-wrap`, that you can apply to any element.

{% quote "Adam Wathan, Tailwind CSS landing page", "https://tailwindcss.com/" %}
  I’ve written a few thousand words on why traditional 'semantic class names' are the reason CSS is hard to maintain, but the truth is you’re never going to believe me until you actually try it. If you can suppress the urge to retch long enough to give it a chance, I really think you'll wonder how you ever worked with CSS any other way.
{% endquote %}

On paper, Tailwind CSS sounds great. In practice, it suffers from the same issues that it attempts to solve and is, in my opinion, not worth using.

{% include "toc.md" %}

## But First, Why Does Tailwind CSS Exist?

Before we discuss the problems with Tailwind CSS, it's worth looking at why the framework was created in the first place and the problems that it's trying to solve. This is mostly covered in Adam Wathan's article linked above, which I highly recommend that you read even if you don't like Tailwind. I already mentioned some of the motivations behind Tailwind, but I'll recap them here.

One of the arguments that people in favor of Tailwind usually make is that the "semantic CSS" approach is flawed because your well-named CSS classes give a false sense of order and reason, when in reality there's a good deal of complex (and repeated) logic in your CSS. It's also difficult to come up with consistent standards for spacing, colors, and other design guidelines, and this can lead to bloated CSS and inconsistently styled UIs. Tailwind aims to solve these problems.

This is one of the arguments that Adam uses in his article. He notes that with the semantic CSS approach, there's this inherent coupling of HTML to CSS, where either your HTML classes dictate your CSS or vice versa. And thus, the whole "separation of concerns" principle falls apart because your HTML and CSS **depend on each other**.

{% quote 'Adam Wathan, CSS Utility Classes and "Separation of Concerns"', "https://adamwathan.me/css-utility-classes-and-separation-of-concerns/" %}
  I had "separated my concerns", but there was still a very obvious coupling between my CSS and my HTML. Most of the time my CSS was like a mirror for my markup; perfectly reflecting my HTML structure with nested CSS selectors.

  My markup wasn't concerned with styling decisions, but my CSS was very concerned with my markup structure.

  Maybe my concerns weren't so separated after all.
{% endquote %}

In principle, this makes sense. But as we'll see, Tailwind doesn't actually solve this problem of "separation of concerns." And it actually introduces several other problems.

## Why Tailwind Isn't Worth Your Time

With that out of the way, let's look at some of the reasons why I don't like Tailwind CSS.

### 1. Tailwind Makes Your Code Difficult to Read

[Other people who don't like Tailwind](https://dev.to/jaredcwhite/why-tailwind-isn-t-for-me-5c90) tend to start off by arguing that it makes your HTML look noisy and disgusting, and I'll do the same. Honestly, it's a valid argument if you care at all about your developer experience. Tailwind makes your markup difficult to read for several reasons that I'd like to explore here.

#### You Need to Learn a New Way of Writing CSS

First, like Bootstrap, Tailwind uses awkward abbreviations for its class names. This means that you have to first learn Tailwind's specific syntax before you can fluently string its utility classes together to create familiar UIs. So when you're first starting out with Tailwind, things will actually be slow, and you'll find yourself frequently referencing the documentation to find the right classes to use. The initial promise of rapid prototyping is quite a ways off until you become familiar with the framework.

#### It's Inconsistent

That sounds like a fairly easy task for anyone who's ever had to pick up a new language or tool, but Tailwind is inconsistent with some of its naming conventions. For example, with Flexbox, Tailwind's `justify-*` classes correspond to `justify-content` in CSS. Naturally, one would think that `align-*` classes would correspond to `align-items`. But they actually correspond to a little-used `align-content` property. This gets confusing because CSS also happens to have properties named `justify-items` and `align-content`. This means that, at a glance, you can't actually tell what any of these shorthand class names map to:

- `items-*`: align or justify?
- `content-*`: align or justify?
- `justify-*`: content or items?
- `align-*`: content or items?

This segues nicely into a related point.

#### It's Difficult to Read

Poor naming conventions (or just poor variable names in general) are the source of a lot of confusion when other people read your code. I would rather look at some CSS that has `padding: 0.25rem` or `margin: 0.5rem` instead of trying to mentally map Tailwind's `p-1` or `m-2` to their CSS equivalents. Vanilla CSS, and CSS preprocessors like SCSS or LESS, do not impose much of a mental burden when you read them. Tailwind gets even worse with media queries—which, as you may have guessed, come in the form of prefixed class names:

```html
<div class="w-16 h-16 md:w-32 md:h-32 lg:w-48 lg:h-48"></div>
```

Another reason why Tailwind is so hard to read is because it requires you to pan your eyes **horizontally rather than vertically**. You know how designers recommend that you keep your copy centered on the page, somewhere around 60 characters, to make it easier for people to read? That's because the wider your text is, the more difficult it is for a reader's eyes to jump to the next line, and the more difficult it is to find that one particular word you're looking for in a wall of horizontal text. Yet this is the very thing that Tailwind forces you to do. When you string a bunch of class names together, you get markup that looks like this:

```html
<div
  class="w-16 h-16 rounded text-white bg-black py-1 px-2 m-1 text-sm md:w-32 md:h-32 md:rounded-md md:text-base lg:w-48 lg:h-48 lg:rounded-lg lg:text-lg"
>
  Yikes.
</div>
```

If you think I'm exaggerating and that it can't get much worse than this in practice, here's a real example from Netlify's admin dashboard:

{% include "postImage.html" src: "./images/netlify-input.jpg", alt: "Inspecting a checkbox in the Netlify UI via dev tools reveals an input with a massive string of class names spanning over 13 lines.", caption: "That's **71 class names** just to style a checkbox." %}

Unfortunately, ESLint/Prettier won't even properly format your classes or push them onto a new line—they'll just push the `className` prop down, but the string itself could go on forever. This may force you to scroll your editor horizontally to view the full list of classes. Tailwind's own documentation suffers from this very problem—many code blocks overflow horizontally and force you to scroll to find the relevant class in a sea of strings

You could turn on word wrapping in your editor, which would solve the problem of having to scroll horizontally to see all of the class names, but you would still need to parse and understand these giant strings. By comparison, vanilla CSS is much easier to parse—you only have to scan your code vertically, so it's easier to search for a particular `property: value` pair. Plus, you get proper syntax highlighting, which clearly separates your properties from the values and makes things easier to read. With Tailwind, all your classes use your editor's color for strings. There are no properties or values because they've been stuffed into the class names themselves.

Here's the raw CSS equivalent of the Tailwind code sample I showed earlier:

```css
.thing {
  width: 16px;
  height: 16px;
  color: white;
  background-color: black;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

@media screen and (min-width: 768px) {
  .thing {
    width: 32px;
    height: 32px;
    border-radius: 0.375rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

@media screen and (min-width: 1024px) {
  .thing {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
```

If you're tracking down a UI bug and you know it's not in your tablet/desktop version, then you can simply ignore the blocks of media queries and focus on the base styles. Over in Tailwind-land, you have to mentally exclude the responsive class names as you scan your classes horizontally, and then you have to figure out how all of these separate pieces fit together to create the final look of your UI. I find it much, much easier to just read the CSS above to see what's going on. There's a clear **separation of concerns**, and thats a good thing.

#### You Can't Chain Selectors

Unlike traditional CSS, Tailwind doesn't allow you to chain selectors to avoid repeating yourself. So if all of your active, hover, focus, and other states require the same CSS rules, you're going to be writing far too many classes just to do this:

```css
.nav-link:focus,
.nav-link:hover,
.nav-link[aria-current="page"] {
  /* CSS goes here */
}
```

Or better yet, this:

```css
.nav-link:is(:focus, :hover, [aria-current="page"]) {
  /* CSS goes here */
}
```

For this particular example, the number of Tailwind classes grows linearly with the number of CSS rules you need to write. For example, if you need to write just four lines of CSS, you'll need to actually chain 12 Tailwind classes because there are three selectors. If you later decide to change just one selector or introduce a new one, you'll need to go through and remove every copy or add one new class name corresponding to each rule. This alone can make a component difficult to maintain.

#### It Makes PRs Harder to Review

I'm comfortable reading other people's code and making sense of their logic and relating their markup to their CSS. But if I have to look at ~1000 LOC changes in a pull request, and most of that is coming from long strings of class names, I'm not going to be happy. It's also going to be more difficult for me to make suggestions that could eliminate redundant CSS or simplify your markup.

It's information overload—in the Semantic CSS world, we first make sense of the markup with the help of well-named classes or IDs, and then we mentally map these "things" to concrete CSS rules. Everything is easier to parse because we're taking it one thing at a time, and semantic classes help us to make sense of what we're looking at.

But with Tailwind, you're forced to **interpret semantics on the fly**. The developer who originally wrote the code probably had some idea of what they were creating in the back of their mind. But they've probably forgotten it by now, and you have to guess what a particular slice of markup is responsible for just by reading an alphabet soup of classes.

### 2. Tailwind and Class Name Props Don't Mix Well

With most CSS-in-JS and vanilla CSS solutions, styling components in a framework like React is fairly straightforward. You add a `className` prop to the component, define those styles in the consumer component, and pass along the class name to the component that's being customized:

```tsx
const Button = (props: ButtonProps) => {
  return (<button className={props.className}>
    {props.children}
  </button>);
}

const Parent = () => {
  return <Button className="child" />
}
```

With Tailwind, you now need to pass a long string of class names. This may not seem like an issue to those who are used to working with Tailwind, but it becomes one when you have conditional class names.

For example, let's say you're using the excellent [classnames](https://www.npmjs.com/package/classnames) package to chain multiple class names together, some of which are conditional:

```jsx
import classNames from 'classnames';

const Parent = () => {
  const isFullWidth = true; // or false, pretend this is dynamic
  return <Button className={classNames('my-2', 'mx-4', { 'w-full': isFullWidth })} />
}
```

This may not seem like a problem until you realize that some conditional class names need to apply multiple styles. In that case, you end up having to either repeat yourself or defining long class name strings:

```jsx
import classNames from "classnames";

const Parent = () => {
  const isActive = true; // or false, pretend this is dynamic
  const isDisabled = false; // or true, pretend this is dynamic
  return (
    <Button
      className={classNames("bg-blue-500", "text-white", {
        "bg-blue-300 text-black": isActive,
        "bg-gray-300 text-gray-600": isDisabled,
      })}
    />
  );
};
```

You can make this a little easier to manage mentally by extracting those class name strings out into variables (possibly even exports from a design module):

```jsx
import classNames from "classnames";

const Parent = () => {
  const isActive = true; // or false, pretend this is dynamic
  const isDisabled = false; // or true, pretend this is dynamic

  const activeClass = "bg-blue-300 text-black";
  const disabledClass = "bg-gray-300 text-gray-600";

  return (
    <Button
      className={classNames("bg-blue-500", "text-white", {
        [activeClass]: isActive,
        [disabledClass]: isDisabled,
      })}
    />
  );
};
```

And that's actually not that bad. But there are situations where you need to get really granular with the different combinations of classes you can have, so you might need to write some CSS like this:

```css
.button:not(.active) {
  /* some CSS */
}
```

How would you do this in Tailwind? You'd probably need to go back to using `@apply` directives, or you'd need to chain your class names in `:not`.

### 3. Tailwind Locks You Into the Utility CSS Paradigm

If your app uses Tailwind, you're basically stuck with it because moving to any other framework or preprocessor is going to require a considerable amount of refactoring. While this doesn't really matter much for prototypes, it's an important consideration for apps that you'll be maintaining well into the future.

There are tools like Windy for [converting existing CSS to Tailwind](https://usewindy.com/), which sounds like a fairly easy thing to do. After all, Tailwind just breaks "compound" semantic classes down into "atomic" utility classes that have single responsibilities. If you have `.some-thing` that applies a bunch of CSS, then you can easily map `.some-thing`'s CSS rules to Tailwind classes.

But I can't imagine that it's possible to create a tool that does the reverse: **converting Tailwind to semantic HTML and CSS**. The only thing you could realistically convert Tailwind to is some other utility framework (e.g., Bootstrap) that locks you in with its own syntax and class names.

Because Tailwind classes are atomic building blocks that only do one thing, you can't really build more complex, semantic things out of them without assembling those classes by hand. After all, what assumptions would an automated tool make about your desired naming conventions, anyway? What is this `div`, or `img`, or `ul` that I'm looking at? *What do I call it*?

Granted, you could argue that if Tailwind works well for your team, then there really isn't any reason to migrate to any other solution. If that's the case, great. But it's still something worth considering, especially if your code base will grow in the future.

### 4. Tailwind Is Bloated

{% aside %}
  **Note**: I'm wrong here. I should have done more research into Tailwind to understand that it is in fact *not* as slow as I originally thought. Below is an edited version clarifying why Tailwind isn't actually bloated or slow (unless you misuse it).
{% endaside %}

Tailwind uses [PurgeCSS](https://purgecss.com/), which removes any unused styles from your compiled stylesheet. The Tailwind docs note the following:

{% quote "Optimizing for Production, Tailwind", "https://tailwindcss.com/docs/optimizing-for-production" %}
  When removing unused styles with Tailwind, it's very hard to end up with more than 10kb of compressed CSS.
{% endquote %}

This is true for sites that don't need too many styles (e.g., blogs). You can browse some of the [popular sites built with Tailwind](https://builtwithtailwind.com/popular) and inspect their Network requests to get a sense for how large a typical Tailwind stylesheet may be. Here are some examples (these may change in the future):

- [https://adamwathan.me/](https://adamwathan.me/): 4.9 kB (Brotli)
- [https://www.swyx.io/](https://www.swyx.io/): 593 bytes (Brotli)
- [https://laracasts.com/](https://laracasts.com/): 26.1 kB (Brotli)
- [https://tailwindcss.com/](https://tailwindcss.com/): 25.6 kB (Brotli)

You can see that sites range quite a bit from the very low end to somewhere around `30 kB`. My own site's CSS is written in SCSS and is `7.0 kB` (also Brotli compressed), which is on the lower end of these examples (which, again, are a fairly small sample).

I do want to note that even if your CSS ends up being smaller with Tailwind, the network request for your HTML will probably be larger than if you had used BEM. It's not like things disappear into nowhere, after all—you've shifted the weight to your HTML, where class names are repeated several times, just like `property: value` pairs are repeated in a typical CSS stylesheet written without Tailwind.

But at the end of the day, you shouldn't worry about optimizing your CSS if your numbers are somewhere in this range. You can improve your site's performance in more impactful ways, like optimizing your images and font loading.

### 5. Tailwind Is an Unnecessary Abstraction

All Tailwind classes are atomic and have a single responsibility. But is that a good thing?

For one, the great thing about ordinary CSS classes is that they usually *don't* do just one thing. After all, that's why classes exist in the first place—to help you group related styles together so you can reuse them.

If you need to group related styles under a reusable class name, the Tailwind docs recommend using the [`@apply` directive](https://tailwindcss.com/docs/extracting-components#extracting-component-classes-with-apply):

```html
<button class="btn-indigo">
  Click me
</button>

<style>
  .btn-indigo {
    @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
  }
</style>
```

However, `@apply` defeats the purpose of using a utility CSS framework in the first place. Not only are you generating more output CSS now because those Tailwind rulesets are getting duplicated, but you're also going back to the semantic CSS paradigm, which is supposedly bad. If you find yourself needing to use `@apply`, you're better off just writing vanilla CSS with custom properties. [Adam himself doesn't recommend using @apply](https://twitter.com/adamwathan/status/1226511611592085504?lang=en) and instead suggests that you compose your Tailwind classes with components.

Tailwind adds this sort of redundancy to your code, forcing you to repeat `flex`, `mx`, and `py` in your HTML classes rather than repeating the *same exact things* but in CSS. What do you gain from this, except that you don't have to come up with class names? Your utility classes are atomic building blocks, sure, but so are CSS property-value pairs. It's an unnecessary abstraction.

In his article on utility classes and semantic CSS, Adam only begins to explore an alternative approach to Semantic CSS when he realizes that semantics can lead to repeated CSS spread across multiple classes, with no way to reconcile the shared bit of code while keeping the semantics bit intact. The proposed solution is to co-locate your markup and styling since the "semantic" approach is strictly coupled anyway.

But this really isn't any better than writing CSS directly, and it's no more maintainable than directly applying inline styles. Because instead of repeating styles in your CSS, **you're now repeating them in your HTML** through class names. In fact, you're likely repeating yourself three, four, possibly *many more* times now because you can't chain selectors or take advantage of new CSS selectors like `:is` or `:where`.

{% aside %}
  **Edit**: I still stand by my original points here, but I'd like to note that Tailwind has a very strong appeal for one key reason: It reduces a set of infinitely many property-value pairs to a strict set of finite design tokens to keep you in check so that you're not plucking arbitrary values out of thin air. This is always a good thing. However, consider whether you really need Tailwind. Vanilla CSS (and CSS preprocessors) already offer variables (in CSS land, we call them custom properties). As long as you create your own design tokens/theme variables, you shouldn't ever run into this issue. In fact, this is how Tailwind operates under the hood.
{% endaside %}

### 6. Semantics Is Important. Tailwind Forgoes It.

One of the most frequently cited arguments in favor of Tailwind is that Semantic CSS is difficult to achieve in practice because naming things is hard. Adam argues that this violates the principle of Separation of Concerns because now your HTML markup dictates your CSS. Effectively, you're making decisions in your HTML that really belong in your CSS. But let's think about this for a second: Is that really a problem?

For starters, if you're not sure what to call that `<div>` in your markup, consider whether it's actually needed. One of the great things about the Semantic CSS paradigm is that it forces you to structure your markup logically and meaningfully. It keeps you in check, ensuring that you don't just bloat your HTML with unnecessary wrapper elements on top of wrapper elements just to achieve whatever UI you're trying to build.

Freeing you from this constraint, Tailwind can actually encourage bad practices, where you no longer have to worry about that pesky "semantics" thing, and you can throw in as many `<div>`s as you want without caring about meaning. This goes hand in hand with the point I brought up earlier about Tailwind's legibility—when you have so many elements in a component soup of elements, and each one has a long string of class names, what even are you looking at anymore? Can you make sense of it at a glance?

Second, if you struggle to name things in the first place, this suggests that you'll run into communication issues down the line when discussing your UI with designers and other team members. If you can't name `X` element in your UI sensibly, and a conversation inevitably arises concerning that element, how are you going to refer to it? What are you going to call That Thing? Surely you can think of something. There's always a way to name things semantically.

Finally, remember that point I brought up earlier about how Tailwind CSS promotes ugly HTML markup? Supporters of the framework usually respond by reminding you that you're probably working with a component-based framework like React anyway, and so you're unlikely to be looking at a giant sea of markup in a single file. Fair point.

But I bring this up here because if you're using components, then you've likely **already given them sensible names**, haven't you? And if you've given your *components* sensible names, can you not apply that same pattern to your *class names*? This is where methodologies like BEM tend to shine (though I prefer a sort of pseudo-BEM approach that doesn't involve double underscores). Pick a convention and stick with it, and naming things becomes much easier.

In short, Tailwind pretends to solve a problem that isn't really a problem in the first place.

{% aside %}
  **Edit**: Tailwind is not completely devoid of any semantics. It just has *its own kind* of semantics. However, I would argue that it's always better to be able to name your sub-components, even at the most atomic level. Naming things is hard, but my point is that this difficulty is not something to shy away from: It's a good thing. It forces you to think about what you're building and to give your markup semantics that is otherwise not there. That said, Semantic CSS does have its own drawbacks. If you don't have consistent naming standards, everyone on your team may come up with their own creative variation of BEM.
{% endaside %}

### 7. Tailwind, Dev Tools, and Developer Experience

#### It's Harder to Tweak CSS in Dev Tools

As a front-end developer, I sometimes find myself making little tweaks here and there in my browser through dev tools. For example, I might try applying some rules to a certain selector so I can verify that it produces the desired result. This is useful if I'm exploring the possibilities for a new feature or pairing with a designer.

With Tailwind, tweaking styles in this manner is difficult because you're no longer dealing with classes that apply styles to multiple elements. Thus, if you want your changes to be reflected across multiple components at once in dev tools, you can't—unless you give each one a new class name and use that as the selector. Otherwise, your changes to Tailwind classes will be reflected elsewhere in the UI, which can be annoying.

Of course, you *can* apply your styles inline in dev tools to just that particular element, but sometimes it helps to see how changes are reflected throughout your UI rather than in a single, isolated location. This is one price you pay for using atomic utility classes—unless you use `@apply`, you can't really style multiple elements at once.

#### It's Harder to Find Components in Dev Tools

Similarly, if I'm given a UI bug in a big code base, I like to narrow down the affected component in my dev tools using class names, IDs, or, as a last resort, translated strings. This makes it easier to jump straight to the code that I need to look at to figure out what went wrong, especially if there's a close mapping between a component's name and the class names it uses (e.g., if your team uses BEM). If you're using Tailwind, you only have two things you can go off of in dev tools: your knowledge of that particular area of the app, and strings. The latter isn't always helpful because strings may get reused across multiple components, so searching for them may yield multiple results. And not everyone on a team is familiar with every component in the code base, like in a monorepo for an enterprise-scale app. This can be frustrating for new hires.

#### Recompiling HTML Is Slower Than Recompiling CSS

On the topic of developer experience, there's a related issue here in static site generators and server-side frameworks like Next.js: Recompiling CSS is much faster than hot-reloading the page due to markup changes. Tailwind forces the latter, which may slow down your development process. This is especially annoying in static site generators like Jekyll or 11ty, where class name changes at the layout level may trigger a full rebuild of many different pages, and this means you need to wait a few seconds for your browser to reload. By comparison, recompiling Sass for my site takes only a few milliseconds.

### 8. Tailwind Is Still Missing Some Key Features of CSS

Almost two years after its initial release, Tailwind CSS [still doesn't support pseudo elements](https://github.com/tailwindlabs/tailwindcss/discussions/2119) (among other features), something that basic CSS and CSS preprocessors have supported for years. If this were implemented, you'd probably have to write something like `before:content-empty-string` in your HTML. By comparison, the plain CSS equivalent is far more legible.

I suspect this feature isn't realistic to implement. For both `::before` and `::after`, you would need possibly thousands of unique class names just so you could style your pseudo-elements as needed. That's simply not realistic. The more classes that Tailwind decides to introduce, the more its complexity will grow—to the point that it will not be maintainable.

In a similar vein, Tailwind's support for CSS grid is lacking; you need to [configure a custom set of limited grids upfront](https://www.npmjs.com/package/@savvywombat/tailwindcss-grid-areas) and reuse those across your site, which isn't realistic because CSS grid's use cases aren't just limited to grid areas. The same goes for background gradients, animations, new selectors like `:is` and `:where`, and many other bleeding-edge features that you can easily use in vanilla CSS without any mental overhead or configuration. With Tailwind, you either need to install a plugin or wait until it's officially supported. Neither one sounds like a good solution just so you can use basic features that CSS already offers.

## Fine, But What Should You Use Instead?

Regardless of how you feel about Tailwind, you'd probably agree that it's only fair of me to suggest alternatives. Before I do that, I want to note that it feels like Tailwind was initially created to solve a problem that no longer exists: **component-scoped CSS**. With frameworks like React—and, more recently, Svelte—it's never been easier to write CSS without leaving your markup and without resorting to inline styles. Outside of these frameworks, in vanilla projects and static site generators, you can just use BEM or some other methodology that enforces consistent naming conventions.

Here are some alternatives to Tailwind that you might like:

- Write vanilla CSS and use custom properties to create your own design system.
- Use a preprocessor. I'm a big fan of [Sass](https://sass-lang.com/), but you can also use [Less](https://lesscss.org/).
- Use a CSS-in-JS library like [styled-components](https://styled-components.com/) or [styled-jsx](https://github.com/vercel/styled-jsx).
- Write component-scoped vanilla CSS with [CSS Modules](https://github.com/css-modules/css-modules).

I've tried all of these approaches, and they all have their benefits and drawbacks. For static projects, I prefer to use a CSS preprocessor like Sass; I'm a big fan of defining custom mixins and functions to speed up development, and the great thing is that I can still combine Sass with vanilla CSS features (like custom properties). On the other hand, if I'm working in a React codebase, I prefer to use either styled-jsx (for dynamic CSS with interpolated values) or CSS Modules (for static CSS).

## Final Thoughts

Tailwind allows you to prototype UI rapidly without having to slow down and make naming decisions, and it saves you the work of having to build an entire design system from scratch. This is great for developers who need to move quickly. However, if you care about the long-term maintenance of your code base or the cost of onboarding new developers who may be unfamiliar with this library, then Tailwind isn't worth it.

For all of these reasons, I don't recommend using Tailwind.

## Attributions

This article's social media preview uses Tailwind CSS's logotype, which is [under the copyright of Tailwind Labs Inc](https://tailwindcss.com/brand#assets).
