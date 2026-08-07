const Parser = require("rss-parser");
require("isomorphic-fetch");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");

  eleventyConfig.addGlobalData("balita", async function() {
    try {
      const parser = new Parser({
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      
      // ✅ GUMAMIT TAYO NG BBC NEWS — SIGURADONG GUMAGANA AT HINDI HINAHARANG!
      const rssUrl = "http://feeds.bbci.co.uk/news/world/rss.xml";
      
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
      // ✅ KUNG MAY MALI — MAGBIBIGAY NG HALIMBAWA PARA HINDI WALANG LAMAN!
      return [
        { title: "Pansamantalang hindi makakuha ng balita", link: "#", date: new Date().toISOString(), description: "Sinusubukan muli ang pagkuha ng balita. Maghintay ng susunod na update..." },
        { title: "Kung paulit-ulit itong lumalabas — subukan mamaya", link: "#", date: new Date().toISOString(), description: "Maaaring pansamantalang abala lamang ang pinagkukunan ng balita." }
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
