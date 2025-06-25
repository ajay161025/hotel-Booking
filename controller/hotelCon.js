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
  const authHeader = req.headers.cookie;
  if (!authHeader || authHeader == null || authHeader === undefined) {
    if (!token)
      return next(new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split("=")[1];
  if (!token || token == "")
    return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, "ifhefceuied83833");
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
  next();
});

//hotelOwnerRegister
export const hotelOwnerRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const admin = new ownerModel({
      hotelOwner: req.body.user,
      email: req.body.email,
      password: hashedpassword,
    });

    await admin.save();
    res.status(StatusCodes.OK).json({ message: "Signup successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

//hotelOwnrLogin
export const hotelOwnerLogin = catchAsyncError(async (req, res) => {
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
      { userId: user.id, role: hotel - owner.role },
      "ifhefceuied83833",
      {
        expiresIn: "7d",
      }
    );
    res
      .status(StatusCodes.OK)
      .cookie("t", token, {
        httpOnly: true,
        path: "/",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "signup " });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});

// create hotels and rooms
export const createHotel = catchAsyncError(async (req, res) => {
  try {
    const user = await ownerModel.findOne({ email: req.body.email });
    if (!user) {
      new ErrorHandler(
        " Create your account before post your hotel",
        StatusCodes.NOT_FOUND
      );
    }

    const createhotel = await hotelModel.create(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Your hotel posted successfully ", createhotel });
    const hotelroom = await roomModel.create(req.body);
    res.status(StatusCodes.OK).json({ message: "Room added", hotelroom });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});

//update hotels
export const updateHotel = catchAsyncError(async (req, res) => {
  const { name, description, address, city, country, starRatings, price } =
    req.body;
  try {
    const updatehotel = await hotelModel.findByIdAndUpdate(req.params.id, {
      name,
      description,
      address,
      city,
      country,
      starRatings,
      price,
    });
    if (!updatehotel) {
      new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({ message: "updated" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});

//delete hotels
export const deleteHotel = catchAsyncError(async (req, res) => {
  try {
    const deletehotel = await hotelModel.findByIdAndDelete(req.params.id);
    if (!deletehotel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Hotel not found" });
    }
    res.status(StatusCodes.OK).json({ message: "deleted" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});
