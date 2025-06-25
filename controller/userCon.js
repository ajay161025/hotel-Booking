import userModel from "../model/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../error/catchAsyncError.js";
import ErrorHandler from "../error/ErrorHandler.js";

// jwt
export const authentication = async (req, res, next) => {
  const authHeader = req.headers.cookie;
  if (!authHeader || authHeader == null || authHeader === undefined) {
    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  }

  const token = authHeader.split("=")[1];
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });

  const decode = jwt.verify(token, "mf48752kdhejjhksu398");
  if (!decode) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Token expired" });
  }
  const user = await ownerModel.findOne({ _id: decode.userId });
  
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Token expired" });
  }
  next();
};

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
    if (user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" });

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
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already verified" });
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      console.log(user.otp, otp);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or Expired OTP" });
    }
    (user.isVerified = true),
      (user.otp = undefined),
      (user.otpExpiry = undefined),
      await user.save();

    res.json({ message: "Email verified successfully. You can login now.." });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error verifying OTP", error });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error resending OTP:", error });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
    const validatepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatepassword) {
      return res.status(404).json({ message: "Incorrect password" });
    }

    if (user.password !== validatepassword)
      return res.status(404).json({ message: "Incorrect password" });

    if (!user.isVerified) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email not verified. Please verify OTP." });
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
    // req.session.user = { id: user._id, email: user.email, name: user.name };
    return res.json({ message: "Login successfully" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error log in:", error });
  }
};
