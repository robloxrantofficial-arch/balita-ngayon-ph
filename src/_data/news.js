const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => { reject(err); });
  });
}

module.exports = async function() {
  let url = "";
  
  if (process.env.NETLIFY) {
    const GNEWS_KEY = "1e1726413d6739ff8d29b07250840a03";
    url = `https://gnews.io{GNEWS_KEY}`;
  } else {
    const NEWS_KEY = "5b4c87a77e3f4d20bf8f3151934c75e9";
    url = `https://newsapi.org{NEWS_KEY}`;
  }

  try {
    const data = await fetchJson(url);
    let allArticles = [];
    const articlesList = data.articles || [];

    if (articlesList.length > 0) {
      articlesList.forEach(item => {
        if (!item.title || item.title.includes("[Removed]")) return;

        const cleanSlug = item.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
          .slice(0, 60);

        allArticles.push({
          title: item.title.trim(),
          content: item.description || item.content || "Basahin ang buong detalye sa orihinal na sors.",
          link: item.url || "#",
          slug: cleanSlug || Math.random().toString(36).substring(7),
          date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US') : "Ngayong Araw",
          source: item.source ? (item.source.name || "Balita Portal") : "News Source"
        });
      });
    }

    if (allArticles.length === 0) throw new Error("No articles found");
    return allArticles.slice(0, 20); 

  } catch (err) {
    return [
      {
        title: "Pilipinas Auto News Portal: Live at Aktibo ang System",
        content: "Matagumpay na gumagana ang iyong Eleventy site engine. Kasalukuyang naghihintay ng susunod na automatic cron build cycle upang mag-load ng mga sariwang artikulo.",
        link: "#",
        slug: "portal-active-notice",
        date: "Ngayong Araw",
        source: "System"
      }
    ];
  }
};
