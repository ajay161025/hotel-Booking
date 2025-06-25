import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter hotel name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter about proterty"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please enter hotel address"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please enter hotel city"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Please enter hotel country"],
      trim: true,
    },
    starRatings: {
      type: Number,
      min: 1,
      max: 5,
    },
    price: {
      type: Number,
      required: [true, "Please enter hotel price"],
    },
    isVerified: {
      type: String,
      enum: ["verified", "rejected", "not-verified"],
      default: "not-verified",
    },
  },

  { timestamps: true }
);

export default mongoose.model("hotel", hotelSchema);
