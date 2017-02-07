package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {	
	public Agendamento findByGrupoAndPsicologoAndEventoPrincipal(Long grupo, Psicologo psicologo, boolean eventoPrincipal);
	public List<Agendamento> findByGrupoAndPsicologo(long grupo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "					
			+ "WHERE ((a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.eventoPrincipal = true)) "
			+ "AND a.psicologo = ?3")
	public List<Agendamento> findByPeriod(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);	
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a "			
			+ "WHERE (a.start BETWEEN ?1 AND ?2) "
			+ "AND (a.grupo = ?3) "
			+ "AND (a.psicologo = ?4)")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "			
			+ "WHERE (a.start > ?1) "
			+ "AND (a.grupo = ?2) "
			+ "AND (a.psicologo = ?3) "
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosAposData(Calendar data, long grupo, Psicologo psicologo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento a WHERE a.psicologo = ?1")
	public Long getNextValueForGroup(Psicologo psicologo);
	@Modifying
	@Transactional
	@Query("DELETE FROM Agendamento a "			
			+ "WHERE (a.start > ?1) "
			+ "AND (a.grupo = ?2) "
			+ "AND (a.psicologo = ?3)")
	public void removerAgendamentosFuturos(Calendar data, long grupo, Psicologo psicologo);
	/*
	@Modifying
	@Transactional
	@Query("UPDATE Agendamento a "
			+ "SET a.grupo = 0, a.eventoPrincipal = false "
			+ "WHERE (a.grupo = ?1) "
			+ "AND (a.psicologo = ?2)")
	public void atualizarAgendamentosPassados(long grupo, Psicologo psicologo);
	*/	
}