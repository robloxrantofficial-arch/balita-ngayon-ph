const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        defaultRSS: 2.0,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });
      
      // ✅ GUMAMIT TAYO NG GMA NEWS — MAS MALINIS ANG RSS! WALANG SIMBOLO!
      const rssUrl = "https://www.gmanet.com/news/national/rss.xml";
      
      console.log("🔍 KUKUHA NG BALITA MULA SA:", rssUrl);
      
      const feed = await parser.parseURL(rssUrl);
      
      console.log("✅ NAKUHA NA! BILANG NG BALITA:", feed.items.length);

      return feed.items.slice(0, 8).map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate,
        description: (item.contentSnippet || item.description || "").replace(/<[^>]*>/g, "").substring(0, 120) + "..."
      }));
    } catch (err) {
      console.error("❌ MALI ANG PAGKUHA NG BALITA:", err.message);
      // ✅ KUNG MAY MALI — MAGBIBIGAY NG HALIMBAWA PARA HINDI WALANG LAMAN!
      return [
        { title: "Halimbawang Balita — Kukuhin pa rin mula sa GMA News", link: "#", date: new Date().toISOString(), description: "Kasalukuyang inaayos ang pagkuha ng balita. Maghintay ng susunod na update..." },
        { title: "Kung paulit-ulit itong lumalabas — suriin ang RSS link", link: "#", date: new Date().toISOString(), description: "Subukang i-refresh muli mamaya. Maaaring pansamantalang abala lamang ang pinagkukunan." }
      ];
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
