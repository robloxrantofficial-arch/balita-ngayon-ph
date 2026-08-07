const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("sw.js"); // ✅ PARA SA MONETAG!

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      
      // ✅ GOOGLE NEWS — TAGALOG NA BALITA MULA SA PILIPINAS!
      const rssUrl = "https://news.google.com/rss?hl=fil&gl=PH&ceid=PH:fil";
      
      console.log("🔍 KUKUHA NG BALITA MULA SA GOOGLE NEWS...");
      
      const feed = await parser.parseURL(rssUrl);
      
      console.log("✅ NAKUHA NA! BILANG NG BALITA:", feed.items.length);

      // 🖼️ HANAPIN ANG LARAWAN
      const kuninLarawan = (item) => {
        if (item.enclosure?.url) return item.enclosure.url;
        if (item.thumbnail) return item.thumbnail;
        return null;
      };

      return feed.items.slice(0, 8).map(item => ({
        title: item.title.replace(/ - .+$/, ""), // ✅ TANGGALIN ANG PANGALAN NG PINAGKUKUNAN SA DULO
        link: item.link,
        date: item.pubDate,
        description: (item.contentSnippet || item.description || "").substring(0, 120) + "...",
        larawan: kuninLarawan(item)
      }));
    } catch (err) {
      console.error("❌ MALI:", err.message);
      return [
        { title: "Pansamantalang hindi makakuha ng balita", link: "#", date: new Date().toISOString(), description: "Subukan ulit mamaya.", larawan: null }
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
