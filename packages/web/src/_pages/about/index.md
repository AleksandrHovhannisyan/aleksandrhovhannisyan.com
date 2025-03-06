---
title: About
description: My experience, projects, and interests.
permalink: /about/
layout: about
---

![](./images/photo.jpg){.profile-photo .float .right .circle}

Welcome! My name's Aleksandr—and yes, that's spelled _without_ an `e` between the `d` and the `r`, pronounced just like _Alexander_. Don't worry about my last name, though; it's quite long, and most people butcher it anyway.

I'm a Texas-based software developer; this website is my little corner of the web where I write programming tutorials, experiment with web design, and hone my voice as a writer, all to varying degrees of success.

Here's a brief rundown of my experience, projects, and interests.

## Work Experience

Since 2020, I've worked full time as a software engineer on Esri's [ArcGIS StoryMaps](https://storymaps.arcgis.com/) team. In that role, I:

- Shipped many high-impact and highly requested features, including but not limited to: a rich text editor (Slate.js) that powers our app's authoring experience; a data table block; extended theming options; topic tagging and publishing options; a custom template workflow; integrations with APIs like Google Fonts and Unsplash; and more.
- Refactored core parts of the app to resolve longstanding tech debt.
- Wrote plenty of documentation (inline, READMEs, and getting started/troubleshooting guides) for both new and old code.
- Served on an internal accessibility working group, where developers and designers met every few weeks to discuss issues and potential solutions.
- Mentored developers and paired with co-workers to unblock their work.
- Presented at team workshops to share things I learned or worked on.

These days, I mainly work on the web with React, TypeScript, and CSS, but I also have experience with other frameworks like Svelte and more general-purpose programming languages like C++ and Python. Some of my interests in web development include typography, performance, and accessibility. I thrive in collaborative environments that encourage growth, offer varied learning opportunities, and cultivate my problem-solving skills and creative strengths.

While the majority of my work experience is in software development, I once worked as a [freelance copy editor](https://www.upwork.com/freelancers/~014eb3a95d4d1fd855?s=1110580753635725312) for four years during my undergraduate studies, with clients ranging from digital marketing agencies to small business owners and even bigger companies like Quora. Freelancing was a great experience that taught me how to stand out in a fiercely competitive market, helped me grow my professional network, and allowed me to earn a bit of money on the side while in school.

I won't bore you too much with my work history, though; that's what [my LinkedIn]({{ socials.linkedin.url }}) and [résumé](/resume.pdf) are for.

## Software Projects

Even though programming is my full-time job, I still enjoy doing it in my free time and learning new tools, languages, and techniques. I'm always looking for better ways to solve problems, and I often test new things I've learned on this very website!

Below are select projects that I'm proud of:

<ul class="grid gap-5 col-2 align-center">
  {%- for project in projects -%}
    <li class="project-wrapper">
      {%- include "projectCard.liquid" project: project -%}
    </li>
  {%- endfor -%}
</ul>

You can also:

- [View my repositories on GitHub](https://github.com/AleksandrHovhannisyan?tab=repositories).
- [View my published npm packages](https://www.npmjs.com/~aleksandrhovhannisyan).

## Hobbies and Interests

### Writing

Outside of work, I enjoy learning new things and [writing on my blog](/blog/). In fact, my passion for writing is what motivated me to create this website—it's a place where I'm free to write to my heart's content, without ads or paywalls. I'm also a big believer in learning by teaching, and my blog allows me to do just that. To date, I've written {{ collections.posts | size }} posts, and I hope to publish many more in the future.

### Music

I've loved listening to music my entire life—everything from rock to indie, folk, rap, pop, you name it. But it's only recently that I began *playing* music. In late 2023, I picked up my first guitar, and now I play it every chance I get. Some of the artists I keep coming back to (and whose songs I want to learn) include The Strokes, Lana Del Rey, Arctic Monkeys, Radiohead, GY!BE, and Joanna Newsom, [among others](https://open.spotify.com/playlist/4Xmn0rj4Qsbd431tPZOsMV?si=uR3_Vx-mR--g6rKWIRKtTA).

### Gaming

Like many people, I was first introduced to the world of computers through video games—I often found myself testing the limits of what developers would allow me to get away with in their digital sandboxes, a habit I still haven't shaken to this day (and one that's been surprisingly useful for software testing!). This natural curiosity led me to learn more about computers in high school, write some of my first few lines of code, and, eventually, earn my bachelor's in computer science.

So, when I'm not writing or playing guitar, I'm [praising till I'm hollow](https://www.youtube.com/watch?v=mp28JPs25ek). I'm a die-hard [Soulsborne](https://en.wikipedia.org/wiki/Souls_(series)) fan—I love the challenging gameplay, intricate lore, jolly co-operation, and inside jokes that this community is so well known for. But I also enjoy other genres of games: shooters, role-playing games, roguelites, card games, platformers, you name it. I was practically raised by a generation of browser Flash games—may they [rest in peace](/blog/rest-in-peace-flash/)—and an unhealthy amount of (Old School) Runescape, and these experiences with video games have shaped my interests and personality. In fact, some games have left such a lasting impression on me that [I've written about them](/tags/gaming/).

### Reading

Every now and then, I'll dust off a book and do some light reading. I love finding that rare book that captivates me so much that time slips away, where closing it almost feels like waking from a dream. A few of my favorites include:

- *The Little Prince* by Antoine de Saint-Exupéry
- *The Shadow of the Wind* by Carlos Ruiz Zafón
- *The Count of Monte Cristo* by Alexandre Dumas
- The Discworld novels by the infinitely witty Terry Pratchett

I don't keep a reading list per se, although there are some books I'd like to one day read... Okay, I guess that's *technically* a reading list, but hopefully you get my point. I don't like to treat reading as something to check off a list because then it feels like work.

## So, Yeah... That's Me!

If you made it this far, cool! You're still awake!

There's more to my life than what I feel comfortable sharing here, but that's about the gist of my background and interests.

At the end of the day, I'm just a [Real Human Bean](https://www.youtube.com/watch?v=-DSVDcw6iW8) who enjoys doing real human things. If that sounds like your cup of tea, get in touch—I'd love to hear from you!
