-- AlterTable
ALTER TABLE "User_shop" ADD COLUMN     "favourites" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToSandwichId" TEXT NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Sandwich"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
