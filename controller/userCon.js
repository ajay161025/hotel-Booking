import userModel from "../model/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";
import dotenv from "dotenv";
dotenv.config("../.env");

// jwt
export const authentication = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.HBUcookies;
  if (!token || token == "")
    return next(new ErrorHandler("Ivalid token", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, process.env.USER_JWT_KEY);
  if (!decode) {
    return next(
      new ErrorHandler("Token expired or Invalid", StatusCodes.NOT_FOUND)
    );
  }
  const user = await userModel.findOne({
    _id: decode.userId,
    role: decode.role,
  });

  if (!user) {
    return next(
      new ErrorHandler("Token expired or Invalid", StatusCodes.NOT_FOUND)
    );
  }
  req.hotelUser=user.id;
  next();
});

// otp mail and pass -env
const gmail = process.env.OTP_GMAIL;
const password = process.env.G_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: gmail,
    pass: password,
  },
});

//generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//user register
export const register = catchAsyncError(async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const { username, email } = req.body;
    let user = await userModel.findOne({ email });
    if (user)
      return next(
        new ErrorHandler("User already exists", StatusCodes.BAD_REQUEST)
      );

    const otp = generateOTP();
    const optExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log(optExpiry);

    user = new userModel({
      username,
      email,
      password: hashedpassword,
      otpExpiry: optExpiry,
      otp,
    });
    await user.save();
    // console.log("--------------------",gmail, password);

    await transporter.sendMail({
      from: gmail,
      to: email,
      subject: "OTP Verification",
      text: `your OTP is: ${otp}`,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "User register. Please verify OTP sent to email" });
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(
        "Error registering user ",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ message: "Error registering user ", error: error.stack });
  }
});

// verify OTP
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
      return next(new ErrorHandler("User not found", StatusCodes.BAD_REQUEST));

    if (user.isVerified)
      return next(
        new ErrorHandler("User already verified", StatusCodes.BAD_REQUEST)
      );

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      console.log(user.otp, otp);
      return next(
        new ErrorHandler("Invalid or Expired OTP", StatusCodes.BAD_REQUEST)
      );
    }
    (user.isVerified = true),
      (user.otp = undefined),
      (user.otpExpiry = undefined),
      await user.save();

    res.json({ message: "Email verified successfully. You can login now.." });
  } catch (error) {
    return next(
      new ErrorHandler("Error verifying OTP", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// Resend OTP
export const resendOTP = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
      return next(new ErrorHandler("User not found", StatusCodes.BAD_REQUEST));

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.OTP_GMAIL,
      to: email,
      subject: "Resend OTP verified",
      text: `your new OTP is: ${otp}`,
    });
    res.json({ message: "OTP Resend successfully" });
  } catch (error) {
    return next(
      new ErrorHandler("Error resending OTP", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// Login User
export const login = catchAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user)
      return next(new ErrorHandler("User not found", StatusCodes.BAD_REQUEST));

    const validatepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatepassword) {
      return next(
        new ErrorHandler("Incorrect password", StatusCodes.NOT_FOUND)
      );
    }

    if (!user.password) {
      return next(
        new ErrorHandler("Incorrect password", StatusCodes.NOT_FOUND)
      );
    }

    if (!user.isVerified) {
      return next(
        new ErrorHandler(
          "Email not verified. Please verify OTP.",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.USER_JWT_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.status(StatusCodes.OK).cookie("HBUcookies", token, {
      httpOnly: true,
      path: "/",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successfully" });
  } catch (error) {
    return next(
      new ErrorHandler("Error log in", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});
