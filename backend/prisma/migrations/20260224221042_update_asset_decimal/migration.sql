/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Asset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetName` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_creatorId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "creatorId",
DROP COLUMN "name",
ADD COLUMN     "accountCode" TEXT,
ADD COLUMN     "activationDate" TIMESTAMP(3),
ADD COLUMN     "assetName" TEXT NOT NULL,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "createdByUserId" INTEGER,
ADD COLUMN     "currentValue" DECIMAL(12,2),
ADD COLUMN     "custodianId" INTEGER,
ADD COLUMN     "entryDate" TIMESTAMP(3),
ADD COLUMN     "initialValue" DECIMAL(12,2),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "physicalLocation" TEXT,
ADD COLUMN     "previousCode" TEXT,
ADD COLUMN     "serialNumber" TEXT;

-- CreateTable
CREATE TABLE "Custodian" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Custodian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Custodian_identifier_key" ON "Custodian"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_custodianId_fkey" FOREIGN KEY ("custodianId") REFERENCES "Custodian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
