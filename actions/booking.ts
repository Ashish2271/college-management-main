'use server'


import { getServerSession } from 'next-auth'

import { BookingStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/utils/prismaDB'
import { authOptions } from '@/utils/auth'

export async function getPendingBookings(teacherId: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return { error: "Unauthorized" }
  }

  const pendingBookings = await prisma.booking.findMany({
    where: {
      teacherId: teacherId,
      status: BookingStatus.PENDING
    },
    include: {
      student: {
        select: {
          name: true,
          rollno: true
        }
      },
      timeSlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true
        }
      }
    }
  })

  return pendingBookings
}

export async function approveBooking(bookingId: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return { error: "Unauthorized" }
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: BookingStatus.APPROVED 
    },
    include: {
      timeSlot: true
    }
  })

  // Update the corresponding time slot to BUSY
  await prisma.timeSlot.update({
    where: { 
      id: booking.timeSlotId 
    },
    data: { 
      status: 'BUSY' 
    }
  })

  revalidatePath('/teacher/bookings')
  return booking
}

export async function rejectBooking(bookingId: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return { error: "Unauthorized" }
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: BookingStatus.REJECTED 
    }
  })

  revalidatePath('/teacher/bookings')
  return booking
}
