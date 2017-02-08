package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Config;
import br.com.syspsi.model.entity.Psicologo;

public interface ConfigRepositorio extends CrudRepository<Config, Integer> {
	public Config findByPsicologo(Psicologo psicologo);
}
