---
layout: layouts/base.njk
title: "Maaasahang Balita sa Pilipinas"
---

## 📰 Mga Pinakabagong Balita Ngayon

<div class="news-list">
{% for item in news %}
  <div class="news-card" style="border-bottom: 1px solid #eee; padding: 15px 0;">
    <span style="font-size: 0.8em; color: #777;">{{ item.source }} | {{ item.date }}</span>
    <h3 style="margin: 5px 0;"><a href="/news/{{ item.slug }}/" style="color: #1a0dab; text-decoration: none;">{{ item.title }}</a></h3>
  </div>
{% else %}
  <p>Nag-a-update ng mga sariwang balita...</p>
{% endfor %}
</div>
