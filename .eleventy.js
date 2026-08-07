const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");

module.exports = function(eleventyConfig) {
  // ✅ IYONG ORIHINAL NA SETTING — HINDI BINAGO!
  eleventyConfig.addPassthroughCopy("src/assets/css");

  // 📰 AWTOMATIKONG KUKUHA NG BALITA MULA SA GMA NEWS — BAWAT 1 ORAS!
  eleventyConfig.addGlobalData("balita", async function() {
    const parser = new Parser();
    const rssUrl = "https://www.gmanet.com/news/national/rss.xml";

    // KUKUHA NG BAGONG BALITA BAWAT 1 ORAS
    const feed = await EleventyFetch(rssUrl, {
      duration: "1h",
      type: "text"
    });

    const parsed = await parser.parseString(feed);

    // BABALIK LANG ANG UNANG 8 BALITA — MALINIS NA WALANG HTML CODE
    return parsed.items.slice(0, 8).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      description: item.contentSnippet?.substring(0, 120) + "..."
    }));
  });

  // 📅 PAGANDAHIN ANG PETSA — HALIMBAWA: "Agosto 8, 2026"
  eleventyConfig.addFilter("formatDate", function(dateStr) {
    return new Date(dateStr).toLocaleDateString("tl-PH", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  // ✅ IYONG ORIHINAL NA SETTING — HINDI BINAGO!
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
