---
title: An Accessible Jekyll Table of Contents
description: Easily create a table of contents in Jekyll with one simple include.
keywords: [jekyll table of contents]
tags: [dev, jekyll, accessibility]
---

Alright, let's cut to the chase: You want to create a table of contents in Jekyll, but you don't want to put in the effort to do it. Plus, you want to make things accessible for keyboard users so they don't have to tab through links just to get to your content. You can try this out below (click somewhere here on this text and then press tab!).

{% include toc.md %}

## How to Create a Table of Contents in Jekyll

Create an include file named `toc.md` and fill it with this markup:

{% capture code %}{% raw %}<div style="position: relative;">
    <a href="#toc-skipped" class="screen-reader-only">Skip table of contents</a>
</div>

## Table of Contents
{:.no_toc}

* TOC
{:toc}

<div id="toc-skipped"></div>{% endraw %}{% endcapture %}
{% include code.html file="_includes/toc.md" code=code lang="markdown" %}

The markup specific to the Jekyll table of contents is this bit, which uses some Kramdown magic to automatically generate a table of contents based on the post in which this file is included:

```markdown
* TOC
{:toc}
```

The following code just creates a `Table of Contents` heading level two that's excluded from the table of contents itself:

```markdown
## Table of Contents
{:.no_toc}
```

Then, in your post, all you have to do is insert this one-liner wherever you want your table of contents to appear:

{% capture code %}{% raw %}{% include toc.md %}{% endraw %}{% endcapture %}
{% include code.html code=code lang="liquid" %}

## Making the Table of Contents Accessible

Now, what's up with the HTML surrounding the table of contents? I'm talking about this stuff:

```html
<div style="position: relative;">
    <a href="#toc-skipped" class="screen-reader-only">Skip table of contents</a>
</div>

<!-- markdown TOC here -->

<div id="toc-skipped"></div>
```

An accessibility best practice that's gained popularity in recent years is giving keyboard and screen reader users the option to skip long navigation menus, as these tend to be quite annoying to tab through. You'll see this tactic on sites like Slack, GitHub, and many others (including this blog!).

Basically, we've inserted a dummy `div` with no content and an ID. We'll point to this dummy element using an anchor that's positioned *before* the table of contents. When users tab over that link and press `Enter`, they'll skip the entire navigation menu. Easy peasy!

## Making It Pretty

One last thing: You typically don't want "skip to content" links like this to be visible on the page. Rather, what you want is for them to be visible but *out of sight* until they receive focus or are encountered by a screen reader.

> **Note**: While you may be inclined to use `visibility: hidden` or `display: none`, these are not accessible options because most screen readers won't bother reading content that's not visible.

So, here's the Sass that'll get the job done:

{% capture code %}.screen-reader-only {
    position: absolute;
    left: -5000px;
    
    &:focus {
        left: 0;
    }
}{% endcapture %}
{% include code.html file="_sass/someSassFile.scss" code=code lang="scss" %}

And that's it! Since we've set `position: relative` on the anchor's container `div`, the anchor will be positioned relative to that element but out of sight. When a user tabs over it or a screen reader gets to that point in the markup, the user will be given the option to skip the table of contents altogether.

I hope that helps!
