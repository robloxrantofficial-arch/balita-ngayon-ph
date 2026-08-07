const netlifyContext = process.env.CONTEXT || "production";

module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("netlifyContext", netlifyContext);

  eleventyConfig.addCollection("posts", collection => {
    const allPosts = collection.getFilteredByTag("post");
    const sorted = allPosts.sort((a, b) => b.data.date - a.data.date);
    return netlifyContext === "production" ? sorted.filter(p => !p.draft) : sorted;
  });

  eleventyConfig.addFilter("formatDate", date => {
    return new Date(date).toLocaleDateString("tl-PH", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  eleventyConfig.addPassthroughCopy("src/assets/");

  return {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    layouts: "_includes"
  }
};
};
