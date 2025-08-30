/*
  Warnings:

  - You are about to drop the column `applied_at` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `boss_action` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `hr_action` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `leaverequest` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `leaveaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leavebalance` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `reason` on table `leaverequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `leaverequest` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleRole_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leaveaction` DROP FOREIGN KEY `LeaveAction_action_by_fkey`;

-- DropForeignKey
ALTER TABLE `leaveaction` DROP FOREIGN KEY `LeaveAction_leave_id_fkey`;

-- DropForeignKey
ALTER TABLE `leavebalance` DROP FOREIGN KEY `LeaveBalance_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `leaverequest` DROP COLUMN `applied_at`,
    DROP COLUMN `boss_action`,
    DROP COLUMN `duration`,
    DROP COLUMN `emergencyContact`,
    DROP COLUMN `hr_action`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `reason` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    MODIFY `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_at`,
    DROP COLUMN `password_hash`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleRole_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `leaveaction`;

-- DropTable
DROP TABLE `leavebalance`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleRole_id_fkey` FOREIGN KEY (`roleRole_id`) REFERENCES `Role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
