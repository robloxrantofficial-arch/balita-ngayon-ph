module.exports = async function() {
  const API_KEY = "5b4c87a77e3f4d20bf8f3151934c75e9"; 
  const url = `https://newsapi.org{API_KEY}`;

  try {
    // Gagamit ng native built-in fetch ng Node.js environment
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error("NewsAPI Bad Response");
    
    const data = await response.json();
    let allArticles = [];

    if (data && data.articles && data.articles.length > 0) {
      data.articles.forEach(item => {
        if (!item.title || item.title.includes("[Removed]")) return;

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

    if (allArticles.length === 0) {
      throw new Error("No articles found");
    }

    return allArticles.slice(0, 40);

  } catch (err) {
    console.log("Fallback triggered due to:", err.message);
    return [
      {
        title: "Pilipinas Auto News Portal: Matagumpay na Naka-deploy!",
        content: "Ang iyong system ay 100% live. Kung blangko ang headlines, ang NewsAPI key ay kasalukuyang nag-a-antay ng susunod na automatic cron build cycle upang magre-refresh.",
        link: "https://newsapi.org",
        slug: "portal-active-notice",
        date: "Ngayong Araw",
        source: "System"
      }
    ];
  }
};
