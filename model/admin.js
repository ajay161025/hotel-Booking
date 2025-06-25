import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      max: 25,
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("admin", adminSchema);
