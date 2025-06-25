import express from "express";
const router = express.Router();

import {
  authentication,
  hotelOwnerRegister,
  hotelOwnerLogin,
  createHotel,
  deleteHotel,
  updateHotel,
 
} from "../controller/hotelCon.js";

router.route("/hotelregister").post(hotelOwnerRegister);
router.route("/hotellogin").post(hotelOwnerLogin);
router.route("/addhotel").post(authentication,createHotel);
router.route("/:id/ud").delete(deleteHotel).put(authentication,updateHotel);





export default router;
