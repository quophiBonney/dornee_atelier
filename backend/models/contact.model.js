import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["Email", "Phone", "Live Chat", "Web Form"],
      default: "Web Form",
    },
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
