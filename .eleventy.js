const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      
      const rssUrl = "http://feeds.bbci.co.uk/news/world/rss.xml";
      
      console.log("🔍 KUKUHA NG BALITA AT LARAWAN MULA SA:", rssUrl);
      
      const feed = await parser.parseURL(rssUrl);
      
      console.log("✅ NAKUHA NA! BILANG NG BALITA:", feed.items.length);

      // 🖼️ HANAPIN ANG LARAWAN SA LAHAT NG PUWEDE PUWESTO
      const kuninLarawan = (item) => {
        // Paraan 1: enclosure
        if (item.enclosure?.url) return item.enclosure.url;
        // Paraan 2: media thumbnail
        if (item.thumbnail) return item.thumbnail;
        // Paraan 3: nasa loob ng description
        if (item.description) {
          const tugma = item.description.match(/<img[^>]+src="([^"]+)"/);
          if (tugma && tugma[1]) return tugma[1];
        }
        // Kung walang larawan → WALANG IBABALIK
        return null;
      };

      return feed.items.slice(0, 8).map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate,
        description: (item.contentSnippet || item.description || "").replace(/<[^>]*>/g, "").substring(0, 120) + "...",
        larawan: kuninLarawan(item) // ✅ NAKUHA NA ANG LARAWAN!
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
