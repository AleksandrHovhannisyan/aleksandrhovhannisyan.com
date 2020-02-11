---
title: Blog
permalink: /blog/
layout: blog
customJS: ["blogImage"]
tag: all
---
{% for post in site.posts %}
<div class="card post-preview" tabindex="0" data-tags="{{ post.tags | join: ' ' }}">
    <a class="container-link" href="{{ post.url }}" tabindex="-1"></a>
    {% include posts/thumbnail.html post=post %}
    <div class="post-preview-body">
        <header>
            <h3 class="post-title">{{ post.title }}</h3>
            {% assign primaryTag = post.tags | slice: 0, 1 %}
            {% include posts/stats.html content=post.content date=post.date tags=primaryTag %}
        </header>
        <p class="post-description">{{ post.description | truncate: 160 }}</p>
    </div>
</div>
{% endfor %}