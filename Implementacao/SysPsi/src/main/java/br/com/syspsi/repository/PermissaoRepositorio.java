package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Permissao;

public interface PermissaoRepositorio extends CrudRepository<Permissao, Long> {
	public Permissao findByNome(String nome);
}
