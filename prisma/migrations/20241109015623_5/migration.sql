-- CreateTable
CREATE TABLE "hallBooking" (
    "id" TEXT NOT NULL,
    "theaterId" TEXT NOT NULL,
    "userId" TEXT,
    "timeSlotId" TEXT,
    "time" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hallBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hallBooking" ADD CONSTRAINT "hallBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
