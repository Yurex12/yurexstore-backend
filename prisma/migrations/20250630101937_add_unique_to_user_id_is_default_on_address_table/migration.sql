/*
  Warnings:

  - A unique constraint covering the columns `[userId,isDefault]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_isDefault_key" ON "Address"("userId", "isDefault");
