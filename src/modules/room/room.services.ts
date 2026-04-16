import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { CreateRoomInput, UpdateRoomInput } from "./room.validator";
import { RoomStatus } from './../../generated/prisma/enums';


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
  
  if(room.status=== RoomStatus.BOOKED){
    throw new AppError(status.FORBIDDEN , "This room is currently booked and cannot be deleted")
  }
  const deletedRoom = await prisma.room.delete({
    where: { id },
  });

  return deletedRoom;
};



export const updateRoom = async (id: string, payload: UpdateRoomInput) => {
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found");
  }

  // Check if room number is being updated and if it conflicts with another room
  if (payload.roomNumber && payload.roomNumber !== room.roomNumber) {
    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber: payload.roomNumber },
    });

    if (existingRoom) {
      throw new AppError(status.CONFLICT, "Room with this room number already exists");
    }
  }

  // Update the room
  const updatedRoom = await prisma.room.update({
    where: { id },
    data: payload,
  });

  return updatedRoom;
};

export const roomServices = {
  createRoom,
  getAllRooms,
  getRoomById,
  deleteRoom,
  updateRoom,
};
