---
title: What Are Cookies?
description: You've heard the term before, but maybe you're still lost. What are cookies? How are they used? And how do they affect online privacy?
keywords: [cookies in browsers, cookies, browser cookies]
tags: [dev, http, cookies]
comments_id: 49
---

Have you ever wondered how a website remembers who you are when you navigate between different pages, or when you close the site and come back later? Why is it that you only have to log in if you've been gone for a really long time? What's this magic glue that seemingly holds these separate pages together as if they're a single unit—and, for you as a user, a single experience?

In this guide, we'll take a look at everything you need to know about **browser cookies**—you know, those things that a support rep once told you to clear, along with [your hard-earned money](https://en.wikipedia.org/wiki/Cache_(computing)). We'll look at what cookies are, how they get set, how advertising cookies work, and much more.

The only prerequisite is a basic understanding of how the web works. In particular, we'll be referring to things like HTTP requests, browsers, and servers. Let's dig in!

{% include toc.md %}

## How Does a Website Remember Who You Are?

From a technical perspective, each page of a website corresponds to a different "resource" that's hosted on a web server—a computer whose job is to listen for requests from a user's browser and to respond accordingly. For example, when you loaded this page, your browser requested a bunch of different resources from my web server, such as the HTML document itself, its stylesheet, some JavaScript, images, and more. Thus, navigating to a different page on a site initiates a new **HTTP request** to fetch that resource (and potentially any related resources) from the web server.

Yet the HTTP protocol is **stateless**, meaning a server does not keep track of any of your prior HTTP requests for the purposes of matching future requests to older ones ("who did this come from?"). This means that HTTP requests sent by your browser need to contain all necessary information in order for the server to identify you. This is especially important if you're trying to access privileged resources that require authentication, like the settings under your user profile. So how exactly is this accomplished?

Websites have a few different options for tracking your identity, as well as managing what's called your **session state**: information about your current browsing session. In this post, we'll take a look at just one particular approach: storing cookies in your web browser.

## What Is a Cookie?

If you Google "what is a cookie," chances are that you'll come across a definition like this:

> A cookie is a piece of data that a browser stores on your computer.

Great! Unfortunately, while this definition is accurate, it doesn't actually give you a sense of what a cookie really is or what one looks like. First, it helps to understand what a cookie *isn't*. Cookies in your browser are not:

- Processes that are running in the background.
- Malware or spyware that's listening to your activity.
- Delicious snacks.

Cookies are literally inert pieces of textual data. And the best way to understand cookies is to actually *look at one*. Follow these simple steps:

1. Open your browser's developer tools (`Ctrl+Shift+I` on Windows / `Cmd+Shift+I` on Mac).
2. Navigate to the `Application` tab in Chrome (`Storage` in Firefox and Edge).
3. Expand `Cookies` in the left-hand panel.
4. Click a domain that's listed to view the cookies that are associated with it.

For the purposes of this tutorial, I'll be using Reddit as an example. Here are the cookies associated with my Reddit account (I've intentionally obfuscated potentially sensitive values out of an abundance of caution):

{% include img.html img="reddit-cookies.png" alt="Examining the cookies associated with my Reddit user account" %}

True to its definition, a cookie is in fact "just a piece of data" stored on your computer. Each site may store zero or more cookies. Here, Reddit is storing 15 different cookies. A cookie consists of a name, a value, an expiration date or "age," a size in bytes, and so on.

Notice how each cookie stores certain information identifying me as a user, as well as my preferences and settings to help the web server customize my user experience and the results returned in my Reddit feed. For example, `redesign_optout` is one cookie in this list. Its value is set to `true` here for my Reddit account because I prefer to use the old interface. Since Reddit uses server-side rendering, the server needs to know which version of the Reddit interface a user wants to fetch: the old one or the new one. There are a few other cookies in the list, some of which are specific to my user profile and current browsing session.

Over on the far right, you'll see a `Size` column. The size of a cookie is the total number of characters (bytes) in its name and value. For example, the cookie `redesign_optout=true` has a size of `19` because the combined character length of `redesign_optout` and `true` is `19`.

### Types of Cookies: Session vs. Permanent

There's another column in the table above that deserves our attention: `Expires / Max-Age`. These two attributes basically tell your browser for how long a cookie should be kept around. There are two types of cookies that we'll look at, each defined by its expiration/max age.

#### 1. Session Cookies

Notice that some cookies have `Session` as their value under the `Expires / Max-Age` column:

{% include img.html img="session-cookies.png" alt="Exploring session cookies on Reddit via Firefox dev tools" %}

These are known as **session cookies**, also called **temporary cookies** because they're only kept around for your *current browsing session*. It's up to the browser itself to define what constitutes a "current browsing session." In Chrome and Firefox, this is when you fully shut down your browser (i.e., close all tabs). At that point, the cookie may get cleared.

Why do I say "may"? Because there's a [hidden gotcha](https://textslashplain.com/2019/06/24/surprise-undead-session-cookies/). When you launch these browsers, some of them give you the option of restoring your previously open tabs. This means that certain browsers may restore a session cookie even after a browsing session has technically ended.

#### 2. Permanent Cookies

While the term "permanent" seems to imply that these cookies never go away, that's not the case at all. A permanent cookie is simply one that has an explicit expiration date and time or that has a max age set to a certain duration in milliseconds. These cookies will be cleared once they've expired.

## How Do Cookies Get Set in a Browser?

So we've seen that a cookie is in fact "a piece of data" stored in your browser. But how exactly does a cookie get created in the first place? Where does it come from?

As I mentioned earlier in this post, the HTTP protocol is stateless, meaning a web server does not keep track of any information about your prior HTTP requests. This means that requests sent from your browser to a web server must include all information that the server needs in order to identify you. Guess what? This means that your browser will need to include your cookies for that domain (assuming that you have any) in its requests.

For the upcoming section, you'll only need a basic understanding of how the web works—in particular, the HTTP protocol. Here's a quick refresher:

### HTTP Request and Response Headers

HTTP consists of requests and responses. A browser sends a request to a server; the server sends back a response. Both requests and responses can contain data, but they also include certain metadata (supplementary information) about the request/response itself. These are known as **request headers** and **response headers**.

For example, a request header may contain some of this information:

- The type of device being used to initiate the request (e.g., `Windows NT 10.0; Win64; x64`).
- The browser that's sending the request (e.g., `AppleWebKit/537.36 (KHTML, like Gecko)`).
- The URL that is being requested (e.g., `https://www.reddit.com`).

... and much more.

Conversely, servers send back a response containing data like images, CSS, HTML, JSON, etc., along with certain metadata about the response itself. This information appears in the response header. For example, servers may tell a browser:

- Whether the request was successfully handled, via [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). The most common ones you'll encounter are 200, 304, 404, and 500.
- The type of content returned (e.g., `application/json`).
- For how long the content should be cached by the browser.

... and much more.

You can view request and response headers for any HTTP request using the `Network` tab in your browser's dev tools.

### The `Set-Cookie` HTTP Response Header

Here's the key: A server may also send along a **`Set-Cookie` response header** that tells your browser to store a cookie. A response may contain as many of these `Set-Cookie` headers as needed, one for each cookie that needs to get set. Basically, cookies can be generated *programmatically* on the server side and sent along with responses whenever they need to get set by a browser. But you can also create cookies with JavaScript, as we'll see shortly.

Here's an example of monitoring XHR requests with the Firefox Dev Tools on Reddit and intercepting the `Set-Cookie` response header:

{% include img.html img="set-cookie.gif" alt="Reddit sets the redesign_optout cookie to be true when I opt out of the new user interface" %}

Now, if you inspect future requests, you'll find that this cookie is included in the **`Cookie` HTTP request header**:

{% include img.html img="response-cookie.png" alt="Inspecting a response header in the Firefox dev tools for Reddit" %}

### Reading and Creating Cookies via JavaScript

Before we move on, note that there's a second way to view cookies in your developer tools. Simply navigate to the `Console` tab, enter the following code, and press enter:

{% include codeHeader.html %}
```javascript
document.cookie
```

You'll see one big output string containing `name=value` pairs of cookies strung together with semicolons. Here, `document.cookie` is how you create, update, and delete cookies via JavaScript. Notice that some of the supplementary information—like the expiration date or size of the cookie—does not appear in this string. However, those values *will* get set internally in the browser.

Here's an example of creating a cookie with JavaScript:

{% include codeHeader.html %}
```javascript
document.cookie = 'foo=bar'
```

Now, this API is a little weird. While you would expect the above line of code to replace the whole cookie string, this new cookie will actually get *concatenated* to the existing cookie string (or take the place of an existing cookie, if it has the same name). Here's an example of creating three cookies:

{% include img.html img="creating-cookies-with-javascript.png" alt="Creating cookies with JavaScript via the Google Chrome console" %}

Note that you can't create multiple cookies in one go, like `document.cookie = 'foo=bar; hello=world; id=123'`. You have to call `document.cookie = ...` separately for each cookie.

When you just specify the name and value of a cookie, it gets created as a session cookie by default. You can also optionally specify an expiration:

{% include codeHeader.html %}
```javascript
document.cookie = 'foo=bar; expires=Su, 20 Dec 2020 20:20:20 UTC'
```

> Note: If "today" is past the above date when you're reading this, the code won't work. And that's because of the next point.

To delete a cookie with JavaScript, you need to set its expiration date to be sometime in the past:

{% include codeHeader.html %}
```javascript
document.cookie = 'foo=bar; expires=Fri, 24 Jul 2020 04:00:00 UTC'
```

We'll take a closer look at how to delete cookies cookies later in this guide.

#### HTTPOnly Cookies: Protecting Sensitive Data

If you compare the output of `document.cookie` to the table that we looked at earlier, you may be surprised to find that some cookies are missing from the output string. And that's because of an additional property that we haven't yet covered: **HTTPOnly cookies**:

{% include img.html img="http-only-cookies.png" alt="A list of http-only cookies for my Reddit account" %}

A cookie that is marked as HTTPOnly cannot be read via JavaScript. Usually, you'll find that session cookies are marked as HTTPOnly. This is a safety precaution to protect you against session hijacking, where a malicious actor may try to read your cookie via JavaScript and use it to masquerade as you.

Speaking of session hijacking...

## The Same-Origin Policy and Session Hijacking

It's important to understand that every cookie stored on your computer is associated with a specific domain, like `reddit.com` in the examples above.

Naturally, that begs the following question: If cookies for Site A and cookies for Site B are both stored in the same browser and on the same computer, is it possible for Site B to use Site A's cookies in its request headers? Fortunately, because of the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), this is not possible.

If you think about it, that would be pretty dangerous if it were allowed—it would mean that Site B could read cookies stored for Site A in your browser and then use those cookies to [hijack your browsing session](https://en.wikipedia.org/wiki/Session_hijacking#:~:text=In%20computer%20science%2C%20session%20hijacking,services%20in%20a%20computer%20system.). All that Site B would need to do is send those exact cookies in a request header to Site A's server, and voila—the server, none the wiser, would think that the request is coming from you, when really it's someone who's impersonating you.

There's a tutorial on [how to perform session hijacking](https://embracethered.com/blog/posts/passthecookie/#attack-chain) that helps drive home the following key point: There is nothing special about you and your browser when you access a particular site. The only way a web server knows who you are is based on the information your browser passes along in an HTTP request. If someone has your session cookies, they can simply copy those cookies locally, refresh the page, and essentially bypass traditional authentication mechanisms like usernames and passwords.

> Fun fact: This is why I obfuscated my session cookies (e.g., `reddit_session`) in the screenshots above. While session cookies are technically temporary, we've already seen that they can stick around for longer than a browser session.

## Why Do Websites Ask for My Permission to Store Cookies?

This is typically where the misconceptions and fears arise regarding what cookies are and whether they're dangerous. Remember: A cookie is nothing but a piece of data. It's inert—it's only useful if your browser sends it to a server via an HTTP request. Rather, people are wary of browser cookies because they're (rightfully) concerned about their online privacy.

With the advent of the GDPR in the European Union and the 2018 amendments to the California Consumer Privacy Act, companies were forced to comply with new privacy regulations. Many decided to go about this by showing popups and notices that ask for your permission to store cookies on your computer, rather than simply doing so without your knowledge.

Cookies are important. But *certain kinds of cookies* pose a privacy concern for users since they can be used to store personally identifiable information about you based on your activity on a particular website. This is typically done with [advertising cookies](https://www.cookiepro.com/knowledge/what-are-targeting-advertising-cookies/).

### How Advertising Cookies Work

Advertising cookies are used by [ad networks](https://marketing.toolbox.com/articles/what-is-an-ad-network-definition-types-and-examples) like Google AdSense to show you personalized content, as well as to share your information with advertisers within the network to collect usage data and analytics. A website is considered to be part of an ad network like Google AdSense if it's paying that network to show ads on its behalf.

This quote from [Google's policy on advertising](https://policies.google.com/technologies/types?hl=en-US) is particularly enlightening about how Google AdSense stores its cookies:

> We also use one or more cookies for advertising we serve across the web. One of the main advertising cookies on non-Google sites is named ‘IDE‘ and is stored in browsers under the domain `doubleclick.net`.

Here's a breakdown of how advertising cookies work:

1. You visit a site (e.g., `https://www.foo.bar`) that happens to be part of some ad network (e.g., Google AdSense, which has a domain of `doubleclick.net`).
2. The site has ads embedded in its HTML markup, such as in an `<iframe>`, `<img>`, or `<video>`.
3. Those ads are hosted on the ad network's domain (e.g., `doubleclick.net`).
4. When you load the page, your browser requests those ads from the ad network's domain, just like it requests any other resource on the page (images, videos, and so on).
5. **The secret sauce**: The ad network sends the requested ads, *along with an advertising cookie* in the response header.
6. Your browser records the cookie for that ad network's domain (in this case, `doubleclick.net`).
7. When you visit another site that's part of the same ad network, the cookie will follow you.

> **Note**: Steps 4–6 may not occur if you're in private browsing, have an adblocker enabled, or have enabled [Enhanced Tracking Protection in Firefox](https://blog.mozilla.org/blog/2019/06/04/firefox-now-available-with-enhanced-tracking-protection-by-default/).

This is one of the reasons why people sometimes find that ads are following them around the web no matter where they go, and that these ads are often tailored to the content they previously viewed. For example, if you're shopping online for dog toys and later visit a social media site with ads enabled, you may see ads for dog toys and related accessories in a sidebar. It's not a coincidence—it's an advertising cookie in action, and some people find this to be an invasion of privacy.

Here's a real-world example of inspecting that very `IDE` advertising cookie that Google mentions. This is on StackOverflow, one of the few sites where I felt it would be safe to temporarily disable my adblocker for this tutorial:

{% include img.html img="stackoverflow-cookies.png" alt="Examining the cookies associated with doubleclick.net" %}

Time for a fun experiment, assuming you're willing to accept cookies and sell your soul to advertisers:

1. Launch Google Chrome. Firefox's privacy protections are pretty aggressive, which is usually a good thing—but it will get in the way of this valuable learning experience.
2. Visit a popular website and temporarily disable your adblocker.
3. Open your devtools and try to find any cookies that seem to be from a Google domain. Look for `doubleclick.net` in the `Domain` column (see the screenshot above).
4. Visit another website that you suspect will show ads, and disable your adblocker again.
5. Open your devtools and see if there are any cookies from the same ad network domain.

In particular, you'll want to look for the `IDE` cookie. And what you'll find is that it's exactly the same on the second site as it is on the first one that you visited. I tested this with Quora:

{% include img.html img="quora-cookies.png" alt="Inspecting Quora cookies via Chrome dev tools" %}

**Everything** is the same, down to the cookie's expiration date and time.

As we've learned, this is because the advertising cookie is not associated with StackOverflow's or Quora's domain—it's associated with the ad network's domain (in this case, `doubleclick.net`). So as long as it remains on your computer, it'll follow you around on other sites that are part of the same ad network. Pretty neat—and definitely something to be worried about if you're privacy conscious.

## Where Are Cookies Stored on My Computer?

By their very nature, cookies do not sync between browsers. They're just inert pieces of data. So, cookies set in Chrome for a domain have nothing to do with cookies set in Firefox, Edge, or any other browser for the same domain. This is why you'll be prompted to log into your account if you try visiting a site or app with a browser that you don't normally use.

Most major browsers store their cookies in an SQLite database file. You can open this database file using an app like [DB Browser for SQLite](https://sqlitebrowser.org/). Note that the location of your cookies will vary depending on the browser and operating system you're using.

### Chrome

Chrome stores its cookies in an SQLite database file named `Cookies`, which is located here:

- Windows: `C:\Users\<your_username>\AppData\Local\Google\Chrome\User Data\Default\Cookies`
- Mac: `~/Library/Application Support/Google/Chrome/Default/Cookies`
- Linux: `~/.config/google-chrome/Default/Cookies`

Apparently, Chrome maintains two separate database tables for cookies—a `cookies` table and a `meta` table:

{% include img.html img="schemas.png" alt="Exploring the schemas of the two tables in Chrome's cookies database" %}

And here's what the data looks like for the `cookies` table:

{% include img.html img="cookie-data.png" alt="Exploring Chrome's cookies table" %}

### Firefox

Like Chrome, Firefox stores its cookies in an SQLite database file. Here's how to find it:

1. Click the hamburger icon (top-right of your browser) to open the Firefox settings.
2. Go to `Help > Troubleshooting Information`.
3. Locate `Profile Folder` in the table. Click the `Open Folder` button.
4. Scroll down and find `cookies.sqlite`.

For example, on Windows 10, you'll find your Firefox cookies under `C:\Users\<your_username>\AppData\Roaming\Mozilla\Firefox\Profiles\<your_firefox_profile>\cookies.sqlite`.

### Microsoft Edge

Edge stores its cookies not in a single file but rather as separate files under `C:\Users\<your_username>\AppData\Local\Microsoft\Windows\INetCookies`:

{% include img.html img="edge-cookies.png" alt="Viewing a list of cookies stored by Microsoft Edge, via File Explorer" %}

You can open these files with a plain text editor.

## How Do I Clear My Cookies?

There are two ways you can clear your cookies:

1. Via your browser's developer tools, which we've already used quite a bit in this tutorial.
2. Via your browser's settings, usually under History.

The first one is the more flexible option of the two, as it allows you to only delete cookies from a particular domain as opposed to all cookies across all domains. You can either right-click a cookie and delete it or simply click the clear icon (a trashcan in Firefox) to delete all cookies:

{% include img.html img="deleting-cookies.png" alt="Deleting cookies either by right-clicking a cookie or clearing all cookies at once, via browser dev tools" %}

And as we saw in an earlier section, you can also clear a cookie via JavaScript by setting its expiration date to be sometime in the past.

### What Happens if I Clear My Cookies?

If you've been following along, you should already know the answer to this question. Remember: A web server uses cookies as a form of authentication, to ensure that you're allowed to view the pages that you're trying to access. It also uses cookies to personalize your website experience by storing certain settings and preferences. So, if you clear your cookies for a website, two things will happen:

1. You'll be logged out the next time you visit the site. This is because the browser won't send any cookies to the server when you request that page, so the server won't have any way of knowing who you are. Once you log back in, you'll get a new set of cookies, fresh from the oven.
2. Your preferences or settings may get cleared for that website or app.

Note that certain other user settings are stored in an app's database rather than in cookies on the client side. So, when you clear your cookies, those other settings will be left untouched.

## Alternatives to Cookies

Cookies are just one way that websites can save information on the client side. Browsers may also use:

- [The Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API): `localStorage` and `sessionStorage`.
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), typically for large amounts of data.

I use the first option on my blog to store your selected theme (light mode or dark mode). You can explore `localStorage` just like you would any other storage option in your browser's dev tools:

{% include img.html img="local-storage.png" alt="Exploring localStorage for my website" %}

You can also clear `localStorage` via the same tab in dev tools or via JavaScript.

### Cookies vs. `localStorage` vs. `sessionStorage`

Here's a brief look at the major differences between cookies and the Web Storage API:

<table>
    <thead>
        <tr>
            <th scope="col">Storage</th>
            <th scope="col">Expiration</th>
            <th scope="col">Use cases</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>localStorage</td>
            <td>None, but users can manually clear it via dev tools or the console (<code>localStorage.clear()</code>).</td>
            <td>Storing data on the client side that the server does not need (e.g., preferences, settings).</td>
        </tr>
        <tr>
            <td>sessionStorage</td>
            <td>Until the end of the current browsing session (i.e., until you shut down your browser).</td>
            <td>Storing data specific to the user's current browsing session.</td>
        </tr>
        <tr>
            <td>Cookies</td>
            <td>Current browsing session, if an expiration/max age is not specified.</td>
            <td>Storing data received in a response header. Included in all future request headers.</td>
        </tr>
    </tbody>
</table>

## Final Thoughts

Cookies are a pretty interesting (and sometimes controversial) topic in web development. [Some people question whether they're really necessary these days](https://www.webdesignerdepot.com/2019/06/does-the-web-really-need-cookies/). Others are worried about the privacy implications of advertising cookies that follow you around the web.

In any case, cookies exist, and probably will for quite some time. I hope you now have a better understanding of what browser cookies are and the role that they play on the web!
