/*
  Warnings:

  - You are about to drop the column `created_at` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `leaverequest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `roleRole_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleRole_id_fkey`;

-- DropIndex
DROP INDEX `User_roleRole_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `leaverequest` DROP COLUMN `created_at`,
    DROP COLUMN `type`,
    ADD COLUMN `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `boss_action` ENUM('pending', 'approved', 'rejected', 'partial') NOT NULL DEFAULT 'pending',
    ADD COLUMN `hr_action` ENUM('pending', 'approved', 'rejected', 'partial') NOT NULL DEFAULT 'pending',
    MODIFY `reason` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pending', 'approved', 'rejected', 'partial') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    DROP COLUMN `roleRole_id`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `LeaveBalance` (
    `balance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `total_leaves` INTEGER NOT NULL DEFAULT 30,
    `used_leaves` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`balance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveAction` (
    `action_id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_id` INTEGER NOT NULL,
    `action_by` INTEGER NOT NULL,
    `action` ENUM('pending', 'approved', 'rejected', 'partial') NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `action_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`action_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveBalance` ADD CONSTRAINT `LeaveBalance_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveAction` ADD CONSTRAINT `LeaveAction_leave_id_fkey` FOREIGN KEY (`leave_id`) REFERENCES `LeaveRequest`(`leave_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveAction` ADD CONSTRAINT `LeaveAction_action_by_fkey` FOREIGN KEY (`action_by`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
