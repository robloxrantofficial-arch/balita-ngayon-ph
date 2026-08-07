---
layout: layouts/base.njk
title: "Pilipinas Auto News Portal"
---

<div style="display: flex; flex-direction: column; gap: 35px; max-width: 1000px; margin: 40px auto; padding: 0 20px; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa;">

  <h2 style="margin: 0; color: #003366; border-bottom: 4px solid #003366; padding-bottom: 12px; font-size: 2em; font-weight: 800; letter-spacing: -0.5px;">📰 MGA PANGUNAHING BALITA NGAYON</h2>

  <!-- 1. ANG PINAKAMALAKING BANNER POST (PAGASA WEATHER) -->
  <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e9ecef;">
    <div style="width: 100%; height: 380px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
    <div style="padding: 30px;">
      <span style="font-size: 0.75em; color: white; background: #cc0000; padding: 4px 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">🚨 PAGASA Weather</span>
      <h3 style="margin: 15px 0 12px 0; font-size: 1.8em; line-height: 1.3; font-weight: bold;"><a href="/news/pagasa-bagong-lpa-sa-labas-ng-par/" style="color: #003366; text-decoration: none;">PAGASA: Bagong LPA sa labas ng PAR, posibleng maging bagyo ngayong linggo</a></h3>
      <p style="font-size: 1.05em; color: #495057; line-height: 1.6; margin: 0;">Patuloy na binabantayan ng DOST-PAGASA ang isang Low Pressure Area sa silangan ng Mindanao. Pinapayuhan ang mga residente sa Visayas at Luzon na mag-ingat sa biglaang pag-ulan at posibleng pagbaha.</p>
    </div>
  </div>

  <!-- 2. ANG UNANG DALAWANG GRID POSTS (DAVAO AT MANILA MARKET) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">

    <!-- POST 2: DAVAO GREEN SPACES -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #009944; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">🌴 DAVAO NEWS</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/davao-city-council-green-spaces/" style="color: #212529; text-decoration: none;">Davao City Council, nagpasa ng ordinansa para sa green spaces ng lungsod</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Inaprubahan ang karagdagang pondo upang mapanatili ang kalinisan at pagpaparami ng mga puno sa mga pampublikong parke ng lungsod.</p>
      </div>
    </div>

    <!-- POST 3: DTI BILIHIN -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #343a40; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">📰 INQUIRER.NET</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/presyo-ng-bilihin-matatag-dti/" style="color: #212529; text-decoration: none;">Presyo ng mga bilihin sa Metro Manila, nananatiling matatag ayon sa DTI</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Sa huling inspeksyon ng DTI, walang nakitang malaking paggalaw sa presyo ng bigas, de-lata, at iba pang pangunahing pangangailangan ng mamamayan.</p>
      </div>
    </div>

  </div>

  <!-- 3. ANG PANGALAWANG GRID POSTS (TRAFFIC AT ILOILO CUSTOMS) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">

    <!-- POST 4: LTO TRAPIKO AT FIXERS -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #cc0000; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">📺 GMA NEWS</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/lto-babala-pekeng-plaka-fixers/" style="color: #212529; text-decoration: none;">LTO naglabas ng babala laban sa mga pekeng plaka at fixers sa bansa</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Nagbabala ang Land Transportation Office sa mga motoristang gumagamit ng hindi opisyal na plaka. Magrehistro lamang sa mga lehitimong sangay.</p>
      </div>
    </div>

    <!-- POST 5: ILOILO SAFETY -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #0066cc; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">🌆 PANAY NEWS</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/iloilo-city-pinakaligtas-na-lungsod/" style="color: #212529; text-decoration: none;">Iloilo City, muling kinilala bilang isa sa mga pinakaligtas na lungsod sa bansa</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Dahil sa pinatinding seguridad at pagtutulungan, nakapagtala ang lungsod ng pinakamababang crime rate sa buong rehiyon ngayong buwan.</p>
      </div>
    </div>

  </div>

  <!-- 4. APAT PANG KARAGDAGANG BALITA (PARA TALAGANG MAPUNO ANG SCREEN AT HUMABA) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 5px;">

    <!-- POST 6: DEPED ESKWELA -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #002b49; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">🏫 DEPED UPDATE</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/deped-kahandaan-bukas-klase/" style="color: #212529; text-decoration: none;">DepEd tiniyak ang kahandaan ng mga pampublikong paaralan sa pagbubukas ng klase</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Sapat ang mga naipamahaging aklat at inihandang silid-aralan para sa milyun-milyong mag-aaral sa darating na Lunes.</p>
      </div>
    </div>

    <!-- POST 7: TOURISM PALAWAN -->
    <div style="background: white; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e9ecef;">
      <div style="width: 100%; height: 220px; background-image: url('https://wikimedia.org'); background-size: cover; background-position: center;"></div>
      <div style="padding: 22px; flex-grow: 1;">
        <span style="font-size: 0.72em; color: white; background: #e87722; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">🌊 ECO-TOURISM</span>
        <h4 style="margin: 12px 0 10px 0; font-size: 1.3em; line-height: 1.4; font-weight: bold;"><a href="/news/palawan-worlds-best-islands/" style="color: #212529; text-decoration: none;">Palawan, napanatili ang pwesto bilang isa sa World's Best Islands</a></h4>
        <p style="font-size: 0.95em; color: #495057; line-height: 1.5; margin: 0;">Muling pinarangalan ang isla dahil sa malinis na pangangalaga sa mga kuweba at malakristal na karagatan na patuloy na dinarayo.</p>
      </div>
    </div>

  </div>

</div>
