---
title: About
description: My background and interests.
permalink: /about/
layout: about
---

<p>
  {% include "image.html" src: 'src/assets/images/profile-photo.jpg', alt: '', isLinked: false, className: "float right", imgClassName: "circle", isLazy: false %}
</p>

Thanks for dropping by! My name's Aleksandr—and yes, that's spelled *without* an `e` between the `d` and the `r`, pronounced just like *Alexander*. Don't worry about my last name, though; it's quite long, and most people butcher it anyway.

Speaking of last names, if mine hasn't already [betrayed me](http://www.armeniapedia.org/wiki/Armenian_Last_Names), I was originally born in Armenia, a beautiful country nestled between Europe, Asia, and a bunch of biblically old mountains. You can almost spot it on a world map if you squint hard enough.

Long story short, I moved to the U.S. when I was little and have lived in the states for most of my life. I currently reside in Edinburg, Texas.

## Work Experience

I currently work as a front-end developer on the [StoryMaps](https://storymaps.arcgis.com/) team at Esri, where I develop new user-facing features, improve core parts of the app, write documentation, advocate for accessibility, mentor developers, and share new things I'm learning with the team. I thrive in collaborative environments that encourage growth, offer varied learning opportunities, and cultivate my problem-solving skills and creative strengths.

Most of my dev experience is with React, TypeScript, and CSS, but I'm also comfortable working with vanilla stacks and can pick up new languages quickly as needed. Some of my interests include web performance, accessibility, serverless architecture, and security.

During my undergraduate studies, I also worked as a [freelance copy editor](https://www.upwork.com/freelancers/~014eb3a95d4d1fd855?s=1110580753635725312) for about four years; my clients ranged from digital marketing agencies to small business owners and companies. Freelancing was a great experience that taught me how to stand out in a competitive market, and it also helped me to grow my professional network and earn a bit of money on the side while in school.

I won't bore you too much with my work history; that's what [my LinkedIn]({{ socials.linkedin.url }}) is for.

## Software Projects

I have experience with a few different stacks—I've done a bit of desktop, mobile, and game development, either on my own time or for class projects. I've also published a few [npm packages](https://www.npmjs.com/~aleksandrhovhannisyan). Below are select projects that I'm proud of:

<ul class="col-wrap align-center">
  {%- for project in projects -%}
    <li class="project-wrapper">
      {%- include "projectCard.html" project: project -%}
    </li>
  {%- endfor -%}
  <li class="github-cta stack flex-center gap-0 text-center">
    <div>
      <h3 class="fs-base">Want to see more of my work?</h3>
      <p>Explore my GitHub repos:</p>
    </div>
    <a
      class="flex"
      aria-label="View my GitHub profile"
      href="https://github.com/AleksandrHovhannisyan?tab=repositories"
      >{%- socialIcon "github" -%}</a>
  </li>
</ul>

## Hobbies and Interests

Outside of work, I enjoy learning new things and [writing on my blog](/blog/), where I publish software development tutorials and [the occasional essay](/tags/essay/). My passion for writing motivated me to create this website in the first place—it's my own little corner on the web where I'm free to write to my heart's content. I'm also a big believer in learning by teaching, and my blog gives me a place where I can do that.

When I'm not writing, you'll find me [praising till I'm hollow](https://www.youtube.com/watch?v=mp28JPs25ek). I'm a die-hard [Soulsborne](https://en.wikipedia.org/wiki/Souls_(series)) fan—I love the challenging gameplay, intricate lore, jolly co-operation, and community inside jokes that the series is so well known for. But I also like other video games: shooters, RPGs, roguelikes, card games, platformers, you name it. I was practically raised by a generation of browser Flash games—may they [rest in peace](/blog/rest-in-peace-flash/)—and an unhealthy amount of (Old School) Runescape, and these experiences with video games have shaped my interests and personality to this day. Some games have left such a lasting impression on me that [I've written about them](/tags/gaming/).

I also enjoy listening to music—mainly rock, folk, indie, and certain genres of metal. But I like to keep an open mind in case I stumble upon something new that I happen to like. Some of my favorite artists include Lana Del Rey, Radiohead, Arctic Monkeys, GY!BE, and lots of other great bands that I'd list here if I weren't pressed for space.

At one point, I was obsessed with drawing (and pretty good at it, too!). But with time, I found myself preoccupied with so many other things that I simply couldn't find the time to draw. Lately, my interest in art has resurfaced in the colorful world of front-end development—I love working with CSS to bring designs to life on the canvas that is the web. Sometimes, I'll also create [CSS art](/art/) as a substitute for the real thing, either as a challenge or just for fun.

Some of my other hobbies include fitness, going on walks, and reading.

## So, Yeah... That's Me!

There's more to my life than what I feel comfortable sharing here, but that's about the gist of my background and interests. If you made it this far, cool! You're still awake! Maybe we can chat sometime and get to know each other.

At the end of the day, I'm just a [Real Human Bean](https://www.youtube.com/watch?v=-DSVDcw6iW8) who enjoys doing real human things. If that sounds like your cup of tea, get in touch—I'd love to hear from you!
