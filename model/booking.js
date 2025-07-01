import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    numberOfGuests: {
      type: Number,
    },
    hotel: {
      type: mongoose.Types.ObjectId,
      ref: "hotels",
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
    selectRooms: {
      type: Number,
      required: false,
    },
    roomType: {
      type: Array,

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
