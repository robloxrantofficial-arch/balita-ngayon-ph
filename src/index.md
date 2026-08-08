---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="max-width: 1400px; margin: 40px auto; padding: 0 24px; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <h2 style="margin: 0 0 35px 0; color: #00467f; border-bottom: 4px solid #00467f; padding-bottom: 14px; font-size: 2.2em; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">
    📰 MGA PANGUNAHING BALITA NGAYON
  </h2>

  <!-- ✅ KAPAG WALANG BALITA — MAY MENSAHE, HINDI BLANGKO -->
  {% if not balita or balita.length == 0 %}
  <div style="background: #fef2f2; border-left:5px solid #ef4444; padding:20px; border-radius:6px; font-size:1.1em; color:#991b1b;">
    ⚠️ Kasalukuyang hindi makakuha ng mga bagong balita. Subukan muli mamaya.
  </div>
  {% else %}

  <div style="display: grid; gap: 35px;">
    {% for item in balita %}
    <div style="background: white; border-radius: 14px; box-shadow: 0 6px 20px rgba(0,70,127,0.12); overflow: hidden; border: 1px solid #e2e8f0; position:relative;">
      
      <!-- 🖼️🎥 UPDATED: KUNG MAY VIDEO → Ipakita ang video thumbnail + marka; kung wala → pangunahing malaking larawan -->
      {% if item.videoLink %}
        <a href="{{ item.videoLink }}" target="_blank">
          <img src="{{ item.videoLarawan | default(item.pangunahingLarawan) }}" alt="{{ item.pamagat | escape }}" style="width: 100%; height: 320px; object-fit: cover;">
          <span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.75);color:#fff;padding:6px 12px;border-radius:6px;font-weight:bold;font-size:0.95em;">🎥 MAY VIDEO</span>
        </a>
      {% elif item.pangunahingLarawan %}
        <a href="{{ item.link }}" target="_blank">
          <img src="{{ item.pangunahingLarawan }}" alt="{{ item.pamagat | escape }}" style="width: 100%; height: 320px; object-fit: cover;">
        </a>
      {% else %}
        <div style="height: 320px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 1.1em;">
          📰 Walang Larawan
        </div>
      {% endif %}
      
      <div style="padding: 30px;">
        <!-- 🏷️ PINAGMULAN / KASAMA ANG MARKA KUNG ULAT PANAHON -->
        <span style="display: inline-block; background: #e6f0f8; color: #00467f; font-size: 0.95em; font-weight: bold; padding: 6px 14px; border-radius: 6px; text-transform: uppercase; margin-bottom: 18px;">
          {{ item.pinagmulan }}
        </span>
        
        <!-- 📌 PAMAGAT -->
        <h3 style="margin: 0 0 16px 0; font-size: 1.5em; line-height: 1.4; font-weight: 700;">
          <a href="{{ item.link }}" target="_blank" style="color: #1e293b; text-decoration: none;">
            {{ item.pamagat }}
          </a>
        </h3>
        
        <!-- 📅 PETSA -->
        <p style="font-size: 1.05em; color: #64748b; margin: 0 0 18px 0;">
          📅 {{ item.petsa | formatDate }}
        </p>
        
        <!-- 📝 MAS MAY LAMAN NA BUOD — mula sa mas mahabang nilalaman -->
        <p style="font-size: 1.1em; color: #334155; line-height: 1.7; margin: 0;">
          {{ item.buod }}
        </p>

        <!-- ✨ OPSYONAL: kung gusto mo pang ipakita iba pang litrato sa ibaba -->
        {% if item.ibaPangLarawan and item.ibaPangLarawan.length > 1 %}
        <div style="margin-top:20px;display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;">
          {% for dagdagLarawan in item.ibaPangLarawan.slice(1,4) %}
            <img src="{{ dagdagLarawan }}" alt="Karagdagang litrato" style="height:80px;border-radius:6px;object-fit:cover;">
          {% endfor %}
        </div>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>

  {% endif %}

</div>
