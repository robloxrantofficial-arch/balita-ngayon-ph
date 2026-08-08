const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ DALAWANG URI NG PROXY — huling paraan kapag hindi direkta makapasok
  const gamitProxy = (url) => {
    if(!url) return null;
    if(url.includes("allorigins.win") || url.includes("corsproxy.io")) return url;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
  };
  const altProxy = (url) => {
    if(!url) return null;
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  };

  // ⏱️ MAIKLI NA PAGHIHINTAY — para hindi biglang sunod-sunod na parang bot
  const antala = (ms) => new Promise(res => setTimeout(res, ms));

  // 🖼️🎥 KUMPLETONG PAGKUHA NG MEDIA + SIGURADONG KAPALIT NA LARAWAN
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null, listahanLarawan: [],
      videoLarawan: null, videoLink: null
    };
    if(item["media:content"]?.url){
      nakuha.pangunahingLarawan = gamitProxy(item["media:content"].url);
      if(item["media:content"].type?.includes("image")) nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
      if(item["media:content"].type?.includes("video")){
        nakuha.videoLink = item["media:content"].url;
        nakuha.videoLarawan = item["media:content"].thumbnail ? gamitProxy(item["media:content"].thumbnail) : null;
      }
    }
    if(item["media:thumbnail"]?.url && !nakuha.pangunahingLarawan){
      nakuha.pangunahingLarawan = gamitProxy(item["media:thumbnail"].url);
      nakuha.listahanLarawan.push(nakuha.pangunahingLarawan);
    }
    if(item.description){
      const tugmaImg = item.description.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
      if(tugmaImg?.[1] && !nakuha.pangunahingLarawan) nakuha.pangunahingLarawan = gamitProxy(tugmaImg[1]);
    }
    // ✅ Kapalit na maayos na larawan
    if(!nakuha.pangunahingLarawan || nakuha.pangunahingLarawan.length < 15){
      nakuha.pangunahingLarawan = "https://via.placeholder.com/600x340/1a73e8/ffffff?text=Balita+Ngayon&font=Roboto";
    }
    return nakuha;
  };

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "tl-PH,tl;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          "Referer": "https://www.google.com.ph/"
        },
        customFields: { item: ["media:thumbnail", "media:content", "content:encoded"] },
        timeout: 45000,
        xmlParseOptions: { strict: false, trim: true, normalize: true }
      });

      // 📰 MGA BAGONG PINAGKUKUNAN — mas bukas at hindi agad nagbibigay ng 403
      const mgaPinagkukunan = [
        "https://news.google.com/rss?hl=tl&gl=PH&ceid=PH:tl",
        "https://news.google.com/rss?hl=en&gl=PH&ceid=PH:en",
        "https://www.rappler.com/rss",
        "https://nabc.com.ph/feed/",
        "https://www.doh.gov.ph/rss/all",
        "https://www.dpwh.gov.ph/dpwh/rss"
      ];

      console.log("🔍 SINUSUBUKAN — MAS MAINGAT NA PAGKUHA...");
      const lahatBalita = [];

      for (const orihinalNaUrl of mgaPinagkukunan) {
        await antala(1200); // ⏱️ maghintay ng 1.2 segundo bawat isa para hindi magmukhang bot
        let feed = null;
        try {
          feed = await parser.parseURL(orihinalNaUrl); // direkta muna
        } catch(e){
          try {
            console.log(`🔁 Gamit proxy para sa: ${orihinalNaUrl}`);
            feed = await parser.parseURL(gamitProxy(orihinalNaUrl));
          } catch(e2){
            try {
              feed = await parser.parseURL(altProxy(orihinalNaUrl));
            } catch(e3){
              console.log(`❌ HINDI MAKUHA: ${orihinalNaUrl} — ${e3.message}`);
              continue;
            }
          }
        }

        console.log(`✅ NAKUHA: ${orihinalNaUrl} — ${feed.items.length} ulat`);
        feed.items.forEach(item => {
          const media = kuninLahatMedia(item);
          const malinisNaBuod = (item["content:encoded"] || item.content || item.description || "")
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"")
                .replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();

          lahatBalita.push({
            pamagat: item.title?.trim() || "Walang Pamagat",
            link: item.link || "#",
            petsa: item.pubDate || new Date(),
            buod: malinisNaBuod.substring(0,220)+"...",
            pangunahingLarawan: media.pangunahingLarawan,
            videoLarawan: media.videoLarawan,
            videoLink: media.videoLink,
            pinagmulan: orihinalNaUrl.includes("google") ? "Google News PH" :
                       orihinalNaUrl.includes("rappler") ? "Rappler" :
                       orihinalNaUrl.includes("doh.gov.ph") ? "DOH" :
                       orihinalNaUrl.includes("dpwh.gov.ph") ? "DPWH" : "Lokal na Balita"
          });
        });
      }

      // ✅ Ayos: pinakabago muna + alis ng parehong ulat
      lahatBalita.sort((a,b)=>new Date(b.petsa)-new Date(a.petsa));
      const natatangi = Array.from(new Map(lahatBalita.map(i=>[i.pamagat,i]))).map(m=>m[1]);
      const napilingBalita = natatangi.slice(0,20);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} ulat`);

      if(napilingBalita.length === 0){
        return [{
          pamagat: "Kasalukuyang hinihigpitan ang panlabas na pagkuha",
          link:"#", petsa:new Date(),
          buod:"Patuloy na naghahanap ng ibang paraan at bukas na pinagkukunan. Balik muli mamaya.",
          pangunahingLarawan:"https://via.placeholder.com/600x340/f57c00/ffffff?text=Nag-aayos+Pa",
          pinagmulan:"Sistema"
        }];
      }
      return napilingBalita;

    } catch (malakiAngMali) {
      console.error("❌ PANGKALAHATANG PAGKAMALI:", malakiAngMali.message);
      return [{
        pamagat:"May pansamantalang aberya", link:"#", petsa:new Date(),
        buod:"Mangyaring subukang muli mamaya.",
        pangunahingLarawan:"https://via.placeholder.com/600x340/d32f2f/ffffff?text=Subukan+Muli",
        pinagmulan:"Paalala"
      }];
    }
  });

  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {year:"numeric", month:"long", day:"numeric"});
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input:"src", output:"_site", includes:"_includes", data:"_data" }
  };
};
