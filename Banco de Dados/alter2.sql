USE syspsi;

CREATE TABLE `syspsi`.`grupopaciente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  
ALTER TABLE `syspsi`.`grupopaciente` 
ADD COLUMN `maiorIdade` TINYINT NOT NULL AFTER `descricao`;

INSERT INTO `syspsi`.`grupopaciente` (`id`, `descricao`, `maiorIdade`) VALUES (1, 'Adolescente', 0);
INSERT INTO `syspsi`.`grupopaciente` (`id`, `descricao`, `maiorIdade`) VALUES (2, 'Adulto', 1);
INSERT INTO `syspsi`.`grupopaciente` (`id`, `descricao`, `maiorIdade`) VALUES (3, 'Criança', 0);
INSERT INTO `syspsi`.`grupopaciente` (`id`, `descricao`, `maiorIdade`) VALUES (4, 'Idoso', 1);

ALTER TABLE `syspsi`.`paciente` 
CHANGE COLUMN `dataNascimento` `dataNascimento` DATE NULL ,
CHANGE COLUMN `cpf` `cpf` VARCHAR(11) NULL ,
CHANGE COLUMN `sexo` `sexo` CHAR(1) NULL ,
CHANGE COLUMN `telefoneContato` `telefoneContato` VARCHAR(11) NULL ,
CHANGE COLUMN `email` `email` VARCHAR(90) NULL ,
CHANGE COLUMN `logradouro` `logradouro` VARCHAR(150) NULL ,
CHANGE COLUMN `numero` `numero` VARCHAR(10) NULL ,
CHANGE COLUMN `complemento` `complemento` VARCHAR(45) NULL ,
CHANGE COLUMN `bairro` `bairro` VARCHAR(60) NULL ,
CHANGE COLUMN `localidade` `localidade` VARCHAR(50) NULL ,
CHANGE COLUMN `uf` `uf` VARCHAR(2) NULL ,
CHANGE COLUMN `cep` `cep` VARCHAR(8) NULL ,
ADD COLUMN `idGrupo` INT NOT NULL DEFAULT 2 AFTER `idPsicologo`,
ADD COLUMN `cpfResponsavel` VARCHAR(11) NULL AFTER `ativo`,
ADD COLUMN `nomeCompletoResponsavel` VARCHAR(130) NULL AFTER `cpfResponsavel`,
ADD COLUMN `telefoneContatoResponsavel` VARCHAR(11) NULL AFTER `nomeCompletoResponsavel`,
ADD INDEX `fk_paciente_grupopaciente1_idx` (`idGrupo` ASC);
ALTER TABLE `syspsi`.`paciente` 
ADD CONSTRAINT `fk_paciente_grupopaciente1`
  FOREIGN KEY (`idGrupo`)
  REFERENCES `syspsi`.`grupopaciente` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `syspsi`.`consulta` 
DROP FOREIGN KEY `fk_prontuario_agendamento1`;
ALTER TABLE `syspsi`.`consulta` 
ADD CONSTRAINT `fk_prontuario_agendamento1`
  FOREIGN KEY (`idAgendamento`)
  REFERENCES `syspsi`.`agendamento` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
  
ALTER TABLE `syspsi`.`paciente` 
ADD UNIQUE INDEX `cpfResponsavel_UNIQUE` (`cpfResponsavel` ASC);