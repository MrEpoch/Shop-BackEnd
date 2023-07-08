-- CreateTable
CREATE TABLE "User_admin" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_admin_pkey" PRIMARY KEY ("id")
);

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
    "favouritesId" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sandwich" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "numReviews" INTEGER NOT NULL DEFAULT 0,
    "countInStock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Sandwich_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_name_key" ON "User_admin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_admin_password_key" ON "User_admin"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_name_key" ON "User_shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_password_key" ON "User_shop"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_email_key" ON "User_shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_shop_phone_key" ON "User_shop"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Sandwich"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
