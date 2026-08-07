const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser();
      // ✅ GUMAMIT TAYO NG INQUIRER — MAS SIGURADO ANG RSS!
      const rssUrl = "https://www.inquirer.net/rss/news";
      
      console.log("🔍 KUKUHA NG BALITA MULA SA:", rssUrl);
      
      const feed = await parser.parseURL(rssUrl);
      
      console.log("✅ NAKUHA NA! BILANG NG BALITA:", feed.items.length);

      return feed.items.slice(0, 8).map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate,
        description: (item.contentSnippet || item.description || "").substring(0, 120) + "..."
      }));
    } catch (err) {
      console.error("❌ MALI ANG PAGKUHA NG BALITA:", err.message);
      // KUNG MAY MALI — MAGBIBIGAY NG HALIMBAWA PARA HINDI WALANG LAMAN!
      return [
        { title: "Halimbawang Balita 1 — Hintayin ang susunod na update", link: "#", date: new Date().toISOString(), description: "Kasalukuyang kinukuha ang mga bagong balita..." },
        { title: "Halimbawang Balita 2 — Suriin ang RSS link", link: "#", date: new Date().toISOString(), description: "Kung paulit-ulit na lumalabas ito — palitan ang RSS URL sa .eleventy.js" }
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
