const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  // 🛠️ GAMITIN ANG PROXY PARA HINDI MAHARANG NG CORS/SERVER
  const gamitProxy = (url) => {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  };

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8"
        },
        customFields: {
          item: ["media:thumbnail", "media:content", "enclosure"]
        },
        timeout: 15000 // ⏱️ Mas mahabang oras ng paghihintay
      });

      // 📰 TATLONG PINAGKUKUNAN NG BALITA (mas tamang mga link)
      const mgaPinagkukunan = [
        "https://www.gmanetwork.com/news/rss/",
        "https://newsinfo.inquirer.net/rss",
        "https://www.rappler.com/rss/news/nation/"
      ];

      console.log("🔍 KUKUHA NG BALITA MULA SA 3 PINAGKUKUNAN...");

      // 🖼️ HANAPIN ANG LARAWAN — MAY KAPALIT KUNG WALA
      const kuninLarawan = (item) => {
        if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
        if (item["media:content"]?.url) return item["media:content"].url;
        if (item.enclosure?.url) return item.enclosure.url;
        if (item.thumbnail) return item.thumbnail;
        if (item.description) {
          const tugma = item.description.match(/<img[^>]+src="([^"]+)"/);
          if (tugma && tugma[1]) return tugma[1];
        }
        // 🖼️ LARAWAN NA KAPALIT KUNG WALANG NAKUHA
        return "https://via.placeholder.com/420x240/2c3e50/ffffff?text=Walang+Larawan";
      };

      const lahatBalita = [];

      // 📦 KUKUHA SA LAHAT — MAY MABUTING PAGHAHABOL NG PAGKAMALI
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
                      .replace(/<[^>]*>/g, "") // ⚪ Tanggalin ang mga tag na HTML
                      .substring(0, 130) + "...",
              larawan: kuninLarawan(item),
              pinagmulan: orihinalNaUrl.includes("gmanet") ? "GMA News" 
                        : orihinalNaUrl.includes("inquirer") ? "Inquirer" 
                        : "Rappler"
            });
          });

        } catch (mali) {
          console.log(`⚠️ HINDI MAKUHA MULA SA: ${orihinalNaUrl}`);
          console.log(`   → Dahilan: ${mali.message}`);
        }
      }

      // ✅ AYUSIN: PINAKABAGONG BALITA UNA
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));

      // 🧪 KUNG WALANG NAKUHA TALAGA — MAGLAGAY NG MGA HALIMBAWA HINDI BLANGKO
      if (lahatBalita.length === 0) {
        console.log("ℹ️ WALANG BALITANG NAKUHA — nagdagdag ng halimbawa habang inaayos");
        lahatBalita.push(
          {
            pamagat: "Kasalukuyang inaayos ang pagkuha ng balita",
            link: "#",
            petsa: new Date(),
            buod: "Maaaring pansamantalang hindi maabot ang mga pinagkukunan. Babalik agad ang totoong balita kapag maayos na.",
            larawan: "https://via.placeholder.com/420x240/3498db/ffffff?text=Pansamantalang+Balita",
            pinagmulan: "Paghahanda"
          },
          {
            pamagat: "Patuloy na pagpapabuti ng serbisyo",
            link: "#",
            petsa: new Date(Date.now() - 7200000),
            buod: "Sinusubukang gawing mas mabilis at matatag ang pagpapakita ng mga napapanahong ulat.",
            larawan: "https://via.placeholder.com/420x240/2ecc71/ffffff?text=Maghihintay+Sandali",
            pinagmulan: "Paghahanda"
          }
        );
      }

      // ✅ KUNIN ANG PINAKA-UNA NA 8 PINAKABAGO
      const napilingBalita = lahatBalita.slice(0, 8);
      console.log(`✅ KABUUANG IPAPAKITA: ${napilingBalita.length} balita`);
      return napilingBalita;

    } catch (malakiAngMali) {
      console.error("❌ MALAKING PAGKAMALI SA PAGKUHA:", malakiAngMali.message);
      // 🚨 KAHIT MAY PANGKALAHATANG PAGKAMALI — MAGBALIK NG LAMAN HINDI BLANGKO
      return [{
        pamagat: "May pansamantalang aberya sa pagkuha ng balita",
        link: "#",
        petsa: new Date(),
        buod: "Mangyaring subukang muli mamaya. Salamat sa pag-unawa.",
        larawan: "https://via.placeholder.com/420x240/e74c3c/ffffff?text=Kailangang+Subukan+Muli",
        pinagmulan: "Paalala"
      }];
    }
  });

  // 📅 PAGPAPAGANDA NG PETSA — WIKANG FILIPINO
  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // ⚙️ PANGKALAHATANG AYOS NG ELEVENTY — TAMA PARA SA VERCEL
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
