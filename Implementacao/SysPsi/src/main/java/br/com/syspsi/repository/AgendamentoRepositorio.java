package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {	
}
