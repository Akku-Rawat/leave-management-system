-- AlterTable
ALTER TABLE `leaveaction` MODIFY `action` ENUM('pending', 'approved', 'rejected', 'partial', 'withdrawn') NOT NULL;

-- AlterTable
ALTER TABLE `leaverequest` MODIFY `status` ENUM('pending', 'approved', 'rejected', 'partial', 'withdrawn') NOT NULL DEFAULT 'pending';
