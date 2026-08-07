---
layout: layouts/base.njk
pagination:
  data: news
  size: 1
  alias: item
permalink: "news/{{ item.slug }}/index.html"
eleventyComputed:
  title: "{{ item.title }}"
---

<article style="padding: 20px; max-width: 800px; margin: auto;">
  <span style="background: #003366; color: white; padding: 3px 8px; font-size: 0.8em; border-radius: 3px;">
    {{ item.source }}
  </span>
  <p><small>Inilathala noong: {{ item.date }}</small></p>
  
  <h1 style="color: #222; font-size: 2em; line-height: 1.3; margin-top: 10px;">{{ item.title }}</h1>
  
  <hr>
  
  <div style="font-size: 1.2em; line-height: 1.8; color: #444; margin: 20px 0;">
    {{ item.content }}
  </div>

  <p style="margin-top: 40px;">
    <a href="{{ item.link }}" target="_blank" rel="noopener" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
      Basahin ang Buong Balita Dito &rarr;
    </a>
  </p>
  
  <p style="margin-top: 50px;">
    <a href="/">&larr; Bumalik sa Home</a>
  </p>
</article>
