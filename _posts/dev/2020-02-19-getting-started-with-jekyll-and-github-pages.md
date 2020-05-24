---
title: "Getting Started with Jekyll and GitHub Pages: Your First Website"
description: Jekyll is a static site generator that makes it easy for you to create a website and blog. If you're interested in getting started with Jekyll and GitHub Pages, this in-depth guide is for you.
keywords: [getting started with jekyll, jekyll and github pages]
tags: [dev, jekyll, frontend, github]
isCanonical: true
---

Want to make a personal website or blog and share it with the world? Then you've come to the right place! This is the only guide you'll need for getting started with Jekyll. I'll take you from zero to hero with Jekyll and help you understand all the fundamentals.

{% include picture.html img="thumbnail-large" ext="PNG" alt="Jekyll and GitHub Pages." shadow=false %}

I moved my old site from pure HTML and CSS to Jekyll a while back and immediately fell in love. There's very little that Jekyll doesn't allow you to accomplish, so it's a perfect, lightweight option for beginners and veterans alike.

Note that some parts of this tutorial assume that you'll be hosting your site with GitHub Pages. If instead you're hosting your site with Netlify or another service, the process should be very similar, and the core concepts of building a site with Jekyll certainly won't change.

All right, enough chit-chat—let's dig in!

{% include linkedHeading.html heading="Table of Contents" level=2 %}

- [Overview: What Is Jekyll?](#overview-what-is-jekyll)
- [How to Set Up GitHub Pages](#how-to-set-up-github-pages)
- [Getting Started with Jekyll](#getting-started-with-jekyll)
  - [1. Installing Jekyll](#1-installing-jekyll)
  - [2. Setting Up Your First Jekyll Site](#2-setting-up-your-first-jekyll-site)
  - [3. Configuring Jekyll with GitHub Pages](#3-configuring-jekyll-with-github-pages)
  - [4. Running Jekyll Locally](#4-running-jekyll-locally)
  - [5. Pushing Your Site to GitHub](#5-pushing-your-site-to-github)
- [Typical Jekyll Directory Structure](#typical-jekyll-directory-structure)
- [Configuring Your Jekyll Site](#configuring-your-jekyll-site)
- [How to Create Pages in Jekyll](#how-to-create-pages-in-jekyll)
  - [What Is Markdown Front Matter?](#what-is-markdown-front-matter)
    - [Front Matter Defaults](#front-matter-defaults)
- [Where Do I Put My Pages in Jekyll?](#where-do-i-put-my-pages-in-jekyll)
- [Jekyll Blog Posts](#jekyll-blog-posts)
  - [Permalinks to Blog Posts in Jekyll](#permalinks-to-blog-posts-in-jekyll)
  - [You Don't Need an Explicit Date Variable](#you-dont-need-an-explicit-date-variable)
  - [Blog Post Front Matter Variables](#blog-post-front-matter-variables)
  - [Syntax Highlighting](#syntax-highlighting)
- [Dr. Jekyll and Mr. Liquid](#dr-jekyll-and-mr-liquid)
  - [Data Types](#data-types)
  - [Template Tags](#template-tags)
  - [Variables](#variables)
  - [Control Flow](#control-flow)
  - [Objects](#objects)
  - [Operators](#operators)
  - [Filters](#filters)
- [Using Jekyll Layout Files to Structure Pages](#using-jekyll-layout-files-to-structure-pages)
  - [Using More Than One Layout](#using-more-than-one-layout)
- [Writing CSS in Jekyll Using SASS](#writing-css-in-jekyll-using-sass)
  - [Modular CSS with SASS Imports](#modular-css-with-sass-imports)
- [Creating Reusable Components with Includes](#creating-reusable-components-with-includes)
- [Taking Advantage of Jekyll Data Files](#taking-advantage-of-jekyll-data-files)
  - [Example 1: Skills and Abilities](#example-1-skills-and-abilities)
  - [Example 2: Author Bios](#example-2-author-bios)
  - [Example 3: Tag Descriptions](#example-3-tag-descriptions)
- [Setting Up Google Search Console](#setting-up-google-search-console)
  - [Is It Safe to Upload the Google Search Console Verification File?](#is-it-safe-to-upload-the-google-search-console-verification-file)
- [GitHub Pages Support for Jekyll Plugins](#github-pages-support-for-jekyll-plugins)

{% include linkedHeading.html heading="Overview: What Is Jekyll?" level=2 %}

Jekyll is a **static site generator**. That's just a fancy way of saying that it takes a bunch of HTML, Markdown, CSS, and JavaScript source files, combines them as needed based on layout files that you've specified, processes any template code that you've written, and spits out a build directory (e.g., `_site/`) that basically houses all of your website's content, ready for hosting on a web server (like GitHub Pages!).

{% include picture.html img="static-site-generator" ext="PNG" alt="A static site generator spits out a compiled, well-structured, fully functioning site." shadow=false %}

In plain English, Jekyll makes it easy for you to create a website—and, more commonly, a blog—with plain old HTML and Markdown, without having to worry about things like how to add tags to posts or make certain static data accessible on all of your pages. It takes care of these things for you so you can focus on doing what you love the most: writing (or, in my case, writing *and* dev)!

[GitHub Pages](https://help.github.com/en/github/working-with-github-pages/about-github-pages), on the other hand, is a free hosting service for static sites that's offered by GitHub to all of its users. And since GitHub accounts are practically *free real estate*, there's really never been a better time to make your very own website or blog.

The best part? GitHub Pages supports ([and even recommends](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll)) Jekyll out of the box, meaning you can set up a Jekyll project *right now*, push the source code to a GitHub repository, and view the live website!

{% include linkedHeading.html heading="How to Set Up GitHub Pages" level=2 %}

If you've already set up your GitHub Pages repo, feel free to [skip this section](#getting-started-with-jekyll).

You can create as many GitHub Pages sites as you want. Each user can only create one site whose domain is `https://yourUsername.github.io`. All other repo sites go under `https://yourUsername.github.io/repoName`. GitHub even [lets you configure your own custom domain](https://help.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site) if you have one.

To get started, visit [https://github.com/](https://github.com/), sign in, and click the green `New` button to create a new repo:

{% include picture.html img="new-repo" ext="PNG" alt="Click the green new button to create a repository." shadow=false %}

Enter the name of your repository. It needs to be your GitHub username followed by `.github.io`:

{% include picture.html img="create-repo" ext="PNG" alt="Type in the name of your new repository." shadow=false %}

That's literally all you have to do to get started with GitHub Pages! As with other repos you own, you'll want to clone it locally and set up your origin remote.

If you want to use any starter themes, GitHub goes over those [in its documentation for GitHub Pages](https://guides.github.com/features/pages/). Disclaimer: I'm not sure how these work with Jekyll, so you're on your own if you take that route.

{% include linkedHeading.html heading="Getting Started with Jekyll" level=2 %}

Now that we've set up GitHub Pages, we'll go over everything you need to know to get started with Jekyll. For the remainder of this tutorial, I'll assume you're using Bash as your terminal, either on a Mac/Linux or with the [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/learn/modules/get-started-with-windows-subsystem-for-linux/). I'm sure there's a reasonably painful way to do this all on a Windows terminal like PowerShell, but I wouldn't advise it... because Windows.

{% include linkedHeading.html heading="1. Installing Jekyll" level=3 %}

Jekyll has an excellent, in-depth [installation guide](https://jekyllrb.com/docs/installation/) for each OS, so I'll let you read that instead of copy-pasting it all here. If you follow the Ubuntu guide, which is what I use via WSL, you'll install these three things:

1. **Ruby**, the programming language that powers Jekyll.
2. **Bundler**, a Ruby gem (think "module") that lets you easily manage your project's dependencies.
3. **Jekyll**, obviously.

If you're familiar with npm and yarn, Bundler is basically the same idea except for Ruby—it manages your dependencies (gems) via two files called `Gemfile` and `Gemfile.lock`, which we'll see shortly.

{% include linkedHeading.html heading="2. Setting Up Your First Jekyll Site" level=3 %}

Assuming that everything went well, it's time to make your first Jekyll site.

Running this command will set up a folder named `mysite` with all of the necessary starter files and directories:

{% capture code %}bundle exec jekyll new mysite{% endcapture %}
{% include code.html code=code lang="bash" %}

If you already have existing source files in a project directory for your site, you can instead run this:

{% capture code %}cd mysite
bundle exec jekyll new . --force{% endcapture %}
{% include code.html code=code lang="bash"%}

> **Warning**: The second option may end up overwriting existing files. Alternatively, you could set up the project in a different directory and copy over the files when it's done so you have more control.

The end result should be this simple directory structure:

{% include picture.html img="directory-structure" ext="JPG" alt="Jekyll starter files." shadow=false %}

{% include linkedHeading.html heading="3. Configuring Jekyll with GitHub Pages" level=3 %}

Go ahead and open up the Gemfile at the root of your project. You'll find useful comments in there to help you configure Jekyll with GitHub Pages:

{% capture code %}source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
gem "github-pages", group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.6"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?{% endcapture %}
{% include code.html file="Gemfile" code=code lang="ruby" copyable=false %}

First, remove this line if you intend to publish your site on GitHub Pages:

```ruby
gem "jekyll", "~> 3.8.6"
```

And then uncomment the line specifying the `github-pages` gem:

```ruby
# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins
```

I also recommend removing this line to get rid of the default `minima` theme:

```ruby
# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.0"
```

If you do that, you'll also need to remove it from `_config.yml` by setting the theme to `null`:

```yml
# ...

# Build settings
markdown: kramdown
theme: minima # replace minima with null
plugins:
  - jekyll-feed

# ...
```

If you don't use `theme: null`, the `github-pages` gem will automatically generate a default stylesheet, `/_site/assets/css/style.css`, that's about 3k lines long, and that you may not want or need for your site. I recommend setting the theme to `null` so you have control over your styling, but this is up to you.

After doing all of that, run this command to install and update all necessary gems for your site:

{% capture code %}bundle install{% endcapture %}
{% include code.html code=code lang="bash" %}

If all went well, you should see output similar to this:

```
Bundle complete! 5 Gemfile dependencies, 85 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
```

You should also now see a `Gemfile.lock` file at the root of your project. This is like the `package-lock.json` that npm generates, if you've ever worked in a Node ecosystem. This lockfile gets created the first time you run `bundle install`, ensuring that anyone who runs the same command in the future installs the exact versions specified in there. That way, everyone's on the same page.

{% include linkedHeading.html heading="4. Running Jekyll Locally" level=3 %}

Let's fire her up and see what we've got:

{% capture code %}bundle exec jekyll serve --livereload{% endcapture %}
{% include code.html code=code lang="bash" %}

By default, this runs your site on `localhost:4000` with live-reloading enabled, so if you make changes to your files, Jekyll will regenerate the build directory and automatically refresh your page.

You can change the port in one of two ways. The first is to specify the `--port` argument:

{% capture code %}bundle exec jekyll serve --livereload --port 4001{% endcapture %}
{% include code.html code=code lang="bash" %}

The second is to add this line somewhere inside your project's `_config.yml` file:

{% capture code %}port: 4001{% endcapture %}
{% include code.html code=code lang="yml" %}

> **Note**: You can leave the port as `4000` by default. This is just useful to know in case you want to run two Jekyll sites simultaneously on your local since they can't both be on the same port.

Head on over to `localhost:4000` to see the starter page. Note that the appearance of this page depends on how you configured Jekyll in the earlier sections. You may see:

1. The minima theme, which has the most starter content, if you left `theme: minima` as is.
2. A mostly blank page with a title placeholder if you deleted the line `theme: minima`.
3. A completely blank page, if you set `theme: null` explicitly like I recommended.

{% include picture.html img="themes" ext="JPG" alt="The three Jekyll starter themes." shadow=false %}

The remainder of this tutorial assumes that your theme is set to `null`. Some of the screenshots I show may not line up with what you see on your end if you decide to use the minima theme. You may also miss out on learning some useful things about how Jekyll works if you decide to use one of the starter themes instead of writing your own CSS.

{% include linkedHeading.html heading="5. Pushing Your Site to GitHub" level=3 %}

If you haven't already done so, push your Jekyll site to GitHub Pages:

{% capture code %}git add . && git push{% endcapture %}
{% include code.html code=code lang="bash" %}

Then, simply visit `https://yourUsername.github.io` to view the live version of your website.

Congratulations! If you're with me so far, you're done with the hard part. Now, it's time to actually learn how to customize your site. It's important to step out of your comfort zone. Don't worry if you accidentally "break" a file—just undo those changes with Git.

{% include linkedHeading.html heading="Typical Jekyll Directory Structure" level=2 %}

The Jekyll starter is a bare-bones site. In reality, you're going to need more Jekyll-supported directories for different kinds of tasks:

- `_data`: Where you can store data files for things like skills, projects, work history, and so on.
- `_drafts`: Add this to your `.gitignore` and store your blog post drafts in here (optional).
- `_includes`: Where you define Jekyll includes, which are sort of like reusable HTML components.
- `_layouts`: HTML layouts define the structure of your site and can be nested in one another.
- `_posts`: Where you'll store all of your blog posts as Markdown files.
- `_sass`: This is where your SASS partials go. You'll then need to import them in `_assets/main.scss`.
- `_site`: Jekyll's auto-generated build directory, which houses your final, compiled site. It's not pushed to GitHub because it's in `.gitignore`.
- `_assets`: Mainly for storing images and scripts, but it can also house a main CSS file.

You may be wondering why all of these directory names are prefixed by an underscore. A directory with a leading underscore is special and won't get processed by Jekyll. As a result, it won't appear in the build directory, `_site/`.

If none of this makes sense to you right now, or if all of this seems overwhelming, don't worry—I'm going to walk you through most of it step by step. Also note that you are free to add any other directories that you need. 

{% include linkedHeading.html heading="Configuring Your Jekyll Site" level=2 %}

We already saw that you can edit your Jekyll starter theme in `_config.yml`, but that's not all that this file allows you to do. In fact, this file houses your entire site's configuration settings. Here's what mine looks like so far:

{% capture code %}# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely edit after that. If you find
# yourself editing this file very often, consider using Jekyll's data files
# feature for the data you need to update frequently.
#
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'bundle exec jekyll serve'. If you change this file, please restart the server process.

# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.
title: Your awesome title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username:  jekyll

# Build settings
markdown: kramdown
theme: null
plugins:
  - jekyll-feed

# Exclude from processing.
# The following items will not be processed, by default. Create a custom list
# to override the default setting.
# exclude:
#   - Gemfile
#   - Gemfile.lock
#   - node_modules
#   - vendor/bundle/
#   - vendor/cache/
#   - vendor/gems/
#   - vendor/ruby/{% endcapture %}
{% include code.html file="_config.yml" code=code lang="yml" copyable=false %}

We'll understand how all of these settings are used once we cover the Liquid templating language. For now, just keep in mind that you can access most of these settings on all of your pages via a globally exposed `site` variable in a language called Liquid: `site.title`, `site.description`, `site.url`, and so on.

Go ahead and fill in most of these setings (you could also do this later—there's no rush). Additionally, note that you don't need many of the variables that are defined in here, like your email, Twitter username, GitHub username, or your site's base URL, so you can safely delete them. You can also add any other site variables that you'd like.

> **Note**: If you make any changes to this file, you'll need to stop running your site and restart it to see the changes. This is because Jekyll only processes `_config.yml` once when you execute `jekyll serve` and doesn't listen for changes. You shouldn't have to change your config too often.

We'll come back to `_config.yml` in a later section once we've looked at some other Jekyll basics.

{% include linkedHeading.html heading="How to Create Pages in Jekyll" level=2 %}

If you have any experience working with plain old HTML to create sites, you should be familiar with creating an `index.html` file and placing it at the root of your project directory. This is the page that your web server will send back when the client requests your site's root URL (e.g., `https://myawesomesite.github.io/`).

In your project directory, you should see a mostly empty file named `index.md` that looks something like this:

{% capture code %}---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---{% endcapture %}
{% include code.html file="index.md" code=code lang="markdown" copyable=false %}

Files ending in `.md` (or `.markdown`) are written in [Markdown](https://en.wikipedia.org/wiki/Markdown), a widely used markup language that just gets compiled down to HTML. Since it has such a simple syntax, Markdown is often favored in static site generators like Jekyll, Hugo, and GatsbyJS, especially for writing blog posts.

You should be familiar with Markdown if you've ever created a `README.md` file for your repo or posted anything on StackOverflow, which uses a modified Markdown parser. Note that Markdown is, in a sense, "backwards compatible"—you can still write raw HTML in a Markdown file.

Jekyll uses a modified Markdown parser called [kramdown](https://kramdown.gettalong.org/syntax.html), as noted in `_config.yml`:

```yml
# Build settings
markdown: kramdown
```

Kramdown extends Markdown with some useful features, like adding classes and IDs to elements without having to resort to the HTML syntax.

Before moving on, let's modify `index.md` as follows:

{% capture code %}---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

# Hello, Jekyll!{% endcapture %}
{% include code.html file="index.md" code=code lang="markdown" %}

If live-reloading is enabled, you should see your page update automatically to display an `h1` tag. Otherwise, you may need to refresh manually to see this change.

{% include picture.html img="hello-jekyll" ext="PNG" alt="Hello, Jekyll" %}

As I noted earlier, you can optionally also use plain HTML to get the same result:

{% capture code %}---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<h1 id="hello-jekyll">Hello, Jekyll!</h1>{% endcapture %}
{% include code.html file="index.md" code=code lang="markdown" %}

Notice that we have to specify the ID explicitly with HTML, whereas Markdown does it automatically for us. If you wanted to, you could achieve the same result using Kramdown's ID specifier:

{% capture code %}---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

# Hello, Jekyll {#hello-jekyll}{% endcapture %}
{% include code.html file="index.md" code=code lang="markdown" %}

To understand more about what goes on behind the scenes in Jekyll, go ahead and expand your Git-ignored `_site` directory. Remember that this is the build directory that Jekyll creates each time you change a file, while `jekyll serve` is running. You should see that there's an `index.html` in there. Open that up to see its contents:

{% capture code %}<h1 id="hello-jekyll">Hello, Jekyll!</h1>{% endcapture %}
{% include code.html file="_site/index.html" code=code lang="html" %}

This reveals an interesting point that will become important later: Where a file ends up in `_site/` depends on where it is placed in your project directory. In our case, the `index.md` at the root of our project directory becomes `index.html` at the root of `_site/`.

{% include linkedHeading.html heading="What Is Markdown Front Matter?" level=3 %}

Notice that the comments at the top of `index.md` mention that you can add custom "front matter" to the file. What exactly does that mean?

This is once again a common feature in static site generators. Anything between the triple-hyphen block at the top of a page is known as **YAML front matter**, which is just a fancy way of saying it defines certain metadata that you can later use to customize your pages, using YAML as the language. Note that you can add front matter to HTML files, too, not just to Markdown files.

```yml
---
layout: home
---
```

Currently, `index.md` defines a variable named `layout` that's assigned a value of `home`. This doesn't actually do anything yet because we haven't created any layout files (don't worry—we'll learn how to do that in a later section). We even get build warnings for this and a few of our other files:

```
Build Warning: Layout 'post' requested in _posts/2020-02-14-welcome-to-jekyll.markdown does not exist.
Build Warning: Layout 'default' requested in 404.html does not exist.      
Build Warning: Layout 'page' requested in about.md does not exist.
Build Warning: Layout 'home' requested in index.md does not exist.
```

Note that there are **predefined front matter variables** (like `layout`) that Jekyll recognizes by default and uses to change how a page looks or behaves, without you having to explicitly define what it should do with those variables. In this case, Jekyll uses the `layout` variable to structure your page's HTML according to a layout file, if you've defined one (more on that later). Check out the official Jekyll docs for the full list of [predefined variables](https://jekyllrb.com/docs/variables/).

You can also define any number of **custom front matter variables** for your own use:

```yml
---
myAwesomeVariable: 42
majorKey: Success
---
```

Since these are not among the predefined front matter variables that Jekyll recognizes, it doesn't know what to do with them, so you'll have to use them yourself via Liquid to achieve your desired result (whatever that may be). We'll learn more about this once we get to the section on Liquid.

While we're on the topic of front matter, go ahead and open up the starter blog post that Jekyll created for us. On my end, it's located under `_posts/2020-02-14-welcome-to-jekyll.markdown` and has this content:

{% capture code %}{% raw %}---
layout: post
title:  "Welcome to Jekyll!"
date:   2020-02-14 07:40:59 -0500
categories: jekyll update
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/{% endraw %}{% endcapture %}
{% include code.html file="_posts/2020-02-14-welcome-to-jekyll.markdown" code=code lang="markdown" %}

There's a lot of useful information in this template, so give that a read if you're interested. But note once again the front matter block at the top of the file:

```markdown
---
layout: post
title:  "Welcome to Jekyll!"
date:   2020-02-14 07:40:59 -0500
categories: jekyll update
---
```

This time, we define variables for the title of the post, the date when the post was published, and any categories that this post belongs to. We've also declared its layout (but again, that layout file does not yet exist, so it has no effect). All of these variables can be used later on to customize our post pages, like showing the post title in the browser tab. You can learn more about how to use front matter in the [Jekyll docs](https://jekyllrb.com/docs/front-matter/).

{% include linkedHeading.html heading="Front Matter Defaults" level=4 %}

So far, we've seen two pages that have used the [predefined global variable](https://jekyllrb.com/docs/front-matter/#predefined-global-variables) named `layout`, even though we don't yet know what this does or what layouts are in Jekyll.

The starter post that we saw earlier has a layout of `post`. Surely all of our other posts should have it too, right? If a layout defines the structure of a page, then we'd ideally want all of our blog posts to have the same structure or "skeleton." But do we really have to repeat `layout: post` in each post's front matter block?

Nope! Open up your `_config.yml`, and add this YAML somewhere (anywhere):

{% capture code %}defaults:
  -
    scope:
      type: posts
      path: _posts
    values:
      isPost: true
      layout: post
  -
    scope:
      type: pages
      path: _pages
    values:
      isPost: false
      layout: default{% endcapture %}
{% include code.html code=code lang="yml" %}

And then restart your server.

Jekyll allows you to define **front matter defaults** like we've done here by scope, which you can narrow down using either a path or file type. The above defaults are equivalent to doing this manually in each post that we create under `_posts/`:

{% capture code %}---
isPost: true
layout: post
---{% endcapture %}
{% include code.html file="_posts/2020-02-14-an-awesome-post.md" code=code lang="markdown" copyable=false %}

And doing this manually for each page—like our home page, experience page, contact page, and so on—that we create under a directory named `_pages/`:

{% capture code %}---
isPost: false
layout: default
---{% endcapture %}
{% include code.html file="_pages/contact.md" code=code lang="markdown" copyable=false %}

This is a common pattern that you'll run into in Jekyll: If you find yourself repeating something tediously, there's probably a better, less redundant way to do it.

{% include linkedHeading.html heading="Where Do I Put My Pages in Jekyll?" level=2 %}

This is one of the first questions I asked when I was just getting started with Jekyll, and it's one that I hope to answer here in as much detail as possible.

We've already seen that our posts go under `_posts/`. So where do our files go for things like the landing page, an experience page, a blog page, or a contact page?

By default, Jekyll looks for all of your site's pages at the root of your project directory. This is to ensure that, for example, `index.html` appears under `_site/index.html` once your site is built, as we saw in the previous section.

The Jekyll starter already comes with two such files at the root of the project: `index.md` (which gets compiled to `index.html`) and `about.md` (which gets compiled to `about.html`). However, as you can imagine, dumping all of your non-post page files into the root of the project directory is not ideal if you want to keep things organized, especially if you end up having lots of pages. So instead, we can store our pages in a custom `_pages/` directory and tell Jekyll where to look for them.

First, create this directory, either via a UI or Bash:

{% capture code %}mkdir _pages{% endcapture %}
{% include code.html code=code lang="bash" %}

After doing that, go ahead and move `index.md` and `about.md` into this directory:

```
├── _pages      
│   ├── about.md
│   └── index.md
```

Now you should see the following page instead of the `index.html` from earlier:

{% include picture.html img="webrick" ext="PNG" alt="The WEBrick server for our Jekyll site." %}

Hmm... Our `index.html` and `about.html` pages have vanished! Plus, our newly created `_pages/` directory is nowhere to be found. The latter behavior is expected because the directory has a leading underscore—and if you'll recall, Jekyll doesn't process those kinds of directories unless you tell it to.

It's not Jekyll's fault that our two pages disappeared—we didn't tell it where to look for those files after we moved them to our custom `_pages/` directory. So when we request `index.html` by visiting our localhost's root, we're just given the `_site/` directory.

Open up your `_config.yml` and add this line somewhere:

{% capture code %}include: [_pages]{% endcapture %}
{% include code.html code=code lang="yml" %}

This command defines an array of directories that Jekyll should process when it goes to build your site. In this case, we've defined an array of just one directory: `_pages/`.

> The opposite of `include` is, as expected, `exclude`. Check out the commented block at the very bottom of your `_config.yml`, and you'll see that some files, like `Gemfile` and others, are excluded from processing by default. You can exclude other files by explicitly defining an `exclude` list.

Now let's restart the server:

{% include picture.html img="webrick2" ext="PNG" alt="The WEBrick server for our Jekyll site." %}

Okay, it looks like that added `_pages/` to our build directory, and we can now see an `about/` directory that presumably stores our about page. But it's still not serving our index properly when we visit `localhost:4000`.

The final step is to [specify permalinks to our pages](https://jekyllrb.com/docs/permalinks/) using a predefined front matter variable named `permalink`:

{% capture code %}---
permalink: /
---

# Hello, Jekyll!{% endcapture %}
{% include code.html file="_pages/index.md" code=code lang="markdown" %}

If you open up `about.md`, you'll notice that it already had a relative permalink defined in its front matter block:

{% capture code %}---
layout: page
title: About
permalink: /about/
---

This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](https://jekyllrb.com/)

You can find the source code for Minima at GitHub:
[jekyll][jekyll-organization] /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at GitHub:
[jekyll][jekyll-organization] /
[jekyll](https://github.com/jekyll/jekyll)


[jekyll-organization]: https://github.com/jekyll{% endcapture %}
{% include code.html file="_pages/about.md" code=code lang="markdown" copyable=false %}

This explains why we saw the `about/` directory in an earlier screenshot.

Save your changes, and Jekyll will rebuild the `_site/` directory. If you refresh `localhost:4000`, you should see the `Hello, Jekyll` heading that we created before.

If you want to navigate to the About page, simply add `/about/` to the end of `localhost:4000` in your browser's navigation bar. Or you can use navigation links on your page:

{% capture code %}---
permalink: /
---

# Hello, Jekyll!

Check out these other pages:

- [About](/about/){% endcapture %}
{% include code.html file="_pages/index.md" code=code lang="markdown" %}

Result:

{% include picture.html img="about" ext="GIF" alt="Navigating to the About page." %}

Awesome! To make sure you understand how all of this works under the hood, let's take a peek at the `_site/` directory that Jekyll generated for us automatically:

```
_site
_site
├── 404.html
├── about
│   └── index.html
├── blog
│   └── jekyll
│       └── update
│           └── 2020
│               └── 02
│                   └── 14
│                       └── welcome-to-jekyll.html
├── feed.xml
└── index.html
```

Interesting! Now you can continue creating other pages using Markdown under `_pages/`, remembering to add permalinks to each one—like `/experience/`, `/contact/`, and so on. Jekyll will generate separate directories for each of these pages under `_site/` using your specified permalinks, just like it did with `about/`, and plop in an `index.html` with your compiled Markdown. You'll then be able to navigate to each page.

{% include linkedHeading.html heading="Jekyll Blog Posts" level=2 %}

I want to take a second to demystify some things about blog posts in Jekyll. Most of the lessons here carry over from what we learned about pages; we're just building on what we already know.

{% include linkedHeading.html heading="Permalinks to Blog Posts in Jekyll" level=3 %}

We can give each blog post a permalink, too, just like we did with our pages above. But again, we don't want to have to repeat this every single time we create a post. Let's add a permalink to the defaults in our `_config.yml`:

{% capture code %}defaults:
  -
    scope:
      type: posts
      path: _posts
    values:
      isPost: true
      layout: post
      permalink: /blog/:categories/:title/
  -
    scope:
      type: pages
      path: _pages
    values:
      isPost: false
      layout: default{% endcapture %}
{% include code.html code=code lang="yml" %}

This is the first instance where we see other front matter variables being referenced. In this case, we reference the `categories` and `title` variables defined by each post and use those to create a permalink to each blog post:

```yml
permalink: /blog/:categories/:title/
```

Recall that the starter blog post defines two categories, `jekyll` and `update`, plus the title `Welcome to Jekyll!`:

{% capture code %}---
layout: post
title:  "Welcome to Jekyll!"
date:   2020-02-14 07:40:59 -0500
categories: jekyll update
---{% endcapture %}
{% include code.html file="_posts/2020-02-14-welcome-to-jekyll.markdown" code=code lang="markdown" %}

So now, if we navigate to `localhost:4000/blog/jekyll/update/welcome-to-jekyll`, we should see the blog post:

{% include picture.html img="post" ext="PNG" alt="A sample blog post." %}

Here's what `_site/` looked like before this:

```
_site
├── 404.html
├── about
│   └── index.html
├── blog
│   └── jekyll
│       └── update
│           └── 2020
│               └── 02
│                   └── 14
│                       └── welcome-to-jekyll.html
├── feed.xml
└── index.html
```

And here's what it looks like now:

```
_site
├── 404.html
├── about
│   └── index.html
├── blog
│   └── jekyll
│       └── update
│           └── welcome-to-jekyll
│               └── index.html
├── feed.xml
└── index.html
```

Notice that instead of creating subdirectories for the year, month, and day when a post was published (which is the default permalink if one isn't specified), Jekyll now created subdirectories by nesting categories, then one more directory with the post title, and finally placed `index.html` in there.

By the way, you don't necessarily have to follow this format. You could just have the title if you wanted to, without the categories:

```yml
permalink: /blog/:title/
```

{% include linkedHeading.html heading="You Don't Need an Explicit Date Variable" level=3 %}

The example blog post that Jekyll created for us has this date in its front matter block:

```markdown
---
#...
date:   2020-02-14 07:40:59 -0500
#...
---
```

Even though you are free to define a date explicitly like this, you don't actually *need* to. By default, Jekyll expects your blog post files to use this naming convention and extracts the date information from it, using that date to sort your posts:

```
yyyy-mm-dd-title-of-the-post-slugged.md
```

> **Note**: A "slugged" title is in all lowercase, with all special characters removed, and with hyphens in place of whitespace. Jekyll extracts the title information from your file name. But you often want to define the title explicitly in the post's front matter block because it may contain special characters, like colons, exclamation marks, question marks, apostrophes, and so on.

So the `date` front matter variable is in fact redundant because we already have `2020-02-14` in the file name:

```
2020-02-14-welcome-to-jekyll.markdown
```

To verify this, let's try an experiment. Remove the date from the post's front matter, and replace the file with this:

{% capture code %}{% raw %}---
title:  "Welcome to Jekyll!"
layout: post
categories: jekyll update
---

Welcome to my post! This was published on {{ page.date }}.{% endraw %}{% endcapture %}
{% include code.html file="_posts/2020-02-14-welcome-to-jekyll.markdown" code=code lang="markdown" %}

Open up the post on your local to see the result:

{% include picture.html img="date" ext="PNG" alt="A sample blog post showing its date in the body." %}

This is our first look at the syntax of Liquid, the templating language that Jekyll uses to make development easier. You'll see that `page.date` is among the list of [page variables in Jekyll](https://jekyllrb.com/docs/variables/#page-variables), among many others that you can use.

{% include linkedHeading.html heading="Blog Post Front Matter Variables" level=3 %}

There are three predefined variables unique to Jekyll blog posts:

- `date`: The date when the post was published. If you set this variable, it will override the date in your file name. As we saw earlier, you don't have to specify this if your file name already has the date in it.
- `category` and `categories`: Specify the category or categories, respectively, to which the blog post belongs. Categories can be used for grouping related blog posts in Jekyll.
- `tags`: Tags are very similar to categories in Jekyll. In fact, there's barely any difference between the two.

For example, this blog post that you're reading was written in Markdown and uses the following front matter variables:

```markdown
---
title: "Getting Started with Jekyll and GitHub Pages: Your First Website"
description: Jekyll is a static site generator that makes it easy for you to create a website and blog. If you're interested in getting started with Jekyll and GitHub Pages, this in-depth guide is for you.
keywords: [getting started with jekyll, jekyll and github pages]
tags: [dev, jekyll, frontend, github]
isCanonical: true
---
```

Of these four variables, only `tags` is a predefined one that Jekyll recognizes and processes. The rest—like `title`, `description`, and `keywords`—are for SEO and allow me to customize my page's `head` block using some Liquid templating. If you scroll to the top of this post, you'll see that I've used the `tags` variable to create some clickable tag elements under the post's title.

{% include linkedHeading.html heading="Syntax Highlighting" level=3 %}

Since blog posts use Markdown, and Markdown has support for code blocks, you get syntax highlighting support out of the box with Jekyll.

Older versions of Jekyll used Pygments as the primary syntax highlighter, but now Jekyll uses Rouge. Since Rouge themes are fully compatible with Pygments stylesheets, you can use [any of the pre-existing Pygments themes](https://github.com/jwarby/jekyll-pygments-themes).

Alternatively, you can define your own syntax highlighting theme like I did. Actually, my theme uses the same colors as VS Code for consistency with my screenshots. You can define this theme anywhere in your CSS, as long as it eventually gets linked to the page.

Not sure how to get started with this? Check out [some sample themes](https://gist.github.com/nicolashery/5765395) to see what selectors are being used. Then substitute the colors with your own for whatever highlighter you'd like to use.

{% include linkedHeading.html heading="Dr. Jekyll and Mr. Liquid" level=2 %}

We now arrive at the long-awaited topic that I've been teasing: Liquid. Fluids. *H2O*.

[Liquid](https://help.shopify.com/en/themes/liquid) is a *template language* developed by Shopify with Ruby. Since Jekyll was also written in Ruby, the two are practically a match made in heaven. Here's how it works:

1. You write Liquid template code in an HTML or Markdown file.
2. When Jekyll builds your site, it processes the Liquid templates and substitutes them with actual content.

That's it! Liquid is super simple to use and understand. If you've ever worked with Vue, the two are fairly similar, except Liquid doesn't involve JavaScript. It's also obviously more limited.

While it's technically not a "programming" language, Liquid has many familiar programming constructs. Let's review some of the features of the Liquid templating language so you know what's available to you.

{% include linkedHeading.html heading="Data Types" level=3 %}

Strings? `"Check"`. Numbers? `1`. You also get Booleans, Nil, and arrays.

Arrays are really powerful in Liquid because they allow you to write more reusable markup—more on that later!

It's a bit tricky to give examples of any of these because they require an understanding of other Liquid concepts.

{% include linkedHeading.html heading="Template Tags" level=3 %}

**Template tags** ({% raw %}`{% ... %}`{% endraw %}) allow you to declare variables, evaluate conditions, loop over arrays, and do lots of other essential things in Liquid without any of that code actually showing up on the rendered HTML page. In other words, tags are how you embed template logic into your markup.

Here's an exampe of a template tag:

{% raw %}
```liquid
{% if true %}
    <!-- exude awesomeness -->
{% endif %}
```
{% endraw %}

Like HTML tags, most template tags in Liquid have a matching end tag, often explicitly prefixed with `end`. There are a few exceptions, though, like for assigning values to variables.

Speaking of which...

{% include linkedHeading.html heading="Variables" level=3 %}

Yup, Liquid has variables! Declare them, modify them, reassign them—usual variable stuff.

You use the `assign` tag to declare, or assign a value to, a variable:

{% raw %}
```liquid
{% assign identifier = value %}
```
{% endraw %}

As I mentioned in the previous section, the `assign` tag doesn't need an explicit end tag. This is similar to self-closing vs. explicitly closed tags in HTML.

{% include linkedHeading.html heading="Control Flow" level=3 %}

If and case statements? You bet!

For loops? Yup! Check it out:

{%raw %}
```liquid
{% for element in someArray %}
    <!-- do stuff here -->
{% endfor %}
```
{% endraw %}

Looping is really powerful in Liquid, and there are *lots* of things you can do.

You can limit the number of iterations, like to show only the three most recent blog posts in a teaser:

{% raw %}
```liquid
{% for post in site.posts limit: 3 %}
    <!-- do stuff here -->
{% endfor %}
```
{% endraw %}

Offset a loop at a specified index:

{% raw %}
```liquid
{% for element in someArray offset: 1 %}
    <!-- do stuff here -->
{% endfor %}
```
{% endraw %}

Define a range of numbers to loop over (sort of like in Python):

{% raw %}
```liquid
{% for level in (1..3) %}
    <h{{level}}>This is an h{{level}} tag!</h{{level}}>
{% endfor %}
```
{% endraw %}

And [lots of other neat tricks](https://shopify.github.io/liquid/tags/iteration/).

By the way, what's up with those double curly braces in the last example? You're about to find out!

{% include linkedHeading.html heading="Objects" level=3 %}

No, not like the "objects" in other types of languages.

An **object** in Liquid is anything {% raw %}`{{ in double curly braces }}`{% endraw %}. Objects allow you to *evaluate* whatever expression you place inside the braces so that it renders on the page when processed, unlike anything in tags.

Here's an example of looping through all of the posts in a website and rendering their titles with a Liquid object:

{% raw %}
```liquid
{% for post in site.posts %}
    <h2>{{ post.title }}</h2>
{% endfor %}
```
{% endraw %}

And now, the earlier example should make sense:

{% raw %}
```liquid
{% for level in (1..3) %}
    <h{{level}}>This is an h{{level}} tag!</h{{level}}>
{% endfor %}
```
{% endraw %}

Since objects evaluate their contents, the output will be the following HTML:

```html
<h1>This is an h1 tag!</h1>
<h2>This is an h2 tag!</h2>
<h3>This is an h3 tag!</h3>
```

{% include linkedHeading.html heading="Operators" level=3 %}

Liquid has many of your standard comparison operators, like `==`, `>`, `<=`, and so on, as well as logical operators like `and` and `or`. You also have access to some special operators, like `contains`, for operating on strings, as well as `in` for iterating over arrays (which we've already seen).

{% include linkedHeading.html heading="Filters" level=3 %}

Liquid also has **filters**, which allow you to mutate or process data. They're like the built-in functions you get in many other languages. First comes the data you want to modify, then the piping operator (`|`), and finally the filter itself, which may or may not take an argument.

For example, you can capitalize the first character of a string:

{% raw %}
```liquid
<li>{{ name | capitalize }}</li>
```
{% endraw %}

Notice that this doesn't require any arguments.

Or split one string into an array of strings, using a specified delimiter:

{% raw %}
```liquid
{% assign names = "Billy, Bob, Joel" | split: ', ' %}
<ul>
    {% for name in names %}
    <li>{{ name }}</li>
    {% endfor %}
</ul>
```
{% endraw %}

In this case, we put a colon after the filter name and provide an argument: the delimiter for splitting the string.

We can also sort an array:

{% raw %}
```liquid
{% assign sortedPosts = site.posts | sort: "popularity" %}
```
{% endraw %}

If `popularity` is a valid front matter variable on your posts, then this would use that attribute to sort `site.posts`.

Or append elements to an array:

{% raw %}
```liquid
{% assign myArray = "Billy", "Bob", "Joe" | concat: "Brittany" %}
```
{% endraw %}

And much, *much* more. You get the idea.

Seriously, Liquid is **fantastic**. I highly recommend that you [check out Shopify's documentation](https://shopify.github.io/liquid/) to learn more about it. Shopify has tons of code samples for every item in its API, so you can get pretty far with those alone.

Just be aware that when Googling for certain things, you may need to append "shopify" to your query to avoid seeing physics results for actual *liquids* :)

{% include linkedHeading.html heading="Using Jekyll Layout Files to Structure Pages" level=2 %}

I mentioned layouts several times in the section on front matter variables. Now that we've covered the basics, it's time to finally understand what layouts are all about!

First, let's remind ourselves of these build warnings that Jekyll has been giving us:

```
Build Warning: Layout 'post' requested in _posts/2020-02-14-welcome-to-jekyll.markdown does not exist.
Build Warning: Layout 'default' requested in 404.html does not exist.
Build Warning: Layout 'page' requested in _pages/about.md does not exist.
Build Warning: Layout 'default' requested in _pages/index.md does not exist.
```

**Layout files** are like the skeletons of your website—they define an HTML structure that's common to a group of related pages so they all look consistent, minimizing the amount of repetition that goes into developing your site. Think of a layout file as a placeholder template into which you can plug your content (or potentially nest another layout!).

For example, each page needs to have a `head` block with certain metadata, a `body` for the content, a top (or side) navigation bar, and a sticky footer at the bottom. Many of these components remain the same as you navigate from one page to another, perhaps with slight visual differences to indicate where you currently are on the site (e.g., highlighting the current link on the navigation bar).

This is a perfect use case for layouts—instead of copy-pasting the shared HTML structure each time you create a page, simply assign a layout to the pages that need it!

Layout files in Jekyll are housed under the `_layouts/` directory. Recall that this is one of those directories that Jekyll looks for automatically, assuming it exists. When you specify a `layout` variable in a page's or blog post's front matter block, the value that you assign it needs to be the name of an existing layout file (e.g., `layout: default` if you have a file named `_layouts/default.html`). If that layout file in fact exists, Jekyll will take your HTML or Markdown file and plug it into the layout file's structure.

It's easier to understand this with an example. If we go back to `_pages/about.md`, we'll find a layout declared in its front matter block:

{% capture code %}---
layout: page
title: About
permalink: /about/
---{% endcapture %}
{% include code.html file="_pages/about.md" code=code lang="markdown" copyable=false %}

Let's rename the layout to `default`. Functionally, it doesn't make a difference what we name it, as long as there's a layout file with the same name. It's just that `default` is more idiomatic—it's our website's "default layout."

{% capture code %}---
layout: default
title: About
permalink: /about/
---{% endcapture %}
{% include code.html file="_pages/about.md" code=code lang="markdown" %}

Let's do the same for `_pages/index.md` and give the page a title as well, while we're at it:

{% capture code %}---
layout: default
title: Home
permalink: /
---

# Hello, Jekyll!

This is the home page.{% endcapture %}
{% include code.html file="_pages/index.md" code=code lang="markdown" %}

Let's also create two other pages, `blog.md` and `contact.md`:

{% capture code %}{% raw %}---
layout: default
title: Blog
permalink: /blog
---

{% include linkedHeading.html heading="My Blog Posts" level=2 %}

<ul>
  {% for post in site.posts %}
  <li><a href="{{ post.url }}" class="post-preview">{{ post.title }}</a></li>
  {% endfor %}
</ul>{% endraw %}{% endcapture %}
{% include code.html file="_pages/blog.md" code=code lang="markdown" %}

{% capture code %}---
layout: default
title: Contact
permalink: /contact
---

{% include linkedHeading.html heading="Contact" level=2 %}

Get in touch!

<form>
  <!-- Form stuff -->
</form>{% endcapture %}
{% include code.html file="_pages/contact.md" code=code lang="markdown" %}

Next, create the `_layouts/` directory and add a file to it named `default.html` with these contents:

{% capture code %}{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ page.title }} - {{ site.title }}</title>
</head>
<body>
    <nav>
        <ul class="nav-links">
            <li><a href="/" {% if page.title == "Home" %}class="active-page"{% endif %}>Home</a></li>
            <li><a href="/about" {% if page.title == "About" %}class="active-page"{% endif %}>About</a></li>
            <li><a href="/blog" {% if page.title == "Blog" %}class="active-page"{% endif %}>Blog</a></li>
            <li><a href="/contact" {% if page.title == "Contact" %}class="active-page"{% endif %}>Contact</a></li>
        </ul>
    </nav>
    <main class="page-content">
        {{ content }}
    </main>
    <footer>
        Proudly made with Jekyll
    </footer>
</body>
</html>{% endraw %}{% endcapture %}
{% include code.html file="_layouts/default.html" code=code lang="html" %}

It's your typical HTML file. Let's check it out:

{% include picture.html img="default-layout" ext="GIF" alt="The default layout." %}

Notice how we take advantage of Liquid several times to customize our pages. For example, the layout file customizes the title bar of each page using front matter variables we defined. The navigation bar applies a class of `active-page` selectively, depending on what page we're currently on. You can then select this element with CSS and style it accordingly to make it more prominent than the other links.

The most important part is {% raw %}`{{ content }}`{% endraw %}, which you should recognize to be a Liquid object. This is a reserved variable that refers to the literal contents of whatever file Jekyll is currently processing that has its `layout` set to this layout's name. So, when Jekyll goes to process `_pages/index.md`, encounters the layout variable, and goes to process `_layouts/default.html`, the `content` variable will refer to the contents of `index.md`.

One final note: If you want to change the site title that appears after the dash in the address bar, then simply change that variable in your `_config.yml` as I mentioned before:

{% capture code %}# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.
title: Your awesome title{% endcapture %}
{% include code.html file="_config.yml" code=code lang="yml" %}

{% include linkedHeading.html heading="Using More Than One Layout" level=3 %}

If you open up the starter blog post that we saw earlier, you'll notice that it has a different layout set:

{% capture code %}---
layout: post
title:  "Welcome to Jekyll!"
categories: jekyll update
---{% endcapture %}
{% include code.html file="_posts/2020-02-14-welcome-to-jekyll.markdown" code=code lang="markdown" copyable=false %}

The blog post collapses to a "flat" layout and doesn't have the same HTML structure as the other pages:

{% include picture.html img="collapsed-layout" ext="PNG" alt="The starter blog post has a collapsed layout." %}

This is because the `post` layout doesn't exist. Let's go ahead and create this layout file. This time around, you'll notice that a layout file can itself specify a layout:

{% capture code %}{% raw %}---
layout: default
---

<article id="post">
    <header class="post-header">
        <h1 class="post-title">{{ page.title }}</h1>
        <div class="post-date">{{ page.date | date: "%b %-d, %Y" }}</div>
        <ul class="post-categories">
            {% for category in page.categories %}
            <li class="post-category">{{ category }}</li>
            {% endfor %}
        </ul>
    </header>
    {{ content }}
</article>{% endraw %}{% endcapture %}
{% include code.html file="_layouts/post.html" code=code lang="html" %}

Open up the post, and you'll now see that it has the same base layout as all your other pages, but it also has a nested layout specific to blog posts:

{% include picture.html img="post-layout" ext="PNG" alt="The post layout." %}

Awesome!

You've essentially mastered 90% of Jekyll at this point. Only a few topics remain!

{% include linkedHeading.html heading="Writing CSS in Jekyll Using SASS" level=2 %}

What's a great site without some CSS to make it look pretty?

Jekyll has [built-in support for SASS](https://jekyllrb.com/docs/assets/), a CSS preprocessor that allows you to take advantage of things like variables, mixins, functions, selector nesting, and lots more, making it easier to write maintainable stylesheets.

If you don't want to use SASS, you're more than welcome to use plain CSS. The only downside is that you won't be able to take advantage of the many great features that SASS brings to the table.

{% include linkedHeading.html heading="Modular CSS with SASS Imports" level=3 %}

Like pure CSS, SASS allows you to use `@import` directives to assemble your stylesheets in a modular manner. But it's actually better because it doesn't trigger an additional HTTP call—it's merely for your convenience so you can split up your styles across well-named, more manageable files. The contents of those imports will be plugged in as-is and *then* transpiled to CSS.

It's worth noting that there are two places where it's suitable to place CSS files in Jekyll: `_sass/` and `assets/`. Notice that the former directory has a leading underscore, whereas the latter does not. If you'll recall, any directory in Jekyll that's preceded by an underscore will not be processed or included in the build output directory, `_site/`. This means that if you put all of your modular stylesheets under `assets/`, they'll get transpiled into a bunch of disjoint CSS stylesheets, whereas you really want a single stylesheet.

With this in mind, a typical SASS workflow in Jekyll is to create a single file named `/assets/styles/main.scss` (known as a **SASS manifest**), store your modular stylesheets under `_sass/`, and then consolidate all of those imports in the manifest for transpilation. The result is a single, transpiled CSS stylesheet containing all of the styles that you imported.

For example, on my site, I keep my SASS manifest under `assets/styles/main.scss`. When Jekyll compiles my site, this file becomes `_site/assets/styles/main.css`. Then, as long as you include this stylesheet in the head of your `default` layout, it will load on the page:

```html
<link rel="stylesheet" type="text/css" href="/assets/styles/main.css">
```

Notice that we reference the compiled version (`.css`) that's going to live under `_site/` once your site is built, not the `.scss` version that we have access to only in the precompiled source.

Meanwhile, this is what my manifest looks like:

{% capture code %}---
---

@import 'components/topnav';
@import 'general/themes';
@import 'general/general';
@import 'pages/index';
@import 'pages/experience';
@import 'components/cardGrid';
@import 'components/card';
@import 'pages/contact';
@import 'blog/posts';
@import 'components/button';
@import 'components/collapsible';
@import 'components/tag';
@import 'components/tooltip';
@import 'general/highlight';
@import 'components/footer';{% endcapture %}
{% include code.html file="/assets/styles/main.scss" code=code lang="sass" %}

**The empty front matter block at the top is crucial**—if you don't include it, Jekyll won't process this file, and we *need* Jekyll to process the file so that it generates `/assets/styles/main.css`.

And here's what my `_sass/` directory looks like, in case you're curious:

```
_sass
├── blog
│   └── posts.scss
├── components
│   ├── button.scss
│   ├── card.scss
│   ├── cardGrid.scss
│   ├── collapsible.scss
│   ├── footer.scss
│   ├── tag.scss
│   ├── tooltip.scss
│   └── topnav.scss
├── general
│   ├── general.scss
│   ├── highlight.scss
│   └── themes.scss
├── pages
│   ├── contact.scss
│   ├── experience.scss
│   └── index.scss
├── colors.scss
├── mixins.scss
└── settings.scss
```

Creating modular stylesheets and importing them into a SASS manifest makes it much easier to find a particular style that you need to tweak. For example, if I need to adjust a style related to cards, I know I just need to open up `_sass/components/_card.scss`.

Let's give this a shot. Create a file named `_sass/_general.scss` with this styling (or really anything you want):

{% capture code %}* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-size: 18px;
  font-family: Arial;
}{% endcapture %}
{% include code.html file="_sass/_general.scss" code=code lang="scss" %}

And then create this file:

{% capture code %}---
---

@import 'general';{% endcapture %}
{% include code.html file="assets/styles/main.scss" code=code lang="scss" %}

Once your site rebuilds, you'll find this new file:

```
_site/assets/styles
└── main.css
```

Here's what the transpiled, minified stylesheet looks like:

{% capture code %}* { box-sizing: border-box; margin: 0; padding: 0; }

body { font-size: 18px; font-family: Arial; }{% endcapture %}
{% include code.html file="_site/assets/styles/main.css" code=code lang="css" copyable=false %}

Finally, don't forget to link the stylesheet to your `default.html` layout. Just add this to your `head`:

{% capture code %}<link rel="stylesheet" type="text/css" href="/assets/styles/main.css">{% endcapture %}
{% include code.html file="_layouts/default.html" code=code lang="html" %}

Here's what your site should now look like:

{% include picture.html img="styled" ext="PNG" alt="The styled version of the site." %}

Need to add more styles? Simply create a new SASS stylesheet under `_sass/`, possibly in a nested subdirectory to keep things organized, and then just import it into your manifest. It's that easy.

{% include linkedHeading.html heading="Creating Reusable Components with Includes" level=2 %}

With other static site generators like Gatsby, you can take advantage of frameworks such as React to create reusable components. But what if I told you that you can still create components in Jekyll?

I'm talking about **Jekyll includes**. They're a simple way to reduce repetition in your markup and to create reusable "components" that you can plug in wherever they're needed. Jekyll literally takes the contents of an include file and dumps them wherever the file was included. It's a bit more involved than that, though, because Jekyll includes can take arguments (sort of like props in React!).

Includes are created under the `_includes/` directory. An include file is simply an HTML or Markdown file like any other. The only difference is that an include file has access to a special variable named `include`. The arguments ("props") that you pass in to an include are then accessible under `include.nameOfVariable`.

For example, let's say you want to use tooltips on your site but don't want to have to copy-paste the same HTML each time you want to use one on a page. This is a perfect use case for includes:

{% capture code %}{% raw %}<div class="tooltip tooltip-{{ include.position }}">
    <div class="tooltip-text">
        {{ include.text }}
    </div>
</div>{% endraw %}{% endcapture %}
{% include code.html file="_includes/tooltip.html" code=code lang="html" %}

Here's how we might include a tooltip in another file:

{% capture code %}{% raw %}{% include tooltip.html position="top" text="This is a tooltip!" %}{% endraw %}{% endcapture %}
{% include code.html code=code lang="liquid" %}

The processed HTML will look like this:

```html
<div class="tooltip tooltip-top">
    <div class="tooltip-text">
        This is a tooltip!
    </div>
</div>
```

Note that if `var` is not provided, `include.var` will default to Nil (undefined).

One last thing worth noting is that includes can be nested, just like layouts can be. So that means you can include as many includes as you want... in your includes 😅.

Here are some example use cases for Jekyll includes:

**Inlined SVGs**: You can use something like [Font-Awesome-SVG-PNG](https://github.com/encharm/Font-Awesome-SVG-PNG) to find SVG icons that you want to use on your site and stick those in an include file. That include could take two arguments: the name of the SVG and an optional class name to apply to it. You can then insert SVGs into any of your pages, without having to copy-paste a huge chunk of HTML.

**Lazily loaded, WebP-compatible images and thumbnails**. On my website, I have an include that allows me to conveniently insert images into my blog posts with just a single, legible line of markup. You can learn more about how I do this in my blog post on [using WebP images in Jekyll](/blog/dev/improve-page-load-speed-in-jekyll-using-the-webp-image-format/).

**Post statistics**. On my blog, each post shows the date when it was published and a measure of its reading length. This appears on both the preview cards for the posts as well as in the posts themselves. I *could* copy-paste the same markup in both locations, but if I need to change something later on, I'd need to remember to update it in both pages. Instead, I just create an include file.

**Fair use disclosures**. Some of my blogs use images from the web for which I do not own the rights. Even though I always disclose the source of these images, Wikipedia still advises that you add a fair-use disclosure to your site as an additional protection against any copyright strikes. I don't find myself needing to use this very often, but when I do, I can simply drop in the include without having to copy-paste a wall of text.

**Project cards**. My projects appear in two locations on this site: Once on the landing page, with a limited set of featured projects, and again on the Experience page, with the full set of projects. Once again, I can abstract away this component in its own include file.

**Linked headings**. I wrote an article on how you can [create linked headings in Jekyll](/blog/dev/heading-links-in-jekyll/) that goes into this in more depth. But basically, you can set up a simple include file that takes the name of a heading you want to create and the level of the heading and turns it into an anchor heading that users can click.

There's a *lot* more you can do with includes, but hopefully this gives you a good idea of what's possible!

{% include linkedHeading.html heading="Taking Advantage of Jekyll Data Files" level=2 %}

Consider your online resume or personal website: You likely want to have a page, or at least a section of a page, dedicated to your projects, skills, education, work history, and any relevant hobbies or interests. *Within* each of those categories, you'll probably have multiple entries, such as:

- Lots of different skills, possibly grouped into distinct categories.
- Open-source (or not) projects and other samples of work that you'd like to showcase.
- (Possibly) multiple degrees, specializations, or certifications.
- (Most likely) multiple jobs as part of your work history.
- Social media links, each with an icon, the platform name, and a URL to your profile.

Here's a mockup for two of those:

{% include picture.html img="mockup" ext="PNG" alt="Mockups of project cards and skills" shadow=false %}

You get the general idea—all websites have static, mostly unchanging data that is often repeated in slightly different ways while retaining the same underlying *structure*.

I'll refer to all of these examples, and any others that fit the bill, as your **site data**.

The naive approach to represent site data on a page involves manually defining the markup for every single skill, project, and so on. Got multiple skills? Create a div for one and copy-paste it to create the others. You could certainly minimize some of the repetition here with an include, but you'd still have to copy-paste the include directive itself, and that's not ideal.

This approach has two glaring problems: repetition and poor legibility. Instead of defining the structure once with a template and simply plugging in the data, you end up copy-pasting the same structure and *manually* changing the data. Suppose you need to update a skill and increase its rating—you now have to track down that particular skill in a sea of HTML and copy-paste some SVGs to get the job done.

This issue is fundamentally about a **separation of concerns**—your data exists independently of however you decide to structure it at the end of the day. So why marry the two inextricably and make your life more difficult than it needs to be? Keep your data separate from the UI that displays it—you'll be happy that you did.

You do that in Jekyll by creating **data files** under the aptly named `_data/` directory. Data files can use YAML, JSON, or CSV to define just that—your website's raw data, *without* the associated HTML markup.

Once you've created a data file in Jekyll, it becomes accessible under `site.data.fileName` across your entire site, in all HTML and Markdown files. But obviously, you're most likely only going to use it on a single page, like an Experience page for projects and skills.

You can then loop over that data using Liquid tags and finally give the data its structure. The key benefit here is that you only need to **define the structure once**; the data merely gets plugged into your templates when Jekyll goes to process your HTML or Markdown files. You can combine data files with includes to take your experience with Jekyll to a whole new level.

{% include linkedHeading.html heading="Example 1: Skills and Abilities" level=3 %}

Let's say you have a simple file named `_data/skills.yml`. Suppose it looks something like this:

{% capture code %}- name: Writing
  rating: 5
- name: Jekyll
  rating: 5
- name: Frontend
  rating: 4{% endcapture %}
{% include code.html file="_data/skills.yml" code=code lang="yml" %}

You can access this data using `site.data.skills`. If your YAML defines an array of skills like above, you can iterate over it and define template markup for each element:

{% capture code %}{% raw %}<ul>
    {% for skill in site.data.skills %}
    <li class="skill">{{ skill.name }} - {{ skill.rating }}</li>
    {% endfor %}
</ul>{% endraw %}{% endcapture %}
{% include code.html file="_pages/experience.md" code=code lang="liquid" %}

This is a fairly simple example—in reality, you'd probably want to do more than just render a simple list of elements. But you get the idea—once you have access to the array, you can let your creative juices flow and create all kinds of neat stuff.

Also, note that you can nest arrays in YAML and in Liquid, so you could—like I do on my personal site—define skill *categories* and nest the actual skills within them:

{% capture code %}- category: Blogging
  skills:
    - name: Writing
      rating: 5
    - name: SEO
      rating: 4

- category: Languages
  skills:
    - name: English
      rating: 5
    - name: Spanish
      rating: 3{% endcapture %}
{% include code.html file="_data/skills.yml" code=code lang="yml" %}

And again, we can give this data more structure:

{% capture code %}{% raw %}{% for item in site.data.skills %}
<h4>{{ item.category }}</h4>
<ul>
    {% for skill in item.skills %}
    <li class="skill">{{ skill.name }} - {{ skill.rating }}</li>
    {% endfor %}
</ul>
{% endfor %}{% endraw %}{% endcapture %}
{% include code.html file="_pages/experience.md" code=code lang="liquid" %}

{% include linkedHeading.html heading="Example 2: Author Bios" level=3 %}

Now let's suppose you run a blog that has multiple authors, not just you.

You can create a data file for each author and define the path to their profile photo, their name, their bio, and a fixed set of social media links, like Twitter, GitHub, and whatnot:

{% capture code %}John Doe:
  photo: john-doe.JPG
  bio: John is a... Well, we don't actually know what he does. Actually, we're not even sure we know who he is.
  socials:
    - type: Twitter
      url: https://twitter.com/realJohnDoe
    - type: GitHub
      url: https://github.com/JohnDoe

Jane Doe:
  photo: jane-doe.JPG
  bio: Jane enjoys long walks on the beach and remaining anonymous on the internet, like 100% of the human population.
  socials:
    - type: Twitter
      url: https://twitter.com/datJaneDoeDoe
    - type: GitHub
      url: https://github.com/JaneDoe{% endcapture %}
{% include code.html file="_data/authors.yml" code=code lang="yml" %}

Notice how your Jekyll data files can be as complex as you need, with nested arrays.

Let's assume each post defines an author in its front matter:

{% capture code %}{% raw %}---
title: A Really Awesome Post
author: Jane Doe
layout: post
---

Usual lorem ipsum stuff.

The end!{% endraw %}{% endcapture %}
{% include code.html file="_posts/2020-02-13-a-really-awesome-post.md" code=code lang="markdown" %}

We can now add a bio at the end of each post, ideally in the `post.html` layout file so we don't have to repeat it for every single post that we publish:

{% capture code %}{% raw %}---
layout: default
---

<article class="post">
    {{ content }}
</article>

{% assign authorData = site.data.authors[page.author] %}
<div class="author-bio">
    <img src="/assets/img/authors/{{ authorData.image }}" alt="{{ page.author }}'s profile picture." />
    <div class="author-name">{{ page.author }}</div>
    <p class="bio">{{ authorData.bio }}</p>
    {% for social in authorData.socials %}
    <a href="{{ social.url }}" class="social-link {{ social.type }}-link">{{ social.type }}</a>
    {% endfor %}
</div>{% endraw %}{% endcapture %}
{% include code.html file="_layouts/post.html" code=code lang="html" %}

Jekyll will process these templates, use the author's name as a key into the `authors.yml` data file, retrieve the relevant information about that author, and substitute it into the template. How cool is that?

{% include linkedHeading.html heading="Example 3: Tag Descriptions" level=3 %}

Let's say each post on your site has tags, like the ones on my blog:

{% raw %}
```markdown
---
title: Jekyll Is Amazing
tags: [dev, jekyll]
---
```
{% endraw %}

Now you want to assign descriptions to each tag to dynamically update a page's description based on which tag a user selected. This is what I currently do on my website for the four primary topics I like to write about (dev, CS theory, gaming, and music).

Create a data file named `tagDescriptions.yml` (or something else) and define key-value pairs in the YAML, where the key is the tag name and the value is the description for that particular tag:

{% capture code %}dev: Technical posts. Yay dev!
life: As in, the thing I like to pretend to have...
tag: This is a tag. How exciting!{% endcapture %}
{% include code.html file="_data/tagDescriptions.yml" code=code lang="yml" %}

Then, you can once again take advantage of YAML's associative data nature to assign descriptions to each tag:

{% capture code %}{% raw %}{% for tag in site.tags %}
<a 
    class="tag" 
    href="/tag/{{ tag }}"
    title="{{ site.data.tagDescriptions[tag] }}">
    {{ tag }}
</a>
{% endfor %}{% endraw %}{% endcapture %}
{% include code.html file="_layouts/blog.html" code=code lang="html" %}

Neat, right? You can extend this to a lot of other use cases.

{% include linkedHeading.html heading="Setting Up Google Search Console" level=2 %}

So you've started blogging with Jekyll. Awesome work!

But how do you know if you're getting any traffic, or what pages people are clicking, or what queries they're using to find you? What devices are being used? Are most of your users on mobile or desktop? What about your impressions, click count, click-through rate, and overall ranking on Google?

{% include picture.html img="google-search-console" ext="PNG" alt="Google Search Console statistics for my site." %}

If you're a complete beginner getting started with Jekyll and don't yet have much (or any) traffic to your website, this should be the least of your concerns. Focus first and foremost on creating quality content, and then go ahead and set this up so you can grow your blog.

If you want to track these metrics so you can work on your blog's SEO, then you'll need to set up a Google Search Console account, claim your website as a property, and push a tracking file to your project that Google will provide you. **This entire process is free**, so there's no good reason not to set it up!

First, head on over to the [Google Search Console](https://search.google.com/search-console/welcome) website and log in with your Google account.

Once you've done that, click `Add property`:

{% include picture.html img="add-property" ext="PNG" alt="Adding a Google Search Console property." %}

When prompted to select a property type, choose the `URL prefix` option and enter the full URL of your site on GitHub Pages:

{% include picture.html img="property-type" ext="PNG" alt="Selecting the type of property in Google Search Console." %}

You'll be asked to verify that you are in fact the owner of this website. Google generates a unique file that you'll need to download, add to your website's repo, and push to GitHub:

{% include picture.html img="verify-ownership" ext="PNG" alt="Verify ownership of your Google Search Console property." %}

GitHub Pages will then build your site and make this file accessible to Google for verification. Once you've uploaded the file, click `Verify`.

{% include linkedHeading.html heading="Is It Safe to Upload the Google Search Console Verification File?" level=3 %}

Don't worry—[there's no security risk associated with doing this](https://stackoverflow.com/questions/57384269/github-pages-blog-and-google-search-console-is-it-safe-to-follow-these-steps-fo). The file can only be used for verifying ownership, not authentication. So if someone downloads your file and tries to use it, they won't be able to access your Google Search Console statistics or anything else associated with your Google Account.

{% include linkedHeading.html heading="GitHub Pages Support for Jekyll Plugins" level=2 %}

The great thing about Jekyll is that it has a large open-source community of creators who publish **Jekyll plugins**. These are just Ruby gems that extend the functionality of Jekyll and make your life easier.

The bad news? GitHub Pages [only supports a limited set of plugins](https://pages.github.com/versions/). This means that if you decide to use Jekyll plugins that are not supported by GitHub Pages, they'll work on your localhost but not when you push your site to GitHub.

If you absolutely need to use a plugin for a feature on your Jekyll website, then you'll need to push just the `_site/` directory to GitHub instead of pushing your source files. Basically, you'd bypass the build step on GitHub Pages and just publish your static site directly on the web server.

Understandably, this may not be ideal if you want people (e.g., recruiters or other developers) to see your site's source and how you organized your project. So sometimes, you may need to reinvent the wheel to add a new feature to your site.

You can learn more about this issue and its workarounds in [this StackOverflow thread](https://stackoverflow.com/a/31871892/5323344).

{% include linkedHeading.html heading="You're All Set!" level=2 %}

Give yourself a big pat on the back—if you made it to the end of this post, then you have a working website and a solid understanding of some Jekyll (and liquid) fundamentals 🎉.

We covered a *lot* in this tutorial—all the way from installing Jekyll and setting up GitHub Pages to creating pages, blog posts, layouts, includes, stylesheets, data files... Oh my!

If there's anything that this post didn't cover that you'd like to learn more about, you'll most certainly find info about it in the official Jekyll documentation.

I hope you found this tutorial helpful!
