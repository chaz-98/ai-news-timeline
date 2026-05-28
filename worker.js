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

async function fetchRSSFeed(feed) {
  const response = await fetch(feed.url);
  const text = await response.text();
  
  const items = [];
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
}

const ASSET_MANIFEST = {
  "index.html": "text/html",
  "registerSW.js": "application/javascript",
  "sw.js": "application/javascript",
  "workbox-774a133b.js": "application/javascript",
  "manifest.webmanifest": "application/manifest+json",
  "assets/index-rjwJABKC.css": "text/css",
  "assets/index-C17Ab3AC.js": "application/javascript",
  "favicon.svg": "image/svg+xml",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API 路由
    if (url.pathname === "/api/news") {
      try {
        console.log("Fetching real RSS news...");
        const allNews = [];
        
        for (const feed of RSS_FEEDS) {
          try {
            const items = await fetchRSSFeed(feed);
            allNews.push(...items);
          } catch (error) {
            console.error(`Error fetching ${feed.name}:`, error);
          }
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
    }
    
    // 静态文件路由
    let path = url.pathname;
    if (path === "/") path = "/index.html";
    path = path.startsWith("/") ? path.substring(1) : path;
    
    const contentType = ASSET_MANIFEST[path];
    if (contentType) {
      try {
        const assetUrl = new URL(`/${path}`, import.meta.url);
        const response = await fetch(assetUrl);
        if (response.ok) {
          return new Response(response.body, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000",
            },
          });
        }
      } catch (e) {
        // 如果静态资源加载失败，回退到返回 index.html（SPA 路由）
      }
    }
    
    // SPA 路由回退
    try {
      const indexUrl = new URL("/index.html", import.meta.url);
      const response = await fetch(indexUrl);
      if (response.ok) {
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (e) {
      console.error("Failed to load index.html", e);
    }
    
    return new Response("Not found", { status: 404 });
  },
};
