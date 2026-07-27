import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: [
        "Custom Design",
        "Fitting Consultation",
        "Personal Styling",
        "Alterations",
      ],
    },
    date: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      unique: true,
      sparse: true,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Appointment", appointmentSchema);
