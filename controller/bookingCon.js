import bookingModel from "../model/booking.js";
import hotelModel from "../model/hotel.js";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";

//searchBar
export const searchBar = async (req, res) => {
  const { country, city } = req.query;
  const { page, limit } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    const searchbar = await hotelModel
      .find({ country: country, city: city })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(StatusCodes.OK).json(searchbar);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

//view hotel using name
export const Hotel = async (req, res) => {
  const { name } = req.query;
  try {
    const hotel = await hotelModel.findOne({ name, isVerified: "verified" });
    if (!hotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json(hotel);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

//view all hotels
// export const Hotels = async (req, res) => {
//   const { page, limit } = req.query;
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   try {
//     const hotels = await hotelModel.find({}).skip(skip).limit(parseInt(limit));
//     res.status(200).json(hotels);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

//booking
export const Booking = async (req, res) => {
  try {
    const {
      roomType,
      selectRooms,
      numberOfGuests,
      checkInDate,
      checkOutDate,
      stay,
    } = req.body;
    const hotel = await hotelModel.findById(req.params.id);
    if (!hotel)
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));

    const checkInformated = new Date(checkInDate);
    const checkOutformated = new Date(checkOutDate);

    const booking = await bookingModel.create({
      roomType,
      numberOfGuests,
      numberOfRooms: selectRooms,
      stay,
      checkInDate: checkInformated,
      checkOutDate: checkOutformated,
      date: new Date(),
    });

    // const { ...other } = booking._doc;
    res
      .status(StatusCodes.OK, other)
      .json({ message: "hotel booked successfully", booking, hotel });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};
