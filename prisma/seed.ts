const { PrismaClient, UserRole, BookingStatus } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.student.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create Teachers
  const [teacherSmith, teacherJones] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'smith@university.edu',
        password: await hash('password123', 12),
        role: UserRole.TEACHER,
        teacher: {
          create: {
            username: 'prof_smith',
            department: 'Computer Science'
          }
        }
      },
      include: {
        teacher: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'jones@university.edu',
        password: await hash('password123', 12),
        role: UserRole.TEACHER,
        teacher: {
          create: {
            username: 'dr_jones',
            department: 'Mathematics'
          }
        }
      },
      include: {
        teacher: true
      }
    })
  ])

  // Create Students
  const [studentJohn, studentJane] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@university.edu',
        password: await hash('password123', 12),
        role: UserRole.STUDENT,
        student: {
          create: {
            rollno: 'CS2024001'
          }
        }
      },
      include: {
        student: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@university.edu',
        password: await hash('password123', 12),
        role: UserRole.STUDENT,
        student: {
          create: {
            rollno: 'CS2024002'
          }
        }
      },
      include: {
        student: true
      }
    })
  ])

  // Create TimeSlots
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const timeSlots = await Promise.all([
    prisma.timeSlot.create({
      data: {
        teacherId: teacherSmith.teacher!.id,
        dayOfWeek: 1, // Monday
        startTime: new Date(now.setHours(10, 0, 0, 0)),
        endTime: new Date(now.setHours(11, 0, 0, 0)),
        isRecurring: true
      }
    }),
    prisma.timeSlot.create({
      data: {
        teacherId: teacherSmith.teacher!.id,
        dayOfWeek: 3, // Wednesday
        startTime: new Date(now.setHours(14, 0, 0, 0)),
        endTime: new Date(now.setHours(15, 0, 0, 0)),
        isRecurring: true
      }
    }),
    prisma.timeSlot.create({
      data: {
        teacherId: teacherJones.teacher!.id,
        dayOfWeek: 2, // Tuesday
        startTime: new Date(now.setHours(13, 0, 0, 0)),
        endTime: new Date(now.setHours(14, 0, 0, 0)),
        isRecurring: true
      }
    })
  ])

  // Create Bookings
  await Promise.all([
    prisma.booking.create({
      data: {
        teacherId: teacherSmith.teacher!.id,
        studentId: studentJohn.student!.id,
        timeSlotId: timeSlots[0].id,
        date: nextWeek,
        status: BookingStatus.APPROVED,
        reason: 'Discussion about final project',
        notes: 'Approved. Please bring your project documentation.'
      }
    }),
    prisma.booking.create({
      data: {
        teacherId: teacherJones.teacher!.id,
        studentId: studentJane.student!.id,
        timeSlotId: timeSlots[2].id,
        date: nextWeek,
        status: BookingStatus.PENDING,
        reason: 'Need help with calculus homework'
      }
    }),
    prisma.booking.create({
      data: {
        teacherId: teacherSmith.teacher!.id,
        studentId: studentJane.student!.id,
        timeSlotId: timeSlots[1].id,
        date: nextWeek,
        status: BookingStatus.REJECTED,
        reason: 'Discuss internship opportunities',
        notes: 'Please book a slot next week as I will be attending a conference.'
      }
    })
  ])

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })