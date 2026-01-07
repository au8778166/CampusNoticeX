

import mongoose from "mongoose";
import app from "./app.js";
import cron from "node-cron";
import { scrape } from "./puppeteer/puppeteer.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  


    // Run scraper immediately on server start
    console.log("🚀 Running first scrape...");
    await scrape();

    // Run scraper every 10 minutes
    
  } catch (err) {
    console.error("Server startup error:", err.message);
  }
}

start();



