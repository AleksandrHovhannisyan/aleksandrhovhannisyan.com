---
title: Experience
custom_js: ["loadRepoData"]
permalink: /experience/
order: 2
---

{% include banner.html heading="My experience" content="I try to keep busy while having fun and testing my limits. Between school, side projects, freelancing, and interning, I've gained valuable exposure to a wide variety of interesting technologies and problems." %}

<article id="projects" class="container">
    <h2 class="heading">
        <span>Projects</span>
        <img src="/assets/img/folder.png" alt="📁">
    </h2>
    <div id="card-grid">
        <!-- Projects get populated here dynamically (see index.js) -->
        <div id="project-placeholder" class="project">
            <header>
                <h4>Want to see more of my work?</h4>
            </header>
            <div>
                <p>Check out my other repos:</p>
                <a href="https://github.com/AleksandrHovhannisyan?tab=repositories" target="_blank">{% include svg.html svg="github" %}</a>
            </div>
        </div>
    </div>
</article>

<article id="skills" class="container">
    <h2 class="heading">
        <span>Skills and Abilities</span>
        <img src="/assets/img/juggler.png" alt="🤹">
    </h2>
    <div id="skill-grid">
        {% for skill in site.data.skills %}
        <div class="skill-category">
            <h4>{{ skill.category }}</h4>
            {% for item in skill.items %}
            <div class="skill-item">
                <span class="skill-name">{{ item.name }}</span>
                <div class="skill-rating">
                    {% for i in (1..item.rating) %}
                    {% include svg.html svg="star" class="star star-filled" %}
                    {% endfor %}
                    {% assign j = item.rating | plus: 1 %}
                    {% for i in (j..5) %}
                    {% include svg.html svg="star" class="star star-empty" %}
                    {% endfor %}
                </div>
            </div>
            {% endfor %}
        </div>
        {% endfor %}
    </div>
</article>

<article id="education" class="container">
    <h2 class="heading">
        <span>Education</span>
        <img src="/assets/img/graduation-cap.png" alt="🎓">
    </h2>
    <p>
        If my track record speaks to anything, it's my <strong>commitment to excellence</strong>
        in every endeavor I pursue.
    </p>
    {% for institution in site.data.education %}
    <div class="institution collapsible">
        <div class="collapsible-header">
            {% include svg.html svg="angle-down" %}
            <span>
                <strong>{{ institution.name }}<br></strong>
                {{ institution.degree }}<br>
                {{ institution.gpa }} GPA, {{ institution.years }}
            </span>
        </div>
        <div class="collapsible-content">
            <div class="courses">
                <h4><em>Notable Coursework</em></h4>
                <ul>
                    {% for course in institution.courses %}
                    <li>{{ course }}</li>
                    {% endfor %}
                </ul>
            </div>
            <div class="awards">
                <h4><em>Awards and Recognitions</em></h4>
                <ul>
                    {% for award in institution.awards %}
                    <li>{{ award }}</li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>
    {% endfor %}
</article>