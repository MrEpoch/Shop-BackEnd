/*
  Warnings:

  - You are about to drop the column `username` on the `User_admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User_admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User_admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_admin_username_key";

-- AlterTable
ALTER TABLE "User_admin" DROP COLUMN "username",
ADD COLUMN     "name" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_name_key" ON "User_admin"("name");
