const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = function(eleventyConfig) {
  // ✅ IYONG ORIHINAL NA SETTING — HINDI BINAGO!
  eleventyConfig.addPassthroughCopy("src/assets/css");

  // 📰 AWTOMATIKONG KUKUHA NG BALITA MULA SA GMA NEWS — BAWAT 1 ORAS!
  eleventyConfig.addGlobalData("balita", async function() {
    const rssUrl = "https://www.gmanet.com/news/national/rss.xml";
    
    const feed = await EleventyFetch(rssUrl, {
      duration: "1h", // KUKUHA NG BAGONG BALITA BAWAT 1 ORAS
      type: "xml"
    });

    const { XMLParser } = require("fast-xml-parser");
    const parser = new XMLParser();
    const data = parser.parse(feed);
    const items = data.rss.channel.item;

    // BABALIK LANG ANG UNANG 8 BALITA
    return items.slice(0, 8).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      description: item.description?.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
    }));
  });

  // 📅 PAGANDAHIN ANG PETSA
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
