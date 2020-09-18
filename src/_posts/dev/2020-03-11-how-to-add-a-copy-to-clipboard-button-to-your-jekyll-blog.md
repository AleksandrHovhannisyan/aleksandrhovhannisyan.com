---
title: "How to Add a Copy-to-Clipboard Button to Your Jekyll Blog"
description: Learn how to add a copy-to-clipboard button to your Jekyll blog using some clever Liquid templating and just a few lines of JavaScript.
tags: [dev, jekyll, liquid, javascript]
keywords: [copy to clipboard button]
last_updated: 2020-09-18
comments_id: 35
thumbnail: thumbnail.gif
is_popular: true
---

I'm always looking for ways to improve my site's user experience without toppling the precarious house of cards that is cross-browser compatibility. And one thing that recently drew my attention is the fact that many of my tutorials require copy-pasting code, especially for anything that's not too important to type out by hand (e.g., terminal commands).

You're working with Jekyll, so you're probably using Markdown code blocks like this:

````markdown
Run this command to get started:

```bash
cd my-awesome-project && npm install
```
````

And that works, sure. But copy-pasting this can get tedious really quickly, and it's barely accessible. Why not create a button that magically copies Markdown code blocks to your clipboard?

Well, ask and you shall receive! In this tutorial, we'll add a copy-to-clipboard button to your Jekyll blog in just a few lines of code. Here's a sneak peek at what we'll be building:

<figure>
    {% include picture.html img="demo.gif" alt="A demo of clicking a copy-to-clipboard button." %}
    <figcaption>Psst! You can also try this out live on my blog!</figcaption>
</figure>

Note that this tutorial won't introduce any optional CSS or HTML. I'm just going to show you how to get this thing working at a functional level. Once that's taken care of, you can throw in any extra styling or elements that you want.

## Copy-to-Clipboard Button in Jekyll with Liquid and JavaScript

Let's run through how this is going to work at a high level:

1. We'll define the code that we want to copy and store that in a variable.
2. We'll pass in the code as an argument to an include.
3. The include file will define the copy-to-clipboard button and the code block.
4. The copy-to-clipboard button will get a `data-code` attribute with a copy of the code.
5. Special characters like quotes will be escaped in the code string.

Sound good? Let's first look at the include file itself:

### 1. Copy-to-Clipboard Include: `_includes/code.html`

{% capture code %}{% raw %}<div class="copy-code-container">
    <button class="copy-code-button"
         aria-label="Copy code block to your clipboard" 
         data-code="{{ include.code | escape }}"
    ></button>
</div>
```{{ include.lang }}
{{ include.code }}
```{% endraw %}{% endcapture %}
{% include code.html file="_includes/code.html" code=code lang="liquid" %}

> **Note**: If you need to show fenced code blocks in your tutorials and want the triple backticks to show up as-is in the output HTML (e.g., like I did above), you should use *four* backticks in your `code.html` file. That way, the nested `include.code` object (which is assumed to house the triple backticks) won't break the Markdown processor.

We create a `button` and give it a well-named class. We also add an `aria-label` for screen readers.

Below is the essential CSS (I'm using SCSS). Feel free to change this to suit your needs. Note that some of this will make more sense once we make the copy-to-clipboard button interactive with JavaScript.

{% capture code %}.copy-code-container {
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  background: #3b3b3b;
}

.copy-code-button {
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

{% include picture.html img="escaped-code.png" alt="Inspecting an HTML element with Chrome dev tools." %}

Cool! That way, the embedded quotes in the code don't break our HTML. And since we've stored the code in an HTML attribute, we can use JavaScript to copy that to the clipboard later on.

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

These two arguments will become accessible under `{% raw %}include.code{% endraw %}` and `{% raw %}include.lang{% endraw %}`, respectively. So when Jekyll goes to evaluate the Liquid template, it'll perform the following substitutions:

{% capture code %}{% raw %}<div class="copy-code-container">
    <button
      class="copy-code-button"
      aria-label="Copy code block to your clipboard"
      data-code="const foo = new Bar();"
    ></button>
</div>
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

And just replace the ellipsis with your code. Once you've captured the code, simply use the include:

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

## Further Improvements: File Name and Copy-to-Clipboard Button

Of course, you may have noticed that the code blocks on my own website have four variants:

1. No code block header (no file name or copy-to-clipboard button). These are your standard Markdown code blocks rendered with triple backticks.
2. Code block header with the file name only (for illustrative code that shouldn't be copied).
3. Copy-to-clipboard button only (whenever there isn't a file name, like for terminal commands).
4. Both a file name and a copy-to-clipboard button.

This layout isn't actually as complicated as it may seem; you just need a top-level wrapper `div` for the header, with two nested flex containers: one for the file name and another for the button:

{% include picture.html img="improvements.gif" alt="Inspecting the code block headers on my website" %}

All of these variations still use the same include file that we looked at in this blog post, except some elements are **conditionally rendered** based on a flag parameter that I pass in whenever I don't want to render something. Here's what my full `_includes/code.html` file looks like:

{% capture code %}{% raw %}<div class="code-header">
    {% if include.file %}
    <div class="code-file-name-container">
        <span class="code-file-name">{{ include.file }}</span>
    </div>
    {% endif %}
    {% unless include.copyable == false %}
    <div class="copy-code-container">
        <button class="copy-code-button"
             aria-label="Copy code block to your clipboard" 
             data-code="{{ include.code | escape }}"
             type="button"
        ></button>
    </div>
    {% endunless %}
</div>
```{{ include.lang }}
{{ include.code }}
```{% endraw %}{% endcapture %}
{% include code.html file="_includes/code.html" code=code lang="liquid" %}

For example, using the `unless` Liquid tag and a flag passed in as an argument, I can regulate when the copy button should appear:

```liquid
{% raw %}{% unless include.copyable == false %}
    <div class="copy-code-container">
        <button class="copy-code-button"
             aria-label="Copy code block to your clipboard" 
             data-code="{{ include.code | escape }}"
             type="button"
        ></button>
    </div>
{% endunless %}{% endraw %}
```

This means I can later import the file as follows, and it won't render the copy-to-clipboard button:

{% capture code %}{% raw %}{% include code.html code=code lang="myFavoriteLanguage" copyable=false %}{% endraw %}{% endcapture %}
{% include code.html code=code lang="liquid" %}

If you're wondering why I used `unless` instead of `if`, it's because this allows me to specify the default behavior as "always include a copy-to-clipboard button unless I say otherwise."

Likewise, if I want to specify a file name, I just need to pass in `file="myFileName"`, and that'll conditionally render the div for the file container with a simple `if` tag:

```liquid
{% raw %}{% if include.file %}
    <div class="code-file-name-container">
        <span class="code-file-name">{{ include.file }}</span>
    </div>
{% endif %}{% endraw %}
```

## Copy That!

It's amazing just how much you can get away with in Jekyll using simple Liquid templates and JavaScript! If you've been following along, you should now be all set to use copy-to-clipboard buttons in your Jekyll blog posts. I'll leave it up to you to make the code block header look nicer than what I've presented here. Get creative!

Admittedly, this does require some additional (albeit negligible) effort to use in place of regular Markdown code blocks. Refactoring my old posts was a pain, yes, but I'd say it's worth it if it makes the user experience better on my site. It also makes it easier for me to verify that my tutorials work when followed from scratch since I don't have to manually copy-paste all of the code.

I hope you enjoyed this tutorial! If you run into any issues implementing this on your own site, let me know down below and I'll try to help as best as I can.
