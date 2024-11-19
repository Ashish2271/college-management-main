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
    if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
  
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
      include: { student: true } // Include the related student
    });
  
    if (!user || !user.student) {
      return { error: "Student not found" };
    }
  
    const studentId = user.student.id;
  
    try {
      const booking = await prisma.booking.create({
        data: {
          teacherId: data.teacherId,
          studentId: studentId,
          timeSlotId: data.timeSlotId,
          reason: data.reason,
          status: BookingStatus.PENDING
          
        }
      });
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }





export async function getTeacherChats() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role !== 'TEACHER') throw new Error('Unauthorized')

  const chats = await prisma.chatTicket.findMany({
    where: {
      teacherId: user.id,
    },
    include: {
      student: {
        include: {
          student: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: {
              senderRole: 'STUDENT',
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return chats.map(chat => ({
    id: chat.id,
    studentName: chat.student.student?.rollno || 'Unknown Student',
    lastMessage: chat.messages[0]?.content || 'No messages yet',
    status: chat.status,
    timestamp: chat.updatedAt.toLocaleString(),
    unreadCount: chat._count.messages,
  }))
}
