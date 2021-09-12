---
title: How to Test Localhost on Mobile (with ngrok)
description: Learn how to easily test localhost on mobile using ngrok, without deploying a single line of code.
keywords: [test localhost on mobile]
categories: [ngrok, testing, mobile]
commentsId: 47
---

Long ago, mobile-first development was a fancy new trend on the horizon of web development. Now, it's practically the industry standard. It's no secret that [Google uses mobile-first indexing](https://developers.google.com/search/mobile-sites/mobile-first-indexing), and mobile has consistently accounted for [nearly 50% of global web traffic](https://www.statista.com/statistics/277125/share-of-website-traffic-coming-from-mobile-devices/#:~:text=Mobile%20accounts%20for%20approximately%20half,since%20the%20beginning%20of%202017.) since 2017.

Naturally, you'll want to test your site on a mobile device to ensure that it's rendering content properly and is easy to use. But if you're new to the scene, that may seem more difficult than it really is. For example, how can you test localhost on mobile for, say, a website that you've spun up on `localhost:4000`?

By definition, `localhost` refers to the device used to access that very hostname (e.g., your laptop or workstation). So if your site's web server is running on your computer, then `localhost:port` refers to that process only on *this particular machine*. Localhost on a mobile device refers to that device itself. So unless you somehow run your site's web server on there, trying to test localhost on mobile simply won't work as you had hoped.

So what can you do? The naive approach is to deploy your changes every time to your web server and rebuild for production. But that's not maintainable at all, and it also risks exposing any embarrassing mistakes you've made while you're still testing. What if a user visits your site and bounces because it's still under development?

As an alternative, you could set up a different branch for pre-deployment previews, but that's still tedious. Worse still, if you're hosting your site through a service like Netlify, repeatedly deploying small code changes could exhaust your allocated bandwidth ("build minutes" in Netlify terms).

Fortunately, testing localhost on mobile the *proper* way is actually really easy.

## Getting Started with ngrok

We'll use an open-source tool called [ngrok](https://ngrok.com/). In a nutshell, ngrok generates secure public URLs for localhost endpoints, allowing you to test localhost on mobile with ease. Here's their high-level description of how the process works:

> It connects to the ngrok cloud service which accepts traffic on a public address and relays that traffic through to the ngrok process running on your machine and then on to the local address you specified.

Check out the [ngrok documentation on how to get started](https://dashboard.ngrok.com/get-started/setup). Essentially, it boils down to these simple steps:

1. Create an ngrok account (it's free!).
2. Download the ngrok binaries for your operating system.
3. Run `./ngrok authtoken yourAuthToken` (the token will be listed on the page linked above).
4. Make sure the path to the `ngrok` binary is set in your PATH.

## Easily Test Localhost on Mobile

Once you've set up ngrok, using it is a piece of cake. If you've spun up a simple web server on a localhost port (e.g., `jekyll`), simply run this command from your terminal to expose it as a public URL:

{% include codeHeader.html %}
```bash
ngrok http portNumber
```

And just replace `portNumber` with your port (e.g., `3000`).

Once ngrok starts up, you'll see your HTTP and HTTPS endpoints and the localhost variants that they point to. Now, simply navigate to either one of these public URLs.

{% include img.html src: "ngrok.png", alt: "Running the ngrok process in a terminal." %}

To view the URL on mobile, you can certainly just type it out. However, if you're logged in to Chrome with your Google account, you can simply right-click the page and choose `Send to [your phone]`:

{% include img.html src: "send-to-phone.png", alt: "Right-clicking a page in Google Chrome to send it to your phone." %}

## Sharing Localhost with Other Developers

As a bonus, this means that you can also share your localhost changes with other developers on your team or with clients, without having to record screencasts, take screenshots, or describe your changes via text (yuck). Just send them the URL, and you're good to go.

If you'd like to, you can also enforce a username and password combo when testing localhost on mobile so that only people with those secret credentials can access your URL:

{% include codeHeader.html %}
```bash
ngrok http -auth "user:password" portNumber
```

As before, replace `portNumber` with your own. Be sure to also replace `user` and `password` with any username or password combination that you want other people to enter when visiting your site. These should **NOT** be your actual ngrok credentials. Just make up whatever username and password you want to use.

This time, when you or someone else visit one of the endpoints, you'll be prompted to enter the username and password that were set:

{% include img.html src: "auth.png", alt: "Ngrok authentication with a prompt for a username and password." %}

So here, you'd type `user` and `password`.

And that's all there is to it! You can now test localhost on mobile without jumping through unnecessary hoops.

## Attributions

This article's social media preview image uses the Ngrok logo under fair use; it is under the copyright of Ngrok. I am not affiliated with Ngrok.
