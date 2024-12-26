/*
  Warnings:

  - You are about to drop the column `hour` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `minute` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuil]` on the table `Social` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cuil` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "PracticeStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_doctorId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "hour",
DROP COLUMN "minute";

-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "status" "PracticeStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "cuil" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "doctorId";

-- CreateTable
CREATE TABLE "PacientSocial" (
    "id" SERIAL NOT NULL,
    "pacientId" INTEGER NOT NULL,
    "socialId" INTEGER NOT NULL,
    "socialNumber" INTEGER NOT NULL,

    CONSTRAINT "PacientSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "type" "InvoiceType" NOT NULL,
    "serie" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "pdfUrl" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InvoiceToSocial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InvoiceToSocial_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_type_serie_number_key" ON "Invoice"("type", "serie", "number");

-- CreateIndex
CREATE INDEX "_InvoiceToSocial_B_index" ON "_InvoiceToSocial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Social_cuil_key" ON "Social"("cuil");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientSocial" ADD CONSTRAINT "PacientSocial_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "Pacient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientSocial" ADD CONSTRAINT "PacientSocial_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToSocial" ADD CONSTRAINT "_InvoiceToSocial_A_fkey" FOREIGN KEY ("A") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToSocial" ADD CONSTRAINT "_InvoiceToSocial_B_fkey" FOREIGN KEY ("B") REFERENCES "Social"("id") ON DELETE CASCADE ON UPDATE CASCADE;
