const Parser = require("rss-parser");
const parser = new Parser({ timeout: 12000 });

const FEEDS = [
  { name: "Philstar", url: "https://www.philstar.com/rss/headlines" },
  { name: "GMA News", url: "https://data.gmanews.tv/gno/rss/news/feed.xml" },
  { name: "PNA", url: "https://www.pna.gov.ph/rss" },
  { name: "INQUIRER", url: "https://www.inquirer.net/rss/news.xml" },
  { name: "ABS-CBN", url: "https://news.abs-cbn.com/rss/home" },
  { name: "SunStar", url: "https://www.sunstar.com.ph/rssFeed/selected" },
  { name: "Rappler", url: "https://www.rappler.com/rss" },
  { name: "Manila Bulletin", url: "https://www.manilabulletin.com/feed/" },
  { name: "PAGASA", url: "https://publicalert.pagasa.dost.gov.ph/feeds/" },
  { name: "GMA Weather", url: "https://data.gmanews.tv/gno/rss/weather/feed.xml" }
];

module.exports = async function() {
  let allArticles = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      data.items.forEach(item => {
        const isWeather = feed.name.includes("Weather") || feed.name.includes("PAGASA");
        allArticles.push({
          title: item.title?.trim() || "Walang Pamagat",
          link: item.link,
          date: item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate || Date.now()),
          source: feed.name,
          isWeather
        });
      });
    } catch (err) {
      console.warn(`❌ ${feed.name}: ${err.message}`);
    }
  }

  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  return allArticles.sort((a, b) => b.date - a.date).slice(0, 30);
};