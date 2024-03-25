---
title: How to Add a Copy-to-Clipboard Button to Jekyll
description: Add a copy-to-clipboard button to your Jekyll blog with a simple include and a few lines of JavaScript.
categories: [jekyll, liquid, javascript]
keywords: [copy to clipboard button]
lastUpdated: 2022-03-26
commentsId: 35
thumbnail: ./images/thumbnail.png
redirectFrom: /blog/how-to-add-a-copy-to-clipboard-button-to-your-jekyll-blog/
---

I'm always looking for ways to improve my site's user experience without toppling the precarious house of cards that is cross-browser compatibility. And one thing that recently drew my attention is the fact that many of my tutorials require copy-pasting code, especially for anything that's not too important to type out by hand (e.g., terminal commands).

You're working with Jekyll, so you're probably using triple-backtick Markdown code blocks. And that works! But copy-pasting those code blocks can get tedious, and it's not too accessible to keyboard users. Why not create a button that magically copies Markdown code blocks to your clipboard?

Well, ask and you shall receive! In this tutorial, we'll add a copy-to-clipboard button to your Jekyll blog in just a few lines of code. Note that I won't share any optional CSS or HTML. I'm just going to show you how to get it working at a functional level. Once that's taken care of, you can throw in any extra styling that you want.

## Copy-to-Clipboard Button in Jekyll with Liquid and JavaScript

At a high level, all we need is a simple include file that we can stick in front of a Markdown fenced code block to render a copy-to-clipboard button. Then we'll throw in a bit of JavaScript to actually copy the code block to our clipboard. Let's first look at the include file itself:

### 1. Copy-to-Clipboard Include: `_includes/codeHeader.html`

```html {data-file="_includes/codeHeader.html" data-copyable=true}
<div class="code-header">
  <button class="copy-code-button">
    Copy code to clipboard
  </button>
</div>
```

We created a `button` and gave it a well-named class.

And here's how you'd use this include:

{% raw %}
````markdown
{% include codeHeader.html %}
```someLanguage
code goes in here!
```
````
{% endraw %}

This just renders a normal fenced code block (with triple backticks). Right before that, we render the code header, which includes the copy-to-clipboard button.

Below is just some basic CSS to get you started; styling the button is beyond the scope of this tutorial.

```scss {data-copyable=true}
.copy-code-button {
  display: block;
}
```

### 2. Copying to the Clipboard with JavaScript

All that's left is the JavaScript to copy the code to your clipboard. And that's actually the easy part!

We'll look up two arrays, side by side:

1. All code block headers.
2. All code blocks (which are siblings adjacent to the headers).

Here's the code:

```javascript {data-file="assets/scripts/copyCode.js" data-copyable=true}
// This assumes that you're using Rouge; if not, update the selector
const codeBlocks = document.querySelectorAll('.code-header + .highlighter-rouge');
const copyCodeButtons = document.querySelectorAll('.copy-code-button');

copyCodeButtons.forEach((copyCodeButton, index) => {
  const code = codeBlocks[index].innerText;

  copyCodeButton.addEventListener('click', () => {
    // Copy the code to the user's clipboard
    window.navigator.clipboard.writeText(code);

    // Update the button text visually
    const { innerText: originalText } = copyCodeButton;
    copyCodeButton.innerText = 'Copied!';

    // (Optional) Toggle a class for styling the button
    copyCodeButton.classList.add('copied');

    // After 2 seconds, reset the button to its initial UI
    setTimeout(() => {
      copyCodeButton.innerText = originalText;
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
```

{% aside %}
  To keep things simple, I'm just updating the text of the button directly. To make this more accessible for screen reader users, you'll probably also want to insert a `div` with [`role="alert"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role) somewhere in the DOM since screen readers normally don't narrate button text changes.
{% endaside %}

This uses the `window.navigator.clipboard` API to copy the code block to the clipboard as a string. This API is supported by all modern browsers, so you don't have to use any [textarea hacks](https://stackoverflow.com/a/46822033/5323344).

Note that you may need to replace `.highlighter-rouge` if you're using a different syntax highlighter with Jekyll. It ships with Rouge by default, and `.highlighter-rouge` is the class that gets applied to code blocks.

That's it! Don't forget to add a script tag so this code actually works. For example, you can stick this somewhere in your layout file for blog posts:

```html {data-file="_layouts/post.html" data-copyable=true}
<script src="/assets/scripts/copyCode.js"></script>
```

## Copy That!

If you've been following along, you should now be all set to use copy-to-clipboard buttons in your Jekyll blog posts. I'll leave it up to you to make the code block header look nicer than what I've presented here. You can also throw in extra logic for things like file names and the language that the code is using.
