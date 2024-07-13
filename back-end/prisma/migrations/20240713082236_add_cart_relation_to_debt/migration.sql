-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "productIds" INTEGER[],
    "quantities" INTEGER[],
    "totalCost" INTEGER NOT NULL,
    "debtId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);
