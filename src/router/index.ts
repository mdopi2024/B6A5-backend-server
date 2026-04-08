import { Router } from "express";
import { authRoter } from "../modules/auth/auth.router";
import { managerRouter } from "../modules/manager/manager.route";
import { roomRouter } from "../modules/room/room.route";
import { bookingRouter } from "../modules/booking/booking.route";

const router = Router();

router.use("/auth", authRoter);
router.use("/manager", managerRouter);
router.use("/room", roomRouter);
router.use("/booking", bookingRouter);

export default router