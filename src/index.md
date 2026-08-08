---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="max-width: 1400px; margin: 40px auto; padding: 0 24px; font-family: 'Helvetica Neue', Arial, sans-serif; display: grid; grid-template-columns: 220px 1fr 220px; gap:25px;">

  <!-- 🟦 KALIWANG GILID: MGA PINAGKUKUNAN NG BALITA -->
  <div>
    <div style="background: linear-gradient(180deg, #00467f, #2a6fb8); border-radius:12px; padding:20px; color:white; box-shadow: 0 4px 15px rgba(0,70,127,0.2); margin-bottom: 25px;">
      <h3 style="border-bottom:2px solid #ffffff60; padding-bottom:10px; margin-top:0; font-size:1.2em;">📢 MGA PINAGKUKUNAN</h3>
      <ul style="list-style: none; padding: 0; margin: 15px 0 0 0;">
        <li style="margin-bottom: 10px;"><a href="https://www.philstar.com/" target="_blank" style="color:white; text-decoration:none; opacity:0.9;">✅ Philstar</a></li>
        <li style="margin-bottom: 10px;"><a href="https://mb.com.ph/" target="_blank" style="color:white; text-decoration:none; opacity:0.9;">✅ Manila Bulletin</a></li>
        <li style="margin-bottom: 10px;"><a href="https://www.pna.gov.ph/" target="_blank" style="color:white; text-decoration:none; opacity:0.9;">✅ PNA (Gobyerno)</a></li>
        <li><a href="https://www.rappler.com/" target="_blank" style="color:white; text-decoration:none; opacity:0.9;">✅ Rappler</a></li>
      </ul>
    </div>
    <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
      <h3 style="color:#00467f; border-bottom:2px solid #00467f50; padding-bottom:10px; margin-top:0; font-size:1.2em;">🔔 PAALALA</h3>
      <p style="font-size:0.9em; line-height:1.5; background:#e6f0f8; padding:10px; border-radius:6px; color:#00467f;">
        Ang mga nilalaman ay mula sa mga opisyal na pinagkukunan. Pindutin ang pamagat para sa buong artikulo.
      </p>
    </div>
  </div>


  <!-- 📰 GITNA: PANGUNAHING MGA BALITA -->
  <div>
    <h2 style="margin:0 0 35px 0; color:#00467f; border-bottom:4px solid #00467f; padding-bottom:14px; font-size:2.2em; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px;">
      📰 MGA PANGUNAHING BALITA NGAYON
    </h2>

    {% if not balita or balita.length == 0 %}
    <div style="background:#fef2f2; border-left:5px solid #ef4444; padding:20px; border-radius:6px; font-size:1.1em; color:#991b1b;">
      ⚠️ Kasalukuyang hindi makakuha ng mga bagong balita. Subukan muli mamaya.
    </div>
    {% else %}

    <div style="display: grid; gap:35px;">
      {% for item in balita %}
      <div style="background:white; border-radius:14px; box-shadow:0 6px 20px rgba(0,70,127,0.12); overflow:hidden; border:1px solid #e2e8f0; position:relative;">
        
        {% if item.videoLink %}
          <a href="{{ item.videoLink }}" target="_blank">
            <img src="{{ item.videoLarawan | default(item.pangunahingLarawan) }}" alt="{{ item.pamagat }}" style="width:100%; height:320px; object-fit:cover;">
            <span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.75);color:#fff;padding:6px 12px;border-radius:6px;font-weight:bold;font-size:0.95em;">🎥 MAY VIDEO</span>
          </a>
        {% elif item.pangunahingLarawan %}
          <a href="{{ item.link }}" target="_blank">
            <img src="{{ item.pangunahingLarawan }}" alt="{{ item.pamagat }}" style="width:100%; height:320px; object-fit:cover;">
          </a>
        {% else %}
          <div style="height:320px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:1.1em;">📰 Walang Larawan</div>
        {% endif %}
        
        <div style="padding:30px;">
          <span style="display:inline-block; background:#e6f0f8; color:#00467f; font-size:0.95em; font-weight:bold; padding:6px 14px; border-radius:6px; text-transform:uppercase; margin-bottom:18px;">{{ item.pinagmulan }}</span>
          
          <h3 style="margin:0 0 16px 0; font-size:1.5em; line-height:1.4; font-weight:700;">
            <a href="{{ item.link }}" target="_blank" style="color:#1e293b; text-decoration:none;">{{ item.pamagat }}</a>
          </h3>
          
          <p style="font-size:1.05em; color:#64748b; margin:0 0 18px 0;">📅 {{ item.petsa | formatDate }}</p>
          
          {% set malinisNaBuod = item.buod | replace("&nbsp;", " ") %}
          <p style="font-size:1.1em; color:#334155; line-height:1.7; margin:0;">{{ malinisNaBuod }}</p>

          {% if item.ibaPangLarawan and item.ibaPangLarawan.length > 1 %}
          <div style="margin-top:20px; display:flex; gap:10px; overflow-x:auto; padding-bottom:8px;">
            {% for dagdagLarawan in item.ibaPangLarawan.slice(1,4) %}
              <img src="{{ dagdagLarawan }}" alt="Karagdagang litrato" style="height:80px; border-radius:6px; object-fit:cover;">
            {% endfor %}
          </div>
          {% endif %}
        </div>
      </div>
      {% endfor %}
    </div>

    {% endif %}
  </div>


  <!-- 🟩 KANANG GILID: MGA KATEGORYA NA MAY GUMAGANANG KILOS -->
  <div>
    <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin-bottom:25px;">
      <h3 style="color:#00467f; border-bottom:2px solid #00467f50; padding-bottom:10px; margin-top:0; font-size:1.2em;">📌 MGA KATEGORYA</h3>
      <ul style="list-style:none; padding:0; margin:15px 0;">
        <li style="padding:6px 0; border-bottom:1px dashed #cbd5e1;">
          <a href="?kategorya=pambansa" style="color:#00467f; text-decoration:none; font-weight:bold; cursor:pointer;">✅ Pambansang Balita</a>
        </li>
        <li style="padding:6px 0; border-bottom:1px dashed #cbd5e1;">
          <a href="?kategorya=panahon" style="color:#00467f; text-decoration:none; font-weight:bold; cursor:pointer;">🌤️ Ulat Panahon</a>
        </li>
        <li style="padding:6px 0; border-bottom:1px dashed #cbd5e1;">
          <a href="?kategorya=sasakyan" style="color:#00467f; text-decoration:none; font-weight:bold; cursor:pointer;">🚗 Sasakyan at Transportasyon</a>
        </li>
        <li style="padding:6px 0; border-bottom:1px dashed #cbd5e1;">
          <a href="?kategorya=kabuhayan" style="color:#00467f; text-decoration:none; font-weight:bold; cursor:pointer;">💼 Kabuhayan at Negosyo</a>
        </li>
        <li style="padding:6px 0;">
          <a href="?kategorya=iba" style="color:#00467f; text-decoration:none; font-weight:bold; cursor:pointer;">📰 Iba pang Napapanahong Isyu</a>
        </li>
      </ul>
    </div>
    <div style="background:linear-gradient(180deg,#00467f,#2a6fb8); border-radius:12px; padding:20px; color:white; box-shadow:0 4px 15px rgba(0,70,127,0.2);">
      <h3 style="border-bottom:2px solid #ffffff60; padding-bottom:10px; margin-top:0; font-size:1.2em;">📅 NGAYONG ARAW</h3>
      <div style="background:#ffffff20; padding:12px; border-radius:6px; text-align:center; font-weight:bold; margin-top:15px;">
        {{ "now" | formatDate }}
      </div>
    </div>
  </div>

</div>
