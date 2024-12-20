-- AlterTable
ALTER TABLE `user` MODIFY `resetPasswordToken` VARCHAR(191) NULL,
    MODIFY `resetPasswordTokenExpireAt` DATETIME(3) NULL,
    MODIFY `verificationTokenExpireAt` DATETIME(3) NULL;
