const fetch = require("isomorphic-fetch");

module.exports = async function() {
  // Narito na ang iyong opisyal na NewsAPI key
  const API_KEY = "5b4c87a77e3f4d20bf8f3151934c75e9"; 
  
  // Opisyal na koneksyon para sa lahat ng top headlines sa buong Pilipinas (country=ph)
  const url = `https://newsapi.org{API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("NewsAPI Network Error");
    
    const data = await response.json();
    let allArticles = [];

    if (data && data.articles) {
      data.articles.forEach(item => {
        if (!item.title || item.title.includes("[Removed]")) return;

        // Gumawa ng malinis na link para sa bawat indibidwal na post page
        const cleanSlug = item.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
          .slice(0, 60);

        allArticles.push({
          title: item.title.trim(),
          content: item.description || item.content || "Basahin ang buong ulat sa orihinal na sors.",
          link: item.url || "#",
          slug: cleanSlug || Math.random().toString(36).substring(7),
          date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US') : "Ngayong Araw",
          source: item.source.name || "Balita Portal"
        });
      });
    }

    // Siguraduhing may laman pa rin kahit mag-fail ang labas na koneksyon
    if (allArticles.length === 0) {
      return [{
        title: "Pilipinas News Portal: Live at Aktibo",
        content: "Kasalukuyang naghihintay ng unang awtomatikong cycle ng iyong Cron Job para mag-load ng mga bagong artikulo.",
        link: "#",
        slug: "portal-active",
        date: "Ngayong Araw",
        source: "System"
      }];
    }

    // Limitahan sa 40 pinakasariwang artikulo para makatipid sa server space at build minutes
    return allArticles.slice(0, 40);

  } catch (err) {
    console.log("Error sa NewsAPI Engine, gagamit ng fallback notification.");
    return [{
      title: "Inaayos ang koneksyon sa NewsAPI Server...",
      content: "Ang system ay awtomatikong mag-re-refresh gamit ang iyong cron scheduler kada 3 oras.",
      link: "#",
      slug: "system-reconnecting",
      date: "Ngayong Araw",
      source: "System Notice"
    }];
  }
};
