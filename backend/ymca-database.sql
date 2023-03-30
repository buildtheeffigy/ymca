-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema new_schema
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `new_schema` ;

-- -----------------------------------------------------
-- Schema new_schema
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `new_schema` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `new_schema` ;

-- -----------------------------------------------------
-- Table `new_schema`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `new_schema`.`users` ;

CREATE TABLE IF NOT EXISTS `new_schema`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `current_enrollment` TINYINT NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `membership_status` INT NOT NULL,
  `private` TINYINT NULL DEFAULT NULL,
  `username` VARCHAR(45) NOT NULL,
  `family` TINYINT NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `deleted` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`programs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `new_schema`.`programs` ;

CREATE TABLE IF NOT EXISTS `new_schema`.`programs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(256) NOT NULL,
  `max_capacity` INT NOT NULL,
  `current_enrollment` INT NOT NULL,
  `base_price` INT NOT NULL,
  `member_price` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `prereq_name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `teacher_idx` (`teacher_id` ASC) VISIBLE,
  CONSTRAINT `teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 46
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`schedule`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `new_schema`.`schedule` ;

CREATE TABLE IF NOT EXISTS `new_schema`.`schedule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `program_id` INT NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_idx` (`program_id` ASC) VISIBLE,
  CONSTRAINT `id`
    FOREIGN KEY (`program_id`)
    REFERENCES `new_schema`.`programs` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`enrollment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `new_schema`.`enrollment` ;

CREATE TABLE IF NOT EXISTS `new_schema`.`enrollment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `schedule_id` INT NOT NULL,
  `family_member_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `enrollment_ibfk_1` (`user_id` ASC) VISIBLE,
  INDEX `enrollment_ibfk_2` (`course_id` ASC) VISIBLE,
  INDEX `enrollment_ibfk_3` (`schedule_id` ASC) VISIBLE,
  CONSTRAINT `enrollment_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `new_schema`.`users` (`id`),
  CONSTRAINT `enrollment_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `new_schema`.`programs` (`id`),
  CONSTRAINT `enrollment_ibfk_3`
    FOREIGN KEY (`schedule_id`)
    REFERENCES `new_schema`.`schedule` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new_schema`.`families`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `new_schema`.`families` ;

CREATE TABLE IF NOT EXISTS `new_schema`.`families` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_id`
    FOREIGN KEY (`id`)
    REFERENCES `new_schema`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
