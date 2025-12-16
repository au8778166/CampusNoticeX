import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import noticeRoutes from "./routes/noticeRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import aiRoutes from "./routes/aiRoutes.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies
  })
);

app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);




app.get("/", (req, res) => {
  res.send("Backend working 🔥");
});

export default app;
