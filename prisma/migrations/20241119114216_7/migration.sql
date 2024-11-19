-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('FREE', 'BUSY', 'LECTURE');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'FREE';
