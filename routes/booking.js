import express from "express";
const router = express.Router();

import { Hotel, searchBar, Booking } from "../controller/bookingCon.js";
import { authentication } from "../controller/userCon.js";

router.route("/hotel").get(Hotel);
// router.route("/hotels").get(Hotels);
router.route("/searchbar").get(searchBar);
router.route("/:id/booking").post(authentication, Booking);

export default router;
