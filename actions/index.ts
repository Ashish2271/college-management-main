'use server'


import { getServerSession } from 'next-auth';
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/utils/auth";



export async function createTimeSlot(formData: FormData) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return { error: "Unauthorized or insufficient permissions" };
      }
    
      const userEmail = session.user.email;
      const user = await prisma.user.findUnique({
        where: { email: userEmail as string }
      })
  
      if (!user) {
        console.error("User not found in the database")
        return
      }
  
  if (!user ) throw new Error("Unauthorized");

  const startTime = new Date(formData.get('startTime') as string);
  const endTime = new Date(formData.get('endTime') as string);
  const dayOfWeek = parseInt(formData.get('dayOfWeek') as string);
  const isRecurring = formData.get('isRecurring') === 'true';

  await prisma.timeSlot.create({
    data: {
      teacherId: user.id,
      dayOfWeek,
      startTime,
      endTime,
      isRecurring,
    },
  });

  revalidatePath('/dashboard');
}

export async function requestBooking(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
  
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string }
    })

    if (!user) {
      console.error("User not found in the database")
      return
    }

if (!user ) throw new Error("Unauthorized");

  const timeSlotId = formData.get('timeSlotId') as string;
  const date = new Date(formData.get('date') as string);
  const reason = formData.get('reason') as string;

  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!timeSlot) throw new Error("Time slot not found");

  await prisma.booking.create({
    data: {
      teacherId: timeSlot.teacherId,
      studentId: user.id,
      timeSlotId,
      date,
      reason,
      status: 'PENDING',
    },
  });

  revalidatePath('/dashboard');
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
      return { error: "Unauthorized or insufficient permissions" };
    }
  
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string }
    })

    if (!user) {
      console.error("User not found in the database")
      return
    }

if (!user ) throw new Error("Unauthorized");
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status, notes },
  });

  revalidatePath('/dashboard');
}


