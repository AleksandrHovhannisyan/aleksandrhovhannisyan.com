---
title: Create Heading Links in Jekyll Without Any JavaScript (Using Includes)
description: Want to make it easier for users to link to a heading in your blog, but don't want to go through the hassle manually? In this post, we'll look at how you can create heading links with Jekyll includes.
keywords: ["heading links in jekyll", "create linked headings"]
---

It's a common practice in blogs to create linked headings; this makes it easier for users to share a specific part of your content without linking to the entire post.

How can we create heading links in Jekyll:

1. Without losing our sanity, and
2. With zero lines of JavaScript?

{% include linkedHeading.html heading="Answer: With the Power of Jekyll Includes!" h=2 %}

Create a file named `linkedHeading.html` in your `_includes` folder. Here's what we want to do:

1. Create a dynamic heading that can be any level we want.

2. Give the heading an ID that we can reference.

3. Nest an anchor inside that heading that references the ID from above.

4. Fill the heading itself with some text.

With Liquid and Jekyll includes, it's super simple to create linked headings. Here's the markup:

{% include posts/codeHeader.html name="_includes/linkedHeading.html" %}
{% raw %}
```html
{% assign heading = include.heading %}
<h{{ include.h }} id="{{ heading | slugify }}" class="linked-heading">
    <a href="#{{ heading | slugify }}">#</a>
    {{ heading }}
</h{{ include.h }}>
```
{% endraw %}

Simply use the following in your markdown wherever you want to create a linked heading in Jekyll:

{% raw %}
```liquid
{% include linkedHeading.html heading="My Heading" h=someNumber %}
```
{% endraw %}

Short and sweet! And much more legible than copy-pasting a bunch of heading tags and anchors.

> **Note**: If instead you want to link the entire heading, replace the hash symbol with {% raw %}`{{ heading }}`{% endraw %}.

If you're curious, here's how that works:

1. We pass in a string to `heading`, which we access via `include.heading`. We assign this to a local variable so we don't have to keep repeating `include.heading`.

2. Using Liquid objects, we specify the level of the heading dynamically with {% raw %}`h{{ include.h }}`{% endraw %}. So if we pass in `h=2`, then we'll get `h2`. Do this for both the opening and closing tags.

3. Give the h tag an ID. The ID will be the string we passed in, but [slugified](https://jekyllrb.com/docs/liquid/filters/). You can also give it a class name if you want to style it later.

4. Create a nested anchor that points to the same slug: {% raw %}`href="#{{ heading | slugify }}"`{% endraw %}. The anchor text can be anything you want. I was inspired by the [CSS Tricks website](https://css-tricks.com/) and used a hashtag.

Then, after the anchor, we simply plug in our heading string—in its non-slugged (unslugified?) form.

{% include linkedHeading.html heading="Sticky Navbar and Linked Headings" h=2 %}

If you have a sticky/fixed navbar like I do on this site, you may run into a problem where your headings get stuck under the navbar when you click the anchor.

Fortunately, the fix is a neat little trick: a negative top margin combined with a positive top padding. I like to leave about a `40px` difference between the two for spacing:

```css
h2 {
    margin-top: -50px;
    padding-top: 90px;
}
```

My navbar is `64px` tall, so I found that these two numbers work best. Feel free to play around with those to find what works best for your site.

## And That's It!

The best part is that you can pick which headings you want to link to. As an example, for this conclusion, I decided not to create a heading link because there's not really any valuable content to share.

I hope you found this post helpful 🙂
