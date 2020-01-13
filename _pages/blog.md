---
title: Blog
permalink: /blog/
layout: blog
---

{% assign latest = site.posts[0] %}
<div class="card post-preview" id="latest-post">
    <img src="/assets/img/posts/{{ latest.slug }}/og.PNG" alt="Post thumbnail" />
    <div id="latest-post-body">
        <header>
            <h3 class="post-title">{{ latest.title }}</h3>
            {% include posts/stats.html target=latest %}
        </header>
        <p class="post-description">{{ latest.description }}</p>
        <a class="container-link" href="{{ latest.url }}"></a>
    </div>
</div>
{% for post in site.posts offset:1 %}
<div class="card post-preview">
    <header>
        <h3 class="post-title">{{ post.title }}</h3>
        {% include posts/stats.html target=post %}
    </header>
    <p class="post-description">{{ post.description }}</p>
    <a class="container-link" href="{{ post.url }}"></a>
</div>
{% endfor %}