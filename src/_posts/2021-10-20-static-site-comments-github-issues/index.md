---
title: Add Comments to a Dev Blog with Netlify Functions and the GitHub API
description: Comment systems can be a pain to set up, but they don't have to be. Learn how to use the GitHub Issues API to create a custom comment system powered by Netlify functions.
keywords: [comment system, comments, github api, netlify functions]
categories: [netlify, github, node]
thumbnail: https://images.unsplash.com/photo-1512626120412-faf41adb4874?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
commentsId: 117
lastUpdated: 2024-08-15
---

Comment systems are one of the easiest ways to collect feedback from your readers and to encourage the kinds of civil and respectful discussions for which the internet is so well known. But how do you add comments to a simple static site? There are lots of options to choose from these days, but they all come with their drawbacks: privacy concerns, ads, styling and markup that you don't have control over, and so many other problems.

Fortunately, there's a much easier option: Using GitHub Issues as a makeshift comment system and then fetching users' comments with a serverless function. In this tutorial, I'll show you how to fetch those comments with a simple Netlify Function. If you're hosting your blog on Vercel or some other serverless provider, you can use their proprietary offering or even [AWS Lambda](https://aws.amazon.com/lambda/) (which is what nearly all of these platforms use under the hood anyway).

{% include "toc.md" %}

## Concept: Using GitHub as a Comment System

Rather than storing comments statically in my repo or with a known comment system provider, I use the GitHub Issues API as a makeshift comment system. If I want to enable comments for one of my posts, I open a new issue in the GitHub repository for my site, jot down the issue number, and assign that to a variable in the post's front-matter block (I author my content in Markdown):

{% raw %}
```md {data-file="src/_posts/my-post.md" data-copyable=true}
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

The page then includes some JavaScript to detect when a user has scrolled to the comments section. At that point, the script reads the issue number off of the `data-` attribute and makes a request to the GitHub API to fetch the comments for that particular post. You could also fetch these comments at build time, or even request time if you use server-side rendering.

### Justification and Motivation

It may seem a little strange to use GitHub issues as a comment system, but hear me out! While there are lots of existing comment systems and platforms that you can integrate into your site, they all have their own problems.

Static comment systems (e.g., with [Staticman](https://staticman.net/)) are the simplest to set up, but they require you to rebuild your site for new comments to appear. This is too much maintenance—I want my users to be able to post comments and have them show up immediately upon refreshing the page. I also don't want to have to rebuild my site every time a new comment is posted.

At the same time, I want to be able to moderate comments and delete them if they're abusive. For this reason, Disqus tends to be a popular option since it gives you full admin permissions and control over comments. But it also comes with ads and tracking that I absolutely don't want my users to have to worry about.

A more neutral option is [utterances](https://utteranc.es/), a GitHub app that allows users to log into your site with their GitHub account and post comments directly. While utterances works and has been gaining popularity, it's limited in terms of theming and customization, mainly because it's static (unless you write your own CSS targeting their markup). I also don't want my readers to have to trust yet another app, especially just to post a comment.

On the other hand, directly fetching comments from a GitHub issue makes sense—**it's already a comment system**, with a fully transparent and well-engineered API. Plus, the GitHub interface already has built-in Markdown formatting, reactions, and content moderation. I can edit or delete comments that are abusive, and I can close or disable comments for a post whenever I want. I can even swap out the repo in the future. Users can delete or edit their comments at will and don't have to be concerned about their privacy. Best of all, I have full control over the markup and CSS.

So, with all things considered, a GitHub issue really is the perfect comment system for a static blog. You don't need to pay anything to use it, and it's powered by a platform that companies and developers all around the world trust.

## Netlify Functions: An Overview

My [old comment system](/blog/jekyll-comment-system-github-issues/) used the same strategy I outlined earlier, but it made unauthenticated API requests on the front end, which run into a rate limit of 60 requests per hour. This is a fairly typical limitation for static sites—you can't use API keys on the front end because anyone can inspect network requests and steal your credentials. So my old comment system wasn't very scalable or reliable. Authenticated GitHub requests, on the other hand, get a much more generous rate limit of [5000 requests per hour](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

The typical solution is to host a custom server—written with Express, Flask, or one of the many other web server frameworks—and to have it proxy the API requests for you. Now, instead of sending your request to the API directly, you send it to a dedicated REST endpoint that you've set up on your server. It makes the authenticated request for you and sends the response back to your front end.

But that's a lot of extra work, especially for a simple static site that just needs a comment system. Instead of deploying an entire server to make what is essentially just one API call, we can write and deploy a <dfn>serverless function</dfn>: a function that takes a request and returns a response. You could use AWS Lambda, but I prefer [Netlify Functions](https://www.netlify.com/platform/core/functions/) because:

- I already host my site on Netlify.
- It has a much better local developer experience than AWS SAM.
- It takes a lot less time to set up.

Under the hood, a Netlify function [is really just an AWS lambda](https://www.netlify.com/blog/2018/03/20/netlifys-aws-lambda-functions-bring-the-backend-to-your-frontend-workflow/); it gets registered at build time as an API endpoint to which you can send requests, just like with a traditional web server. When a request comes in for a particular endpoint, Netlify invokes your lambda with any query parameters and other data it received, executing the function on the server side. This is great because it allows you to [deploy a serverless site](https://docs.netlify.com/functions/overview/) with minimal effort.

Here's the great thing about Netlify functions: Since they're async and run on Netlify servers, you can safely make authenticated API requests without leaking private data on the client side. For example, you can access environment variables for sensitive things like API keys, just like you would anywhere else in Node—you have access to `process.env`.

### Your First Netlify Function

Now that we're clear on why I'm using Netlify functions and the GitHub API for my comment system, let's start setting things up and writing some code. The basic idea is to set up a Netlify function to serve as an endpoint that can can fetch comments for a particular post. We'll want to eventually be able to invoke the function on the client side like this:

```js
const comments = (await fetch(`/.netlify/functions_dir/endpoint/?id=123`)).json();
```

To do this, we'll first need to create a directory for our Netlify functions in our project. By default, [Netlify looks for functions under `BASE_DIRECTORY/netlify/functions`](https://docs.netlify.com/functions/configure-and-deploy/), but you can tell it where to find your functions in your `netlify.toml` config, like this:

```toml
[functions]
  directory = "./path/to/functions"
```

Create a directory for Netlify functions in your project and update your config accordingly. It doesn't matter what you call this directory.

Now, let's say we want to hit an endpoint like `/.netlify/functions/comments?id=123` on the front end. The important bit here is `comments?id=123` since the rest of it is just the path to your Netlify functions. The name of the function is `comments`, and it accepts a single query string parameter. To create a Netlify function for the `comments` endpoint, all we need to do is add a file of the same name to our functions directory. For example, if your functions directory is `functions`, then any of the following would be valid:

- `functions/comments.js`
- `functions/comments/comments.js`
- `functions/comments/index.js`

Note that Netlify [supports a number of languages for lambda functions](https://docs.netlify.com/functions/configure-and-deploy/#languages-and-language-settings), including JavaScript, TypeScript, and Go. I'll stick with JavaScript for this tutorial to keep things simple.

Then, all we need to do is export an async function from that file:

```js {data-file="functions/comments.js" data-copyable=true}
export default async function getCommentsForPost(request) {
  // logic goes here
};
```

This function accepts the HTTP request as a web-standards-compatible [`Request` object](https://developer.mozilla.org/en-US/docs/Web/API/Request), which means we can read query parameters off of it:

```js {data-file="functions/comments.js" data-copyable=true}
export default async function getCommentsForPost(request) {
  const issueNumber = new URL(request.url).searchParams.get('id');
};
```

Your Netlify function can then return a [`Response` object](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### Testing Netlify Functions Locally

For now, I'm just going to send the issue number back to the caller so I can test that my function is working:

```js {data-file="functions/comments.js" data-copyable=true}
export default async function getCommentsForPost(request) {
  const issueNumber = new URL(request.url).searchParams.get('id');
  return new Response(JSON.stringify({ issueNumber }), { status: 200 });
};
```

We can test this function locally using [Netlify Dev](https://www.netlify.com/products/dev/). Install the [`netlify-cli` package](https://www.npmjs.com/package/netlify-cli) either locally or globally to get started. Then, execute it from the root of your Netlify website:

```bash {data-copyable=true}
npx netlify dev
```

{% aside %}
If you're using pnpm, you'll need to do `pnpm exec netlify dev` if Netlify is installed locally.
{% endaside %}

This will start up a local Netlify dev server that simulates an actual production environment. It will even read environment variables from your `.env` file (which we'll create shortly) and install plugins locally. There are [lots of other commands](https://cli.netlify.com/) that you can invoke with the CLI, but the one that we care about is `netlify functions:invoke`. This allows you to simulate a Netlify function call in your terminal on demand without having to write any front-end JavaScript. It's a great way to get your bearings and understand how Netlify functions work.

With your Netlify dev server running, invoke this command to test your serverless function:

```bash {data-copyable=true}
npx netlify functions:invoke --querystring id=123
```

You'll be prompted to select the function to run. If this is your first time creating a Netlify Function for your site, there should only be one listed. After you select the function, it will be called and you should see the following response in your terminal:

```json
{ "issueNumber": "123" }
```

## Fetching Comments from the GitHub Issues API

Now that we know how Netlify functions work, we can write a custom function to fetch comments from a GitHub issue. We'll return those comments in the body of our response so that our front-end code can `fetch` this endpoint and map the returned values to a list of comments in the UI (or throw an error, if we return one).

### 1. Create a Personal Access Token on GitHub

To get started:

1. Visit your GitHub profile.
2. Go to `Settings > Developer settings`.
3. [Create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for basic API authentication.

{% include "postImage.html" src: "./images/github-settings.png", alt: "The GitHub settings page for creating a personal access token. The UI is split into different areas; at the bottom is a list of checkboxes for different permissions that can be enabled.", baseFormat: "png" %}

You don't need to check any of the scopes since this token is only needed for basic API authentication, not for performing other actions related to your GitHub account. You can also set the personal access token's expiration to be whatever you want. Be sure to copy the access token after you create it so you can add it to your local and Netlify production environment variables in the next step.

### 2. Configure Environment Variables

Create an `.env` file locally and add the access token that you just copied. You can name the variable whatever you want:

``` {data-file=".env" data-copyable=true}
GITHUB_PERSONAL_ACCESS_TOKEN = YourToken
```

This is all you'll need to authenticate your local API requests. You don't need to install a package like `dotenv`—Netlify Dev will take care of loading your environment variables for you when you start up the server. Be sure to add `.env` to your `.gitignore` if it's not already there—never check environment variables into Git!

You may be wondering, though: If we don't push our `.env` file to our repo, how will Netlify know what values to use for a production build? That's where we'll need to mirror these environment variables on Netlify so it's aware of them.

To authenticate production API requests, you can [import environment variables from an `.env` file using the Netlify CLI](https://www.netlify.com/blog/2021/07/12/managing-environment-variables-from-your-terminal-with-netlify-cli/#import-environment-variables-from-a-file), or you can configure the environment variables manually through the Netlify UI. I'll briefly go over how to do the latter, but feel free to use the CLI instead.

Go to your Netlify UI dashboard and find `Settings > Build & Deploy > Environment`. Under the Environment Variables section, create a new variable for your GitHub access token, just like you did locally (use the same name):

{% include "postImage.html" src: "./images/environment-variables.png", alt: "The Netlify settings page for creating environment variables. Variables are listed in a two-column table layout. The first column shows the variable name; the second shows its value. Two variables are shown: GITHUB_PERSONAL_ACCESS_TOKEN and AWS_LAMBDA_JS_RUNTIME.", baseFormat: "png" %}

Note that any environment variables you configure on Netlify will remain private; they won't appear in deploy logs or previews unless you print them and make your deploy logs public. You'll want to double-check that your Sensitive Variable Policy is set to `Require approval`. You can find this directly below the Environment Variables section.

### 3. Authenticate with the GitHub API

We'll use GitHub's official [Octokit JavaScript SDK](https://github.com/octokit/octokit.js) to authenticate and make API requests. You technically don't _need_ to do this, but there's really no reason not to, especially since server-side packages won't get included in any client-side bundles.

Install the following packages:

- [`@octokit/auth-token`](https://www.npmjs.com/package/@octokit/auth-token)
- [`@octokit/core`](https://www.npmjs.com/package/@octokit/core)
- [`@octokit/rest`](https://www.npmjs.com/package/@octokit/rest)

Then, go back to your Netlify function and update it to set up an authenticated Octokit client in the module scope:

```js {data-file="functions/comments.js" data-copyable=true}
import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';

// Abort build if this is missing
if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('Missing environment variable: GITHUB_PERSONAL_ACCESS_TOKEN');
}
// Authenticate with GitHub Issues SDK. Do this only once for the module rather than per request.
const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
const { token } = await auth();
const octokit = new Octokit({ auth: token });
```

With that out of the way, we can start building out our Netlify function. Let's do some basic validation:

```js {data-file="functions/comments.js" data-copyable=true}
export default async function getCommentsForPost(request) {
  let issueNumber = new URL(request.url).searchParams.get('id');
  if (!issueNumber) {
    return new Response(JSON.stringify({ error: 'You must specify an issue ID.' }), { status: 400 });
  }
  try {
    // rest of the tutorial code will go here
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'Unable to fetch comments for this post.' }), { status: 500 });
  }
}
```

We first parse the `id` query parameter from the request object and check if it was provided. If it wasn't, then we return a 400 Bad Request. In our case, this would only happen if we forgot to pass in an ID via query params.

All of the remaining code in this tutorial will go inside the `try` block so we can catch and handle errors appropriately. I'll omit code we've already written for brevity. Alternatively, you can just [grab the final code](#final-code).

### 4. Check the Rate Limit

Now that we've authenticated the Octokit client and verified that we have an ID to query, we'll first check our rate limit and return an error status preemptively if we cannot make any more API requests. Note that this request does not itself count toward your rate limit.

```js {data-file="functions/comments.js" data-copyable=true}
const { data: rateLimitInfo } = await octokit.rateLimit.get();
const remainingRequests = rateLimitInfo.rate.remaining;
console.log(`GitHub API requests remaining: ${remainingRequests}`);
if (remainingRequests === 0) {
  return new Response(JSON.stringify({ error: `API rate limit exceeded.` }), {
    status: 503
  });
}
```

We're also logging the number of requests remaining so we can check in on this from time to time in our Netlify dashboard under the `Functions` tab, where you can see real-time requests for your deployed functions:

{% include "postImage.html" src: "./images/function-calls.png", alt: "A series of logs displayed vertically in tabular format, with timestamps in the first column, request IDs in the second column, and a console message that reads 'GitHub API requests remaining' followed by a number. There are 4 logs in total; the number starts at 5000 and decreases to 4997 by the end of the snapshot.", baseFormat: "png" %}

Locally, you'll see messages get logged in your `netlify dev` server in your terminal. At this point, you can test that the correct value is getting logged for the number of requests remaining (it should start at `5000` if you have not yet made any API calls).

### 5. List Comments for a GitHub Issue

The final step is to use the authenticated Octokit client to fetch all comments for this issue. We'll need to paginate the results, but thankfully Octokit has a helper to do that for us:

```js {data-file="functions/comments.js" data-copyable=true}
const response = await octokit.paginate(
  octokit.issues.listComments,
  {
    owner: site.issues.owner,
    repo: site.issues.repo,
    issue_number: parseInt(issueNumber, 10),
    sort: 'created_at',
    direction: 'desc',
    per_page: 100, // max supported by API
  },
  (response) => response.data.map((comment) => ({
    user: {
      avatarUrl: comment.user.avatar_url,
      name: comment.user.login,
      isAuthor: comment.author_association === 'OWNER',
    },
    dateTime: comment.created_at,
    isEdited: comment.created_at !== comment.updated_at,
    body: markownToHtml(comment.body),
  }))
);

return new Response(JSON.stringify({ data: response }), { status: 200 });
```

`Octokit.paginate` takes three arguments:

1. The endpoint to call,
2. The parameters to pass to that endpoint, and
3. A mapping function that takes the response and allows you to reshape it.

Here, I'm sorting comments in the same order as they appear in the GitHub UI (oldest comments first). I'm passing along all the info for my GitHub username, repo name, and the issue number.

In the mapping function, I'm returning some custom information about each comment based on the API response. For example, if a comment's creation date differs from its update date, I'll return a boolean `isEdited` so I can mark the comment as "Edited" in the UI.

Note this line in particular for the mapped comments:

```js
body: markownToHtml(comment.body)
```

This is just a placeholder to indicate that you can use whatever Markdown library you want to convert the text to HTML. Alternatively, you can use `comment.body_html` directly to get GitHub's custom HTML, although I don't recommend doing this as you have no control over that markup.

### 6. Sanitize Comments to Prevent XSS

Since the GitHub API doesn't sanitize comments for us, you'll need to install an HTML sanitizer like [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) and use it to sanitize the parsed body of the comment before returning it:

```js
body: sanitizeHtml(markownToHtml(comment.body))
```

Otherwise, if you don't do this, you could open yourself up to XSS attacks. You've been warned!

You'll want to do the same thing for usernames:

```js
name: sanitizeHtml(comment.user.login)
```

{% aside %}
You may also want to extend the default list of allowed tags and attributes for the sanitizer. See the [sanitize-html docs](https://www.npmjs.com/package/sanitize-html) for examples of how to do this.
{% endaside %}

### 7. Call the Netlify Function

You can now test your Netlify function by invoking it locally with the CLI.

At this point, you'll want to write some client-side JavaScript to make a request to your lambda. Here's an example of what that might look like:

```js {data-file="src/assets/scripts/index.js" data-copyable=true}
export class CommentsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CommentsError';
  }
}

export const fetchComments = async (id) => {
  try {
    const response = await (await fetch(`/.netlify/functions/comments?id=${id}`)).json();
    if (response.error) {
      throw new CommentsError(response.error);
    }
    const comments = response.data;
    return comments;
  } catch (e) {
    if (e instanceof CommentsError) {
      throw e;
    }
    throw new CommentsError('An unexpected error occurred.');
  }
};
```

You can then render these comments; however, that's beyond the scope of this tutorial.

As I mentioned before, if you use a static site generator like Eleventy, Jekyll, or some other framework that supports Markdown, you'll want to track the GitHub issue ID in the post's front matter and then set it as a `data-` attribute somewhere in your HTML. That way, your client-side JavaScript can look it up and pass it along to the API call as a query parameter when it calls your lambda.

## Final Code

Here's all of the code we wrote in this tutorial:

```js
import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';

// Abort build if this is missing
if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('Missing environment variable: GITHUB_PERSONAL_ACCESS_TOKEN');
}

// Authenticate with GitHub Issues SDK. Do this only once for the module rather than per request.
const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
const { token } = await auth();
const octokit = new Octokit({ auth: token });

export default async function getCommentsForPost(request) {
  let issueNumber = new URL(request.url).searchParams.get('id');
  if (!issueNumber) {
    return new Response(JSON.stringify({ error: 'You must specify an issue ID.' }), { status: 400 });
  }

  try {
    // Check this first. Does not count towards the API rate limit.
    const { data: rateLimitInfo } = await octokit.rateLimit.get();
    const remainingRequests = rateLimitInfo.rate.remaining;
    console.log(`GitHub API requests remaining: ${remainingRequests}`);
    if (remainingRequests === 0) {
      return new Response(JSON.stringify({ error: 'API rate limit exceeded.' }), {
        status: 503,
      });
    }

    const response = await octokit.paginate(
      octokit.issues.listComments,
      {
        owner: site.issues.owner,
        repo: site.issues.repo,
        issue_number: parseInt(issueNumber, 10),
        sort: 'created_at',
        direction: 'desc',
        per_page: 100,
      },
      (response) => response.data.map((comment) => ({
        user: {
          avatarUrl: comment.user.avatar_url,
          name: sanitizeHtml(comment.user.login),
          isAuthor: comment.author_association === 'OWNER',
        },
        dateTime: comment.created_at,
        dateRelative: dayjs(comment.created_at).fromNow(),
        isEdited: comment.created_at !== comment.updated_at,
        body: sanitizeHtml(markdown.render(comment.body)),
      }))
    );
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'Unable to fetch comments for this post.' }), { status: 500 });
  }
}
```

Try it out on my site, and let me know what you think.

{% include "unsplashAttribution.md" name: "Adam Solomon", username: "solomac", photoId: "WHUDOzd5IYU" %}
