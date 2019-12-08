# aleksandrhovhannisyan.github.io

> My little corner of the interwebs.

Welcome to my site! 👋

What originally began as a single-page portfolio built with HTML5, CSS, and JavaScript was eventually moved to Jekyll for blogging purposes and maintainability. While building things with vanilla HTML and CSS was a great learning experience and a fun way to get my hands dirty, it was definitely not going to be maintainable in the long run.

## Design Considerations 🎨

### Responsiveness and Optimization
I built my site with a mobile-first strategy, targeting a minimum device width of 320 px and working my way up to larger screens using CSS Grid's `repeat`, `auto-fit`, and `minmax` for responsive grids as well as a few media queries. I also used Flexbox wherever it was more appropriate (e.g., wherever the number or width of column tracks wasn't too relevant). All of my testing was done using Google Chrome's (and later Firefox's and MS Edge's) built-in dev tools.

![](https://user-images.githubusercontent.com/19352442/70391780-eb3b0280-19a6-11ea-8ec8-63885d7aa645.png)

<p align="center"><i>Example: responsive CSS grid layout used for project gallery</i></p>

As the site grew—particularly when I moved over to Jekyll and began publishing blog posts—I began consulting tools like [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) and [Cloudinary's Website Speed Test](https://webspeedtest.cloudinary.com) to get a sense of how quickly my site would load, especially on mobile.

I used Google's `cwebp` tool to optimize my images, and that alone significantly boosted my load speed for posts with lots of images. According to PageSpeed Insights, with the exception of one of my blog posts (which has iframes for songs), all others are now ranking at least 90 for mobile, with most at 99.

Here's an example of a post that has lots of images:

![](https://user-images.githubusercontent.com/19352442/64079851-12ed4100-ccbb-11e9-9e8e-1b38962766d3.png)

#### Goodbye, Font Awesome—Hello, SVGs

Font Awesome is awesome until it isn't.

At one point, I noticed that my Contact page was especially slow to load the icons for my social media accounts, which wasn't too nice to look at—they'd be invisible for one or two seconds and then suddenly pop up out of nowhere! The Experience page would also occasionally take a few seconds for all the stars to load, and the blog posts were equally slow to load their icons. Even my front page was slow for the button icons!

I decided to begin using inline SVGs instead. The only downside to these is that they can't be cached, but all I care about is my user's first visit—after all, GitHub's caching policy is already [limited to just 10 minutes](https://webapps.stackexchange.com/a/119294), so there's very little to be gained from it.

In some cases, I had to create SVGs in JavaScript. Just trust me when I say it'll probably make your eyes bleed. Maybe some day I'll move over to Gatsby and begin taking advantage of React so I don't have to keep creating "components" the old-school way.

#### SVG Credits

Social media icons were obtained from [simpleicons.org](https://simpleicons.org).

All other SVG icons were obtained as inlines from encharm's [Font-Awesome-SVG-PNG repo](https://github.com/encharm/Font-Awesome-SVG-PNG/tree/master/black/svg) (MIT license).

### Colors and Themes

I've spent a lot of time (I'd say probably more than 10 hours in total) tweaking my site's light and dark mode themes. Currently, light mode is nice and neutral, with the primary color being a shade of navy blue. For dark mode, I wanted to use a "coffee"-type theme. I added both an auto and a manual transition via a switch on the navbar to allow users to pick whichever theme they prefer. Again, that's obviously not too important for a portfolio site, but it was still something I wanted to try.

![](https://user-images.githubusercontent.com/19352442/70391801-16bded00-19a7-11ea-92fc-a141a9e7faa2.png)

<p align="center"><i>Dark mode theme, for those whose hiring efforts extend into the night :)</i></p>

### Contact
I decided I'd also include a form on my site to make it easier for people to reach out, even though the primary call-to-action buttons already direct visitors to my LinkedIn and GitHub. I used [Formspree](https://github.com/formspree/formspree) for this, and it works perfectly. One downside is that your email is publicly exposed in your HTML, making it possible for spammers to ruin your day. To get around this, I used a [hidden honeypot field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) and a throwaway email address that I monitor occasionally.

### To Hardcode or Not to Hardcode?
Originally, the Projects section of my site consisted entirely of hardcoded HTML for every single project card. This was certainly useful for nailing down the layout of the cards and styling them because I could directly edit the HTML and CSS without worrying about dynamically rendering the content. However, once I added stargazer counts to the projects, I realized that this approach was too inflexible. If my repos were to continue receiving stars, for example, then I'd have to manually update every single project by hand, and that would be tedious.

I had never worked with APIs before, so this was a learning process for me. I looked into the [GitHub API on user repositories](https://developer.github.com/v3/repos/#list-user-repositories) and [learned about AJAX](https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/). It turns out that making API requests in JavaScript is actually really simple.

I began with the basics&mdash;using `curl`, and later Insomnia, to examine the contents of the JSON returned by the API for my user account&mdash;and then created several granular routines in my JavaScript to assemble all the pieces for a project card. (Note: This is actually a great place to use React components.)

In the current version of the website, all of the repo data is load dynamically from my repositories. That way, most changes on GitHub are reflected immediately.

![](https://user-images.githubusercontent.com/19352442/60967104-da973b00-a2e7-11e9-8a3d-7ca5ee606eb6.png)

> Note: One downside to my dynamic approach is that the GitHub API imposes a limit of 60 requests/hr for unauthenticated IPs (and I can't authenticate my site's requests because the source code, the script included, is public here on GitHub). However, I can't imagine why anyone would need to refresh the page so many times, so this is a minor consideration.

### Cleanup: Replacing jQuery where it wasn't needed
At first, as a complete JavaScript beginner, I was afraid to get my feet wet with the actual DOM API itself and instead relied on jQuery for pretty much everything. This did make my code mostly readable, since jQuery introduces lots of helpful wrappers around vanilla JS, but there were two problems with this:

1. I was using a technology I understood only superficially in places where it wasn't actually *needed*.

2. I wasn't actually learning proper JavaScript, which was one of my goals for this project.

As mentioned above, working with the GitHub API forced me to use the DOM to construct project cards. This allowed me to get more comfortable with JavaScript. With that experience, I then refactored the rest of my code to limit jQuery use to only the functionalities that absolutely required it. Currently, the only function that uses jQuery is for smooth scroll animations, something that is not currently supported in all major browsers via pure CSS, and something that would've been far too complex (and messy) to code up in pure JavaScript.

![](https://user-images.githubusercontent.com/19352442/61002666-06d6aa00-a330-11e9-80f0-a09c6661ebbb.png)

<p align="center"><i>The best alternative, <code>scroll-behavior: smooth</code>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior">is not supported in all browsers.</a></i></p>

The benefit of this refactoring was twofold:

1. I learned a *lot* more about JavaScript and got comfortable with using the DOM API to create and manipulate elements.

2. In case the jQuery CDN goes down someday, for whatever reason, or there's some sort of problem on the user's end, the only functionality that will be affected is smooth scrolling, which is just an enhancement and not a core feature of the site.

## What Did I Learn? 💭

1. Don't even bother styling anything until you have your content. You'll overwhelm yourself and fall down a rabbit hole. This is exactly what happened in a very early prototype of my website&mdash;I hated it so much that I became discouraged and quit. I didn't know what I was doing half the time with CSS. I learned the importance of first getting my content on the page, no matter how horrendous it looks. Then comes the cleanup and styling.

2. CSS Grid is awesome! It's powerful for building layouts because unlike Flexbox, it's a 2D system, allowing you to work with rows and columns at the same time (whereas Flexbox is unidirectional: rows or columns, but not both). This makes it possible to create very flexible layouts like the ones I used for my project cards and the skills section.

3. Mockups are indispensable. I used [MockFlow](https://www.mockflow.com/) to throw together a very rough representation of what I wanted my site to look like. Though I did ultimately change quite a lot of things, the mockup stage helped me focus on what content I wanted to have on my page—and that tied in to #1. Here's what it looked like:

![](https://user-images.githubusercontent.com/19352442/59712852-0ab55780-91dc-11e9-833f-b7b660491608.png)

As you can see, I ended up ditching 99% of my old ideas and copy. But at least I had a foundation to work with!

4. The work never ends&mdash;just when you think you're done making your site look good, you realize that there's something missing. Several times throughout the development of this site, I noticed problems that I was reluctant to fix: empty space that wasn't getting used efficiently on the page, project cards that looked strange, or the rather bland skills section that was just plain text and was clearly missing some pizzazz (thank you, [Pascal van Gemert](http://www.pascalvangemert.nl/), for inspiring me). I was afraid I'd mess up my site, but quite the opposite—I've made it much better. I think my fear stemmed from inexperience with CSS, HTML, or both. Over time, it was replaced with confidence as I became more comfortable with styling. I am by no means done learning HTML and CSS, but I'm *far* more competent with these technologies than when I first got started.

![](https://user-images.githubusercontent.com/19352442/59555102-8369a900-8f7b-11e9-9806-4102d56424be.png)

<p align="center"><i>Back when the portfolio cards were not actually cards 😬</i></p>

![](https://user-images.githubusercontent.com/19352442/59555081-4e5d5680-8f7b-11e9-8445-0a5079f20212.png)

<p align="center"><i>The old skills section—so much wasted space!</i></p>

## Inspiration: Resume Sites and Articles I Love

- [https://www.taniarascia.com](https://www.taniarascia.com/): From her color choices to the content layout, Tania clearly has an expert eye for front-end design. I came across her site when I was researching how to make API requests in JavaScript. [Her article on the subject](https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/) was invaluable.

- [http://www.pascalvangemert.nl/](http://www.pascalvangemert.nl/): Pascal's interactive resume is original and really well organized. I was inspired to emulate his skills section on my own site using CSS grid. It took a bit of work, but I finally got it. This was a perfect exercise for bringing a design to life with markup and styling. The best part is that I was forced to create it from scratch because his version uses Bootstrap.

- [https://www.kooslooijesteijn.net/blog/dark-mode-design-considerations](https://www.kooslooijesteijn.net/blog/dark-mode-design-considerations): This article was really helpful when I was deciding on a dark mode theme. I also actually liked the color choices used on the website itself.

## That's About It!

Thanks for visiting my site! If you have any suggestions for improving it, I'd love to hear your thoughts 🙂
