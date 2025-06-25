import userModel from "../model/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";

// jwt
export const authentication = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.cookie;
  if (!authHeader || authHeader == null || authHeader === undefined) {
    if (!token)
      return next(new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split("=")[1];
  if (!token)
    return next(new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED));

  const decode = jwt.verify(token, "mf48752kdhejjhksu398");
  if (!decode) {
    return next(new ErrorHandler("Token expired", StatusCodes.NOT_FOUND));
  }
  const user = await ownerModel.findOne({ _id: decode.userId });

  if (!user) {
    return next(new ErrorHandler("Token expired", StatusCodes.NOT_FOUND));
  }
  next();
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ajay161002@gmail.com",
    pass: "xlkoalncssnxrziz",
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//user register
export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const { username, email } = req.body;
    let user = await userModel.findOne({ email });
    if (user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });

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

    await transporter.sendMail({
      from: "ajay161002@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `your OTP is: ${otp}`,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "User register. Please verify OTP sent to email." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error registering user ", error: error.stack });
  }
};

// verify OTP
export const verifyOTP = catchAsyncError(async (req, res) => {
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
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error verifying OTP", error });
  }
});

// Resend OTP
export const resendOTP = catchAsyncError(async (req, res) => {
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
      from: "ajay161002@gmail.com",
      to: email,
      subject: "Resend OTP verified",
      text: `your new OTP is: ${otp}`,
    });
    res.json({ message: "OTP Resend successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error resending OTP:", error });
  }
});

// Login User
export const login = catchAsyncError(async (req, res) => {
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

    if (user.password !== validatepassword)
      return next(
        new ErrorHandler("Incorrect password", StatusCodes.NOT_FOUND)
      );

    if (!user.isVerified) {
      return next(
        new ErrorHandler(
          "Email not verified. Please verify OTP.",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const token = jwt.sign({ userId: user.id }, "mf48752kdhejjhksu398", {
      expiresIn: "7d",
    });
    res.status(StatusCodes.OK).cookie("Cookiesss", token, {
      httpOnly: true,
      path: "/",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error log in:", error });
  }
});
