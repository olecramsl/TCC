-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema syspsi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `syspsi` DEFAULT CHARACTER SET utf8 ;

USE `syspsi` ;

-- -----------------------------------------------------
-- Table `syspsi`.`Config`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`Config` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tempoSessao` INT UNSIGNED NOT NULL DEFAULT 1,
  `intervaloTempoCalendario` INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `syspsi`.`psicologo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`psicologo` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(90) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`paciente` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(90) NOT NULL,
  `ativo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_paciente_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_paciente_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`agendamento` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT(20) UNSIGNED NOT NULL,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `gCalendarId` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grupo` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `description` VARCHAR(50) NULL DEFAULT NULL,
  `eventoPrincipal` TINYINT(4) NOT NULL DEFAULT '0',
  `ativo` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_Agendamento_Paciente_idx` (`idPaciente` ASC),
  INDEX `fk_agendamento_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_Agendamento_Paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 455
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Cria usuário da aplicação:

CREATE USER 'USERSYSPSIAPP'@'LOCALHOST' IDENTIFIED BY '@Rtu3v!xK0l#';

--
-- Configura permissões do usuário da aplicação:
--

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE, SHOW VIEW ON SYSPSI.* TO 'USERSYSPSIAPP'@'LOCALHOST';