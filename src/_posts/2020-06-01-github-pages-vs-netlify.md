---
title: Goodbye, GitHub Pages—Hello, Netlify
description: "GitHub Pages is a good option for hosting simple static sites, but it doesn't scale well for more complex use cases. Netlify offers the best of both worlds: simple hosting and plenty of advanced features."
keywords: [github pages vs netlify]
categories: [github, netlify, tooling]
lastUpdated: 2021-07-31
thumbnail: thumbnail.png
isFeatured: true
---

Back when I had no clue what I was doing with this site, and it was nothing more than a single HTML file with some jQuery that I absolutely did not need, I was hosting it for free on GitHub Pages. It made sense at the time—my site was simple, I didn't have to pay anything, and I already had a free domain right at my fingertips. GitHub Pages is one of the easiest ways to [create a personal website](/blog/getting-started-with-jekyll-and-github-pages/), publish documentation, or share small projects.

But with time, I realized that GitHub Pages also has many limitations and doesn't scale well with frameworks and third-party plugins, particularly for static site generators like Jekyll. Now, my site is hosted on Netlify under a custom domain, and I couldn't be happier.

{% include toc.md %}

## GitHub Pages vs. Netlify: Why I Switched

Below are just of the reasons why I prefer to use Netlify over GitHub Pages. I'll be updating this post occasionally as I continue using Netlify and learning more about its features.

### 1. Netlify Plugins and Add-On Features

My favorite thing about Netlify is its ecosystem of [build plugins](https://docs.netlify.com/configure-builds/build-plugins/), which allow you to extend Netlify's build pipeline to run additional checks on your site before it deploys to production. If any build plugin throws an error, your build will fail with detailed logs clarifying what went wrong.

Netlify plugins are open source and free to use. Here are some that you might find useful:

- [`netlify-plugin-checklinks`](https://github.com/Munter/netlify-plugin-checklinks/): flags broken internal and external links.
- [`netlify-plugin-a11y`](https://github.com/netlify-labs/netlify-plugin-a11y): runs accessibility-related checks on your site.
- [`netlify-plugin-inline-critical-css`](https://github.com/Tom-Bonnike/netlify-plugin-inline-critical-css): inlines critical CSS.

Netlify also offers framework-agnostic features like:

- [Free contact forms](https://docs.netlify.com/forms/setup/#html-forms) that work with static sites and have spam protection.
- [Netlify Functions](https://www.netlify.com/products/functions/), a popular option for serverless sites and apps.
- [Split A/B testing](https://docs.netlify.com/site-deploys/split-testing/#use-snippet-injection-for-more-flexibility), where Netlify serves multiple branches to users at random.

GitHub Pages doesn't offer these features. It *can* take advantage of [GitHub Actions](https://github.com/features/actions), but [so can Netlify](https://github.com/netlify/actions) if your code already lives on GitHub.

### 2. Local Dev and Build Environments

If you want to test production changes on GitHub Pages, you need to push up a branch and wait for the build to finish on prod. By contrast, Netlify allows you to run dev and production builds locally using the [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation-in-a-ci-environment), with secure authentication. This allows you to [simulate a full Netlify build locally](https://docs.netlify.com/cli/get-started/#run-builds-locally), including with any build plugins that you've installed.

{% include img.html src: "local-build.png", alt: "Sample output from a local Netlify build running on my site. Netlify steps are listed in bright cyan font against a black background, with numbered steps and information about my Netlify configuration." %}

### 3. A Better Continuous Integration Experience

When you connect a GitHub repo to Netlify, you can take full advantage of its CI/CD pipeline for a better developer experience. For example, if anyone opens a pull request in your repo, this will automatically trigger a Netlify build and [generate a unique Deploy Preview URL](https://www.netlify.com/products/deploy-previews/) when the build finishes. This deploy preview doesn't get indexed, and it can be shared with anyone within or outside your team.

{% include img.html src: "deploy-preview.png", alt: "The footer section of a GitHub pull request shows a checklist of Netlify checks that passed or failed during the build process. There are metrics for each step, like the time it took to finish, as well as links to deploy previews." %}

Deploy previews are a great way to verify that merging a pull request won't introduce unintended side effects, allowing other devs on your team to test a feature live rather than having to build your branch locally. If you're a freelancer, this is especially useful because it means that you can show deploy previews to clients and solicit their feedback before your changes ever go live.

### 4. More Control Over Deployments

With Netlify, you have greater control over the entire deployment process. Your dashboard provides a clear view of your deploy history and even allows you to manually revert your site to a prior state with its one-click rollback. You can also stop auto-publishing new versions of your site, access all of your deploy previews, and more.

{% include img.html src: "dashboard.png", alt: "The Netlify dashboard for my personal website, showing a list of recent deployments and their git hash IDs." %}

GitHub Pages doesn't give you this kind of fine-grained control over deployments. It's actually fairly limited—[you can only deploy to two branches](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source), one of which is `master` by default. So if you want to revert your production build to a prior state, you'll need to do this at the repo level by [resetting to a previous commit with git](/blog/undoing-changes-in-git/#2-resetting-a-branch-to-an-older-commit) and deploying a different branch. There are also no deploy previews, so whatever you publish will go live as soon as it builds.

### 5. Faster Deployments

Netlify builds my site in just 1–2 minutes, on average:

{% include img.html src: "faster-deploys.png", alt: "A list of recent deployments in my Netlify dashboard, along with the time it took each one to deploy from start to finish." %}

Back when I was hosting my site on GitHub Pages, things were much slower, and I'd sometimes have to do a hard refresh to see any updates on prod. GitHub's own documentation notes that you may have to wait up to 20 minutes to see your changes go live:

{% quote "GitHub Docs" "https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-jekyll-build-errors-for-github-pages-sites" %}
  It can take up to 20 minutes for changes to your site to publish after you push the changes to GitHub.
{% endquote %}

Unfortunately, GitHub Pages also caps you at **only 10 builds per hour**. So if you're frequently pushing to your deployment branch (which you probably shouldn't be doing anyway), you may run into trouble:

{% quote "GitHub Docs", "https://help.github.com/en/github/working-with-github-pages/about-github-pages#guidelines-for-using-github-pages" %}
  If your site exceeds these usage quotas, we may not be able to serve your site, or you may receive a polite email from GitHub Support or GitHub Premium Support suggesting strategies for reducing your site's impact on our servers, including putting a third-party content distribution network (CDN) in front of your site, making use of other GitHub features such as releases, or moving to a different hosting service that might better fit your needs.
{% endquote %}

Netlify has a much more generous soft cap of **3 builds per minute**. You also get **300 build minutes per month** and **100 GB data usage** with its free tier, which is more than enough for most needs.

{% include img.html src: "billing.png", alt: "Netlify's dashboard shows billing information for things such as data usage and build minutes used." %}

Build minutes are just Netlify's currency for a billing cycle. If you're a free user, this means that your builds can't exceed 300 minutes total for one month. Next month, your usage resets to 0. You don't have to pay anything as long as your usage doesn't exceed this limit.


### 6. UI- and File-Based Configurations

Netlify lets you configure your builds using either the Netlify UI or a `netlify.toml` configuration file at the root of your repo. This file houses your build commands, the directory to publish, redirect rules, response headers, plugins to use and the options they accept, post-processing steps, and [other settings](https://docs.netlify.com/configure-builds/file-based-configuration/). The customization options for GitHub Pages are limited to whatever is offered under the repo Settings page.

### 7. Support for Deploying Private Repos

If you're a free GitHub user, then GitHub Pages will only be able to build your public repos. You can get it to also build private repos, but you'll have to purchase one of the Pro plans, the least expensive of which is GitHub Teams at $4/month. Netlify, on the other hand, can build both public and private repos for free. Slap on a custom .com domain from Google Domains for just $12/year, and you're all set.

This may not matter if you don't intend to publish any private repos, but some people do prefer to keep their source code private, so it's a nice added bonus of using Netlify. If you ever want to make your source code private, it won't affect Netlify so long as you've correctly [linked your Netlify access token to GitHub](https://docs.netlify.com/configure-builds/repo-permissions-linking/).

### 8. Proper 301 Redirects

This one's a big deal if you value your site's SEO.

If one of your URLs changes, Google will need to know that the old and new version share the same content and that your search results listing should be updated. The proper way to do this is with a [301 redirect](https://support.google.com/webmasters/answer/93633?hl=en), but GitHub Pages doesn't let you configure redirects for your site's URLs. You'll have to handle this in your source code, like using the [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) plugin for Jekyll, [gatsby-redirect-from](https://www.gatsbyjs.com/plugins/gatsby-redirect-from/) for Gatsby, and so on.

On the other hand, redirects in Netlify are [super easy to set up](https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file). All you need to do is create a plaintext `_redirects` file that maps old URLs to new ones, separating the two with a tab:

{% include codeHeader.html file: "_redirects" %}
```
/old-url/   /new-url/
/another-old-url /another-new-url
```

Make sure this file is included in your site's build output, and Netlify will handle the rest for you.

## Tips for Switching From GitHub Pages to Netlify

If you run a blog on a GitHub Pages domain and it gets decent traffic, you'll want to be careful about how you go about switching hosting providers since `.github.io` domains are reserved by GitHub, and you can't carry these over to a different hosting provider (like Netlify).

I recommend that you keep your old GitHub Pages repository around temporarily, separate from your new site. This allows you to set up custom 301 redirects (e.g., using one of the plugins mentioned above) that point from your old GitHub Pages site to your new site so that your search engine rankings don't tank.

You can also use the [Change of Address Tool](https://support.google.com/webmasters/answer/9370220?hl=en) right there in Google Search Console to migrate your old site's traffic to your new one, once you've set up 301 redirects:

{% include img.html src: "migration.png", alt: "Migrating my old search engine results to my new domain using Google Search Console's change of address tool." %}

Keep an eye on your Google Search Console over the next few months following your migration. Once things stabilize, you can make your old repo private or delete it altogether, taking it off of GitHub Pages.

A few months after migrating my site this way, I took down my `.github.io` domain. My search engine rankings were stable throughout this migration period thanks to the redirects I had set up.

## Here's to a New Era

Okay, so that's obviously a slight exaggeration—all I really did is switch hosting providers!

However, the future looks very promising for Netlify—it recently secured a whopping [$53 million in Series C funding](https://www.netlify.com/press/after-onboarding-800000-developers-netlify-raises-53m-in-series-c-funding-to-fuel-enterprise-growth/). Past investors of the company have included founders from GitHub, Slack, Yelp, and other big names, so people clearly see value in its business.

Having switched from GitHub Pages to Netlify, I feel like I have far more control over my site. The only downside is that if I want to take advantage of more features, their [paid plans are pretty expensive](https://www.netlify.com/pricing/). But I don't anticipate this being a problem—the free tier has everything I need, and then some.
