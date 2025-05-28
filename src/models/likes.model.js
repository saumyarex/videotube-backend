import mongoose from "mongoose";

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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Likes = mongoose.model("Likes", likesSchema);
