USE `syspsi`;

ALTER TABLE `syspsi`.`convenio` 
CHANGE COLUMN `nome` `nome` VARCHAR(60) NOT NULL ,
CHANGE COLUMN `cnpj` `cnpj` VARCHAR(14) NOT NULL ;

ALTER TABLE `syspsi`.`convenio` 
CHANGE COLUMN `email` `email` VARCHAR(90) NULL ,
CHANGE COLUMN `telefoneContato` `telefoneContato` VARCHAR(11) NULL ,
CHANGE COLUMN `logradouro` `logradouro` VARCHAR(150) NULL ,
CHANGE COLUMN `bairro` `bairro` VARCHAR(60) NULL ,
CHANGE COLUMN `localidade` `localidade` VARCHAR(50) NULL ,
CHANGE COLUMN `uf` `uf` VARCHAR(2) NULL ,
CHANGE COLUMN `cep` `cep` VARCHAR(8) NULL ,
CHANGE COLUMN `valorConsultaIndividual` `valorConsultaIndividual` DECIMAL(10,2) NULL DEFAULT '0.00' ,
CHANGE COLUMN `valorConsultaCasal` `valorConsultaCasal` DECIMAL(10,2) NULL DEFAULT '0.00' ,
CHANGE COLUMN `valorConsultaFamilia` `valorConsultaFamilia` DECIMAL(10,2) NULL DEFAULT '0.00' ,
ADD COLUMN `numero` VARCHAR(10) NULL AFTER `logradouro`,
ADD COLUMN `observacoes` TEXT NULL AFTER `valorConsultaFamilia`;