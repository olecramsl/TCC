package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Consulta;

public interface ConsultaRepositorio extends CrudRepository<Consulta, Long> {
	/*
	@Query("SELECT c FROM Consulta c "
			+ "INNER JOIN c.agendamento a "
			+ "WHERE a.id = ?1")
	public Consulta getConsultaByIdAgendamento(Long idAgendamento);
	*/
}
