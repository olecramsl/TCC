package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {
	@Query("SELECT a FROM Agendamento a "			
			+ "WHERE (a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.eventoPrincipal = true) "
			+ "AND (a.psicologo = ?3)")			
	public List<Agendamento> findByPeriod(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);	
	@Query("SELECT a.start FROM Agendamento a WHERE "
			+ "(a.start BETWEEN ?1 AND ?2) "
			+ "AND a.grupo = ?3")	
	public List<Calendar> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento a WHERE a.psicologo = ?1")
	public long getNextValueForGroup(Psicologo psicologo);
}