package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {
	@Query("SELECT a FROM Agendamento a WHERE "
			+ "(a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.eventoPrincipal = true)")
	public List<Agendamento> findByPeriod(Calendar dataInicial, Calendar dataFinal);	
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a WHERE "
			+ "(a.start BETWEEN ?1 AND ?2) "
			+ "AND a.grupo = ?3")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento")
	public long getNextValueForGroup();
}
