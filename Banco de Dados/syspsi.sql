-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema syspsi
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema syspsi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `syspsi` DEFAULT CHARACTER SET utf8 ;
USE `syspsi` ;

-- -----------------------------------------------------
-- Table `syspsi`.`Paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`Paciente` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(90) NOT NULL,
  `ativo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `syspsi`.`Agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`Agendamento` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT UNSIGNED NOT NULL,
  `gCalendarId` BIGINT UNSIGNED NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `repetirSemanalmente` TINYINT(1) NOT NULL DEFAULT 0,
  `description` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Agendamento_Paciente_idx` (`idPaciente` ASC),
  CONSTRAINT `fk_Agendamento_Paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`Paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- Cria usuário da aplicação:

CREATE USER 'USERSYSPSIAPP'@'LOCALHOST' IDENTIFIED BY '@Rtu3v!xK0l#';

--
-- Configura permissões do usuário da aplicação:
--

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE, SHOW VIEW ON SYSPSI.* TO 'USERSYSPSIAPP'@'LOCALHOST';