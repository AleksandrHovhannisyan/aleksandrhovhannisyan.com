---
title: About
description: My background and interests.
permalink: /about/
layout: about
---

<p>
  {% include "image.html" src: 'src/assets/images/profile-photo.jpg', alt: '', isLinked: false, className: "float right", imgClassName: "circle", isLazy: false %}
</p>

<p style="margin: 0">Thanks for dropping by! My name's Aleksandr—and yes, that's spelled <em>without</em> an <code>e</code> between the <code>d</code> and the <code>r</code>, pronounced just like <em>Alexander</em>. Don't worry about my last name, though; it's quite long, and most people butcher it anyway.</p>

Speaking of last names, if mine hasn't already [betrayed me](http://www.armeniapedia.org/wiki/Armenian_Last_Names), I was originally born in Armenia, a beautiful country nestled between Europe, Asia, and a bunch of biblically old mountains. You can almost spot it on a world map if you squint hard enough.

Long story short, I moved to the U.S. when I was little and have lived in the states for most of my life. I currently reside in Edinburg, Texas.

## Work Experience

I've worked as a software engineer on Esri's [StoryMaps](https://storymaps.arcgis.com/) team since 2020. In this role, I've:

- Shipped many high-impact features, including a new text editor, blocks, theming options, topic tagging and publishing options, custom templates, and much more.
- Refactored core parts of the app to resolve longstanding tech debt.
- Written plenty of documentation for both new and old code.
- Served on an internal accessibility working group.
- Mentored developers and paired with co-workers to unblock their work.
- Presented at team workshops to share things I've learned.

I thrive in collaborative environments that encourage growth, offer varied learning opportunities, and cultivate my problem-solving skills and creative strengths.

These days, I mainly work on the web with React, TypeScript, and CSS, but I also have experience with other frameworks like Svelte and more general-purpose programming languages like C++ and Python. Some of my interests in the web development space include typography, performance, and accessibility.

While the majority of my work experience is in software development, I once worked as a [freelance copy editor](https://www.upwork.com/freelancers/~014eb3a95d4d1fd855?s=1110580753635725312) for about four years during my undergraduate studies, with clients ranging from digital marketing agencies to small business owners and companies and even bigger companies like Quora. Freelancing was a great experience that taught me how to stand out in a fiercely competitive market, and it also helped me grow my professional network and earn a bit of money on the side while in school.

I won't bore you too much with my work history, though; that's what [my LinkedIn]({{ socials.linkedin.url }}) is for.

## Software Projects

Below are select projects that I'm proud of:

<ul class="col-wrap align-center">
  {%- for project in projects -%}
    <li class="project-wrapper">
      {%- include "projectCard.html" project: project -%}
    </li>
  {%- endfor -%}
</ul>

You can also:

- [View my repositories on GitHub](https://github.com/AleksandrHovhannisyan?tab=repositories).
- [View my published npm packages](https://www.npmjs.com/~aleksandrhovhannisyan).

## Hobbies and Interests

### Writing

Outside of work, I enjoy learning new things and [writing on my blog](/blog/), where I publish programming tutorials and [the occasional essay](/tags/essay/). My passion for writing motivated me to create this website in the first place—it's my own little corner of the web where I'm free to write to my heart's content, without ads or paywalls. I'm also a big believer in learning by teaching, and my blog gives me a place where I can do that. So far, I've written {{ collections.posts | size }} posts, and I hope to publish many more in the future.

### Gaming

When I'm not writing, you'll find me [praising till I'm hollow](https://www.youtube.com/watch?v=mp28JPs25ek). I'm a die-hard [Soulsborne](https://en.wikipedia.org/wiki/Souls_(series)) fan—I love the challenging gameplay, intricate lore, jolly co-operation, and community inside jokes that Souls games are so well known for. But I also enjoy other genres of games: shooters, RPGs, roguelites, card games, platformers, you name it. I was practically raised by a generation of browser Flash games—may they [rest in peace](/blog/rest-in-peace-flash/)—and an unhealthy amount of (Old School) Runescape, and these experiences with video games have shaped my interests and personality to this day. Some games have left such a lasting impression on me that [I've written about them](/tags/gaming/).

Since I'm sure you're dying to know, some of my favorite video games include:

- Outer Wilds (not *Worlds*!)
- Hollow Knight
- Anything made by FromSoftware, at this point
- Slay the Spire, The Binding of Isaac, and Darkest Dungeon (is it obvious I like roguelites?)
- Subnautica
- The Legend of Zelda: The Minish Cap
- ... and many other great titles.

I could talk about games for hours, so I'm just going to stop here before you fall asleep.

### Music

I love listening to music—mainly rock, indie, folk, and some hip-hop/rap. I'm a big fan of music by Lana Del Rey, Arctic Monkeys, Radiohead, GY!BE, and lots of other artists that I'd list here if I weren't pressed for space. Check out my [Spotify playlists](https://open.spotify.com/user/gsnib6johhi5w2u4wts1m5628) for a sampling of my favorite songs.

I'm also currently learning how to play guitar, with the goal of one day playing some of my favorite riffs and songs.

### Reading

Every now and then, I'll dust off a book and do some light reading. I love finding that rare book that captivates me so much that time slips away, where closing it almost feels like waking from a dream. A few of my favorite books include:

- *The Little Prince* by Antoine de Saint-Exupéry{% comment %}a novella that I only wish I had read when I was younger so that I could now—as an adult—appreciate the irony of it being marketed as a children's book.{% endcomment %}
- *The Shadow of the Wind* by Carlos Ruiz Zafón
- *The Count of Monte Cristo* by Alexandre Dumas
- The Discworld novels by the infinitely witty Terry Pratchett
- *Johnny Got His Gun* by Dalton Trumbo

I don't have a reading list per se, although there are some books I'd like to one day read... Okay, I guess that's *technically* a reading list, but hopefully you get my point. I don't like to treat reading as something to check off a list because then it feels like work.

{% comment %}### Art

When I was younger, I was obsessed with drawing (and pretty good at it, too!). But with time, I found myself preoccupied with so many other things that I simply couldn't find the time to draw. Lately, my interest in art has resurfaced in the colorful world of front-end development—I love working with CSS to bring designs to life on the canvas that is the web. Sometimes, I create [CSS art](/art/) as a substitute for the real thing, either as a challenge or just for fun.{% endcomment %}

## So, Yeah... That's Me!

If you made it this far, cool! You're still awake!

There's more to my life than what I feel comfortable sharing here, but that's about the gist of my background and interests.

At the end of the day, I'm just a [Real Human Bean](https://www.youtube.com/watch?v=-DSVDcw6iW8) who enjoys doing real human things. If that sounds like your cup of tea, get in touch—I'd love to hear from you!
