import mongoose from "mongoose";

const database = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, { dbName: "HotelBooking" });
  } catch (error) {
    console.log(error, "Oops!");
  }
};

export default database;
