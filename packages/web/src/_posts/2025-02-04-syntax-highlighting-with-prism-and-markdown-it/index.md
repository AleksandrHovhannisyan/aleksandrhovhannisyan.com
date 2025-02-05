---
title: Syntax Highlighting with Prism.js and markdown-it
description: Learn how to add line numbers, file names, and copy-to-clipboard buttons to your code blocks.
thumbnail: ./images/thumbnail.jpg
categories: [javascript, markdown]
keywords: [prism, syntax highlight, markdown-it]
lastUpdated: 2025-02-05
---

If you're reading this article, you've probably heard of [Prism.js](https://prismjs.com/), a popular syntax highlighter library. You give it the code that you want to highlight and pick a grammar and language, and it returns an HTML string that wraps each token in `<span>`s with class names that you can style with CSS.

For example, this input:

```js {data-file="markdown.js"}
import Prism from 'prismjs';

const code = `console.log('hello world');`;
const html = Prism.highlight(code, Prism.languages.js, 'js');
console.log(html);
```

Gives this output:

```html {data-file="output.html"}
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'hello world'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
```

Meanwhile, [markdown-it](https://github.com/markdown-it/markdown-it) converts Markdown to HTML. This Markdown file:

````md {data-file="input.md"}
# Heading

```js
console.log('hello world');
```
````

When processed with this code:

````js {data-file="markdown.js"}
import MarkdownIt from 'markdown-it';

const md = MarkdownIt(options);
md.render(file);
````

Gives this output:

```html {data-file="output.html"}
<h1>Heading</h1>
<pre>
  <code class="language-js">console.log('hello world');</code>
</pre>
```

As you can see, markdown-it doesn't add any syntax highlighting on its own; it only renders the fenced code block inside `<pre><code>...</code></pre>` tags and leaves it up to you to configure a syntax highlighter.

In this tutorial, you'll learn how to use Prism as the syntax highlighter for markdown-it. You'll also learn how to add line numbers, file name headers, and copy-to-clipboard buttons to your code blocks.

{% include "toc.md" %}

## 0. Prerequisites

This tutorial assumes basic knowledge of Node.js and JavaScript (ES6+). To keep things short, we won't look at any theming or CSS for Prism. Finally, this article only focuses on the server side (Node.js); if you're highlighting code blocks with Prism.js on the client side, then this isn't the right tutorial for you.

## 1. Using Prism.js in markdown-it

I'll assume you've already installed markdown-it and Prism.js and [configured markdown-it](https://github.com/markdown-it/markdown-it?tab=readme-ov-file#init-with-presets-and-options) with your desired options:

```js {data-file="markdown.js" data-copyable="true"}
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';

const md = MarkdownIt(options);
```

One of the configuration options for markdown-it is `highlight`, a function that accepts two arguments:

1. The fenced code as plaintext, and
2. The language name after the triple backticks in your Markdown.

The function should return an HTML string for the syntax-highlighted code:

```js {data-file="markdown.js" data-copyable="true"}
const md = MarkdownIt({
  highlight: (code, lang) => {
    return 'highlighted code';
  },
});
```

So all we need to do is call `Prism.highlight`:

```js {data-file="markdown.js" data-copyable="true"}
const md = MarkdownIt({
  highlight: (code, lang) => {
    return Prism.highlight(code, Prism.languages[lang], lang)
  },
});
```

This is the basic setup that we'll use in the rest of this tutorial.

### 1.1. Loading Languages on Demand

The second argument to `Prism.highlight` is the grammar of the language we want to use when highlighting our code:

```js
Prism.highlight(code, grammar, lang)
```

Each grammar is a JavaScript object that maps token types to regular expressions.

```js {data-file="prismjs/components/prism-javascript.js"}
Prism.languages.javascript = Prism.languages.extend('clike', {
	'class-name': [
		Prism.languages.clike['class-name'],
		{
			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
			lookbehind: true
		}
	],
	'keyword': [
		{
			pattern: /((?:^|\})\s*)catch\b/,
			lookbehind: true
		},
		{
			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
			lookbehind: true
		},
	],
    // etc.
}
```

These grammars tell Prism how to highlight code written in a particular language. In v1.29.0, `Prism.languages` is preloaded with the following commonly used languages as an optimization:

- `plain`
- `plaintext`
- `text`
- `txt`
- `DFS`
- `markup`
- `html`
- `svg`
- `ssml`
- `rss`
- `clike`
- `js`
- `markup`
- `mathml`
- `xml`
- `atom`
- `css`
- `javascript`

This list isn't exhaustive. For example, `typescript`, `cpp`, and many others are not loaded by default (although their grammars _are_ supported). So if we try to highlight code for which Prism hasn't loaded a grammar, we'll get an error:

```
Error: The language "typescript" has no grammar.
```

Thankfully, we can load grammars on demand:

```js {data-file="markdown.js" data-copyable="true"}
import loadLanguages from 'prismjs/components/index.js';

const md = MarkdownIt({
  highlight: (code, lang) => {
    if (!Object.hasOwn(Prism.languages, lang)) {
      loadLanguages([lang]);
    }
    return Prism.highlight(code, Prism.languages[lang], lang)
  },
});
```

Here, we first check to see if Prism has already loaded a grammar for that language. If it hasn't, then we load the grammar ourselves with `loadLanguages`. Now, we'll no longer get an error if we try to use a language that Prism hasn't preloaded.

### 1.2. Language Aliases and Default Language

In my Markdown, I prefer to omit the language for plaintext code blocks instead of explicitly using a language name of `text` or `plaintext`:

````md
```
This is plaintext code
```
````

There's another problem: While Prism does have grammars for most programming languages, and it even registers aliases for common ones—like `ts` for TypeScript or `js` for JavaScript—there are a few outliers. For example, [Nunjucks isn't supported at all](https://github.com/PrismJS/prism/issues/1124), and some aliases like `c++` or `c#` aren't recognized.

We can address both of these problems with the following code:

```js {data-file="markdown.js" data-copyable="true"}
const DEFAULT_LANGUAGE_IF_UNSPECIFIED = 'plaintext';

const LANGUAGE_ALIASES = new Map([
  ['c++', 'cpp'],
  ['c#', 'csharp'],
  ['tml', 'toml'],
  ['njk', 'liquid'],
  ['nunjucks', 'liquid'],
]);

function getLanguage(lang) {
  if (LANGUAGE_ALIASES.has(lang)) {
    return LANGUAGE_ALIASES.get(lang);
  }
  return lang || DEFAULT_LANGUAGE_IF_UNSPECIFIED;
}
```

The `getLanguage` function checks to see if a language is an alias that we've set up. If so, it resolves it to the name that Prism recognizes. Otherwise, it either uses that language directly or, if it's empty, falls back to the default language (`plaintext`). Now, instead of using `lang` directly in our highlighter, we can call `getLanguage`:

```js {data-file="markdown.js" data-copyable="true"}
const md = MarkdownIt({
  highlight: (code, lang) => {
    const language = getLanguage(lang);
    if (!Object.hasOwn(Prism.languages, language)) {
      loadLanguages([language]);
    }
    return Prism.highlight(code, Prism.languages[language], language);
  },
});
```

## 2. Rendering Custom HTML

So far, we've only used Prism to add syntax highlighting to fenced code blocks in markdown-it. But what if we also want to render custom HTML beyond just `<pre>`, `<code>`, and the token `<span>`s? For example, we might want to add line numbers, file name headers, copy-to-clipboard buttons, and more.

### 2.1. Renderer Rules

markdown-it allows you to customize how different tokens are rendered. For example, the following code defines a renderer function for fenced code blocks:

```js {data-file="markdown.js" data-copyable="true"}
md.renderer.rules.fence = (tokens, index, options, env, self) => {
  return 'html string';
};
```

There's just one problem: If we return our custom HTML directly, it'll override the entire HTML for the code block and ignore both Prism's and markdown-it's default rendering. Instead, we want to allow markdown-it to render the code and _then_ add our own HTML on top of it. So first, we need to call the built-in `md.renderer.rules.fence` method. But if we do that, it'll create an infinite loop:

```js {data-file="markdown.js" data-copyable="true"}
md.renderer.rules.fence = (tokens, index, options, env, self) => {
  const defaultRenderer = self.rules.fence;
  const html = defaultRenderer(tokens, index, options, env, self);
};
```

To fix this, we'll create a factory function that accepts a markdown-it instance as an argument, saves a reference to the default renderer before we lose it, and returns a custom renderer function:

```js {data-file="markdown.js" data-copyable="true"}
/** @param {import("markdown-it")} markdownIt */
function makeFencedCodeRenderer(markdownIt) {
  const defaultRenderer = markdownIt.renderer.rules.fence;

  /** @type {import('markdown-it/lib/renderer.mjs').RenderRule} */
  return (tokens, index, options, env, self) => {}
}

const md = MarkdownIt(options);
md.renderer.rules.fence = makeFencedCodeRenderer(md);
```

With that out of the way, let's now add some placeholder code to render our custom HTML. On my blog, I like to wrap code blocks in a [`<figure>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure). Figures can optionally have a `<figcaption>` as either their first or last child that describes whatever is being shown, making this a good option for showing file names. For now, we'll just add a visually hidden label (`.sr-only`) that tells a screen reader user what type of code this is. We'll also include a placeholder for the copy-to-clipboard HTML that we'll add later (or you could just include one for all code blocks). Finally, we interpolate everything inside one big template string.

```js {data-file="markdown.js" data-copyable="true"}
return (tokens, index, options, env, self) => {
  const fencedCodeBlockToken = tokens[index];
  const language = getLanguage(fencedCodeBlockToken.info);
  let codeHtml = defaultRenderer(tokens, index, options, env, self);
  
  let captionHtml = `<figcaption class="sr-only">${language} code snippet</figcaption>`;
  let copyCodeButtonHtml = '';
  
  codeHtml = `${captionHtml}${codeBlockHtml}${copyCodeButtonHtml}`;
  return `<figure class="code-block" data-language="${language}">${codeHtml}</figure>`;
}
```

Note that this `.sr-only` caption will only be included for code blocks that don't have a custom (visible) file name override. Speaking of which...

#### 2.1.1. File Name

I'll explain why shortly, but first we need to install [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs):

```{data-copyable="true"}
npm install -D markdown-it-attrs
```

And use it:

```js {data-file="markdown.js" data-copyable="true"}
import markdownItAttrs from 'markdown-it-attrs';

const md = MarkdownIt(options).use(markdownItAttrs);
```

This markdown-it plugin allows you to add custom HTML attributes to any Markdown element using curly braces. Consider this example:

````md
# Heading {#custom-id}

```html {data-file="index.html" data-copyable="true"}
```
````

With the plugin enabled, that Markdown will compile to the following HTML:

```html
<h1 id="custom-id">Heading</h1>
<pre>
  <code data-file="index.html" data-copyable="true"></code>
</pre>
```

Essentially, this allows us to add metadata to our code blocks. Then, in our renderer, we can use regex to detect if there's a custom filename on the `<code>` tag. If there is, we'll modify the output HTML to include a custom caption:

```js {data-file="markdown.js" data-copyable="true"}
// Code blocks with file names get data-file="filename" via markdown-it-attrs
const fileNameMatch = /<code[^>]*\b(?<attribute>data-file="?(?<fileName>[^"]*)"?)/.exec(codeHtml);
let hasFileName = !!fileNameMatch && !!fileNameMatch.groups?.attribute && !!fileNameMatch.groups?.fileName;

if (hasFileName) {
  captionHtml = `<figcaption class="file-name">${fileNameMatch.groups?.fileName}</figcaption>`;
  // We don't need the data-file=".*" attribute anymore
  codeHtml = codeHtml.replace(fileNameMatch.groups?.attribute, '');
}

codeHtml = `${captionHtml}${codeHtml}${copyCodeButtonHtml}`;
return `<figure class="code-block" data-language="${language}">${codeHtml}</figure>`;
```

#### 2.1.2. Copy-to-Clipboard Button

As I mentioned before, you can either always render a copy-to-clipboard button for all code blocks or mark some code blocks as copyable using a `data-copyable` attribute. I prefer the latter approach, but it's up to you. The code for this is identical to the one for file names:

```js {data-file="markdown.js" data-copyable="true"}
// Copyable code blocks get data-copyable="true" via markdown-it-attrs
let copyCodeMatch = /<code[^>]*\b(?<attribute>data-copyable="?true"?)/.exec(codeHtml);
let hasCopyCodeButton = !!copyCodeMatch && !!copyCodeMatch.groups?.attribute;

if (hasCopyCodeButton) {
  copyCodeButtonHtml = '<button class="copy-code-button" aria-label="Copy to clipboard">Copy</button>';
  // Don't need the data-copyable="true" attribute anymore
  codeHtml = codeHtml.replace(copyCodeMatch.groups?.attribute, '');
}
```

We'll also add some client-side JavaScript to copy the code to the user's clipboard when the button is clicked. We'll use the [`Element.closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) method to get the parent code block and [`HTMLElement.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) to get the plaintext code to copy, and we'll write that code to the clipboard using [the Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard):

```js {data-file="copyCode.js" data-copyable="true"}
document.querySelectorAll('.copy-code-button').forEach((button) => {
  const codeBlock = button.closest('.code-block');
  const code = codeBlock.querySelector('code').innerText;

  button.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    button.classList.add('copied');
    button.innerText = 'Copied';

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerText = 'Copy';
    }, 2000);
  });
});
```

### 2.2. Line Numbers

Prism supports [line numbering via plugins](https://prismjs.com/plugins/line-numbers/) only on the client side, but we're using it server side (at build time, such as part of a static site generator). This is a common limitation. But because we've already written a custom highlighter function, we can just add the line numbers ourselves:

```js {data-file="markdown.js" data-copyable="true"}
const md = MarkdownIt({
  highlight: (code, lang) => {
    // ... other code omitted for brevity
    return html
      .trim()
      .split('\n')
      .map((line) => `<span class="line">${line}</span>`)
      .join('\n');  
  },
});
```

All we're doing here is splitting the syntax-highlighted code by newlines and then wrapping each line with a span.

As for showing the actual line numbers themselves, you have two options. The first is to use JavaScript to add line numbers. The nice thing about this approach is that we can add a label for screen reader users to make the relationship clearer:

```js {data-file="markdown.js" data-copyable="true"}
return html
      .trim()
      .split('\n')
      .map((line, index) => {
        const lineNumber = index + 1;
        // for screen readers
        const srOnlyLabel = `<span class="sr-only">Line </span>`;
        return `<span class="line">${srOnlyLabel}${lineNumber} ${line}</span>`
      })
      .join('\n');
```

Unfortunately, there's also a big downside to this approach: The `"Line "` string and the number itself will become part of the code element's `innerText` property, so they'll get included in any code copied to the clipboard. For that reason, I don't recommend this approach, but I wanted to mention it anyway.

Instead, I prefer to use [CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters) with pseudo-elements on the `.line` elements:

```css {data-file="styles.css" data-copyable="true"}
.code-block {
  position: relative;
}
.code-block code {
  --code-padding: 1em; /* or whatever you want */
}
/* Code with at least 10 lines (arbitrary cutoff) */
code:has(.line:nth-child(10)) {
  --line-number-width: 4ch;
  padding-inline-start: calc(var(--code-padding) + var(--line-number-width));

  & .line {
    counter-increment: line-number;
  }

  & .line::before {
    content: counter(line-number);
    position: absolute;
    inset-inline-start: 0;
    min-inline-size: var(--line-number-width);
    text-align: end;
  }
}
```

You can adjust `.line:nth-child(10)` to suit your needs.

Note that I'm using absolute positioning for the line numbers so that they don't influence line indentation. I'm also setting a min width (or rather, inline size) for all line numbers so they're all the same width. Without this little trick, `text-align: end` wouldn't do anything as the numbers would only be intrinsically sized.

Finally, for code blocks that have at least 100 lines, you can just increase the min width for line numbers:

```css {data-file="styles.css" data-copyable="true"}
code:has(.line:nth-child(100)) {
  /* adjust as needed */
  --line-number-width: 5ch;
}
```

#### 2.3. Highlighting Lines

The other nice thing about handling line numbering ourselves is that we can add custom flags at the start or end of lines of code that we want to highlight with CSS:

```js {data-file="markdown.js" data-copyable="true"}
const HIGHLIGHTED_LINE_IDENTIFIER = '[!highlight]';

const md = MarkdownIt({
  highlight: (code, lang) => {
    const html = Prism.highlight(code, Prism.languages[lang], lang);
    return html
      .trim()
      .split('\n')
      .map((line) => {
        let className = 'line';
        if (line.startsWith(HIGHLIGHTED_LINE_IDENTIFIER)) {
          className = `${className} highlight`;
          line.replace(HIGHLIGHTED_LINE_IDENTIFIER, '');
        }
        return `<span class="${className}">${line}</span>`;
      })
      .join('\n');  
  },
});
```

Be sure to pick a unique string to reduce the chances of accidental highlights.

## Summary

In this tutorial, we learned how to add syntax highlighting to fenced code blocks using Prism.js and markdown-it. We also looked at how to add custom line numbering, file name headers, and copy-to-clipboard buttons, all on the server side and with minimal third-party dependencies.
