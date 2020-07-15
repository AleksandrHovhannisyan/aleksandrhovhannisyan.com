---
title: Add Comments to a Jekyll Blog with the GitHub Issues API
description: Learn how to add comments to your Jekyll blog. We'll use the GitHub issues API as our comment system and lazy load it for a better user experience.
keywords: [jekyll comment system]
tags: [dev, jekyll, github, javascript]
comments_id: 45
---

A while back, [Ari Stathopoulos wrote a tutorial](https://aristath.github.io/blog/static-site-comments-using-github-issues-api) on how to use the GitHub Issues API as a comment system. And you know what? It works like a charm! It's actually what I use on this very blog. The only notable downside is that unauthenticated requests have a [rate limit of 60 requests/hour](https://developer.github.com/v3/#rate-limiting).

In this tutorial, I'd like to introduce a modified version of Ari's approach that:

1. Only loads the comment system once the user has scrolled to the end of the page.
2. Sanitizes each comment to escape special characters and prevent XSS attacks.
3. Uses moment.js to display relative dates, like you see on most comment systems.

That last point is really optional. My two key concerns were to improve my comment system's performance and to ensure that users can't get away with XSS via GitHub comments.

## How to Add Comments to a Jekyll Blog

This section is a bit of a recap on how to use the GitHub Issues API to add comments to a Jekyll blog. Most of this is covered in Ari's post, save for some differences in the markup itself.

First, you'll need a public repo for your comments. Add this variable to your `_config.yml`:
   
{% capture code %}issues_repo: YourUsername/RepoName{% endcapture %}
{% include code.html file="_config.yml" code=code lang="yml" %}

We'll use this a few times in our code, so it's a good idea to define it in one place instead of copy-pasting it. That way, if the repo name ever changes, you'll only have to update it in `_config.yml`.

If a particular blog post needs comments, simply open an issue for it in that repo and note its ID:

{% include picture.html img="issue-id" ext="png" alt="The ID of an issue on my GitHub repo." %}

Add the following front matter variable to the blog post and assign it the ID from above:

{% capture code %}comments_id: 35{% endcapture %}
{% include code.html file="_posts/2020-07-07-my-post.md" code=code lang="markdown" %}

In your `post.html` layout file, we'll check to see if this front matter variable was specified. If it wasn't, then the comment system is turned off for that post. If it was, then we'll want to include a file containing our HTML and JavaScript for the comment system:

{% capture code %}{% raw %}{% if page.comments_id %}
    {% include comments.html issue_id=page.comments_id %}
{% endif %}{% endraw %}{% endcapture %}
{% include code.html file="_layouts/post.html" code=code lang="liquid" %}

And here's the include file itself (or at least part of it—we'll fill in the script shortly):

{% capture code %}{% raw %}{% assign issues_repo = site.issues_repo %}
{% assign issue_id = include.issue_id %}

<footer id="comments-footer">
    <div class="comment-actions">
        <h2>Comments <span id="comments-count"></span></h2>
        <a
          class="button solid-button plus-button post-comment"
          href="https://github.com/{{ issues_repo }}/issues/{{ issue_id }}"
          >Post comment</a
        >
    </div>
    <div id="comments-wrapper">
      Loading...
    </div>
</footer>

<!-- Comments script -->
<script></script>{% endraw %}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="html" %}

Up at the top, I'm simply creating local variables so I don't have to repeat {% raw %}`include.issue_id`{% endraw %} and {% raw %}`site.issues_repo`{% endraw %} in my markup. Next, I've defined some basic HTML for the comment system itself. Notice that the anchor element (button) has the following `href` that points to the corresponding GitHub issue URL:

```
{% raw %}https://github.com/{{ issues_repo }}/issues/{{ issue_id }}{% endraw %}
```

When users click this link, they'll be directed to the "comment system" for a given post.

## Using the GitHub Issues API as a Comment System

Time to start writing some JavaScript. We won't put our code in its own `.js` file because we need the include argument in order to hit the right GitHub API endpoint, and that issue ID is only accessible in `_includes/comments.html`. So we'll have to put up with an inline script.

First, we'll create some variables for ourselves at the top of this script to reference a few of the elements on the page:

{% capture code %}{% raw %}<script>
  const commentsFooter = document.getElementById('comments-footer');
  const commentsWrapper = commentsFooter.querySelector('#comments-wrapper');
  const commentsCount = commentsFooter.querySelector('#comments-count');
</script>{% endraw %}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="html" %}

We'll want to:

1. Make a request to the GitHub API when a user scrolls to the bottom of a blog post.
2. Load all comment-related dependencies for pre-processing these comments.
3. Once all of those scripts have loaded, render the comments as HTML.

### 1. Detecting When a User Scrolls to the Comments Section

If you simply load the comment system every time a user opens one of your blog posts, that's going to initiate an unnecessary API request and load dependencies that are not yet needed. Getting rid of this unnecessary bandwidth usage becomes especially important for mobile optimization.

To detect when a user has scrolled to the end of our blog post, we'll use the widely supported [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Here's all the code that we need to defer loading the comments section:

{% capture code %}const commentsObserver = new IntersectionObserver(function (entries, self) {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          fetchComments(); // this is the important part
          self.unobserve(entry.target);
      }
  });
}, { rootMargin: '200px 0px 0px 0px' });

commentsObserver.observe(commentsFooter);{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

Basically, the observer checks to see if it's intersecting with the `commentsFooter` element. If it is, it calls a `fetchComments` routine that we'll set up in a second.

Note that an `IntersectionObserver` accepts a function as its first argument and an optional configuration object as its second argument. Here, the config I've passed in sets a `rootMargin` option. You can think of this as a margin (really padding) around an invisible "intersection rectangle" that follows the user around the page as they scroll. A top margin of `200px` here essentially treats an intersection as 200px *before* a user has reached the comments section (i.e., we **preload the comments** so that there's very little, if any, visible delay in rendering the comments).

Here's the `fetchComments` function that gets fired off when an intersection is detected:

{% capture code %}{% raw %}function fetchComments() {
  fetch(
    'https://api.github.com/repos/{{ issues_repo }}/issues/{{ issue_id }}/comments'
  )
    .then(blob => blob.json())
    .then(initRenderComments)
    .catch(e => {
      commentsWrapper.innerHTML = `<p>Unable to retrieve the comments for this post. Check back later.</p>`;
    });
}{% endraw %}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

This uses the `fetch` browser API to make a Promise-based XHR request. On failure, we set a message informing the user that we were unable to fetch the comments. If the data is returned and processed, we invoke an `initRenderComments` function that we'll define in a bit. That function will initiate the process of loading the dependency scripts for our comment system.

Speaking of which...

### 2. Loading Dependencies for Our Jekyll Comment System

First, note that we'll need these three scripts for our comment system:

- `marked`, for processing markdown from GitHub comments and spitting out HTML.
- `DOMPurify`, for sanitizing `marked`'s HTML output (e.g., to prevent XSS attacks).
- `moment`, for rendering comment timestamps relative to now (e.g., "3 hours ago").

Now, you can certainly load these using script elements like so:

```html
<!-- HTML up at the top -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="/assets/scripts/purify.min.js"></script>

<!-- Our custom comments script -->
<script>
  const commentsFooter = document.getElementById('comments-footer');
  const commentsWrapper = commentsFooter.querySelector('#comments-wrapper');
  const commentsCount = commentsFooter.querySelector('#comments-count');
  
  // more code

</script>
```

**However, I don't recommend doing this** for the same reason that we're deferring our API request until the user scrolls to the bottom of the page: Why fetch resources that we don't need unless a user expects the comments to show up? In other words, we shouldn't just stick these directly in the HTML—we should load them in our JavaScript only after a user has scrolled to the comments section. Better yet, if the GitHub API returns no comments, we won't even bother loading these scripts, saving the user even more bandwidth and making Lighthouse happy.

So, we'll load these scripts using JavaScript by creating `script` elements, setting their `src` attributes, and appending them to the DOM body. However, since scripts are loaded asynchronously, they may get loaded out of order. This means we'll need some way to hold off on rendering the comments until *all* of the dependencies have loaded, in whatever order that may be. To do that, we'll use a simple object like this to keep track of which dependencies have loaded:

{% capture code %}const commentScripts = {
  moment: {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js',
    loaded: false,
  },
  marked: {
    src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    loaded: false,
  },
  purify: {
    src: '/assets/scripts/purify.min.js',
    loaded: false,
  },
};{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

And we'll define a helper function to go along with it that checks if all scripts have loaded:

{% capture code %}{% raw %}/**
* @returns {Boolean} true if all comment script dependencies have loaded, and false otherwise
*/
function allCommentScriptsLoaded() {
  return Object.keys(commentScripts).every(scriptName => commentScripts[scriptName].loaded);
}{% endraw %}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

> **Note**: Alternatively, you could increment a counter and compare it to the length of the `commentScripts` object. My approach, while not necessarily efficient, is good enough and fairly easy to understand.

Two of the scripts will be loaded via CDNs, but the third just has a distribution folder on GitHub. Go ahead and grab the `purify.min.js` script [from DOMPurify's GitHub repo](https://github.com/cure53/DOMPurify/tree/main/dist) and put it somewhere in your assets folder (I like to keep all my JS under `/assets/scripts/`). If you put it somewhere different, just be sure to update the `src` path above.

Here's the `initRenderComments` function that gets called by `fetchComments` once it finishes:

{% capture code %}/**
* Called after the GitHub API request finishes.
* @param {Array<Object>} comments - an array of objects representing GitHub comments
*/
function initRenderComments(comments) {
  if (!comments.length) {
    commentsWrapper.innerHTML = `<p>No comments yet 👀 Be the first to post!</p>`;
    return;
  }

  // Load all comment script dependencies async
  Object.keys(commentScripts).forEach(script =>
    loadCommentScript(commentScripts[script], () => renderComments(comments))
  );
}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

And here's the `loadCommentScript` helper:

{% capture code %}/**
* @param {Object} script - the script to load async
* @param {function} callback - a function to call once the script has loaded
*/
function loadCommentScript(script, callback) {
  const scriptElement = document.createElement('script');
  scriptElement.src = script.src;
  document.body.appendChild(scriptElement);

  scriptElement.onload = () => {
      script.loaded = true;
      callback();
  };
}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

Basically, it creates a script element and registers an `onload` listener that tags the script object as loaded and invokes a callback. What's that callback? If you look above in `initRenderComments`, we're passing in an arrow function that invokes `renderComments(comments)`:

```javascript
Object.keys(commentScripts).forEach(script =>
  loadCommentScript(commentScripts[script], () => renderComments(comments))
);
```

And that's the last thing we need for our Jekyll comment system to work.

### 3. Rendering the Comments

{% capture code %}{% raw %}/**
* @param {Array<Object>} comments - an array of objects representing GitHub comments
*/
function renderComments(comments) {
  if (!allCommentScriptsLoaded()) return;

    commentsCount.innerText = `(${comments.length})`;

    const commentsList = document.createElement('ol');
    commentsList.className = 'comments';
    commentsList.setAttribute('aria-label', 'Comments on this blog post');

    commentsList.innerHTML = comments
    .sort((comment1, comment2) => {
      return comment1.created_at < comment2.created_at ? 1 : -1;
    })
    .map(comment => {
      const user = comment.user;
      const datePosted = moment(comment.created_at).fromNow();
      const body = DOMPurify.sanitize(marked(comment.body));
      const postedByAuthor = comment.author_association === 'OWNER';
      const edited = comment.created_at !== comment.updated_at;

      return `<li class="comment">
                  <header class="comment-header">
                      <div class="user">
                          <img src="${user.avatar_url}" alt="" aria-hidden="true" class="avatar" />
                          <a
                              href="https://github.com/${user.login}"
                              class="name"
                              aria-label="Comment by ${user.login}"
                              >${user.login}</a
                          >
                          ${postedByAuthor ? '<span class="tag author-badge">Author</span>' : ''}
                          ${edited ? `<span class="comment-edited">Edited</span>` : ''}
                      </div>
                      <time class="date-posted" datetime="${comment.created_at}">${datePosted}</time>
                  </header>
                  <div class="comment-body">${body}</div>
              </li>`;
    })
    .join('');
    
    commentsWrapper.innerHTML = '';
    commentsWrapper.appendChild(commentsList);
}{% endraw %}{% endcapture %}
{% include code.html file="_includes/comments.html" code=code lang="javascript" %}

Up at the top of this function, we're using the fail-fast approach and returning if there are some scripts that have not yet loaded. This ensures that all of the remaining code will only get called once all three scripts have loaded.

We're doing several things here, so let's break it all down.

This sets a counter that tells users how many total comments there are:

```javascript
commentsCount.innerText = `(${comments.length})`;
``` 

The next few lines of code create an `ol` element and give it a meaningful aria label. We also sort the comments to show the most recently posted ones first and chain a call to `Array.prototype.map` to create an array of comments:

```javascript
const commentsList = document.createElement("ol");
commentsList.className = "comments";
commentsList.setAttribute("aria-label", "Comments on this blog post");

commentsList.innerHTML = comments
  .sort((comment1, comment2) => {
    return comment1.created_at < comment2.created_at ? 1 : -1;
  })
  .map(comment => { ... })
  .join('');
```

These two lines use our loaded dependencies:

```javascript
const datePosted = moment(comment.created_at).fromNow();
const body = DOMPurify.sanitize(marked(comment.body));
```

We're using `DOMPurify.sanitize` per `marked`'s [README suggestion](https://github.com/markedjs/marked#warning--marked-does-not-sanitize-the-output-html-please-use-a-sanitize-library-like-dompurify-recommended-sanitize-html-or-insane-on-the-output-html-):

> Warning: 🚨 Marked does not sanitize the output HTML. Please use a sanitize library, like DOMPurify (recommended), sanitize-html or insane on the output HTML! 🚨

Hopefully the rest of the code is self-explanatory. You can change any of these class names and remove any markup that you don't need for your purposes. For example, these lines are optional:

```javascript
const postedByAuthor = comment.author_association === 'OWNER';
const edited = comment.created_at !== comment.updated_at;
```

I use the first line to make my own comments stand out with an `Author` badge and the second to indicate that a comment has been edited. Neither functionality is super important; it's just there to make this look even more like a true comment system. 

And that's it! You can now add comments to your Jekyll blog with relative ease.

Drop me a line down below if you run into any problems or if you see any areas for improvement.
