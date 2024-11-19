// const { PrismaClient, UserRole, BookingStatus } = require('@prisma/client')
// const { hash } = require('bcryptjs')

// const prisma = new PrismaClient()

// async function main() {
//   // Clear existing data
//   await prisma.booking.deleteMany()
//   await prisma.timeSlot.deleteMany()
//   await prisma.teacher.deleteMany()
//   await prisma.student.deleteMany()
//   await prisma.account.deleteMany()
//   await prisma.session.deleteMany()
//   await prisma.user.deleteMany()

//   // Create Teachers
//   const teachers = await Promise.all([
//     prisma.user.create({
//       data: {
//         email: 'varun.sharma@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.TEACHER,
//         teacher: {
//           create: {
//             username: 'varun_sharma',
//             department: 'CSE'
//           }
//         }
//       },
//       include: {
//         teacher: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'vaibhav.gupta@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.TEACHER,
//         teacher: {
//           create: {
//             username: 'vaibhav_gupta',
//             department: 'CSE'
//           }
//         }
//       },
//       include: {
//         teacher: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'priyanka.gupta@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.TEACHER,
//         teacher: {
//           create: {
//             username: 'priyanka_gupta',
//             department: 'CSE'
//           }
//         }
//       },
//       include: {
//         teacher: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'manish.garg@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.TEACHER,
//         teacher: {
//           create: {
//             username: 'manish_garg',
//             department: 'CSE'
//           }
//         }
//       },
//       include: {
//         teacher: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'harsh.trivedi@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.TEACHER,
//         teacher: {
//           create: {
//             username: 'harsh_trivedi',
//             department: 'CSE'
//           }
//         }
//       },
//       include: {
//         teacher: true
//       }
//     })
//   ])

//   // Create Students
//   const students = await Promise.all([
//     prisma.user.create({
//       data: {
//         email: 'keshav@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.STUDENT,
//         student: {
//           create: {
//             rollno: 'CSE2024001'
//           }
//         }
//       },
//       include: {
//         student: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'shyam@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.STUDENT,
//         student: {
//           create: {
//             rollno: 'CSE2024002'
//           }
//         }
//       },
//       include: {
//         student: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'pranvi@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.STUDENT,
//         student: {
//           create: {
//             rollno: 'CSE2024003'
//           }
//         }
//       },
//       include: {
//         student: true
//       }
//     }),
//     prisma.user.create({
//       data: {
//         email: 'ayush@university.edu',
//         password: await hash('password123', 12),
//         role: UserRole.STUDENT,
//         student: {
//           create: {
//             rollno: 'CSE2024004'
//           }
//         }
//       },
//       include: {
//         student: true
//       }
//     })
//   ])

//   // Create TimeSlots
//   const now = new Date()
//   const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

//   // Create time slots for all teachers
//   const timeSlots = await Promise.all(
//     teachers.flatMap(teacher => [
//       prisma.timeSlot.create({
//         data: {
//           teacherId: teacher.teacher.id,
//           dayOfWeek: 1, // Monday
//           startTime: new Date(now.setHours(10, 0, 0, 0)),
//           endTime: new Date(now.setHours(11, 0, 0, 0)),
//           isRecurring: true
//         }
//       }),
//       prisma.timeSlot.create({
//         data: {
//           teacherId: teacher.teacher.id,
//           dayOfWeek: 3, // Wednesday
//           startTime: new Date(now.setHours(14, 0, 0, 0)),
//           endTime: new Date(now.setHours(15, 0, 0, 0)),
//           isRecurring: true
//         }
//       })
//     ])
//   )

//   // Create some sample bookings
//   await Promise.all([
//     prisma.booking.create({
//       data: {
//         teacherId: teachers[0].teacher.id,
//         studentId: students[0].student.id,
//         timeSlotId: timeSlots[0].id,
//         date: nextWeek,
//         status: BookingStatus.APPROVED,
//         reason: 'Discussion about project implementation',
//         notes: 'Approved. Please bring your project documentation.'
//       }
//     }),
//     prisma.booking.create({
//       data: {
//         teacherId: teachers[1].teacher.id,
//         studentId: students[1].student.id,
//         timeSlotId: timeSlots[2].id,
//         date: nextWeek,
//         status: BookingStatus.PENDING,
//         reason: 'Need help with data structures assignment'
//       }
//     }),
//     prisma.booking.create({
//       data: {
//         teacherId: teachers[2].teacher.id,
//         studentId: students[2].student.id,
//         timeSlotId: timeSlots[4].id,
//         date: nextWeek,
//         status: BookingStatus.PENDING,
//         reason: 'Discuss research opportunities'
//       }
//     })
//   ])

//   console.log('Seed data created successfully!')
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })