'use server'

import { prisma } from "@/utils/prismaDB"
import { revalidatePath } from "next/cache"
import { BookingStatus } from "@prisma/client"

export async function getHallBookingsForDay(theaterId: string, date: Date) {
  try {
    // Ensure the date only includes the day portion (no time)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await prisma.hallBooking.findMany({
      where: {
        theaterId: theaterId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        start: 'asc'  // Changed from 'time' to 'start'
      },
      include: {
        User: {
          select: {
            email: true
          }
        }
      }
    })

    return { success: true, data: bookings }
  } catch (error) {
    console.error("Error fetching hall bookings:", error)
    return { success: false, error: "Failed to fetch hall bookings" }
  }
}

export async function createHallBooking({
  theaterId,
  userId,
  start,
  end,
  date,
  reason
}: {
  theaterId: string
  userId: string
  start: number    // Changed from time string to start number (e.g., 9 for 9:00)
  end: number      // Added end time (e.g., 10 for 10:00)
  date: Date
  reason: string
}) {
  try {
    // Check if there's already a booking for this theater that overlaps with the requested time
    const existingBooking = await prisma.hallBooking.findFirst({
      where: {
        theaterId: theaterId,
        date: date,
        status: {
          not: BookingStatus.REJECTED
        },
        OR: [
          // Check for any booking that overlaps with the requested time slot
          {
            AND: [
              { start: { lte: end } },    // Existing booking starts before new booking ends
              { end: { gte: start } }     // Existing booking ends after new booking starts
            ]
          }
        ]
      }
    })

    if (existingBooking) {
      return {
        success: false,
        error: "This time slot overlaps with an existing booking or pending approval"
      }
    }

    // Validate time range
    if (start >= end) {
      return {
        success: false,
        error: "End time must be after start time"
      }
    }
console.log('we')
    // Create the booking
    const booking = await prisma.hallBooking.create({
      data: {
        theaterId,
        userId,
        start,
        end,
        date,
        reason,
        status: BookingStatus.PENDING
      }
    })

    // Revalidate the page to show the new booking
    revalidatePath('/hall-bookings')

    return { success: true, data: booking }
  } catch (error) {
    console.error("Error creating hall booking:", error)
    return { success: false, error: "Failed to create hall booking" }
  }
}