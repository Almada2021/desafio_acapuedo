/*
  Warnings:

  - You are about to drop the column `docID` on the `Debt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "docID",
ADD COLUMN     "docId" TEXT;
