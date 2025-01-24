---
title: A Tale of Two Routes
description: Poorly designed API routes and an account creation loophole allow Twitter users to hijack routes.
categories: [case-study, twitter, security]
thumbnail: ./images/tweet-mentions.jpg
---

While browsing Twitter—_sorry_, X—I realized something that had never crossed my mind before: All profile pages live under `https://x.com/<username>`. And it turns out that this is actually a big design flaw.

![The official account of X on Twitter. Address bar points to https://x.com/X](./images/twitter-x-profile.jpg){loading="eager"}

## Route Hijacking

The problem with X's routes is that they're flat. _Too_ flat.

1. https://x.com/home takes you to your home page ✅
2. https://x.com/messages takes you to your DMs ✅
3. [https://x.com/\<username\>](https://x.com/<username>) takes you to @username's account ⚠️

So what if a username happens to match a reserved route? For example, what's stopping someone from claiming @home and getting assigned the profile URL of https://x.com/home? Well, apparently nothing:

{% include "video.liquid" src: "/assets/videos/twitter-home.mp4", sourceType: "video/mp4", width: 1104, height: 482, caption: "Clicking the link for @home's profile page takes you to /home." %}

You remember your old friend @Settings, right?

{% include "video.liquid" src: "/assets/videos/twitter-settings.mp4", sourceType: "video/mp4", width: 1104, height: 482, caption: "Clicking the link for @Settings's profile page takes you to /settings." %}

**Achievement unlocked**: Hidden (or extremely popular) profiles. Depending on which route is registered last, you're going to see one of two behaviors:

- Legitimate routes like `/home` point to the hijacker's profile.
- Legitimate routes work, but you can no longer view the conflicting profiles.

Although the second approach is not ideal, it's the lesser of these two evils. The first issue appears to have been patched, so you can no longer navigate to these profile pages directly because the reserved route always takes precedence. That leaves only two options for following these "hidden" accounts:

- Find or compose a tweet mentioning the account and hover over the mention.
- Find the account in someone else's follows list.

If you try to [view @settings's followers](https://x.com/settings/verified_followers), you'll get a routing error:

![Twitter UI on settings/verified_followers. The UI shows the typical settings page, but the right-hand pane has an error that reads: "Hmm...this page doesn't exist. Try searching for something else."](./images/settings-verified-followers.jpg)

But you can still view [@home's followers](https://x.com/home/verified_followers), at least for now. And there are lots of them: 1.1 million at the time when I wrote this, to be exact.

![Viewing the followers for @home on Twitter](./images/home-followers.jpg)

The issue hasn't been fully patched, though, because if you click a mention for [@logout](https://x.com/logout), you'll get a prompt to—you guessed it—log out. Likewise, mentions for @home and @settings will take you to `/home` or `/settings`, respectively.

<figure>
    <img src="./images/twitter-logout.jpg" alt="Tweet by @soapbox_ on Nov 22, 2024 that reads: 'hey press this cool blue text @logout.' The popover for the account shows that it's suspended." />
    <figcaption>It's a feature, not a bug!</figcaption>
</figure>

{% aside %}
Thankfully, Twitter has validation in place to prevent you from claiming handles with slashes, like [@settings/deactivate](https://x.com/settings/deactivate). Trust me, I tried 😉 Removing client-side validation and blocking the server-side validation request with dev tools doesn't work. So that's one win for the Twitter devs.
{% endaside %}

Some usernames—like `tos`, `messages`, `notifications`, and `privacy`—appear to have been reserved correctly. [Their mentions](https://x.com/woomy_irl/status/1760580092324151402) aren't even hyperlinked:

![Tweet from @woomy_irl that reads: "Wow @home @logout @notifications @explore @messages"](./images/tweet-mentions.jpg)

## Why It Matters

Users should **never** be able to hijack reserved routes during the account creation process, as this affects security and usability.

For example, at one point this bug prevented users from logging out of the mobile app because the legitimate `/logout` link would take them to @logout's profile:

{% quote "David King on X, Oct 1, 2024", "https://x.com/gamefandave/status/1841121778808103319" %}
Hey @elonmusk, when you try to logout on the website on mobile it takes you to the @logout account instead
{% endquote %}

That may seem annoying, and it is. But it's a mild regression compared to opening the app and seeing @home's profile instead of your feed—an actual bug that was reported by multiple users in February 2024:

<figure>
    <img src="./images/twitter-home-reddit-post.jpg" alt="Post on r/Twitter that reads: 'Does anyone know why my app suddenly opens these random account pages when I boot it up?' It includes a screenshot of the @home profile page." />
    <figcaption>Post on r/Twitter: <a href="https://www.reddit.com/r/Twitter/comments/1azowtv/does_anyone_know_why_my_app_suddenly_opens_these/">"Does anyone know why my app suddenly opens these random account pages when I boot it up?"</a></figcaption>
</figure>

<figure>
    <img src="./images/twitter-hacked.jpg" alt="Tweet by @laxxedd on Feb 17, 2024 that reads: 'Either my X acc is hacked or @elonmusk needs to fix this Geneia@home glitch.' Several of the replies, one as recent as Jan 3 2025, are similarly confused." />
    <figcaption>Source: <a href="https://x.com/laxxedd/status/1758959888170934625">@laxxedd on X</a></figcaption>
</figure>

Now, imagine if the owner of the @home profile had included a malicious link in their bio or masqueraded as an official person. Sure, the account would've eventually been flagged and suspended, but maybe it would've managed to trick enough users to click the link before getting caught. That's no longer a cute [oopsie-woopsie](https://knowyourmeme.com/memes/oopsie-woopsie): It's a security loophole.

This bug also reveals an apparent disconnect between how users _think_ navigation works and how it's _actually_ implemented on the web. Ordinary people don't think of URLs the same way developers do, and the lines become even blurrier in a client-side-routed app like Twitter that tries its best to feel native. You open the "app" and you expect to see your timeline. You click a "tab"—not a _link_, mind you—and expect to see a new user interface without a full page reload. So you can't really fault someone for logging in, seeing @home's profile page, and thinking the site or their account has been "hacked."

## Username Parking and Eviction

You might be thinking: Well, Twitter already fixed this bug, who cares? But suppose you've had @username for years, and then one day X decides to add `https://x.com/<username>` as an internal route that just happens to conflict. If this route is registered with a lower priority than username routes, it'll point to your profile page—the @home fiasco all over again. But if it's implemented correctly, nobody will be able to view your profile from that point onward. Effectively, this one flaw in X's routing forces you to change your handle. It also means you can compile a list of handles that may one day trigger route collisions and create an account for any that don't already exist, "parking" them in the hopes of hijacking routes in the future.

## Conclusion

All of this could've been avoided if Twitter had isolated profile routes from reserved routes with a scheme like `/profile/<username>` or `/user/<username>`, as many social media sites do. For example, all Reddit profiles are accessible at `/user/<username>`. I suspect that Twitter's decision to use flat URLs was motivated by aesthetics: making profile URLs _short_ instead of _safe_. Technically, that would've still worked if the developers had reserved these handles during account creation. But because they didn't, I'm now a proud follower of @home and @settings.
