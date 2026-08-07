---
layout: layouts/base.njk
title: "Pilipinas News Portal"
---

## 📰 Mga Pinakabagong Balita Ngayon

<div class="news-list" style="margin-top: 20px;">
{% for item in news %}
  <div class="news-card" style="border-bottom: 1px solid #eee; padding: 15px 0; margin-bottom: 15px;">
    <span style="font-size: 0.85em; color: #cc0000; font-weight: bold; background: #fff0f0; padding: 2px 6px; border-radius: 3px;">
      🔥 {{ item.source }}
    </span>
    <h3 style="margin: 8px 0 5px 0;">
      <a href="/news/{{ item.slug }}/" style="color: #003366; text-decoration: none; font-weight: bold; font-size: 1.2em;">
        {{ item.title }}
      </a>
    </h3>
    <p style="font-size: 0.95em; color: #444; margin: 5px 0;">{{ item.content }}</p>
  </div>
{% else %}
  <p>Inihahanda ang mga artikulo sa unang pagkakataon...</p>
{% endfor %}
</div>
