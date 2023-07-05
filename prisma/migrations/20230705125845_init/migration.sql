/*
  Warnings:

  - A unique constraint covering the columns `[refresh_tokens]` on the table `MainData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MainData" ADD COLUMN     "refresh_tokens" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "MainData_refresh_tokens_key" ON "MainData"("refresh_tokens");
