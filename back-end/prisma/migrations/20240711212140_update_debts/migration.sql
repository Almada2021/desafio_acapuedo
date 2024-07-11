/*
  Warnings:

  - Added the required column `label` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "docID" TEXT,
ADD COLUMN     "label" TEXT NOT NULL;
