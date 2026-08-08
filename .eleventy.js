const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ MATIBAY NA PROXY
  const gamitProxy = (url) => {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
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
          item: ["media:thumbnail", "media:content", "enclosure"]
        },
        timeout: 30000,
        xmlParseOptions: { strict: false, trim: true, normalize: true }
      });

      // 📰 ✅ PINAGANDA: NANANATILING GUMAGANA + DAGDAG PA NG ISA
      const mgaPinagkukunan = [
        "https://www.philstar.com/rss/nation",               // ✅ GUMAGANA NA!
        "https://www.philstar.com/rss/headlines",            // 🆕 DAGDAG — mas marami pang bago
        "https://mb.com.ph/rss"
      ];

      console.log("🔍 KUKUHA NG BALITA...");

      // 🖼️ PINAKAMATIBAY NA PAGKUHA NG LARAWAN — SIGURADONG MAY LITRATO
      const kuninLarawan = (item) => {
        if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
        if (item["media:content"]?.url) return item["media:content"].url;
        if (item.enclosure?.url) return item.enclosure.url;
        if (item.thumbnail) return item.thumbnail;
        if (item.description) {
          const tugma = item.description.match(/<img[^>]+src="([^"]+)"/);
          if (tugma && tugma[1]) return tugma[1];
        }
        // 📸 TIYAK NA MAY LITRATO NA MAGANDA KUNG WALA
        return "https://via.placeholder.com/420x240/1a73e8/ffffff?text=Balita+Ngayon";
      };

      const lahatBalita = [];

      for (const orihinalNaUrl of mgaPinagkukunan) {
        try {
          const urlSaProxy = gamitProxy(orihinalNaUrl);
          const feed = await parser.parseURL(urlSaProxy);
          console.log(`✅ NAKUHA: ${orihinalNaUrl} — ${feed.items.length} balita`);

          feed.items.forEach(item => {
            lahatBalita.push({
              pamagat: item.title?.trim() || "Walang Pamagat",
              link: item.link || "#",
              petsa: item.pubDate || new Date(),
              buod: (item.contentSnippet || item.description || "Tingnan ang buong ulat...")
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 130) + "...",
              larawan: kuninLarawan(item),
              pinagmulan: orihinalNaUrl.includes("philstar") ? "Philstar" : "Manila Bulletin"
            });
          });

        } catch (mali) {
          console.log(`❌ HINDI MAKUHA: ${orihinalNaUrl} — ${mali.message}`);
        }
      }

      // ✅ AYOS: PINAKABAGO UNA + TANGGALIN ANG DOBLE
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));
      const natatangi = Array.from(new Map(lahatBalita.map(i => [i.pamagat, i]))).map(m => m[1]);

      // ✅ KUNIN ANG UNANG 8 PINAKABAGO
      const napilingBalita = natatangi.slice(0, 8);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} balita`);

      // 🚨 KUNG KAHIT NGAYON AY WALA PA RIN — MAGBALIK NG MENSAHE HINDI BLANGKO
      if (napilingBalita.length === 0) {
        return [{
          pamagat: "Kasalukuyang inaayos ang serbisyo",
          link: "#",
          petsa: new Date(),
          buod: "Sinusubukang muli ang pagkuha ng mga ulat. Babalik agad ang balita.",
          larawan: "https://via.placeholder.com/420x240/f57c00/ffffff?text=Nag-aayos+Pa",
          pinagmulan: "Sistema"
        }];
      }

      return napilingBalita;

    } catch (malakiAngMali) {
      console.error("❌ PANGKALAHATANG PAGKAMALI:", malakiAngMali.message);
      return [{
        pamagat: "May pansamantalang aberya",
        link: "#",
        petsa: new Date(),
        buod: "Mangyaring subukang muli mamaya.",
        larawan: "https://via.placeholder.com/420x240/d32f2f/ffffff?text=Subukan+Muli",
        pinagmulan: "Paalala"
      }];
    }
  });

  // 📅 PETSA — TAGALOG
  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" }
  };
};
