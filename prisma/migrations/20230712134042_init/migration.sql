/*
  Warnings:

  - Added the required column `stripePriceId` to the `Sandwich` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sandwich" ADD COLUMN     "stripePriceId" TEXT NOT NULL;
