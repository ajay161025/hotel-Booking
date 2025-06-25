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
  const authHeader = req.headers.cookie;
  if (!authHeader || authHeader == null || authHeader === undefined) {
    if (!token)
      return next(new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split("=")[1];
  if (!token)
    return next(new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, "gyghjy545tg56yuyg");
  if (!decode) {
    return next(new ErrorHandler("Token expired", StatusCodes.NOT_FOUND));
  }
  const user = await ownerModel.findOne({ _id: decode.userId });

  if (!user) {
    return next(new ErrorHandler("Token expired", StatusCodes.NOT_FOUND));
  }
  next();
});
//signup
export const adminSingup = async (req, res) => {
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

// signin
export const adminSignin = catchAsyncError(async (req, res) => {
  try {
    const user = await adminModel.findOne({ admin: req.body.user });
    if (!user) {
      return next(new ErrorHandler("User not found!", StatusCodes.NOT_FOUND));
    }
    const token = jwt
      .sign({ userId: user.id }, "gyghjy545tg56yuyg", {
        expiresIn: "7d",
      })
      .res.status(200)
      .cookie("Cookiesss", token, {
        httpOnly: true,
        path: "/",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    res.status(StatusCodes.OK).json({ message: "Signup " });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});

//admin update hotel
export const updateHotel = async (req, res) => {
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
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Hotel not found" });
    }
    res.status(StatusCodes.OK).json({ message: "Updated by admin" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

//admin delete hotel
export const deleteHotel = async (req, res) => {
  try {
    const deletehotel = await hotelModel.findByIdAndDelete(req.params.id);
    if (!deleteHotel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Hotel not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Deleted by admin", deletehotel });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

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
export const notVerified = catchAsyncError(async (req, res) => {
  try {
    const notverified = await hotelModel.find({
      isVerified: "not-verified",
    });
    if (!notverified) {
      return next(
        new ErrorHandler("already verified hotel", StatusCodes.NOT_FOUND)
      );
    }
    res.status(StatusCodes.OK).json(notverified);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
});

//admin verification
export const adminVerify = async (req, res) => {
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};
