const RSS_FEEDS = [
  { name: "雷科技", url: "https://www.leiphone.com/feed", category: "科技" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "科技" },
  { name: "Hacker News", url: "https://news.ycombinator.com/rss", category: "技术" },
];

const FALLBACK_IMAGES = [
  "https://picsum.photos/800/400?random=10",
  "https://picsum.photos/800/400?random=11",
  "https://picsum.photos/800/400?random=12",
  "https://picsum.photos/800/400?random=13",
  "https://picsum.photos/800/400?random=14",
];

async function fetchRSSFeed(feed: any) {
  try {
    const response = await fetch(feed.url);
    if (!response.ok) {
      console.error(`Failed to fetch ${feed.name}: ${response.status}`);
      return [];
    }
    const text = await response.text();
    
    const items: string[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      items.push(match[1]);
    }
    
    return items.slice(0, 5).map((item, index) => {
      const title = item.match(/<title>([^<]*)<\/title>/)?.[1] || "无标题";
      const link = item.match(/<link>([^<]*)<\/link>/)?.[1] || "#";
      const pubDate = item.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1] || new Date().toISOString();
      const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      let summary = description.replace(/<[^>]*>/g, "");
      
      if (feed.name === "Hacker News") {
        summary = summary || "来自 Hacker News 的热门技术讨论";
      }
      
      if (!summary || summary.trim() === "") {
        summary = "点击查看详情";
      }
      
      summary = summary.substring(0, 150);
      if (summary.length >= 150) {
        summary += "...";
      }
      
      return {
        id: `${feed.name}-${Date.now()}-${index}`,
        title: title,
        summary: summary,
        content: description,
        sourceUrl: link,
        sourceName: feed.name,
        category: feed.category,
        timestamp: pubDate,
        imageUrl: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      };
    });
  } catch (error) {
    console.error(`Error fetching ${feed.name}:`, error);
    return [];
  }
}

export const onRequest: PagesFunction = async (context) => {
  try {
    console.log("Fetching real RSS news...");
    const allNews: any[] = [];
    
    for (const feed of RSS_FEEDS) {
      const items = await fetchRSSFeed(feed);
      allNews.push(...items);
    }
    
    if (allNews.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        data: [], 
        error: "No news found" 
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    
    allNews.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
    
    console.log(`Returning ${allNews.length} news items`);
    
    return new Response(JSON.stringify({ success: true, data: allNews }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ success: false, data: [], error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
