---
title: Represent State with HTML Attributes, Not Class Names
description: Developers often use class names to represent a change in a component's state, but this leads to redundant (and sometimes inaccessible) markup. Instead, we should use native HTML attributes to represent state and style those discrete states with the CSS attribute selector.
keywords: [html attributes, CSS attribute selector, class names]
categories: [accessibility, html, css]
commentsId: 108
lastUpdated: 2022-07-17
thumbnail:
  url: https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
---

How often have you seen markup like this?

```html
<a href="/page2/" class="nav-link active">Page 2</a>
```

We have an anchor with two class names: `nav-link` and `active`. Presumably, the `active` class means that this anchor points to the current page. It's safe to assume that we'll use this class to style active navigation links differently than others:

```css
/* other pages */
.nav-link {}

/* current page */
.nav-link.active {}
```

This approach is common in component frameworks, where we tend to pass along props for disabled, active, and "current" states, and these might be used to conditionally apply class names inline:

```jsx
import classNames from 'classnames';

const NavLink = ({ href, isActive, isDisabled, children }) => {
  return (
    <a
      href={href}
      className={classNames("nav-link", {
        active: isActive,
        disabled: isDisabled,
      })}
    >
      {children}
    </a>
  );
};
```

This is *even more* tempting—and usually the only option—in utility-first frameworks like Tailwind, where class names are the basic building blocks of your UI.

However, I've noticed that we tend to reach for class names too soon when we want to represent a change in UI state. Instead, we should try to first communicate this state through the appropriate HTML attributes and then use CSS attribute selectors to style each discrete state. I've also found that if you're using both HTML attributes and CSS classes to represent an element's state, then you're storing redundant information at the markup level, and this problem can be avoided entirely by using attribute selectors from the get-go.


{% include "toc.md" %}

## Representing UI State with HTML Attributes

Below are just a few examples of markup that relies on HTML classes to represent an element's state. In each section, we'll explore a better alternative: representing an element's state using HTML attributes and styling the element using the CSS attribute selector.

### Navigation Links

We have this markup from the intro:

```html
<a href="/page2/" class="nav-link active">Page 2</a>
```

We can assume that the corresponding styles for the `active` class are sufficient to convey the link's activeness state to sighted users. However, importantly, screen readers won't treat this link differently than any other on the page because they can't interpret semantics from a class name.

Instead, we can use the `aria-current` attribute, which identifies the current element in a collection of related items. The definition of "current" depends wholly on the context. In the case of navigation links, the current item corresponds to the current page. And as it turns out, `"page"` is a valid value for this attribute, made specifically for this use case. So we can set `aria-current="page"` on the link and remove the `active` class entirely:

```html
<a href="/page2/" class="nav-link" aria-current="page">Page 2</a>
```

Now, we can style the active navigation link with the CSS attribute selector, targeting navigation links that have an `aria-current` attribute of `"page"`:

```css
.nav-link[aria-current="page"] {}
```

This communicates the same information as before but without an extra class name. This offers two benefits:

1. Screen readers will now narrate the link's activeness state: `Link current page [text]`.
2. We don't have to repeat ourselves by specifying both HTML attributes and classes.

### Toggle Buttons

Consider the classic hamburger button that's used to toggle a navigation menu:

```html
<button type="button" aria-label="Toggle menu"></button>
<ul class="navbar-menu">
  <!-- links here -->
</ul>
```

This is a special case of a more general scenario: toggle buttons. A toggle button is an interactive element that, when clicked, alters the visibility of another element on the page that it controls or owns. For example, the [`details` disclosure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) is a native toggle button.

It's very likely that a toggle button will need to change its styling to reflect its current state: toggled or not toggled. In the case of a navigation menu, this would communicate whether the menu is open or closed. So you may be tempted to use different class names to represent these states and style them accordingly:

```html
<!-- Closed menu -->
<button
  type="button"
  aria-label="Toggle menu"
  class="navbar-toggle closed"
></button>

<!-- Open menu -->
<button
  type="button"
  aria-label="Toggle menu"
  class="navbar-toggle open"
></button>
```

However, this runs into the same problem as the navigation link example: We're not communicating the right semantics to screen readers by using a class name alone. And once we do add the proper semantics with HTML attributes, the class names will become redundant.

Let's ignore the fact that this button would need other HTML attributes to be fully accessible; I've listed them below for completeness, but they're not too important for our purposes. Instead, let's focus on just one of those attributes: `aria-expanded`. In the case of trigger buttons like a hamburger icon, `aria-expanded` communicates whether the element associated with the button is currently expanded or contracted. The markup might look like this:

```html
<button
  id="navbar-toggle"
  type="button"
  aria-label="Toggle menu"
  aria-controls="navbar-menu"
  aria-expanded="true"
></button>
<ul id="navbar-menu" aria-labelledby="navbar-toggle"></ul>
```

Now, rather than styling the button states with class names, we can style them using the attribute selector:

```css
/* State: closed. Click to open. */
#navbar-toggle[aria-expanded="false"] {}

/* State: open. Click to close. */
#navbar-toggle[aria-expanded="true"] {}
```

This reads just as naturally as the first example with class names, but it removes the unnecessary noise of picking a class name and using it to style the element's states.

### Multi-Select Widgets

Imagine you're building a UI where a user can select one or more items on the screen. This may be implemented with native checkboxes or radio buttons, or it may be implemented using buttons that have their role set accordingly (e.g., to `radio`, `checkbox`, or some other valid value). Implementation details aside, it's likely that the user's selection will be highlighted somehow, like with a decorative outline.

Again, the class name approach is very tempting, especially when you already have inline logic for determining the activeness of an element, like in this React example:

```jsx
<ul role="radiogroup">
  {items.map((item) => {
    const isSelected = item.id === selectedId;

    return (
      <li key={item.id}>
        <button
          type="button"
          role="radio"
          onClick={() => setSelectedId(item.id)}
          // This feels tempting and is easy to read
          className={classNames({ active: isSelected })}
        >
          {item.label}
        </button>
      </li>
    );
  })}
</ul>;
```

Instead, we can (and should!) leverage the `aria-checked` attribute since we're using a role of `radio`. Native radio buttons implement these semantics under the hood, but since we're using a button with an explicit role, we should set the corresponding ARIA attribute:

```jsx
<button
  type="button"
  role="radio"
  onClick={() => setSelectedId(item.id)}
  aria-checked={isSelected ? 'true' : undefined}
>
  {item.label}
</button>
```

{% aside %}
  Other times, you may need to use `aria-selected` rather than `aria-checked`. It just depends on what element you're working with.
{% endaside %}

And now, styling the active selection is a simple matter of using the attribute selector:

```css
button[aria-checked="true"] {}
```

Just as before, it turns out that the class name was completely redundant. In fact, because we reached for a class name prematurely, we forgot to communicate the right semantics at the markup level.

## Exception: Styling a Parent's State

Before wrapping up, I want to note that there *are* some exceptions to this rule.

In the case of the hamburger toggle button, the parent element (e.g., a navbar) may need to know whether the button has been toggled so it can style itself accordingly. Since there's no way for a parent to change its own appearance in response to changes in a child element's state (at the time of this writing), the best that we can do is to apply an additional class name or data-attribute at the parent level to reflect this change in state.

The need to style a parent's state based on a child's state is one of the strongest arguments in favor of introducing [relational selectors like `:has`](https://drafts.csswg.org/selectors/#relational) to the CSS standard. Once supported, it would allow us to write CSS like this:

```css
/* Open navbar */
.navbar:has(#navbar-toggle[aria-expanded="true"]) {}

/* Closed navbar */
.navbar:has(#navbar-toggle[aria-expanded="false"]) {}
```

That way, you wouldn't need to introduce duplicate class names at the parent level just so you could style it.

## Use Attributes First and Class Names Second

If possible, try to represent your UI state using HTML attributes first, and only reach for class names when you really need them. With this approach, you're forced to use class names for their intended purpose: styling elements, not representing UI state. Consider whether there are existing HTML attributes that you can use to communicate an element's state to assistive technologies. From there, styling the element should be straightforward and may not even require any additional class names.

{% include "unsplashAttribution.md" name: "Chris Lawton", username: "chrislawton", photoId: "5IHz5WhosQE" %}
