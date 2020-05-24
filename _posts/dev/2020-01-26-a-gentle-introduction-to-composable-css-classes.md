---
title: A Gentle Introduction to Composable CSS Classes
description: Composable CSS is an approach to styling that minimizes the overlap between different classes, allowing you to create legible, maintainable stylesheets. In this tutorial, we'll look at how you can compose CSS classes to create unique components.
keywords: ["composable CSS classes", "compose CSS classes", "composable CSS"]
tags: [dev, design, frontend, css]
---

Let's say you create a button on your website. You give it a class of `button` and throw in a bunch of awesome styling, including some colors and animations. Great!

But then you realize that you need a few more button variants for your site—maybe a hollow version for info, a red button to express danger, or a button with an arrow that moves when you hover over it.

Sound familiar? There are two ways to approach this:

1. Override all of the default `button` styles in each specialized button class.
2. Use composable classes that don't mess with each other's styling.

There are some issues with the first approach. One is that a specialized class may need to "undo" a base class's rules instead of overriding them, making your CSS more difficult to understand. Another is that you must carefully order your CSS selectors, or else your default styles may override the more specialized ones:

```css
.danger-button {
    background-color: red;
}

.hollow-button {
    background-color: transparent;
}

.arrow-button {
    background: none;
}

.button {
    background-color: blue;
}
```

If we now try the following markup, we won't get the expected result:

```html
<a href="" class="button hollow-button danger-button">Click me!</a>
```

To make matters worse, the more that your classes overlap and meddle in each other's business, the more likely it is that you'll need to throw in an `!important` or two to untangle the mess.

But there *is* an alternative that doesn't suffer from the drawbacks of specificity and rule overriding. In this tutorial, we'll look at how you can compose CSS classes to create unique components.

{% include linkedHeading.html heading="Composable CSS to the Rescue" level=2 %}

When I use the term **composable CSS**, I'm referring to a practice where each class only defines the styles that it needs at a minimum. Basically, you trim any unnecessary styling to minimize overlap with other styles.

For example, suppose this is what our `button` class originally looks like:

```css
.button {
    align-items: center;
    background-color: hsla(210, 100%, 50%, 1);
    border-radius: 5px;
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 20px;
    text-decoration: none;
}
```

Now, consider this: Does every button need to have a blue background? White text? Of course not!

So, in this case, the `button` styling should really be:

{% capture code %}.button {
    align-items: center;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    padding: 20px;
    text-decoration: none;
}{% endcapture %}
{% include code.html code=code lang="css" %}

This leaves room for other, more specialized classes to determine the background and foreground colors as needed, without overriding any other styles and potentially interfering with each other.

{% include linkedHeading.html heading="Tutorial: Composable Button Classes" level=2 %}

This is what we'll be building:

{% include picture.html img="buttons" ext="JPG" alt="Composable buttons" shadow=false %}

There are seven classes at play here:

- `button`
- `solid-button`
- `hollow-button`
- `arrow-button`
- `primary`
- `secondary`
- `danger`

Along the way, we'll group these into three distinct categories:

- **Button type**: Solid or hollow.
- **Decorations (optional)**: Arrow.
- **Button color**: Primary, secondary, or danger.

Pick two from the same category, and they should be mutually exclusive. Pick two from different categories, and they shouldn't interfere with each other. That's the beauty of this approach—we *compose* classes to create specialized buttons.

{% include linkedHeading.html heading="1. Setup: Basic Markup and Styling" level=3 %}

I'm just going to give you the full markup now to make this tutorial easier to follow:

{% capture code %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
    <div id="buttons">
        <a href="" class="button solid-button primary">Click me!</a>
        <a href="" class="button solid-button secondary">Click me!</a>
        <a href="" class="button solid-button danger">Don't click me!</a>

        <a href="" class="button solid-button arrow-button primary">Click me!</a>
        <a href="" class="button solid-button arrow-button secondary">Click me!</a>
        <a href="" class="button solid-button arrow-button danger">Don't click me!</a>

        <a href="" class="button hollow-button primary">Click me!</a>
        <a href="" class="button hollow-button secondary">Click me!</a>
        <a href="" class="button hollow-button danger">Don't click me!</a>

        <a href="" class="button hollow-button arrow-button primary">Click me!</a>
        <a href="" class="button hollow-button arrow-button secondary">Click me!</a>
        <a href="" class="button hollow-button arrow-button danger">Don't click me!</a>
    </div>
</body>
</html>{% endcapture %}
{% include code.html file="index.html" code=code lang="css" %}

And here's some basic styling to get us started:

{% capture code %}* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    --primary-color-light: hsla(210, 100%, 50%, 1);
    --primary-color-dark: hsla(210, 100%, 45%, 1);
    --secondary-color-light: hsla(37, 100%, 50%, 1);
    --secondary-color-dark: hsla(37, 100%, 45%, 1);
    --danger-light: hsla(10, 100%, 50%, 1);
    --danger-dark: hsla(10, 100%, 40%, 1);

    font-size: 18px;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    width: 100%;
}

#buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 64px 64px 64px 64px;
    row-gap: 30px;
    column-gap: 30px;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Nothing fancy here—I just set up a grid for the buttons, some colors, and the font.

{% include picture.html img="unstyled" ext="JPG" alt="An unstyled grid of buttons" shadow=false %}

Things look pretty naked at this point, but that's about to change.

{% include linkedHeading.html heading="2. What Does a Button Look Like? 🤔" level=3 %}

As I mentioned earlier, we want the base button class to only define the characteristics that are common to all of our buttons:

{% capture code %}.button {
    border-radius: 5px;
    text-decoration: none;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

And here's the result:

{% include picture.html img="button-style" ext="JPG" alt="Buttons with the button class enabled" shadow=false %}

These don't look like buttons yet, and that's the point. The `button` class only defines the minimum set of characteristics common to all buttons.

{% include linkedHeading.html heading="3. Solid Buttons! 🟦" level=3 %}

In the first two rows, we have some old-fashioned solid buttons. What should those look like? Here's where it gets interesting:

{% capture code %}.solid-button {
    color: white;
    transition: background-color 0.2s ease-in-out;
}

.solid-button.primary {
    background-color: var(--primary-color-light);
}

.solid-button.primary:hover {
    background-color: var(--primary-color-dark);
}

.solid-button.secondary {
    background-color: var(--secondary-color-light);
}

.solid-button.secondary:hover {
    background-color: var(--secondary-color-dark);
}

.solid-button.danger {
    background-color: var(--danger-light);
}

.solid-button.danger:hover {
    background-color: var(--danger-dark);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Let's check out the result:

{% include picture.html img="solid-buttons" ext="JPG" alt="Solid buttons" shadow=false %}

{% include linkedHeading.html heading="4. Hollow Buttons! 🔲" level=3 %}

If the previous section made sense, then this one should be fairly straightforward, as it follows a similar pattern:

{% capture code %}.hollow-button {
    background-color: transparent;
    transition: box-shadow 0.2s ease-in-out;
}

.hollow-button.primary {
    color: var(--primary-color-light);
    border: solid 2px var(--primary-color-light);
}

.hollow-button.primary:hover {
    color: var(--primary-color-dark);
    box-shadow: 0 0 0 1px var(--primary-color-dark);
}

.hollow-button.secondary {
    color: var(--secondary-color-light);
    border: solid 2px var(--secondary-color-light);
}

.hollow-button.secondary:hover {
    color: var(--secondary-color-dark);
    box-shadow: 0 0 0 1px var(--secondary-color-dark);
}

.hollow-button.danger {
    color: var(--danger-light);
    border: solid 2px var(--danger-light);
}

.hollow-button.danger:hover {
    color: var(--danger-dark);
    border: solid 2px var(--danger-dark);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

{% include picture.html img="hollow-buttons" ext="JPG" alt="Hollow buttons" shadow=false %}

We're almost there!

{% include linkedHeading.html heading="5. Arrow Buttons! ➡️" level=3 %}

Let's decorate some of our buttons with arrows that move when you hover over them:

{% capture code %}.arrow-button::after {
    font-size: 20px;
    margin-left: 10px;
    content: "→";
    transform: translateX(0);
    transition: transform 0.2s ease-in-out;
}

.arrow-button:hover::after {
    transform: translateX(5px);
}{% endcapture %}
{% include code.html file="style.css" code=code lang="css" %}

Here's the final result:

{% include picture.html img="buttons" ext="JPG" alt="Composable buttons" shadow=false %}

{% include linkedHeading.html heading="More Examples of Composable CSS" level=2 %}

You can extend this practice for different use cases:

- **Cards**: Project cards, blog post previews, etc.
- **Tags**: Skills, blog post categories, project topics, etc.
- **Images**: Images with shadows, regular images, rounded images, etc.

{% include linkedHeading.html heading="Don't Get Carried Away 🧂" level=2 %}

As with all things in life, moderation is key. Composable CSS isn't really a design pattern, and it's not something I would encourage following religiously. But it does have its use cases, and it can create some very clean and organized CSS.

Don't get carried away with breaking down your components into so many lego blocks that you create convoluted inheritance hierarchies, where it's really difficult to keep track of all the little specialized classes and cover all of your bases.

{% include linkedHeading.html heading="Keeping Things Maintainable" level=2 %}

I'm not going to ignore the elephant in the room. As you introduce more specialized classes, you end up having to account for exponentially more variations in your stylesheet. And that's no fun.

I used plain-old CSS in this post to keep it generic. You're more than welcome to use a CSS preprocessor like SASS or LESS and define some custom functions or mixins to reduce the amount of work that goes into composing different classes together.

Better yet, you may want to look into adopting a methodology such as [BEM (Block-Element-Modifier)](http://getbem.com/introduction/).

I hope you found this post helpful!
