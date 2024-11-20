// app/actions/booking.ts
'use server'


import { getServerSession } from "next-auth/next"

import { revalidatePath } from "next/cache"
import { BookingStatus } from "@prisma/client"
import { authOptions } from "@/utils/auth"
import { prisma } from "@/utils/prismaDB"

export async function createBooking(data: {
  teacherId: string
  timeSlotId: string
  reason: string
  requestedStartTime: Date
  requestedEndTime: Date
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { student: true }
  })

  if (!user?.student) {
    return { error: "Student not found" }
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        teacherId: data.teacherId,
        studentId: user.student.id,
        timeSlotId: data.timeSlotId,
        reason: data.reason,
        requestedStartTime: data.requestedStartTime,
        requestedEndTime: data.requestedEndTime,
        status: BookingStatus.PENDING
      }
    })
    
    revalidatePath('/student/bookings')
    return booking
  } catch (error) {
    console.error('Error creating booking:', error)
    return { error: "Failed to create booking" }
  }
}

export async function getStudentBookings() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true }
    })

    if (!user?.student) {
      return { error: "Student not found" }
    }

    const bookings = await prisma.booking.findMany({
      where: {
        studentId: user.student.id
      },
      include: {
        teacher: true,
        timeSlot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return { error: "Failed to fetch bookings" }
  }
}

export async function getPendingBookings(teacherId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        teacherId,
        status: BookingStatus.PENDING
      },
      include: {
        student: true,
        timeSlot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return bookings
  } catch (error) {
    console.error('Error fetching pending bookings:', error)
    return { error: "Failed to fetch pending bookings" }
  }
}

export async function approveBooking(bookingId: string, approvedTimes: {
  startTime: string,
  endTime: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.APPROVED,
        approvedStartTime: new Date(approvedTimes.startTime),
        approvedEndTime: new Date(approvedTimes.endTime)
      }
    })
    await prisma.timeSlot.update({
      where: { 
        id: booking.timeSlotId 
      },
      data: { 
        status: 'BUSY' 
      }
    })
    revalidatePath('/teacher/bookings')
    revalidatePath('/student/bookings')
    return booking
  } catch (error) {
    console.error('Error approving booking:', error)
    return { error: "Failed to approve booking" }
  }
}

export async function rejectBooking(bookingId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.REJECTED
      }
    })

    revalidatePath('/teacher/bookings')
    revalidatePath('/student/bookings')
    return booking
  } catch (error) {
    console.error('Error rejecting booking:', error)
    return { error: "Failed to reject booking" }
  }
}