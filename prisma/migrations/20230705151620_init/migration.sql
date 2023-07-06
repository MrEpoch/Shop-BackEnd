/*
  Warnings:

  - You are about to drop the `MainData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sandwich" DROP CONSTRAINT "Sandwich_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_belongsToId_fkey";

-- DropTable
DROP TABLE "MainData";
