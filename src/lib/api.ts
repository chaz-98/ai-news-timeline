import { NewsItem } from "@/types/news";

// 在 Vercel 上部署时，直接使用相对路径
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news?_=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error(result.error || "Failed to fetch news");
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function syncNews(): Promise<NewsItem[]> {
  try {
    // 在 Vercel 上，sync 和 news 使用相同的接口
    const response = await fetch(`${API_BASE_URL}/news?_=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error(result.error || "Failed to sync news");
  } catch (error) {
    console.error("Error syncing news:", error);
    throw error;
  }
}
