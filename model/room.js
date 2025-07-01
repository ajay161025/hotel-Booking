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
      min:10,
      max: 50,
      // required: [true, "Enter hotel rooms"],
    },
    roomType: {
      type: Array,

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
