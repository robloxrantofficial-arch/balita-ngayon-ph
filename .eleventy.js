module.exports = function(eleventyConfig) {
  // Awtomatikong kopyahin ang CSS folder papunta sa build output
  eleventyConfig.addPassthroughCopy("src/assets/css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
