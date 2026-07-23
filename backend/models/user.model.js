import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (v) => v?.trim().toLowerCase(),
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "support"],
      default: "superadmin",
    },
    isActive: { type: Boolean, default: true },
    twoFactor: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, select: false },
      tempSecret: { type: String, select: false },
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    passwordChangedAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    refreshTokenHashes: [
      {
        hash: { type: String, select: false },
        userAgent: String,
        ip: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.model("User", userSchema);
