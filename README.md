# My Personal Website

This is just a little single-page site I threw together to share some of my work, skills, education, etc.

![](https://user-images.githubusercontent.com/19352442/59554876-ece7b880-8f77-11e9-972c-cd5c79a99ec8.png)

## Why Build Everything from Scratch?

I mainly built this site as a way to practice (and showcase) my HTML and CSS abilities, so it simply made sense to build everything from the ground up without relying on frameworks to do things for me.

I'd previously tried my hand at creating a personal website using Bootstrap because I'd been told that it's all the rage, especially for responsiveness. I did not particularly enjoy working with Bootstrap—at least in the way it's traditionally taught, with a fatal case of *divitis* left and right. My biggest problem was legibility and organization; Bootstrap makes HTML difficult to read and [completely butchers semantic markup](https://coderwall.com/p/wixovg/bootstrap-without-all-the-debt). It also severely limits your ability to move certain elements wherever you want them on a page. And of course, it also slows down your page load speed (though that isn't much of a consideration for most portfolio sites).

(Note: Bootstrap is definitely a good choice for startups and rapid prototyping, especially when you're low on budget, time, or both. I just despise its responsive column syntax and the boatload of classes you have to juggle in your head. It gets messy very quickly. Messy markup is harder to maintain.)

When I later discovered [Scrimba's CSS Grid tutorial series](https://scrimba.com/g/gR8PTE), I figured I'd jump back in and give this web dev thing another try. And this time, I genuinely enjoyed it because it felt like progressive enhancement for once: first building the content and then styling it to my heart's content. CSS Grid makes it possible to create powerful and flexible layouts without cluttered markup. No need to stuff a billion specialized classes into a forest of divs :)

## Design Considerations

### Responsiveness
I built my site with a mobile-first strategy, targeting a minimum device width of 320 px and working my way up to larger screens using CSS Grid's `repeat`, `auto-fit`, and `minmax`, as well as a few media queries. I also used Flexbox wherever I found it more convenient than grids (e.g., wherever the number or width of column tracks wasn't too relevant, ~or whenever I wanted to vertically center div content~ Edit: I learned that you can also do this with CSS grid if you use `align-self` and `justify-self`; those work for both Flexbox and CSS grid and are part of the CSS Box Module Level 3). All of my testing was done using Google Chrome's built-in dev tools.

![](https://user-images.githubusercontent.com/19352442/60965960-2c8a9180-a2e5-11e9-900f-52ae77934e20.png)

<p align="center"><i>Example: responsive CSS grid layout used for project gallery</i></p>

### Colors and Themes
I didn't really have any strategy in place for color choices; I mainly picked whatever looked good to me and tweaked things as I went along. Light mode is nice and neutral. For dark mode, I wanted to go for a "coffee"-type theme. I added both an auto and a manual transition via a switch on the navbar to allow users to pick whichever theme they prefer. Again, that's obviously not too important for a portfolio site, but it was still something I wanted to try.

![](https://user-images.githubusercontent.com/19352442/60931926-8f4e3f80-a289-11e9-889f-aea7521bec73.png)

<p align="center"><i>Dark mode theme, for those whose hiring efforts extend into the night :)</i></p>

### Contact
I decided I'd also include a form on my site to make it easier for people to reach out, even though the primary CTA buttons direct visitors to my LinkedIn and GitHub. I used [Formspree](https://github.com/formspree/formspree) for this, and it works great. One downside is that your email is publicly exposed in your HTML; to address this, I used a [hidden honeypot field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) and a throwaway/dedicated email address.

### To hardcode or not to hardcode?
Originally, the Projects section of my site consisted of entirely hardcoded HTML for every single project. As you can imagine, this was useful for figuring out the CSS grid side of things and building them from the ground up. However, once I added the labels for the stargazer count, I realized that this approach was terribly inflexible in terms of growth. If my repos continued getting stars, I'd have to manually update every single project by hand, and that would be tedious.

I had never worked with APIs before, so this was entirely a learning process for me. I looked into the GitHub API on user repositories and learned about AJAX. Turns out it's simpler than it seems! I created a bunch of granular routines in my JavaScript to assemble all the pieces for a project card. Now, they all load dynamically and pull data from my repositories. So if my stargazer counts ever get updated or I change a repo's description, those changes will be reflected on my website.

![](https://user-images.githubusercontent.com/19352442/60967104-da973b00-a2e7-11e9-8a3d-7ca5ee606eb6.png)

I did hardcode a few things, but this approach is still a lot more flexible than the original:

1) The name of each repo, as displayed on the card. Some names (like this site's) are too long to fit on a card.
2) The icon for each repo. I could've made these part of the description and extracted them out with substrings, but that's hacky.
3) The topics for each repo. The GitHub API does provide these dynamically for each repo on your user account, but they get sorted for some reason instead of having their original order preserved (I submitted a ticket, and GitHub support confirmed).

All of this info is stored in a map of custom repos that I want to show on the page. The key for a repo is its official name as it appears on GitHub. The other information is stored as a JavaScript object. That way, I can quickly pull up a repo's information at runtime once I have its name without using messy, tightly coupled logic to determine which repo I'm "looking" at (e.g., with a bunch of `if` statements).

Note: One downside to this dynamic approach is that the GitHub API imposes a limit of 60 requests/hr for unauthenticated IPs. However, I can't imagine why anyone would need to refresh the page so many times.

### Cleanup: Replacing jQuery where it wasn't needed
At first, as a complete JavaScript noob, I was afraid to get my feet wet with the actual DOM itself and instead relied on jQuery for pretty much everything. This did make my code mostly readable, since jQuery is at a higher level of abstraction for the most part, but there were two problems with this:

1) I was using a technology I understood only superficially in places where it wasn't actually *needed*.
2) I wasn't actually learning proper JavaScript!

Later, once I figured out how to work with the GitHub API (which forced me to work with the DOM itself when constructing the project cards), I refactored the rest of my code to limit jQuery use to only the functionalities that absolutely required it. In this case, the only function that uses jQuery is for smooth scroll animations, something that is not currently supported in all major browsers via pure CSS, and something that would've been far too complex (and messy) to code up in pure JavaScript.

![](https://user-images.githubusercontent.com/19352442/61002666-06d6aa00-a330-11e9-80f0-a09c6661ebbb.png)

<p align="center"><i>The best alternative, <code>scroll-behavior: smooth</code>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior">is not supported in all browsers.</a></i></p>

The benefit of this refactoring was twofold:

1) I learned a lot more about JavaScript and got more comfortable with the DOM API.
2) In case the jQuery CDN goes down someday, for whatever reason, or there's some sort of problem on the user's end, the only functionality that will be affected is smooth scrolling, which is just an enhancement and not a core feature of the site.

## What Did I Learn?

1. Don't even bother styling anything until you have your content. You'll overwhelm yourself and fall down a rabbit hole. First get the content on the page, no matter how horrendous it looks. Then clean it up, add semantic elements or divs as needed, and style with CSS.

2. CSS Grid is awesome :) I've yet to master everything it has to offer, but from what I saw personally, it has immense potential. It's quite possibly the future of layout design.

3. Mockups are indispensable. I used [MockFlow](https://www.mockflow.com/) to throw together a very rough representation of what I wanted my site to look like. Though I did ultimately change quite a lot of things, the mockup stage helped me focus on what content I wanted to have on my page—and that tied in to #1. Here's what it looked like:

![](https://user-images.githubusercontent.com/19352442/59712852-0ab55780-91dc-11e9-833f-b7b660491608.png)

As you can see, I ended up ditching most of my old ideas and copy. But at least I had a foundation to work with!

4. Just when you think you're done making your site look good, you're not. In a way, you have to be your worst critic if you want a good result. For example, there were some things I didn't like about my site in the early stages of development—empty space that wasn't getting used efficiently on the page, or the rather bland skills section that was just plain text and was clearly missing some pizzazz (thank you, [Pascal van Gemert](http://www.pascalvangemert.nl/), for inspiring me). I was initially reluctant to address any of these problems because I was afraid I'd mess up my site, but quite the opposite—I made it better! Ultimately, I think my fear stemmed from inexperience with CSS, HTML, or both. Over time, it was replaced with confidence. I am by no means done learning HTML and CSS, but I'm *far* more competent than when I first got started.

![](https://user-images.githubusercontent.com/19352442/59555102-8369a900-8f7b-11e9-9806-4102d56424be.png)

<p align="center"><i>Back when the portfolio cards were not actually... cards</i></p>

![](https://user-images.githubusercontent.com/19352442/59555081-4e5d5680-8f7b-11e9-8445-0a5079f20212.png)

<p align="center"><i>The old skills section—so much wasted space!</i></p>

5. ~~JavaScript is cool, but also apparently expensive when overused. I think I'd like Typescript much more; aside from Python, there are few dynamically typed languages that I like working with. Coming from a C++ background, I prefer static typing because it makes your code much easier to read, and it enforces a strict contract with the compiler. In my opinion, dynamic typing is just fine for small scripts; it's when your code base grows that it becomes a nightmare to maintain. Again, for this project, that wasn't really a problem.~~ Blah, blah, blah. TL;DR: JavaScript is awesome so long as you don't abuse it :)

## That's About It!

Thanks for visiting my site! If you have any suggestions for improving it, I'd love to hear your thoughts :)
