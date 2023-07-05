/*
  Warnings:

  - You are about to drop the column `refresh_tokens` on the `MainData` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MainData_refresh_tokens_key";

-- AlterTable
ALTER TABLE "MainData" DROP COLUMN "refresh_tokens";

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "MainData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
