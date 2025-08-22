import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, match: /^\d{10}$/ }, // sender’s phone
    text: { type: String, required: true }, // raw SMS text
    status: {
      type: String,
      enum: ["received", "processed", "failed"],
      default: "received",
    }, // track message processing
  },
  { timestamps: true, collection: "Messages" }
);

export default mongoose.models.Messages || mongoose.model("Messages", messageSchema);
