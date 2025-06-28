import express from "express";
const router = express.Router();
import {
  authentication,
  adminSingup,
  adminSignin,
  adminVerify,
  notVerified,
} from "../controller/adminCon.js";
import { updateHotel } from "../controller/hotelCon.js";

// router.route("/signup").post(adminSingup)
router.route("/signin").post(adminSignin);
router.route("/:id/adminupdate").put(authentication, updateHotel);
router.route("/:id/verify").put(authentication, adminVerify);
router.route("/verified").get(authentication, notVerified);

export default router;
