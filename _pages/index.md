---
title: Home
permalink: /
---

<section id="hero-banner">
    <div id="hero-text">
        <h1 class="title">I'm a dev with an eye for color and UI design.</h1>
        <p class="subtitle">Interested in working with me? <a href="/contact">Get in touch</a>!</p>
    </div>
    <img src="/assets/img/profile-photo.png" alt="My profile photo" />
</section>
<section id="featured-projects" class="section">
    <h2 class="heading">Featured Software Projects</h2>
    <div id="project-grid" class="card-grid">
        {% for project in site.data.projects limit:3 %}
        {% include projectCard.html project=project %}
        {% endfor %}
        <div id="view-more-projects">
            <a class="button hollow-button arrow-button" href="/experience/#projects">View more</a>
        </div>
    </div>
</section>
<section id="cta" class="section">
    <h2 class="heading">Want to learn more about me?</h2>
    <p class="subtitle">Check out my experience and blog!</p>
    <div id="cta-buttons">
        <a href="/experience" class="button solid-button">View experience</a>
        <a href="/blog" class="button hollow-button">Read my blog</a>
    </div>
</section>