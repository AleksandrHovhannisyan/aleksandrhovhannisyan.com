---
title: Contact
permalink: /contact/
order: 4
---

<article id="contact" class="container">
    <div id="contact-form">
        <h2 class="heading">
            <span>Get in touch!</span>
            <img src="/assets/img/envelope.png" alt="📧">
        </h2>
        <p>Thanks for taking the time to reach out&mdash;I'll get back to you ASAP.</p>
        <form action="https://formspree.io/hire.aleksandr@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="Thanks for getting in touch!" />
            <label for="name"><strong>Name:</strong></label>
            <input type="text" name="name" id="name" required>
            <label for="email"><strong>Email:</strong></label>
            <input type="email" name="_replyto" id="email" required/>
            <label for="message"><strong>Message:</strong></label>
            <textarea name="body" id="message" required></textarea>
            <input type="submit" value="Send message" class="button">
            <input type="text" name="_gotcha" class="honeypot" />
        </form>
    </div>
    <div id="social-networks">
        <h3>You can also find me on these networks:</h3>
        {% for network in site.data.socials %}
        <div class="social-network">
            <a class="container-link" href="{{ network.url }}" target="_blank"></a>
            <span class="fa-stack fa-2x">
                <i class="fas fa-square fa-stack-2x"></i>
                <i class="{{ network.type }} fa-{{ network.icon }} fa-stack-1x fa-inverse"></i>
            </span>
            <span class="network-name">{{ network.name }}</span>
        </div>
        {% endfor %}
    </div>
</article>