---
layout: layouts/base.njk
title: "Maaasahang Balita sa Pilipinas"
---

## 🛑 Ulat Panahon at Alerto (PAGASA / GMA Weather)
<div class="weather-list">
{% for item in news %}
  {% if item.isWeather %}
    <div class="news-card weather-alert">
      <h3><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
      <p><small>Pinagkunan: {{ item.source }} | {{ item.date }}</small></p>
    </div>
  {% endif %}
{% endfor %}
</div>

<hr>

## 📰 Mga Pinakabagong Balita ngayon
<div class="news-list">
{% for item in news %}
  {% if not item.isWeather %}
    <div class="news-card">
      <h3><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
      <p><small>Pinagkunan: {{ item.source }} | {{ item.date }}</small></p>
    </div>
  {% endif %}
{% else %}
  <p>Walang nakuhang balita sa ngayon. Subukang i-build muli.</p>
{% endfor %}
</div>
