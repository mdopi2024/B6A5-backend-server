/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { Decimal } from "@prisma/client/runtime/client";
import { BookingStatus, RoomStatus, Role, PaymentStatus } from "../../generated/prisma/enums";
import { stripe } from "../../config/stripe";
import { envVar } from "../../config/env";
import { v7 as uuidv7 } from 'uuid';


export interface CreateBookingInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  specialRequest?: string;
}

export interface UpdateBookingInput {
  checkInDate?: string;
  checkOutDate?: string;
  specialRequest?: string;
}

export interface UpdateBookingStatusInput {
  bookingStatus: BookingStatus;
}

// const createBooking = async (payload: CreateBookingInput, userId: string) => {
//   const { roomId, checkInDate, checkOutDate, specialRequest } = payload;

//   // Parse dates
//   const checkIn = new Date(checkInDate + "T00:00:00Z");
//   const checkOut = new Date(checkOutDate + "T00:00:00Z");

//   // ✅ Fix 1: Time বাদ দিয়ে শুধু date compare
//   const today = new Date();

//   if (checkIn < today || checkOut < today) {
//     throw new AppError(status.BAD_REQUEST, "Booking dates cannot be in the past");
//   }

//   // ✅ Fix 2: checkIn আর checkOut same বা উল্টো হলে error
//   if (checkIn >= checkOut) {
//     throw new AppError(status.BAD_REQUEST, "Check-out date must be after check-in date");
//   }

//   // Check if room exists and is available
//   const room = await prisma.room.findUnique({
//     where: { id: roomId },
//   });

//   if (!room) {
//     throw new AppError(status.NOT_FOUND, "Room not found");
//   }

//   if (room.status !== RoomStatus.AVAILABLE) {
//     throw new AppError(status.BAD_REQUEST, "Room is not available for booking");
//   }

//   // Check for conflicting bookings
//   const conflictingBooking = await prisma.booking.findFirst({
//     where: {
//       roomId,
//       OR: [
//         {
//           AND: [
//             { checkInDate: { lte: checkIn } },
//             { checkOutDate: { gt: checkIn } },
//           ],
//         },
//         {
//           AND: [
//             { checkInDate: { lt: checkOut } },
//             { checkOutDate: { gte: checkOut } },
//           ],
//         },
//         {
//           AND: [
//             { checkInDate: { gte: checkIn } },
//             { checkOutDate: { lte: checkOut } },
//           ],
//         },
//       ],
//       bookingStatus: {
//         in: [BookingStatus.PENDING, BookingStatus.CHECKED_IN, BookingStatus.CONFIRMED],
//       },
//     },
//   });

//   if (conflictingBooking) {
//     throw new AppError(status.CONFLICT, "Room is already booked for the selected dates");
//   }

//   // Calculate total nights and price
//   const totalNights = Math.ceil(
//     (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
//   );

//   // ✅ Fix 3: Decimal multiplication
//   const totalPrice = Number(room.pricePerNight) * totalNights;

//   const result = await prisma.$transaction(async (tx) => {
//     // Create the booking
//     const booking = await tx.booking.create({
//       data: {
//         userId,
//         roomId,
//         checkInDate: checkIn,
//         checkOutDate: checkOut,
//         totalNights,
//         totalPrice,
//         specialRequest
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         room: {
//           select: {
//             id: true,
//             roomNumber: true,
//             title: true,
//             pricePerNight: true,
//           },
//         },
//       },
//     });

//     const updateRoomStatus = await tx.room.update({
//       where: {
//         id: room.id
//       },
//       data: {
//         status: RoomStatus.BOOKED
//       }
//     })

//     //  payment logic

//     const transactionId = String(uuidv7());

//     const createPayment = await tx.payment.create({
//       data: {
//         bookingId: booking.id,
//         amount: totalPrice,
//         transactionId
//       }
//     })


//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: "bdt",
//             product_data: {
//               name: `Room booking ${room.title}`,
//             },
//             unit_amount: room.pricePerNight * 100,
//           },
//           quantity: 1,
//         }
//       ],
//       metadata: {
//        bookingId:booking.id,
//        paymentId:createPayment.id
//       },

//       success_url: `${envVar.FRONTEND_URL}/dashboard/payment/payment-success`,

//       cancel_url: `${envVar.FRONTEND_URL}/dashboard/appointments`,
//     })


//     return {booking,payment:createPayment,url:session.url}

//   })
//   return{
//     booking:result.booking,
//     payment:result.payment,
//     paymentUrl:result.url
//   }
// };

const createBooking = async (payload: CreateBookingInput, userId: string) => {
  const { roomId, checkInDate, checkOutDate, specialRequest } = payload;

  // ✅ Timezone bug fix
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const checkIn = new Date(checkInDate + "T00:00:00Z");
  const checkOut = new Date(checkOutDate + "T00:00:00Z");

  // ✅ Date validation
  if (checkIn < today || checkOut < today) {
    throw new AppError(status.BAD_REQUEST, "Booking dates cannot be in the past");
  }

  if (checkIn >= checkOut) {
    throw new AppError(status.BAD_REQUEST, "Check-out date must be after check-in date");
  }

  // ✅ totalNights transaction এর বাইরে calculate
  const totalNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  // ✅ সব DB কাজ transaction এর ভেতরে — Race condition fix
  const result = await prisma.$transaction(async (tx) => {

    // ✅ Room check transaction এর ভেতরে
    const room = await tx.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError(status.NOT_FOUND, "Room not found");
    }

    // ✅ Conflict check transaction এর ভেতরে
    const conflictingBooking = await tx.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } },
            ],
          },
          {
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: checkIn } },
              { checkOutDate: { lte: checkOut } },
            ],
          },
        ],
        bookingStatus: {
          in: [BookingStatus.PENDING, BookingStatus.CHECKED_IN, BookingStatus.CONFIRMED],
        },
      },
    });

    if (conflictingBooking) {
      throw new AppError(status.CONFLICT, "Room is already booked for the selected dates");
    }

    // ✅ Decimal fix
    const totalPrice = Number(room.pricePerNight) * totalNights;

    // ✅ Booking create
    const booking = await tx.booking.create({
      data: {
        userId,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalNights,
        totalPrice,
        specialRequest,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, roomNumber: true, title: true, pricePerNight: true } },
      },
    });

    // ✅ Room status update
    await tx.room.update({
      where: { id: room.id },
      data: { status: RoomStatus.BOOKED },
    });

    // ✅ Payment record create
    const transactionId = String(uuidv7());
    const payment = await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: totalPrice,
        transactionId,
      },
    });

    // ✅ শুধু DB data return — Stripe নেই এখানে
    return { booking, payment, room };
  });
console.log("booking_id",result.booking.id)
  // ✅ Stripe call সম্পূর্ণ transaction এর বাইরে
  let session;

  // ✅ Case 1: Stripe API call ই fail করলে
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Room booking: ${result.room.title}`,
            },
            // ✅ Decimal fix
            unit_amount: Number(result.room.pricePerNight) * 100,
          },
          // ✅ প্রতি রাতের জন্য quantity
          quantity: totalNights,
        },
      ],
      metadata: {
        bookingId: result.booking.id,
        paymentId: result.payment.id,
      },
      success_url: `${envVar.FRONTEND_URL}/create-booking/success`,
      cancel_url: `${envVar.FRONTEND_URL}/create-booking/cancel`,
    });
  } catch (error:any) {
    // Network error, invalid key, wrong data ইত্যাদি
    await prisma.payment.update({
      where: { id: result.payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Payment gateway error, please try again"
    );
  }

  // ✅ Case 2: Session আসছে কিন্তু url null
  if (!session.url) {
    await prisma.payment.update({
      where: { id: result.payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Payment session creation failed"
    );
  }

  // ✅ সব ঠিক আছে — return করো
  return {
    booking: result.booking,
    payment: result.payment,
    paymentUrl: session.url,
  };
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  return booking;
};

export const getBookingsByUserIdAndEmail = async (userId: string, userEmail: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      user: {
        email: userEmail,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const updateBooking = async (bookingId: string, payload: UpdateBookingInput, userId: string) => {
  // Get the existing booking
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: true,
    },
  });

  if (!existingBooking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  // Check if the booking belongs to the authenticated user
  if (existingBooking.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You can only update your own bookings");
  }

  // Check if booking status is PENDING
  if (existingBooking.bookingStatus !== BookingStatus.PENDING) {
    throw new AppError(status.BAD_REQUEST, "Only PENDING bookings can be updated");
  }

  const { checkInDate, checkOutDate, specialRequest } = payload;

  // Use existing dates if not provided
  const newCheckIn = checkInDate ? new Date(checkInDate + "T00:00:00Z") : existingBooking.checkInDate;
  const newCheckOut = checkOutDate ? new Date(checkOutDate + "T00:00:00Z") : existingBooking.checkOutDate;

  // Validate new dates if provided
  if (checkInDate || checkOutDate) {
    const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // newCheckIn.setHours(0, 0, 0, 0);
    // newCheckOut.setHours(0, 0, 0, 0);

    if (newCheckIn < today || newCheckOut < today) {
      throw new AppError(status.BAD_REQUEST, "Booking dates cannot be in the past");
    }

    if (newCheckIn >= newCheckOut) {
      throw new AppError(status.BAD_REQUEST, "Check-out date must be after check-in date");
    }

    // Check for conflicting bookings with new dates
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: existingBooking.roomId,
        id: { not: bookingId }, // Exclude current booking
        OR: [
          {
            AND: [
              { checkInDate: { lte: newCheckIn } },
              { checkOutDate: { gt: newCheckIn } },
            ],
          },
          {
            AND: [
              { checkInDate: { lt: newCheckOut } },
              { checkOutDate: { gte: newCheckOut } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: newCheckIn } },
              { checkOutDate: { lte: newCheckOut } },
            ],
          },
        ],
        bookingStatus: {
          in: [BookingStatus.PENDING],
        },
      },
    });

    if (conflictingBooking) {
      throw new AppError(status.CONFLICT, "Room is already booked for the selected dates");
    }
  }

  // Calculate new total nights and price if dates changed
  let totalNights = existingBooking.totalNights;
  let totalPrice = existingBooking.totalPrice;

  if (checkInDate || checkOutDate) {
    totalNights = Math.ceil(
      (newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    totalPrice = new Decimal(existingBooking.room.pricePerNight).mul(totalNights);
  }

  // Update the booking
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      checkInDate: checkInDate ? newCheckIn : undefined,
      checkOutDate: checkOutDate ? newCheckOut : undefined,
      totalNights,
      totalPrice,
      specialRequest: specialRequest !== undefined ? specialRequest : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
  });

  return updatedBooking;
};


const updateBookingStatus = async (
  bookingId: string,
  payload: UpdateBookingStatusInput,
  userId: string,
  userRole: Role
) => {
  const { bookingStatus } = payload;

  // Find the existing booking
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      room: { select: { id: true, roomNumber: true, title: true, pricePerNight: true } },
    },
  });

  // Booking not found
  if (!existingBooking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  // Guest permission check
  if (userRole === Role.GUEST) {
    // Guest can only update their own booking
    if (existingBooking.userId !== userId) {
      throw new AppError(status.FORBIDDEN, "You can only update your own bookings");
    }

    // Guest can only cancel booking
    if (bookingStatus !== BookingStatus.CANCELLED) {
      throw new AppError(status.FORBIDDEN, "Guests can only cancel bookings");
    }

    // Guest can only cancel PENDING booking
    if (existingBooking.bookingStatus !== BookingStatus.PENDING) {
      throw new AppError(status.BAD_REQUEST, "Only PENDING bookings can be cancelled by guests");
    }
  }

  // Room status changes based on booking status
  const roomStatusMap: Partial<Record<BookingStatus, RoomStatus>> = {
    [BookingStatus.CONFIRMED]: RoomStatus.BOOKED,
    [BookingStatus.CANCELLED]: RoomStatus.AVAILABLE,
    [BookingStatus.CHECKED_IN]: RoomStatus.BOOKED,
    [BookingStatus.CHECKED_OUT]: RoomStatus.AVAILABLE,
  };

  const newRoomStatus = roomStatusMap[bookingStatus];

  // Update booking and room status together using transaction
  const updatedBooking = await prisma.$transaction(async (tx) => {
    // Step 1: Update booking status
    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: { bookingStatus },
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, roomNumber: true, title: true, pricePerNight: true } },
      },
    });

    // Step 2: Update room status if needed (skip if PENDING)
    if (newRoomStatus) {
      await tx.room.update({
        where: { id: existingBooking.roomId },
        data: { status: newRoomStatus },
      });
    }

    return booking;
  });

  return updatedBooking;
};

export const bookingServices = {
  updateBookingStatus,
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserIdAndEmail,
  updateBooking,
  updateBookingStatus,
};