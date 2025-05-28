import mongoose from "mongoose";
import { Tweet } from "./tweet.model";

const likesSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },

    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },

    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Likes = mongoose.model("Likes", likesSchema);
