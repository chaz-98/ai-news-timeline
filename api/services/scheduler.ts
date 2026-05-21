import cron from "node-cron";
import { fetchRSSFeeds } from "./rssService";

export function startScheduler() {
  console.log("Starting hourly scheduler...");

  // Run every hour at minute 0
  const job = cron.schedule("0 * * * *", async () => {
    try {
      console.log(`[${new Date().toISOString()}] Starting hourly sync...`);
      const news = await fetchRSSFeeds();
      console.log(`[${new Date().toISOString()}] Synced ${news.length} articles successfully`);
      
      // In a real app, you would save these to Supabase here
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in scheduled sync:`, error);
    }
  });

  console.log("Scheduler started - will run every hour");
  
  // Run initial sync on startup
  console.log("Running initial sync...");
  fetchRSSFeeds().then((news) => {
    console.log(`Initial sync complete, ${news.length} articles fetched`);
  });

  return job;
}
