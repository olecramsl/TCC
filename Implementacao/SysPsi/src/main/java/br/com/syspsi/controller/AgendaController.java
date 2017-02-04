package br.com.syspsi.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.dto.AgendamentoDTO;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
@EnableAutoConfiguration
public class AgendaController {	
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	/**
	 * @param dataInicial A data inicial dos agendamentos
	 * @param dataFinal A data final dos agendamentos
	 * @return A lista de agendamentos para o período informado
	 * @throws Exception no caso do formato de alguma das datas informadas for inválido
	 */
	@RequestMapping(
			value = "/listarAgendamentos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Agendamento> listarAgendamentos(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal) throws Exception {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			throw new Exception("Formato de data inválido em listarAgendamento.");
		}																	
		
		List<Agendamento> lstAgendamentos = new ArrayList<>();
		// ARRUMAR APÓS LOGIN
		for (Agendamento ag : this.agendamentoRepositorio.findByPeriod(di, df, psicologoRepositorio.findOne(1L))) {
			if (ag.isEventoPrincipal() && ag.isAtivo()) {
				lstAgendamentos.add(ag); // os eventos principais ativos devem ser adicionados para serem exibidos na view				
				// Agendamento é criado com eventoPrincipal false, pois o evento principal já existe e está ativo,
				// restando apenas criar os agendamentos futuros
				Agendamento agendamento = new Agendamento(ag.getPaciente(), ag.getPsicologo(), null, 
						ag.getStart(), ag.getEnd(), ag.getGrupo(), null, !ag.isEventoPrincipal(), true);
				di.set(Calendar.HOUR_OF_DAY, agendamento.getStart().get(Calendar.HOUR_OF_DAY));
				di.set(Calendar.MINUTE, agendamento.getStart().get(Calendar.MINUTE));
				df.set(Calendar.HOUR_OF_DAY, agendamento.getEnd().get(Calendar.HOUR_OF_DAY));
				df.set(Calendar.MINUTE, agendamento.getEnd().get(Calendar.MINUTE));
				lstAgendamentos.addAll(this.getLstAgendamentosParaSalvar(di, df, agendamento));
				
			} else {			
				lstAgendamentos.add(ag); // Novo agendamento
			}
		}				
		
		this.agendamentoRepositorio.save(lstAgendamentos);
		
		// remove os inativos
		for (Iterator<Agendamento> iterator = lstAgendamentos.iterator(); iterator.hasNext(); ) {
		    Agendamento value = iterator.next();
		    if (!value.isAtivo()) {
		        iterator.remove();
		    }
		}
		
		return lstAgendamentos;
	}	
	
	/**
	 * Salva um agendamento
	 * @param agendamento O agendamento a ser salvo
	 * @param dataInicial A data inicial da view visualizada
	 * @param dataFinal A data final da view visualizada
	 * @throws Exception Caso haja algum problema ao persistir os dados no BD ou data(s) informada(s) inválida(s)
	 * @return o id do agendamento persistido no BD
	 */
	@RequestMapping(
			value = "/salvarAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public List<Agendamento> salvarAgendamento(@RequestBody AgendamentoDTO agendamentoDTO) {
		Agendamento agendamento = agendamentoDTO.getAgendamento();
		
		// ARRUMAR APÓS LOGIN
		agendamento.setPsicologo(psicologoRepositorio.findOne(1L));
				
		List<Agendamento> lstAgendamento = new ArrayList<>();		
		if (agendamentoDTO.isRepetirSemanalmente()) {		
			if (agendamento.getGrupo() == null || agendamento.getGrupo() == 0) {
				agendamento.setGrupo(this.agendamentoRepositorio.getNextValueForGroup(agendamento.getPsicologo()));
				agendamento.setEventoPrincipal(true);				
			}									
				
			lstAgendamento = this.getLstAgendamentosParaSalvar(agendamentoDTO.getDataInicialViewFC(), 
					agendamentoDTO.getDataFinalViewFC(), agendamento);
			this.agendamentoRepositorio.save(lstAgendamento);
		} else {			
			lstAgendamento.add(this.agendamentoRepositorio.save(agendamento));
		}						
		return lstAgendamento;		
	}
	
	/**
	 * Remove um agendamento do BD
	 * @param agendamento o agendamento a ser removido
	 * @throws IllegalArgumentException in case the given id is null
	 */
	@RequestMapping(
			value = "/removerAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void removerAgendamento(@RequestBody Agendamento agendamento) throws IllegalArgumentException {		
		this.agendamentoRepositorio.delete(agendamento);								
	}		
	
	/**
	 * Retorna uma lista de objetos Agendamento para serem gravados na view FullCalendar
	 * @param di a data inicial da view
	 * @param df a data final da view
	 * @param agendamento o objeto agendamento de referência
	 * @return um lista de objetos Agendamento
	 */
	private List<Agendamento> getLstAgendamentosParaSalvar(Calendar di, Calendar df, Agendamento ag) {
		List<Agendamento> lstAgendamento = new ArrayList<>();
		Agendamento agendamento = new Agendamento(ag.getPaciente(), ag.getPsicologo(), ag.getgCalendarId(), 
				ag.getStart(), ag.getEnd(), ag.getGrupo(), ag.getDescription(), ag.isEventoPrincipal(), 
				ag.isAtivo());
					
		// Dias já salvos no BD
		List<String> lstDiasSalvos = this.agendamentoRepositorio.listarDatasAgendamentoPeriodoPorGrupo(di, df, 
				agendamento.getGrupo(), agendamento.getPsicologo());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");		
		// percorre todos os dias constantes na view do calendário e repete o evento quando necessário		
		for (Calendar dia = (Calendar)di.clone(); dia.before(df); dia.add(Calendar.DATE, 1)) {			
			if ((dia.get(Calendar.DAY_OF_WEEK) == agendamento.getStart().get(Calendar.DAY_OF_WEEK)) &&
				    ((agendamento.getStart().before(dia) || 
				    ((!agendamento.getStart().before(dia)) && (!agendamento.getStart().after(dia)))))) {								
				// Verifica se o dia jah estah salvo no BD
				if (lstDiasSalvos.isEmpty() || !lstDiasSalvos.contains(format.format(dia.getTime()))) {
					agendamento.setStart((Calendar)dia.clone());
					agendamento.setEnd((Calendar)dia.clone());
					agendamento.getEnd().add(Calendar.HOUR, 1);

					lstAgendamento.add(agendamento);
					
					agendamento = new Agendamento(agendamento.getPaciente(), agendamento.getPsicologo(), null,  
							(Calendar)agendamento.getStart().clone(), (Calendar)agendamento.getEnd().clone(),
							agendamento.getGrupo(),	null, false, true);
				}
			}
		}
		return lstAgendamento;
	}
}