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
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE a.grupo = ?1 "
			+ "AND a.eventoPrincipal = ?2 "
			+ "AND ps = ?3")
	public Agendamento listarPorGrupoEEventoPrincipalEPsicologo(Long grupo, boolean eventoPrincipal, Psicologo psicologo);	
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE a.grupo = ?1 "
			+ "AND ps = ?2")
	public List<Agendamento> listarPorGrupoEPsicologo(Long grupo, Psicologo psicologo);
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
			+ "WHERE DATE(a.start) = DATE(NOW()) "
			+ "AND a.start >= NOW() "			
			+ "AND a.ativo = true "			
			+ "AND ps = ?1 "
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAposHorario(Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE DATE(a.end) <= DATE(?1) AND a.eventoPrincipal = true AND ps = ?2")
	public List<Agendamento> listarEventosPrincipaisPorPeriodo(Calendar dataFinal, Psicologo psicologo);
	@Query("SELECT DATE_FORMAT(a.start,'%Y-%m-%d') FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "			
			+ "WHERE DATE(a.start) BETWEEN DATE(?1) AND DATE(?2) "
			+ "AND a.grupo = ?3 "
			+ "AND p.ativo = true "
			+ "AND ps = ?4")	
	public List<String> listarDatasAgendamentoPeriodoPorGrupoEPsicologo(Calendar dataInicial, Calendar dataFinal, long grupo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "					
			+ "WHERE DATE(a.start) > DATE(?1) "
			+ "AND a.grupo = ?2 "
			+ "AND ps = ?3 "			
			+ "AND p.ativo = true "
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosAposData(Calendar data, long grupo, Psicologo psicologo);
	@Query("SELECT COALESCE(MAX(grupo),0)+1 FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE ps = ?1")
	public Long getNextValueForGroup(Psicologo psicologo);
	@Transactional
	public void deleteByPaciente(Paciente paciente);
	@Query("SELECT idGCalendar FROM Agendamento "
			+ "WHERE DATE(start) BETWEEN DATE(?1) AND DATE(?2) "
			+ "AND idGCalendar IS NOT NULL "
			+ "AND ativo = true")
	public List<String> listarIdGCalendarPorPeriodo(Calendar start, Calendar end);
	@Transactional
	public void deleteByIdGCalendar(String idGCalendar);	
	public Agendamento findByIdGCalendarAndAtivo(String idGCalendar, boolean ativo);	
	public Agendamento findFirstByIdRecurringAndAtivo(String idRecurring, boolean ativo);
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
			+ "WHERE DATE(a.start) BETWEEN DATE(?1) AND DATE(?2) "
			+ "AND p = ?3 "
			+ "AND ps = ?4 "
			+ "AND a.consulta IS NOT NULL "					
			+ "ORDER BY a.start ASC")
	public List<Agendamento> listarAgendamentosComConsultaPeriodo(Calendar dataInicial, Calendar dataFinal, Paciente paciente, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "			
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "							
			+ "WHERE (DATE(a.start) BETWEEN DATE(?1) AND DATE(?2)) "
			+ "AND a.consulta IS NOT NULL "
			+ "AND a.consulta.valor > 0 "
			+ "AND ps = ?3")
	public List<Agendamento> listarConsultasPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "			
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "							
			+ "WHERE (DATE(a.start) BETWEEN DATE(?1) AND DATE(?2)) "
			+ "AND a.consulta IS NOT NULL "			
			+ "AND ps = ?3")
	public List<Agendamento> listarConsultasNaoFinalizadasPorPeriodo(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo);
	@Query("SELECT grupo FROM Agendamento "
			+ "WHERE idRecurring = ?1 "
			+ "AND eventoPrincipal = 1"
			)
	public Long getGrupoPorIdRecurring(String idRecurring);
	@Query("SELECT a FROM Agendamento a "
			+ "WHERE DATE(a.start) = DATE(?1) "
			+ "AND a.idRecurring = ?2 "
			+ "AND a.ativo = true"
			)
	public Agendamento localizarAgendamentoRepetitivo(Calendar start, String idRecurring);	
	@Query("SELECT a FROM Agendamento a "
			+ "WHERE a.idRecurring = ?1 AND "
			+ "a.eventoPrincipal = true "
			+ "AND a.ativo = true"
			)
	public Agendamento localizarAgendamentoPrincipalRepetitivo(String idRecurring);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE a.idGCalendar IS NOT NULL "
			+ "OR a.idRecurring IS NOT NULL "
			+ "AND ps = ?1")
	public List<Agendamento> listarAgendamentosVinculados(Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE (DATE(a.start) >= DATE(?2) "
			+ "AND a.eventoPrincipal = false) "
			+ "AND a.ativo = true "
			+ "AND ps = ?1")
	public List<Agendamento> listarAgendamentosSimplesAVincular(Psicologo psicologo, Calendar dataInicial);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE a.eventoPrincipal = true "
			+ "AND a.ativo = true "
			+ "AND ps = ?1")
	public List<Agendamento> listarAgendamentosRepetidosAVincular(Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE (DATE(a.start) < DATE(?2) "
			+ "AND a.eventoPrincipal = false) "
			+ "AND a.ativo = true "
			+ "AND ps = ?1")
	public List<Agendamento> listarAgendamentosRepetitivosParaNaoVincular(Psicologo psicologo, Calendar dataInicial);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE a.idRecurring = ?1 "
			+ "AND a.ativo = true "
			+ "AND ps = ?3")
	public List<Agendamento> listarAgendamentoPorIdRecurringEAtivoEPsicologo(String idRecurring, boolean ativo, Psicologo psicologo);
	@Query("SELECT a FROM Agendamento a "
			+ "INNER JOIN a.paciente p "
			+ "INNER JOIN p.psicologo ps "
			+ "WHERE a.grupo = ?1 "
			+ "AND ps = ?2 "			
			+ "AND a.ativo = false")
	public List<Agendamento> listarAgendamentosParaExcluirNoGoogleCalendarDuranteExportacao(Long grupo, Psicologo psicologo);	
}