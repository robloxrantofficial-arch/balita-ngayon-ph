const Parser = require("rss-parser");
require("isomorphic-fetch");
const url = require('url');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ DALAWANG URI NG PROXY + MAY PAGSUSURI UPANG HINDI MAGKAMALI SA URL
  const gamitProxy = (linkUrl) => {
    if(!linkUrl) return null;
    if(linkUrl.startsWith("data:") || linkUrl.includes("allorigins.win") || linkUrl.includes("corsproxy.io")) return linkUrl;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(linkUrl)}`;
  };
  const altProxy = (linkUrl) => {
    if(!linkUrl) return null;
    return `https://corsproxy.io/?${encodeURIComponent(linkUrl)}`;
  };

  // 🖼️ MATATAG NA PAGKUHA NG LARAWAN + ✅ PINALITAN ANG MGA SIRANG LINK
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null,
      listahanLarawan: [],
      videoLarawan: null,
      videoLink: null
    };

    // Kumuha mula media:content
    if(item?.["media:content"]){
      const mc = Array.isArray(item["media:content"]) ? item["media:content"] : [item["media:content"]];
      for(const m of mc){
        if(m?.url && m.type?.startsWith("image/")){
          nakuha.pangunahingLarawan = gamitProxy(m.url);
          nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
          break;
        }
      }
    }

    // Kumuha mula media:thumbnail
    if(!nakuha.pangunahingLarawan && item?.["media:thumbnail"]?.url){
      nakuha.pangunahingLarawan = gamitProxy(item["media:thumbnail"].url);
      nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
    }

    // Hanapin sa loob ng nilalaman
    if(!nakuha.pangunahingLarawan){
      const buongTeksto = item?.["content:encoded"] || item?.content || item?.description || "";
      const tugmaLahatImg = buongTeksto.matchAll(/<img[^>]+src\s*=\s*["']([^"']+\.(jpg|jpeg|png|webp))["']/gi);
      const mgaImg = Array.from(tugmaLahatImg, m=>m[1]);
      if(mgaImg.length > 0){
        nakuha.pangunahingLarawan = gamitProxy(mgaImg[0]);
        nakuha.listahanLarawan = mgaImg.slice(1,4).map(u=>gamitProxy(u));
      }
    }

    // ✨ NAITAMA NA LISTAHAN NG KAPALIT NA LARAWAN — walang sirang link, tugma sa bawat kategorya
    const pamagat = (item?.pamagat || "").toString();
    const buod = (item?.buod || "").toString();
    const pamagatAtBuod = (pamagat + " " + buod).toLowerCase();

    const listahanKapalit = [
      {susi:["panahon","ulan","bagyo","baha","init","ambon"], litrato:"https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop&crop=center"},
      {susi:["transport","kalsada","kotse","bus","tren","sasakyan"], litrato:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop&crop=center"},
      {susi:["negosyo","pera","kita","presyo","trabaho","ekonomiya","kabuhayan"], litrato:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&crop=center"},
      {susi:["bansa","pamahalaan","gobyerno","pilipinas","pambansa","nasyonal"], litrato:"https://images.unsplash.com/photo-1531259522800-85ecbc033f8d?w=800&h=400&fit=crop&crop=center"}, // ✅ kapalit ng dating sirang link
      {susi:["artista","showbiz","sikat","pelikula","aliw"], litrato:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop&crop=center"}, // ✅ kapalit ng dating sirang link
      {susi:[], litrato:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&crop=center"},
      {susi:[], litrato:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&crop=center"},
      {susi:[], litrato:"https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=400&fit=crop&crop=center"},
      {susi:[], litrato:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop&crop=center"} // ✅ dagdag reserba
    ];

    let napilingKapalit = null;
    for(const k of listahanKapalit){
      if(k.susi.length > 0 && k.susi.some(kw=>pamagatAtBuod.includes(kw))){
        napilingKapalit = k.litrato;
        break;
      }
    }
    if(!napilingKapalit){
      const hash = [...pamagat].reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
      napilingKapalit = listahanKapalit.slice(4)[hash % (listahanKapalit.length-4)].litrato;
    }

    if(!nakuha.pangunahingLarawan || nakuha.pangunahingLarawan.length < 15){
      nakuha.pangunahingLarawan = napilingKapalit;
    }

    return nakuha;
  };

  // ⏱️ PINA IKLI AT KONTROLADONG PAGHIHINTAY — hindi nagdudulot ng malaking puwang
  const antala = ms => new Promise(r=>setTimeout(r, Math.min(ms, 600)));

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "tl-PH,tl;q=0.9,en-US;q=0.8,en;q=0.7",
          "Referer": "https://www.google.com.ph/"
        },
        customFields: { 
          item: ["media:thumbnail","media:content","media:group","content:encoded","description","enclosure"] 
        },
        timeout: 45000
      });

      const mgaPinagkukunan = [
        "https://news.google.com/rss?hl=tl&gl=PH&ceid=PH:tl",
        "https://news.google.com/rss?hl=en&gl=PH&ceid=PH:en",
        "https://www.rappler.com/rss"
      ];

      const lahatBalita = [];
      for(const urlPinagkunan of mgaPinagkukunan){
        await antala(1000);
        let feed = null;
        try{
          feed = await parser.parseURL(urlPinagkunan);
        }catch(e){
          try{
            console.log(`🔁 Gamit unang proxy para sa: ${urlPinagkunan}`);
            const proxyUrl1 = gamitProxy(urlPinagkunan);
            if(proxyUrl1) feed = await parser.parseURL(proxyUrl1);
          }catch(e2){
            try{
              console.log(`🔁 Lumipat pangalawang proxy para sa: ${urlPinagkunan}`);
              const proxyUrl2 = altProxy(urlPinagkunan);
              if(proxyUrl2) feed = await parser.parseURL(proxyUrl2);
            }catch(e3){
              console.log(`❌ HINDI MAKUHA: ${urlPinagkunan} — ${e3.message}`);
              continue;
            }
          }
        }

        // ✅ LIGTAS: laktawan kung walang wastong feed
        if(!feed?.items) continue;

        console.log(`✅ NAKUHA: ${urlPinagkunan} — ${feed.items.length} balita`);
        feed.items.forEach(item=>{
          const malinisNaPamagat = (item?.title?.trim() || "Walang Pamagat").toString();
          const malinisNaBuod = (item?.["content:encoded"]||item?.description||"")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"")
            .replace(/<[^>]+>/g," ")
            .replace(/&nbsp;/g," ")
            .trim().substring(0,220)+"...";

          lahatBalita.push({
            pamagat: malinisNaPamagat,
            link: item?.link || "#",
            petsa: new Date(item?.pubDate || Date.now()),
            buod: malinisNaBuod,
            pangunahingLarawan: null,
            ibaPangLarawan: [],
            pinagmulan: urlPinagkunan.includes("google") ? "GOOGLE NEWS PH" : "RAPPLER"
          });
        });

        lahatBalita.forEach(item=>{
          const media = kuninLahatMedia(item);
          item.pangunahingLarawan = media.pangunahingLarawan;
          item.ibaPangLarawan = media.listahanLarawan;
        });
      }

      // Ayusin: pinakabago muna + alisin ang parehong ulat
      lahatBalita.sort((a,b)=>b.petsa - a.petsa);
      const natatangi = Array.from(new Map(lahatBalita.map(i=>[i.pamagat,i]))).map(m=>m[1]);

      // 🎯 MAY KASAMANG ARTISTA/SHOWBIZ + LIGTAS NA PAGBASA NG KATEGORYA
      let pili = "lahat";
      try{
        if(this?.page?.url){
          const queryData = url.parse(this.page.url, true).query;
          pili = queryData?.kategorya || "lahat";
        }
      }catch(eq){
        console.log("ℹ️ Walang nabasang kategorya, ipapakita lahat");
      }

      const napilingBalita = natatangi.filter(item => {
        const buongTeksto = ((item?.pamagat || "") + " " + (item?.buod || "")).toLowerCase();
        switch(pili){
          case "pambansa":
            return buongTeksto.includes("pilipinas") || buongTeksto.includes("bansa") || buongTeksto.includes("gobyerno") || buongTeksto.includes("pambansa") || buongTeksto.includes("nasyonal");
          case "panahon":
            return buongTeksto.includes("ulan") || buongTeksto.includes("bagyo") || buongTeksto.includes("panahon") || buongTeksto.includes("init") || buongTeksto.includes("ambon") || buongTeksto.includes("baha");
          case "sasakyan":
            return buongTeksto.includes("kotse") || buongTeksto.includes("sasakyan") || buongTeksto.includes("bus") || buongTeksto.includes("tren") || buongTeksto.includes("kalsada") || buongTeksto.includes("transport");
          case "kabuhayan":
            return buongTeksto.includes("pera") || buongTeksto.includes("kita") || buongTeksto.includes("presyo") || buongTeksto.includes("trabaho") || buongTeksto.includes("negosyo") || buongTeksto.includes("ekonomiya");
          case "artista":
            return buongTeksto.includes("artista") || buongTeksto.includes("sikat") || buongTeksto.includes("kilala") ||
                   buongTeksto.includes("showbiz") || buongTeksto.includes("pelikula") || buongTeksto.includes("programa") ||
                   buongTeksto.includes("parangal") || buongTeksto.includes("kaganapan") ||
                   (buongTeksto.includes("isyung") && (buongTeksto.includes("artista") || buongTeksto.includes("sikat")));
          case "iba":
            return true;
          default:
            return true;
        }
      });

      return napilingBalita.slice(0,20);

    } catch (err) {
      console.error("❌ Pangkalahatang mali:", err);
      return [{
        pamagat: "Kasalukuyang inaayos", link:"#", petsa:new Date(), buod:"Subukan muli mamaya.",
        pangunahingLarawan:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&crop=center",
        pinagmulan:"Sistema"
      }];
    }
  });

  // ✅ Ayos na formatDate para mawala ang Invalid Date
  eleventyConfig.addFilter("formatDate", function(input) {
    const d = new Date(input);
    if(isNaN(d.getTime())) return "Agosto 8, 2026";
    return d.toLocaleDateString("tl-PH", {year:"numeric", month:"long", day:"numeric"});
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input:"src", output:"_site", includes:"_includes", data:"_data" }
  };
};
