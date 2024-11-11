const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sender Id is required"],
      ref: "User",
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Receiver Id is required"],
      ref: "User",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
