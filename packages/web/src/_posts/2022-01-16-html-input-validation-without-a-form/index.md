---
title: HTML Input Validation with JavaScript
description: If you want to use a standalone HTML input to accept user input and store it locally in your app's state, you can use the checkValidity, reportValidity, and setCustomValidity methods to validate the user's input and provide feedback.
keywords: [input validation, validity, input, form]
categories: [html, javascript, accessibility, forms]
thumbnail: ./images/thumbnail.png
commentsId: 137
lastUpdated: 2022-08-11
---

When a user attempts to submit an HTML form, their browser first performs [client-side validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) to check if the form data is valid. This is done by comparing all of the input values to their constraints, which are defined via [HTML input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) like `required`, `pattern`, and others. If an input is invalid, the browser focuses it and shows a tooltip clarifying the user's mistake.

However, it's not always the case that you want (or need) to submit a form. Sometimes, you just want to use a form to retrieve user input but store those values as part of your application's state on the client side. Unfortunately, this means that you miss out on this auto-validation behavior because you're no longer using a submittable form.

But the good news is that we can still validate inputs without a form or a submit button. And we can do this without reinventing the wheel or creating accessibility problems for our users. All we need to do is use methods that browsers already provide for HTML input validation. In this article, we'll look at how you can validate standalone inputs using `checkValidity`. We'll also look at two approaches for providing validation feedback to users: `reportValidity` for native validation, and a custom approach with JavaScript.

{% include "toc.md" %}

## A Note on Client-Side Validation

Before we proceed, I want to note two caveats about client-side validation for HTML forms.

First, while it can make for a better user experience because it allows you to provide real-time feedback to users as they fill out your form, it's completely dependent on JavaScript loading (at all, or correctly). If a user browses your app with JavaScript disabled (either voluntarily or [some other reason](https://kryogenix.org/code/browser/everyonehasjs.html)), your form won't work without a submit button.

Second, it's important to understand that client-side validation should not be relied upon for any data that you intend to later send to a server. The approach described in this tutorial is only for client-side validation in apps that are storing user input in local state. In this case, since we're not dealing with any server-side logic, we don't need to worry about this issue.

## Validating Inputs with JavaScript

Over the course of the next several sections, we'll learn how to perform client-side validation using HTML and JavaScript.

### Checking HTML Input Validity with `checkValidity`

Suppose we have an input that accepts an even integer from `2` to `10`, inclusive:

```html
<input id="input" type="number" min="2" max="10" step="2" />
```

Our first task is to determine whether this input's current value is valid. We could check it by hand and try to account for all of the possible error states, but that would be tedious and error prone, especially for large forms. Plus, if the input's HTML ever changes—like if we decide to increase its maximum allowed value—we'd need to update our code so it's no longer out of sync.

Certain input attributes prevent a user from ever entering disallowed values. For example, `type="number"` prevents a user from entering text. By contrast, while the `min`, `max`, and `step` attributes define constraints for the value, the input doesn't actually enforce those requirements because a user can still go in and manually input an invalid value, like `11`. In its current state, this input won't provide any feedback to the user to indicate that the value they entered is not allowed because the input isn't part of a submittable form.

Fortunately, we can still hook into the same method that forms use under the hood when they perform validation natively.
Every HTML input element (and form element!) has a [`checkValidity` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity) that returns `true` if its current value is valid and `false` otherwise. We'll want to invoke this method whenever the input's [`change` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) fires, which signals that the user has finalized the value for that input (either by blurring the input or pressing the Enter key):

```js {data-copyable=true}
const input = document.querySelector('#input');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  console.log(isValid);
});
```

{% aside %}
In theory, we could've also done this in response to the `input` event, which fires whenever the input's value changes. But this isn't recommended for performance and UX reasons. In the next section, we're going to show some error messaging UI to our users; if we were to validate the input on every `input` event, it would create an annoying user experience, even with debouncing.
{% endaside %}

The input validates its value by comparing it to its own HTML constraints. In this example, those constraints are enforced by the `type`, `min`, `max`, and `step` attributes, requiring the user to enter an even integer. If a user enters an invalid value, like `5`, the `checkValidity` method will return `false`.

#### Setting `aria-invalid`

While we're here, we should also set the [`aria-invalid` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute) on the input. This is used to convey an input's validity state to screen readers, and it's just a matter of setting the attribute on every `change` event, like this:

```js {data-copyable=true}
const isValid = e.target.checkValidity();
e.target.setAttribute('aria-invalid', !isValid);
```

If `aria-invalid="true"`, a screen reader will identify the input as invalid.

### Reporting Input Validity to Users

At this point, we know if the user's input is invalid. Now, all we need to do is report the validation error (if any) to the user. Depending on how you feel about native input validation, there are two approaches you could consider.

#### Option 1: Native Validation with `reportValidity`

In addition to `checkValidity`, HTML form and input elements have a [`reportValidity`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity) method. Like `checkValidity`, this method returns `true` if the input or form is valid and `false` otherwise. But it also does much more than that under the hood. When invoked on an input, `reportValidity` will focus that input and show a native validation tooltip—the exact same tooltip a user would've seen if we were using a submittable form. This means we can do away with `checkValidity` entirely and just use `reportValidity` in its place. Below is the same change event handler as before, except we've replaced `checkValidity` with `reportValidity`:

```js {data-copyable=true}
input.addEventListener('change', (e) => {
  const isValid = e.target.reportValidity();
  // other code from before
  e.target.setAttribute('aria-invalid', !isValid);
});
```

Screen readers will narrate the alert correctly, and sighted users will see the message in a familiar form tooltip whose styling depends on the browser being used. The browser may also suggest how the user can correct their input. Returning to our earlier example, if a user enters an odd number, the browser will suggest the two closest numbers:

![A numeric input box contains the value 5 and two controls: up and down. Below it is a tooltip that reads: 'Please enter a valid value. The two nearest valid values are 4 and 6.'.](./images/odd.png)

#### Option 2: Custom Error Messaging

In most cases, native validation works well. But there are a few drawbacks to using `reportValidity`. One is that the tooltip cannot be styled, so if your designers insist on customizing its appearance, you're out of luck. Another problem is that browsers have historically been inconsistent in how they implemented some of these APIs, so you may need to test this thoroughly with different screen readers, browsers, devices, and users. For example, digital accessibility consultant Adrian Roselli [recommends avoiding native validation](https://adrianroselli.com/2019/02/avoid-default-field-validation.html) because of certain quirks, like the fact that validation popups auto-hide on Chrome after a certain duration, the fact that pattern mismatches are not communicated to users, and various other issues.

If you find that some of these behaviors are unacceptable, you may need to implement a custom error handling solution that mirrors the native functionality provided by browsers. Since this would require an entire article on its own, I'm going to briefly cover some of the most important considerations. For a more in-depth discussion, see Oliver James's article on [better native form validation](https://oliverjam.es/blog/better-native-form-validation/).

##### 1. Use `aria-describedby`

The first is to make sure the input gets an `aria-describedby` attribute pointing to the validation message so that it's narrated by screen readers when the input receives focus.

You can do this either statically:

```html {data-copyable=true}
<label>
  First name
  <input type="text" aria-invalid="true" aria-describedby="first-name-error" />
  <span id="first-name-error">Please enter a value.</span>
</label>
```

Or programmatically, assuming you've given your input a unique `id` or `name` attribute:

```js {data-copyable=true}
inputs.forEach((input) => {
  const errorElement = document.createElement('span');
  errorElement.id = `${input.id}-error`;
  input.setAttribute('aria-describedby', errorElement.id);
  input.insertAdjacentElement(errorElement);
});
```

{% aside %}
Additionally, as Adrian notes, you should [avoid showing error messages below input fields](https://adrianroselli.com/2017/01/avoid-messages-under-fields.html) because they may be obscured by other UI, like auto-complete dropdowns.
{% endaside %}

##### 2. Reuse the Native Validation Message

If you want to reuse the native validation message that the browser _would've_ shown in `reportValidity`, you can still access that message via [`HTMLObject.validationMessage`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage) and render it in the error element:

```js {data-copyable=true}
input.addEventListener('change', (e) => {
  const isInvalid = !e.target.checkValidity();
  e.target.setAttribute('aria-invalid', isInvalid);
  if (isInvalid) {
    const errorMessage = e.target.validationMessage;
    errorElement.textContent = errorMessage;
  }
});
```

If you decide to forgo the native validation message and use custom strings, be sure to use clear wording so that users are able to correct their mistake. Avoid using generic, unclear error messages like "invalid input" or "please correct your input." Don't just state that a user made a mistake—clarify _why_ it's a mistake or _how_ they can correct it.

##### 3. Focus the Invalid Input

Screen readers don't normally narrate dynamically inserted HTML or changes to HTML attributes at run time, so a screen reader user has no way of knowing that their input is invalid in our current implementation.

To fix this, we need to auto-focus the invalid input the first time the user tries to navigate away from it:

```js {data-copyable=true}
input.addEventListener('change', (e) => {
  // Don't keep the user locked in place if we previously validated the input
  const wasValidated = e.target.getAttribute('aria-invalid') === 'true';
  if (wasValidated) {
    return;
  }
  const errorMessage = e.target.validationMessage;
  e.target.setAttribute('aria-invalid', !!errorMessage);
  if (errorMessage) {
    // Update error label visually
    errorElement.textContent = errorMessage;
    // Focus the invalid input so its error is narrated
    e.target.focus();
  }
});
```

Note that this is the default behavior when a user submits a form—`reportValidity` is called on the form element, which in turn focuses the first invalid input and shows the error message. Additionally, we only ever do this the first time the input turns invalid. If you're using a JavaScript framework, you can just maintain some validity state locally in your input component.

##### 4. Clear the Error on Input

If a user begins to correct their input, our validation message will linger until they once again commit the value for the input by blurring it or pressing the Enter key. Unfortunately, this could create a confusing experience for sighted users, especially if the newly committed value fails validation for the same reason as before—the message won't change visibly, so the user won't have any way of knowing whether it's a bug in our code or if they legitimately made a mistake. To fix this, we can add an `input` event listener and clear the error message and `aria-invalid` state:

```js {data-copyable=true}
// Listen for the input event now so we fire this on every keystroke
input.addEventListener('input', (e) => {
  if (errorElement.textContent) {
    e.target.removeAttribute('aria-invalid');
    errorElement.textContent = '';
  }
});
```

Now, as soon as a user starts typing in that input, we'll clear its error state and validation message. When a user later recommits the value, our `change` event handler will run again, and the cycle repeats until a user successfully corrects their input.

### Determining Why an Input Failed Validation

In the examples we looked at so far, we only ever checked if an input has a valid or invalid value, but we never determined _why_ the validation failed. And that's expected—you usually won't need to do this yourself because `reportValidity` already identifies the failure condition for us and reports an appropriate error message. But if you do need to know why an input failed validation—like if you're implementing custom error messaging UI—you can check `InputElement.validity`. This is [a `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) containing boolean flags for the following failure conditions:

- `badInput`
- `customError`
- `patternMismatch`
- `rangeOverflow`
- `rangeUnderflow`
- `stepMismatch`
- `tooLong`
- `tooShort`
- `typeMismatch`
- `valueMissing`

For example, suppose we have a text field that only accepts letters but not numbers:

```html
<input id="letters-only" type="text" pattern="[a-zA-Z]*" />
```

If this input's current value contains a number, then `validity.patternMismatch` will be `true`. You can then check this condition and handle it accordingly in your code.

## Summary

When an HTML form is submitted, the browser validates each input and reports any issues. But it's not always the case that you want or need to submit form data to a back end. If all you want is to use a form to receive user input and store it locally in your app's state, you can use the `checkValidity`, `reportValidity`, and `setCustomValidity` methods to provide feedback to the user. You can also reuse some of these methods to implement custom input validation.
