---
title: Accommodating the Longest Text in a Label with CSS Grid
# title: Creating a Fixed-Width Label with Dynamic Text Using CSS Grid
# title: Fixing Layout Shifts Caused by Dynamic Text with CSS Grid
# title: Setting an Element's Width to Its Longest Text with CSS Grid
# title: Sizing a Label's Width to Match Its Longest Text with CSS Grid
# title: Sizing a Label to Match Its Longest Text with CSS Grid
description: Suppose a label renders strings of different lengths, but you want it to always reserve space for the longest text to prevent layout shifts. You can do this using a CSS grid trick.
keywords: [longest text, layout shifts, css grid]
categories: [css, css-grid, webperf, react]
thumbnail: thumbnail.jpg
---

Imagine this scenario: A label renders different text for different states, but these strings are known statically, ahead of time. For example, the element in question may be a save status indicator in an app's header. Sometimes the label is long (`Saving...`), but other times it's short (`Saved`). The code for this might look something like what I've shown below; it's React, but even if you don't know React, you should be able to make sense of it at a high level:

```jsx
<span className="save-status">
  {isSaving ? 'Saving...' : 'Saved'}
</span>
```

If the label were just sitting there by itself, this would be pretty harmless. But imagine if the label had adjacent siblings in a grid or flex layout. As the label's width changes, it'll cause an unwanted layout shift among its siblings. This is particularly noticeable at smaller breakpoints.

It's also worth noting that the lengths of these strings may vary greatly depending on the user's locale if your app is internationalized. This means that fixing this layout shift is not a simple matter of adding some arbitrary padding to the end of the label and calling it a day.

Instead, what we want is for the label to always render with a fixed width—namely, the width of its longest text, even if this means that there's some unused space left over when the label renders shorter text. But how can you do this if the text is dynamic?

You could use JavaScript to perform DOM measurements after UI changes (`useLayoutEffect`) and set a min width on the label, but this can [run into problems with server-side rendering](https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85). It also feels over-engineered since you shouldn't have to use JavaScript to fix UI problems like this. Fortunately, it turns out that this can be done entirely with CSS thanks to the power of CSS grid.

Below is a Codepen demo for this tutorial:

<iframe height="300" style="width: 100%;" scrolling="no" title="Fixing layout shifts caused by dynamically rendered text" src="https://codepen.io/AleksandrHovhannisyan/embed/preview/BaZJoyK?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/BaZJoyK">
  Fixing layout shifts caused by dynamically rendered text</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Solution: Overlaying Children with CSS Grid

Rather than conditionally rendering one string at a time based on state, what if we always render both of the strings but visually hide the one that doesn't correspond to the current state? If we could somehow overlay the two strings but force them to participate in the layout, then the label would always assume the width of its longest text.

{% raw %}
```jsx
return (
  <span className="save-status">
    <span style={{ visibility: isSaving ? 'hidden' : 'visible' }}>Saved</span>
    <span style={{ visibility: isSaving ? 'visible' : 'hidden' }}>Saving...</span>
  </span>
)
```
{% endraw %}

{% aside %}
  You usually don't want to hide content with `visibility: hidden` because it removes the element from the accessibility tree, but that's actually the desired behavior in this case. We don't want screen readers to narrate both labels—they should only read one at a time.
{% endaside %}

One idea is to use absolute positioning, but that won't work. Absolutely positioned elements are removed from the document flow, so they don't contribute to the layout at all—and this is exactly the opposite of what we want. Transforms and other naive tricks don't work, either.

In an article titled [Less Absolute Positioning With Modern CSS](https://ishadeed.com/article/less-absolute-positioning-modern-css/), Ahmad Shadeed explores an alternative to absolute positioning that still allows you to overlay content. Ryan Mulligan also wrote about this technique on CSS Tricks: [Positioning Overlay Content with CSS Grid](https://css-tricks.com/positioning-overlay-content-with-css-grid/).

The trick involves using CSS grid to overlay children on top of one another, without removing them from the document flow. As a result, the layout's width is determined by the width of its longest text child. We have this markup (React):

{% raw %}
```jsx
return (
  <span className="save-status">
    <span style={{ visibility: isSaving ? 'hidden' : 'visible' }}>Saved</span>
    <span style={{ visibility: isSaving ? 'visible' : 'hidden' }}>Saving...</span>
  </span>
)
```
{% endraw %}

And we'll use this CSS:

```css
/* make a grid with 1 row and 1 column */
.save-status {
  display: grid;
}
/* all children should span every row and column */
.save-status * {
  grid-area: 1 / -1;
}
```

`grid-area: 1 / -1` says that the children should span all rows and all columns of the parent grid layout; `-1` just refers to the last row/column. Effectively, this means that our text labels will be stacked on top of one another, but they will also continue to influence the width and height of the layout. This means that the element will always take on the width of its longest text.

Below is a screenshot of what that looks like from the demo; notice how the red outline of the label doesn't fully hug the text on the right side. This is because there is some space reserved for the longer text:

{% include img.html src: "fixed-width.png", alt: "A layout with a thin black border around it to delineate its box model. A label is rendered inside the layout with its own border, in red. The label has some extra space before the end of its right border, indicating that it's reserved space for longer text. A button is positioned to the right of the label. Below the layout box is an enabled checkbox that reads 'Prevent layout shift.'" %}

Whenever the text changes, our styles will kick in and hide the text that shouldn't be visible. But we do this in such a way that the hidden element still contributes to the layout. No more layout shifts, and no more JavaScript to solve a CSS bug!

{% include unsplashAttribution.md name: "William Warby", username: "wwarby", photoId: "WahfNoqbYnM" %}
