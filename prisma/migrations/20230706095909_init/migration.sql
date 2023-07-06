/*
  Warnings:

  - You are about to drop the column `belongsToId` on the `Sandwich` table. All the data in the column will be lost.
  - You are about to drop the column `favourites` on the `User_shop` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Sandwich" DROP COLUMN "belongsToId";

-- AlterTable
ALTER TABLE "User_shop" DROP COLUMN "favourites",
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "favouritesId" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "User_admin" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_username_key" ON "User_admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_password_key" ON "User_admin"("password");
