---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="display: flex; flex-direction: column; gap: 30px; max-width: 900px; margin: 40px auto; padding: 0 20px; font-family: Arial, sans-serif;">

  <h2 style="margin: 0; color: #003366; border-bottom: 4px solid #003366; padding-bottom: 10px; font-size: 1.8em; font-weight: bold;">📰 Mga Pangunahing Balita Ngayon</h2>

  <!-- BANNER POST: PAGASA WEATHER -->
  <div style="background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden;">
    <img src="https://wikimedia.org" alt="Weather" style="width: 100%; height: 350px; object-fit: cover;">
    <div style="padding: 25px;">
      <span style="font-size: 0.75em; color: white; background: #cc0000; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">🚨 PAGASA Weather</span>
      <h3 style="margin: 15px 0 10px 0; font-size: 1.6em; line-height: 1.3;"><a href="/news/pagasa-bagong-lpa-sa-labas-ng-par/" style="color: #003366; text-decoration: none; font-weight: bold;">PAGASA: Bagong LPA sa labas ng PAR, posibleng maging bagyo ngayong linggo</a></h3>
      <p style="font-size: 1em; color: #444; line-height: 1.6; margin: 0;">Patuloy na binabantayan ng DOST-PAGASA ang isang Low Pressure Area sa silangan ng Mindanao. Pinapayuhan ang mga residente sa Visayas at Luzon na mag-ingat sa biglaang pag-ulan at posibleng pagbaha.</p>
    </div>
  </div>

  <!-- GRID AREA: MGA SUSUNOD NA BALITA -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">

    <!-- BALITA 2: DAVAO -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden; display: flex; flex-direction: column;">
      <img src="https://wikimedia.org" alt="Davao" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 20px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #009944; padding: 2px 6px; border-radius: 4px; font-weight: bold;">🌴 DAVAO NEWS</span>
        <h4 style="margin: 10px 0 8px 0; font-size: 1.2em; line-height: 1.4;"><a href="/news/davao-city-council-green-spaces/" style="color: #222; text-decoration: none; font-weight: bold;">Davao City Council, nagpasa ng ordinansa para sa green spaces</a></h4>
        <p style="font-size: 0.9em; color: #555; line-height: 1.5; margin: 0;">Inaprubahan ang karagdagang pondo upang mapanatili ang kalinisan at pagpaparami ng mga puno sa mga pampublikong parke ng lungsod.</p>
      </div>
    </div>

    <!-- BALITA 3: INQUIRER -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden; display: flex; flex-direction: column;">
      <img src="https://wikimedia.org" alt="DTI" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 20px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #333; padding: 2px 6px; border-radius: 4px; font-weight: bold;">📰 INQUIRER.NET</span>
        <h4 style="margin: 10px 0 8px 0; font-size: 1.2em; line-height: 1.4;"><a href="/news/presyo-ng-bilihin-matatag-dti/" style="color: #222; text-decoration: none; font-weight: bold;">Presyo ng mga bilihin sa Metro Manila, nananatiling matatag</a></h4>
        <p style="font-size: 0.9em; color: #555; line-height: 1.5; margin: 0;">Sa huling inspeksyon ng DTI, walang nakitang malaking paggalaw sa presyo ng bigas, de-lata, at iba pang pangunahing pangangailangan.</p>
      </div>
    </div>

    <!-- BALITA 4: GMA -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden; display: flex; flex-direction: column;">
      <img src="https://wikimedia.org" alt="LTO" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 20px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #cc0000; padding: 2px 6px; border-radius: 4px; font-weight: bold;">📺 GMA NEWS</span>
        <h4 style="margin: 10px 0 8px 0; font-size: 1.2em; line-height: 1.4;"><a href="/news/lto-babala-pekeng-plaka-fixers/" style="color: #222; text-decoration: none; font-weight: bold;">LTO naglabas ng babala laban sa mga pekeng plaka at fixers</a></h4>
        <p style="font-size: 0.9em; color: #555; line-height: 1.5; margin: 0;">Nagbabala ang Land Transportation Office sa mga motoristang gumagamit ng hindi opisyal na plaka. Magrehistro lamang sa mga lehitimong sangay.</p>
      </div>
    </div>

    <!-- BALITA 5: PANAY NEWS -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden; display: flex; flex-direction: column;">
      <img src="https://wikimedia.org" alt="Iloilo" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 20px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #0066cc; padding: 2px 6px; border-radius: 4px; font-weight: bold;">🌆 PANAY NEWS</span>
        <h4 style="margin: 10px 0 8px 0; font-size: 1.2em; line-height: 1.4;"><a href="/news/iloilo-city-pinakaligtas-na-lungsod/" style="color: #222; text-decoration: none; font-weight: bold;">Iloilo City, kinilala bilang isa sa mga pinakaligtas na lungsod</a></h4>
        <p style="font-size: 0.9em; color: #555; line-height: 1.5; margin: 0;">Dahil sa pinatinding seguridad, nakapagtala ang lungsod ng pinakamababang crime rate sa buong rehiyon ngayong buwan.</p>
      </div>
    </div>

  </div>

</div>
