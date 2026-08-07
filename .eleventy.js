const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js");

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { "User-Agent": "Mozilla/5.0" },
        customFields: {
          item: ["media:thumbnail", "media:content", "enclosure"]
        }
      });

      // 📰 TATLONG PINAGKUKUNAN — PARA SIGURADONG MAY LARAWAN!
      const mgaPinagkukunan = [
        "https://www.gmanet.com/news/national/rss.xml",
        "https://www.inquirer.net/rss/philippines",
        "https://www.rappler.com/rss/news/nation/"
      ];

      console.log("🔍 KUKUHA NG BALITA MULA SA 3 PINAGKUKUNAN...");

      // 🖼️ HANAPIN ANG LARAWAN SA LAHAT NG PUWEDE PUWESTO
      const kuninLarawan = (item) => {
        if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
        if (item["media:content"]?.url) return item["media:content"].url;
        if (item.enclosure?.url) return item.enclosure.url;
        if (item.thumbnail) return item.thumbnail;
        if (item.description) {
          const tugma = item.description.match(/<img[^>]+src="([^"]+)"/);
          if (tugma && tugma[1]) return tugma[1];
        }
        return null;
      };

      // 📦 KUKUHA MULA SA LAHAT NG PINAGKUKUNAN
      const lahatBalita = [];
      for (const url of mgaPinagkukunan) {
        try {
          const feed = await parser.parseURL(url);
          feed.items.forEach(item => {
            lahatBalita.push({
              pamagat: item.title,
              link: item.link,
              petsa: item.pubDate,
              buod: (item.contentSnippet || item.description || "").replace(/<[^>]*>/g, "").substring(0, 120) + "...",
              larawan: kuninLarawan(item),
              pinagmulan: url.includes("gmanet") ? "GMA News" : url.includes("inquirer") ? "Inquirer" : "Rappler"
            });
          });
        } catch (e) {
          console.log("⚠️ HINDI MAKUHA MULA SA:", url);
        }
      }

      // ✅ AYUSIN AYON SA PETSA — PINAKABAGONG UNA
      lahatBalita.sort((a, b) => new Date(b.petsa) - new Date(a.petsa));

      // ✅ KUNIN ANG UNANG 8 BALITA
      console.log("✅ KABUUANG BILANG NG BALITA:", lahatBalita.length);
      return lahatBalita.slice(0, 8);

    } catch (err) {
      console.error("❌ MALI:", err.message);
      return [];
    }
  });

  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

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
