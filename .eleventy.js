// 🛠️ MAS MATIBAY NA PAGKUHA — may paglilinis din para sa sirang karakter
const gamitProxy = (url) => {
  // Dagdag na opsyon para mas mukhang tunay na pananaw mula sa browser
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&allowAll=true`;
};

eleventyConfig.addGlobalData("balita", async function() {
  try {
    const parser = new Parser({
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, text/html;q=0.8,*/*;q=0.7",
        "Accept-Language": "tl-PH,tl;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Referer": "https://www.google.com/"
      },
      customFields: {
        item: ["media:thumbnail", "media:content", "enclosure"]
      },
      timeout: 15000, // ⏱️ Mas mahabang oras ng paghihintay
      // 🧹 LINISIN ANG DATOS bago basahin — para maalis ang mga sirang karakter/tag
      xmlParseOptions: {
        trim: true,
        normalize: true,
        strict: false // ✅ Pinakamahalaga — magpaparaya sa maliit na pagkukulang sa pormat
      }
    });

    // 📰 MAAARI MONG SUBUKAN PALTAN ANG MGA LINK KUNG MAY BAGO NA SILANG RSS
    const mgaPinagkukunan = [
      "https://www.gmanetwork.com/news/rss/", // 📌 SUBUKAN ITO — mas bagong tamang link ng GMA
      "https://newsinfo.inquirer.net/rss",     // 📌 SUBUKAN ITO — mas maikling bersyon para sa Inquirer
      "https://www.rappler.com/rss/news/nation/"
    ];

    // ... ituloy ang natitirang bahagi ng dati mong code ...
