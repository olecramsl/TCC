package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Prontuario;

public interface ProntuarioRepositorio extends CrudRepository<Prontuario, Long> {
	
}
