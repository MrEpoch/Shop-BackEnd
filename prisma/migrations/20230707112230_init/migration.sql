/*
  Warnings:

  - You are about to alter the column `rating` on the `Sandwich` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Sandwich" ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;
