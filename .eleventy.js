const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ DALAWANG URI NG PROXY — KUNG HINDI GUMANA ANG UNA, KUSANG SUSUBOK ANG PANGALAWA!
  const gamitProxy = (url) => {
    if(!url) return null;
    if(url.includes("allorigins.win") || url.includes("corsproxy.io")) return url;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
  };
  const altProxy = (url) => {
    if(!url) return null;
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  };

  // 🖼️🎥 KUMPLETONG PAGKUHA NG LITRATO, VIDEO, MAY SIGURADONG KAPALIT
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null,
      listahanLarawan: [],
      videoLarawan: null,
      videoLink: null
    };

    if(item["media:content"]?.url){
      const imgUrl = gamitProxy(item["media:content"].url);
      nakuha.pangunahingLarawan = imgUrl;
      if(item["media:content"].type?.includes("image")) nakuha.listahanLarawan.push(imgUrl);
      if(item["media:content"].type?.includes("video")){
        nakuha.videoLink = item["media:content"].url;
        nakuha.videoLarawan = item["media:content"].thumbnail ? gamitProxy(item["media:content"].thumbnail) : null;
      }
    }
    if(item["media:thumbnail"]?.url && !nakuha.pangunahingLarawan){
      const thumbUrl = gamitProxy(item["media:thumbnail"].url);
      nakuha.pangunahingLarawan = thumbUrl;
      nakuha.listahanLarawan.push(thumbUrl);
    }
    if(item.description){
      const tugmaImg = item.description.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
      if(tugmaImg?.[1] && !nakuha.pangunahingLarawan){
        nakuha.pangunahingLarawan = gamitProxy(tugmaImg[1]);
      }
      const tugmaVidImg = item.description.match(/<video[^>]+poster\s*=\s*["']([^"']+)["']/i);
      if(tugmaVidImg?.[1] && !nakuha.videoLarawan) nakuha.videoLarawan = gamitProxy(tugmaVidImg[1]);
      const tugmaYt = item.description.match(/(https?:\/\/i\.ytimg\.com\/[^"']+)/i);
      if(tugmaYt?.[1] && !nakuha.videoLarawan) nakuha.videoLarawan = gamitProxy(tugmaYt[1]);
      const tugmaIframe = item.description.match(/<iframe[^>]+src\s*=\s*["']([^"']+)["']/i);
      if(tugmaIframe?.[1] && !nakuha.videoLink) nakuha.videoLink = tugmaIframe[1];
    }

    // ✅ KAPALIT NA LITRATO — GUMAGANA AT MAGANDA
    if(!nakuha.pangunahingLarawan || nakuha.pangunahingLarawan === "null" || nakuha.pangunahingLarawan === "undefined"){
      nakuha.pangunahingLarawan = "https://via.placeholder.com/600x340/1a73e8/ffffff?text=Balita+Ngayon&font=Roboto";
    }
    if(nakuha.videoLarawan && !nakuha.pangunahingLarawan) nakuha.pangunahingLarawan = nakuha.videoLarawan;
    return nakuha;
  };

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "tl-PH,tl;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          "Referer": "https://google.com/"
        },
        customFields: { item: ["media:thumbnail", "media:content", "media:group", "enclosure", "content:encoded"] },
        timeout: 40000,
        xmlParseOptions: { strict: false, trim: true, normalize: true }
      });

      // 📰 ✅ PINAGSAMA: DATI NANG GUMAGANA + MGA BAGONG SUBOK AT MATATAG!
      const mgaPinagkukunan = [
        "https://www.philstar.com/rss/headlines",
        "https://mb.com.ph/rss",
        "https://www.pna.gov.ph/rss/national",
        "https://www.sunstar.com.ph/rss/nation",
        "https://www.bworldonline.com/rss/news/national/",
        "https://www.manilatimes.net/rss/national-news/"
      ];

      console.log("🔍 KUKUHA — MARAMING PINAGKUKUNAN, MAY DALAWANG URI NG PROXY...");
      const lahatBalita = [];

      for (const orihinalNaUrl of mgaPinagkukunan) {
        let feed = null;
        try {
          // Subok una gamit pangunahing proxy
          feed = await parser.parseURL(gamitProxy(orihinalNaUrl));
        } catch(e){
          try{
            // ❌ Nabigo → kusang lumipat sa pangalawang proxy
            console.log(`🔁 Lumipat alternatibong proxy para sa: ${orihinalNaUrl}`);
            feed = await parser.parseURL(altProxy(orihinalNaUrl));
          } catch(e2){
            console.log(`❌ HINDI MAKUHA: ${orihinalNaUrl} — ${e2.message}`);
            continue;
          }
        }

        console.log(`✅ NAKUHA: ${orihinalNaUrl} — ${feed.items.length} ulat`);
        feed.items.forEach(item => {
          const media = kuninLahatMedia(item);
          const buongNilalaman = item["content:encoded"] || item.content || item.description || "";
          const malinisNaBuod = buongNilalaman
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g," ").trim();

          lahatBalita.push({
            pamagat: item.title?.trim() || "Walang Pamagat",
            link: item.link || "#",
            petsa: item.pubDate || new Date(),
            buod: malinisNaBuod.substring(0,220)+"...",
            buongKwento: malinisNaBuod,
            pangunahingLarawan: media.pangunahingLarawan,
            ibaPangLarawan: media.listahanLarawan,
            videoLarawan: media.videoLarawan,
            videoLink: media.videoLink,
            pinagmulan: orihinalNaUrl.includes("philstar") ? "Philstar" :
                       orihinalNaUrl.includes("mb.com.ph") ? "Manila Bulletin" :
                       orihinalNaUrl.includes("pna.gov.ph") ? "PNA | Gobyerno" :
                       orihinalNaUrl.includes("sunstar") ? "SunStar" :
                       orihinalNaUrl.includes("bworldonline") ? "BusinessWorld" : "Manila Times"
          });
        });
      }

      // ✅ AYOS: PINAKABAGO UNA + TANGGALIN ANG DOBLE PARA HINDI ULIT-ULIT
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));
      const natatangi = Array.from(new Map(lahatBalita.map(i => [i.pamagat, i]))).map(m => m[1]);

      // ✅ 🎯 HANGGANG **20** PINAKABAGO — TUMPAK SA HILING MO!
      const napilingBalita = natatangi.slice(0, 20);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} ulat — mula sa iba't ibang pahayagan!`);

      // 🚨 MENSAHE KUNG WALANG MAKUHA
      if (napilingBalita.length === 0) {
        return [{
          pamagat: "Kasalukuyang inaayos ang serbisyo", link:"#", petsa:new Date(),
          buod:"Babalik agad ang maraming balita kapag maayos na ang koneksyon.",
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

  // 📅 PETSA — NAKASULAT SA WIKANG FILIPINO
  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {year:"numeric", month:"long", day:"numeric"});
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input:"src", output:"_site", includes:"_includes", data:"_data" }
  };
};
