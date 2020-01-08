---
title: Contact
permalink: /contact/
---

<section id="contact" class="section">
    <h2 class="heading-with-image">
        <span>Get in touch!</span>
        <img src="/assets/img/envelope.png" alt="📧">
    </h2>
    <div id="contact-information">
        <form action="https://formspree.io/hire.aleksandr@gmail.com" method="POST" spellcheck="false">
            <input type="hidden" name="_subject" value="Thanks for getting in touch!" />
            <label class="required" for="name"><strong>Name</strong></label>
            <input type="text" name="name" id="name" required>
            <label for="email"><strong>Email</strong></label>
            <input type="email" name="_replyto" id="email"/>
            <label class="required" for="message"><strong>Message</strong></label>
            <textarea name="body" id="message" required></textarea>
            <input type="submit" value="Send message" class="button solid-button">
            <input type="text" name="_gotcha" class="honeypot" />
        </form>
        <section>
            <h3>You can also find me on:</h3>
            <section id="social-networks">
                {% for network in site.data.socials %}
                <div class="social-network">
                    <a class="container-link" href="{{ network.url }}"></a>
                    {% assign icon = network.icon %}
                    {% include svg.html svg=icon class=icon %}
                    <span class="network-name">{{ network.name }}</span>
                </div>
                {% endfor %}
            </section>
        </section>
    </div>
</section>