import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import noticeRoutes from "./routes/noticeRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);


app.get("/", (req, res) => {
  res.send("Backend working 🔥");
});

export default app;
