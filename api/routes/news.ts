import express from "express";
import { fetchRSSFeeds } from "../services/rssService";
import { mockNews } from "../../src/data/mockData";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Fetching real RSS news...");
    const news = await fetchRSSFeeds();
    
    if (news.length === 0) {
      console.log("No news from RSS, using mock data as fallback");
      res.json({ success: true, data: mockNews });
    } else {
      console.log(`Returning ${news.length} real news items`);
      res.json({ success: true, data: news });
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    res.json({ success: true, data: mockNews });
  }
});

router.get("/sync", async (req, res) => {
  try {
    console.log("Starting sync from RSS feeds...");
    const news = await fetchRSSFeeds();
    
    if (news.length === 0) {
      console.log("No news from RSS, using mock data");
      res.json({ 
        success: true, 
        data: mockNews, 
        message: "Sync completed (using demo data)" 
      });
    } else {
      console.log(`Synced ${news.length} items successfully`);
      res.json({ 
        success: true, 
        data: news, 
        message: `Sync completed! ${news.length} items fetched` 
      });
    }
  } catch (error) {
    console.error("Error syncing news:", error);
    res.json({ success: true, data: mockNews, message: "Fallback to demo data" });
  }
});

export { router as newsRouter };
