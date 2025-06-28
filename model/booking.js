import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    numberOfGuests: {
      type: Number,
      required: true,
    },
    hotel: {
      type: String,
      ref: "hotel",
      required: false,
    },
    date: {
      type: Date,
    },
    checkInDate: {
      type: Date,
      required: false,
    },
    checkOutDate: {
      type: Date,
      required: false,
    },
    roomType: {
      type: Array,
      required: [true, "Please enter about roomtype"],
      // enum: ["single", "double-bed", "king-size"],
      trim: true,
    },
    stay: [
      {
        adult: {
          type: Number,
          required: [false, ""],
          max: 4,
        },
        children: {
          type: Number,
          required: [false, ""],
          max: 4,
        },
        rooms: {
          type: Number,
          required: [false, ""],
          max: 10,
        },
      },
    ],

    amountPaid: {
      type: Number,
      required: false,
    },
    daysOfStay: {
      type: Number,
      required: false,
    },
    paymentInfo: {
      id: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
    },
    paidAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("booking", bookingSchema);
