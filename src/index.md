---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

## 🛑 PAGASA Live Weather & News Casters Updates
<div class="weather-list" style="margin-bottom: 30px;">
{% for item in news %}
  {% if item.isWeather %}
    <div class="news-card" style="background-color: #e6f2ff; border-left: 5px solid #0066cc; padding: 15px; margin-bottom: 10px;">
      <span style="font-size: 0.8em; color: #555; font-weight: bold;">🚨 {{ item.source }} | {{ item.date }}</span>
      <h3 style="margin: 5px 0;"><a href="/news/{{ item.slug }}/" style="color: #0044cc; text-decoration: none;">{{ item.title }}</a></h3>
    </div>
  {% endif %}
{% endfor %}
</div>

<hr>

## 📰 Mga Pinakabagong Balita Ngayon
<div class="news-list">
{% for item in news %}
  {% if not item.isWeather %}
    <div class="news-card" style="border-bottom: 1px solid #eee; padding: 15px 0;">
      <span style="font-size: 0.8em; color: #777;">{{ item.source }} | {{ item.date }}</span>
      <h3 style="margin: 5px 0;"><a href="/news/{{ item.slug }}/" style="color: #1a0dab; text-decoration: none;">{{ item.title }}</a></h3>
    </div>
  {% endif %}
{% else %}
  <p>Nag-a-update ng mga sariwang balita...</p>
{% endfor %}
</div>
