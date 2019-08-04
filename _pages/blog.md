---
title: Blog
layout: default
permalink: /blog/
order: 3
---

{% include banner.html heading="Welcome to my blog!" content="This is where I share my thoughts on a variety of topics. All opinions are strictly my own." %}

<article id="post-previews" class="container">
    {% for post in site.posts %}
        <div class="card post-preview">
            <header>
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-date">Posted: {{ post.date | date: "%b %-d, %Y" }}</div>
            </header>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <a class="container-link" href="{{ post.url }}"></a>
        </div>
    {% endfor %}
</article>