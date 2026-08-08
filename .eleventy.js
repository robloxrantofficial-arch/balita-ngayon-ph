const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ DALAWANG URI NG PROXY — KUNG HINDI GUMANA ANG UNA, SUSUBOK ANG PANGALAWA
  const gamitProxy = (url) => {
    if(!url) return null;
    // Huwag ulit balutin kung naka-proxy na
    if(url.includes("allorigins.win") || url.includes("corsproxy.io")) return url;
    // Pangunahin muna
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
  };
  const altProxy = (url) => {
    if(!url) return null;
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  };

  // 🖼️🎥 KUMPLETONG PAGKUHA NG MEDIA
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null,
      listahanLarawan: [],
      videoLarawan: null,
      videoLink: null
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
      if(tugmaImg?.[1] && !nakuha.pangunahingLarawan){
        nakuha.pangunahingLarawan = gamitProxy(tugmaImg[1]);
      }
    }
    // ✅ Siguradong may kapalit na gumaganang larawan
    if(!nakuha.pangunahingLarawan || nakuha.pangunahingLarawan.length <10){
      nakuha.pangunahingLarawan = "https://via.placeholder.com/600x340/1a73e8/ffffff?text=Balita+Ngayon&font=Roboto";
    }
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
        customFields: { item: ["media:thumbnail", "media:content", "enclosure", "content:encoded"] },
        timeout: 40000, // ⏱️ Mas mahabang oras maghintay
        xmlParseOptions: { strict: false, trim: true, normalize: true }
      });

      // 📰 MGA MAPAGKUKUNAN — sinubukan muli + dagdag ibang maaasahan
      const mgaPinagkukunan = [
        "https://www.philstar.com/rss/nation",
        "https://www.philstar.com/rss/headlines",
        "https://newsinfo.inquirer.net/rss/national"
      ];

      console.log("🔍 KUKUHA — SUSUBOK MAY PAGKAKULANG GAMIT DALAWANG URI NG PROXY...");
      const lahatBalita = [];

      for (const orihinalNaUrl of mgaPinagkukunan) {
        let feed = null;
        try {
          // Unang subok gamit pangunahing proxy
          feed = await parser.parseURL(gamitProxy(orihinalNaUrl));
        } catch(e){
          try{
            // ❌ Nabigo → subok ulit gamit pangalawang proxy
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
          const malinisNaBuod = buongNilalaman.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"")
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
            pinagmulan: orihinalNaUrl.includes("philstar") ? "Philstar" : "Inquirer"
          });
        });
      }

      // ✅ Ayos: pinakabago una + tanggal dobleng ulat
      lahatBalita.sort((a,b)=>new Date(b.petsa)-new Date(a.petsa));
      const natatangi = Array.from(new Map(lahatBalita.map(i=>[i.pamagat,i]))).map(m=>m[1]);
      const napilingBalita = natatangi.slice(0,20);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} ulat`);

      // 🚨 Kapag wala pa ring makuha — malinaw na mensahe
      if(napilingBalita.length ===0){
        return [{
          pamagat: "Kasalukuyang nahaharangan ang pagkuha ng balita",
          link:"#", petsa:new Date(),
          buod:"Ang mga panlabas na koneksyon ay pansamantalang naharang. Magbabalik kapag maayos na ang koneksyon o mapapalitan ang pinagkukunan.",
          pangunahingLarawan:"https://via.placeholder.com/600x340/f57c00/ffffff?text=Nag-aayos+Pa",
          pinagmulan:"Sistema"
        }];
      }
      return napilingBalita;

    } catch (malakiAngMali) {
      console.error("❌ PANGKALAHATANG PAGKAMALI:", malakiAngMali.message);
      return [{
        pamagat:"May pansamantalang aberya sa pagkuha ng datos",
        link:"#", petsa:new Date(),
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
