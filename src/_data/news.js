module.exports = async function() {
  // Narito na ang iyong opisyal na GNews API key
  const API_KEY = "1e1726413d6739ff8d29b07250840a03"; 
  
  // Opisyal na link para sa mga top headlines sa Pilipinas gamit ang GNews (country=ph)
  const url = `https://gnews.io{API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("GNews Network Error");
    
    const data = await response.json();
    let allArticles = [];

    if (data && data.articles && data.articles.length > 0) {
      data.articles.forEach(item => {
        if (!item.title) return;

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
          source: item.source.name || "Balita Portal"
        });
      });
    }

    if (allArticles.length === 0) throw new Error("No articles found");
    
    // Ang libreng plano ng GNews ay nagbibigay ng 10 malalaki at sariwang balita kada request
    return allArticles.slice(0, 10); 

  } catch (err) {
    console.log("GNews Fallback Triggered:", err.message);
    return [
      {
        title: "Pilipinas Auto News Portal: Live at Aktibo ang System",
        content: "Matagumpay na gumagana ang iyong Eleventy static site engine. Kasalukuyang naghihintay ng susunod na automatic cron build cycle upang mag-load ng mga sariwang artikulo.",
        link: "#",
        slug: "portal-active-notice",
        date: "Ngayong Araw",
        source: "System"
      }
    ];
  }
};
