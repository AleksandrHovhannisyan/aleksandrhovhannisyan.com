---
title: Serializing HTML Form Data with JavaScript
description: Learn how to use JavaScript's FormData, URLSearchParams, and URL constructors to serialize an HTML form's data into a well-formatted and encoded URL.
keywords: [form data, serialize form data]
categories: [html, javascript, forms]
criticalCSS:
    - css/demos/serializing-form.css
---

You typically don't need to worry about serializing HTML form data yourself. If a form has a submit button, then it will serialize its data automatically when a user submits it. Specifically, if the form is of type `GET`, it will redirect the user to the target URL (as determined by the form's `method` attribute) with its data serialized as a query string. For example, consider this form:

```html
<form action="/endpoint" method="get">
  <label>Title<input name="title" type="text">
  <label>Description<input name="description" type="text">
  <button type="submit">Submit</button>
</form>
```

It has two inputs with explicit `name`s: a `title` and a `description`. These `name` attributes are used as the names of the query string parameters when serializing the form's data in the URL. So when a user submits this form, the page will redirect them to `/endpoint?title=abc&description=123`, where `abc` and `123` here are just placeholders for the user-supplied values.

That's great! HTML forms are amazing and give us a lot of functionality out of the box for free. But what if you _do_ need to serialize the form data yourself? While this use case is admittedly rare, it does come up now and then. For example, you might want to show a preview of the final URL in real time as a user fills out your form. My [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/) app does this to allow for simple link sharing—a user can easily copy the URL and send it to someone else without ever needing to submit the form.

Thankfully, serializing form data with JavaScript is easy—the code ends up being just a handful of lines. We just need to use the following object constructors:

- [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)

<div id="demo">
  <noscript><style>#demo {display: none;}</style></noscript>
  <p>Here's a demo of what we'll be building:</p>
  <form action="/fake-endpoint" method="get" id="demo-form" autocomplete="off">
    <div class="input-group">
        <label for="demo-title">Title</label>
        <input id="demo-title" name="title" type="text" placeholder="Enter a title">
    </div>
    <div class="input-group">
        <label for="demo-description">Description</label>
        <input id="demo-description" name="description" type="text" placeholder="Enter a description">
    </div>
    <button class="button" type="submit">Submit</button>
  </form>
  <output id="demo-output"></output>
</div>

{% include "toc.md" %}

## 1. Listen to the Form's `input` Event

First, we'll add an event listener for the `input` event to our form (note: in React, this is confusingly called the `change` event). This event listener will be called whenever the `input` event bubbles up from one of the form's children, such as one of the inputs:

```js {data-copyable="true"}
document.querySelector('form').addEventListener('input', (e) => {
  const form = e.currentTarget;
});
```

Here, I'm reading `e.currentTarget` to get a reference to the form element, which we're going to use shortly. Alternatively, you could assign a ref to the form before registering the event listener and just reference that variable instead:

```js {data-copyable="true"}
const form = document.querySelector('form');
form.addEventListener('input', (e) => {});
```

## 2. Construct `FormData`

Inside our event listener, we'll now construct a `FormData` object, which represents all of the input-value pairs for the form's named fields. In our example, those fields are `title` and `description`.

```js {data-copyable="true"}
const data = new FormData(form);
```

At this point, you may be tempted to parse each piece of data using the `FormData.get` method and serialize the form data by hand:

```js
const title = data.get('title');
const description = data.get('description');
const query = `?title=${title}&description=${description}`;
```

However, there's an easier way!

## 3. Serialize the Form Data with `URLSearchParams`

Next, we'll use the `URLSearchParams` constructor to convert this object into a query string:

```js {data-copyable="true"}
const data = new FormData(form);
const queryString = new URLSearchParams(data).toString();
```

The great thing about `URLSearchParams` is that it already encodes special characters for us to prevent malformed URLs. For example, spaces will be encoded as `%2C`.

## 4. Assemble the Final URL for the Form

In the final step, we'll use the `URL` constructor to assemble the URL for the form. The URL constructor accepts two arguments: the target path and the base URL. In our case, we'll read the target path directly off of the form itself by accessing `form.action` and join it with the current location:

```js {data-copyable="true"}
const url = new URL(form.action, window.location.href);
```

If the form endpoint's protocol and origin differ from those of the base URL, then the first URL will take priority, so `new URL('https://my.endpoint', 'https://my.form.page')` will just become `https://my.endpoint`.

Now, we'll take the query string we assembled in the previous step and assign it to `url.search`:

```js {data-copyable="true"}
url.search = queryString;
```

Finally, we'll convert that URL object to a string:

```js {data-copyable="true"}
const formUrl = url.toString();
```

At this point, you can do whatever you want with the URL. For example, you might render it in an [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) element:

```js {data-copyable="true"}
const output = document.querySelector('output');
output.innerText = formUrl;
```

## Final Code

All it takes is just a few lines of JavaScript to serialize an HTML form into a well-formatted URL. Here's the final code from this tutorial:

```js {data-copyable="true"}
const output = document.querySelector('output');
const form = document.querySelector('form');

form.addEventListener('input', (e) => {
  const data = new FormData(form);
  const url = new URL(form.action, window.location.href);
  url.search = new URLSearchParams(data).toString();
  // do whatever you want with the URL
});
```

<script>
  const output = document.querySelector('#demo-output');
  const form = document.querySelector('#demo-form');
  const showFormUrl = () => {
    const data = new FormData(form);
    const queryString = new URLSearchParams(data).toString();
    const url = new URL(form.action, window.location.href);
    url.search = queryString;
    output.innerText = url.toString();
  }
  showFormUrl();
  form.addEventListener('input', showFormUrl);
  form.addEventListener('submit', (e) => e.preventDefault());
</script>
