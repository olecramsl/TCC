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
-- Table `syspsi`.`psicologo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`psicologo` (
  `id` BIGINT(20) UNSIGNED NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(90) NOT NULL,
  `login` VARCHAR(20) NOT NULL,
  `senha` VARCHAR(70) NOT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`convenio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`convenio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `cnpj` VARCHAR(13) NOT NULL,
  `email` VARCHAR(90) NOT NULL,
  `telefoneContato` VARCHAR(11) NOT NULL,
  `logradouro` VARCHAR(150) NOT NULL,
  `complemento` VARCHAR(45) NULL,
  `bairro` VARCHAR(60) NOT NULL,
  `localidade` VARCHAR(50) NOT NULL,
  `uf` VARCHAR(2) NOT NULL,
  `cep` VARCHAR(8) NOT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cnpj_UNIQUE` (`cnpj` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `syspsi`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`paciente` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `idConvenio` INT UNSIGNED NULL,
  `nomeCompleto` VARCHAR(130) NOT NULL,
  `dataNascimento` DATE NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `sexo` CHAR NOT NULL,
  `telefoneContato` VARCHAR(11) NOT NULL,
  `email` VARCHAR(90) NULL,
  `logradouro` VARCHAR(150) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `complemento` VARCHAR(45) NULL,
  `bairro` VARCHAR(60) NOT NULL,
  `localidade` VARCHAR(50) NOT NULL,
  `uf` VARCHAR(2) NOT NULL,
  `cep` VARCHAR(8) NOT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_paciente_psicologo1_idx` (`idPsicologo` ASC),
  INDEX `fk_paciente_convenio1_idx` (`idConvenio` ASC),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC),
  CONSTRAINT `fk_paciente_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_paciente_convenio1`
    FOREIGN KEY (`idConvenio`)
    REFERENCES `syspsi`.`convenio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`agendamento` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT(20) UNSIGNED NOT NULL,
  `gCalendarId` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grupo` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `description` VARCHAR(50) NULL DEFAULT NULL,
  `eventoPrincipal` TINYINT(4) NOT NULL DEFAULT '0',
  `ativo` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_Agendamento_Paciente_idx` (`idPaciente` ASC),
  CONSTRAINT `fk_Agendamento_Paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`paciente` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`config`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`config` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `tempoSessao` INT(10) UNSIGNED NOT NULL DEFAULT '1',
  `intervaloTempoCalendario` INT(10) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_Config_psicologo_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_Config_psicologo`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`permissao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`permissao` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`psicologo_tem_permissao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`psicologo_tem_permissao` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `idPermissao` INT(10) UNSIGNED NOT NULL,
  `dataCriacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uni_psicologo_permissao` (`idPsicologo` ASC, `idPermissao` ASC),
  INDEX `fk_psicologo_has_permissao_permissao1_idx` (`idPermissao` ASC),
  INDEX `fk_psicologo_has_permissao_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_psicologo_has_permissao_permissao1`
    FOREIGN KEY (`idPermissao`)
    REFERENCES `syspsi`.`permissao` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_psicologo_has_permissao_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`tmpgcalendarevent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`tmpgcalendarevent` (
  `id` BIGINT(20) UNSIGNED NOT NULL,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `idGCalendar` TEXT NOT NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `summary` VARCHAR(50) NULL DEFAULT NULL,
  `description` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tmpGoogleCalendarEvents_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_tmpGoogleCalendarEvents_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`consulta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`consulta` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idAgendamento` BIGINT(20) UNSIGNED NOT NULL,
  `prontuario` TEXT NOT NULL,
  `inicio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fim` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_prontuario_agendamento1_idx` (`idAgendamento` ASC),
  CONSTRAINT `fk_prontuario_agendamento1`
    FOREIGN KEY (`idAgendamento`)
    REFERENCES `syspsi`.`agendamento` (`id`)
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