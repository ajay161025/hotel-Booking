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



router.route("/signup").post(adminSingup);
router.route("/signin").post(adminSignin);
router.route("/:id/adminupdate").put(updateHotel);
router.route("/:id/verify").put(adminVerify);
router.route("/verified").get(notVerified);



export default router;
