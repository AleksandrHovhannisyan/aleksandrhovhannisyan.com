---
title: Blog
permalink: /blog/
layout: blog
---

{% for post in site.posts %}
<div class="card post-preview">
    <header>
        <h3 class="post-title">{{ post.title }}</h3>
        {% include posts/stats.html target=post %}
    </header>
    <p class="post-description">{{ post.description }}</p>
    <a class="container-link" href="{{ post.url }}"></a>
</div>
{% endfor %}