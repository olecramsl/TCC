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
	public Agendamento findByGrupoAndPsicologoAndEventoPrincipal(Long grupo, Psicologo psicologo, boolean eventoPrincipal);
	public List<Agendamento> findByGrupoAndPsicologo(long grupo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "					
			+ "WHERE ((a.start BETWEEN ?1 AND ?2) "
			+ "OR (a.start <= ?1 AND a.eventoPrincipal = true)) "
			+ "AND a.psicologo = ?3 "
			+ "AND p.ativo = true")
	public List<Agendamento> listarPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);	
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a "
			+ "INNER JOIN a.paciente p "			
			+ "WHERE a.start BETWEEN ?1 AND ?2 "
			+ "AND a.grupo = ?3 "
			+ "AND a.psicologo = ?4 "
			+ "AND p.ativo = true")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "			
			+ "WHERE a.start > ?1 "
			+ "AND a.grupo = ?2 "
			+ "AND a.psicologo = ?3 "
			+ "AND p.ativo = true "
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
	@Transactional
	public void deleteByPaciente(Paciente paciente);
}