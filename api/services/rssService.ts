import Parser from "rss-parser";
import { NewsItem } from "../../src/types/news";

const parser = new Parser();

// Chinese tech news RSS sources that are more reliable
const RSS_FEEDS = [
  { name: "36氪", url: "https://36kr.com/feed", category: "科技" },
  { name: "钛媒体", url: "https://www.tmtpost.com/rss", category: "科技" },
  { name: "机器之心", url: "https://www.jiqizhixin.com/rss", category: "AI" },
  { name: "InfoQ 中国", url: "https://www.infoq.cn/feed", category: "技术" },
];

// Fallback images for when no image is found in RSS
const FALLBACK_IMAGES = [
  "https://picsum.photos/800/400?random=10",
  "https://picsum.photos/800/400?random=11",
  "https://picsum.photos/800/400?random=12",
  "https://picsum.photos/800/400?random=13",
  "https://picsum.photos/800/400?random=14",
];

export async function fetchRSSFeeds(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching ${feed.name}...`);
      const feedData = await parser.parseURL(feed.url);
      
      const items = feedData.items.slice(0, 4).map((item, index) => {
        // Clean up the summary
        let summary = item.contentSnippet || item.content || "暂无摘要";
        // Remove HTML tags if present
        summary = summary.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
        
        return {
          id: `${feed.name}-${item.guid || item.link || index}`,
          title: item.title || "无标题",
          summary: summary,
          content: item.content,
          sourceUrl: item.link || "#",
          sourceName: feed.name,
          category: feed.category,
          timestamp: item.pubDate ? new Date(item.pubDate) : new Date(),
          imageUrl: getImageFromItem(item) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        };
      });
      
      allNews.push(...items);
      console.log(`Fetched ${items.length} items from ${feed.name}`);
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }

  // Sort by timestamp, newest first
  allNews.sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  console.log(`Total news items: ${allNews.length}`);
  return allNews;
}

function getImageFromItem(item: any): string | undefined {
  // Try to extract image from various RSS formats
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  if (item["media:content"]?.$?.url) {
    return item["media:content"].$.url;
  }
  if (item.content) {
    // Try to extract image from HTML content
    const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  if (item.thumbnail) {
    return item.thumbnail;
  }
  return undefined;
}
