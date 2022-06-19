-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nikename` VARCHAR(255) NOT NULL,
    `password_digest` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `User_nikename_key`(`nikename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
