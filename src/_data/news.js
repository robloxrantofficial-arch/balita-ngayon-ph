const Parser = require("rss-parser");
const parser = new Parser({ 
  timeout: 15000,
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  }
});

// Pinalawak na listahan kasama ang PAGASA Weather Broadcasts at News Casters
const FEEDS = [
  { name: "PAGASA Official Weather Broadcast", url: "https://youtube.com" }, // DOST-PAGASA Weather Report Channel
  { name: "GMA Weather News", url: "https://gmanews.tv" }, // Mga ulat mula sa GMA News Express Weather Casters
  { name: "ABS-CBN Weather Update", url: "https://abs-cbn.com" },
  { name: "GMA News", url: "https://gmanews.tv" },
  { name: "Rappler", url: "https://rappler.com" },
  { name: "INQUIRER.net", url: "https://inquirer.net" },
  { name: "Philstar Headlines", url: "https://philstar.com" },
  { name: "PAGASA Public Alerts", url: "https://dost.gov.ph" }
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
            .slice(0, 60);

          // Tukuyin kung ang balita ay mula sa PAGASA o isang Weather Caster
          const isWeatherReport = feed.name.includes("PAGASA") || feed.name.includes("Weather");

          allArticles.push({
            title: rawTitle.trim(),
            content: item.contentSnippet || item.content || "Manood o magbasa ng buong detalye sa opisyal na sors.",
            link: item.link || "#",
            slug: cleanSlug || Math.random().toString(36).substring(7),
            date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US') : "Ngayong Araw",
            source: feed.name,
            isWeather: isWeatherReport
          });
        });
      }
    } catch (err) {
      console.warn(`⚠️ Hindi makuha ang feed mula sa ${feed.name}: ${err.message}`);
    }
  }

  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (!a.link || a.link === "#" || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  return allArticles.slice(0, 60);
};
