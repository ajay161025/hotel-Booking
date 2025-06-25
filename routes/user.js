import express from "express";
const router = express.Router();
import {
 
  register,
  verifyOTP,
  resendOTP,
  login,
} from "../controller/userCon.js";


router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);



export default router;
