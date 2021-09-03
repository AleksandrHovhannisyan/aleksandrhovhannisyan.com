---
title: Passing Object Arguments to Liquid Shortcodes in 11ty
description: While 11ty doesn't let you pass object arguments to shortcodes in Liquid, you can get around this by assembling and parsing a JSON string.
keywords: [object argument, 11ty, liquid, shortcode]
categories: [11ty, liquid, javascript]
thumbnail: thumbnail.jpg
---

If you're using Liquid as your template language in 11ty, you may have run into a minor annoyance with shortcodes. Whereas [Nunjucks allows you to pass in named arguments to shortcodes]((<https://www.11ty.dev/docs/languages/nunjucks/#shortcode-named-argument-syntax-(nunjucks-only)>)), Liquid does not. So you end up having to do this:

```js
const shortcode = (arg1, arg2, arg3, arg4) => {};
```

Whenever you only want to pass along just one optional argument but not any of the others, you'll need to specify the intermediate positional arguments anyway so you can get to the ones that you actually care about.

As a temporary workaround, we can create a wrapper include that forwards named arguments to the shortcode. But this is still not ideal because you need to pass the arguments in a specific order to the shortcode, and that can easily break if your shortcode's signature is updated:

{% include codeHeader.html file: "src/_includes/myShortcode.html" %}
{% raw %}
```liquid
{%- comment -%}This works, so long as the order doesn't change.{%- endcomment -%}
{% myShortcode arg1, arg2, arg3, arg4 %}
```
{% endraw %}

But at least the include itself can take named arguments in any order:

{% raw %}
```liquid
{% include myShortcode.html arg4: "val4", arg2: "val2", arg1: "val1", arg3: "val3" %}
```
{% endraw %}

Unfortunately, the shortcode is still using this ugly signature with lots of positional arguments:

```js
const shortcode = (arg1, arg2, arg3, arg4) => {};
```

Let's fix that!

## Passing Object Arguments to Shortcodes

We want this nice, clean signature for our shortcode:

```js
const shortcode = (positionalArg, props) => {};
```

The function accepts one positional argument and an object argument for props (or maybe just a single object argument for everything—it's really up to you).

Here's what we'll do:

1. Assemble a JSON string in our include with Liquid.
2. Register a custom filter that uses `JSON.parse`.
3. Use this filter to parse the JSON into an object.

We'll then pass that object to the shortcode as an argument.

### 1. Assembling a JSON String with Liquid

We'll start by formatting a JSON string and interpolating the named arguments of the include:

{% include codeHeader.html file: "src/_includes/myShortcode.html" %}
{% raw %}
```liquid
{%- capture props -%}
  {
    "arg2": "{{ arg2 }}",
    "arg3": "{{ arg3 }}",
    "arg4": "{{ arg4 }}"
  }
{%- endcapture -%}
{% myShortcode arg1, props %}
```
{% endraw %}

Note that you wouldn't always want to wrap the interpolated arguments in quotes. For example, if one of the arguments is a boolean, array, number, or some other non-string type, then you'll want to omit the surrounding quotes from that value:

{% raw %}
```liquid
"arg": {{ arg }}
```
{% endraw %}

We'll use this include just like we did before: by passing along named arguments. These values get interpolated above to form a JSON string.

For example, if we invoke the include with these values:

{% raw %}
```liquid
{% include myShortcode.html arg4: "val4", arg2: "val2", arg1: "val1", arg3: "val3" %}
```
{% endraw %}

Then we'll get this JSON for the `props` variable:

```json
{
  "arg2": "val2",
  "arg3": "val3",
  "arg4": "val4"
}
```

### 2. Using a Custom `JSON.parse` Filter

At this point, we have two options:

1. The shortcode accepts a JSON string and internally parses it with `JSON.parse`.
2. The shortcode accepts an object; we parse the JSON at the include level.

I prefer the second approach because it means that I can later programmatically invoke my shortcode from other functions and pass along a real object if I'm in a JavaScript context. Besides, it would be unconventional for a JavaScript function to expect an options object as a JSON string rather than... well, an object.

Let's add this filter to our Eleventy config to enable parsing JSON strings:

{% include codeHeader.html file: ".eleventy.js" %}
```js
eleventyConfig.addFilter('jsonParse', JSON.parse);
```

### 3. Parsing the JSON String in Liquid

Finally, let's use this filter to transform the `props` string into a JavaScript object:

{% include codeHeader.html file: "src/_includes/myShortcode.html" %}
{% raw %}
```liquid
{%- capture props -%}
  {
    "arg2": "{{ arg2 }}",
    "arg3": "{{ arg3 }}",
    "arg4": "{{ arg4 }}"
  }
{%- endcapture -%}
{%- assign props = props | jsonParse -%}
{% myShortcode arg1, props %}
```
{% endraw %}

Now, our shortcode receives an object argument with all of our interpolated values. We don't have to worry about specifying arguments in any specific order since Liquid includes allow you to pass in named arguments.

## Enhancement: Optional Arguments

Let's look at that JSON again:

{% include codeHeader.html file: "src/_includes/myShortcode.html" %}
{% raw %}
```liquid
{%- capture props -%}
  {
    "arg2": "{{ arg2 }}",
    "arg3": "{{ arg3 }}",
    "arg4": "{{ arg4 }}"
  }
{%- endcapture -%}
```
{% endraw %}

This is fine, but what if we don't want to pass in any value for one of the arguments, like `arg4`? Then it just becomes an empty string, which happens to be valid JSON:

```json
{
  "arg4": ""
}
```

But what if it's a boolean, number, or some other type? We'd omit the quotes like I mentioned before:

{% raw %}
```liquid
"arg4": {{ arg4 }}
```
{% endraw %}

But this time around, if we don't pass in a value for that argument, our JSON will break because it terminates prematurely:

```json
{
  "arg2": "string",
  "arg3": "another string",
  "arg4":
}
```

We can fix this by adding some `if` guards:

{% raw %}
```liquid
{%- capture props -%}
  {
    {% if arg2 %}"arg2": "{{ arg2 }}",{% endif %}
    {% if arg3 %}"arg3": "{{ arg3 }}",{% endif %}
    {% if arg4 != nil %}"arg4": {{ arg4 }}{% endif %}
  }
{%- endcapture -%}
```
{% endraw %}

That fixes one problem, but it also introduces another: If the only argument we specify is `arg2` or `arg3`, then our JSON will have trailing commas, [which are not allowed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas):

```json
{
  "arg2": "some string",
}
```

And to fix *that*, we'll need to update the custom filter to rely on an `eval` hack. Note that you'd never want to use eval in production code where user input may be fed into the `eval` since it exposes you to XSS attacks. In my case, since I'm the only one providing static data to `eval`, I don't really have to worry about things going awry.

```js
const jsonParse = (jsonString) => {
  let jsonObject;
  eval(`jsonObject = ${jsonString};`);
  return JSON.parse(JSON.stringify(jsonObject));
};
```

And that'll strip out all trailing commas.

At this point, you'll also want to go back to your shortcode and specify some fallback values in case some of the props were not passed along:

```js
const shortcode = (positionalArg, props) => {
  const {
    arg2 = 'default2',
    arg3 = 'default3',
    arg4 = 'default4',
  } = props ?? {};

  // rest of the shortcode
};
```

And that's it!

## Wrap-up

You can now pass objects to Liquid shortcodes in 11ty. In the meantime, I recommend keeping an eye on this GitHub issue to see if 11ty can add official support for keyword arguments: [Support keyword arguments for Liquid shortcodes](https://github.com/11ty/eleventy/issues/1263).

{% include unsplashAttribution.md name: "Pawel Czerwinski", username: "pawel_czerwinski", photoId: "fOXvuWswMDs" %} It was modified to include the Eleventy mascot designed by [Phineas X. Jones](http://octophant.us/).
