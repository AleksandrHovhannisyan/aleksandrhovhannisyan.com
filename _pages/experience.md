---
title: Experience
customJS: ["loadFullRepoData"]
permalink: /experience/
---


{% include banner.html heading="My experience" content="I try to keep busy while having fun and testing my limits. Between school, side projects, freelancing, and interning, I've gained valuable exposure to a wide variety of interesting technologies and problems." %}
<section id="projects" class="section">
    {% include headingWithImage.html h="Projects" lvl=2 img="/assets/img/folder.png" alt="📁" %}
    <div id="project-grid" class="card-grid">
        <!-- Projects get populated here dynamically (see index.js) -->
        <div id="project-placeholder" class="project">
            <header>
                <p><strong>Want to see more of my work?</strong></p>
            </header>
            <div>
                <p>Check out my other repos:</p>
                <a href="https://github.com/AleksandrHovhannisyan?tab=repositories">{% include svg.html svg="github" %}</a>
            </div>
        </div>
    </div>
</section>
<section id="skills" class="section">
    {% include headingWithImage.html h="Skills and Abilities" lvl=2 img="/assets/img/juggler.png" alt="🤹" %}
    <div id="skill-grid">
        {% for skill in site.data.skills %}
        <div>
            <h3 class="skill-category">{{ skill.category }}</h3>
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
                    {% assign rating = '' %}
                    {% if item.rating == 1 %}{% assign rating = 'Familiar' %}
                    {% elsif item.rating == 2 %}{% assign rating = 'Basic' %}
                    {% elsif item.rating == 3 %}{% assign rating = 'Intermediate' %}
                    {% elsif item.rating == 4 %}{% assign rating = 'Competent' %}
                    {% elsif item.rating == 5 %}{% assign rating = 'Advanced' %}
                    {% endif %}
                    {% include tooltip.html position='top' text=rating %}
                </div>
            </div>
            {% endfor %}
        </div>
        {% endfor %}
    </div>
</section>
<section id="work" class="section">
    {% include headingWithImage.html h="Work Experience" lvl=2 img="/assets/img/briefcase.png" alt="💼" %}
    <section class="card-grid">
    {% for job in site.data.work %}
        <section class="job">
            <header>
                <h3 class="job-title">{{ job.title }}, {{ job.company }}</h3>
                <p class="date-range">{{ job.dateRange }}</p>
            </header>
            <ul class="responsibilities" >
                {% for responsibility in job.responsibilities %}
                <li>{{ responsibility }}</li>
                {% endfor %}
            </ul>
            <footer class="technologies-used">
                {% for tech in job.tech %}
                <div class="tech {{tech}}">{{tech}}</div>
                {% endfor %}
            </footer>
        </section>
    {% endfor %}
    </section>
</section>
<section id="education" class="section">
    {% include headingWithImage.html h="Education" lvl=2 img="/assets/img/graduation-cap.png" alt="🎓" %}
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
                <h3><em>Notable Coursework</em></h3>
                <ul>
                    {% for course in institution.courses %}
                    <li>{{ course }}</li>
                    {% endfor %}
                </ul>
            </div>
            <div class="awards">
                <h3><em>Awards and Recognitions</em></h3>
                <ul>
                    {% for award in institution.awards %}
                    <li>{{ award }}</li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>
    {% endfor %}
</section>

<!-- Currently only used on this page -->
<script src="/assets/scripts/collapsible.js"></script>
