---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="display: grid; grid-template-columns: 300px 1fr 300px; gap: 25px; max-width: 1400px; margin: 30px auto; padding: 0 20px; font-family: Arial, sans-serif;">

  <!-- 1. KALIWANG SIDEBAR -->
  <aside style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); height: fit-content;">
    <h3 style="color: #cc0000; border-bottom: 3px solid #cc0000; padding-bottom: 8px; margin-top: 0; font-size: 1.3em;">🔥 Trending sa Luzon</h3>
    <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
      <img src="https://unsplash.com" alt="Weather" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
      <span style="font-size: 0.75em; color: white; background: #cc0000; padding: 2px 6px; border-radius: 3px; font-weight: bold;">GMA News</span>
      <h4 style="margin: 8px 0 5px 0; font-size: 1.05em; line-height: 1.4;"><a href="#" style="color: #222; text-decoration: none; font-weight: bold;">Sinturon ng Bagyong Hanna, patuloy na nagpapaulan sa Hilagang Luzon</a></h4>
    </div>
    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
      <img src="https://unsplash.com" alt="Traffic" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
      <span style="font-size: 0.75em; color: white; background: #333; padding: 2px 6px; border-radius: 3px; font-weight: bold;">INQUIRER.net</span>
      <h4 style="margin: 8px 0 5px 0; font-size: 1.05em; line-height: 1.4;"><a href="#" style="color: #222; text-decoration: none; font-weight: bold;">Ulat Trapiko: Heavy traffic nararanasan sa kahabaan ng EDSA Kamuning</a></h4>
    </div>
  </aside>

  <!-- 2. GITNANG MAIN CONTENT (Iwinasto para magkaroon ng mga Larawan ang bawat balita) -->
  <main style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
    <h2 style="margin-top: 0; color: #003366; border-bottom: 3px solid #003366; padding-bottom: 8px; font-size: 1.6em;">📰 Mga Pinakabagong Balita Ngayon</h2>
    
    <div class="news-list">
    {% for item in news %}
      <div style="border-bottom: 1px solid #eee; padding: 20px 0; display: flex; gap: 20px; align-items: flex-start;">
        
        <!-- Ipinapasok ang dynamic image link sa kaliwa ng bawat artikulo -->
        {% if item.image %}
        <div style="flex-shrink: 0;">
          <img src="{{ item.image }}" alt="{{ item.title }}" style="width: 180px; height: 120px; object-fit: cover; border-radius: 6px; border: 1px solid #eee;">
        </div>
        {% endif %}

        <div style="flex-grow: 1;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
            <span style="font-size: 0.72em; color: #cc0000; font-weight: bold; background: #fff0f0; padding: 2px 6px; border-radius: 4px; border: 1px solid #ffcccc;">
              🚨 {{ item.source }}
            </span>
            <span style="font-size: 0.75em; color: #777;">{{ item.date }}</span>
          </div>
          <h3 style="margin: 5px 0 8px 0; line-height: 1.3;">
            <a href="/news/{{ item.slug }}/" style="color: #003366; text-decoration: none; font-weight: bold; font-size: 1.25em;">
              {{ item.title }}
            </a>
          </h3>
          <p style="font-size: 0.92em; color: #444; line-height: 1.5; margin: 0;">{{ item.content }}</p>
        </div>

      </div>
    {% else %}
      <p>Kasalukuyang inaayos ang mga artikulo...</p>
    {% endfor %}
    </div>
  </main>

  <!-- 3. KANANG SIDEBAR -->
  <aside style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); height: fit-content;">
    <h3 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 8px; margin-top: 0; font-size: 1.3em;">🌴 Balitang VisMin</h3>
    <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
      <img src="https://unsplash.com" alt="Festival" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
      <span style="font-size: 0.75em; color: white; background: #0066cc; padding: 2px 6px; border-radius: 3px; font-weight: bold;">SunStar Cebu</span>
      <h4 style="margin: 8px 0 5px 0; font-size: 1.05em; line-height: 1.4;"><a href="#" style="color: #222; text-decoration: none; font-weight: bold;">Cebu Sinulog Foundation, nag-anunsyo ng mga pagbabago sa ruta</a></h4>
    </div>
    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
      <img src="https://unsplash.com" alt="Agriculture" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
      <span style="font-size: 0.75em; color: white; background: #009944; padding: 2px 6px; border-radius: 3px; font-weight: bold;">MindaNews</span>
      <h4 style="margin: 8px 0 5px 0; font-size: 1.05em; line-height: 1.4;"><a href="#" style="color: #222; text-decoration: none; font-weight: bold;">Sektor ng Agrikultura sa Davao, nakapagtala ng mataas na ani ng Durian</a></h4>
    </div>
  </aside>

</div>
