---
title: Add Comments to Jekyll with the GitHub Issues API
description: Add comments to your Jekyll blog with the GitHub issues API and lazily load them for improved performance.
keywords: [jekyll comment system]
categories: [jekyll, github, javascript]
commentsId: 45
lastUpdated: 2021-10-20
thumbnail: ./images/thumbnail.png
---

{% aside %}
  **Note**: I've written a more recent article about how to [add comments to your site with GitHub Issues and Netlify functions](/blog/static-site-comments-github-issues/). If you're hosting your site on Netlify, I recommend following that tutorial instead.
{% endaside %}

A while back, [Ari Stathopoulos wrote a tutorial](https://aristath.github.io/blog/static-site-comments-using-github-issues-api) on how to add comments to a Jekyll blog using the GitHub Issues API. And you know what? It works like a charm! Ever since I added comments to my Jekyll blog, I've seen a noticeable increase in engagement from my readers:

{% include postImage.html src: "./images/comments.png", alt: "A list of comments on one of my blog posts" %}

That said, this approach isn't without its drawbacks. For one, the GitHub API has a [rate limit of 60 requests/hour](https://developer.github.com/v3/#rate-limiting). But more importantly, rendering all comments on the initial page load isn't a great user experience.

So, in this tutorial, I'd like to introduce a modified version of Ari's approach that:

1. Only loads the comment system once the user has scrolled to the end of the page.
2. Sanitizes each comment to escape special characters and prevent XSS attacks.
3. Displays relative dates (e.g., `X hours ago`), like you see on most comment systems.

That last point is really optional. My two key concerns were to improve my comment system's performance and to ensure that users can't get away with XSS via GitHub comments.

## How to Add Comments to a Jekyll Blog

This section is a bit of a recap on how to use the GitHub Issues API to add comments to a Jekyll blog. Most of this is covered in Ari's post, save for some differences in the markup itself.

First, you'll need a public repo for your comments. Add this variable to your `_config.yml`:

```yml {data-file="_config.yml" data-copyable=true}
issues_repo: YourUsername/RepoName
```

For my site, that's `AleksandrHovhannisyan/aleksandrhovhannisyan.com`.

We'll use this a few times in our code, so it's a good idea to define it in one place instead of copy-pasting it so we can access it under `site.issues_repo`. That way, if the repo name ever changes, you'll only have to update it in `_config.yml`.

If a particular blog post needs comments, open an issue for it in that repo and note its ID:

{% include postImage.html src: "./images/issue-id.png", alt: "The ID of an issue on my GitHub repo." %}

Add the following front matter variable to the blog post for which you want to enable comments; assign it the ID from above:

```markdown {data-file="_posts/2020-07-07-my-post.md" data-copyable=true}
comments_id: 35
```

In your `post.html` layout file, check to see if this front matter variable was specified. If it wasn't, then the comment system is turned off for that particular post. If it was defined, then we'll want to include a file containing our HTML and JavaScript for the comment system:

{% raw %}
```liquid {data-file="_layouts/post.html" data-copyable=true}
{% if page.comments_id %}
  {% include comments.html issue_id=page.comments_id %}
{% endif %}
```
{% endraw %}

And here's the include file itself (or at least part of it—we'll fill in the script shortly):

{% raw %}
```html {data-file="_includes/comments.html" data-copyable=true}
{% assign issues_repo = site.issues_repo %}
{% assign issue_id = include.issue_id %}

<section id="comments">
  <div class="comment-actions">
    <h2>Comments <span id="comments-count"></span></h2>
    <a
      class="button"
      href="https://github.com/{{ issues_repo }}/issues/{{ issue_id }}"
      >Post comment</a
    >
  </div>
  <div id="comments-wrapper">
    Loading...
  </div>
</section>

<!-- Comments script -->
<script></script>
```
{% endraw %}

Up at the top of the include, I'm creating local Liquid variables so I don't have to repeat {% raw %}`include.issue_id`{% endraw %} and {% raw %}`site.issues_repo`{% endraw %} in my markup. Next, I've defined some basic HTML for the comment system itself. Notice that the anchor element (button) points to the corresponding GitHub issue URL:

```
{% raw %}https://github.com/{{ issues_repo }}/issues/{{ issue_id }}{% endraw %}
```

When users click this link, they'll be directed to the "comment system" for a given post.

## Using the GitHub Issues API as a Comment System

Time to start writing some JavaScript!

First, we'll create some variables up at the top to reference a few of the elements on the page:

{% raw %}
```html {data-file="_includes/comments.html" data-copyable=true}
<script>
  const commentsSection = document.getElementById('comments');
  const commentsWrapper = commentsSection.querySelector('#comments-wrapper');
  const commentsCount = commentsSection.querySelector('#comments-count');
</script>
```
{% endraw %}

We'll want to:

1. Make a request to the GitHub API when a user scrolls to the bottom of a blog post.
2. Load all comment-related dependencies for pre-processing these comments.
3. Once all of those scripts have loaded, render the comments as HTML.

### 1. Detecting When a User Scrolls to the Comments Section

If you load the comment system every time a user visits one of your blog posts, that's going to fire off an unnecessary API request and load dependencies that are not yet needed. Not only will this waste their bandwidth, but it will also quickly drain your GitHub Issues API quota (assuming you get decent traffic and most readers make it all the way to the end of the page).

To detect when a user has scrolled to the end of the page, we'll use the widely supported [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Here's all the code that we need to defer loading the comments section:

```javascript {data-file="_includes/comments.html" data-copyable=true}
const commentsObserver = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetchComments(); // this is the important part
      self.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px 0px 0px 0px' });

commentsObserver.observe(commentsSection);
```

The observer checks to see if it's intersecting with the `commentsSection` element. If it is, it calls a `fetchComments` routine that we'll define in a second. It takes an optional configuration object as its second argument. Here, the config I've passed in sets a `rootMargin` option, which you can think of as a margin around an invisible "intersection rectangle" for the `commentsSection` element's box model. A top margin of `200px` essentially treats an intersection as 200px *before* a user has reached the comments section.

Here's the `fetchComments` function that fires when an intersection occurs:

{% raw %}
```javascript {data-file="_includes/comments.html" data-copyable=true}
const fetchComments = async () => {
  try {
    const comments = await (await fetch(
      'https://api.github.com/repos/{{ issues_repo }}/issues/{{ issue_id }}/comments'
    )).json();
    initRenderComments(comments);
  } catch (e) {
    commentsWrapper.innerHTML = `<p>Unable to retrieve the comments for this post.</p>`;
  }
}
```
{% endraw %}

It's async and uses `fetch` to make the request to the GitHub Issues API. On failure, we set a message informing the user that we were unable to fetch the comments. If the response is okay, we invoke the `initRenderComments` function to begin loading the dependencies for our comment system. We'll define that function in the next section.

### 2. Loading Dependencies for Our Jekyll Comment System

I'll be using these three scripts for my comment system:

- `marked`, for processing markdown from GitHub comments and spitting out HTML.
- `DOMPurify`, for sanitizing `marked`'s HTML output (e.g., to prevent XSS attacks).
- `Day.js`, for rendering comment timestamps relative to now (e.g., `3 hours ago`).

Now, you could certainly load these using script elements like so:

```html
<!-- HTML up at the top -->

<script src="https://unpkg.com/marked@0.3.6/marked.min.js"></script>
<script src="https://unpkg.com/dompurify@1.0.8/dist/purify.min.js"></script>
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script src="https://unpkg.com/dayjs@1.7.8/plugin/relativeTime.js"></script>

<!-- Our custom comments script -->
<script>
  const commentsSection = document.getElementById('comments');
  const commentsWrapper = commentsSection.querySelector('#comments-wrapper');
  const commentsCount = commentsSection.querySelector('#comments-count');

  // more code

</script>
```

However, I don't recommend doing this for the same reason that we're deferring our API request until the user scrolls to the bottom of the page: Why fetch resources that we don't need unless a user expects the comments to show up? In other words, we shouldn't just stick these directly in the HTML—we should load them in our JavaScript only after a user has scrolled to the comments section. Better yet, if the GitHub API returns no comments, we won't even bother loading these scripts, saving the user even more bandwidth and making Lighthouse happy.

There are two approaches you can take to defer loading your dependencies: using dynamic imports (if you're using a module bundler like Webpack for your JavaScript), or loading the scripts directly in JavaScript with the DOM.

My site currently takes the first approach. However, to keep this post accessible to most readers, I'll take the second approach since not everyone is using Webpack to bundle their JavaScript. We'll create `script` elements, set their `src` attributes, and append them to the DOM body. Here's a function that'll do that for us, given a `src`:

```javascript {data-file="_includes/comments.html" data-copyable=true}
const loadScript = (src) => {
  const scriptElement = document.createElement('script');
  document.body.appendChild(scriptElement);

  return new Promise((resolve) => {
    scriptElement.onload = resolve;

    // Important to register onload before setting src
    scriptElement.src = src;
  });
}
```

This function creates a script element and registers an `onload` listener for it. When the load event fires, the returned promise resolves.

Now, we'll need some way to hold off on rendering comments until *all* of the dependencies have loaded. To do that, we'll use a simple array of scripts to load and take advantage of [`Promise.all`](/blog/javascript-promise-all/), together with the async function we just wrote:

```javascript {data-file="_includes/comments.html" data-copyable=true}
const commentScripts = [
  'https://unpkg.com/marked@0.3.6/marked.min.js',
  'https://unpkg.com/dompurify@1.0.8/dist/purify.min.js',
  'https://unpkg.com/dayjs@1.8.21/dayjs.min.js',
  'https://unpkg.com/dayjs@1.7.8/plugin/relativeTime.js',
];

// Reminder: this gets called when the viewport intersects with the comments section
const initRenderComments = async (comments) => {
  if (!comments.length) {
    commentsWrapper.innerHTML = `<p>No comments yet 👀 Be the first to post!</p>`;
    return;
  }

  // Load all comment script dependencies async
  await Promise.all(commentScripts.map((script) => loadScript(script)));
  renderComments(comments);
}

const renderComments = (comments) => {
  // Do rendering later
}
```

{% aside %}
  Feel free to use a different CDN or serve these files locally if you'd like to.
{% endaside %}

When all of the individual promises resolve, we know that all of our scripts have successfully loaded, and `Promise.all` itself resolves. Thus, we can safely begin rendering our comments after that line. And that's the last thing that we need to do!

Before we move on, I want to reiterate: If all of this seems weird and hacky, that's because it *technically* is. It *works*, and it *will* defer loading the dependencies until a user has scrolled to the end of the page, which is great. But all of this is much simpler if you're using Webpack to bundle your JavaScript in Jekyll since you can just use dynamic imports and node modules. That's a topic for a different blog post, though. If you *are* using Webpack or some other bundler, I encourage you to take that route—write your comment script in an actual JS file, look up the issue ID as a `data-` attribute set in your HTML, and stick the bundled script somewhere in your post layout.

### 3. Rendering the Comments

We've loaded all of our dependencies, either using Promises like I showed above or with dynamic imports and a module bundler that can load the chunks at runtime. Now that our dependencies are ready to use, the only task that remains is actually rendering the comments:

{% raw %}
```javascript {data-file="_includes/comments.html" data-copyable=true}
const renderComments = (comments) => {
  // load the relativeTime plugin for dayjs so we can express dates relative to now
  dayjs.extend(dayjs_plugin_relativeTime);

  commentsCount.innerText = `(${comments.length})`;

  const commentsList = document.createElement('ol');
  commentsList.className = 'comments-list';
  commentsList.setAttribute('aria-label', 'Comments on this blog post');

  commentsList.innerHTML = comments
  .sort((comment1, comment2) => {
    return comment1.created_at < comment2.created_at ? 1 : -1;
  })
  .map(comment => {
    const datePosted = dayjs(comment.created_at).fromNow();
    const user = comment.user;
    const body = DOMPurify.sanitize(marked(comment.body));
    const postedByAuthor = comment.author_association === 'OWNER';
    const edited = comment.created_at !== comment.updated_at;

    return `<li class="comment">
                <div class="commenter">
                    <img src="${user.avatar_url}" alt="" aria-hidden="true" class="meta avatar" />
                    <a
                        href="https://github.com/${user.login}"
                        class="meta username"
                        >${user.login}</a
                    >
                    <div class="meta date-posted">commented <time datetime="${comment.created_at}">${datePosted}</time></div>
                    ${postedByAuthor ? '<span class="meta tag author-badge">Author</span>' : ''}
                    ${edited ? `<span class="meta comment-edited">Edited</span>` : ''}
                </div>
                <div class="comment-body">${body}</div>
            </li>`;
  })
  .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
}
```
{% endraw %}

We're doing several things here, so let's break it all down. For example, this just sets a counter that tells users how many total comments there are:

```javascript
commentsCount.innerText = `(${comments.length})`;
```

The next few lines of code create an ordered list. We sort the comments to show the most recently posted ones first and chain a call to `Array.prototype.map` to create an array of comments, mapping each one to a list item as a template string:

```javascript
const commentsList = document.createElement("ol");
commentsList.className = 'comments-list';
commentsList.setAttribute("aria-label", "Comments on this blog post");

commentsList.innerHTML = comments
  .sort((comment1, comment2) => {
    return comment1.created_at < comment2.created_at ? 1 : -1;
  })
  .map(comment => { /* rendering here */ })
  .join('');
```

This line converts GitHub's markdown for a comment into HTML output:

```javascript
const body = DOMPurify.sanitize(marked(comment.body));
```

We're sanitizing the output HTML per `marked`'s README suggestion:

{% quote "marked GitHub README", "https://github.com/markedjs/marked#warning--marked-does-not-sanitize-the-output-html-please-use-a-sanitize-library-like-dompurify-recommended-sanitize-html-or-insane-on-the-output-html-" %}
  Warning: 🚨 Marked does not sanitize the output HTML. Please use a sanitize library, like DOMPurify (recommended), sanitize-html or insane on the output HTML! 🚨
{% endquote %}

Hopefully the rest of the code is self-explanatory. You can change any of these class names and remove any markup that you don't need for your purposes. For example, these lines are optional:

```javascript
const postedByAuthor = comment.author_association === 'OWNER';
const edited = comment.created_at !== comment.updated_at;
```

I use the first line to make my own comments stand out with an `Author` badge and the second to indicate that a comment has been edited. Neither functionality is super important; it's just there to make this look even more like a true comment system.

And that's it! You can now add comments to your Jekyll blog with relative ease. All that's left now is for you to add your own styling and even rearrange the HTML as you please.

Drop me a line down below if you run into any problems or if you see any areas for improvement.
