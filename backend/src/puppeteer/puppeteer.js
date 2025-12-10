import puppeteer from "puppeteer";
import Notice from "../models/Notice.js";

export async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://iiitbhopal.ac.in/#/website/notice";
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector("tbody tr");

  const notices = await page.evaluate(() => {
    const rows = document.querySelectorAll("tbody tr");
    const extracted = [];

    rows.forEach(row => {
      const cols = row.querySelectorAll("td");

      if (cols.length >= 4) {

        // Extract Title
        const rawTitle = cols[1].innerText.trim();

        // Remove "NEW" sticker text
        const title = rawTitle.replace(/NEW/gi, "").trim();

        // Extract Date
        const date = cols[3].innerText.trim();

        // Try to extract link from title OR description column
        let link =
          cols[1].querySelector("a")?.href ??
          cols[2].querySelector("a")?.href ??
          null;

        extracted.push({ title, link, date });
      }
    });

    return extracted;
  });

  console.log("Scraped:", notices.length);

  let inserted = 0;

  for (const n of notices) {
    const exists = await Notice.findOne({ title: n.title });

    if (!exists) {
      await Notice.create(n);
      inserted++;
    }
  }

  console.log(`📌 Saved ${inserted} new notices.`);
  await browser.close();
}
