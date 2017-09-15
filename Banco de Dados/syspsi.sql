-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema syspsi
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema syspsi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `syspsi` DEFAULT CHARACTER SET utf8 ;
USE `syspsi` ;

-- -----------------------------------------------------
-- Table `syspsi`.`grupopaciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`grupopaciente` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(45) NOT NULL,
  `maiorIdade` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`psicologo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`psicologo` (
  `id` BIGINT(20) UNSIGNED NOT NULL,
  `nomeCompleto` VARCHAR(130) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `crp` VARCHAR(20) NOT NULL,
  `login` VARCHAR(90) NOT NULL,
  `senha` BINARY(60) NOT NULL,
  `chave` BINARY(16) NOT NULL,
  `vinculadoGCal` TINYINT(4) NOT NULL DEFAULT '0',
  `ativo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`paciente` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `idGrupo` INT(11) NOT NULL DEFAULT '2',
  `nomeCompleto` VARCHAR(130) NOT NULL,
  `dataNascimento` DATE NULL DEFAULT NULL,
  `cpf` VARCHAR(11) NULL DEFAULT NULL,
  `sexo` CHAR(1) NULL DEFAULT NULL,
  `telefoneContato` VARCHAR(11) NULL DEFAULT NULL,
  `email` VARCHAR(90) NULL DEFAULT NULL,
  `logradouro` VARCHAR(150) NULL DEFAULT NULL,
  `numero` VARCHAR(10) NULL DEFAULT NULL,
  `complemento` VARCHAR(45) NULL DEFAULT NULL,
  `bairro` VARCHAR(60) NULL DEFAULT NULL,
  `localidade` VARCHAR(50) NULL DEFAULT NULL,
  `uf` VARCHAR(2) NULL DEFAULT NULL,
  `cep` VARCHAR(8) NULL DEFAULT NULL,
  `observacoes` TEXT NULL DEFAULT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT '1',
  `cpfResponsavel` VARCHAR(11) NULL DEFAULT NULL,
  `nomeCompletoResponsavel` VARCHAR(130) NULL DEFAULT NULL,
  `telefoneContatoResponsavel` VARCHAR(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC),
  INDEX `fk_paciente_psicologo1_idx` (`idPsicologo` ASC),
  INDEX `fk_paciente_grupopaciente1_idx` (`idGrupo` ASC),
  CONSTRAINT `fk_paciente_grupopaciente1`
    FOREIGN KEY (`idGrupo`)
    REFERENCES `syspsi`.`grupopaciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_paciente_psicologo1`
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
  `prontuario` TEXT NULL DEFAULT NULL,
  `valor` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `recibo` TINYINT(1) NOT NULL DEFAULT '0',
  `inicio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fim` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`convenio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`convenio` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(60) NOT NULL,
  `cnpj` VARCHAR(14) NOT NULL,
  `email` VARCHAR(90) NULL DEFAULT NULL,
  `telefoneContato` VARCHAR(11) NULL DEFAULT NULL,
  `logradouro` VARCHAR(150) NULL DEFAULT NULL,
  `numero` VARCHAR(10) NULL DEFAULT NULL,
  `complemento` VARCHAR(45) NULL DEFAULT NULL,
  `bairro` VARCHAR(60) NULL DEFAULT NULL,
  `localidade` VARCHAR(50) NULL DEFAULT NULL,
  `uf` VARCHAR(2) NULL DEFAULT NULL,
  `cep` VARCHAR(8) NULL DEFAULT NULL,
  `valorConsultaIndividual` DECIMAL(10,2) NULL DEFAULT '0.00',
  `valorConsultaCasal` DECIMAL(10,2) NULL DEFAULT '0.00',
  `valorConsultaFamilia` DECIMAL(10,2) NULL DEFAULT '0.00',
  `observacoes` TEXT NULL DEFAULT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cnpj_UNIQUE` (`cnpj` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`agendamento` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT(20) UNSIGNED NOT NULL,
  `idConvenio` INT(10) UNSIGNED NULL DEFAULT NULL,
  `idConsulta` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
  `idGCalendar` VARCHAR(1024) NULL DEFAULT NULL,
  `idRecurring` VARCHAR(1024) NULL DEFAULT NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grupo` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `description` TEXT NULL DEFAULT NULL,
  `eventoPrincipal` TINYINT(4) NOT NULL DEFAULT '0',
  `color` VARCHAR(45) NOT NULL DEFAULT '#0A6CAC',
  `ativo` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_Agendamento_Paciente_idx` (`idPaciente` ASC),
  INDEX `fk_agendamento_convenio1_idx` (`idConvenio` ASC),
  INDEX `fk_agendamento_consulta1_idx` (`idConsulta` ASC),
  CONSTRAINT `fk_Agendamento_Paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`paciente` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_consulta1`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `syspsi`.`consulta` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_convenio1`
    FOREIGN KEY (`idConvenio`)
    REFERENCES `syspsi`.`convenio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`backup`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`backup` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `inicio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fim` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`despesa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`despesa` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `descricao` VARCHAR(30) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `vencimento` DATE NOT NULL,
  `pago` TINYINT(1) NULL DEFAULT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_despesa_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_despesa_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
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
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`recibo`
-- -----------------------------------------------------
CREATE TABLE `syspsi`.`recibo` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT(20) UNSIGNED NOT NULL,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `referenteA` VARCHAR(100) NOT NULL,
  `dataEmissao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `valor` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_recibo_paciente_idx` (`idPaciente` ASC),
  INDEX `fk_recibo_psicologo_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_recibo_paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recibo_psicologo`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `syspsi`.`tmpgcalendarevent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`tmpgcalendarevent` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `idGCalendar` VARCHAR(1024) NOT NULL,
  `idRecurring` VARCHAR(1024) NULL DEFAULT NULL,
  `start` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `summary` TEXT NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tmpGoogleCalendarEvents_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_tmpGoogleCalendarEvents_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
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