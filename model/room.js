import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Types.ObjectId,
      ref: "hotel",
      required: true,
     
    },
    numberOfRooms: {
      type: Number,
      maxLength:10,
      required: [true, "Please enter hotel rooms"],
    },
    roomType: {
      type: Array,
      required: [false, "Please enter about roomtype"],
      // enum: ["single", "double-bed", "king-size"],
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
