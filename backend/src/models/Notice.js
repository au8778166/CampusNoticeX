import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String,
  category: {
    type: String,
    default: "General"
  }
}, { timestamps: true });


export default mongoose.model("Notice", noticeSchema);
