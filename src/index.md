---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="max-width: 1400px; margin: 40px auto; padding: 0 24px; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <h2 style="margin: 0 0 35px 0; color: #00467f; border-bottom: 4px solid #00467f; padding-bottom: 14px; font-size: 2.2em; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">
    📰 MGA PANGUNAHING BALITA NGAYON
  </h2>

  <div style="display: grid; gap: 35px;">
    {% for item in balita %}
    <div style="background: white; border-radius: 14px; box-shadow: 0 6px 20px rgba(0,70,127,0.12); overflow: hidden; border: 1px solid #e2e8f0;">
      
      <!-- 🖼️ LARAWAN — MAS MALAKI NA! -->
      {% if item.larawan %}
      <a href="{{ item.link }}" target="_blank">
        <img src="{{ item.larawan }}" alt="{{ item.title }}" style="width: 100%; height: 320px; object-fit: cover;">
      </a>
      {% else %}
      <div style="height: 220px; background: linear-gradient(135deg, #00467f, #0066b3); display: flex; align-items: center; justify-content: center; color: white; font-size: 4em;">
        📰
      </div>
      {% endif %}
      
      <div style="padding: 30px;">
        <span style="display: inline-block; background: #e6f0f8; color: #00467f; font-size: 0.95em; font-weight: bold; padding: 6px 14px; border-radius: 6px; text-transform: uppercase; margin-bottom: 18px;">BALITA</span>
        
        <h3 style="margin: 0 0 16px 0; font-size: 1.5em; line-height: 1.4; font-weight: 700;">
          <a href="{{ item.link }}" target="_blank" style="color: #1e293b; text-decoration: none;">{{ item.title }}</a>
        </h3>
        
        <p style="font-size: 1.05em; color: #64748b; margin: 0 0 18px 0; display: flex; align-items: center; gap: 8px;">
          📅 {{ item.date | formatDate }}
        </p>
        
        <p style="font-size: 1.1em; color: #334155; line-height: 1.7; margin: 0;">{{ item.description }}</p>
      </div>
    </div>
    {% endfor %}
  </div>

</div>
