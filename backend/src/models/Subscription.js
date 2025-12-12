import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscription: Object,
});

export default mongoose.model("Subscription", subscriptionSchema);
