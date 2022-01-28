---
title: About
description: A look at my background and interests.
permalink: /about/
layout: about
---



{% include image.html src: '/assets/images/profile-photo.jpg', alt: '', clickable: false, className: "float right", imgClass: "circle", lazy: false %}

Thanks for dropping by! My name's Aleksandr—and yes, that's spelled *without* an `e` between the `d` and the `r`, pronounced just like *Alexander*. Don't worry about my last name, though; it's quite long, and most people butcher it anyway.

Speaking of last names, if mine hasn't already [betrayed me](http://www.armeniapedia.org/wiki/Armenian_Last_Names), I was originally born in Armenia, a beautiful country nestled between Europe, Asia, and [a bunch of biblically old mountains](https://en.wikipedia.org/wiki/Mount_Ararat). You can almost spot it on a world map if you squint hard enough.

Long story short, I moved to the U.S. when I was little and have lived in the states for most of my life. I currently reside in Gainesville, Florida, where you'll find plenty of friendly gators, lovebugs whose carcasses will eat away at your car's paint, the infamous Florida Man, and, of course, the University of Florida.

## Work Experience

I work as a front-end developer and enjoy creating responsive and accessible user experiences on the web. While I've done a bit of back-end work on past projects, I thrive in roles that play to my creative strengths and attention to detail. At work, you'll find me creating new user-facing features, improving core parts of our app, squashing bugs, tackling tech debt, learning new things, and getting to know my co-workers.

On the side, I've also worked as a [freelance copy editor](https://www.upwork.com/freelancers/~014eb3a95d4d1fd855?s=1110580753635725312) for over four years now, with my clients ranging from digital marketing agencies to small business owners and companies. I've found freelancing to be a great way to market myself and grow my network, all while supplementing my income and honing my communication and SEO skills.

I won't bore you too much with my work history; that's what [my LinkedIn]({{ socials.linkedin.url }}) is for.

## Software Projects

I have experience with a few different stacks—I've done a bit of desktop, mobile, and game development, either on my own time or for class projects. Nowadays, I like to focus on web technologies because I enjoy working on projects that have a strong UI/UX component. Below are a few of the projects that I'm proud of.

<ul class="flex-wrap">
  {%- for project in projects -%}
    <li class="project-wrapper">
      {%- include projectCard.html project: project -%}
    </li>
  {%- endfor -%}
  <li class="project-wrapper github-cta">
    <h3 class="github-cta-heading fs-base">Want to see more of my work?</h3>
    <p class="github-cta-subheading">Check out my other repos:</p>
    <a
      aria-label="Aleksandr Hovhannisyan's GitHub profile."
      href="https://github.com/AleksandrHovhannisyan?tab=repositories"
      >{%- socialIcon "github" -%}</a>
  </li>
</ul>

## Hobbies and Interests

Outside of work, I try to strike a balance between tinkering with tech and having fun. I mainly work on my site and [write on my blog](/blog/), where I publish tutorials and musings about technology and whatever else comes to my mind. Blogging has been a great way for me to learn new things and share them with others, and it's also allowed me to connect with other developers, optimize my site's performance and user experience, and create my own little corner on the internet where I'm free to practice my design skills and write to my heart's content.

When I'm not writing on my blog, you'll find me [praising till I'm hollow](https://www.youtube.com/watch?v=mp28JPs25ek). I'm a die-hard [Soulsborne](https://en.wikipedia.org/wiki/Souls_(series)) fan and love playing video games in my free time—shooters, RPGs, roguelikes, card games, platformers, and any odd combination of these genres. But I *especially* love sword-and-board and medieval warfare games. As a kid, I was practically raised by a generation of browser Flash games (may they [rest in peace](/blog/rest-in-peace-flash/)) and an unhealthy amount of (Old School) Runescape, and these experiences with video games have shaped my interests and personality to this day.

Gaming is just one of the many ways I like to spend my free time. I also enjoy listening to music! I especially like the genres of classic rock, alt and post rock, and indie, but I like to keep an open mind and listen to whatever I stumble upon now and then. Some of my favorite artists and bands include:

- Lana Del Rey
- Arctic Monkeys
- Radiohead
- Godspeed You! Black Emperor
- Steven Wilson/Porcupine Tree
- The Black Keys
- Gregory Alan Isakov
- Pink Floyd

When I was young, I was absolutely obsessed with drawing (and pretty good at it, too!). As I grew older, though, I found myself preoccupied with so many other things that I simply couldn't find the time to draw. These days, my interest in art has resurfaced in the exciting world of front-end development—I love working with colors, fonts, spacing, and all those good things. I've also recently taken an interest in creating [CSS art](/art/) in my free time to challenge myself, learn new CSS tricks, have fun, and make pretty things.

I also like to sprinkle in some other activities to keep things fresh now and then. I might [play chess with friends and strangers](https://www.chess.com/member/aleksandrhovhannisyan) or do some light reading if I'm up for it.

## So, Yeah... That's Me!

Anyway, this is probably a good place to stop. There's more to my life than what I feel comfortable sharing here, but that's about the gist of my background and interests. If you made it this far, cool! You're still awake! Maybe we can chat sometime and get to know each other.

At the end of the day, I'm just a [Real Human Bean](https://www.youtube.com/watch?v=-DSVDcw6iW8) who enjoys doing real human things. If that sounds like your cup of tea, get in touch—I'd love to hear from you!
