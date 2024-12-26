/*
  Warnings:

  - Changed the type of `matriculaNacional` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `matriculaProvincial` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "matriculaNacional",
ADD COLUMN     "matriculaNacional" INTEGER NOT NULL,
DROP COLUMN "matriculaProvincial",
ADD COLUMN     "matriculaProvincial" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_matriculaNacional_key" ON "Doctor"("matriculaNacional");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_matriculaProvincial_key" ON "Doctor"("matriculaProvincial");
