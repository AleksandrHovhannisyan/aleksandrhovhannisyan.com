---
title: Making a Full-Width Footer that Sticks to the Bottom of the Page
description: 
keywords: 
categories: [Programming]
---

There are [a number of posts](https://www.freecodecamp.org/news/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c/) on how to keep a footer at the bottom of the page. However, none of the tutorials I've read have discussed the design that I wanted for my own website.

Here's what I wanted to do:

1. Horizontally center the main contents of the page with auto margins.

2. Have the footer stretch from the left end of the viewport to the right. Align the contents of the footer with the main page's content margins.

3. Finally, keep the footer at the bottom of the page no matter how much content there is above it.

Here's a mockup of what that will look like:

{% include posts/picture.html img="mockup" alt="A mockup showing a full-width footer at the bottom of the page." %}

As you can see, the footer stays at the bottom of the page, even though there isn't enough main content to force it down there. Additionally, the footer extends beyond the main content margins (the dashed white lines). But its *content container* is lined up with the main margins, and the actual content of that container is centered.

First, I'll set up the bare-minimum HTML:

```html
<!DOCTYPE html>
<html lang>
    <head><link rel="stylesheet" type="text/css" href="style.css"></head>
    <body>
        <main>
            <article>
                <h1>Welcome to my site!</h1>
                <button>Button</button>
                <button>Button</button>
            </article>
            <article>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Dolorem omnis repellendus nostrum numquam at doloremque 
                a sapiente earum totam, dolor sequi minus vel voluptatum 
                laboriosam, distinctio, amet dolores. Necessitatibus, laborum!
            </article>
        </main>
        <footer id="page-footer"><span>Copyright Author Name, 2019</span></footer>
    </body>
</html>
```

And here's `style.css`:

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    /* Make things a bit easier to look at */
    font-family: Arial;
}

#page-footer {
    color: #b3b1b1;
    background-color: #2c2c2c;
}
```

Nothing too complicated. Let's tackle each requirement one at a time.

## 1. Horizontally Centering the Main Page

To do this, we'll use the good-ol' `max-width` and `auto` margins trick. However, we won't be applying these rules to the body. For reasons that you'll see later in the third step, we'll be using a wrapper div around everything except the footer. Let's go ahead and add that `div` and give it an ID of `page-wrapper`:

```html
<!DOCTYPE html>
<html lang>
    <head><link rel="stylesheet" type="text/css" href="style.css"></head>
    <body>
        <div id="page-wrapper">
            <main>
                <article>
                    <h1>Welcome to my site!</h1>
                    <button>Button</button>
                    <button>Button</button>
                </article>
                <article>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Dolorem omnis repellendus nostrum numquam at doloremque 
                    a sapiente earum totam, dolor sequi minus vel voluptatum 
                    laboriosam, distinctio, amet dolores. Necessitatibus, laborum!
                </article>
            </main>
        </div>
        <footer id="page-footer"><span>Copyright Author Name, 2019</span></footer>
    </body>
</html>
```

Again, note that the footer lies outside of the wrapper. This will be important.

Here's the additional styling we'll apply over in `style.css`:

```css
#page-wrapper {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    /* Just some spacing */
    margin-top: 50px;
}
```

And here's the result:

{% include posts/picture.html img="centered" alt="A centered page with main contents and a footer." %}

I won't apply any styling to make things look nice; that way, we keep things simple for this tutorial. The page may look ugly, but we're making progress. That's one down, with two left to go!

## 2. Full-Width Footer with Aligned Contents

If we simply try to give our footer `width: 100%`, that alone won't do the trick. Why? Because the footer is nested in a parent, and all elements currently have a default of `position: static`. This means the 100% width will simply stretch the footer until it hits the left and right edges of `page-wrapper`.

Instead, what we want is to break the footer from the normal flow of content on the page. We want an absolutely positioned footer with 100% width:

```css
#page-footer {
    color: #b3b1b1;
    background-color: #2c2c2c;
    /* New styling */
    position: absolute;
    bottom: 0;
    width: 100%;
    /* To make it easier to see */
    height: 55px;
}
```

Here's what that gives us:

{% include posts/picture.html img="full-width" alt="A full-width footer." %}

And to align the footer with the main page, we'll use this styling:

```css

```

At this point, it may seem like we don't even have to go to the third step. From the screenshot above, it appears as if the footer is already at the bottom of the page.

Don't let this fool you, though—the footer is not truly at the bottom of the page. It just so happens to be there now. If we add more text, we'll see that the footer betrays us:

{% include posts/picture.html img="not-really-bottom" alt="When we add more content, the footer doesn't stay at the bottom of the page." %}

