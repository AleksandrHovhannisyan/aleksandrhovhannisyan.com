---
title: Goodbye, GitHub Pages—Hello, Netlify
description: GitHub Pages is a great option for hosting your site... until it isn't. Here's why I moved to Netlify.
keywords: [github pages vs netlify]
tags: [dev, blogging, github, netlify]
last_updated: 2020-10-17
is_popular: true
---

Back when I had no clue what I was doing with this site, and it was nothing more than an HTML file with a single CSS stylesheet and some jQuery I absolutely did not need, I was hosting it for free on GitHub Pages.

Why? Because it was the most accessible option to me at the time. It also made sense—I didn't have to pay anything, and I already had a free domain right at my fingertips. It's a great option for people who just want to [create a personal website](/blog/getting-started-with-jekyll-and-github-pages/) or publish documentation.

But with time, I realized that GitHub Pages is actually fairly limited as a hosting service. Now, my site is hosted on Netlify under a custom domain, and I honestly couldn't be happier about having made the switch.

Note that this post is not sponsored by Netlify. I'm just a happy user who recommends their services. With that out of the way, let's look at exactly *why* I prefer Netlify to GitHub Pages.

{% include toc.md %}

## GitHub Pages vs. Netlify: Why I Switched

### Hosting Private Repos

If you're a free GitHub user, then GitHub Pages will only be able to build your **public repos**. You can get it to also build private repos, but you'll have to purchase one of the Pro plans, the least expensive of which is GitHub Teams at $4/month. That's $48/year. Netlify, on the other hand, can build **both public and private repos** for free. Slap on a custom .com domain from Google Domains for just $12/year, and you're all set.

### Jekyll Plugins, Netlify Plugins, and Other Goodies

This was honestly a deal-breaker for me as my site began to grow in complexity. GitHub Pages only supports [a limited set of Jekyll plugins](https://pages.github.com/versions/). If you want to use any plugin not listed there, you'll need to instead push your build output directory (`_site/` in Jekyll) to your repo instead of pushing your source code, or push both but to different branches. With Netlify, there are no such restrictions: You can use whatever plugins you want, and your site will build just fine.

Netlify also has a bunch of other cool features, like [split A/B testing](https://docs.netlify.com/site-deploys/split-testing/#use-snippet-injection-for-more-flexibility) (currently in Beta), [free contact forms](https://docs.netlify.com/forms/setup/#html-forms), detailed site analytics, and more. You can even add **free Netlify build plugins** to your site; these run as part of your website's build process, and if any of them fail, your build will fail. For example, there's one that will [check all links on your site](https://www.npmjs.com/package/netlify-plugin-checklinks) to ensure that none of them are broken before you publish new content, another that will run [a11y checks](https://www.npmjs.com/package/netlify-plugin-a11y) for accessibility, and [many others](https://docs.netlify.com/configure-builds/build-plugins/).


GitHub Pages has **none of these things**—no customization, and certainly no plugins. It *can* take advantage of GitHub Actions, but [so can Netlify](https://github.com/netlify/actions) if your code lives on GitHub.

### More Control Over Deployments

With Netlify, you have **much more control over the deployment process**. Your dashboard provides a clear view of your deploy history and even allows you to manually revert your site to a prior state with its **one-click rollback**. You can also stop auto-publishing new versions of your site, in case that's something you're interested in, and even access a live preview of your deployment to make sure nothing broke. You can also share your deployment history (and deploy previews) with other people; this is useful if you're working as part of a team and not just a single dev, or if you want design input from others.

{% include img.html img="dashboard.png" alt="The Netlify dashboard for my personal website" %}

On the other hand, with GitHub Pages, [you can only deploy to two branches](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source), one of which is `master` by default. Want to revert your site? Have fun [resetting to a previous commit with git](/blog/undoing-changes-in-git/#2-resetting-a-branch-to-an-older-commit) on your second branch and fiddling with your repo settings to change the deploy branch. There are also no deploy previews, so whatever you push will go live as soon as it builds.

### Faster Deployments

Netlify builds my site in 30 seconds, on average:

{% include img.html img="faster-deploys.png" alt="Netlify deploys my site very quickly" %}

With GitHub Pages, things are much slower, and you sometimes have to do a hard refresh to see the results. Their own documentation says you may have to [wait up to 20 minutes](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-jekyll-build-errors-for-github-pages-sites) to see the changes:

> *It can take up to 20 minutes for changes to your site to publish after you push the changes to GitHub.*

Even worse, GitHub Pages caps you at **only 10 builds per hour**. So if you're frequently pushing to your deployment branch (which you probably shouldn't be doing anyway), [you may run into trouble](https://help.github.com/en/github/working-with-github-pages/about-github-pages#guidelines-for-using-github-pages):

> If your site exceeds these usage quotas, we may not be able to serve your site, or you may receive a polite email from GitHub Support or GitHub Premium Support suggesting strategies for reducing your site's impact on our servers, including putting a third-party content distribution network (CDN) in front of your site, making use of other GitHub features such as releases, or moving to a different hosting service that might better fit your needs.

Netlify has a much more generous soft cap of **3 builds per minute**. You also get **300 build minutes per month** and **100 GB data usage** with its free tier, which is more than enough for most needs. To clarify, build minutes are basically Netlify's currency for a billing cycle. If you're a free user, this means that your builds can't exceed the 300-minute total for one month. Next month, your usage resets to 0. My cycle resets on the 15th of each month, and I don't pay anything as long as my usage doesn't exceed this limit:

{% include img.html img="billing.png" alt="Netlify's dashboard shows billing information for things such as data usage and build minutes used." %}

### Proper 301 Redirects

This one's a big deal if you value your site's SEO.

If one of your URLs changes, Google will need to know that the old and new version share the same content and that your search results listing should be updated. The proper way to do this is with a [301 redirect](https://support.google.com/webmasters/answer/93633?hl=en), but GitHub Pages doesn't let you configure redirects for your site's URLs. You'll have to handle this in your source code, like using the [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) plugin for Jekyll, [gatsby-redirect-from](https://www.gatsbyjs.com/plugins/gatsby-redirect-from/) for Gatsby, and so on.

On the other hand, redirects in Netlify are [super easy to set up](https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file). All you need to do is create a plaintext `_redirects` file that maps old URLs to new ones, separating the two with a tab:

{% capture code %}/old-url/   /new-url/
/another-old-url /another-new-url{% endcapture %}
{% include code.html file="_redirects" code=code %}

Make sure this file is included in your site's build output, and Netlify will handle the rest for you.

## Tips for Switching From GitHub Pages to Netlify

If you run a blog on a GitHub Pages domain and it gets decent traffic, you'll want to be careful about how you go about switching hosting providers since `.github.io` domains are reserved by GitHub, and you can't carry these over to a different hosting provider (like Netlify).

I recommend that you keep your old GitHub Pages repository around temporarily, separate from your new site. This allows you to set up custom 301 redirects (e.g., using one of the plugins mentioned above) that point from your old GitHub Pages site to your new site so that your search engine rankings don't tank.

You can also use the [Change of Address Tool](https://support.google.com/webmasters/answer/9370220?hl=en) right there in Google Search Console to migrate your old site's traffic to your new one, once you've set up 301 redirects:

{% include img.html img="migration.png" alt="Migrating my old search engine results to my new domain" %}

Currently, I host my new site's content under a private GitHub repo, with a custom domain configured in Netlify. My `.github.io` domain is still up and visible in Google, but it redirects to my new site.

Keep an eye on your Google Search Console over the next few months following your migration. Once things stabilize, you can make your old repo private or delete it altogether, taking it off of GitHub Pages.

> **Update 10/17/2020**: After a few months, I took down my `.github.io` domain. My search engine rankings were stable throughout this migration period, thanks to the redirects I set up.

## Here's to a New Era

Okay, so that's obviously a slight exaggeration—all I really did is switch hosting providers!

However, the future looks very promising for Netlify—it recently secured a whopping [$53 million in Series C funding](https://www.netlify.com/press/after-onboarding-800000-developers-netlify-raises-53m-in-series-c-funding-to-fuel-enterprise-growth/). Past investors of the company have included founders from GitHub, Slack, Yelp, and other big names, so people clearly see value in its business.

Having switched from GitHub Pages to Netlify, I feel like I have far more control over my site. The only downside is that if I want to take advantage of more features, their [paid plans are pretty expensive](https://www.netlify.com/pricing/). But I don't anticipate this being a problem—the free tier has everything I need, and then some.
