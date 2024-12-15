import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: {
      creaatedAt: true,
      updatedAt: false,
    },
  }
);

export const chatModel = mongoose.model("Chat", chatSchema);
