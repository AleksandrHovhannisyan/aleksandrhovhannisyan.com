---
title: "How to Add a Copy-to-Clipboard Button to Your Jekyll Blog"
description: Learn how to add a copy-to-clipboard button to your Jekyll blog using some clever Liquid templating and just a few lines of JavaScript.
tags: [dev, frontend, jekyll, liquid, javascript]
keywords: [copy to clipboard button]
isCanonical: true
lastUpdated: 2020-03-17
---

I'm always looking for ways to improve my site's user experience without toppling the precarious house of cards that is cross-browser compatibility (Internet Explorer be damned).

And one thing that recently drew my attention is the fact that many of my tutorials require copy-pasting code, especially for anything that's not too important to type out by hand (like CSS or terminal commands).

You're working with Jekyll, so you're probably using Markdown code blocks like this:

````markdown
Run this command to get started:

```bash
cd my-awesome-project && npm install
```
````

And that works. But let's face it: Copying this is just *too much work*—precious time that could be spent doing more productive things, like checking Slack or surfing Reddit. Plus, you have to, like, *drag your mouse* and Ctrl+C and stuff. *Ugh* 😫.

Why not make it possible to click a button that magically copies the code to your clipboard?

Well, ask and you shall receive. In this tutorial, we'll add a copy-to-clipboard button to your Jekyll blog in just a few lines of code. Here's what we'll be building:

{% include posts/picture.html img="demo" ext="GIF" alt="A demo of clicking a copy-to-clipboard button." shadow=false %}

*(Psst! You can also try this out live on my blog!)*

Note that this tutorial is going to be bare bones—I'm not going to introduce any irrelevant CSS or HTML. I'm just going to show you how to get this thing working at a functional level. Once that's taken care of, you can throw in any extra styling or elements that you want.

## Copy-to-Clipboard Button in Jekyll with Liquid and JavaScript

Let's run through how this is going to work at a high level:

1. We'll define the code that we want to copy and store that in a variable.
2. We'll pass in the code as an argument to an include.
3. The include file will define the copy-to-clipboard button and the code block.
4. The copy-to-clipboard button will get a `data-code` attribute with a copy of the code.
5. Special characters like quotes will be escaped in the code string.

Sound good? Let's first look at the include file itself:

### 1. Copy-to-Clipboard Include: `_includes/code.html`

{% capture code %}{% raw %}<button
  class="copy-code-button"
  aria-label="Copy code block to your clipboard"
  data-code="{{ include.code | escape }}"
></button>
```{{ include.lang }}
{{ include.code }}
```{% endraw %}{% endcapture %}
{% include code.html file="_includes/code.html" code=code lang="liquid" %}

We create a `button` and give it a well-named class. We also add an `aria-label` for screen readers.

Below is the accompanying Sass (trimmed down to the essentials). Feel free to change this to suit your needs. Note that some of this will make more sense once we make the copy-to-clipboard button interactive with JavaScript.

{% capture code %}.copy-code-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    background-color: #616161;
    color: #e7e7e7;
    padding: 0.4em 0.5em;
    border-radius: 5px;

    &::before {
        content: "Copy";
    }

    &::after {
        margin-left: 4px;
        content: "📋";
        width: 1em;
    }

    // This class will be toggled via JavaScript
    &.copied {
        &::before {
            content: "Copied!";
        }

        &::after {
            content: "✔️";
        }
    }
}{% endcapture %}
{% include code.html code=code lang="scss" %}

If you take a closer look at `_includes/code.html`, you'll notice this interesting `data-code` attribute:

```liquid
{% raw %}data-code="{{ include.code | escape }}"{% endraw %}
```

Later on, we're going to pass in a block of code with newlines, quotation marks, and all sorts of other characters as-is. Here, we use the `escape` Liquid filter to [escape any characters in our code](https://shopify.github.io/liquid/filters/escape/).

Here's a real example, from this very blog post, of what the escaped code would look like in HTML:

{% include posts/picture.html img="escaped-code" ext="PNG" alt="Inspecting an HTML element with Chrome dev tools." shadow=false %}

Cool! That way, the embedded quotes in the code don't break our HTML. And since we have a plaintext copy of the code in an attribute, we can use JavaScript to copy that to the clipboard (more on that later).

This part is hopefully self-explanatory:

````liquid
{% raw %}```{{ include.lang }}
{{ include.code }}
```{% endraw %}
````

Let's pretend that we've already stored our code as a literal string in a variable named `code` (we'll see how that's done in the next section). We would invoke the include like so:

```liquid
{% raw %}{% include code.html code=code lang="javascript" %}{% endraw %}
```

These two arguments will become accessible under `{% raw %}include.code{% endraw %}` and `{% raw %}include.lang{% endraw %}`, respectively.

So when Jekyll goes to evaluate the Liquid template, it'll perform the following substitutions:

{% capture code %}{% raw %}<button
  class="copy-code-button"
  aria-label="Copy code block to your clipboard"
  data-code="const foo = new Bar();"
></button>
```javascript
const foo = new Bar();
```{% endraw %}{% endcapture %}
{% include code.html file="_includes/code.html" code=code lang="markdown" copyable=false %}

This begs the following question: How do we store the code in a string variable?

How do we... say, *capture* it?

### 2. Liquid Capture Tag to the Rescue

Let's say you want to store the following code in a variable, with all special characters preserved:

```javascript
const foo = new Bar();
foo.doDangerousJavascriptThings();
console.log("I love Jekyll!");
```

You may be tempted to copy-paste this code into a string and assign that to a variable:

```liquid
{% raw %}{% assign code = "const foo = new Bar();
foo.doDangerousJavascriptThings();
console.log("I love Jekyll!");" %}{% endraw %}
```

Unfortunately, that won't work because our code contains quotation marks. That may not be too big of a deal because we could escape them. But a bigger problem is that the newlines will be consumed, and what you'll actually get is a one-liner.

To create a multi-line string in Jekyll, we need to use the [Liquid capture tag](https://stackoverflow.com/questions/30632101/what-does-capture-var-do-in-jekyll/30632158), like so:

```liquid
{% raw %}{% capture code %}const foo = new Bar();
foo.doDangerousJavascriptThings();
console.log("I love Jekyll!");{% endcapture %}{% endraw %}
```

Everything inside the capture tag is stored in a multi-line string and can later be referenced by the variable `code` (you could name this something else if you wanted to, by the way).

> **Note**: I recommend that you keep the capture start tag (`{% raw %}{% capture code %}{% endraw %}`) inline with the first line of code and the end tag (`{% raw %}{% endcapture %}{% endraw %}`) inline with the last line of code. If you don't, your code will get two extra newlines: one at the start and one at the end.

If this seems like too much work, it really isn't. There are only three simple steps:

1. Type `{% raw %}{% capture code %}{% endcapture %}{% endraw %}`.
2. Place your cursor between the start and end tags.
3. Paste in your code!

What if your blog post is about Jekyll and your code contains Liquid templates, like some of the code in this blog post does? In that case, simply do:

{% assign openTag = '{%' %}
```liquid
{% raw %}{% capture code %}{% endraw %}{{ openTag }} raw %}...{{ openTag }} endraw %}{% raw %}{% endcapture %}{% endraw %}
```

And just replace the ellipsis with your code.

Once you've captured the code, simply use the include:

```liquid
{% raw %}{% include code.html code=code lang="javascript" %}{% endraw %}
```

Rinse and repeat for every code block that you want to insert into your blog post!

#### Making Our Lives Easier with a Custom Snippet

Of course, all of that may still seem like a lot of work... Which is unfortunate—because while we're trying to make things easier for the user, we're making things harder for ourselves!

If you're using VS Code, you can set up a really handy snippet to save yourself time. If you're using another editor, such as Sublime Text or Atom, there's a [site that generates snippets for those, too](https://snippet-generator.app/).

On VS Code, open up your command palette (`Ctrl+Shift+P` on Windows and `Command+Shift+P` on Mac), type `user snippets`, and select `Preferences: Configure User Snippets`. Then type `markdown` in the search bar, and VS Code will open up a settings file for Markdown files. Insert this snippet:

{% capture code %}{% raw %}{
	"Code Snippet": {
		"prefix": "code",
		"body": [
			"{% capture code %}$1{% endcapture %}",
			"{% include code.html code=code lang=\"$0\" %}"
		]
	}
}{% endraw %}{% endcapture %}
{% include code.html file="markdown.json" code=code lang="json" %}

Then, in any Markdown file, all you'll have to do is type the prefix `code` and hit Enter; VS Code will auto-insert this snippet for you and even move your cursor so it's between the capture tags. This reduces a potentially tedious process to just a few keystrokes. Paste in your code, tab over to `lang=""` to specify the language, and you're all set!

> **Note**: If you're not seeing any suggestions when you type in Markdown files, the solution is to [enable quick suggestions for Markdown](https://github.com/Microsoft/vscode/issues/28048) in your VS Code user settings.

### 3. Copying to the Clipboard with JavaScript

Awesome! We're already two-thirds of the way done. Now, all that's left is the JavaScript to actually do the copying. And this is actually the easy part.

We'll start by defining a skeleton for the function:

{% capture code %}const copyCode = (clickEvent) => {
  // The magic happens here
};

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', copyCode);
});{% endcapture %}
{% include code.html file="assets/scripts/copyCode.js" code=code lang="javascript" %}

Pretty straightforward! We're just registering click handlers on all of the buttons on the current page.

The meat of the copy-to-clipboard logic is taken from [this StackOverflow answer](https://stackoverflow.com/a/46822033/5323344), which creates a temporary textarea element, adds it to the DOM, executes `document`'s copy command, and then removes the textarea:

{% capture code %}const copyCode = (clickEvent) => {
  const copyCodeButton = clickEvent.target;
  const tempTextArea = document.createElement('textarea');
  tempTextArea.textContent = copyCodeButton.getAttribute('data-code');
  document.body.appendChild(tempTextArea);

  const selection = document.getSelection();
  selection.removeAllRanges();
  tempTextArea.select();
  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(tempTextArea);

  // TODO more stuff here :)
};

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', copyCode);
});{% endcapture %}
{% include code.html file="assets/scripts/copyCode.js" code=code lang="javascript" %}

That's really all you need to get this to work, but I also have the following on the TODO line:

{% capture code %}copyCodeButton.classList.add('copied');
  setTimeout(() => {
    copyCodeButton.classList.remove('copied');
}, 2000);{% endcapture %}
{% include code.html code=code lang="javascript" %}

My copy-to-clipboard button uses CSS pseudo-elements to show `Copy 📋` in the default state and `Copied! ✔️` once the `copied` class has been added. This lasts for two seconds and gives the user feedback to indicate that copying to the clipboard went through successfully.

That's it! Don't forget to add a script tag so this code actually works. For example, you can stick this somewhere in your layout file for blog posts:

{% capture code %}<script src="/assets/scripts/copyCode.js"></script>{% endcapture %}
{% include code.html file="_layouts/post.html" code=code lang="html" %}

## Copy That!

It's amazing just how much you can get away with in Jekyll using simple Liquid templates and JavaScript! If you've been following along, you should now be all set to use copy-to-clipboard buttons in your Jekyll blog posts.

Admittedly, this does require some additional (albeit negligible) effort to use in place of regular Markdown code blocks. Refactoring my old posts was a pain, yes, but I'd say it's worth it if it makes the user experience better on my site. It also makes it easier for me to verify that my tutorials work when followed from scratch since I don't have to manually copy-paste all of the code.

I hope you enjoyed this tutorial! If you notice any typos or mistakes, [please let me know]({{ site.bugReport }}).
