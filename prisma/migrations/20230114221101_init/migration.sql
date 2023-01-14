-- CreateTable
CREATE TABLE "Draw" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "element" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "author" TEXT[],

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);
