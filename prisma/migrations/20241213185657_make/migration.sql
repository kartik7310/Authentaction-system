-- AlterTable
ALTER TABLE `user` MODIFY `createAT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
