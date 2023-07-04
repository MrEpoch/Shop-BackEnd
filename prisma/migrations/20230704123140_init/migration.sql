-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainData" (
    "id" TEXT NOT NULL,

    CONSTRAINT "MainData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sandwich" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "numReviews" INTEGER NOT NULL,
    "countInStock" INTEGER NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Sandwich_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- AddForeignKey
ALTER TABLE "Sandwich" ADD CONSTRAINT "Sandwich_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "MainData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
