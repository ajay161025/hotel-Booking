import express from "express";
const router = express.Router();

import {
  authentication,
  hotelOwnerRegister,
  hotelOwnerLogin,
  createHotel,
  deleteHotel,
  updateHotel,
  cLogout
} from "../controller/hotelCon.js";

router.route("/hotelregister").post(hotelOwnerRegister);
router.route("/hotellogin").post(hotelOwnerLogin);
router.route("/addhotel").post(authentication, createHotel);
router
  .route("/:id/ud")
  .delete(authentication, deleteHotel)
  .put(authentication, updateHotel);


  router.route("/clogout").post(cLogout);
export default router;
