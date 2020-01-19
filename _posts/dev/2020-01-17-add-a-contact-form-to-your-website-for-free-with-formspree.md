---
title: "Add a Free Contact Form to Your Website with Formspree"
description: "Formspree is an online platform that makes it incredibly easy for you to add a free contact form to your website. Setting it up takes no more than a few minutes, and you're good to go!"
keywords: ["free contact form", "formspree"]
---

[Formspree](https://formspree.io/) is an online platform that makes it incredibly easy for you to add a contact form to your website for free. It even has paid plans and integrations with other apps, like Slack, Mailchimp, and more.

Let's take a look at how it works!

{% include linkedHeading.html heading="Basic Form Structure 📧" level=2 %}

To get started, all you need to do is add a `form` to your site:

```html
<form action="https://formspree.io/your-email-address" method="POST">
    <input type="hidden" name="_subject" value="Someone sent you a message!" />
    <input type="text" name="name" id="name" />
    <input type="email" name="_replyto" id="email" />
    <textarea name="body" id="message"></textarea>
    <input type="submit" value="Send message" />
</form>
```

There are a couple of inputs worth noting:

- `_subject`: The `value` you specify is the subject line for the submission email that you'll receive.
- `_replyto`: Auto-fills the address line with the user's email if you respond to the submission notification.
- `body`: This is the message from your user.

The `action` attribute of the form is where the submission data is going to be sent. To associate that particular endpoint with your email address, you just have to make a mock submission once, from your live website (not from your local). Once you submit mock data, you'll be notified that your email needs to be activated:

{% include posts/picture.html img="activation-required" ext="PNG" alt="Formspree activation required." shadow=false %}

> **Note**: I don't recommend using your personal email address, as you'll have to expose that in your source code. Set up a dedicated email address for your website instead, if you don't already have one.

And here's the email you receive from Formspree:

{% include posts/picture.html img="activation-email" ext="PNG" alt="Acivation email from Formspree." shadow=false %}

Again, it's important to make the mock submission from your *live* website and not from your local. It's not like doing it from your local will break anything—it's just that your form will only work on local, and you'll still need to activate your form for the live website.

When a user submits a message, they'll have to pass a reCAPTCHA test. Here's a sample user submission:

{% include posts/picture.html img="email" ext="PNG" alt="A sample user submission to Formspree." shadow=false %}

There are two useful links down at the bottom:

- You can mark the email as spam if needed.
- You can disconnect your email from that particular Formspree endpoint.

Finally, as I mentioned earlier, if you reply, the recipient's address will be filled in automatically:

{% include posts/picture.html img="reply" ext="PNG" alt="Replying to the email auto-fills the recipient's email address." shadow=false %}

{% include linkedHeading.html heading="Setting Up a Honeypot Trap for Bots 🍯" level=2 %}

While the reCAPTCHA test already provides a solid defense against spam, Formspree also [recommends adding a honeypot input field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) for safe measure:

```html
<input type="text" name="_gotcha" />
```

When a <s>bear</s> bot comes along and sticks its head where it doesn't belong, it'll be stuck. 

{% include posts/picture.html img="honeypot" ext="PNG" alt="Pooh Bear with his head stuck in a honey pot." shadow=false %}

You should give this a class and set the display to none so it doesn't confuse your human users:

```html
<input type="text" name="_gotcha" class="honeypot" />
```

```css
/* Spammers, begone */
input.honeypot {
    display: none;
}
```

{% include linkedHeading.html heading="Formspree Free Plan Limitations" level=2 %}

The free Formspree plan is a pretty great option for most personal websites that don't expect more than **50 submissions per month**. If you need more than that for your site, you can opt for one of their [paid plans](https://formspree.io/plans).

## That's It!

You're all set to receive messages from your website's visitors.

(Or to hear crickets chirping in your inbox... 🦗)
