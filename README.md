# My Personal Website

**Update**: What originally began as a single-page site built purely with HTML5, CSS, and JavaScript has now moved over to Jekyll for blogging purposes and maintainability. While it was a great learning experience and a fun way to get my hands dirty, building the site with HTML and CSS was clearly not going to be maintainable for the long run. For one, navigating one massive stylesheet was a pain, and I often found myself unavoidably violating DRY best practices. Second, much of my HTML involved copy-pasting, especially the skills section. Each time I wanted to add a new skill, I had to copy-paste an entire div, deal with [VS Code's indentation formatting errors](https://github.com/microsoft/vscode/issues/32320#issuecomment-513562073), and then manually fill in the information. With SASS, Jekyll's site data (represented as YAML), and the wonderful Liquid templating language, I can more easily update the content without having to copy-paste chunks of HTML.

This is just a little single-page site I threw together to share some of my work, skills, education, etc.

## Why Build Everything from Scratch?

I mainly built this site as a way to practice (and showcase) my HTML and CSS abilities, so it simply made sense to build everything from the ground up without relying on frameworks to do things for me.

I had previously tried my hand at creating a personal website using Bootstrap so I wouldn't have to worry about managing responsiveness myself. I must admit that I did not particularly enjoy working with Bootstrap—at least in the way it's traditionally taught, with a fatal case of *divitis* left and right. My biggest problem was with maintaining legibility and organization; Bootstrap makes HTML difficult to read and [butchers semantic markup](https://coderwall.com/p/wixovg/bootstrap-without-all-the-debt). It also has limited support for 2D layouts. And finally, it slows down your page load speed because of the extra Bootstrap CSS that has to be loaded (though that isn't a major consideration for most portfolio sites).

(Note: Bootstrap is definitely a good choice for startups and rapid prototyping, especially when you're low on budget, time, or both. I just despise its responsive column syntax and the boatload of classes you have to juggle in your head. It gets messy very quickly. Messy markup is harder to maintain.)

When I later discovered [Scrimba's CSS Grid tutorial series](https://scrimba.com/g/gR8PTE), I figured I'd jump back in and give this web dev thing another try. And this time, I genuinely enjoyed it because it felt like progressive enhancement for once: first building the content and then styling it to my heart's content. CSS Grid makes it possible to create powerful and flexible layouts without cluttered markup. No need to stuff a billion specialized classes into a forest of divs :)

Per Harald Borgen, co-founder of Scrimba, has a great article on [why CSS grid is better than Bootstrap for creating layouts](https://hackernoon.com/how-css-grid-beats-bootstrap-85d5881cf163).

## Design Considerations

### Responsiveness
I built my site with a mobile-first strategy, targeting a minimum device width of 320 px and working my way up to larger screens using CSS Grid's `repeat`, `auto-fit`, and `minmax`, as well as a few media queries. I also used Flexbox wherever I found it more convenient than grids (e.g., wherever the number or width of column tracks wasn't too relevant, ~or whenever I wanted to vertically center div content~ Edit: I learned that you can also do this with CSS grid if you use `align-self` and `justify-self`; those work for both Flexbox and CSS grid and are part of the CSS Box Module Level 3). All of my testing was done using Google Chrome's (and later Firefox's and MS Edge's) built-in dev tools.

![](https://user-images.githubusercontent.com/19352442/60965960-2c8a9180-a2e5-11e9-900f-52ae77934e20.png)

<p align="center"><i>Example: responsive CSS grid layout used for project gallery</i></p>

### Colors and Themes
I didn't really have a "strategy" in place for color choices besides pure experimentation. I mainly picked whatever looked good to me and tweaked things multiple times as I went along. Light mode is nice and neutral. For dark mode, I wanted to go for a "coffee"-type theme. I added both an auto and a manual transition via a switch on the navbar to allow users to pick whichever theme they prefer. Again, that's obviously not too important for a portfolio site, but it was still something I wanted to try.

![](https://user-images.githubusercontent.com/19352442/61949854-20a3fe00-af7a-11e9-8609-10920f6f6eb8.png)

<p align="center"><i>Dark mode theme, for those whose hiring efforts extend into the night :)</i></p>

### Contact
I decided I'd also include a form on my site to make it easier for people to reach out, even though the primary call-to-action buttons already direct visitors to my LinkedIn and GitHub. I used [Formspree](https://github.com/formspree/formspree) for this, and it works perfectly. One downside is that your email is publicly exposed in your HTML, making it possible for spammers to ruin your day. To get around this, I used a [hidden honeypot field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) and a throwaway email address that I monitor occasionally.

### To hardcode or not to hardcode?
Originally, the Projects section of my site consisted entirely of hardcoded HTML for every single project. As you can imagine, this was useful for figuring out the layout and style of the project cards and styling them because I could directly edit the HTML and CSS without worrying about dynamically rendering the content. However, once I added the labels for the stargazer count to the cards, I realized that this approach was too inflexible. If my repos continued getting stars, for example, then I'd have to manually update every single project by hand, and that would be tedious.

I had never worked with APIs before, so this was a learning process for me. I looked into the [GitHub API on user repositories](https://developer.github.com/v3/repos/#list-user-repositories) and [learned about AJAX](https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/). It turns out that making API requests in JavaScript is actually quite simple.

I began with the basics&mdash;using `curl` to examine the contents of the JSON returned by the API for my user account&mdash;and then created several granular routines in my JavaScript to assemble all the pieces for a project card. (Note: This is actually a great place to use React components.) In the current version of the website, all of the repo data is load dynamically from my repositories. So, if my stargazer counts ever get updated or I change a repo's description, those changes will be reflected on my website.

![](https://user-images.githubusercontent.com/19352442/60967104-da973b00-a2e7-11e9-8a3d-7ca5ee606eb6.png)

I did hardcode a few things:

1) The name of each repo, as displayed on the card. Some names (like this site's) are too long to fit on a card.
2) The icon for each repo. I could've made these part of each repo's description on GitHub and extracted them out using substrings, but that's hacky.
3) The topics for each repo. The GitHub API does provide these dynamically for each repo, but they get sorted for some reason instead of having their original order preserved (I submitted a ticket, and GitHub support confirmed).

All of this info is stored in a `Map` of custom repos that I want to show on the page. The key for a repo is its "official" name as it appears on GitHub. The corresponding value is a JavaScript object storing the above "custom" information. That way, I can quickly pull up a repo's details (e.g., its icon or topics) at runtime once I have its name. The less-than-ideal alternative would've been to use messy, tightly coupled logic to determine which repo I'm currently "looking" at (e.g., with a bunch of `if` statements).

Note: One downside to my dynamic approach is that the GitHub API imposes a limit of 60 requests/hr for unauthenticated IPs (and I can't authenticate my site's requests because the source code, the script included, is public here on GitHub). However, I can't imagine why anyone would need to refresh the page so many times, so this is a minor consideration.

### Cleanup: Replacing jQuery where it wasn't needed
At first, as a complete JavaScript beginner, I was afraid to get my feet wet with the actual DOM itself and instead relied on jQuery for pretty much everything. This did make my code mostly readable, since jQuery is at a higher level of abstraction than pure JavaScript, but there were two problems with this:

1) I was using a technology I understood only superficially in places where it wasn't actually *needed*.
2) I wasn't actually learning proper JavaScript, which was one of my goals for this project.

As mentioned above, working with the GitHub API forced me to use the DOM to construct project cards. This allowed me to get more comfortable with JavaScript. With that experience, I then refactored the rest of my code to limit jQuery use to only the functionalities that absolutely required it. Currently, the only function that uses jQuery is for smooth scroll animations, something that is not currently supported in all major browsers via pure CSS, and something that would've been far too complex (and messy) to code up in pure JavaScript.

![](https://user-images.githubusercontent.com/19352442/61002666-06d6aa00-a330-11e9-80f0-a09c6661ebbb.png)

<p align="center"><i>The best alternative, <code>scroll-behavior: smooth</code>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior">is not supported in all browsers.</a></i></p>

The benefit of this refactoring was twofold:

1) I learned a *lot* more about JavaScript and got comfortable with using the DOM API to create and manipulate elements.
2) In case the jQuery CDN goes down someday, for whatever reason, or there's some sort of problem on the user's end, the only functionality that will be affected is smooth scrolling, which is just an enhancement and not a core feature of the site.

## What Did I Learn?

1. Don't even bother styling anything until you have your content. You'll overwhelm yourself and fall down a rabbit hole. This is exactly what happened in a very early prototype of my website&mdash;I hated it so much that I became discouraged and quit. I didn't know what I was doing half the time with CSS. I learned the importance of first getting my content on the page, no matter how horrendous it looks. Then comes the cleanup and styling.

2. CSS Grid is awesome! It's powerful for building layouts because unlike Flexbox, it's a 2D system, allowing you to work with rows and columns at the same time (whereas Flexbox is unidirectional: rows or columns, but not both). This makes it possible to create very flexible layouts like the ones I used for my project cards and the skills section.

3. Mockups are indispensable. I used [MockFlow](https://www.mockflow.com/) to throw together a very rough representation of what I wanted my site to look like. Though I did ultimately change quite a lot of things, the mockup stage helped me focus on what content I wanted to have on my page—and that tied in to #1. Here's what it looked like:

![](https://user-images.githubusercontent.com/19352442/59712852-0ab55780-91dc-11e9-833f-b7b660491608.png)

As you can see, I ended up ditching most of my old ideas and copy. But at least I had a foundation to work with!

4. The work never ends&mdash;just when you think you're done making your site look good, you realize that there's something missing. Several times throughout the development of this site, I noticed problems that I was reluctant to fix: empty space that wasn't getting used efficiently on the page, project cards that looked strange, or the rather bland skills section that was just plain text and was clearly missing some pizzazz (thank you, [Pascal van Gemert](http://www.pascalvangemert.nl/), for inspiring me). I was afraid I'd mess up my site, but quite the opposite—I've made it much better. I think my fear stemmed from inexperience with CSS, HTML, or both. Over time, it was replaced with confidence as I became more comfortable with styling. I am by no means done learning HTML and CSS, but I'm *far* more competent with these technologies than when I first got started.

![](https://user-images.githubusercontent.com/19352442/59555102-8369a900-8f7b-11e9-9806-4102d56424be.png)

<p align="center"><i>Back when the portfolio cards were not actually cards</i></p>

![](https://user-images.githubusercontent.com/19352442/59555081-4e5d5680-8f7b-11e9-8445-0a5079f20212.png)

<p align="center"><i>The old skills section—so much wasted space!</i></p>

## Inspiration: Resume Sites and Articles I Love

- [https://www.taniarascia.com](https://www.taniarascia.com/): From her color choices to the content layout, Tania clearly has an expert eye for front-end design. I came across her site when I was researching how to make API requests in JavaScript. [Her article on the subject](https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/) was invaluable.

- [http://www.pascalvangemert.nl/](http://www.pascalvangemert.nl/): Pascal's interactive resume is original and really well organized. I was inspired to emulate his skills section on my own site using CSS grid. It took a bit of work, but I finally got it. This was a perfect exercise for bringing a design to life with markup and styling. The best part is that I was forced to create it from scratch because his version uses Bootstrap.

- [https://www.kooslooijesteijn.net/blog/dark-mode-design-considerations](https://www.kooslooijesteijn.net/blog/dark-mode-design-considerations): This article was really helpful when I was deciding on a dark mode theme. I also actually liked the color choices used on the website itself. I recently decided to use something similar on my own site&mdash;a "coffee" theme for dark mode. VS Code's color picker was super helpful in this process.

## That's About It!

Thanks for visiting my site! If you have any suggestions for improving it, I'd love to hear your thoughts :)
