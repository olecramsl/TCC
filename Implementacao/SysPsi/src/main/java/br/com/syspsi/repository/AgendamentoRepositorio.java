package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import javax.transaction.Transactional;

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
			+ "WHERE ((DATE(a.start) BETWEEN DATE(?1) AND DATE(?2)) "
			+ "OR (DATE(a.start) <= DATE(?1) AND a.eventoPrincipal = true)) "
			+ "AND ps = ?3")
	public List<Agendamento> listarPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE DATE(a.end) <= DATE(?1) AND a.eventoPrincipal = true AND ps = ?2")
	public List<Agendamento> listarEventosPrincipaisPorPeriodo(Calendar dataFinal, Psicologo psicologo);
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "WHERE DATE(a.start) BETWEEN DATE(?1) AND DATE(?2) "
			+ "AND a.grupo = ?3 "
			+ "AND p.ativo = true")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupo(Calendar dataInicial, Calendar dataFinal, long grupo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE DATE(a.start) > DATE(?1) "
			+ "AND a.grupo = ?2 "
			+ "AND ps = ?3 "			
			+ "AND p.ativo = true "
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosAposData(Calendar data, long grupo, Psicologo psicologo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento a")
	public Long getNextValueForGroup();
	@Transactional
	public void deleteByPaciente(Paciente paciente);
	@Query("SELECT idGCalendar FROM Agendamento "
			+ "WHERE DATE(start) BETWEEN DATE(?1) AND DATE(?2)")
	public List<String> listarIdGCalendarPorPeriodo(Calendar start, Calendar end);
	@Transactional
	public void deleteByIdGCalendar(String idGCalendar);
	public Agendamento findByIdGCalendar(String idGCalendar);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "							
			+ "WHERE p = ?1 "
			+ "AND ps = ?2 "
			+ "AND a.consulta IS NOT NULL "					
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosComConsulta(Paciente paciente, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "			
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "							
			+ "WHERE (DATE(a.start) BETWEEN DATE(?1) AND DATE(?2)) "
			+ "AND a.consulta IS NOT NULL "
			+ "AND a.consulta.valor > 0 "
			+ "AND ps = ?3")
	public List<Agendamento> listarConsultasPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);
}