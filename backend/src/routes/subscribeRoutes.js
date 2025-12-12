import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Subscription.create({ subscription: req.body });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
