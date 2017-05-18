USE syspsi;
DROP TABLE IF EXISTS `syspsi`.`config`;
-- -----------------------------------------------------
-- Table `syspsi`.`despesa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `syspsi`.`despesa` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPsicologo` BIGINT(20) UNSIGNED NOT NULL,
  `descricao` VARCHAR(30) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `vencimento` DATE NOT NULL,
  `pago` TINYINT(1) NULL,
  `observacao` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_despesa_psicologo1_idx` (`idPsicologo` ASC),
  CONSTRAINT `fk_despesa_psicologo1`
    FOREIGN KEY (`idPsicologo`)
    REFERENCES `syspsi`.`psicologo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;