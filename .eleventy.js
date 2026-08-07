module.exports = function(eleventyConfig) {
  // 1. Awtomatikong kopyahin ang CSS folder papunta sa build output (Ang orihinal mong setting)
  eleventyConfig.addPassthroughCopy("src/assets/css");

  // 2. PINALUWAG NA TEMPLATE ENGINES: Pinapahintulutan ang Eleventy na basahin ang HTML at mga Larawan sa loob ng Markdown files
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
