import bookingModel from "../model/booking.js";
import hotelModel from "../model/hotel.js";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";
import { bookingCreateSchema } from "../validation/userJoi.js";
import userModel from "../model/user.js";
import roomModel from "../model/room.js";

//searchBar
export const searchBar = catchAsyncError(async (req, res, next) => {
  const { country, city } = req.query;
  const { page, limit } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    const searchbar = await hotelModel
      .find({ country: country, city: city, isVerified: "verified" })
      .skip(skip)
      .limit(parseInt(limit));
    if (!searchbar) {
      return next(
        new ErrorHandler("Something went wrong", StatusCodes.NOT_FOUND)
      );
    }
    res.status(StatusCodes.OK).json(searchbar);
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//view hotel using name
export const Hotel = catchAsyncError(async (req, res, next) => {
  const { name } = req.query;
  try {
    const hotel = await hotelModel.findOne({ name, isVerified: "verified" });
    if (!hotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json(hotel);
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

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
export const Booking = catchAsyncError(async (req, res, next) => {
  const { error } = bookingCreateSchema.validate(req.body, {
    abortEarly: true,
    convert: true,
  });

  if (error) {
    return next(new ErrorHandler(error, StatusCodes.BAD_REQUEST));
  }
  try {
    const {
      roomType,
      selectRooms,
      numberOfGuests,
      checkInDate,
      checkOutDate,
      stay,
      name,
      user,
    } = req.body;
    const hotel = await hotelModel.findById(req.params.id);
    if (!hotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    const checkInformated = new Date(checkInDate);
    const checkOutformated = new Date(checkOutDate);

    const room = await roomModel.findOne({hotel:name.id})


const existbooking = await bookingModel.findOne({hotel:name.id,checkInDate:checkInformated})
if(existbooking){
  return next(new ErrorHandler("", StatusCodes.NOT_FOUND));
}
    const booking = await bookingModel.create({
      hotel: name.id,
      roomType: roomType,
      numberOfGuests: parseInt(numberOfGuests),
      selectRooms: selectRooms,
      stay: stay,
      checkInDate: checkInformated,
      checkOutDate: checkOutformated,
      date: new Date(),
    }); 

    room.numberOfRooms= room.numberOfRooms -1
    await room.save()
    res
      .status(StatusCodes.OK)
      .json({ message: "hotel booked successfully", booking, hotel });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});
