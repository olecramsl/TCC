USE syspsi;

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
