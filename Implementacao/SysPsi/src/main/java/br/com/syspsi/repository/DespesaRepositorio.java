package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Despesa;

public interface DespesaRepositorio extends CrudRepository<Despesa, Long> {

}
