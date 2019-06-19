# My Personal Website

This is just a little single-page site I threw together to share some of my work, skills, education, etc.

![](https://user-images.githubusercontent.com/19352442/59554876-ece7b880-8f77-11e9-972c-cd5c79a99ec8.png)

## Why Build Everything from Scratch?

I mainly built this site as a way to practice (and showcase) my HTML and CSS abilities, so it simply made sense to build everything from the ground up without relying on frameworks to do things for me.

I'd previously tried my hand at creating a personal website using Bootstrap because I'd been told that it's all the rage, especially for responsiveness. I did not particularly enjoy working with Bootstrap—at least in the way it's traditionally taught, with a fatal case of *divitis* left and right. My biggest problem was legibility and organization; Bootstrap makes HTML difficult to read and [completely butchers semantic markup](https://coderwall.com/p/wixovg/bootstrap-without-all-the-debt). It also severely limits your ability to move certain elements wherever you want them on a page. And of course, it also slows down your page load speed (though that isn't much of a consideration for most portfolio sites).

(Note: Bootstrap is definitely a good choice for startups and rapid prototyping, especially when you're low on budget, time, or both. I just despise its responsive column syntax and the boatload of classes you have to juggle in your head. It gets messy very quickly. Messy markup is harder to maintain.)

When I later discovered [Scrimba's CSS Grid tutorial series](https://scrimba.com/g/gR8PTE), I figured I'd jump back in and give this web dev thing another try. And this time, I genuinely enjoyed it because it felt like progressive enhancement for once: first building the content and then styling it to my heart's content. CSS Grid makes it possible to create powerful and flexible layouts without cluttered markup. No need to stuff a billion specialized classes into a forest of divs :)

## Design Considerations

I built my site with a mobile-first strategy, targeting a minimum device width of 320 px and working my way up to larger screens using CSS Grid's `repeat`, `auto-fit`, and `minmax`, as well as a few media queries. I also used Flexbox wherever I found it more convenient than grids (e.g., wherever the number or width of column tracks wasn't too relevant, or whenever I wanted to vertically center div content). All of my testing was done using Google Chrome's built-in dev tools.

![](https://user-images.githubusercontent.com/19352442/59807363-948d1f80-92c5-11e9-8d3d-023b3879408d.png)

<p align="center"><i>Example: responsive CSS grid layout used for project gallery</i></p>

I didn't really have any strategy in place for color choices; I mainly picked whatever looked good to me and tweaked things as I went along. For dark mode, I wanted to go for a "coffee"-type theme. Light mode is nice and neutral. I added both an auto and a manual transition to allow users to pick whichever theme they prefer. Again, that's obviously not too important for a portfolio site but still something I wanted to try.

![](https://user-images.githubusercontent.com/19352442/59712393-2409d400-91db-11e9-979e-53eaae71b4d5.png)

<p align="center"><i>Dark mode theme, for those whose hiring efforts extend into the night :)</i></p>

Finally, I decided I'd also include a form on my site to make it easier for people to reach out, even though the primary CTA buttons direct visitors to my LinkedIn and GitHub. I used [Formspree](https://github.com/formspree/formspree) for this, and it works great. One downside is that your email is publicly exposed in your HTML; to address this, I used a [hidden honeypot field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) and a throwaway/dedicated email address.

## What Did I Learn?

1. Don't even bother styling anything until you have your content. You'll overwhelm yourself and fall down a rabbit hole. First get the content on the page, no matter how horrendous it looks. Then clean it up, add semantic elements or divs as needed, and style with CSS.

2. CSS Grid is awesome :) I've yet to master everything it has to offer, but from what I saw personally, it has immense potential. It's quite possibly the future of layout design.

3. Wireframes are indispensable. I used [MockFlow](https://www.mockflow.com/) to throw together a very rough representation of what I wanted my site to look like. Though I did ultimately change quite a lot of things, the mockup stage helped me focus on what content I wanted to have on my page—and that tied in to #1. Here's what it looked like:

![](https://user-images.githubusercontent.com/19352442/59712852-0ab55780-91dc-11e9-833f-b7b660491608.png)

As you can see, I ended up ditching most of my old ideas and copy. But at least I had a foundation to work with!

4. Just when you think you're done making your site look good, you're not. In a way, you have to be your worst critic if you want a good result. For example, there were some things I didn't like about my site in the early stages of development—empty space that wasn't getting used efficiently on the page, or the rather bland skills section that was just plain text and was clearly missing some pizzazz (thank you, [Pascal van Gemert](http://www.pascalvangemert.nl/), for inspiring me). I was initially reluctant to address any of these problems because I was afraid I'd mess up my site, but quite the opposite—I made it better! Ultimately, I think my fear stemmed from inexperience with CSS, HTML, or both. Over time, it was replaced with confidence. I am by no means done learning HTML and CSS, but I'm *far* more competent than when I first got started.

![](https://user-images.githubusercontent.com/19352442/59555102-8369a900-8f7b-11e9-9806-4102d56424be.png)

<p align="center"><i>Back when the portfolio cards were not actually... cards</i></p>

![](https://user-images.githubusercontent.com/19352442/59555081-4e5d5680-8f7b-11e9-8445-0a5079f20212.png)

<p align="center"><i>The old skills section—so much wasted space!</i></p>

5. JavaScript is cool, but also apparently expensive when overused. I think I'd like Typescript much more; aside from Python, there are few dynamically typed languages that I like working with. Coming from a C++ background, I prefer static typing because it makes your code much easier to read, and it enforces a strict contract with the compiler. In my opinion, dynamic typing is just fine for small scripts; it's when your code base grows that it becomes a nightmare to maintain. Again, for this project, that wasn't really a problem.

## That's About It!

Thanks for visiting my site! If you have any suggestions for improving it, I'd love to hear your thoughts :)
