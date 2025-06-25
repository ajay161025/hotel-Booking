import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import database from "./config/db.js";
database();
import userRouter from "./routes/user.js";
import bookingRouter from "./routes/booking.js";
import hotelRouter from "./routes/hotel.js";
import adminRouter from "./routes/admin.js";
import { notFound } from "./middleware/notFound.js";
import error from "./error/error.js";
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/hotel", hotelRouter);

app.use(notFound);
app.use(error);

app.listen(process.env.PORT, () => {
  console.log("Server running.....");
});
