import type { VercelRequest, VercelResponse } from '@vercel/node';
import { mockNews } from '../src/data/mockData';
import Parser from 'rss-parser';

const parser = new Parser();

// 中国科技新闻 RSS 源
const RSS_FEEDS = [
  { name: "雷科技", url: "https://www.leiphone.com/feed", category: "科技" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "科技" },
  { name: "Hacker News", url: "https://news.ycombinator.com/rss", category: "技术" },
];

// 兜底图片
const FALLBACK_IMAGES = [
  "https://picsum.photos/800/400?random=10",
  "https://picsum.photos/800/400?random=11",
  "https://picsum.photos/800/400?random=12",
  "https://picsum.photos/800/400?random=13",
  "https://picsum.photos/800/400?random=14",
];

async function fetchRSSFeeds() {
  const allNews: any[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching ${feed.name}...`);
      const feedData = await parser.parseURL(feed.url);
      
      const items = feedData.items.slice(0, 4).map((item, index) => {
        let summary = item.contentSnippet || item.content || "暂无摘要";
        summary = summary.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
        
        return {
          id: `${feed.name}-${item.guid || item.link || index}`,
          title: item.title || "无标题",
          summary: summary,
          content: item.content,
          sourceUrl: item.link || "#",
          sourceName: feed.name,
          category: feed.category,
          timestamp: item.pubDate || new Date(),
          imageUrl: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        };
      });
      
      allNews.push(...items);
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }

  // 按时间排序
  allNews.sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  return allNews;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Fetching real RSS news...");
    let news = await fetchRSSFeeds();
    
    // 如果 RSS 没有获取到数据，使用模拟数据
    if (news.length === 0) {
      console.log("No news from RSS, using mock data");
      news = mockNews;
    }
    
    console.log(`Returning ${news.length} news items`);
    res.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.json({ success: true, data: mockNews });
  }
}