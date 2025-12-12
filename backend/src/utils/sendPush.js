import webpush from "web-push";
import Subscription from "../models/Subscription.js";
import dotenv from "dotenv";
dotenv.config();
webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendPush = async (title, body) => {
  const subs = await Subscription.find();

  subs.forEach((s) => {
    webpush.sendNotification(
      s.subscription,
      JSON.stringify({ title, body })
    ).catch(err => console.log("Push error:", err.message));
  });
};
