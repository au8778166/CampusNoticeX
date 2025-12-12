import puppeteer from "puppeteer";
import Notice from "../models/Notice.js";
import { detectCategory } from "../utils/category.js";
import { parseNoticeDate } from "../utils/parseDate.js";
// import { sendPush } from "../utils/sendPush.js";

export async function scrape() {
  console.log("🔎 Scraping started...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const url = "https://iiitbhopal.ac.in/#/website/notice";

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("tbody tr", { timeout: 25000 });

    // Extract RAW values (title, link, rawDate)
    const rawNotices = await page.evaluate(() => {
      const extracted = [];
      const rows = document.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length < 4) return;

        const rawTitle = cols[1].innerText.trim();
        const title = rawTitle.replace(/NEW/gi, "").trim();

        const rawDate = cols[3].innerText.trim(); // e.g. Fri, Dec 12, 2025

        const link =
          cols[1].querySelector("a")?.href ??
          cols[2].querySelector("a")?.href ??
          null;

        if (!title || title.length < 3) return;

        extracted.push({ title, rawDate, link });
      });

      return extracted;
    });

    console.log("📌 Total Scraped:", rawNotices.length);

    let inserted = 0;

    for (const n of rawNotices) {
      // Convert raw date to ISO format
      const isoDate = parseNoticeDate(n.rawDate);

      const exists = await Notice.findOne({ title: n.title });

      if (!exists) {
        const category = detectCategory(n.title);

        await Notice.create({
          title: n.title,
          link: n.link,
          date: isoDate ? new Date(isoDate) : new Date(),
          category,
        });

        inserted++;

        // await sendPush("New Notice Added", n.title);
      }
    }

    console.log(`✅ Saved ${inserted} new notices.`);
  } catch (error) {
    console.error("❌ Scraper Error:", error.message);
  }

  await browser.close();
}
