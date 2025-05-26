import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId, //user who is subscribing
      ref: "User",
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId, // to whom subscribed
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
