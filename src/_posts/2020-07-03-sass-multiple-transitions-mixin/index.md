---
title: Sass Multiple Transitions Mixin
description: Tired of repeating the CSS transition property by hand? Use this Sass mixin to easily define multiple CSS transitions in one go.
keywords: [sass multiple transitions mixin]
categories: [sass, css]
thumbnail: ./images/thumbnail.png
---

Way back when I moved my site from plain HTML and CSS to Jekyll, I wanted to take full advantage of Sass and its powerful support for mixins. And one particularly repetitive line of code in my CSS went something like this:

```css
.someSelector {
    transition: someProperty 0.2s ease,
                someOtherProperty 0.2s ease;
}
```

Why would I do this? Because I enjoy creating interactive experiences on my site that don't feel snappy—I love fluid transitions. But this gets repetitive after a while. And if there's one thing that developers hate, it's repetition.

A quick and dirty fix is to just create a Sass variable or CSS custom property that consolidates the shared parts of the transition:

```scss
$transition: 0.2s ease;

.someSelector {
    transition: someProperty $transition,
                someOtherProperty $transition;
}
```

But that still doesn't fully eliminate the repetition—we just have to type fewer characters now. What I was searching for is a **Sass mixin for multiple CSS transitions**. And I eventually found it in [a StackOverflow answer by user yspreen](https://stackoverflow.com/a/49437769/5323344):

```scss {data-file="mixins.scss" data-copyable=true}
@mixin transition($props...) {
    $result: ();

    @for $i from 1 through length($props) {
      $prop: nth($props, $i);
      $result: append($result, $prop);
      $result: append($result, ease 0.2s);

      @if $i != length($props) {
        $result: append($result, unquote($string: ","));
      }
    }

    transition: $result;
}
```

Of course, you can replace `ease 0.2s` with whatever standard transition you want all elements on your site to have.

Here's how this mixin works:

1. It takes in a variable number of arguments.
2. It loops over the arguments and accumulates a string taking the form `property 0.2s ease,`.
3. It excludes the trailing comma for the very last property in the list.
4. It sets the `transition` CSS property to be the result!

And here's how I use this multiple transition mixin in my own stylesheets:

```scss
.someProperty {
    @include transition(background-color, color, border-color);
}
```

It works like a charm, and it's super easy to understand!

Note that Tobias Ahlin created [a more advanced version of the mixin](https://gist.github.com/tobiasahlin/7a421fb9306a4f518aab) that's able to cleanly handle overrides for things like the transition duration. Check it out if you need something more flexible!
