'use server'

import { revalidatePath } from "next/cache";
import { SlotStatus } from "@prisma/client";
import { prisma } from "@/utils/prismaDB";

export async function getTeacherSchedule(teacherId: string) {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
       teacherId,
      },
      include: {
        Booking: {
          include: {
            student: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return timeSlots;
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    throw new Error('Failed to fetch teacher schedule');
  }
}

export async function updateTeacherSlot(
  teacherId: string,
  data: {
    dayOfWeek: number;
    hour: number;
    status: SlotStatus;
  }
) {
  try {
    const { dayOfWeek, hour, status } = data;
    
    // Create date objects for start and end times
    const startTime = new Date();
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(hour + 1, 0, 0, 0);

    // Update or create the time slot with status
    const timeSlot = await prisma.timeSlot.upsert({
      where: {
        teacherId_dayOfWeek_startTime_endTime: {
          teacherId,
          dayOfWeek,
          startTime,
          endTime,
        },
      },
      update: {
        status,  // Ensure status is explicitly updated
      },
      create: {
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        status,
        isRecurring: true,
      },
    });

    revalidatePath('/dashboard');  // Revalidate dashboard to ensure fresh data
    return timeSlot;
  } catch (error) {
    console.error('Error updating teacher slot:', error);
    throw new Error('Failed to update teacher slot');
  }
}

export async function initializeTeacherSchedule(teacherId: string) {
  try {
    const days = Array.from({ length: 7 }, (_, i) => i); // 0-6 for Sunday-Saturday
    const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9-17 (9 AM to 5 PM)

    const slots = [];

    for (const day of days) {
      for (const hour of hours) {
        const startTime = new Date();
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date();
        endTime.setHours(hour + 1, 0, 0, 0);

        slots.push({
          teacherId,
          dayOfWeek: day,
          startTime,
          endTime,
          status: 'FREE' as SlotStatus,
          isRecurring: true,
        });
      }
    }

    // Use transaction to ensure all slots are created
    await prisma.$transaction(
      slots.map((slot) =>
        prisma.timeSlot.upsert({
          where: {
            teacherId_dayOfWeek_startTime_endTime: {
              teacherId: slot.teacherId,
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
            },
          },
          update: {
            status: slot.status,  // Update status if slot already exists
          },
          create: slot,
        })
      )
    );

    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error initializing teacher schedule:', error);
    throw new Error('Failed to initialize teacher schedule');
  }
}