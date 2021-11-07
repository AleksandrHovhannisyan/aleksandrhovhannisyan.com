---
title: "11ty: The Good, the Bad, and the... Possum?"
description: A review of 11ty, an extensible static site generator written in Node that supports a variety of template languages.
keywords: [11ty, eleventy]
categories: [11ty, jekyll, blogging]
thumbnail: thumbnail.jpg
commentsId: 95
lastUpdated: 2021-11-07
---

For two years, my blog ran on Jekyll, one of the oldest and most popular static site generators around. Jekyll is often listed alongside other static site generators like Hugo, Gatsby, Next, Nuxt, and [many others](https://jamstack.org/generators/) that make up the so-called Jamstack.

{% include img.html src: "jamstack.jpg", alt: "The jamstack.org website. Various static site generators like Hugo, Next.js, Gatsby, and Jekyll are ranked in a grid view, with information on various stats, like the number of stars on GitHub.", caption: "The [jamstack.org](https://jamstack.org/generators/) website ranks popular static site generators." %}

Jekyll was great and served me really well! It's very much a batteries-included static site generator, which is great for beginners because it means that you can hit the ground running and [create a blog](/blog/getting-started-with-jekyll-and-github-pages/) quickly and with minimal setup.

But Jekyll isn't without its problems. For one, it runs on Ruby, which I've found to be more painful to install and configure than Node, especially on Windows (even with WSL). It's also not that easy to customize Jekyll and write plugins or custom filters for it since you have to learn Ruby to do so effectively. Jekyll's documentation is also lacking in some areas, especially with regard to how you extend it or write custom plugins and tags.

I pushed Jekyll to its limits as much as I could. But I also felt that it was time for me to move on to something else—not just for the sake of trying something new but so I could enjoy a better developer experience.

So, over the course of several months in early 2021, I toiled away to recreate my website in two popular frameworks: Next.js and Gatsby. I gave up on both when I realized how much they bloated my site and slowed my page load speed. Don't get me wrong—I love React and use it every day at work. But I don't think that it's the right solution for a blog, unless you really need MDX.

My dream framework needed to have these features:

- Built-in image optimization, with minimal configuration.
- Support for pagination and category pages (Gatsby did this well).
- Posts that can be authored in markdown, with front-matter data.
- Good documentation and active releases.

After months of prototyping and research, I stumbled upon 11ty, a static site generator that's marketed as the Jekyll of JavaScript. I first learned about 11ty from Reddit and various dev bloggers, so I figured I'd give it a shot and see what all the hype is about.

Visiting the [official website](https://11ty.dev/), I was greeted by a mischievous-looking possum hanging from a red balloon and floating across my screen.

{% include img.html src: "possum.jpg", alt: "The Eleventy mascot is a possum with brown hide and a beige face. It's hanging from a red balloon, with one paw slightly outstretched." %}

*Okay*, I thought. *I can work with this.*

It was then that I dedicated myself to migrating my site from Jekyll to 11ty, what I hoped would be my last experiment. And overall, I'm very pleased with how it turned out and how easily I was able to port my content over. Most of this site has remained unchanged; some other things have actually *improved*.

Now that I've gone through this process myself and have experience with various static site generators, I'd like to take some time to look at the advantages and drawbacks of using 11ty for a personal website or blog. Most of this is based on my short-term experience with 11ty, so keep in mind that my views may change in the future as I learn more.

{% include toc.md %}

## The Good: Why I Like 11ty

[11ty Rocks](https://11ty.rocks/)—there's a reason why [so many people are using it](https://www.11ty.dev/speedlify/) for their personal websites, blogs, and official landing pages. [Even Google uses it](https://github.com/google/eleventy-high-performance-blog) for its high-performance blog template. Below are just a handful of reasons why 11ty is such a great framework.

### 1. It's Highly Configurable

As I mentioned earlier, 11ty runs on JavaScript. All of its configs are written in Node, with the base `.eleventy.js` file exporting a function like so:

{% include codeHeader.html file: ".eleventy.js", copyable: false %}
```js
module.exports = (eleventyConfg) => {
  // Where the magic happens.
}
```

Eleventy exposes all of its internal APIs to this module, meaning that you can do things like:

- [Specifying source and output directories](https://www.11ty.dev/docs/config/#configuration-options).
- [Choosing your template engine](https://www.11ty.dev/docs/languages/) from a total of ten supported languages.
- [Adding custom or third-party plugins](https://www.11ty.dev/docs/plugins/), like for syntax highlighting or markdown.
- [Writing custom shortcodes](https://www.11ty.dev/docs/shortcodes/) for reuse in templates.
- [Writing custom filters](https://www.11ty.dev/docs/filters/) to extend your template language (e.g., Liquid or Nunjucks).
- [Creating custom collections programmatically](https://www.11ty.dev/docs/collections/).
- [Batch-copying files and directories](https://www.11ty.dev/docs/copy/) to your output directory.
- [Adding custom watch targets](https://www.11ty.dev/docs/watch-serve/) for files and directories.

... and *so* much more! I could go on forever about all the cool things that you can do in 11ty.

11ty takes a simpler approach than most static site generators: It gives you the basic tools that you need to create a blog, and it leaves it up to you to wire them up however you see fit. It does not force you to use any particular templating language. Want to port a Jekyll site over to 11ty? Good news: You can still use Liquid! But if you want to use Nunjucks, Handlebars, Pug, or another popular templating language, you're welcome to do so. Tired of using YAML for all of your data? You can also define data files using JSON or even JavaScript. Want to use `markdown-it` to process Markdown files? Cool, go right ahead—but also know that *you don't have to*.

I cannot stress just how important this kind of flexibility is for your productivity and sanity. For example, anyone who's worked with Gatsby knows the pain of wanting to add a certain feature to their site, realizing that it's unrealistic to implement by hand, and installing a plugin instead. You end up with a bloated dependency tree and have to deal with many frustrating issues and bugs, some of which can't be resolved.

With 11ty, you have full control over how you want your site to be built.

#### Custom Shortcodes? No Problem

For example, let's say you want to use SVG icon libraries like [Feather Icons](https://feathericons.com/) on your site. You can install the NPM package, import it into your config, and register a custom shortcode that returns a particular SVG as an inline string:

{% include codeHeader.html file: ".eleventy.js", copyable: false %}
```js
const feather = require('feather-icons');

// You'll need to pass more arguments, but this is the general idea
const iconShortcode = (icon) => feather.icons[icon].toSvg();

module.exports = (eleventyConfig) => {
  eleventyConfig.addLiquidShortcode('icon', iconShortcode);
}
```

Voila—you can now invoke the shortcode in any valid template language, like markdown or HTML, to render the icon:

{% raw %}
```html
{% icon "calendar" %}
```
{% endraw %}

This ships **zero client-side JavaScript** since your packages are used at build time, on the server side, to generate static HTML. If there's a package out there that you have your heart set on, chances are that you can use it to customize 11ty. This is great because web developers are most familiar with JavaScript, and the ecosystem is booming with open-source packages that solve common problems.

You can create a shortcode for practically anything, offloading the main rendering logic to a JavaScript function rather than bloating your templates. You can also [publish it as an 11ty plugin](https://www.11ty.dev/docs/plugins/) so that other users can install it and add it to their 11ty config.

#### Filter All the Things

One of the coolest things about 11ty is how easy it is to write **custom template filters**. Tired of repeating {% raw %}`{{ site.url }}`{% endraw %} in your markup? Create a custom filter to prepend your site's URL to any URL string that you give it:

{% include codeHeader.html file: ".eleventy.js" %}
```js
const site = require('./src/_data/site');

const toAbsoluteUrl = (url) => {
  if (typeof url !== 'string') {
    throw new Error(`${toAbsoluteUrl.name}: expected argument of type string but instead got ${url} (${typeof url})`);
  }
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addLiquidFilter('toAbsoluteUrl', toAbsoluteUrl);
}
```

And now you can use it like this anywhere in your code:

{% raw %}
```html
<a href="{{ someRelativeUrl | toAbsoluteUrl }}"></a>
```
{% endraw %}

Or maybe you have some object data that you want to iterate over in a template. No problem—throw in these filters, and you're good to go:

{% include codeHeader.html file: ".eleventy.js", copyable: false %}
```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addLiquidShortcode('keys', Object.keys);
  eleventyConfig.addLiquidShortcode('values', Object.values);
  eleventyConfig.addLiquidShortcode('entries', Object.entries);
}
```

And you would use them like so:

{% raw %}
```liquid
{% assign keys = someObject | keys %}
{% for key in keys %}{% endfor %}

or this:

{% assign values = someObject | values %}
{% for value in values %}{% endfor %}

why not both?

{% assign entries = someObject | entries %}
{% for entry in entries %}{% endfor %}
```
{% endraw %}

#### JavaScript Data Files

You can define global site data statically using YAML or JSON, and this works well for most cases. However, there are certain situations where you want to populate your site with dynamic data at build time, like from an API. Maybe you want to display stats from your GitHub profile, or maybe you're sourcing your posts from a headless CMS rather than storing them in your repo.

For those dynamic use cases, 11ty allows you to define data files using JavaScript. Just stick a JavaScript file in your data directory and export whatever you want from that module; 11ty will handle the rest. For example, you could export an object for static data:

{% include codeHeader.html file: "src/_data/site.js", copyable: false %}
```js
module.exports = {
  title: 'My Awesome Site',
  author: 'My name',
  // You can access environment variables in here!
  mode: process.env.ELEVENTY_ENV,
};
```

But you could also export a function for dynamic data. You can even make it async, allowing you to fetch and await remote data and return it from the data file:

{% include codeHeader.html file: "src/_data/projects.js", copyable: false %}
```js
module.exports = async () => {
  console.log('Fetching GitHub projects...');
  // fetch and return the data here!
};
```

Eleventy also has an official plugin that can fetch the data for you and [cache it internally](https://www.11ty.dev/docs/plugins/cache/) so that site rebuilds don't blow your rate limit.

### 2. It's Testable

Tooling is everything when it comes to creating a good developer experience. Writing tests for custom filters and plugins in Jekyll is not only poorly documented but also just a lot of work. By comparison, things are much easier with 11ty. Since you're already using JavaScript to write your configs, you can install any testing framework you like (e.g., Jest) and use it to test your code. This is great because it means you can test custom filters, ensuring that they always behave how you want them to and giving you more confidence in your site's core build utilities.

### 3. It Has Built-in Pagination

With Jekyll, pagination was an afterthought, and you had to use [a plugin](https://github.com/sverrirs/jekyll-paginate-v2) to generate paginated blog and category pages. It worked well, but it was also the slowest part of my build (which, to be fair, wasn't *that* slow to begin with—around 3 minutes locally and 1.5 minutes on Netlify).

In 11ty, pagination is built right in—you can paginate All the Things to your heart's content. Eleventy uses the notion of a "tag" to group your content into collections. You can define `tags` in the front matter of any template file or even with [directory-specific data files](https://www.11ty.dev/docs/data-template-dir/). So if you have another collection named `notes` and a source directory like `src/_notes`, you can stick a JSON file in there to automatically tag everything in it as part of the `notes` collection:

{% include codeHeader.html file: "src/_notes/_notes.json" %}
```json
{
  "tags": ["notes"]
}
```

And then look it up with pagination in your front matter:

{% include codeHeader.html file: "src/notes.html" %}
{% raw %}
```liquid
---
title: Notes
permalink: /notes/
pagination:
  data: collections.notes
  size: 10
  alias: notes
---

{%- for note in notes -%}
  <a href="{{ note.url }}">{{ note.data.title }}</a>
{%- endfor -%}
```
{% endraw %}

You can even access the pagination object to create a pagination trail:

{% raw %}
```liquid
<ol class="pagination-trail" aria-label="Page navigation">
  {%- for pageUrl in pagination.hrefs %}
    <li>
      <a
        href="{{ pageUrl }}"
        aria-label="Page {{ forloop.index }}"
        {% if pageUrl == page.url -%}
          aria-current="page"
        {%- endif -%}
      >
        {{- forloop.index -}}
      </a>
    </li>
  {%- endfor -%}
</ol>
{%- endif -%}
```
{% endraw %}

Pretty cool! But even cooler is that you can **generate collections programmatically**, right in your 11ty config. This should sound familiar if you've ever created a Markdown-based blog in Next.js and had to use glob patterns to collect all of your posts from the file system.

This means that instead of manually tagging your content or using directory data files, you can generate a custom collection with JavaScript and give it any name that you want:

{% include codeHeader.html file: ".eleventy.js" %}
```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi.getFilteredByGlob('./src/_posts/*.md').reverse();
  });
}
```

Assuming that all your posts reside in Markdown files in the `src/_posts` directory, the code above will use Eleventy's collections API to group all files matching the glob pattern into an array of objects, each containing data about your posts via front matter.

At first glance, this may not seem too useful—it's more work than leaning on Eleventy's tagging system. But where it really shines is when you want to create [two-level pagination](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/), where you rely on Eleventy's pagination API to automatically generate category pages based on front matter, but you also want each category page to *itself* be paginated. While this sounds complicated, that article by Jérôme Coupé is an excellent tutorial on how to accomplish this. And it's actually much easier than you'd think!

### 4. It Supports Dynamic Front Matter (Computed Data)

In Jekyll and most other static site generators, a front-matter variable can't reference other data because it introduces a circular dependency: Jekyll doesn't know the value of that other variable until it finishes parsing the entire front matter of your template. Unfortunately, this means that you can't have dynamic front-matter data. But that's a fairly common need—for example, with pagination, your page title and permalink often depend on the page number.

Fortunately, this limitation doesn't exist in 11ty, where you can do magical things thanks to [computed data](https://www.11ty.dev/docs/data-computed/):

{% include codeHeader.html file: "src/_pages/blog.html" %}
{% raw %}
```yml
---
permalink: "/blog/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber | plus: 1 }}/{% endif %}"
pagination:
  data: collections.posts
  size: 10
  alias: posts
eleventyComputed:
  title: "Blog{% if pagination.pageNumber > 0 %} (Page {{ pagination.pageNumber | plus: 1 }}){% endif %}"
---
```
{% endraw %}

In 11ty, `permalink` is a reserved front-matter variable that's dynamic by default. This means that you can interpolate variables and use templating logic when setting its value. If you want to do the same thing for other front-matter variables, all you need to do is nest them under `eleventyComputed`. Any front-matter variables you declare inside an `eleventyComputed` block will be evaluated before the template is written but *after* the static front-matter variables have been parsed. In this example, I'm using computed data to check the current page number and adjust the title accordingly.

Computed data is *amazing* and unlocks a whole new level of dynamic templating than what you get with other static site generators.

### 5. It Has an Excellent Image Plugin

With my Jekyll blog, I was [optimizing images by hand](/blog/improve-page-load-speed-in-jekyll-using-the-webp-image-format/) with a Python script that generated low-quality placeholders and WebP variants for every single image in a directory. This worked surprisingly well, and it even allowed me to support animated WebP GIFs without slowing down my page load speed. It also kept my build times low since I was generating images statically.

Unfortunately, all of this came at a price: It was immensely tedious work that often held me back from writing posts because I dreaded the thought of having to optimize images by hand. What I wanted was for image optimization to be a core part of the framework I was using, not something I threw together with scripts and duct tape.

What really convinced me to give Eleventy a shot was an article by Ben Holmes about how you can use the [official 11ty image plugin](https://www.11ty.dev/docs/plugins/image/) to [optimize images in any framework](https://bholmes.dev/blog/picture-perfect-image-optimization/) and not just in 11ty itself. I was blown away when I followed along with the tutorial and, in fact, was able to generate any combination of sizes and formats for images in just a few short lines of JavaScript.

Here's some sample code from the official docs showing how you register a custom shortcode for images and generate the required output:

{% include codeHeader.html file: ".eleventy.js", copyable: false %}
```js
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
};
```

You can then use it like this in any Liquid template:

{% raw %}
```liquid
{% image "path/to/my/image" "alt text" "100vw" %}
```
{% endraw %}

Let's talk a bit more about the image plugin and why it's so awesome.

#### It's *Really* Fast

The Eleventy plugin is powered by the [Sharp image processing library](https://www.npmjs.com/package/sharp), and it's *blazing* fast—much faster than the comparative Gatsby image plugin. I say this based on personal experience because I've tried to migrate my site to Gatsby, and the images take *forever* to generate—it's the main reason why so many Gatsby sites have build times on the order of 10+ minutes.

To put this into perspective, my site has around 360 source images as of this writing. Eleventy is currently writing a total of **2450 images** to my output directory, some of which are pass-through copies but most of which are generated. You'd think that this would slow down my builds, but they're actually faster in 11ty than they were in Jekyll—around [two to three times faster](https://twitter.com/hovhaDovah/status/1408898476151349248)! Fresh local builds take around 90 seconds, while Netlify builds take 2 minutes with a cache (4 without).

Part of what makes the 11ty image plugin so efficient is the fact that it caches images locally once it has generated them. This is great if you have lots of paginated pages with images that get reused, like for article thumbnails. Instead of regenerating the same image several times, 11ty will process it just once, and all subsequent requests will hit the cache.

#### It Supports Remote Images

With most image plugins in other frameworks, you're limited to static imports or paths, meaning the images you want to transform must be located in your project's source. This isn't a big deal, but it does add a little overhead for retrieving and saving remote images.

Guess what? The 11ty image plugin supports remote URLs and not just static images! In fact, the official tutorial that I linked to earler runs the plugin on a sample image from Unsplash, generating local copies of that image just as if it had existed in your source.

#### It's Very Flexible

Most image plugins generate fixed markup that you have very little control over, except maybe some customization through props (in React) or static config files. This can be really limiting if you need to roll a custom solution for image optimization.

Fortunately, the Eleventy image plugin doesn't actually care how you intend to use the generated images. All it does is expose two basic APIs: one that returns metadata for all of the generated images, and another that returns a string for the image markup:

```js
// Get the data for all image variants
let metadata = await Image(src, {
  widths: [300, 600],
  formats: ["avif", "jpeg"]
});

// Generate the markup
return Image.generateHTML(metadata);
```

But instead of relying on `Image.generateHTML`, you can return custom markup as a string! All the data you need is right there in the metadata returned by `Image`. This means that you can generate low-quality placeholder images as part of your build process, return markup consisting of placeholder `src` and `srcset` attributes, and define `data-` attributes storing the actual image data. You can then lazily load your images with very few lines of JavaScript.

{% aside %}
  **Update**: If you're interested in learning more about how this works, I wrote a tutorial on [how to lazily load images in 11ty](/blog/eleventy-image-lazy-loading/).
{% endaside %}

You can even customize the naming for your images through an optional argument:

```js
const imageMetadata = await Image(fullyQualifiedImagePath, {
  // ... other arguments
  filenameFormat: (id, src, width, format) => {
    return `${name}-${width}.${format}`;
  },
  // ...
});
```

This is just scratching the surface ofThere's very little that you can't customize. I'm honestly very impressed by how much thought went into making this plugin; it's exactly what I was searching for!

### 6. It Has Great Documentation

If you're not sure how to do something in 11ty, chances are that you'll find an example [in the official docs](https://11ty.dev/docs/) in several different templating languages. And if you get stuck, you can ask for help in their very active GitHub community and [Discord channel](https://www.11ty.dev/blog/discord/). I actually [ran into a problem trying to deploy my site](https://github.com/11ty/eleventy/issues/1864), and I received an answer within a few hours.

### 7. It Supports Incremental Builds

This is something I initially misunderstood about 11ty, thinking that it was slower than Jekyll. But it turns out that 11ty supports incremental builds just like Jekyll does—all you have to do is supply the `--incremental` command-line flag for the dev server. So if you change one file, 11ty won't rebuild your entire site—it will only write the file that changed. This makes for a great developer experience, especially if you save files frequently like I do.

### 8. It Has a Debug Mode

To top it all off, if you get stuck at any point during development, you have several options for debugging:

- Logging variables to the server console with the `log` filter: {% raw %}`{{ var | log }}`{% endraw %}.
- Running eleventy in debug mode: `DEBUG=Eleventy* npx @11ty/eleventy`.

Debug mode is awesome—11ty logs information about every single thing that it does: how it was configured, what directories and files it found, what files it copied, what images it generated, how long any given step took, and so much more. It even includes benchmarking info at the end so you can optimize your build times!

{% include img.html src: "debug.jpg", alt: "Sample output from Eleventy's debug mode, with color-coded steps and various useful messages logged to the console." %}

(Also, I like the pretty colors.)

## The Bad (But Manageable)

An honest review of Eleventy wouldn't be one if I claimed that the framework isn't without its flaws. Having said that, I still think this is one of the best static site generators around, and you should definitely give it a shot. Some of the points below border on nitpicking—that's just how good 11ty is.

### 1. It Requires More Configuration

Compared to frameworks like Jekyll, Eleventy is highly configurable and extensible—on par with frameworks like Gatsby that have giant plugin ecosystems. This is great because it means that you can customize nearly every aspect of the framework's internals to meet your needs.

Naturally, this may intimidate beginners due to the sheer number of options for customizing 11ty and all of the different topics that you need to learn. You may need to spend some time debugging problems, reading the docs, and fiddling with configs until things work.

But here's the thing: This is true for any new tool that you pick up—there's *always* a learning phase. The good news is that once you get up and running with 11ty, you'll be able to extend it more easily than most other frameworks. Alternatively, you could just use one of the many [starter templates](https://www.11ty.dev/docs/starter/) to hit the ground running.

### 2. Variables Pollute the Global Namespace

If I could change one thing about 11ty, namespacing would be it. This issue bit me quite a few times as I was migrating my site from Jekyll, and I have to admit that I still don't fully understand how the 11ty data cascade works.

In Jekyll, template variables are scoped under their corresponding namespace:

- `page.x` for page variables (defined at the page level).
- `layout.x` for layout variables (defined at the layout level).
- `include.x` for arguments passed into an include file.
- `site.x` for site variables.

With 11ty, the namespacing is inconsistent. Sometimes, the title you want for a page is under `someItem.data.title`; other times, it's leaked into the global scope as just `title`. Some site variables are scoped under `site`, like `site.url` or `site.title`; others leak into the global scope as plain variables. In include files, all variables are globally scoped, which means you may even get naming clashes between include arguments and other global variables.

This can be confusing, and you sometimes have to do a bit of detective work to figure out where your data resides. When migrating my site from Jekyll to 11ty, I had to refer to [Paul Lloyd's excellent article](https://24ways.org/2018/turn-jekyll-up-to-eleventy/) for some handy tables that show how Jekyll syntax maps to 11ty syntax.

In the grand scheme of things, this isn't really that big of a deal and is eclipsed by many of 11ty's strengths. However, I do wish there were an option to namespace things more consistently.

### 3. Mixed Casing and Conventions

This is a nitpick, but 11ty uses the `camelCase` convention of JavaScript to extend Liquid, whereas Liquid itself follows the `snake_case` convention of Ruby. This can make your templates stylistically inconsistent. That said, you can easily fix this problem by overriding Liquid's existing filters with custom ones. In fact, this is the recommended workflow anyway since it gives you more control over filters and allows you to write tests for them.

### 4. No ES Modules Support for the Eleventy Config

If you're using `type: "module"` in your `package.json` to automatically treat every JavaScript file as an ES Module, [this won't work with Eleventy just yet](https://github.com/11ty/eleventy/issues/836). You'll need to remove that line from your `package.json` and instead use the `.mjs` file extension for any non-Eleventy JavaScript file that should be treated as an ES Module by your bundler (e.g., Webpack). Hopefully, Eleventy will support ESM sometime in the future. Until then, you'll want to stick to using the Common JS syntax of `require` and `module.exports`. It's not the end of the world, though.

## The... Possum?

We've covered the good. And we've covered the bad. But [what about the possum](https://www.11ty.dev/news/logo-homage/)?

{% include img.html src: "possum-white-bg.jpg", alt: "The Eleventy mascot is a possum with brown hide and a beige face. It's hanging from a red balloon, with one paw slightly outstretched." %}

{% quote "An Homage to the James Williamson Possum Balloon", "https://www.11ty.dev/news/logo-homage/" %}
  Why a possum? Why is the possum floating? Why a balloon? Exactly. 42.
{% endquote %}

The original Eleventy mascot was [designed by developer James Williamson](https://www.11ty.dev/news/james-williamson/), who passed away in 2019 after a six-year battle with ALS. It was later reinterpreted artistically by designer [Phineas X. Jones](http://octophant.us/) and now floats through the halls of the 11ty docs.

And I just love everything about it. Those impish eyes. That scrawny little paw just barely outstretched, like it wants you to *[Hand it over. That thing, your dark soul](https://www.youtube.com/watch?v=Nt5Q9hu0h0s)*.

{% include img.html src: "hand-it-over.jpg", alt: "Slave Knight Gael, the final boss of the video game Dark Souls 3, gestures towards the viewer with his hand outstretched. The captions read: Hand it over. That thing, your dark soul. The Eleventy mascot's head replaces Gael's.", caption: "There's a Dark Souls meme that nobody asked for. You're welcome, internet." %}

## So, Should You Use 11ty?

Absolutely yes! If you want to spin up a personal website or blog, 11ty is the perfect choice. It's lightweight and much faster than alternatives like Gatsby and Jekyll, and it's backed by an active community of developers. The image plugin alone was enough to convince me to give 11ty a shot, and now I'm very happy with my current setup.

I hope you enjoyed this read! I certainly had fun migrating my site to 11ty and writing about it.

## Useful Resources

Below are various tutorials and resources that helped me as I migrated my site from Jekyll to 11ty.

- [The official 11ty docs](https://www.11ty.dev/docs/)
- [Turn Jekyll up to Eleventy](https://24ways.org/2018/turn-jekyll-up-to-eleventy/) by Paul Lloyd
- [From Jekyll to 11ty](https://kittygiraudel.com/2020/11/30/from-jekyll-to-11ty/) by Kitty Giraudel
- [Basic custom taxonomies with Eleventy](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/) by Jérôme Coupé
- [Picture perfect image optimization for any web framework](https://bholmes.dev/blog/picture-perfect-image-optimization/) by Ben Holmes
