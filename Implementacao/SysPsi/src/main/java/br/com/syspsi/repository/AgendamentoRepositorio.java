package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {
	@Query("SELECT a FROM Agendamento a WHERE "
			+ "(a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.grupo > 0)")
	public List<Agendamento> findByPeriod(Calendar dataInicial, Calendar dataFinal);
}
