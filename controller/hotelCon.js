import hotelModel from "../model/hotel.js";
import roomModel from "../model/room.js";
import ownerModel from "../model/hotelOwner.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";

//jwt
export const authentication = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.HBOcookies;
  if (!token || token == "")
    return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, process.env.HOTEL_JWT_KEY);
  if (!decode) {
    return next(
      new ErrorHandler("Token expired ot Invalid", StatusCodes.NOT_FOUND)
    );
  }
  const user = await ownerModel.findOne({
    _id: decode.userId,
    role: decode.role,
  });

  if (!user) {
    return next(
      new ErrorHandler("Token expired or Invalid", StatusCodes.NOT_FOUND)
    );
  }
  req.UserId = user.id;
  next();
});

//hotelOwnerRegister
export const hotelOwnerRegister = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const admin = new ownerModel({
      hotelOwner: req.body.user,
      email: req.body.email,
      password: hashedpassword,
    });
    await admin.save();
    res.status(StatusCodes.OK).json({ message: "Singup successfully" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

//hotelOwnrLogin
export const hotelOwnerLogin = catchAsyncError(async (req, res, next) => {
  try {
    const user = await ownerModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return next(new ErrorHandler("User not found!", StatusCodes.NOT_FOUND));
    }
    const validatepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatepassword) {
      return next(
        new ErrorHandler(" Incorrect Password", StatusCodes.NOT_FOUND)
      );
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.HOTEL_JWT_KEY,
      {
        expiresIn: "7d",
      }
    );
    res
      .status(StatusCodes.OK)
      .cookie("HBOcookies", token, {
        httpOnly: true,
        path: "/",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "signup" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

// create hotels and rooms
export const createHotel = catchAsyncError(async (req, res, next) => {
  const {
    roomType,
    name,
    description,
    address,
    city,
    country,
    starRatings,
    price,
  } = req.body;
  const roomtypeenum = ["single-bed", "double-bed", "king-size"];
  if (typeof roomType === "string") {
    if (!roomtypeenum.includes(roomType)) {
      return next(
        new ErrorHandler(
          "Please provide room type Single-bed,double-bed,king-size",
          StatusCodes.BAD_REQUEST
        )
      );
    }
  } else if (typeof roomType === "object") {
    if (roomType.length > 3 || roomType <= 0) {
      return next(
        new ErrorHandler(
          "Please provide room type Single-bed,double-bed,king-size",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    roomType.forEach((element) => {
      if (!roomtypeenum.includes(element)) {
        return next(
          new ErrorHandler(
            "Please provide room type Single-bed,double-bed,king-size",
            StatusCodes.BAD_REQUEST
          )
        );
      }
    });
  }

  try {
    const user = await ownerModel.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ErrorHandler(
          "Create your account before post your hotel",
          StatusCodes.NOT_FOUND
        )
      );
    }
    const createhotel = await hotelModel.create({
      name,
      description,
      address,
      city,
      country,
      starRatings,
      price,
    });

    const hotelroom = await roomModel.create({
      hotel: createhotel.id,
      ...req.body,
    });

    res.status(StatusCodes.OK).json({ message: "Hotel added", hotelroom });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//update hotels
export const updateHotel = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    address,
    city,
    country,
    starRatings,
    price,
    availableInRoom,
    roomType,
  } = req.body;
  try {
    const updatehotel = await hotelModel.findByIdAndUpdate(req.params.id, {
      name,
      description,
      address,
      city,
      country,
      starRatings,
      price,
      availableInRoom,
      roomType,
    });
    if (!updatehotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ message: "updated" });
  } catch (error) {
    throw new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

//delete hotels
export const deleteHotel = catchAsyncError(async (req, res, next) => {
  try {
    const deletehotel = await hotelModel.findByIdAndDelete(req.params.id);
    if (!deletehotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ message: "deleted" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//cookie logout
export const cLogout = catchAsyncError(async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("HBcookies", {
        httpOnly: true,
        path: "/",
        secure: false,
        maxAge: 0,
      })
      .json({ message: "logout" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});
