import express from "express";
import Notice from "../models/Notice.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

/* ------------------------------------------------------
   1️⃣ Pagination (Latest → Oldest)
   Example: GET /api/notices/page/1
------------------------------------------------------ */
router.get("/page/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const notices = await Notice.find()
      .sort({ date: -1 })     // FIXED
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      notices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   2️⃣ Get ALL Notices (Sorted by Published Date)
------------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 }); // FIXED
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   3️⃣ Search Notices (Sorted by Published Date)
   Example: /api/notices/search?q=exam
------------------------------------------------------ */
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";

    const notices = await Notice.find({
      title: { $regex: query, $options: "i" },
    }).sort({ date: -1 }); // FIXED

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   4️⃣ Latest 10 Notices (By Published Date)
------------------------------------------------------ */
router.get("/latest", async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ date: -1 })   // FIXED
      .limit(10);

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   5️⃣ Filter by Published Date Range
   Example: /api/notices/filter/date?from=2025-01-01&to=2025-02-01
------------------------------------------------------ */
router.get("/filter/date", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to)
      return res.status(400).json({ error: "Both 'from' and 'to' dates are required" });

    const notices = await Notice.find({
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }).sort({ date: -1 }); // FIXED

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   6️⃣ Category Stats
------------------------------------------------------ */
router.get("/stats/categories", async (req, res) => {
  try {
    const stats = await Notice.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   7️⃣ Total Count of Notices
------------------------------------------------------ */
router.get("/stats/total", async (req, res) => {
  try {
    const total = await Notice.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   8️⃣ Notices Added in Last 7 Days (Based on Published Date)
------------------------------------------------------ */
router.get("/stats/weekly", async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const count = await Notice.countDocuments({
      date: { $gte: weekAgo },
    });

    res.json({ last7days: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ------------------------------------------------------
   9️⃣ Get Notice by ID
------------------------------------------------------ */
router.get("/:id",protect, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
