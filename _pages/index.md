---
title: Home
permalink: /
custom_js: ["loadPreviewRepoData"]
---

<article>
    <section id="hero-banner">
        <div id="hero-text">
            <h1 class="title">I'm a developer who loves color and UI design.</h1>
            <p class="subtitle">Interested in working with me? <a href="/contact">Get in touch</a>!</p>
        </div>
        <img src="/assets/img/profile-photo.png" alt="My profile photo" />
    </section>
    <section id="featured-projects" class="section">
        <h2 class="heading">Featured Software Projects</h2>
        <div id="project-grid" class="card-grid">
            <!-- Projects get populated here dynamically (see index.js) -->
            <div id="preview-placeholder" class="project">
                <a class="button hollow-button" href="/experience/#projects">View more</a>
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
</article>