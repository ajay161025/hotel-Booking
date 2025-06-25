import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: String,
      ref: "hotel",
      required: [false, "Please enter hotel name"],
      trim: true,
    },
    numberOfRooms: {
      type: Number,
      required: [true, "Please enter hotel rooms"],
    },
    roomType: {
      type: String,
      required: [false, "Please enter about roomtype"],
      enum: ["single", "double-bed", "king-size"],
      trim: true,
    },
    availableInRoom: [
      {
        Breakfastincluded: { type: Boolean },
        Internet: { type: Boolean },
        Bar: { type: Boolean },
        Park: { type: Boolean },
        PetFriendly: { type: Boolean },
      },
    ],
    image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("room", roomSchema);
