import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { CreateRoomInput } from "./room.validator";

export const createRoom = async (payload: CreateRoomInput) => {
  const { roomNumber, roomType, title, description, pricePerNight, capacity, bedType, images, floor } = payload;

  // Check if room number already exists
  const existingRoom = await prisma.room.findUnique({
    where: { roomNumber },
  });

  if (existingRoom) {
    throw new AppError(status.CONFLICT, "Room with this room number already exists");
  }

  // Create the room
  const room = await prisma.room.create({
    data: {
      roomNumber,
      roomType,
      title,
      description,
      pricePerNight,
      capacity,
      bedType,
      images,
      floor,
    },
  });

  return room;
};

export const getAllRooms = async () => {
  const rooms = await prisma.room.findMany();
  return rooms;
};

export const getRoomById = async (id: string) => {
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found");
  }

  return room;
};

export const deleteRoom = async (id: string) => {
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found");
  }

  const deletedRoom = await prisma.room.delete({
    where: { id },
  });

  return deletedRoom;
};

export const roomServices = {
  createRoom,
  getAllRooms,
  getRoomById,
  deleteRoom,
};
