/*
  Warnings:

  - You are about to drop the column `applied_at` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `boss_action` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `hr_action` on the `leaverequest` table. All the data in the column will be lost.
  - Added the required column `type` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `leaverequest` DROP COLUMN `applied_at`,
    DROP COLUMN `boss_action`,
    DROP COLUMN `hr_action`,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
