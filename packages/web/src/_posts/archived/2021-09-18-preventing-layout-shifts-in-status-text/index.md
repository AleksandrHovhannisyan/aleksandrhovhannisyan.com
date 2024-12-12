---
title: Preventing Layout Shifts in Status Text with CSS Grid
description: Use this trick with CSS Grid to prevent layout shifts when swapping text in status indicators.
keywords: [longest text, layout shifts, css grid]
categories: [css, webperf]
lastUpdated: 2024-12-11
commentsId: 109
redirectFrom:
  - /blog/accommodating-the-longest-text-in-a-label/
---

Web apps often need to render status text for different states, like for save indicators or loaders. Sometimes the label is long (`Saving...`), but other times it's shorter (`Saved`). Usually, the code will check some boolean state to decide which one to render. Here's an example written in React:

```jsx
<span className="save-status">
  {isSaving ? 'Saving...' : 'Saved'}
</span>
```

If this `.save-status` label were the only element in the parent container, you wouldn't run into any problems. But if the label had adjacent siblings in a grid or flex layout, any changes to its content would cause its width to change. And if the label's width changes, it'll cause unwanted layout shifts by pushing and pulling its siblings.

You might be tempted to fix this layout shift by adding arbitrary padding to the end of the label and calling it a day. But in most internationalized apps, string lengths will vary greatly depending on the user's locale. So that's not an option. Instead, what we want is for the label to always render with a fixed width—namely, the width of the longest text it could ever have, even if this means that there's some unused space left over when the label renders shorter text. But how can we do this if the text is dynamic?

You could use JavaScript to perform DOM measurements after UI changes (`useLayoutEffect`) and set a min width on the label, but this can [run into problems with server-side rendering](https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85). It also feels over-engineered since you shouldn't have to use JavaScript to fix UI problems like this.

Fortunately, it turns out that this can be done entirely with CSS thanks to the power of CSS grid. Below is a Codepen demo showing the problem along with its solution:

<iframe height="300" style="width: 100%;" scrolling="no" title="Fixing layout shifts caused by dynamically rendered text" src="https://codepen.io/AleksandrHovhannisyan/embed/preview/BaZJoyK?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/AleksandrHovhannisyan/pen/BaZJoyK">
  Fixing layout shifts caused by dynamically rendered text</a> by Aleksandr Hovhannisyan (<a href="https://codepen.io/AleksandrHovhannisyan">@AleksandrHovhannisyan</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Solution: Overlay Text with CSS Grid

Instead of conditionally rendering one string at a time, what if we always render both of the strings but visually hide the one that doesn't correspond to the current state? If we could somehow overlay the two strings but force them to participate in the layout, then the label would always take on the width of its longest text.

{% raw %}
```jsx
return (
  <span className="save-status">
    <span style={{ visibility: isSaving ? 'hidden' : 'visible' }}>Saved</span>
    <span style={{ visibility: isSaving ? 'visible' : 'hidden' }}>Saving...</span>
  </span>
);
```
{% endraw %}

{% aside %}
You usually don't want to hide content with `visibility: hidden` because it removes the element from the accessibility tree, but that's actually the desired behavior in this case. We don't want screen readers to narrate both labels—they should only read one at a time.
{% endaside %}

One idea is to use absolute positioning, but that wouldn't work. Absolutely positioned elements are removed from the document flow, so they don't contribute to the layout at all—and this is exactly the opposite of what we want. Transforms and other naive tricks won't work, either.

In an article titled [Less Absolute Positioning With Modern CSS](https://ishadeed.com/article/less-absolute-positioning-modern-css/), Ahmad Shadeed explores an alternative to absolute positioning that still allows you to overlay content. Ryan Mulligan also wrote about this technique on CSS Tricks: [Positioning Overlay Content with CSS Grid](https://css-tricks.com/positioning-overlay-content-with-css-grid/).

The trick is to use CSS grid to overlay the two text elements on top of each other rather than always rendering one state at a time. When we do this, the layout's width will be determined by the width of its longest text child.

We now have this markup:

{% raw %}
```jsx
return (
  <span className="save-status">
    <span style={{ visibility: isSaving ? 'hidden' : 'visible' }}>Saved</span>
    <span style={{ visibility: isSaving ? 'visible' : 'hidden' }}>Saving...</span>
  </span>
);
```
{% endraw %}

And we'll use this CSS to fix the layout shift:

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

Here, `grid-area: 1 / -1` says that the children should span all rows and columns of the parent grid layout; `-1` just refers to the last row/column. Effectively, this means that our text labels will be stacked on top of each other, but they'll still contribute to the width and height of the layout. Thus, the parent will always take on the width of the widest overlaid text (in this case, "Saving...").

Below is a screenshot of what that looks like from the demo; notice how the red outline of the label doesn't fully hug the text on the right side. This is because there is some space reserved for the longer text:

![A layout with a thin black border around it to delineate its box model. A label is rendered inside the layout with its own border, in red. The label has some extra space before the end of its right border, indicating that it's reserved space for longer text. A button is positioned to the right of the label. Below the layout box is an enabled checkbox that reads 'Prevent layout shift.'](./images/fixed-width.png)

Whenever the text changes, our styles will kick in and hide the text that shouldn't be visible. But we do this in such a way that the hidden element still contributes to the layout. No more layout shifts, and no more JavaScript to solve a CSS bug!
