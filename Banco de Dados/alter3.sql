USE syspsi;
ALTER TABLE `syspsi`.`paciente` 
ADD COLUMN `observacoes` TEXT NULL AFTER `cep`;