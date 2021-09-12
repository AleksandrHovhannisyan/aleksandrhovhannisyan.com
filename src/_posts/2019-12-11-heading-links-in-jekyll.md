---
title: Create Heading Links in Jekyll with Includes
description: Want to make it easier for users to link to a heading in your blog? Learn how to create heading links in Jekyll using includes.
keywords: [heading links in jekyll]
categories: [liquid, jekyll]
lastUpdated: 2020-05-24
commentsId: 42
---

It's a common practice in blogs to link your headings; this makes it easier for users to share a specific part of your content without having to share the entire post's URL.

How can we create heading links in Jekyll without losing our sanity and without resorting to JavaScript? Answer: with the power of **Jekyll includes**!

## How to Create Heading Links in Jekyll

Create a file named `linkedHeading.html` in your `_includes` folder. Here's what we want to do:

1. Create a dynamic heading that can be any level we want.
2. Give the heading an ID that we can reference.
3. Nest an anchor inside that heading that references the ID from above.
4. Fill the heading itself with some text.

Then, we want two states:

1. When we hover over the heading, the anchor becomes visible.
2. When we hover over the anchor itself, it becomes visible.

With Liquid and Jekyll includes, it's super simple to create linked headings. Here's the markup:

{% include codeHeader.html file: "_includes/linkedHeading.html" %}
{% raw %}
```liquid
{% assign heading = include.heading %}
<h{{ include.level }} id="{{ heading | slugify }}" class="linked-heading">
    <span class="heading-anchor-wrapper">
        <a
          class="heading-anchor"
          aria-hidden="true"
          href="#{{ heading | slugify }}"
        >
          #
        </a>
    </span>
    {{ heading }}
</h{{ include.level }}>
```
{% endraw %}

And here's the Sass:

{% include codeHeader.html %}
```sass
.linked-heading {
    position: relative;

    .heading-anchor-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 1em;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);

        &:hover {
            .heading-anchor {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    &:hover {
        .heading-anchor {
            visibility: visible;
            opacity: 1;
        }
    }

    .heading-anchor {
        visibility: hidden;
        opacity: 0;
        display: flex;
        margin-left: 4px;
        transition: visibility 0.2s ease, opacity 0.2s ease;
    }
}
```

Simply use the following in your markdown to create a heading anchor in Jekyll:

{% include codeHeader.html %}
{% raw %}
```liquid
{% include linkedHeading.html heading="My Heading" level=someNumber %}
```
{% endraw %}

Short and sweet! And much more legible than copy-pasting a bunch of heading tags and anchors. Plus, you don't have to introduce any unnecessary dependencies, JavaScript, or gems to get this done.

{% aside %}
  **Note**: If instead you want to link the entire heading, simply move {% raw %}`{{ heading }}`{% endraw %} into the anchor itself.
{% endaside %}

If you're curious, here's how that works:

1. We pass in a string to `heading`, which we access via `include.heading`. We assign this to a local variable so we don't have to keep repeating `include.heading`.
2. Using Liquid objects, we specify the level of the heading dynamically with {% raw %}`h{{ include.level }}`{% endraw %}. So if we pass in `level=2`, then we'll get `h2`. Do this for both the opening and closing tags.
3. Give the heading tag an ID. The ID will be the string we passed in, but [slugged](https://jekyllrb.com/docs/liquid/filters/).
4. Create a nested anchor that points to the same slug: {% raw %}`href="#{{ heading | slugify }}"`{% endraw %}. The anchor text can be anything you want.

Then, after the anchor, we simply put a space followed by our unformatted heading string.

## Sticky Navbar and Linked Headings

If you have a sticky/fixed navbar like I do on this site, you may run into a problem where your heading anchors get stuck under the navbar when you click them.

Fortunately, the fix is simple: we can add a `scroll-margin-top` to our headings equal to the height of the navbar plus a certain offset, like so:

{% include codeHeader.html %}
```css
h1, h2, h3, h4, h5, h6 {
    /* 64px navbar + 20px for spacing */
    scroll-margin-top: 84px;
}
```

My navbar is `64px` tall, so I found that this works best. Feel free to play around with it on your site.

The only downside is that `scroll-margin-top` is [not currently supported in Internet Explorer](https://caniuse.com/#search=scroll-padding), so bear that in mind if you need to support this browser.

## Making Things Easier

Arguably the most annoying part is having to type out those include statements by hand.

There are two solutions to this:

1. If you're using an editor like VS Code that supports snippets, create one for heading links.
2. Type out all your headings in Markdown and then replace them all with regex at the end.

### Option 1: VS Code Snippet

Here's the one I use:

{% include codeHeader.html file: "markdown.json" %}
{% raw %}
```json
"Linked Heading": {
    "prefix": "heading",
    "body": [
        "{% include linkedHeading.html heading=\"$1\" level=$2 %}"
    ]
}
```
{% endraw %}

### Option 2: Regex Replacement

Start at heading level `6` and work your way down, using the following regex search and replacement:

**Search**: `###### (.*)`

**Replace**: {% raw %}`{% include linkedHeading.html heading="$1" level=6 %}`{% endraw %}

Work your way down, replacing the `6` with a `5`, `4`, `3`, and so on.

## And That's It!

I hope you found this post helpful 🙂 If you run into any issues implementing this on your own site, let me know down below and I'll try to help as best as I can.
