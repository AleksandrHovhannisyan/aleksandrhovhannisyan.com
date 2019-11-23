---
title: Contact
permalink: /contact/
order: 4
---

<article class="container">
    <h2 class="heading">
        <span>Get in touch!</span>
        <img src="/assets/img/envelope.png" alt="📧">
    </h2>
    <div id="contact-information">
        <div id="contact-form">
            <p>Thanks for reaching out! I'll get back to you ASAP.</p>
            <form action="https://formspree.io/hire.aleksandr@gmail.com" method="POST" spellcheck="false">
                <input type="hidden" name="_subject" value="Thanks for getting in touch!" />
                <label class="required" for="name"><strong>Name</strong></label>
                <input type="text" name="name" id="name" required>
                <label for="email"><strong>Email</strong></label>
                <input type="email" name="_replyto" id="email"/>
                <label class="required" for="message"><strong>Message</strong></label>
                <textarea name="body" id="message" required></textarea>
                <input type="submit" value="Send message" class="button">
                <input type="text" name="_gotcha" class="honeypot" />
            </form>
        </div>
        <div id="social-networks">
            <h3>You can also find me on:</h3>
            {% for network in site.data.socials %}
            <div class="social-network">
                <a class="container-link" href="{{ network.url }}" target="_blank"></a>
                {% assign icon = network.icon %}
                {% include svg.html svg=icon class=icon %}
                <span class="network-name">{{ network.name }}</span>
            </div>
            {% endfor %}
        </div>
    </div>
</article>