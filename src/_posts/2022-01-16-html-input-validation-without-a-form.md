---
title: HTML Input Validation Without a Form
description: If you want to use an HTML form to accept user input and store it locally in your app's state, you can use the checkValidity, reportValidity, and setCustomValidity methods to validate the user's input and provide feedback, all without the need for a submittable form.
keywords: [input validation, validity, input, form]
categories: [html, javascript, accessibility, browsers, forms]
thumbnail: thumbnail.png
commentsId: 137
lastUpdated: 2022-05-01
---

When you submit an HTML form, your browser first performs [client-side validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) to make sure that the form contains clean data before sending it off to the server. This is done by comparing each input's value to constraints defined via certain [HTML input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes), like `required`, `pattern`, and others.

However, it's not always the case that you want (or need) to submit a form. Sometimes, you just want to use a form to retrieve user input but store those values as part of your application's state on the client side. Unfortunately, this means that you miss out on this auto-validation behavior because you're no longer using a submittable form.

But the good news is that we can still validate inputs without a form or a submit button. And we can do this without reinventing the wheel or creating accessibility problems for our users. All we need to do is use methods that browsers already provide for HTML input validation.

{% include toc.md %}

## A Note on Client-Side Validation

Before we proceed, I want to note two caveats about client-side validation for HTML forms.

First, while it can make for a better user experience because it allows you to provide real-time feedback to users as they fill out your form, it's completely dependent on JavaScript loading (at all, or correctly). If a user browses your app with JavaScript disabled (either voluntarily or [some other reason](https://kryogenix.org/code/browser/everyonehasjs.html)), your form won't work without a submit button.

Second, it's important to understand that client-side validation should not be relied upon for any data that you intend to later send to a server. The approach described in this tutorial is only for client-side validation in apps that are storing user input in local state. In this case, since we're not dealing with any server-side logic, we don't need to worry about this issue.

## HTML Input Validation with JavaScript

We'll first look at how to validate inputs without a submit button using vanilla JavaScript. Towards the end of this article, we'll also look at how you can use a JavaScript framework like React to create a self-validating input component.

### Checking HTML Input Validity with `checkValidity`

Suppose we have an input that accepts an even integer from `2` to `10`, inclusive:

```html
<input id="input" type="number" min="2" max="10" step="2">
```

Certain input attributes prevent a user from ever entering disallowed values. For example, `type="number"` prevents a user from entering text. By contrast, while the `min`, `max`, and `step` attributes define constraints for the value, the input doesn't actually enforce those requirements because a user can still go in and manually input an invalid value, like `11`. In its current state, this input won't provide any feedback to the user to indicate that the value they entered is not allowed because the input isn't part of a submittable form.

Fortunately, we can still validate this input ourselves using very little JavaScript. Every HTML input element has a [`checkValidity` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity) that returns `true` if the input's current value passes validation and `false` otherwise. We'll want to invoke this method whenever the input's [`change` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) fires, which signals that the user has committed the value for that input (either by blurring the input or pressing the Enter key):

```js {data-copyable=true}
const input = document.querySelector('#input');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  console.log(isValid);
});
```

{% aside %}
  We could also do this on the `input` event, which fires whenever the input's value is altered. This is not recommended because intermediate values entered by a user are often invalid, so we'd end up showing the tooltip too frequently.
{% endaside %}

The browser validates the input behind the scenes by comparing the input's value to its constraints. In this example, those constraints are enforced by the `type`, `min`, `max`, and `step` attributes, effectively requiring that all inputs be even integers. If a user enters an invalid value, like `5`, the `checkValidity` method will return `false`.

In its current state, the code we just wrote doesn't do anything meaningful. How do we provide feedback to the user to indicate that their input is invalid?

### Reporting Input Validity with `reportValidity`

You may be tempted to give users feedback on their inputs with custom tooltips or related UI. But depending on how these are implemented, they may not convey the right semantics to users (and could therefore be inaccessible). It's much better to rely on the web's built-in APIs to provide input feedback. These same APIs are used to show accessible native tooltips when a user attempts to submit a form containing invalid data.

For this task, HTML inputs provide us with the [`reportValidity` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity). This can be used together with `checkValidity` to provide feedback to the user in an accessible manner:

```js {data-copyable=true}
const input = document.querySelector('#input');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid) {
    e.target.reportValidity();
  } else {
    // if the input is valid, handle it accordingly here
  }
});
```

When invoked on an invalid input, `reportValidity` will:

1. Forcibly re-focus the input.
2. Show a native tooltip (with a role of `alert`) clarifying why the validation failed.

Screen readers will narrate the alert correctly, and sighted users will see the message in a familiar form tooltip whose styling depends on the browser and operating system being used. The browser may also suggest how the user can correct their input. Returning to our earlier example, if a user enters an odd number, the browser will suggest the two closest numbers:

{% include img.html src: "odd.png", alt: "A numeric input box contains the value 5 and two controls: up and down. Below it is a tooltip that reads: 'Please enter a valid value. The two nearest valid values are 4 and 6.'." %}

#### Communicating Input Validity with `aria-invalid`

Using `reportValidity` provides the user with feedback in an accessible manner that screen readers recognize and narrate appropriately. But for the sake of completeness, we should also set the [`aria-invalid` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute), which is used to convey an input's validity state. This is just a matter of setting the attribute on every `change` event, like this:

```js {data-copyable=true}
const isValid = e.target.checkValidity();
e.target.setAttribute('aria-invalid', !isValid);
```

If `aria-invalid` is `true`, a screen reader will identify the input as invalid when narrating it.

### Determining Why an Input Failed Validation

In the examples we looked at so far, we only ever checked if an input has a valid or invalid value, but we never determined *why* the validation failed. And that's expected—you usually won't need to do this yourself because `reportValidity` already determines the failure condition and reports an appropriate error message. But in case you do need to know why an input failed validation, you can check `InputElement.validity`, which is [a `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) containing boolean flags for the following conditions:

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
<input id="letters-only" type="text" pattern="[a-zA-Z]*">
```

If this input's current value contains a number, then `validity.patternMismatch` will be `true`. You can then check this condition and handle it accordingly in your code.

### Showing a Custom Error Message

HTML input attributes can enforce a wide range of constraints, and `reportValidity` offers a convenient and accessible way of providing feedback to the user. However, you may sometimes want to check an input's validity yourself and show a custom message.

We can do this using the [`setCustomValidity` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity), which overrides the browser's default error message for the input and displays the message when we call `reportValidity`.

Suppose we have the same HTML input that only accepts letters:

```html
<input id="letters-only" type="text" pattern="[a-zA-Z]*">
```

If a user enters numbers, the browser will only show a vague error message, like "Please match the requested format." In practice, this input should have an appropriate label associated with it that clarifies the expected format. But in any case, we can still detect the error condition by checking `validity.patternMismatch` in our event handler and setting a custom message:

```js {data-copyable=true}
const input = document.querySelector('#letters-only');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  e.target.setAttribute('aria-invalid', !isValid);
  if (e.target.validity.patternMismatch) {
    e.target.setCustomValidity('You may only enter letters.');
  } else {
    e.target.setCustomValidity('');
  }
  if (!isValid) {
    e.target.reportValidity();
  }
});
```

Now, the user sees our custom message instead of the browser's default for that type of error:

{% include img.html src: "only-letters.png", alt: "A text input is labeled as: 'Enter only letters'. The text input's current value is abc123. A native  browser tooltip is visible below the input and reads: 'You may only enter letters.'" %}

All of the code is the same as before, except now we have this new condition:

```js
if (e.target.validity.patternMismatch) {
  e.target.setCustomValidity('You may only enter letters.');
} else {
  e.target.setCustomValidity('');
}
```

Note that we need to clear the custom validity message if the input is valid, or else it will stick around forever. This is done by passing an empty string to the function: `setCustomValidity('')`.

## Creating a Self-Validating Input Component

All of the code that we looked at in this tutorial can be used in any JavaScript framework to provide feedback on input validity without a submittable form. But one of the great things about using a framework is that we can create a custom component to centralize and standardize all of this logic throughout our code base. More specifically, we can create an `Input` component that wraps the native `input`, accepts the same props, and checks the input's validity whenever it's blurred. Here's an example using React:

```jsx {data-file="Input.jsx" data-copyable=true}
const Input = (props) => {
  const { onBlur, ...otherProps } = props;
  const [isValid, setIsValid] = useState(true);

  const handleBlur = (e) => {
    // Forwarded onBlur prop, in case consumers want to run extra logic
    onBlur?.(e);
    // Validation logic
    const isValidValue = e.target.checkValidity();
    setIsValid(isValidValue);
    if (!isValidValue) {
      e.target.reportValidity();
    }
  };

  return (
    <input
      onBlur={handleBlur}
      aria-invalid={!isValid}
      {...otherProps}
    />
  );
};
```

{% aside %}
  **Note**: Due to a [long-standing bug](https://bugzilla.mozilla.org/show_bug.cgi?id=53579), this code may not work as expected in Firefox. The tooltip will be shown, but the errored input will not be refocused. The only known workaround is to manually refocus the blurred input in a `setTimeout` with a delay of `0`.
{% endaside %}

When a user commits the value for this input by attempting to blur it (like tabbing to another input in our form), we'll validate the value. If it's invalid, the input will be auto-focused and a tooltip will be shown to clarify what went wrong, per the default browser behavior for client-side validation. Our custom input element also maintains some local state for the validity so it can set the `aria-invalid` attribute accordingly.

## Summary

When a traditional HTML form is submitted, the browser validates each input and reports any issues. But it's not always the case that you want or need to submit form data to a back end. If all you want is to use a form to receive user input and store it locally in your app's state, you can use the `checkValidity`, `reportValidity`, and `setCustomValidity` methods to provide feedback to the user. If you're using a JavaScript framework, you can also take things a step further and create a custom self-validating Input component.
