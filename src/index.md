---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="max-width: 1200px; margin: 30px auto; padding: 0 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <h2 style="margin: 0 0 25px 0; color: #00467f; border-bottom: 4px solid #00467f; padding-bottom: 10px; font-size: 1.8em; font-weight: 900; text-transform: uppercase;">
    📰 MGA PANGUNAHING BALITA NGAYON
  </h2>

  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px;">
    {% for item in balita %}
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); padding: 20px; border: 1px solid #e2e8f0;">
      <h3 style="margin: 0 0 10px 0; font-size: 1.1em; line-height: 1.4;">
        <a href="{{ item.link }}" target="_blank" style="color: #00467f; text-decoration: none; font-weight: bold;">{{ item.title }}</a>
      </h3>
      <p style="font-size: 0.9em; color: #666; margin: 0 0 10px 0;">
        <small>{{ item.date | formatDate }}</small>
      </p>
      <p style="font-size: 0.95em; color: #333; line-height: 1.5; margin: 0;">{{ item.description }}</p>
    </div>
    {% endfor %}
  </div>

</div>
