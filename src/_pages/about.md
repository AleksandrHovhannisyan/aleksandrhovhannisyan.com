---
title: About
description: A look at my background and interests.
permalink: /about/
layout: about
---

{% include "image.html" src: 'src/assets/images/profile-photo.jpg', alt: '', isLinked: false, className: "float right", imgClassName: "circle", isLazy: false %}

Thanks for dropping by! My name's Aleksandr—and yes, that's spelled *without* an `e` between the `d` and the `r`, pronounced just like *Alexander*. Don't worry about my last name, though; it's quite long, and most people butcher it anyway.

Speaking of last names, if mine hasn't already [betrayed me](http://www.armeniapedia.org/wiki/Armenian_Last_Names), I was originally born in Armenia, a beautiful country nestled between Europe, Asia, and a bunch of biblically old mountains. You can almost spot it on a world map if you squint hard enough.

Long story short, I moved to the U.S. when I was little and have lived in the states for most of my life. I currently reside in Florida, home to plenty of friendly gators, lovebugs whose carcasses will eat away at your car's paint, and the infamous Florida Man.

## Work Experience

I currently work as a front-end developer on the [StoryMaps](https://storymaps.arcgis.com/) team at Esri, where I create new user-facing features, improve core parts of the app, write documentation, and share new things I'm learning with the team. I thrive in collaborative environments that encourage growth, offer varied learning opportunities, and cultivate my problem-solving skills and creative strengths.

During my undergraduate studies, I worked as a [freelance copy editor](https://www.upwork.com/freelancers/~014eb3a95d4d1fd855?s=1110580753635725312) for four years, with my clients ranging from digital marketing agencies to small business owners and companies. This experience helped me to grow my professional network, hone my communication skills, and earn a bit of money on the side while in school.

I won't bore you too much with my work history; that's what [my LinkedIn]({{ socials.linkedin.url }}) is for.

## Software Projects

I have experience with a few different stacks—I've done a bit of desktop, mobile, and game development, either on my own time or for class projects. Nowadays, I like to focus on web technologies and front-end development. Below are a few of the projects that I'm proud of.

<ul class="col-wrap align-center">
  {%- for project in projects -%}
    <li class="project-wrapper">
      {%- include "projectCard.html" project: project -%}
    </li>
  {%- endfor -%}
  <li class="github-cta stack flex-center gap-0 text-center">
    <div>
      <h3 class="fs-base">Want to see more of my work?</h3>
      <p>Check out my other repos:</p>
    </div>
    <a
      class="flex"
      aria-label="Aleksandr Hovhannisyan's GitHub profile."
      href="https://github.com/AleksandrHovhannisyan?tab=repositories"
      >{%- socialIcon "github" -%}</a>
  </li>
</ul>

## Hobbies and Interests

Outside of work, I try to strike a balance between tinkering with tech and having fun. I enjoy learning new things and [writing on my blog](/blog/), where I publish dev tutorials and various musings and [essays](/tags/essay/). My passion for writing motivated me to create this website—my own little corner on the web where I'm free to practice my design skills to my heart's content. It also connected me with many other amazing folks who share similar interests.

When I'm not writing, you'll find me [praising till I'm hollow](https://www.youtube.com/watch?v=mp28JPs25ek). I'm a die-hard [Soulsborne](https://en.wikipedia.org/wiki/Souls_(series)) fan—I love the challenging gameplay, intricate lore, jolly co-operation, and community inside jokes that the series is so well known for. But I also enjoy playing other video games in my free time: shooters, RPGs, roguelikes, card games, platformers, and any odd combination of these genres. I was practically raised by a generation of browser Flash games (may they [rest in peace](/blog/rest-in-peace-flash/)) and an unhealthy amount of (Old School) Runescape, and these experiences with video games have shaped my interests and personality to this day. Some games have left such a lasting impression on me that [I've written about them](/tags/gaming/).

I also enjoy listening to music, especially albums that tell a cohesive story from end to end (with or without lyrics). These days, I mainly listen to rock (classic/alt/post), certain genres of metal, and a bit of indie, but I also try to keep an open mind in case I find something new that I like. Some of my favorite artists include Radiohead, Arctic Monkeys, Godspeed You! Black Emperor, Steven Wilson, and similar bands in these genres.

At one point, I was obsessed with drawing (and pretty good at it, too!). But with time, I found myself preoccupied with so many other things that I simply couldn't find the time to draw. Now, my interest in art has resurfaced in the colorful world of front-end development—I love bringing designs to life and working with typography and spacing. Occasionally, I'll also create [CSS art](/art/) as a substitute for the real thing, either as a challenge or for fun.

I also like to sprinkle in some other activities to keep things fresh now and then. I might [play chess with friends and strangers](https://www.chess.com/member/aleksandrhovhannisyan) or do some light reading if I'm up for it.

## So, Yeah... That's Me!

Anyways, this is probably a good place to stop. There's more to my life than what I feel comfortable sharing here, but that's about the gist of my background and interests. If you made it this far, cool! You're still awake! Maybe we can chat sometime and get to know each other.

At the end of the day, I'm just a [Real Human Bean](https://www.youtube.com/watch?v=-DSVDcw6iW8) who enjoys doing real human things. If that sounds like your cup of tea, get in touch—I'd love to hear from you!
