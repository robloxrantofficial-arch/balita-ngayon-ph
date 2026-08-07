---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div class="main-wrapper">

  <!-- 1. KALIWANG SIDEBAR (Trending na Balita) -->
  <aside class="sidebar-left">
    <h3 style="color: #cc0000; border-bottom: 2px solid #cc0000; padding-bottom: 5px; margin-top: 0;">🔥 Trending sa Luzon</h3>
    
    <div class="sidebar-card">
      <img src="https://picsum.photos" alt="Luzon Balita">
      <h4><a href="#">Sinturon ng Bagyong Hanna, patuloy na nagpapaulan sa Hilagang Luzon</a></h4>
      <span style="font-size: 0.75em; color: #777;">GMA News</span>
    </div>

    <div class="sidebar-card">
      <img src="https://picsum.photos" alt="Traffic Update">
      <h4><a href="#">Ulat Trapiko: Heavy traffic nararanasan sa kahabaan ng EDSA Kamuning</a></h4>
      <span style="font-size: 0.75em; color: #777;">INQUIRER.net</span>
    </div>
  </aside>

  <!-- 2. GITNANG MAIN CONTENT (Pangunahing Balita - Ang dynamic loop mo) -->
  <main class="main-content">
    <h2 style="margin-top: 0; color: #003366; border-bottom: 2px solid #003366; padding-bottom: 5px;">📰 Mga Pinakabagong Balita Ngayon</h2>
    
    <div class="news-list">
    {% for item in news %}
      <div class="news-card">
        <span style="font-size: 0.85em; color: #cc0000; font-weight: bold; background: #fff0f0; padding: 2px 6px; border-radius: 3px;">
          🚨 {{ item.source }}
        </span>
        <h3 style="margin: 8px 0 5px 0;">
          <a href="/news/{{ item.slug }}/" style="color: #003366; text-decoration: none; font-weight: bold; font-size: 1.2em;">
            {{ item.title }}
          </a>
        </h3>
        <p style="font-size: 0.95em; color: #444; margin: 5px 0;">{{ item.content }}</p>
      </div>
    {% else %}
      <p>Inihahanda ang mga artikulo...</p>
    {% endfor %}
    </div>
  </main>

  <!-- 3. KANANG SIDEBAR (Panlalawigan / VisMin) -->
  <aside class="sidebar-right">
    <h3 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; margin-top: 0;">🌴 Balitang VisMin</h3>
    
    <div class="sidebar-card">
      <img src="https://picsum.photos" alt="Cebu Balita">
      <h4><a href="#">Cebu Sinulog Foundation, nag-anunsyo na ng mga pagbabago sa ruta para sa susunod na taon</a></h4>
      <span style="font-size: 0.75em; color: #777;">SunStar Cebu</span>
    </div>

    <div class="sidebar-card">
      <img src="https://picsum.photos" alt="Mindanao Agriculture">
      <h4><a href="#">Sektor ng Agrikultura sa Davao, nakapagtala ng mataas na ani ng Durian ngayong buwan</a></h4>
      <span style="font-size: 0.75em; color: #777;">MindaNews</span>
    </div>
  </aside>

</div>
