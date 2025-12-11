import express from "express";
import Notice from "../models/Notice.js";

const router = express.Router();

/* -------------------- 1️⃣ Get ALL Notices -------------------- */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------- 2️⃣ Search Notices -------------------- */
// Example: /api/notices/search?q=exam
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const notices = await Notice.find({
      title: { $regex: query, $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------- 3️⃣ Latest 10 Notices -------------------- */
// Example: /api/notices/latest
router.get("/latest", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(10);
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------- 4️⃣ Get Notice by ID -------------------- */
// Example: /api/notices/123abc
router.get("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------- 5️⃣ Filter by Date Range -------------------- */
// Example: /api/notices/date?from=2025-01-01&to=2025-01-31
router.get("/date/filter", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to)
      return res.status(400).json({ error: "Both from and to dates required" });

    const notices = await Notice.find({
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    }).sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/stats/categories", async (req, res) => {
    try {
      const stats = await Notice.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
  
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
router.get("/stats/total", async (req, res) => {
    try {
      const total = await Notice.countDocuments();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/stats/weekly", async (req, res) => {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
  
      const count = await Notice.countDocuments({
        createdAt: { $gte: weekAgo }
      });
  
      res.json({ last7days: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  


export default router;
