import puppeteer from "puppeteer";
import Notice from "../models/Notice.js";
import { detectCategory } from "../utils/category.js";

export async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://iiitbhopal.ac.in/#/website/notice";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for notice table to load
  await page.waitForSelector("tbody tr");

  // Extract notices from the webpage
  const notices = await page.evaluate(() => {
    const rows = document.querySelectorAll("tbody tr");
    const extracted = [];

    rows.forEach(row => {
      const cols = row.querySelectorAll("td");

      // Require at least 4 columns (S.No, Title, Description, Date)
      if (cols.length < 4) return;

      // Title
      const rawTitle = cols[1].innerText.trim();
      const title = rawTitle.replace(/NEW/gi, "").trim();

      // Date
      const date = cols[3].innerText.trim();

      // PDF Link
      const link =
        cols[1].querySelector("a")?.href ??
        cols[2].querySelector("a")?.href ??
        null;

      // Skip incomplete entries
      if (!title || title.length < 3) return;

      extracted.push({ title, link, date });
    });

    return extracted;
  });

  console.log("Scraped:", notices.length);

  let inserted = 0;

  for (const n of notices) {
    const exists = await Notice.findOne({ title: n.title });

    if (!exists) {
      // Detect category using your smart function
      const category = detectCategory(n.title);

      await Notice.create({
        title: n.title,
        link: n.link,
        date: n.date,
        category: category,
      });

      inserted++;
    }
  }

  console.log(`Saved ${inserted} new notices.`);
  await browser.close();
}
