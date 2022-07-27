---
title: Gated Content, Broken Locks
description: Some sites gate their content by hiding it with CSS. Whether you open the site incognito or normally, the full content appears to be beyond reach. But it's not—anyone can swing open the gate.
keywords: [gated content]
categories: [essay, css, news, money]
thumbnail:
  url: https://images.unsplash.com/photo-1585152002465-43c1f64b95d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

Someone shares an article online, and it eventually makes its way into one of your social feeds. The title, while dubious and verging on clickbait, piques your interest. Though you've walked these roads before, you naively hope that this time will be different. Perhaps this article's sole focus *isn't* to drive clicks, exploit people's emotions, force sign-ups, deceive users, or sell personal information to advertisers.

Alas, what flickering hope there may have been is quickly extinguished by one of these:

{% include "postImage.html" src: "./images/medium.jpg", alt: "Content gating on a Medium article. The heading reads: 'Read the rest of this story with a free account.' Below are two options for signing in: with Facebook or Google. There is also a link to sign in." %}

Legend has it that during one of their executive meetings, the publishers realized that sharing knowledge for free isn't so profitable after all. And so they came up with an ingenious idea: They would try their very hardest to make navigating their website an inaccessible and offensive mess—unless, of course, a user would sign up, accept cookies, enter payment information, bend over, etc.

## Just Another Brick in the Paywall

Welcome to gated content, traveler. I hope you're reading this in a future where registration walls and paywalls no longer exist—one where content is free for all to consume. But until then, we have to put up with these sorts of practices on the web.

You shouldn't have to sign up for an account just to read an article, but that's the world we live in: one where knowledge is only conditionally free. We could blame this trend on a number of factors, but the truth is that publications have always been in it for the money. Now, they're just armed with legions of web developers who reluctantly obey their clients, [making the logo bigger](https://www.youtube.com/watch?v=5AxwaszFbDw) until the sweet release of the day's end. If they're not directly charging readers for subscriptions, publications are still making money by selling personal information to advertisers.

Where there's money to be made, there is something supposedly valuable to be guarded and a never-ending stream of analytics to collect. _Democracy dies in darkness_, after all—and money keeps the oil lamp burning.

## Bypassing Poorly Gated Content

Some of the worst in the content publishing industry—by which I mean the likes of Medium—aggressively gate their content the proper way. Rather than visually hiding their content with CSS and modals, they initially show a truncated view of the content and only reveal the rest if you're authenticated. They do this by tracking how many articles you've read (e.g., with [cookies](/blog/what-are-cookies/)); once you've hit your quota, they prompt you to log in to continue reading. Even if you inspect the network request for the page or disable JavaScript, you'll find that the server only ever returns a truncated portion of the article. You have to open the site incognito or clear your cookies to reset the counter.

(A little-known workaround is to just not read Medium articles. It's remarkably effective.)

Gating content is especially trivial if you happen to be server-rendering your site. If you're using Next.js or any similar framework that supports SSR out of the box, then all you have to do is check whether a user is authenticated on page request. If they aren't, you return the truncated content rather than the whole article. And for safe measure, maybe you also throw in one of those annoying modals that take up 90% of the screen.

Other platforms take a more naive approach, hiding their content on the client side with CSS. Whether you open the site incognito or normally, the full content *appears* to be beyond your reach. But since the article is only hidden visually, it's technically not gated—anyone with basic knowledge of CSS can pull back the curtain.

The New York Times and The Washington Post are two mainstream news sites that I often find myself stumbling upon, only to be greeted by these hideous and offensive modals prompting me to log in or subscribe to continue reading. But if you open up your dev tools and inspect the markup, you'll actually find the content right there in its entirety:

{% include "postImage.html" src: "./images/nytimes.png", alt: "Inspecting a sample New York Times article in Chrome dev tools. Only the article's title is visible; the rest of the content is visually hidden behind an overlay modal that reads: 'Thanks for reading The Times. Create your free account or log in to continue reading.' In the right-hand pane, under the element inspector, one can find the full article content." %}

In short, the wrong way to gate content goes something like this:

1. Return all of the content from your server.
2. On the client side, open a modal prompting the user to log in or subscribe.
3. Set `overflow: hidden` on the main content container to disable scrolling.
4. Set `aria-hidden="true"` on the main content to mute screen readers.

There are many ways you can bypass poorly gated content and read the full article:

- Find the right elements in a sea of divs and delete them or remove the offending CSS.
- Log the body text in your console: `console.log(document.body.innerText)`.
- Use a browser extension, like the open-source [Bypass Paywalls](https://github.com/iamadamdev/bypass-paywalls-chrome).

The only reason this naive approach works is because most readers aren't technically inclined and probably don't even know what CSS stands for—they see a modal blocking their screen, so they assume that the content must, in fact, be out of reach. The rest of us are mildly peeved and feel compelled to write about how silly all of this is.

## Democracy Dies Behind a Paywall

I just want to read your article and keep abreast of the news. Is that really so much to ask for? If your content is truly so valuable that it must be guarded closely, then you shouldn't have to try to force readers to sign up just so they can read it—they'll happily sign up and promote your work if it's really that noteworthy.

Registration walls and paywalls are so omnipresent that I've become desensitized to them. And yet, my first instinct when encountering one is to immediately click away and find a different article to read. Rather than compelling me to register or subscribe, this strategy squanders any chance it may have had of gaining my loyalty as a reader.

I don't know when this practice of gating content will ever die out. In the meantime, this is our reality:

- The web is a horrible mess of modals, popups, and paywalls.
- Free, high-quality content is difficult (but not impossible) to find.
- Media sites use inaccessible and obtrusive modals to entice subscriptions.
- Gating content with CSS is naive and ineffective.

If you're going to put in the effort to prevent people from reading your content, then you may as well go all in and do it properly. This has the added benefit of driving users away from your site, encouraging them to seek out and support free publications.

{% include "unsplashAttribution.md" name: "Oxa Roxa", username: "oxaroxa", photoId: "mjYYn8BBriI" %}
