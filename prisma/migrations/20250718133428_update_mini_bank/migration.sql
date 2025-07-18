/*
  Warnings:

  - You are about to drop the `RecentFundsReceive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecentFundsReceive" DROP CONSTRAINT "RecentFundsReceive_userId_fkey";

-- DropTable
DROP TABLE "RecentFundsReceive";
