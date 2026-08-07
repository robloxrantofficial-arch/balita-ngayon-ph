const Parser = require("rss-parser");
const parser = new Parser({ 
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
});

const FEEDS = [
  { name: "GMA News", url: "https://gmanews.tv" },
  { name: "Rappler", url: "https://rappler.com" }
];

module.exports = async function() {
  let allArticles = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      if (data && data.items) {
        data.items.forEach(item => {
          const rawTitle = item.title || "Walang Pamagat";
          const cleanSlug = rawTitle.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 50);

          allArticles.push({
            title: rawTitle.trim(),
            content: item.contentSnippet || item.content || "Basahin ang detalye sa sors.",
            link: item.link || "#",
            slug: cleanSlug || Math.random().toString(36).substring(7),
            date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US') : "Ngayong Araw",
            source: feed.name
          });
        });
      }
    } catch (err) {
      console.warn("Error sa feed:", feed.name, err.message);
    }
  }

  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (!a.link || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  return allArticles.slice(0, 50);
};
