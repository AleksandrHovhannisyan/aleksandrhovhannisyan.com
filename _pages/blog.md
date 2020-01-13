---
title: Blog
permalink: /blog/
layout: blog
customJS: ["blogImage"]
---
{% for post in site.posts %}
<div class="card post-preview">
    <img data-src="/assets/img/posts/{{ post.slug }}/og.PNG" alt="Post thumbnail" />
    <div class="post-preview-body">
        <header>
            <h3 class="post-title">{{ post.title }}</h3>
            {% include posts/stats.html target=post %}
        </header>
        <p class="post-description">{{ post.description }}</p>
        <a class="container-link" href="{{ post.url }}"></a>
    </div>
</div>
{% endfor %}