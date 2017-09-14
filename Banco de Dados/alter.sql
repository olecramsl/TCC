USE syspsi;

CREATE TABLE `syspsi`.`recibo` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPaciente` BIGINT(20) UNSIGNED NOT NULL,
  `referenteA` VARCHAR(100) NOT NULL,
  `dataEmissao` DATE NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_recibo_paciente_idx` (`idPaciente` ASC),
  CONSTRAINT `fk_recibo_paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `syspsi`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);