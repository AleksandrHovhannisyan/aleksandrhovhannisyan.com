---
title: Goodbye, GitHub Pages—Hello, Netlify
description: GitHub Pages is a great option for hosting your site... until it isn't. Netlify takes the cake for me.
keywords: [github pages vs netlify]
tags: [dev, blogging, github, netlify]
---

Back when I had no clue what I was doing with this site, and it was nothing more than an HTML file with a single CSS stylesheet and some jQuery that I absolutely did not need, I was hosting it for free on GitHub Pages.

Why? Because it was the most accessible option to me at the time. It also made sense—I didn't have to pay anything, and I already had a free domain right at my fingertips. It's a great option for people who just want to [create a personal website](/blog/dev/getting-started-with-jekyll-and-github-pages/) or document their software.

But with time, I came to realize that GitHub Pages is actually fairly limited as a hosting service. Now, my site is hosted on Netlify under a custom domain, and I honestly couldn't be happier about having made the switch.

## GitHub Pages vs. Netlify: Why I Switched

### Hosting Private Repos

If you're a free GitHub user, then GitHub Pages will only be able to build your **public repos**. You can get it to also build private repos, but you'll have to purchase one of the Pro plans, the least expensive of which is GitHub Teams at $4/month. That's $48/year. Netlify, on the other hand, can build **both public and private repos**. Slap on a custom .com domain from Google Domains for just $12/year, and you're good to go.

### Jekyll Plugins and Other Goodies

This was honestly a deal-breaker for me as my site began to grow in complexity. GitHub Pages only supports [a limited set of Jekyll plugins](https://pages.github.com/versions/). If you want to use any plugin not listed there, you'll need to instead push your build output directory (`_site/`) to your repo instead of pushing your source code, or push both but to different branches. With Netlify, there are no such restrictions: You can use **whatever plugins you want**, and your site will build just fine.

Netlify also has a bunch of other cool features, like [split A/B testing](https://docs.netlify.com/site-deploys/split-testing/#use-snippet-injection-for-more-flexibility) (currently in Beta), [free contact forms](https://docs.netlify.com/forms/setup/#html-forms), detailed site analytics, and much more. GitHub Pages has none of these things.

### More Control Over Deployments

With Netlify, you have **much more control over the deployment process**. Your dashboard provides a clear view of your deploy history and even allows you to manually revert your site to a prior state with its **one-click rollback**. You can also stop auto-publishing new versions of your site, in case that's something you're interested in, and even access a live preview of your deployment to make sure nothing broke.

{% include picture.html img="dashboard" ext="png" alt="The Netlify dashboard for my personal website" %}

On the other hand, with GitHub Pages, [you can only deploy to two branches](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source), one of which is `master` by default. Want to revert your site? Have fun resetting to a previous commit with git on your second branch and fiddling with your repo settings to change the deploy branch.

### Faster Deployments

Netlify builds my site in 30 seconds, on average:

{% include picture.html img="faster-deploys" ext="png" alt="Netlify deploys my site very quickly" %}

With GitHub Pages, things are much slower, and you sometimes have to do a hard refresh to see the results. Their own documentation says you may have to wait up to 10 minutes to see the changes go live on your site (this is a worst-case scenario, though).

Even worse, GitHub Pages caps you at **only 10 builds per hour**. So if you're frequently pushing to your deployment branch (which you probably shouldn't be doing anyway), [you may run into trouble](https://help.github.com/en/github/working-with-github-pages/about-github-pages#guidelines-for-using-github-pages):

> If your site exceeds these usage quotas, we may not be able to serve your site, or you may receive a polite email from GitHub Support or GitHub Premium Support suggesting strategies for reducing your site's impact on our servers, including putting a third-party content distribution network (CDN) in front of your site, making use of other GitHub features such as releases, or moving to a different hosting service that might better fit your needs.

Netlify has a much more generous soft cap of **3 builds per minute**. You also get 300 build minutes per month with its free tier, which is more than enough for most needs.

## Tips for Switching From GitHub Pages to Netlify

If you run a blog on a GitHub Pages domain and it gets decent traffic, you'll want to be careful about how you go about switching hosting providers.

I recommend that you keep your old GitHub Pages repository around and separate from the "new" version of your site. This allows you to set up custom 301 redirects (e.g., using the [`jekyll-redirect-from` plugin](https://github.com/jekyll/jekyll-redirect-from)) to your new site so that your search engine rankings don't tank.

You can also use the [Change of Address Tool](https://support.google.com/webmasters/answer/9370220?hl=en) right there in Google Search Console to migrate your old site's traffic to your new one, once you've set up 301 redirects.

{% include picture.html img="migration" ext="png" alt="Migrating my old search engine results to my new domain" %}

Currently, I host my new site's content under a private GitHub repo, with a custom domain configured in Netlify. My `.github.io` domain is still up and visible in Google, but it redirects to my new site.

Keep an eye on your Google Search Console over the next few months following your migration. Once things stabilize, you can make your old repo private, effectively taking it off of GitHub Pages.

## Here's to a New Era

Okay, so that's obviously a slight exaggeration—all I really did is switch hosting providers!

However, the future looks very promising for Netlify—it recently secured a whopping [$53 million in Series C funding](https://www.netlify.com/press/after-onboarding-800000-developers-netlify-raises-53m-in-series-c-funding-to-fuel-enterprise-growth/). Past investors of the company have included founders from GitHub, Slack, Yelp, and other big names, so people clearly see value in its business.

Having switched from GitHub Pages to Netlify, I feel like I have far more control over my site. The only downside is that if I want to take advantage of more features, their [paid plans are pretty expensive](https://www.netlify.com/pricing/). But I don't anticipate this being a problem—the free tier has everything I need, and then some.
