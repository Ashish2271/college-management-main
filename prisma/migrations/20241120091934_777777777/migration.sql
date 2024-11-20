-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "approvedEndTime" TIMESTAMP(3),
ADD COLUMN     "approvedStartTime" TIMESTAMP(3),
ADD COLUMN     "requestedEndTime" TIMESTAMP(3),
ADD COLUMN     "requestedStartTime" TIMESTAMP(3);
