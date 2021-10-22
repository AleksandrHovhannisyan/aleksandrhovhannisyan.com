---
title: Add Comments to a Static Site with Netlify Functions and the GitHub API
description: Want to add comments to your static blog? Learn how to use the GitHub Issues API as your comment system and fetch comments with Netlify functions.
keywords: [comment system, comments, github api, netlify functions]
categories: [jamstack, netlify, github, node]
thumbnail: thumbnail.jpg
commentsId: 117
---

Comment systems are one of the easiest ways to solicit feedback from your readers and to encourage the kinds of civil and respectful discussions for which the internet is so well known. But where do you start with adding one to your site? There are tons of options to choose from, most of which aren't worth your time.

Fortunately, in the wonderful world of the JAMStack, adding comments to a static site has never been easier. In this article, I'll walk you through a simple setup for adding comments to any static site with Netlify functions and the GitHub Issues API.

{% include toc.md %}

## How It Works: Storing Comments in GitHub Issues

Rather than storing comments statically in my repo or with a known comment system provider, I use the GitHub Issues API as a makeshift comment system. If I want to enable comments for a particular post, I open a new issue in the GitHub repo for my site, jot down the issue number, and assign that to a variable in the post's front-matter block (I author my content in Markdown):

{% include codeHeader.html file: "src/_posts/my-post.md" %}
{% raw %}
```md
---
commentsId: 42
---
```
{% endraw %}

I also store this issue number in a `data-` attribute somewhere in the post's HTML. With most static site generators, you should be able to do this at the layout level for all of your posts.

{% raw %}
```html
<section id="comments" data-issue-id="{{ commentsId }}"></section>
```
{% endraw %}

The page then includes some custom JavaScript that uses the `IntersectionObserver` API to detect when a user has scrolled to the comments section. At that point, the script reads the issue number off of the `data-` attribute and makes a request to the GitHub API to fetch the comments for that particular post.

### Why Use GitHub Issues as a Comment System?

It may seem a little strange to use GitHub issues as a comment system, but hear me out! While there are lots of existing comment systems and platforms that you can integrate into your site, they all have their own problems.

Static comment systems (e.g., with [Staticman](https://staticman.net/)) are the simplest to set up, but they require you to rebuild your site for new comments to appear. This is too much maintenance—I want my users to be able to post comments and have them show up immediately upon refreshing the page. I also don't want to have to rebuild my site every time a new comment is posted.

At the same time, I want to be able to moderate comments and delete them if they're abusive. For this reason, Disqus tends to be a popular option since it gives you full admin permissions and control over comments. But it also comes with ads and tracking that I absolutely don't want my users to have to worry about.

A more neutral option is [utterances](https://utteranc.es/), a GitHub app that allows users to log into your site with their GitHub account and post comments directly. While utterances works and has been gaining popularity, it's limited in terms of theming and customization, mainly because it's static (unless you write your own CSS targeting their markup). I also don't want my readers to have to trust yet another app, especially just to post a comment.

On the other hand, directly fetching comments from a GitHub issue makes sense—**it's already a comment system**, with a fully transparent and well-engineered API. Plus, the GitHub interface already has built-in Markdown formatting, reactions, and content moderation. I can edit or delete comments that are abusive, and I can close or disable comments for a post whenever I want. I can even swap out the repo in the future. Users can delete or edit their comments at will and don't have to be concerned about their privacy. Best of all, I have full control over the markup and CSS.

So, with all things considered, a GitHub issue really is the perfect comment system for a static blog. You don't need to pay anything to use it, and it's powered by a platform that companies and developers all around the world trust.

## What's a Netlify Function?

My [old comment system](/blog/jekyll-comment-system-github-issues/) used the same strategy I outlined earlier, but it made unauthenticated API requests on the front end, which run into a rate limit of 60 requests per hour. This is a fairly typical limitation for static sites—you can't use API keys on the front end because anyone can inspect network requests and steal your credentials. So my old comment system wasn't very scalable or reliable. Authenticated requests, on the other hand, get a much more generous rate limit of [5000 requests per hour](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

The typical solution is to host a custom server—written with Express, Flask, or one of the many other web server frameworks—and to have it proxy the API requests for you. Now, instead of sending your request to the API directly, you send it to a dedicated REST endpoint that you've set up on your server. It makes the authenticated request for you and sends the response back to your front end.

But that's a lot of extra work, especially for a simple static site that just needs a comment system. Before the advent of [the JAMStack](https://www.netlify.com/jamstack/), static sites like this were traditionally limited in their capabilities. **Netlify functions** solve this problem and make your job a whole lot easier. Instead of deploying an entire web server in addition to your front end, you can take advantage of the fact that Netlify already *is* a server. All you need to do is create one script for every endpoint you need, and each function will get deployed alongside the rest of your site.

Under the hood, a Netlify function [is really just an AWS lambda](https://www.netlify.com/blog/2018/03/20/netlifys-aws-lambda-functions-bring-the-backend-to-your-frontend-workflow/); it gets registered at build time as an API endpoint to which you can send requests, just like with a traditional web server. When a request comes in for a particular endpoint, Netlify invokes your lambda with any query parameters and other data it received, executing the function on the server side. This is great because it allows you to [deploy a serverless site](https://docs.netlify.com/functions/overview/) with minimal effort.

## Your First Netlify Function

Now that we're clear on why I'm using Netlify functions and the GitHub API for my comment system, let's start setting things up and writing some code!

The basic idea is to set up a Netlify function to serve as an endpoint that can can fetch comments for a particular post. We'll want to be able to invoke the function with `fetch`, like this:

```js
const comments = (await fetch(`/.netlify/functions_dir/endpoint/?id=123`)).json();
```

To do this, we'll first need to create a directory for our Netlify functions in our project. By default, [Netlify looks for functions under `BASE_DIRECTORY/netlify/functions`](https://docs.netlify.com/functions/configure-and-deploy/), but you can tell it where to find your functions in your `netlify.toml` config, like this:

```toml
[functions]
  directory = "./path/to/functions"
```

Create a directory for Netlify functions in your project and update your config accordingly. It doesn't matter what you call this directory, so long as it's something sensible.

Now, suppose we want to be able to hit an endpoint like `/.netlify/functions/comments?id=123` on the front end. The important bit here is `comments?id=123` since the rest of it is just the path to your Netlify functions. The name of the function is `comments`, and it accepts a single query string parameter. To create a Netlify function for the `comments` endpoint, all we need to do is add a file of the same name to our functions directory. For example, if your functions directory is `functions`, then any of the following would be valid:

- `functions/comments.js`
- `functions/comments/comments.js`
- `functions/comments/index.js`

Note that Netlify [supports a number of languages for lambda functions](https://docs.netlify.com/functions/configure-and-deploy/#languages-and-language-settings), including JavaScript, TypeScript, and Go. I'll stick with JavaScript for this tutorial to keep things simple.

Then, all you need to do is export a named async function from that file:

{% include codeHeader.html file: "functions/comments.js" %}
```js
exports.handler = async (event, context) => {
  // logic goes here
};
```

That second argument really only matters if you need to know the context in which the function was called, like if you're [authenticating users with Netlify Identity](https://docs.netlify.com/visitor-access/identity/). For our purposes, we just need the `event` argument, which includes query string parameters and other information:

{% include codeHeader.html file: "functions/comments.js" %}
```js
exports.handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;
};
```

Your serverless function should then return two things: a `statusCode` and the `body` of the response. For starters, I'm just going to reflect the issue number back to the caller so I can test that it's working:

{% include codeHeader.html file: "functions/comments.js" %}
```js
exports.handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({ issueNumber }),
  };
};
```

Here's the great thing about Netlify functions: Since they're async and run in the cloud, you can write any logic that you want, like making authenticated API requests, without leaking private data on the client side. For example, you can access environment variables for sensitive things like API keys, just like you would anywhere else in Node—you have access to `process.env` in this lambda.

### Testing Netlify Functions Locally

Before we move on, you'll want to test that your function is working locally. You can do that with [Netlify Dev](https://www.netlify.com/products/dev/) by installing the `netlify-cli` package globally/locally, or by just using npx:

{% include codeHeader.html %}
```bash
npx netlify dev
```

This will start up a local Netlify dev server that simulates an actual production environment. It will even read environment variables from your `.env` file (which we'll create shortly) and install plugins locally. There are [lots of other commands](https://cli.netlify.com/) that you can invoke with the CLI, but the one that we care about is `netlify functions:invoke`. This allows you to simulate a Netlify function call in your terminal on demand without having to write any front-end JavaScript. It's a great way to get your bearings and understand how Netlify functions work.

With your Netlify dev server running, invoke this command to test your serverless function:

{% include codeHeader.html %}
```bash
npx netlify functions:invoke --queryString id=123
```

Run through the prompts to select the function that you want to invoke (there should only be one listed if this is your first time creating a Netlify function). You should see the following response `body` get logged to the console once you run the function:

```json
{ "issueNumber": "123" }
```

## Fetching Comments from the GitHub Issues API

Now that we know how Netlify functions work, we can start writing some real logic to fetch comments from a particular GitHub issue. We'll return those comments in the body of our response so that our front end can `fetch` this endpoint and map the returned values to a list of comments in the UI (or throw an error, if we return one).

### 1. Creating a Personal Access Token on GitHub

To get started, you'll want to head over to your GitHub profile, go to `Settings > Developer settings`, and [create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for basic API authentication.

{% include img.html src: "github-settings.png", alt: "The GitHub settings page for creating a personal access token. The UI is split into different areas; at the bottom is a list of checkboxes for different permissions that can be enabled.", baseFormat: "png" %}

You don't need to check any of the scopes since this token is only needed for basic API authentication, not for performing other actions related to your GitHub account. You can also set the personal access token's expiration to be whatever you want. Be sure to copy the access token after you create it so you can add it to your local and Netlify production environment variables in the next step.

### 2. Configuring Environment Variables

Create an `.env` file locally and add the access token you just copied. You can name the variable whatever you want:

```plaintext
GITHUB_PERSONAL_ACCESS_TOKEN = YourToken
```

Be sure to add `.env` to your `.gitignore` if it's not already there. Never check this file into Git!

Optionally, you can also install the `dotenv` package to be able to load local environment variables if you run your site locally without the Netlify Dev server:

{% include codeHeader.html %}
```bash
yarn add -D dotenv
```

I use Eleventy for my site, so I load all of my environment variables inside my `.eleventy.js` config:

{% include codeHeader.html file: ".eleventy.js" %}
```js
require('dotenv').config();
```

Again, this isn't required for Netlify Dev; it will automatically detect and load an `.env` file if one is present locally.

That's it for authenticating your local API requests. To authenticate production API requests, you'll need to go to your Netlify UI dashboard and find `Settings > Build & Deploy > Environment`. Under the Environment Variables section, create a new variable for your GitHub access token, just like you did locally (use the same name):

{% include img.html src: "environment-variables.png", alt: "The Netlify settings page for creating environment variables. Variables are listed in a two-column table layout. The first column shows the variable name; the second shows its value. Two variables are shown: GITHUB_PERSONAL_ACCESS_TOKEN and AWS_LAMBDA_JS_RUNTIME.", baseFormat: "png" %}

Remember: Your local `.env` file doesn't get checked into git, so unless you mirror your environment variables in the Netlify UI, it won't know what keys and values to use.

While you're here, you'll also want to create a variable named `AWS_LAMBDA_JS_RUNTIME` and set its value to `nodejs14.x`. This allows your Netlify functions to [use Node 14 for AWS](https://docs.netlify.com/functions/build-with-javascript/#runtime-settings); they default to Node 12 if you don't specify this through the Netlify UI, and that can lead to some 502 errors when you deploy your functions to production.

Note that any environment variables you configure through the Netlify UI will remain private; they won't appear in deploy logs or previews unless you print them and make your deploy logs public. You'll want to double-check that your Sensitive Variable Policy is set to `Require approval`. You can find this directly below the Environment Variables section.

### 3. Authenticating with the GitHub API

We'll use GitHub's official [Octokit JavaScript SDK](https://github.com/octokit/octokit.js) to authenticate and make API requests.

To get started, install Octokit:

{% include codeHeader.html %}
```bash
yarn add octokit
```

This includes a number of `@octokit`-namespaced packages, like `@octokit/rest` and `@octokit/auth-token`. You could also install those packages separately, but it's good to have everything under one convenient SDK.

Go back to your Netlify function and update it to set up an authenticated Octokit client. We'll use a try-catch block at the server level so we can return an appropriate status code and an error message if we encounter any problems with authenticating (e.g., if your access token has expired and you forgot to renew it).

{% include codeHeader.html file: "functions/comments.js" %}
```js
const { Octokit } = require('@octokit/rest');
const { createTokenAuth } = require('@octokit/auth-token');

exports.handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;

  try {
    const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
    const { token } = await auth();
    const octokitClient = new Octokit({ auth: token });
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to fetch comments for this post.' }),
    }
  }
}
```

All of the remaining code in this tutorial will continue inside the `try` block so we can catch and handle errors appropriately.

### 4. Checking the Rate Limit

Now that we've authenticated the Octokit client, we can check our rate limit and return an error status preemptively if we cannot make any more API requests. Note that this request does not itself count toward your rate limit.

{% include codeHeader.html file: "functions/comments.js" %}
```js
const { data: rateLimitInfo } = await Octokit.rateLimit.get();
const remainingCalls = rateLimitInfo.resources.core.remaining;
console.log(`GitHub API requests remaining: ${remainingCalls}`);
if (remainingCalls === 0) {
  return {
    statusCode: 429,
    body: JSON.stringify({ error: 'Unable to fetch comments at this time. Check back later.' }),
  };
}
```

We're also logging the number of requests remaining so we can check in on this from time to time in our Netlify dashboard under the `Functions` tab, where you can see real-time requests for your deployed functions:

{% include img.html src: "function-calls.png", alt: "A series of logs displayed vertically in tabular format, with timestamps in the first column, request IDs in the second column, and a console message that reads 'GitHub API requests remaining' followed by a number. There are 4 logs in total; the number starts at 5000 and decreases to 4997 by the end of the snapshot.", baseFormat: "png" %}

Locally, you'll see messages get logged in your `netlify dev` server in your terminal. At this point, you can test that the correct value is getting logged for the number of requests remaining (it should start at `5000` if you have not yet made any API calls).

### 5. Returning Comments for a GitHub Issue

The final step is to use the authenticated Octokit client to fetch all comments for a particular issue number. Recall that we're getting the issue number as a query parameter:

{% include codeHeader.html file: "functions/comments.js" %}
```js
const response = await octokitClient.issues.listComments({
  owner: `YOUR_USERNAME`,
  repo: `YOUR_REPO`,
  issue_number: issueNumber,
});
```

We can then reshape the data as needed and return the comments from our lambda:

{% include codeHeader.html file: "functions/comments.js" %}
```js
const comments = response.data
  // Sort by most recent comments
  .sort((comment1, comment2) => comment2.created_at.localeCompare(comment1.created_at))
  // Restructure the data so the client-side JS doesn't have to do this
  .map((comment) => {
    return {
      user: {
        avatarUrl: comment.user.avatar_url,
        name: comment.user.login,
      },
      datePosted: comment.created_at,
      isEdited: comment.created_at !== comment.updated_at,
      isAuthor: comment.author_association === 'OWNER',
      body: toMarkdown(comment.body),
    };
  });

return {
  statusCode: response.status,
  body: JSON.stringify({ data: comments }),
};
```

You could also use `dayjs` to convert `comment.created_at` to a more human-readable form like I do on my site:

```js
datePosted: dayjs(comment.created_at).fromNow()
```

Note this line in particular for the mapped comments:

```plaintext
body: toMarkdown(comment.body)
```

Since `comment.body` is in Markdown, this is just a placeholder to indicate that you can use whatever Markdown library you want to convert the comment body to HTML (e.g., [`markdown-it`](https://github.com/markdown-it/markdown-it)). Alternatively, you can use `comment.body_html` directly.

### 6. Sanitizing Comments to Prevent XSS Attacks

Since the GitHub API doesn't sanitize comment bodies, we'll also want to install an HTML sanitizer like [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) to prevent XSS attacks:

{% include codeHeader.html %}
```bash
yarn add sanitize-html
```

And use it to sanitize the parsed body of the comment before returning it:

```js
body: sanitizeHtml(toMarkdown(comment.body))
```

### 7. Calling the Netlify Function on the Client Side

You can now test that your Netlify function works as expected by invoking it locally with the Netlify CLI. At this point, you could also write some client-side JavaScript to make a request to your lambda. That might look like this:

{% include codeHeader.html file: "src/assets/scripts/index.js" %}
```js
const fetchComments = async (id) => {
  const response = await fetch(`/.netlify/functions/comments?id=${id}`);
  const { data: comments, error } = await response.json();
  if (error) {
    throw new Error(error);
  }
  return comments;
};
```

You can then render those comments however you want or handle the error in a try-catch.

As I mentioned before, if you use a static site generator like 11ty, Jekyll, or some other framework that supports Markdown, you'll want to track the GitHub issue ID in the post's front matter and then set it as a `data-` attribute somewhere in your HTML. That way, your client-side JavaScript can look it up and pass it along to the API call as a query parameter when it calls your lambda.

And that's all there is to it! Try it out on my site, and let me know what you think.

{% include unsplashAttribution.md name: "Adam Solomon", username: "solomac", photoId: "WHUDOzd5IYU" %}
