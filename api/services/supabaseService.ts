import { createClient } from "@supabase/supabase-js";
import { NewsItem } from "../../src/types/news";

// These should be set in environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function saveNewsToSupabase(news: NewsItem[]) {
  if (!supabase) {
    console.log("Supabase not configured - skipping database save");
    return;
  }

  try {
    // Convert dates to ISO strings for storage
    const newsForDb = news.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      source_url: item.sourceUrl,
      source_name: item.sourceName,
      category: item.category,
      timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : new Date(item.timestamp).toISOString(),
      image_url: item.imageUrl,
    }));

    // Upsert the news (update if exists, insert if new)
    const { error } = await supabase
      .from("news")
      .upsert(newsForDb, { onConflict: "id" });

    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }

    console.log(`Successfully saved ${news.length} articles to Supabase`);
  } catch (error) {
    console.error("Error in saveNewsToSupabase:", error);
  }
}

export async function getNewsFromSupabase(): Promise<NewsItem[]> {
  if (!supabase) {
    console.log("Supabase not configured - returning empty array");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching from Supabase:", error);
      throw error;
    }

    // Convert back to NewsItem format
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      sourceUrl: item.source_url,
      sourceName: item.source_name,
      category: item.category,
      timestamp: new Date(item.timestamp),
      imageUrl: item.image_url,
    }));
  } catch (error) {
    console.error("Error in getNewsFromSupabase:", error);
    return [];
  }
}
