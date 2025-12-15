import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});
router.delete("/me", protect, async (req, res) => {
    await User.findByIdAndDelete(req.user.userId);
    res.clearCookie("token");
    res.json({ message: "Account deleted successfully" });
  });

export default router;
