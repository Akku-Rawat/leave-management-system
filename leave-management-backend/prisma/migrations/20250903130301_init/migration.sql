-- AlterTable
ALTER TABLE `leaveaction` MODIFY `action` ENUM('pending', 'approved', 'rejected', 'partial', 'withdrawn', 'custom_message') NOT NULL;

-- AlterTable
ALTER TABLE `leaverequest` MODIFY `status` ENUM('pending', 'approved', 'rejected', 'partial', 'withdrawn', 'custom_message') NOT NULL DEFAULT 'pending';
