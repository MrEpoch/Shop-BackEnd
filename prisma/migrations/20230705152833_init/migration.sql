/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "User_shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "User_shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_name_key" ON "User_shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_password_key" ON "User_shop"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_email_key" ON "User_shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_phone_key" ON "User_shop"("phone");
