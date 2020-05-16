---
title: Create Heading Links in Jekyll with Includes
description: Want to make it easier for users to link to a heading in your blog? Learn how to create heading links in Jekyll using includes.
keywords: [heading links in jekyll]
tags: [dev, frontend, liquid, jekyll]
redirect_to: https://www.aleksandrhovhannisyan.com/blog/dev/heading-links-in-jekyll/
canonical_url: https://www.aleksandrhovhannisyan.com/blog/dev/heading-links-in-jekyll/
---

It's a common practice in blogs to link your headings; this makes it easier for users to share a specific part of your content without having to share the entire post's URL.

How can we create heading links in Jekyll without losing our sanity and without resorting to JavaScript?

Answer: with the power of Jekyll includes!

{% include linkedHeading.html heading="How to Create Heading Links in Jekyll" level=2 %}

Create a file named `linkedHeading.html` in your `_includes` folder. Here's what we want to do:

1. Create a dynamic heading that can be any level we want.
2. Give the heading an ID that we can reference.
3. Nest an anchor inside that heading that references the ID from above.
4. Fill the heading itself with some text.

With Liquid and Jekyll includes, it's super simple to create linked headings. Here's the markup:

{% capture code %}{% raw %}{% assign heading = include.heading %}
<h{{ include.level }} id="{{ heading | slugify }}" class="linked-heading">
    <a href="#{{ heading | slugify }}">#</a> {{ heading }}
</h{{ include.level }}>{% endraw %}{% endcapture %}
{% include code.html file="_includes/linkedHeading.html" code=code lang="liquid" %}

Simply use the following in your markdown to create a heading anchor in Jekyll:

{% capture code %}{% raw %}{% include linkedHeading.html heading="My Heading" level=someNumber %}{% endraw %}{% endcapture %}

{% include code.html code=code lang="liquid" %}

Short and sweet! And much more legible than copy-pasting a bunch of heading tags and anchors. Plus, you don't have to introduce any unnecessary dependencies, JavaScript, or gems to get this done.

> **Note**: If instead you want to link the entire heading, simply move {% raw %}`{{ heading }}`{% endraw %} into the anchor itself.

If you're curious, here's how that works:

1. We pass in a string to `heading`, which we access via `include.heading`. We assign this to a local variable so we don't have to keep repeating `include.heading`.
2. Using Liquid objects, we specify the level of the heading dynamically with {% raw %}`h{{ include.level }}`{% endraw %}. So if we pass in `level=2`, then we'll get `h2`. Do this for both the opening and closing tags.
3. Give the h tag an ID. The ID will be the string we passed in, but [slugged](https://jekyllrb.com/docs/liquid/filters/). You can also give it a class name if you want to style it later.
4. Create a nested anchor that points to the same slug: {% raw %}`href="#{{ heading | slugify }}"`{% endraw %}. The anchor text can be anything you want. I was inspired by the [CSS Tricks website](https://css-tricks.com/) and used a hashtag.

Then, after the anchor, we simply put a space followed by our unformatted heading string.

{% include linkedHeading.html heading="Sticky Navbar and Linked Headings" level=2 %}

If you have a sticky/fixed navbar like I do on this site, you may run into a problem where your heading anchors get stuck under the navbar when you click them.

Fortunately, the fix is simple: we can add a `scroll-margin-top` to our headings equal to the height of the navbar plus a certain offset, like so:

{% capture code %}h1, h2, h3, h4, h5, h6 {
    /* 64px navbar + 20px for spacing */
    scroll-margin-top: 84px;
}{% endcapture %}
{% include code.html code=code lang="css" %}

My navbar is `64px` tall, so I found that this works best. Feel free to play around with it on your site.

The only downside is that `scroll-margin-top` is [not currently supported in Internet Explorer](https://caniuse.com/#search=scroll-padding). But it'll work in pretty much all other browsers.

## And That's It!

The best part is that you can pick which headings you want to link to. As an example, for this conclusion, I decided not to create a heading link because there's not really any valuable content to share.

I hope you found this post helpful 🙂
