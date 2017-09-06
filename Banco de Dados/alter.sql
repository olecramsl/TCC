USE syspsi;

CREATE TABLE `syspsi`.`recibo` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`referenteA` VARCHAR(100) NOT NULL DEFAULT 'atendimento psicológico',
	`dataEmissao` DATE NOT NULL,
	`valor` DECIMAL(10,2) NOT NULL,
PRIMARY KEY (`id`));

CREATE TABLE `syspsi`.`consulta_tem_recibo` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `idConsulta` BIGINT(20) UNSIGNED NOT NULL,
  `idRecibo` BIGINT(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_consulta_tem_recibo_consulta_idx` (`idConsulta` ASC),
  INDEX `fk_consulta_tem_recibo_recibo_idx` (`idRecibo` ASC),
  CONSTRAINT `fk_consulta_tem_recibo_consulta`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `syspsi`.`consulta` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_consulta_tem_recibo_recibo`
    FOREIGN KEY (`idRecibo`)
    REFERENCES `syspsi`.`recibo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
ALTER TABLE `syspsi`.`consulta` 
DROP COLUMN `recibo`;