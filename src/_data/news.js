const Parser = require("rss-parser");
const parser = new Parser({ 
  timeout: 15000,
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  }
});

const FEEDS = [
  // --- NATIONAL NEWS ---
  { name: "GMA News", url: "https://gmanews.tv", type: "news" },
  { name: "Rappler", url: "https://rappler.com", type: "news" },
  { name: "INQUIRER.net", url: "https://inquirer.net", type: "news" },
  { name: "Philstar Headlines", url: "https://philstar.com", type: "news" },
  { name: "Manila Bulletin", url: "https://mb.com.ph", type: "news" },
  { name: "Philippine News Agency", url: "https://pna.gov.ph", type: "news" },
  { name: "Daily Tribune", url: "https://tribune.net.ph", type: "news" },
  { name: "BusinessMirror", url: "https://businessmirror.com.ph", type: "news" },
  { name: "Manila Times", url: "https://manilatimes.net", type: "news" },
  { name: "Abante Tonite", url: "https://abante.com.ph", type: "news" },
  { name: "Pilipino Star Ngayon", url: "https://philstar.com", type: "news" },

  // --- MINDANAO & DAVAO NEWS ---
  { name: "MindaNews", url: "https://mindanews.com", type: "news" },
  { name: "SunStar Davao", url: "https://sunstar.com.ph", type: "news" },
  { name: "Mindanao Times", url: "https://mindanaotimes.com.ph", type: "news" },
  { name: "Mindanao Gold Star Daily", url: "https://mindanaogoldstardaily.com", type: "news" },
  { name: "Inquirer Mindanao", url: "https://inquirer.net", type: "news" },

  // --- CEBU, VISAYAS & LUZON REGIONAL NEWS ---
  { name: "SunStar Cebu", url: "https://sunstar.com.ph", type: "news" },
  { name: "The Freeman Cebu", url: "https://philstar.com", type: "news" },
  { name: "Panay News Iloilo", url: "https://panaynews.net", type: "news" },
  { name: "Inquirer Visayas", url: "https://inquirer.net", type: "news" },
  { name: "Palawan News", url: "https://palawan-news.com", type: "news" },
  { name: "Sunday Punch Pangasinan", url: "https://dagupan.com", type: "news" },

  // --- WEATHER & PAGASA NEWS CASTERS ---
  { name: "PAGASA Weather Broadcast", url: "https://youtube.com", type: "weather" },
  { name: "GMA Weather News", url: "https://gmanews.tv", type: "weather" },
  { name: "PAGASA Public Alerts", url: "https://dost.gov.ph", type: "weather" },

  // --- NEWS BLOGS, TECH & TRENDING ---
  { name: "BlogWatch Philippines", url: "https://blogwatch.ph", type: "blog" },
  { name: "TechPinas", url: "https://techpinas.com", type: "blog" },
  { name: "When In Manila", url: "https://wheninmanila.com", type: "blog" },
  { name: "YugaTech", url: "https://yugatech.com", type: "blog" },
  { name: "Out of Town Blog", url: "https://outoftownblog.com", type: "blog" },
  { name: "GizGuide PH", url: "https://gizguide.com", type: "blog" },
  { name: "Pinoy Money Talk", url: "https://pinoymoneytalk.com", type: "blog" },
  { name: "Spot.ph", url: "https://spot.ph", type: "blog" },
  { name: "LionhearTV", url: "https://lionheartv.net", type: "blog" }
];

module.exports = async function() {
  let allArticles = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      if (data && data.items) {
        data.items.forEach(item => {
          // SIGURADONG PANALA: Laktawan ang walang pamagat o link para maiwasan ang XML error crash
          if (!item.title || !item.link) return;

          // STRICT CLEANING: Tanggalin ang mga sirang special characters sa URL slugs
          const cleanSlug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Alisin ang mga ligaw na simbolo at ampersand
            .replace(/\s+/g, "-")         // Gawing gitling ang mga espasyo
            .trim()
            .slice(0, 60);

          allArticles.push({
            title: item.title.trim().replace(/[\u200B-\u200D\uFEFF]/g, ""), // Linisin ang pamagat
            content: item.contentSnippet || item.content || "Basahin ang buong detalye sa orihinal na sors.",
            link: item.link.trim(),
            slug: cleanSlug || Math.random().toString(36).substring(7),
            date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US') : "Ngayong Araw",
            source: feed.name,
            feedType: feed.type || "news"
          });
        });
      }
    } catch (err) {
      // SILENT CATCH: Mag-iiwan lang ng maayos na log, hindi nito patitigilin ang build process
      console.log(`ℹ️ Laktaw pansamantala: ${feed.name}`);
    }
  }

  // Pag-alis ng mga duplicate na balita
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (!a.link || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  // ITINAAS SA 450 MAXIMUM POSTS: Upang magkaroon ng napakaraming balita araw-araw!
  return allArticles.slice(0, 450);
};
