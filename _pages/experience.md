---
title: Experience
layout: default
custom_css: ["experience"]
custom_js: ["loadRepoData"]
permalink: /experience/
order: 2
---

<article class="banner container">
    <h1>My experience</h1>
    <p>I try to keep busy while having fun and testing my limits. Between school, side projects, and interning, 
    I've gained valuable exposure to a wide variety of interesting technologies and problems.</p>
</article>

<hr>

<article id="projects" class="container">
    <h2 class="heading">
        <span>Projects</span>
        <img src="/assets/../assets/img/folder.png" alt="📁">
    </h2>
    <div id="card-grid">
        <!-- Projects get populated here dynamically (see index.js) -->
        <aside id="project-placeholder" class="project">
            <header>
                <h4>Want to see more of my work?</h4>
            </header>
            <div>
                <p>Check out my other repos:</p>
                <a class="github-icon" href="https://github.com/AleksandrHovhannisyan?tab=repositories" target="_blank"><i class="fab fa-github"></i></a>
            </div>
        </aside>
    </div>
</article>

<article id="skills" class="container">
    <h2 class="heading">
        <span>Skills and Abilities</span>
        <img src="../assets/img/juggler.png" alt="🤹">
    </h2>
    {% for skill in site.data.skills %}
    <div class="skill-category">
        <h4>{{ skill.category }}</h4>
        {% for item in skill.items %}
        <div class="skill-item">
            <span class="skill-name">{{ item.name }}</span>
            <div class="skill-rating">
            {% for i in (1..item.rating) %}
                <i class="fas fa-star filled"></i>
            {% endfor %}
            {% assign j = item.rating | plus: 1 %}
            {% for i in (j..5) %}
                <i class="fas fa-star empty"></i>
            {% endfor %}
            </div>
        </div>
        {% endfor %}
    </div>
    {% endfor %}
</article>

<article id="education" class="container">
    <h2 class="heading">
        <span>Education</span>
        <img src="/assets/../assets/img/graduation-cap.png" alt="🎓">
    </h2>
    <p>
        If my track record speaks to anything, it's my <strong>commitment to excellence</strong>
        in every endeavor I pursue.
    </p>
    <div class="institution collapsible">
        <div class="collapsible-header">
            <i class="fas fa-angle-down"></i>
            <span>
                <strong>University of Florida<br></strong>
                B.Sc. in Computer Science<br>
                4.0 GPA, 2016&ndash;2019
            </span>
        </div>
        <div class="collapsible-content">
            <div class="courses">
                <h4><em>Notable Coursework</em></h4>
                <ul>
                    <li>Data structures and algorithms</li>
                    <li>Programming language concepts</li>
                    <li>Intro to software engineering</li>
                    <li>Computer architecture, operating systems</li>
                    <li>Database management systems</li>
                    <li>Calculus, linear algebra, numerical analysis</li>
                </ul>
            </div>
            <div class="awards">
                <h4><em>Awards and Recognitions</em></h4>
                <ul>
                    <li>
                        <a href="https://clas.ufl.edu/undergraduate/anderson-scholars/anderson-scholars-listing/"
                        target="_blank">Anderson Scholar Award (Highest Distinction, 2018)</a>
                    </li>
                    <li>Dean's List Award (2016–present)</li>
                    <li>Bright Futures Academic Scholar (2016–present)</li>
                </ul>
            </div>
        </div>
    </div>
</article>