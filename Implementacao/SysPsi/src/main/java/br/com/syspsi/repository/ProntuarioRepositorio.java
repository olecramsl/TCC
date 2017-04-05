package br.com.syspsi.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Prontuario;

public interface ProntuarioRepositorio extends CrudRepository<Prontuario, Long> {	
	@Query("SELECT p FROM Prontuario p "
			+ "INNER JOIN p.agendamento a "
			+ "WHERE a.id = ?1")
	public Prontuario getProntuarioByIdAgendamento(Long idAgendamento);
}
