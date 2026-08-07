---
layout: layouts/base.njk
title: "Maaasahang Balita sa Pilipinas"
---

## 📰 Mga Pinakabagong Balita Ngayon

<div class="news-list">
{% for item in news %}
  <div class="news-card" style="border-bottom: 1px solid #eee; padding: 15px 0;">
    <span style="font-size: 0.8em; color: #777; font-weight: bold;">🚨 {{ item.source }} | {{ item.date }}</span>
    <h3 style="margin: 5px 0;">
      <a href="/news/{{ item.slug }}/" style="color: #1a0dab; text-decoration: none; font-weight: bold;">
        {{ item.title }}
      </a>
    </h3>
    <p style="font-size: 0.95em; color: #444; margin: 5px 0;">{{ item.content }}</p>
  </div>
{% else %}
  <p>Kasalukuyang kinukuha ang mga sariwang balita mula sa mga sors...</p>
{% endfor %}
</div>
