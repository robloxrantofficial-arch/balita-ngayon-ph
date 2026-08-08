const Parser = require("rss-parser");
require("isomorphic-fetch");
const url = require('url'); // ✅ DINAGDAG: kailangan para mabasa ang query

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ PROXY para mabasa ang mga litrato na hinarang sa ibang pinagmulan
  const gamitProxy = (url) => {
    if(!url) return null;
    if(url.startsWith("data:") || url.includes("allorigins.win") || url.includes("corsproxy.io")) return url;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  };

  // 🖼️ PINAKAMATATAG NA PAGKUHA NG LARAWAN — Sinusuri LAHAT ng posibleng lokasyon
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null,
      listahanLarawan: [],
      videoLarawan: null,
      videoLink: null
    };

    // 1. Direktang media:content
    if(item["media:content"]){
      const mc = Array.isArray(item["media:content"]) ? item["media:content"] : [item["media:content"]];
      for(const m of mc){
        if(m.url && m.type?.startsWith("image/")){
          nakuha.pangunahingLarawan = gamitProxy(m.url);
          nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
          break;
        }
      }
    }

    // 2. media:thumbnail kung wala pa
    if(!nakuha.pangunahingLarawan && item["media:thumbnail"]?.url){
      nakuha.pangunahingLarawan = gamitProxy(item["media:thumbnail"].url);
      nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
    }

    // 3. Hanapin sa loob ng description/content:encoded gamit pagtutugma
    if(!nakuha.pangunahingLarawan){
      const buongTeksto = item["content:encoded"] || item.content || item.description || "";
      const tugmaLahatImg = buongTeksto.matchAll(/<img[^>]+src\s*=\s*["']([^"']+\.(jpg|jpeg|png|webp))["']/gi);
      const mgaImg = Array.from(tugmaLahatImg, m=>m[1]);
      if(mgaImg.length > 0){
        nakuha.pangunahingLarawan = gamitProxy(mgaImg[0]);
        nakuha.listahanLarawan = mgaImg.slice(1,4).map(u=>gamitProxy(u));
      }
    }

    // ✅ KAPALIT NA MAGANDANG LARAWAN — HINDI NA BLANGKO!
    if(!nakuha.pangunahingLarawan || nakuha.pangunahingLarawan.length < 15){
      nakuha.pangunahingLarawan = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop";
    }

    return nakuha;
  };

  // ⏱️ Maikling paghihintay para hindi harangan
  const antala = ms => new Promise(r=>setTimeout(r,ms));

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
        try{
          const feed = await parser.parseURL(urlPinagkunan);
          feed.items.forEach(item=>{
            const media = kuninLahatMedia(item);
            const malinisNaBuod = (item["content:encoded"]||item.description||"")
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")
              .replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").trim();

            lahatBalita.push({
              pamagat: item.title?.trim() || "Walang Pamagat",
              link: item.link || "#",
              petsa: new Date(item.pubDate || Date.now()),
              buod: malinisNaBuod.substring(0,220)+"...",
              pangunahingLarawan: media.pangunahingLarawan,
              ibaPangLarawan: media.listahanLarawan,
              pinagmulan: urlPinagkunan.includes("google") ? "GOOGLE NEWS PH" : "RAPPLER"
            });
          });
          console.log(`✅ NAKUHA: ${urlPinagkunan} — ${feed.items.length} balita`);
        }catch(e){
          console.log(`⚠️ Hindi makapasok: ${urlPinagkunan} — ${e.message}`);
          continue;
        }
      }

      // Ayos: pinakabago muna + alis ng parehong ulat
      lahatBalita.sort((a,b)=>b.petsa - a.petsa);
      const natatangi = Array.from(new Map(lahatBalita.map(i=>[i.pamagat,i]))).map(m=>m[1]);

      // 🎯 DITO NA INILAGAY — PAGSALA NG BALITA AYON SA NAPILING KATEGORYA ✅
      const queryData = url.parse(this.page.url, true).query;
      const pili = queryData.kategorya || "lahat";

      const napilingBalita = natatangi.filter(item => {
        const buongTeksto = (item.pamagat + " " + item.buod).toLowerCase();
        switch(pili){
          case "pambansa":
            return buongTeksto.includes("pilipinas") || buongTeksto.includes("bansa") || buongTeksto.includes("gobyerno") || buongTeksto.includes("pambansa") || buongTeksto.includes("nasyonal");
          case "panahon":
            return buongTeksto.includes("ulan") || buongTeksto.includes("bagyo") || buongTeksto.includes("panahon") || buongTeksto.includes("init") || buongTeksto.includes("ambon") || buongTeksto.includes("baha");
          case "sasakyan":
            return buongTeksto.includes("kotse") || buongTeksto.includes("sasakyan") || buongTeksto.includes("bus") || buongTeksto.includes("tren") || buongTeksto.includes("kalsada") || buongTeksto.includes("transport");
          case "kabuhayan":
            return buongTeksto.includes("pera") || buongTeksto.includes("kita") || buongTeksto.includes("presyo") || buongTeksto.includes("trabaho") || buongTeksto.includes("negosyo") || buongTeksto.includes("ekonomiya");
          case "iba":
            return true;
          default:
            return true; // Ipakita LAHAT kapag walang pinili
        }
      });

      // Gamitin ang nasala: hanggang 20 ulat lamang
      return napilingBalita.slice(0,20);
      // ----------------------------------------------------------

    } catch (err) {
      console.error("❌ Pangkalahatang mali:", err);
      return [{
        pamagat: "Kasalukuyang inaayos", link:"#", petsa:new Date(), buod:"Subukan muli mamaya.",
        pangunahingLarawan:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
        pinagmulan:"Sistema"
      }];
    }
  });

  // ✅ Ayos na formatDate para mawala ang Invalid Date
  eleventyConfig.addFilter("formatDate", function(input) {
    const d = new Date(input);
    if(isNaN(d.getTime())) return "Agosto 8, 2026"; // Ligtas na halaga kung mali ang petsa
    return d.toLocaleDateString("tl-PH", {year:"numeric", month:"long", day:"numeric"});
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input:"src", output:"_site", includes:"_includes", data:"_data" }
  };
};
