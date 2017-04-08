package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;

public interface AgendamentoRepositorio extends CrudRepository<Agendamento, Long> {
	public Agendamento findByGrupoAndEventoPrincipal(Long grupo, boolean eventoPrincipal);
	public List<Agendamento> findByGrupo(Long grupo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE ((a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.eventoPrincipal = true)) "
			+ "AND ps = ?3 "
			+ "AND p.ativo = true")
	public List<Agendamento> listarPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);	
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "WHERE a.start BETWEEN ?1 AND ?2 "
			+ "AND a.grupo = ?3 "
			+ "AND p.ativo = true")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE a.start > ?1 "
			+ "AND a.grupo = ?2 "
			+ "AND ps = ?3 "			
			+ "AND p.ativo = true "
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosAposData(Calendar data, long grupo, Psicologo psicologo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento a")
	public Long getNextValueForGroup();
	@Modifying
	@Transactional
	@Query("DELETE FROM Agendamento a "
			+ "WHERE a.start > ?1 "
			+ "AND a.grupo = ?2")	
	public void removerAgendamentosFuturos(Calendar data, long grupo);
	@Transactional
	public void deleteByPaciente(Paciente paciente);
}