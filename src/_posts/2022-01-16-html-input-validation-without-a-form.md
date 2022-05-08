---
title: HTML Input Validation Without a Form
description: If you want to use an HTML form to accept user input and store it locally in your app's state, you can use the checkValidity, reportValidity, and setCustomValidity methods to validate the user's input and provide feedback, all without the need for a submittable form.
keywords: [input validation, validity, input, form]
categories: [html, javascript, accessibility, browsers, forms]
thumbnail: thumbnail.png
commentsId: 137
lastUpdated: 2022-05-08
---

When a user attempts to submit an HTML form, their browser first performs [client-side validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) to check if the form data is valid. This is done by comparing all of the input values to their constraints, which are defined via [HTML input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) like `required`, `pattern`, and others. If an input is invalid, the browser focuses it and shows a helpful tooltip clarifying the user's mistake.

However, it's not always the case that you want (or need) to submit a form. Sometimes, you just want to use a form to retrieve user input but store those values as part of your application's state on the client side. Unfortunately, this means that you miss out on this auto-validation behavior because you're no longer using a submittable form.

But the good news is that we can still validate inputs without a form or a submit button. And we can do this without reinventing the wheel or creating accessibility problems for our users. All we need to do is use methods that browsers already provide for HTML input validation.

{% include toc.md %}

## A Note on Client-Side Validation

Before we proceed, I want to note two caveats about client-side validation for HTML forms.

First, while it can make for a better user experience because it allows you to provide real-time feedback to users as they fill out your form, it's completely dependent on JavaScript loading (at all, or correctly). If a user browses your app with JavaScript disabled (either voluntarily or [some other reason](https://kryogenix.org/code/browser/everyonehasjs.html)), your form won't work without a submit button.

Second, it's important to understand that client-side validation should not be relied upon for any data that you intend to later send to a server. The approach described in this tutorial is only for client-side validation in apps that are storing user input in local state. In this case, since we're not dealing with any server-side logic, we don't need to worry about this issue.

## HTML Input Validation with JavaScript

Over the course of the next several sections, we'll learn how to perform client-side validation using HTML and vanilla JavaScript. Towards the end of this article, we'll also look at how you can create a self-validating input component in a JavaScript framework like React.

### Checking HTML Input Validity with `checkValidity`

Suppose we have an input that accepts an even integer from `2` to `10`, inclusive:

```html
<input id="input" type="number" min="2" max="10" step="2">
```

Our first order of business is to determine whether this input's current value is valid. We could check it by hand and try to account for all of the possible error states, but that would be tedious and error prone, especially for large forms. Plus, if the input's HTML ever changes—like if we decide to increase its maximum allowed value—we'd need to update our code so it's no longer out of sync.

Certain input attributes prevent a user from ever entering disallowed values. For example, `type="number"` prevents a user from entering text. By contrast, while the `min`, `max`, and `step` attributes define constraints for the value, the input doesn't actually enforce those requirements because a user can still go in and manually input an invalid value, like `11`. In its current state, this input won't provide any feedback to the user to indicate that the value they entered is not allowed because the input isn't part of a submittable form.

Fortunately, we can still validate this input ourselves using very little JavaScript. Every HTML input element has a [`checkValidity` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity) that returns `true` if the input's current value passes validation and `false` otherwise. We'll want to invoke this method whenever the input's [`change` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) fires, which signals that the user has finalized the value for that input (either by blurring the input or pressing the Enter key):

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

The browser validates the input behind the scenes by comparing the input's value to its HTML constraints. In this example, those constraints are enforced by the `type`, `min`, `max`, and `step` attributes, requiring the user to enter an even integer. If a user enters an invalid value, like `5`, the `checkValidity` method will return `false`.

### Reporting Input Validity to Users

At this point, we know if the user's input is invalid. The browser has already determined the condition that violates the input's constraints under the hood, and we didn't have to write any custom logic to do that by hand. Now, all we need to do is report the validation error (if any) to the user. Depending on how you feel about native input validation, there are two approaches you could consider.

#### Option 1: Native Validation with `reportValidity`

The simplest approach is to use [`reportValidity`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity) to programmatically report a native validation error, much like the one a user would see if they were submitting a form the traditional way:

```js {data-copyable=true}
const input = document.querySelector('#input');
input.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid) {
    e.target.reportValidity();
  }
});
```

When invoked on an invalid input, `reportValidity` will:

1. Forcibly re-focus the input.
2. Show a native tooltip (with a role of `alert`) clarifying why the validation failed.

Screen readers will narrate the alert correctly, and sighted users will see the message in a familiar form tooltip whose styling depends on the browser and operating system being used. The browser may also suggest how the user can correct their input. Returning to our earlier example, if a user enters an odd number, the browser will suggest the two closest numbers:

{% include img.html src: "odd.png", alt: "A numeric input box contains the value 5 and two controls: up and down. Below it is a tooltip that reads: 'Please enter a valid value. The two nearest valid values are 4 and 6.'." %}

#### Option 2: Custom Error Messaging

In most cases, native validation works well. But there are a few drawbacks to using `reportValidity`. One is that the tooltip cannot be styled, so if your designers insist on customizing its appearance, you're out of luck. Another problem is that browsers have historically been inconsistent in how they implemented some of these APIs, so you may need to test this thoroughly with different screen readers, browsers, devices, and users. For example, digital accessibility consultant Adrian Roselli [recommends avoiding native validation](https://adrianroselli.com/2019/02/avoid-default-field-validation.html) because of certain quirks, like the fact that validation popups auto-hide on Chrome after a certain duration, the fact that pattern mismatches are not communicated to users, and various other issues.

If you find that some of these behaviors are unacceptable, you may need to implement a custom error handling solution that mirrors the native functionality provided by browsers. Since this would require an entire article on its own, I'm going to briefly cover some of the most important considerations.

The first is to make sure the input gets an `aria-describedby` attribute pointing to the error message so it's narrated by screen readers when the input receives focus:

```html
<label>
  First name
  <input type="text" aria-invalid="true" aria-describedby="first-name-error" />
  <span id="first-name-error">Please enter a value.</span>
</label>
```

{% aside %}
Additionally, as Adrian notes, you should [avoid showing error messages below input fields](https://adrianroselli.com/2017/01/avoid-messages-under-fields.html) because they may be obscured by other UI, like dropdowns or virtual keyboards.
{% endaside %}

The second consideration is to auto-focus the invalid input so that the error message is narrated. (Note that `reportValidity` does this for you.) Otherwise, a screen reader user will have no way of knowing that their input is invalid since screen readers do not normally narrate dynamically inserted HTML.

Finally, use clear labeling and error messages so that users are able to correct their mistakes. Avoid using generic, unclear error messages like "invalid input" or "please correct your input," as these aren't very helpful. Don't simply state that a user made a mistake—clarify why it's a mistake or how they can correct it.

#### Marking Invalid Inputs with `aria-invalid`

For the sake of completeness, regardless of which approach we take in client-side validation, we should also set the [`aria-invalid` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute) on the input. This is used to convey an input's validity state to screen readers, and it's just a matter of setting the attribute on every `change` event, like this:

```js {data-copyable=true}
// Same code as before
const isValid = e.target.checkValidity();

// New code
e.target.setAttribute('aria-invalid', !isValid);
```

If `aria-invalid="true"`, a screen reader will identify the input as invalid.

### Determining Why an Input Failed Validation

In the examples we looked at so far, we only ever checked if an input has a valid or invalid value, but we never determined *why* the validation failed. And that's expected—you usually won't need to do this yourself because `reportValidity` already identifies the failure condition for us and reports an appropriate error message. But if you do need to know why an input failed validation—like if you're implementing custom error messaging UI—you can check `InputElement.validity`. This is [a `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) containing boolean flags for the following failure conditions:

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

{% aside %}
  You can still use this approach if you decide to implement custom error messaging UI instead of relying on `reportValidity`. You would just need to store the specific type of failure condition in your state so you can render an appropriate error message.
{% endaside %}

## A Self-Validating Input

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

When an HTML form is submitted, the browser validates each input and reports any issues. But it's not always the case that you want or need to submit form data to a back end. If all you want is to use a form to receive user input and store it locally in your app's state, you can use the `checkValidity`, `reportValidity`, and `setCustomValidity` methods to provide feedback to the user. If you're using a JavaScript framework, you can also take things a step further and create a custom self-validating Input component.
