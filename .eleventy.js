module.exports = function(eleventyConfig) {
  // I-copy ang CSS folder papunta sa public folder
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
