USE syspsi;
INSERT INTO `syspsi`.`permissao`(`id`, `nome`, `descricao`) VALUES (1, "PSICOLOGO", "Permissão para usuário psicólogo");
INSERT INTO `syspsi`.`permissao`(`id`, `nome`, `descricao`) VALUES (2, "ADM", "Permissão para usuário administrador");
# senha 123
INSERT INTO `syspsi`.`psicologo` (`id`, `nome`, `sobrenome`, `login`, `senha`, `chave`, `ativo`) VALUES (1, 'Magda Beatriz', ' Vaz Cunha', 'magda', '$2a$10$NHNM3ciz3QIIGNIxdZnvC.vSnlMGU7ALrFairJgWgek91z6QUZN8K', 'bRLIvpOvZTyKAjXv', true);
INSERT INTO `syspsi`.`psicologo` (`id`, `nome`, `sobrenome`, `login`, `senha`, `chave`, `ativo`) VALUES (2, 'Jose', 'Silva', 'jose', '$2a$10$NHNM3ciz3QIIGNIxdZnvC.vSnlMGU7ALrFairJgWgek91z6QUZN8K', 'GhBOmPXNhgJ3+Coo', true);
INSERT INTO `syspsi`.`psicologo_tem_permissao`(`idPsicologo`, `idPermissao`, `dataCriacao`) VALUE (1, 1, now());
INSERT INTO `syspsi`.`psicologo_tem_permissao`(`idPsicologo`, `idPermissao`, `dataCriacao`) VALUE (2, 1, now());
INSERT INTO `syspsi`.`config` (`idPsicologo`, `tempoSessao`, `intervaloTempoCalendario`) VALUES (1, 60, 30);
INSERT INTO `syspsi`.`config` (`idPsicologo`, `tempoSessao`, `intervaloTempoCalendario`) VALUES (2, 60, 30);
INSERT INTO `syspsi`.`convenio` (`id`, `nome`, `cnpj`, `email`, `telefoneContato`, `logradouro`, `bairro`, `localidade`, `uf`, `cep`, `ativo`) VALUES (1, 'UNIMED', '1234567890123', 'unimed@email.com', '5132612248', 'Rua Doutor Vicente de Paula Dutra, 95', 'Praia de Belas', 'Porto Alegre', 'RS', '90110200', 1);
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nomeCompleto`, `dataNascimento`, `cpf`, `sexo`, `telefoneContato`, `email`, `logradouro`, `numero`, `bairro`, `localidade`, `uf`, `cep`, `ativo`) VALUES (1, 'Marcelo da Silva Lima', '1978-02-17', '12345678900', 'M', '5112345678', 'marcelo@email.com', 'Edgar', '1286', 'Aberta', 'Porto', 'RS', '12345789', '1');
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `idConvenio`, `nomeCompleto`, `dataNascimento`, `cpf`, `sexo`, `telefoneContato`, `email`, `logradouro`, `numero`, `bairro`, `localidade`, `uf`, `cep`, `ativo`) VALUES (1, 1, 'Jacira Cunha', '1930-06-07', '99999999999', 'F', '5198765432', 'jacira@email.com', 'Edgar', '1234', 'Aberta', 'Porto', 'RS', '12345789', '1');
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nomeCompleto`, `dataNascimento`, `cpf`, `sexo`, `telefoneContato`, `email`, `logradouro`, `numero`, `bairro`, `localidade`, `uf`, `cep`, `ativo`) VALUES (1, 'Laura Lima', '2015-06-05', '11111111111', 'F', '5155555555', 'laura@email.com', 'Edgar', '456', 'Aberta', 'Porto', 'RS', '12345789', '0');
INSERT INTO `syspsi`.`paciente` (`idPsicologo`, `nomeCompleto`, `dataNascimento`, `cpf`, `sexo`, `telefoneContato`, `email`, `logradouro`, `numero`, `bairro`, `localidade`, `uf`, `cep`, `ativo`) VALUES (2, 'Papai Pig', '2002-06-05', '22222222222', 'M', '5144455555', 'papai@email.com', 'Edgar', '100', 'Aberta', 'Porto', 'RS', '98765321', '1');
