'use server'

import { authOptions } from "@/utils/auth";

import { prisma } from "@/utils/prismaDB"
import { BookingStatus } from "@prisma/client"
import { getServerSession } from "next-auth"



export async function getTeachersByDepartment(department: string) {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        department: department
      },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    })
    return teachers
  } catch (error) {
    console.error('Error fetching teachers:', error)
    throw new Error('Failed to fetch teachers')
  }
}


export async function getTeacherSchedule(teacherId: string) {
    try {
      const timeSlots = await prisma.timeSlot.findMany({
        where: {
          teacherId: teacherId,
        },
        include: {
          Booking: true,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      })
      
      console.log('Fetched time slots:', timeSlots) // Debug log
      return timeSlots
    } catch (error) {
      console.error('Error in getTeacherSchedule:', error)
      throw error
    }
  }
  
  export async function createBooking(data: {
    teacherId: string
 
    timeSlotId: string
 
    reason: string
  }) {
    const session = await getServerSession(authOptions)
    console.log("trying",session)
    if (!session || !session.user) {
        return { error: "Unauthorized or insufficient permissions" };
      }
    
      const userEmail = session.user.email;
      const user = await prisma.user.findUnique({
        where: { email: userEmail as string }
      })
      console.log(user)
  
      if (!user) {
        console.error("User not found in the database")
        return
      }
  
  if (!user ) throw new Error("Unauthorized");

    try {
        console.log("trying",data)
      const booking = await prisma.booking.create({
        data: {
          teacherId: data.teacherId,
          studentId: "cm38u752f0002u0byrl1ivosq",
          timeSlotId: data.timeSlotId,
       
          reason: data.reason,
          status: BookingStatus.PENDING
        }

      })
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Failed to create booking')
    }
  }