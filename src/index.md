---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="max-width: 1240px; margin: 30px auto; padding: 0 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <h2 style="margin: 0 0 30px 0; color: #00467f; border-bottom: 4px solid #00467f; padding-bottom: 12px; font-size: 1.8em; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">
    📰 MGA PANGUNAHING BALITA NGAYON
  </h2>

  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 28px;">
    {% for item in balita %}
    <div style="background: white; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,70,127,0.08); overflow: hidden; border: 1px solid #e2e8f0;">
      
      <!-- 🖼️ KUNG MAY LARAWAN MULA SA SOURCE → IPAPAKITA! KUNG WALA → PANTULONG NA KULAY! -->
      {% if item.larawan %}
      <a href="{{ item.link }}" target="_blank">
        <img src="{{ item.larawan }}" alt="{{ item.title }}" style="width: 100%; height: 180px; object-fit: cover;">
      </a>
      {% else %}
      <div style="height: 180px; background: linear-gradient(135deg, #00467f, #0066b3); display: flex; align-items: center; justify-content: center; color: white; font-size: 3em;">
        📰
      </div>
      {% endif %}
      
      <div style="padding: 22px;">
        <span style="display: inline-block; background: #e6f0f8; color: #00467f; font-size: 0.75em; font-weight: bold; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 12px;">BALITA</span>
        
        <h3 style="margin: 0 0 12px 0; font-size: 1.05em; line-height: 1.5; font-weight: 700;">
          <a href="{{ item.link }}" target="_blank" style="color: #1e293b; text-decoration: none;">{{ item.title }}</a>
        </h3>
        
        <p style="font-size: 0.85em; color: #64748b; margin: 0 0 12px 0;">
          📅 {{ item.date | formatDate }}
        </p>
        
        <p style="font-size: 0.9em; color: #475569; line-height: 1.6; margin: 0;">{{ item.description }}</p>
      </div>
    </div>
    {% endfor %}
  </div>

</div>
