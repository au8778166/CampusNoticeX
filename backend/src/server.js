import mongoose from "mongoose";
import app from "./app.js";
import { scrape } from "./puppeteer/puppeteer.js";

async function start() {
  await mongoose.connect("mongodb+srv://au8778166_db_user:7PpvzQaolEYe9JFJ@cluster0.dtutwff.mongodb.net/?appName=Cluster0");
  console.log("Database connected");

  app.listen(5000, () => console.log("Server running on port 5000"));
}

start();

scrape();




//7PpvzQaolEYe9JFJ