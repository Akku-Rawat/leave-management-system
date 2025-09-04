/*
  Warnings:

  - You are about to alter the column `reason` on the `leaverequest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15000)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `leaverequest` MODIFY `reason` VARCHAR(191) NULL;
