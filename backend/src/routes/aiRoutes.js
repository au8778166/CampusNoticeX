import express from "express";
import OpenAI from "openai";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/summarize", protect, async (req, res) => {
  try {
    // ✅ Initialize OpenAI AFTER env is loaded
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI key not configured" });
    }

    const { title, content, link } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const prompt = `
Summarize the following college notice in simple student-friendly language.

Title: ${title}

Details:
${content || "Official notice available at: " + link}

Provide a concise summary in 3–5 bullet points.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const summary = response.choices[0].message.content;

    res.json({ summary });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ message: "AI summary failed" });
  }
});

export default router;
