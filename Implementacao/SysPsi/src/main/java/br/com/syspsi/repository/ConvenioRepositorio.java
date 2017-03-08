package br.com.syspsi.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Convenio;

public interface ConvenioRepositorio extends CrudRepository<Convenio, Integer>{
	public List<Convenio> findByAtivo(boolean ativo);
}
