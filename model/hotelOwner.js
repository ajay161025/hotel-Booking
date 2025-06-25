import mongoose from "mongoose";

const hotelOwnerSchema = new mongoose.Schema(
  {
    hotelOwner: {
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
  },
  { timestamps: true }
);

export default mongoose.model("hotelOwner", hotelOwnerSchema);
