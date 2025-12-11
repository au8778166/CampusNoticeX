import mongoose from "mongoose";
import app from "./app.js";
import { scrape } from "./puppeteer/puppeteer.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000
async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");

  app.listen(5000, () => console.log("Server running on port 5000"));
}

start();

scrape();




