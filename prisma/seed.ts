const { PrismaClient, UserRole, BookingStatus } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  try {
    const result = await prisma.timeSlot.updateMany({
      where: {
        dayOfWeek:6,
        
      },
      data: {
        status: 'BUSY'
      }
    });
    console.log(`Updated ${result.count} time slots`);
  } catch (error) {
    console.error('Error updating time slots', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });