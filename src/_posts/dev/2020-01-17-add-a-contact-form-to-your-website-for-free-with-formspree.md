---
title: Create a Free Contact Form with Formspree
description: Formspree makes it easy for you to add a free contact form to your website. Setting it up takes no more than a few minutes. Learn how to get started!
keywords: [free contact form, formspree]
tags: [dev, forms]
last_updated: 2020-05-27
---

> **Update**: This blog post was originally written before Formspree gave you the option of generating unique/random endpoints, allowing you to hide your email from your HTML. The new process simply requires that you [register with Formspree](https://formspree.io/register). It's still free :)

[Formspree](https://formspree.io/) is an online platform that makes it easy for you to add a free contact form to your website. It even has paid plans and integrations with other apps, like Slack, Mailchimp, and more. Setting it up takes no more than a few minutes, so let's get started!

{% include linkedHeading.html heading="Overview: How Does Formspree Work?" level=2 %}

It's actually really simple! Here's a quick rundown of how Formspree works:

1. You specify a Formspree endpoint with your email address (e.g., `https://formspree.io/your-email`) in your form's markup. More specifically, this URL will be the `action` attribute of your form.

2. You make a mock submission once through the form on your live website. Formspree receives your submission and sends you a one-time registration email to activate the form.

3. Once the form has been activated, all future form submissions on your website will trigger a Formspree notification that's sent to your email address, with the form's contents and any other details.

{% include linkedHeading.html heading="How to Set Up Formspree 📧" level=2 %}

To get started, all you need to do is add a `form` like this to your site:

{% capture code %}<form action="https://formspree.io/your-email" method="POST">
    <input type="hidden" name="_subject" value="Someone sent you a message!" />
    <input type="text" name="name" id="name" />
    <input type="email" name="_replyto" id="email" />
    <textarea name="body" id="message"></textarea>
    <input type="submit" value="Send message" />
</form>{% endcapture %}
{% include code.html code=code lang="html" %}

Let's clarify some of the input attributes:

- `_subject`: This will be the subject line for the email that you receive from Formspree; it's a hidden field.
- `_replyto`: Used to auto-fill the address line with the user's email if you respond to the notification email.
- `body`: The message from your user.

The form's `action` attribute is the **Formspree endpoint** that I mentioned earlier; it's where the form data is going to be sent when it's submitted. As I noted earlier, to associate this endpoint with your email address, you just have to make a one-time mock submission from your live website (not from your local). Once you do that, you'll be notified that this form needs to be activated:

{% include picture.html img="activation-required.jpg" alt="Formspree activation required." %}

> **Note**: Don't use your personal email address, as you'll have to expose that to the public in your form's markup. Instead, set up a dedicated email address for your website if you don't already have one.

And here's the email you'll receive from Formspree:

{% include picture.html img="activation-email.jpg" alt="Acivation email from Formspree." %}

Again, it's important to make the mock submission from your *live* website and not from your local. It's not like doing it from your local will break anything—it's just that you'll still need to activate the form on the live website in order for it to work properly.

When a user submits a message, they'll have to pass a reCAPTCHA test. You'll then get an email from Formspree with a summary of the user's submission:

{% include picture.html img="email.jpg" alt="A sample user submission to Formspree." %}

Notice that the subject line of this email is whatever I specified for the hidden `_subject` input. In this case, that's "Someone sent you a message!"

There are two useful links down at the bottom:

- You can mark the email as spam if needed.
- You can unsubscribe your email from that particular Formspree endpoint.

Finally, as I mentioned earlier, if you reply, the recipient's address will be filled in automatically:

{% include picture.html img="reply.jpg" alt="Replying to the email auto-fills the recipient's email address." %}

{% include linkedHeading.html heading="Setting Up a Honeypot Trap for Bots 🍯" level=2 %}

While the reCAPTCHA test already provides a solid defense against spam, Formspree also [recommends adding a honeypot input field](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) to your form for safe measure:

{% capture code %}<input type="text" name="_gotcha" />{% endcapture %}
{% include code.html code=code lang="html" %}

When a <s>bear</s> bot comes along and sticks its head where it doesn't belong, it'll be stuck.

{% include picture.html img="honeypot.jpg" alt="Pooh Bear with his head stuck in a honey pot." %}

You should give this a class and set the display to none so it doesn't confuse your human users:

{% capture code %}<input type="text" name="_gotcha" class="honeypot" />{% endcapture %}
{% include code.html code=code lang="html" %}

{% capture code %}input.honeypot {
    display: none;
}{% endcapture %}
{% include code.html code=code lang="css" %}

{% include linkedHeading.html heading="Formspree Free Plan Limitations" level=2 %}

The free Formspree plan is a good option for most personal websites that don't expect more than **50 submissions per month**. If you need more than that for your site, you can opt for one of their [paid plans](https://formspree.io/plans).

## That's It!

Adding a free contact form to your site is *that* easy.

You're all set to receive messages from your website's visitors!

(Or to hear crickets chirping in your inbox... 🦗)
