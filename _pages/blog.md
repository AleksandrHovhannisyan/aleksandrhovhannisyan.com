---
title: Blog
permalink: /blog/
layout: blog
customJS: ["blogImage"]
category: all
---
{% for post in site.posts %}
<div class="card post-preview" tabindex="0">
    <a class="container-link" href="{{ post.url }}" tabindex="-1"></a>
    {% include posts/thumbnail.html post=post %}
    <div class="post-preview-body">
        <header>
            <h3 class="post-title">{{ post.title }}</h3>
            {% include posts/stats.html target=post %}
        </header>
        <p class="post-description">{{ post.description | truncate: 160 }}</p>
    </div>
</div>
{% endfor %}