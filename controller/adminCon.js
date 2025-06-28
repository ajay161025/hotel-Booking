import userModel from "../model/user.js";
import hotelModel from "../model/hotel.js";
import adminModel from "../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verify } from "crypto";

import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";

//jwt
export const authentication = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.HBAcookies;
  if (!token || token == "")
    return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, process.env.ADMIN_JWT_KEY);
  if (!decode) {
    return next(
      new ErrorHandler("Token expired or Invalid", StatusCodes.NOT_FOUND)
    );
  }
  const user = await adminModel.findOne({
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
//signup
export const adminSingup = catchAsyncError(async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const admin = new adminModel({
      admin: req.body.user,
      email: req.body.email,
      password: hashedpassword,
    });

    await admin.save();
    res.status(StatusCodes.OK).json({ message: "Signup successfully" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

// signin
export const adminSignin = catchAsyncError(async (req, res, next) => {
  try {
    const user = await adminModel.findOne({ admin: req.body.user , password:req.body.password });
    if (!user) {
      return next(new ErrorHandler("User not found!", StatusCodes.NOT_FOUND));
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ADMIN_JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(StatusCodes.OK).cookie("HBAcookies", token, {
      httpOnly: true,
      path: "/",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({ message: "Signup " });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//admin update hotel
export const updateHotel = catchAsyncError(async (req, res, next) => {
  const { name, description, address, city, country, starRatings } = req.body;
  try {
    const updatehotel = await hotelModel.findByIdAndUpdate(req.params.id, {
      name,
      description,
      address,
      city,
      country,
      starRatings,
    });
    if (!updatehotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ message: "Updated by admin" });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//admin delete hotel
export const deleteHotel = catchAsyncError(async (req, res, next) => {
  try {
    const deletehotel = await hotelModel.findByIdAndDelete(req.params.id);
    if (!deleteHotel) {
      return next(new ErrorHandler("Hotel not found", StatusCodes.NOT_FOUND));
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Deleted by admin", deletehotel });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//admin create hotels - p
// export const createHotel = async (req, res) => {
//   try {
//     const createhotel = await hotelModel.create({
//       user: req.body.user,
//       posthotel: req.body.posthotel,
//       AboutThisProperty: req.body.AboutThisProperty,
//     });
//     res.status(200).json({ message: "Added new hotel", createhotel });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

//not-verified hotels
export const notVerified = catchAsyncError(async (req, res, next) => {
  try {
    const notverified = await hotelModel.find({
      isVerified: "not-verified",
    });
    if (!notverified) {
      return next(
        new ErrorHandler("Already verified hotel", StatusCodes.NOT_FOUND)
      );
    }
    res.status(StatusCodes.OK).json(notverified);
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

//admin verification
export const adminVerify = catchAsyncError(async (req, res, next) => {
  try {
    const verify = await hotelModel.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: req.body.isVerified,
      },
      { returnDocument: "after" }
    );
    res.status(StatusCodes.OK).json(verify);
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});
