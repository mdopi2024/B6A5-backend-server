import { Router } from "express";
import validateRequest from "../../middleware/zodValidate";
import { roomController } from "./room.controller";
import { createRoomSchema } from "./room.validator";

const router = Router();

router.post(
  "/create-room",
  validateRequest(createRoomSchema),
  roomController.createRoom
);

router.get(
  "/get-all-rooms",
  roomController.getAllRooms
);

router.get(
  "/get-room/:id",
  roomController.getRoomById
);

router.delete(
  "/delete-room/:id",
  roomController.deleteRoom
);

export const roomRouter = router;
