---
layout: _includes/base.njk
title: Balita Ngayon PH
---

# Balita Ngayon PH

Pinakabagong balita mula sa iba't ibang mapagkakatiwalaang pinagkukunan sa Pilipinas.

<ul>
{% for article in news %}
  <li style="margin: 0.8rem 0; padding-bottom: 0.8rem; border-bottom: 1px solid #eee;">
    {% if article.isWeather %}<strong style="color: darkblue;">[PANAHON]</strong>{% endif %}
    <a href="{{ article.link }}" target="_blank" style="font-size: 1.05rem; font-weight: bold;">{{ article.title }}</a>
    <br>
    <small style="color: #555;">{{ article.source }} — {{ article.date | formatDate }}</small>
  </li>
{% endfor %}
</ul>
