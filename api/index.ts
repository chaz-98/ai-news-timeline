import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { newsRouter } from "./routes/news";
import { startScheduler } from "./services/scheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/news", newsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI News API is running" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startScheduler();
  });
} else {
  // For serverless environments like Vercel, we don't start the scheduler
  // Use Vercel Cron Jobs instead
  startScheduler();
}

export default app;
