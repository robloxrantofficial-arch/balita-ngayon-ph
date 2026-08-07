---
layout: base.njk
title: Balita Ngayon PH
---

# Balita Ngayon PH

Pinakabagong balita mula sa iba't ibang mapagkakatiwalaang pinagkukunan sa Pilipinas.

{% for article in news %}
- **[{{ article.title }}]({{ article.link }})** — *{{ article.source }}* — {{ article.date | formatDate }}
{% endfor %}
