const Parser = require("rss-parser");
const parser = new Parser({ 
  timeout: 15000,
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  }
});

// 34 Pinakamalalaking RSS Feeds sa Pilipinas (National, Mindanao, Visayas, Luzon, Weather, at Blogs)
const FEEDS = [
  // --- MAIN NATIONAL NEWS (Mga Pangunahing Balita) ---
  { name: "GMA News", url: "https://gmanews.tv", type: "news" },
  { name: "Rappler", url: "https://rappler.com", type: "news" },
  { name: "INQUIRER.net", url: "https://inquirer.net", type: "news" },
  { name: "Philstar Headlines", url: "https://philstar.com", type: "news" },
  { name: "Manila Bulletin", url: "https://mb.com.ph", type: "news" },
  { name: "Philippine News Agency (PNA)", url: "https://pna.gov.ph", type: "news" },
  { name: "Daily Tribune", url: "https://tribune.net.ph", type: "news" },
  { name: "BusinessMirror", url: "https://businessmirror.com.ph", type: "news" },
  { name: "Manila Times", url: "https://manilatimes.net", type: "news" },
  { name: "Abante Tonite", url: "https://abante.com.ph", type: "news" },
  { name: "Pilipino Star Ngayon", url: "https://philstar.com", type: "news" },

  // --- DAVAO & MINDANAO REGIONAL NEWS (Mga Balita sa Timog) ---
  { name: "MindaNews (Mindanao)", url: "https://mindanews.com", type: "news" },
  { name: "SunStar Davao", url: "https://sunstar.com.ph", type: "news" },
  { name: "Mindanao Times", url: "https://mindanaotimes.com.ph", type: "news" },
  { name: "Mindanao Gold Star Daily", url: "https://mindanaogoldstardaily.com", type: "news" },
  { name: "Inquirer Mindanao", url: "https://inquirer.net", type: "news" },

  // --- CEBU, VISAYAS & LUZON REGIONAL NEWS (Mga Balita sa Central at Hilaga) ---
  { name: "SunStar Cebu", url: "https://sunstar.com.ph", type: "news" },
  { name: "The Freeman (Cebu)", url: "https://philstar.com", type: "news" },
  { name: "Panay News (Iloilo & Western Visayas)", url: "https://panaynews.net", type: "news" },
  { name: "Inquirer Visayas", url: "https://inquirer.net", type: "news" },
  { name: "Palawan News", url: "https://palawan-news.com", type: "news" },
  { name: "Sunday Punch (Pangasinan/Dagupan)", url: "https://dagupan.com", type: "news" },

  // --- WEATHER & PAGASA ALERTS (Ulat Panahon at Klima) ---
  { name: "PAGASA Weather Broadcast", url: "https://youtube.com", type: "weather" },
  { name: "GMA Weather News", url: "https://gmanews.tv", type: "weather" },
  { name: "PAGASA Public Alerts", url: "https://dost.gov.ph", type: "weather" },

  // --- NEWS BLOGS, TECH, LIFESTYLE & ENTERTAINMENT (Mga Sikat na Blog at Trending) ---
  { name: "BlogWatch Philippines", url: "https://blogwatch.ph", type: "blog" },
  { name: "TechPinas", url: "https://techpinas.com", type: "blog" },
  { name: "When In Manila", url: "https://wheninmanila.com", type: "blog" },
  { name: "YugaTech (Tech News)", url: "https://yugatech.com", type: "blog" },
  { name: "Out of Town Blog (Travel & Culture)", url: "https://outoftownblog.com", type: "blog" },
  { name: "GizGuide PH", url: "https://gizguide.com", type: "blog" },
  { name: "Pinoy Money Talk (Business Blog)", url: "https://pinoymoneytalk.com", type: "blog" },
  { name: "Spot.ph (Urban & Lifestyle)", url: "https://spot.ph", type: "blog" },
  { name: "LionhearTV (Entertainment News)", url: "https://lionheartv.net", type: "blog" }
];

module.exports = async function() {
  let allArticles = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      if (data && data.items) {
        data.items.forEach(item => {
          const rawTitle = item.title || "Walang Pamagat";
          
          // Gumawa ng malinis na slug link para sa bawat indibidwal na post page
          const cleanSlug = rawTitle.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 70);

          allArticles.push({
            title: rawTitle.trim(),
            content: item.contentSnippet || item.content || "Basahin ang buong detalye sa orihinal na sors.",
            link: item.link || "#",
            slug: cleanSlug || Math.random().toString(36).substring(7),
            date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US') : "Ngayong Araw",
            source: feed.name,
            feedType: feed.type || "news"
          });
        });
      }
    } catch (err) {
      // Lalaktawan ang nag-error o offline na sors para tuluy-tuloy ang build ng site
      console.warn(`⚠️ Laktaw: ${feed.name} (${err.message})`);
    }
  }

  // Awtomatikong pag-alis ng mga duplicate links
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (!a.link || a.link === "#" || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  // Itinaas nat be sa 350 articles maximum ang kayang likhain ng site mo sa bawat build!
  return allArticles.slice(0, 350);
};
