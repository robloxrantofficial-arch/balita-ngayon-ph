const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛡️ PINAKAMATIBAY NA PROXY — may dagdag na para tanggapin kahit magulo ang datos
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
        timeout: 30000, // ⏱️ 30 segundo — sapat na mahaba para hindi maputol agad
        xmlParseOptions: {
          strict: false, // ✅ PINAKAMAHALAGA — HINDI HIHINTO kahit may maliit na sirang simbolo/tag
          trim: true,
          normalize: true
        }
      });

      // 📰 ✅ BAGO AT SINUBUKANG RSS — INALIS ANG MGA HINDI NA GUMAGANA, DINAGDAGAN NG BAGO
      const mgaPinagkukunan = [
        "https://www.manilatimes.net/rss/news/national",   // 🆕 Manila Times — matatag
        "https://mb.com.ph/rss",                             // 🆕 Manila Bulletin — mabilis
        "https://www.philstar.com/rss/nation"               // 🆕 Philstar — tiyak na gumagana
      ];

      console.log("🔍 KUKUHA NG BALITA MULA SA MGA BAGONG PINAGKUKUNAN...");

      // 🖼️ KUHA NG LARAWAN + TIYAK NA MAY KAPALIT
      const kuninLarawan = (item) => {
        if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
        if (item["media:content"]?.url) return item["media:content"].url;
        if (item.enclosure?.url) return item.enclosure.url;
        if (item.thumbnail) return item.thumbnail;
        if (item.description) {
          const tugma = item.description.match(/<img[^>]+src="([^"]+)"/);
          if (tugma && tugma[1]) return tugma[1];
        }
        return "https://via.placeholder.com/420x240/2c3e50/ffffff?text=Walang+Larawan";
      };

      const lahatBalita = [];

      // 📦 KUHA — MAY DETALYADONG ULAT KUNG BAKIT NABIGO
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
              buod: (item.contentSnippet || item.description || "Walang maibibigay na buod...")
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 130) + "...",
              larawan: kuninLarawan(item),
              pinagmulan: orihinalNaUrl.includes("manilatimes") ? "Manila Times" 
                        : orihinalNaUrl.includes("mb.com.ph") ? "Manila Bulletin" 
                        : "Philstar"
            });
          });

        } catch (mali) {
          console.log(`❌ HINDI MAKUHA: ${orihinalNaUrl}`);
          console.log(`   → DAHILAN: ${mali.message}`);
        }
      }

      // ✅ AYUSIN: PINAKABAGO UNA
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));

      // 🧪 KUNG WALA TALAGA — HINDI BLANGKO, MAY MAAYOS NA MENSAHE
      if (lahatBalita.length === 0) {
        console.log("ℹ️ PAALALA: Wala pang nakuhang balita — pansamantalang ulat muna");
        lahatBalita.push(
          {
            pamagat: "Kasalukuyang inaayos ang pagkuha ng mga ulat",
            link: "#",
            petsa: new Date(),
            buod: "Patuloy na sinusubukan ang iba pang mapagkukunan. Babalik agad ang totoong balita kapag maayos na.",
            larawan: "https://via.placeholder.com/420x240/3498db/ffffff?text=Nag-aayos+Pa",
            pinagmulan: "Sistema"
          },
          {
            pamagat: "Manatiling nakatutok",
            link: "#",
            petsa: new Date(Date.now() - 7200000),
            buod: "Sinisiguro naming magiging matatag at tuloy-tuloy ang pagpapakita ng napapanahong balita.",
            larawan: "https://via.placeholder.com/420x240/2ecc71/ffffff?text=Malapit+Na",
            pinagmulan: "Sistema"
          }
        );
      }

      // ✅ IPAPAKITA ANG UNANG 8 PINAKABAGO
      const napilingBalita = lahatBalita.slice(0, 8);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} balita`);
      return napilingBalita;

    } catch (malakiAngMali) {
      console.error("❌ PANGKALAHATANG PAGKAMALI:", malakiAngMali.message);
      return [{
        pamagat: "May pansamantalang aberya",
        link: "#",
        petsa: new Date(),
        buod: "Mangyaring subukang muli mamaya. Salamat sa pag-unawa.",
        larawan: "https://via.placeholder.com/420x240/e74c3c/ffffff?text=Subukan+Muli",
        pinagmulan: "Paalala"
      }];
    }
  });

  // 📅 PETSA — TAGALOG NA PAGPAPAKITA
  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // ⚙️ AYOS NG ELEVENTY — TAMA SA VERCEL
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
