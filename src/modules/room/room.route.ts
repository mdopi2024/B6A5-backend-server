import { Router } from "express";
import validateRequest from "../../middleware/zodValidate";
import { roomController } from "./room.controller";
import { createRoomSchema, updateRoomSchema } from "./room.validator";
import { Role } from "../../generated/prisma/browser";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/create-room",
  checkAuth(Role.ADMIN, Role.MANAGER),
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
  checkAuth(Role.ADMIN, Role.MANAGER),
  roomController.deleteRoom
);

router.patch(
  "/update-room/:id",
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateRoomSchema),
  roomController.updateRoom
);

export const roomRouter = router;
