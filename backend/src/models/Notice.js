import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String },
  date: { type: String },
}, { timestamps: true });

export default mongoose.model("Notice", noticeSchema);
