/*
  Warnings:

  - You are about to drop the column `userFundsReceiveId` on the `RecentFundsReceive` table. All the data in the column will be lost.
  - You are about to drop the column `userFundsTransferId` on the `RecentFundsTransfer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RecentFundsTransfer` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `RecentFundsTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `RecentFundsTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecentFundsTransfer" DROP CONSTRAINT "RecentFundsTransfer_userId_fkey";

-- AlterTable
ALTER TABLE "RecentFundsReceive" DROP COLUMN "userFundsReceiveId";

-- AlterTable
ALTER TABLE "RecentFundsTransfer" DROP COLUMN "userFundsTransferId",
DROP COLUMN "userId",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "money" SET DEFAULT 500;

-- AddForeignKey
ALTER TABLE "RecentFundsTransfer" ADD CONSTRAINT "RecentFundsTransfer_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentFundsTransfer" ADD CONSTRAINT "RecentFundsTransfer_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
