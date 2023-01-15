/*
  Warnings:

  - Added the required column `blob` to the `Draw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Draw` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Draw" ADD COLUMN     "blob" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
