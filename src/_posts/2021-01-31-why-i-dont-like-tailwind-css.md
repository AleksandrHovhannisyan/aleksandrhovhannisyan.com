---
title: Why I Don't Like Tailwind CSS
description: On paper, Tailwind CSS sounds like a great idea. In reality, it suffers from the same problems that it tries to solve.
keywords: [tailwind css, tailwind, don't like tailwind]
categories: [css, tailwind, frameworks]
lastUpdated: 2021-06-14
commentsId: 77
isPopular: true
---

{% aside %}
  **Update** ({%- include date.html date: "2021-03-12" -%}): Based on feedback, I've updated this post to clarify some points and to offer a more balanced perspective. This isn't a hill I'd die on; at the end of the day, what matters is that you're productive writing CSS. If that means using Tailwind, nobody's stopping you. Below are just some reasons why *I* don't enjoy using it.
{% endaside %}

You're at a restaurant, and there's an odd item on the menu that you've never heard of before, but it piques your interest. It sounds like it might be worth a try, though you're not sure.

When the waiter approaches your table, you inquire about the dish; he notes that while most people are initially repulsed by its appearance, they should still give it a try because the chef swears that it's *supremely delicious*. So, trusting his judgment, you order the dish and wait.

When your meal arrives, it looks just as unpleasant as it did in the menu. But you're not one to judge—you're willing to try new things. You carve into a slice of it and take a reluctant bite. And... well, it's really not that great.

In a nutshell, this was my experience with Tailwind CSS. It's by no means the worst thing to happen to CSS, but it's also not the panacea that its supporters claim it is—and, in fact, it has a lot of drawbacks that put me off.

The strange thing is that I actually read through all of [Adam Wathan's article on semantic CSS](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/), and I found myself initially agreeing with his points. Adam argues that the whole "semantic CSS" paradigm does not pan out in practice, and that developers tend to gravitate towards a **Utility CSS** approach over the course of their careers. According to this paradigm, your class names should be as granular as possible, responsible for one main task. These utility classes serve as the basic building blocks ("tokens") of your UI, allowing you to chain them together to implement complex designs. For example, if you find yourself repeating `display: flex` or `flex-wrap: wrap` in your CSS, you may want to abstract these out into utility classes, like `flex` or `flex-wrap`, that you can apply to any element.

> "I’ve written a few thousand words on why traditional 'semantic class names' are the reason CSS is hard to maintain, but the truth is you’re never going to believe me until you actually try it. If you can suppress the urge to retch long enough to give it a chance, I really think you'll wonder how you ever worked with CSS any other way." —[Adam Wathan](https://tailwindcss.com/), Tailwind CSS landing page

On paper, utility CSS actually sounds like it may be useful. In practice, though, Tailwind CSS (and utility CSS in general) suffers from the same issues that it attempts to solve and is, in my honest opinion, not worth using.

{% include toc.md %}

## But First, Why Does Tailwind CSS Exist?

Before we discuss the problems with Tailwind CSS, it's worth looking at why the framework was created in the first place and the problems that it's trying to solve. This is mostly covered in Adam Wathan's article linked above, which I highly recommend that you read even if you don't like Tailwind. I already mentioned some of the motivations behind Tailwind, but I'll recap them here.

One of the arguments that people in favor of Tailwind usually make is that the "semantic CSS" approach is flawed because your well-named CSS classes give a false sense of order and reason, when in reality there's a good deal of complex (and repeated) logic in your CSS. It's also difficult to come up with consistent standards for spacing, colors, and other design guidelines, and this can lead to bloated CSS and inconsistently styled UIs. Tailwind aims to solve these problems.

This is one of the arguments that Adam uses in his article. He notes that with the semantic CSS approach, there's this inherent coupling of HTML to CSS, where either your HTML classes dictate your CSS or vice versa. And thus, the whole "separation of concerns" principle falls apart because your HTML and CSS **depend on each other**.

> "*I had "separated my concerns", but there was still a very obvious coupling between my CSS and my HTML. Most of the time my CSS was like a mirror for my markup; perfectly reflecting my HTML structure with nested CSS selectors.*
>
> My markup wasn't concerned with styling decisions, but my CSS was very concerned with my markup structure.
>
> Maybe my concerns weren't so separated after all." —[CSS Utility Classes and "Separation of Concerns"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)

In principle, this makes sense. But as we'll see, Tailwind doesn't actually solve this problem of "separation of concerns." And it actually introduces several other problems.

## Why Tailwind Isn't Worth Your Time

With that out of the way, let's look at some of the reasons why I don't like Tailwind CSS.

### 1. Tailwind Makes Your Code Difficult to Read

[Other people who don't like Tailwind](https://dev.to/jaredcwhite/why-tailwind-isn-t-for-me-5c90) tend to start off by arguing that it makes your HTML look noisy and disgusting, and I'll do the same. Honestly, it's a valid argument if you care at all about your developer experience. Tailwind makes your markup difficult to read for several reasons that I'd like to explore here.

#### You Need to Learn a New Way of Writing CSS

First, like Bootstrap, Tailwind uses awkward abbreviations for its class names. This means that you have to first learn Tailwind's specific syntax before you can fluently string its utility classes together to create familiar UIs. So when you're first starting out with Tailwind, things will actually be slow, and you'll find yourself frequently referencing the documentation to find the right classes to use. The initial promise of rapid prototyping is quite a ways off until you become familiar with the framework.

#### It's Inconsistent

That sounds like a fairly easy task for anyone who's ever had to pick up a new language or tool, but Tailwind is inconsistent with some of its naming conventions. For example, with Flexbox, Tailwind's `justify-*` classes correspond to `justify-content` in CSS. Naturally, one would think that `align-*` classes would correspond to `align-items`. But, confusingly, they correspond to a little-used `align-content` property. This gets confusing because CSS also happens to have properties named `justify-items` and `align-content`. This means that, at a glance, you can't actually tell what any of these shorthand class names map to:

- `items-*`: align or justify?
- `content-*`: align or justify?
- `justify-*`: content or items?
- `align-*`: content or items?

This segues nicely into a related point.

#### It's Hard to Read

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

Unfortunately, ESLint/Prettier won't even properly format your classes or push them onto a new line—they'll just push the `className` prop down, but the string itself could go on forever. This may force you to scroll your editor horizontally to view the full list of classes. Tailwind's own documentation suffers from this very problem—many code blocks overflow horizontally and force you to scroll to find the relevant class in a sea of strings.

Over in CSS land, things are much easier to parse—you only have to scan your code *vertically*, so it's easier to search for a particular `property: value` pair. Plus, you get proper syntax highlighting, which clearly separates your properties from the values and makes things easier to read. With Tailwind, all your classes use your editor's color for strings. There are no properties or values because they've been stuffed into the class names themselves.

Here's the raw CSS equivalent of the Tailwind CSS above:

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

Another complaint I have with Tailwind is that, unlike CSS, it doesn't allow you to chain selectors to avoid repeating yourself. So if all of your active, hover, and focus states require the same CSS, you're going to very quickly bloat your classes. With CSS, you could just do this:

```css
.foo:focus,
.foo:active,
.foo:hover {
  /* CSS goes here */
}
```

#### It Makes PRs Harder to Review

While we're on the topic of semantics and legibility, let's address one last elephant in the room: **code reviews**. I am fortunate to have only worked with Tailwind CSS in local sandboxes, and not in any production projects or on an actual team of other devs.

I'm comfortable reading other people's code, and making sense of their logic and relating their markup to their CSS. But if I have to look at ~1000 LOC changes in a PR, and most of that is coming from long strings of class names, I'm not going to be happy. It's also going to be more difficult for me to make suggestions that could eliminate redundant CSS or simplify your markup.

It's information overload—in the Semantic CSS world, we first make sense of the markup with the help of well-named classes or IDs, and then we mentally associate these "things" with concrete CSS rules. Everything is easier to parse because we're taking it one thing at a time, and semantic classes help us to make sense of what we're looking at.

With Tailwind, you're forced to **interpret semantics on the fly**. The person who originally wrote the code probably had some idea of what they were creating, somewhere in the back of their mind. But they've probably forgotten it by now, and you have to guess what a particular slice of markup is responsible for just by reading an alphabet soup of classes.

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

With Tailwind, I'm a bit concerned about getting locked into the utility CSS paradigm, and specifically Tailwind's utility classes and their behavior. It's why I don't want to invest time in migrating existing projects to Tailwind and why I'd be reluctant to use it for any new projects.

Once you build an app with Tailwind, moving it to any other CSS framework or library in the future is going to be tricky. There are tools like Windy for [converting existing CSS to Tailwind](https://usewindy.com/), which sounds like a fairly easy thing to do. After all, Tailwind just breaks "compound" semantic classes down into "atomic" utility classes that have single responsibilities. If you have `.some-thing` that applies a bunch of CSS, then you can easily map `.some-thing`'s CSS rules to Tailwind classes.

But I can't imagine that it's possible to create a tool that does the reverse: **converting Tailwind to semantic HTML and CSS**. The only thing you could realistically convert Tailwind to is some other utility framework (e.g., Bootstrap) that locks you in with its own syntax and class names.

Because Tailwind classes are atomic building blocks that only do one thing, you can't really build more complex, semantic things out of them without assembling those classes by hand. After all, what assumptions would an automated tool make about your desired naming conventions, anyway? What is this `div`, or `img`, or `ul` that I'm looking at? *What do I call it*?

If you use Tailwind, you're stuck with it, unless you convert all of that CSS to semantic CSS by hand. If you want to move to anything in the future that's not Tailwind, it's going to require quite a bit of work. You'll either need to create your own in-house utility framework or use another one. Either way, it's never a good thing when a tool locks you into a particular paradigm that goes against the grain of what most other tools do.

### 4. Tailwind Is Bloated

**Edit** ({%- include date.html date: "2021-03-12" -%}): I'm wrong here. I should have done more research into Tailwind to understand that it is in fact *not* as slow as I originally thought. I've kept the original writing below for transparency.

Tailwind uses [PurgeCSS](https://purgecss.com/), which removes any unused styles from your compiled stylesheet. The Tailwind docs [note the following](https://tailwindcss.com/docs/optimizing-for-production):

> When removing unused styles with Tailwind, it's very hard to end up with more than 10kb of compressed CSS.

This is true for sites that don't need too many styles (e.g., blogs). You can browse some of the [popular sites built with Tailwind](https://builtwithtailwind.com/popular) and inspect their Network requests to get a sense for how large a typical Tailwind stylesheet may be. Here are some examples (these may change in the future):

- [https://adamwathan.me/](https://adamwathan.me/): 4.9 kB (Brotli)
- [https://www.swyx.io/](https://www.swyx.io/): 593 bytes (Brotli)
- [https://laracasts.com/](https://laracasts.com/): 26.1 kB (Brotli)
- [https://tailwindcss.com/](https://tailwindcss.com/): 25.6 kB (Brotli)

You can see that sites range quite a bit from the very low end to somewhere around `30 kB`. My own site's CSS is written in SCSS and is `7.0 kB` (also Brotli compressed), which is on the lower end of these examples (which, again, are a fairly small sample).

I do want to note that even if your CSS ends up being smaller with Tailwind, the network request for your HTML will probably be larger than if you had used BEM. It's not like things disappear into nowhere, after all—you've shifted the weight to your HTML, where class names are repeated several times, just like `property: value` pairs are repeated in a typical CSS stylesheet written without Tailwind.

But at the end of the day, you shouldn't worry about optimizing your CSS if your numbers are somewhere in this range. You can improve your site's performance in more impactful ways, like optimizing your images and font loading.

**Original**:

Utility CSS is inherently broken and bloated. Why? Because every new class name that you introduce could have potentially hundreds of property-value combinations, and that translates to more compiled CSS—which, of course, means a larger network request, and potentially slower performance.

Look no further than pseudo-class selectors like `:hover`, `:focus`, `:active`, and `:focus-within` to see why this is such a big deal. In fact, it's a problem that Tailwind is *very well aware of*. [Just read its documentation](https://v1.tailwindcss.com/docs/pseudo-class-variants):

> Not all pseudo-class variants are enabled for all utilities by default due to file-size considerations, but we've tried our best to enable the most commonly used combinations out of the box.

Translation: Tailwind is a costly abstraction, and its creators have tried their very best to hide this fact from you.

### 5. Tailwind Is an Unnecessary Abstraction

All Tailwind classes do just one thing and are wrapped in reusable utility classes. But Is Tailwind as reusable and "clean" as it's marketed?

For one, the great thing about ordinary CSS classes is that they usually *don't* do just one thing. After all, that's why classes exist in the first place—to help you group related styles together so you can reuse them.

With Tailwind, if you want to group related styles together under a reusable class name, you need to use [`@apply` directives](https://tailwindcss.com/docs/extracting-components#extracting-component-classes-with-apply), like in this example taken from the docs:

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

If it's not already obvious, `@apply` is a jailbreak that goes against Tailwind's founding and guiding principles. What's the difference between using `@apply` and just using the CSS rules that correspond to your utility classes? There *is* no difference—except now, you've defeated the point of using a utility CSS framework in the first place, and you're better off just writing vanilla CSS to begin with.

Tailwind adds this weird layer of redundancy to your code, forcing you to repeat `flex`, `mx`, and `py` in your HTML classes rather than repeating the *same exact things* but in CSS. What do you gain from this, except that you don't have to give your components meaningful class names? Your utility classes are atomic building blocks, sure, but so are CSS property-value pairs. It's an **unnecessary abstraction**.

In his article on utility classes and semantic CSS, Adam only begins to explore an alternative approach to Semantic CSS when he realizes that semantics can lead to repeated CSS spread across multiple classes, with no way to reconcile the shared bit of code while keeping the semantics bit intact. The irony of Tailwind is that it claims to solve this problem of repetition in CSS, as well as the problems inherent in Semantic CSS. But it doesn't solve anything. It decides to marry our HTML and CSS and keep them in a single place since the "semantic" approach is strictly coupled anyway, so we may as well go with the flow.

But this really isn't any better than writing CSS directly, and it's no more maintainable than directly applying inline styles. Instead of repeating styles in your CSS, **you're now repeating them in your HTML** through class names. In fact, you're likely repeating yourself three, four, possibly *many more* times now because you can't chain selectors or take advantage of new CSS selectors like `:is` or `:where`.

<hr>

**Edit** ({%- include date.html date: "2021-03-12" -%}): I still stand by my original points here, but I'd like to note that Tailwind has a very strong appeal for one key reason: It reduces a set of infinitely many property-value pairs to a strict set of finite design tokens to keep you in check so that you're not plucking arbitrary values out of thin air. This is always a good thing. However, consider whether you really need Tailwind. Vanilla CSS (and CSS preprocessors) already offer variables (in CSS land, we call them custom properties). As long as you create your own design tokens/theme variables, you shouldn't ever run into this issue. In fact, this is how Tailwind operates under the hood.

### 6. Semantics Is Important. Tailwind Forgoes It.

One of the most frequently cited arguments in favor of Tailwind is that Semantic CSS is difficult to achieve in practice because naming things is hard. Adam argues that this violates the principle of Separation of Concerns because now your HTML markup dictates your CSS. Effectively, you're making decisions in your HTML that really belong in your CSS. But let's think about this for a second: Is that really a problem?

For starters, if you're not sure what to call that `<div>` in your markup, consider whether it's actually needed. One of the great things about the Semantic CSS paradigm is that it forces you to structure your markup logically and meaningfully. It keeps you in check, ensuring that you don't just bloat your HTML with unnecessary wrapper elements on top of wrapper elements just to achieve whatever UI you're trying to build.

Freeing you from this constraint, Tailwind can actually encourage bad practices, where you no longer have to worry about that pesky "semantics" thing, and you can throw in as many `<div>`s as you want without caring about meaning. This goes hand in hand with the point I brought up earlier about Tailwind's legibility—when you have so many elements in a component soup of elements, and each one has a long string of class names, what even are you looking at anymore? Can you make sense of it at a glance?

Second, if you struggle to name things in the first place, this suggests that you'll run into communication issues down the line when discussing your UI with designers and other team members. If you can't name `X` element in your UI sensibly, and a conversation inevitably arises concerning that element, how are you going to refer to it? What are you going to call That Thing? Surely you can think of something. There's always a way to name things semantically.

Finally, remember that point I brought up earlier about how Tailwind CSS promotes ugly HTML markup? Supporters of the framework usually respond by reminding you that you're probably working with a component-based framework like React anyway, and so you're unlikely to be looking at a giant sea of markup in a single file. Fair point.

But I bring this up here because if you're using components, then you've likely **already given them sensible names**, haven't you? And if you've given your *components* sensible names, can you not apply that same pattern to your *class names*? This is where methodologies like BEM tend to shine (though I prefer a sort of pseudo-BEM approach that doesn't involve double underscores). Pick a convention and stick with it, and naming things becomes much easier.

In short, Tailwind pretends to solve a problem that isn't really a problem in the first place.

<hr>

**Edit** ({%- include date.html date: "2021-03-12" -%}): Tailwind is not completely devoid of any semantics. It just has *its own kind* of semantics. However, I would argue that it's always better to be able to name your sub-components, even at the most atomic level. Naming things is hard, but my point is that this difficulty is not something to shy away from: It's a good thing. It forces you to think about what you're building and to give your markup semantics that is otherwise not there. That said, Semantic CSS does have its own drawbacks. If you don't have consistent naming standards, everyone on your team may come up with their own creative variation of BEM.

### 7. Tailwind Makes It Difficult to Tweak Styles in Dev Tools

As a front-end developer, I sometimes find myself making little tweaks here and there in my browser through dev tools. For example, I might try applying some rules to a certain selector so I can verify that it produces the desired result.

With Tailwind, tweaking styles in this manner is difficult because you're no longer dealing with classes that apply styles to multiple elements. Thus, if you want to update multiple components at once in dev tools, you can't—unless you give each one a new class name and use that as the selector. Otherwise, your changes to Tailwind classes will be reflected elsewhere in the UI, which can be annoying.

Of course, you *can* apply your styles inline in dev tools to just that particular element, but sometimes it helps to see how changes are reflected throughout your UI rather than in a single, isolated location. This is one price you pay for using atomic utility classes.

### 8. Tailwind Is Still Missing Some Key Features

Almost two years after its initial release, Tailwind CSS [still doesn't support pseudo elements](https://github.com/tailwindlabs/tailwindcss/discussions/2119) (among other features), something that basic CSS and CSS preprocessors have supported for years. If this were implemented, you'd probably have to write something like `before:content-empty-string` in your HTML. By comparison, the plain CSS equivalent is far more legible.

I suspect this feature isn't realistic to implement. For both `::before` and `::after`, you would need possibly thousands of unique class names just so you could style your pseudo-elements as needed. That's simply not realistic. It's the same reason why Tailwind is such a bloated mess—all those innumerable prefixed class names are costly. The more classes that Tailwind decides to introduce, the more its complexity will grow—to the point that it will not be usable.

In a similar vein, Tailwind's support for CSS grid is lacking; you need to [configure a custom set of limited grids upfront](https://www.npmjs.com/package/@savvywombat/tailwindcss-grid-areas) and reuse those across your site, which isn't realistic because CSS grid's use cases aren't just limited to grid areas. The same goes for background gradients, animations, and many other bleeding-edge features that you can easily use in vanilla CSS without any mental overhead or configuration. With Tailwind, you either need to install a plugin or wait until it's officially supported. Neither one sounds like a good solution just so you can use basic features that CSS already offers.

## Fine, But What Should You Use Instead?

I know I bashed on Tailwind CSS quite a bit in this post. I'm sure it'll upset some people who like the framework, assuming anyone reads this. But regardless of how you feel about Tailwind, you'd probably agree that it's only fair of me to offer offer suggestions for alternatives.

Before I do that, I want to note that it feels like Tailwind was initially created to solve a problem that no longer exists: **component-scoped CSS**. With frameworks like React and, more recently, Svelte, it's never been easier to write CSS without leaving your markup, and without resorting to inline styles. You don't really need BEM, either.

As far as libraries go, I'm a big fan of [`styled-jsx`](https://github.com/vercel/styled-jsx). It was created by Vercel, the company that also brought us Next.js, and it's one of the best CSS-in-JS libraries I've worked with to date. I find this remarkable, considering that I was, for the longest time, adamantly opposed to using CSS-in-JS. But `styled-jsx` is an absolute *delight* to work with.

For one, it's just CSS, so there's no new syntax that you have to learn. All styles are locally scoped, like with CSS Modules, but you can also easily apply global styles. Components can pass along class names to style sub-components, and this allows you to build truly modular and atomic components that don't mess with other parts of your UI. It's much easier to use than `styled-components` since your CSS is literally just another JSX element. You can still interpolate JavaScript values in your CSS, making this extremely powerful and easy to use.

Here's an example (note that you'd get proper syntax highlighting in VS Code for the CSS):

```jsx
const Navbar = (props) => {
  return (<header className="navbar-header">
    <nav class="navbar">
      <Branding />
      <ul className="navbar-menu"></ul>
    </nav>
    <style jsx>{`
      .navbar-header {
        position: ${props.isSticky ? 'fixed' : 'static'};
        left: 0;
        right: 0;
        z-index: 10;
      }
      .navbar {
        background-color: #1a1a1a;
        height: 64px;
      }
      .navbar-menu {
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: 24px;
      }
    `}</style>
  </header>);
}
```

Interpolating values is even more powerful if you define your design guidelines in a single place, like under a `variables` export, since this means you can **reuse a fixed set of values** throughout your components:

```jsx
const Navbar = (props) => {
  return (<header className="navbar-header">
    <nav class="navbar">
      <Branding />
      <ul className="navbar-menu"></ul>
    </nav>
    <style jsx>{`
      .navbar-header {
        position: ${props.isSticky ? 'fixed' : 'static'};
        left: 0;
        right: 0;
        z-index: 10;
      }
      .navbar {
        background-color: ${variables.color.black[900]};
        height: ${variables.spacing.lg};
      }
      .navbar-menu {
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: ${variables.spacing.sm};
      }
    `}</style>
  </header>);
};
```

Sound familiar? This is one of the problems that Tailwind attempts to solve—restricting the infinite possibilities of vanilla CSS to a finite set of spacing, colors, and dimensions. With proper exports in place, you get the same benefit of having "design tokens" but without the problems inherent in Tailwind. You can even define mixins that you can call like ordinary functions to inject reusable bits of CSS into your code (SCSS users rejoice!).

In the case of really tiny components that only have one or two distinct elements, you can also directly target those `<div>`s or `<img>`s or whatever. Since your styles are scoped to just that component, you don't have to worry about your CSS rules tampering with other elements somewhere else in the app:

```jsx
const InfoIcon = () => (<svg>
  <style jsx>{`
    svg {
      /* CSS here is scoped to just this SVG */
    }
  `}</style>
</svg>)
```

If a component needs to customize another component's CSS, doing so is easy with `css.resolve`:

```jsx
import classnames from 'classnames';
import Child from '@components/Child'

const childStyles = css.resolve`
  .child-class-name {
    /* child CSS overrides go here */
  }
`;

const Parent = (props) => {
  return (<div className="parent">
    <Child className={classnames(childStyles.className, 'child-class-name')}>
    {childStyles.styles}
    <style jsx>{`
      .parent {
        /* parent CSS goes here */
      }
    `}</style>
  </div>);
}
```

The new styles will be more aggressively scoped than the child's base styles, meaning **you will never run into specificity issues**.

Finally, if you need to apply global styles, you can either use a global stylesheet:

```jsx
const Layout = () => (<main>
  <style jsx global>{`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `}</style>
</main>)
```

Or the one-off `:global` selector:

```jsx
const Component = () => (<div className="component">
  <style jsx>{`
    .component :global(selectorForStyleOverrides) {
      /* CSS here */
    }
  `}</style>
</div>);
```

And voila—just like that, you've solved all of the problems that Tailwind claims to, but without the tech debt. Because now, if you want to migrate your CSS to a different framework or library, all you have to do is copy-paste your rules. At the end of the day, it's **just vanilla CSS (in JS)**. You can easily port this to Gatsby, vanilla React, or even vanilla HTML/CSS/JS (with a bit more work).

## Final Thoughts

Tailwind allows you to prototype UI very rapidly, without having to slow down and make important naming decisions. This is an obvious plus for developers who need to move quickly and create proofs-of-concept. However, if you're at all concerned about the long-term maintenance of your code base, or the cost of onboarding new developers and expecting them to understand what your code does, then Tailwind is just additional tech debt. And for that reason, and the others that I touched on, I would not recommend using this CSS framework.

## Attributions

This article's social media preview uses Tailwind CSS's logotype, which is [under the copyright of Tailwind Labs Inc](https://tailwindcss.com/brand#assets).
