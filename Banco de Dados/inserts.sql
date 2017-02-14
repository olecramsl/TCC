USE syspsi;
# senha 123
INSERT INTO `syspsi`.`psicologo` (`id`, `nome`, `sobrenome`, `login`, `senha`, `ativo`) VALUES (1, 'Magda Beatriz', ' Vaz Cunha', 'magda', '$2a$10$NHNM3ciz3QIIGNIxdZnvC.vSnlMGU7ALrFairJgWgek91z6QUZN8K', true);
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nome`, `sobrenome`, `ativo`) VALUES (1, 'Marcelo da', 'Silva Lima', '1');
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nome`, `sobrenome`, `ativo`) VALUES (1, 'Jacira', 'Cunha', '1');
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nome`, `sobrenome`, `ativo`) VALUES (1, 'Laura', ' Lima', '0');
INSERT INTO `syspsi`.`config` (`idPsicologo`, `tempoSessao`, `intervaloTempoCalendario`) VALUES (1, 60, 30);
INSERT INTO `syspsi`.`permissao`(`id`, `nome`, `descricao`) VALUES (1, "PSICOLOGO", "Permissão para usuário psicólogo");
INSERT INTO `syspsi`.`permissao`(`id`, `nome`, `descricao`) VALUES (2, "ADM", "Permissão para usuário administrador");
INSERT INTO `syspsi`.`psicologo_tem_permissao`(`idPsicologo`, `idPermissao`, `dataCriacao`) VALUE (1, 1, now());
