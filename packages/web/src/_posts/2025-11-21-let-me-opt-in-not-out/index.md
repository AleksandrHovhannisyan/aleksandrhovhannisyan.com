---
title: Let Me Opt In, Not Out
description: Why should I have to opt out of something I never agreed to in the first place?
keywords: [opt-in]
categories: [essay, privacy]
---

While debugging a new feature I recently deployed to my site, I noticed some console errors that mentioned a mysterious `beacon.min.js` script I hadn't ever seen before, and that I certainly didn't add myself:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://static.cloudflareinsights.com/beacon.min.js/<hash>. (Reason: CORS request did not succeed). Status code: (null).
None of the “sha512” hashes in the integrity attribute match the content of the subresource.
```

Initially, I thought this might be a cross-site scripting attack. But after a quick Google search, I learned that this was related to a recent change where Cloudflare had [enabled free client-side analytics on all sites by default](https://blog.cloudflare.com/the-rum-diaries-enabling-web-analytics-by-default/):

{% quote "The RUM Diaries: enabling Web Analytics by default", "https://blog.cloudflare.com/the-rum-diaries-enabling-web-analytics-by-default/" %}
The journey starts on October 15, 2025, when Cloudflare will enable Web Analytics for all free domains by default — helping you see how your site actually performs for visitors around the world in real time, without ever collecting any personal data (not applicable to traffic originating from the EU or UK, see below). By the middle of 2026, we’ll deliver something nobody has ever had before: a comprehensive, privacy-first platform for performance monitoring and debugging. Unlike many other tools, this platform won’t just show you where latency lives, it will help you fix it, all in one place. From untangling the trickiest bottlenecks, to getting a crystal-clear view of global performance, this new tool will change how you see your web application and experiment with new performance features. 
{% endquote %}

That's nice, and I'm sure there are lots of customers who wanted this. I might even use this for my other side projects deployed on Cloudflare. The problem is that I never received any announcements about this upcoming change, and I don't really need client-side analytics for a static blog where I make zero money. But since this feature is enabled by default, I had no say in it, and I only noticed it by accident.

I eventually found the settings page where I could opt out of [Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/), deep in Cloudflare's already-confusing maze of navigation and docs. While harmless, this experience left me feeling like I wasn't actually in control of my site. I'm not comfortable with my hosting provider randomly injecting scripts into my site without at least letting me know in advance.

Unfortunately, this practice of opting users into new features and then leaving it up to them to opt out is a widespread pattern, especially in the software and advertising industries. And it's exhausting.

## You Can't Escape It

Companies love to enable optional features by default under the guise of improved service delivery, enhanced productivity, or some other marketing-speak, and they sometimes let you opt out. We hear about this on a near-daily basis now with AI models that are being trained on our personal data.

Just this month, [Malwarebytes reported](https://www.malwarebytes.com/blog/news/2025/11/gmail-is-reading-your-emails-and-attachments-to-train-its-ai-unless-you-turn-it-off) that Google had quietly deployed a change that allows Gmail to read your emails and attachments to train its Gemini AI model. Of course, it's enabled by default.

{% quote "Gmail can read your emails and attachments to train its AI, unless you opt out", "https://www.malwarebytes.com/blog/news/2025/11/gmail-is-reading-your-emails-and-attachments-to-train-its-ai-unless-you-turn-it-off" %}
The reason behind this is Google’s push to power new Gmail features with its Gemini AI, helping you write emails faster and manage your inbox more efficiently. To do that, Google is using real email content, including attachments, to train and refine its AI models. Some users are now reporting that these settings are switched on by default instead of asking for explicit opt-in.
{% endquote %}

Social media sites like Facebook, Twitter, and LinkedIn also train their AI models on your data by default unless you opt out. Sometimes, they don't even delete the data they've already collected retroactively, so you better stay on your toes in case they roll out new changes in the future!

{% quote "Making AI Work Harder for Europeans", "https://about.fb.com/news/2025/04/making-ai-work-harder-for-europeans/" %}
Today, we’re announcing our plans to train AI at Meta using public content —like public posts and comments— shared by adults on our products in the EU. People’s interactions with Meta AI – like questions and queries – will also be used to train and improve our models. This training, which follows the successful launch of Meta AI in Europe last month, will better support millions of people and businesses in the EU by teaching AI at Meta to better understand and reflect their cultures, languages and history.
{% endquote %}

{% quote "Control whether LinkedIn uses your data to improve generative AI (GAI) models that are used for content creation on LinkedIn", "https://www.linkedin.com/help/linkedin/answer/a6278444" %}
The Data for Generative AI Improvement member setting is set to “on” by default, unless you opt-out by turning it “off.” Turning the setting off means that we (LinkedIn and our affiliates) won’t use the data and content you provided to LinkedIn to train models that generate content going forward. Opting out does not affect training that has already taken place.
{% endquote %}

Oh, and let's not forget Microsoft. I still remember the good old days of Windows, long before Microsoft realized it could run ads natively on an operating system. I could've never foreseen that I'd have to write a tutorial on [how to opt out of anti-privacy settings in Windows 11](/blog/making-windows-11-usable/), but that's not even the worst of it. At one point, Microsoft enabled Recall on its Copilot+ PCs by default to silently record _everything_ you were doing on your computer. You _do_ want that, don't you? Microsoft only turned this off after a wave of backlash and bad press coverage, and now you have to explicitly opt in if you really want it, which is how it should've been from the start:

{% quote "Microsoft Will Switch Off Recall by Default After Security Backlash", "https://www.wired.com/story/microsoft-recall-off-default-security-concerns/?utm_source=chatgpt.com" %}
On Friday, Microsoft announced that it would be making multiple dramatic changes to its rollout of its Recall feature, making it an opt-in feature in the Copilot+ compatible versions of Windows where it had previously been turned on by default, and introducing new security measures designed to better keep data encrypted and require authentication to access Recall's stored data.

The changes come amid a mounting barrage of criticism from the security and privacy community, which has described Recall—which silently stores a screenshot of the user's activity every five seconds as fodder for AI analysis—as a gift to hackers: essentially unrequested, preinstalled spyware built into new Windows computers.
{% endquote %}

This practice isn't unique to AI products, although we do hear about them to a nauseating degree.

[Auto manufacturers also love to opt you into data sharing by default](https://www.nytimes.com/2024/03/11/technology/carmakers-driver-tracking-insurance.html). When you purchase a new vehicle, some of them will collect telemetry on your driving behavior and sell this data to insurance companies, and that could lead to higher premiums for you. You have to call them to opt out. Isn't that cool? I can't wait to live in a future where my toilet relays everything I do to a data broker.

Speaking of cars, I recently purchased one after my old one broke down. Little did I know that I was also volunteering to sell all my personal information to marketers who would flood my mailbox with expired warranty letters trying to trick me into giving them money. These letters contain all kinds of sensitive personal information. I didn't consent to this data being shared, and I didn't have to, because Texas.

{% quote "Car buyers hit with warranty spam believe Texas is selling their personal data", "https://www.dallasnews.com/news/watchdog/2025/10/13/texas-extended-warranty-data-privacy-data-sharing-marketing-complaints-scams-fraud/" %}
According to the state law as I read it, companies that buy data may not resell it to marketers to send out warranty letters. Violations can cost as much as $100,000. To date, no one has been charged with violations, the Texas Department of Public Safety reports.

DPS is allowed to sell data, under state law. Purchasers of data from DPS must sign a requirement promising that the data will “only be used for permissible purposes,” DPS spokesperson Sheridan Nolen told me.

To protect your privacy, first file a complaint with the company. Next step is to file a complaint with DPS or DMV or whichever state agency is involved. After that, file with the Texas Attorney General’s Office.
{% endquote %}

Don't worry, you can opt out. All you have to do is [write "refused" on the letters](https://faq.usps.com/s/article/Refuse-unwanted-mail-and-remove-name-from-mailing-lists), put them back in your mailbox, and wait for USPS to ignore them while more companies send you identical letters. Also, you may be able to convince these companies to stop if you file complaints with state agencies, who will probably also ignore you.

On that note, you also never signed up for marketing lists, but you still receive junk mail every week, and some of it isn't even in your name. If you want it to stop, you can pay a mail suppression service like [DMAChoice](https://www.dmachoice.org/) $2 to remove your name and address from marketing lists for 10 years. That's a pretty good deal! Too bad it doesn't work! I know because I've tried!

Tired of data brokers collecting your personal information and selling it just because you agreed to the terms of service of an e-commerce site, and now your name and address are listed on some sketchy website? You can ask them to delete your records, but they never said they'd make it easy.

{% quote "You have a right to delete your data. Some companies are making it extra difficult", "https://calmatters.org/economy/technology/2025/08/companies-make-it-hard-to-delete-personal-data/" %}
More than 30 of the companies, which collect and sell consumers’ personal information, hid their deletion instructions from Google, according to a review by The Markup and CalMatters of hundreds of broker websites. This creates one more obstacle for consumers who want to delete their data. 

Many of the pages containing the instructions, listed in an official state registry, use code to tell search engines to remove the page entirely from search results. Popular tools like Google and Bing respect the code by excluding pages when responding to users.
{% endquote %}

Actually, the _real_ solution is to hand over your personal information to a data removal service: a company that promises to contact all those _other_ companies on your behalf and opt you out of their data collection policies. To delete your personal information from _this_ company, you just... you...

_Sigh_. I hate what the internet has become.

## Let Me Decide

Opt-in by default is a deceptive practice: It's usually presented as something a user would want anyway if given a choice, but the problem is that companies rarely _give_ you that choice. Or if they do, they don't make it obvious, or the choice is... to not do something you never _asked_ them to do?

Yeah, I know: If something's free, there's a good chance that I'm the product. And there are legal protections buried in these companies' terms of service that allow them to engage in these practices. That doesn't make it any less annoying. Besides, if you're so confident that I'll want what you're offering, couldn't you just, I dunno, _ask_ me? And make it easy for me to opt in? But you know that I probably won't need it, so you quietly enable it and hope I won't notice.

Even if opting in by default is done with the best intentions, it can create unnecessary confusion. Worst case, it's an anti-consumer practice that is designed to extract as much data about you as possible before you eventually notice and flip the switch off. But why should that burden be on the consumer?

When a company opts me into a service or feature without asking me first, it makes me feel like I'm not in control, and I lose trust. It's also a great way to get people to opt out of your services entirely—just as soon as they figure out how to do that.