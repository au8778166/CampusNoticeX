import express from "express";
import cors from "cors";
import noticeRoutes from "./routes/noticeRoutes.js";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/notices", noticeRoutes);


app.get("/", (req, res) => {
  res.send("Backend working 🔥");
});

export default app;
