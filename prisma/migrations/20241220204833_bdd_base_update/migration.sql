/*
  Warnings:

  - Added the required column `code` to the `Practice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gastos` to the `Practice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `honorario` to the `Practice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialId` to the `Practice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Practice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "code" INTEGER NOT NULL,
ADD COLUMN     "gastos" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "honorario" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "socialId" INTEGER NOT NULL,
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
