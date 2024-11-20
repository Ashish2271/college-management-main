// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import DepartmentCard from "@/components/DepartmentCard";
import { TeachersDepartment } from "@/lib/data";
import Link from "next/link"; 

import { prisma } from "@/utils/prismaDB";
import TeacherSchedule from "@/components/teacherschedule";
import { getTeacherSchedule } from "@/actions/timetable";

async function getTeacherData(userId: string) {
  const teacher = await prisma.teacher.findFirst({
    where: {
      userId: userId,
    },
  });
  return teacher;
}

export default async function Dashboard() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/signin");
  }

  // Get full user data from database
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  if (user.role === "TEACHER") {
    const teacher = await getTeacherData(user.id);
    const timeSlots = await getTeacherSchedule(teacher.id);
    
    console.log("Fetched Schedule:", JSON.stringify(timeSlots, null, 2));
    
    if (!teacher) {
      return <div>Teacher profile not found</div>;
    }
   
    console.log(timeSlots)
    // Transform schedule into a structured format
    const formattedSchedule = timeSlots.reduce((acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = {};
      }
      
      const hour = new Date(slot.startTime).getHours();
      acc[slot.dayOfWeek][hour] = {
        ...slot,
        status: slot.status,
        bookings: slot.Booking
      };

  console.log('hwww',formattedSchedule)
      
      return acc;

      
    }, {});
  
    return (
      <main className="p-4 max-sm:pb-20">
        <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
        <Link 
            href={`/dashboard/timetable/CSE/${teacher.username}/${teacher.id}/booking`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Manage Booking
          </Link>
        <TeacherSchedule 
          teacherId={teacher.id} 
          initialSchedule={formattedSchedule} 
        />
      </main>
    );
  }

  // Student view
  return (
    <main className="p-4 max-sm:pb-20">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      <div className="flex flex-wrap items-stretch gap-12 max-lg:gap-8 w-full max-sm:flex-col">
        {TeachersDepartment.map((departmentObj) => (
          <DepartmentCard
            key={departmentObj.id}
            name={departmentObj.name}
            code={departmentObj.selectId}
          />
        ))}
      </div>
    </main>
  );
}