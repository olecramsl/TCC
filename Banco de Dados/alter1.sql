USE syspsi;

ALTER TABLE `syspsi`.`consulta` 
ADD COLUMN `valor` DECIMAL(10,2) NOT NULL DEFAULT 0.0 AFTER `prontuario`,
ADD COLUMN `recibo` TINYINT NOT NULL DEFAULT 0 AFTER `valor`;

ALTER TABLE `syspsi`.`convenio` 
ADD COLUMN `valorConsultaIndividual` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `cep`,
ADD COLUMN `valorConsultaCasal` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `valorConsultaIndividual`,
ADD COLUMN `valorConsultaFamilia` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `valorConsultaCasal`;

ALTER TABLE `syspsi`.`paciente` 
DROP FOREIGN KEY `fk_paciente_convenio1`;
ALTER TABLE `syspsi`.`paciente` 
DROP COLUMN `idConvenio`,
DROP INDEX `fk_paciente_convenio1_idx` ;

ALTER TABLE `syspsi`.`agendamento`
ADD COLUMN `color` VARCHAR(45) NOT NULL DEFAULT 'blue' AFTER `eventoPrincipal`,
ADD COLUMN `idConvenio` INT UNSIGNED NULL DEFAULT NULL AFTER `idPaciente`,
ADD INDEX `fk_agendamento_convenio1_idx` (`idConvenio` ASC),
ADD CONSTRAINT `fk_agendamento_convenio1`
    FOREIGN KEY (`idConvenio`)
    REFERENCES `syspsi`.`convenio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


