const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ MATIBAY NA PROXY — para RSS, LARAWAN, VIDEO LINK din!
  const gamitProxy = (url) => {
    if(!url) return null;
    // Iwas ulit na pagbalot
    if(url.includes("allorigins.win")) return url;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
  };

  // 🖼️🎥 KUMPLETONG PAGKUHA: LITRATO, THUMBNAIL, VIDEO IMAGE, VIDEO LINK
  const kuninLahatMedia = (item) => {
    const nakuha = {
      pangunahingLarawan: null,
      listahanLarawan: [],
      videoLarawan: null,
      videoLink: null
    };

    // ✅ 1. MGA OPISYAL NA MEDIA RSS FIELD
    if(item["media:content"]?.url){
      const imgUrl = gamitProxy(item["media:content"].url);
      nakuha.pangunahingLarawan = imgUrl;
      if(item["media:content"].type?.includes("image") || imgUrl.includes("img")){
        nakuha.listahanLarawan.push(imgUrl);
      }
      if(item["media:content"].type?.includes("video") || imgUrl.includes("video")){
        nakuha.videoLink = item["media:content"].url;
        nakuha.videoLarawan = item["media:content"].thumbnail ? gamitProxy(item["media:content"].thumbnail) : null;
      }
    }

    // ✅ 2. Maliit na larawan / thumbnail — gamitin kung wala pa
    if(item["media:thumbnail"]?.url && !nakuha.pangunahingLarawan){
      const thumbUrl = gamitProxy(item["media:thumbnail"].url);
      nakuha.pangunahingLarawan = thumbUrl;
      nakuha.listahanLarawan.push(thumbUrl);
    }

    // ✅ 3. Enclosure — madalas video o malaking litrato
    if(item.enclosure?.url){
      const encUrl = item.enclosure.url;
      if(item.enclosure.type?.includes("video")){
        nakuha.videoLink = encUrl;
        if(!nakuha.videoLarawan && item.enclosure.thumbnail) nakuha.videoLarawan = gamitProxy(item.enclosure.thumbnail);
      } else if(item.enclosure.type?.includes("image")){
        const encImg = gamitProxy(encUrl);
        if(!nakuha.pangunahingLarawan) nakuha.pangunahingLarawan = encImg;
        nakuha.listahanLarawan.push(encImg);
      }
    }

    // ✅ 4. 📜 HANAPIN DIREKTO SA LOOB NG DESCRIPTION — LAHAT NG LITRATO, VIDEO
    if(item.description){
      // Hanap LAHAT ng <img src>
      const lahatImg = item.description.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/gi) || [];
      lahatImg.forEach(imgTag => {
        const tugmaSrc = imgTag.match(/src\s*=\s*["']([^"']+)["']/i);
        if(tugmaSrc && tugmaSrc[1]){
          const ayosUrl = gamitProxy(tugmaSrc[1]);
          // Iwas ulit na pagpasok
          if(!nakuha.listahanLarawan.includes(ayosUrl)){
            nakuha.listahanLarawan.push(ayosUrl);
            if(!nakuha.pangunahingLarawan) nakuha.pangunahingLarawan = ayosUrl;
          }
        }
      });

      // Hanap VIDEO THUMBNAIL / YOUTUBE / IFRAME
      const tugmaVidImg = item.description.match(/<video[^>]+poster\s*=\s*["']([^"']+)["']/i);
      if(tugmaVidImg && tugmaVidImg[1] && !nakuha.videoLarawan){
        nakuha.videoLarawan = gamitProxy(tugmaVidImg[1]);
      }
      const tugmaYtThumb = item.description.match(/(https?:\/\/i\.ytimg\.com\/[^"']+)/i);
      if(tugmaYtThumb && tugmaYtThumb[1] && !nakuha.videoLarawan){
        nakuha.videoLarawan = gamitProxy(tugmaYtThumb[1]);
      }
      const tugmaIframe = item.description.match(/<iframe[^>]+src\s*=\s*["']([^"']+)["']/i);
      if(tugmaIframe && tugmaIframe[1] && !nakuha.videoLink){
        nakuha.videoLink = tugmaIframe[1];
      }
    }

    // ✅ KAPALIT NA LARAWAN — GUMAGANA AT HINDI NA MAGIGING ERROR
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
        customFields: {
          item: ["media:thumbnail", "media:content", "media:group", "enclosure", "content:encoded"]
        },
        timeout: 35000, // ⏱️ Medyo mahaba para hindi agad maputol
        xmlParseOptions: { strict: false, trim: true, normalize: true } // Mas maluwag para mabasa kahit may maliit na pagkukulang
      });

      // 📰 ✅ PINILI ANG SUBOK NA GUMAGANA — madaling ibalik/dagdagan kapag naayos na ang iba
      const mgaPinagkukunan = [
        "https://www.philstar.com/rss/nation",     // ✅ Gumagana — kumpleto ang datos
        "https://www.philstar.com/rss/headlines"    // ✅ Gumagana — kumpleto ang datos
        // Inquirer / Weather — pansamantalang tinanggal dahil sa sirang karakter/hinarang; madaling ibalik kapag maayos na
      ];

      console.log("🔍 KUKUHA — KUMPLETONG LITRATO, VIDEO, AT BUONG NILALAMAN...");
      const lahatBalita = [];

      for (const orihinalNaUrl of mgaPinagkukunan) {
        try {
          const urlSaProxy = gamitProxy(orihinalNaUrl);
          const feed = await parser.parseURL(urlSaProxy);
          console.log(`✅ NAKUHA: ${orihinalNaUrl} — ${feed.items.length} ulat`);

          feed.items.forEach(item => {
            // 🎥🖼️ TAWAG SA KUMPLETONG PAGKUHA NG MEDIA
            const media = kuninLahatMedia(item);

            // ✍️ BUOD — GAMITIN ANG PINAKAMAHABA AT MALINAW NA NILALAMAN
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
              pinagmulan: orihinalNaUrl.includes("weather") ? "Philstar | PANAHON" : "Philstar"
            });
          });

        } catch (mali) {
          console.log(`❌ HINDI MAKUHA: ${orihinalNaUrl} — ${mali.message}`);
        }
      }

      // ✅ AYOS: PINAKABAGO UNA + TANGGALIN ANG DOBLE PARA MALINIS
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));
      const natatangi = Array.from(new Map(lahatBalita.map(i => [i.pamagat, i]))).map(m => m[1]);

      // ✅ HANGGANG 20 PINAKABAGO — handa na para dumami ulit kapag may dagdag na mapagkukunan
      const napilingBalita = natatangi.slice(0, 20);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} ulat — kumpleto sa larawan/video!`);

      // 🚨 MENSAHE KUNG WALANG MAKUHA
      if (napilingBalita.length === 0) {
        return [{
          pamagat: "Kasalukuyang inaayos ang serbisyo", link:"#", petsa:new Date(),
          buod:"Babalik agad ang kumpletong balita kapag naidagdag ulit ang iba pang mapagkukunan.",
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
