package br.com.syspsi.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
		
		// ARRUMAR APÓS LOGIN
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.findByPeriod(di, df, this.psicologoRepositorio.findOne(1L));		
				
		List<Agendamento> lstAgendamentosParaSalvar = new ArrayList<>();
		List<Agendamento> lstParaApresentarView     = new ArrayList<>();
		for (Agendamento ag : lstAgendamentos) {
			if (ag.isEventoPrincipal() && ag.isAtivo()) {			
				List<String> lstDiasSalvos = new ArrayList<>();
				List<String> lstDiasParaSalvar = new ArrayList<>();
				lstAgendamentosParaSalvar = new ArrayList<>();	
				Agendamento agendamento;
				// dias para salvar no período				
				for (Calendar dia = (Calendar)di.clone(); dia.before(df); dia.add(Calendar.DATE, 1)) {					
					if ((dia.get(Calendar.DAY_OF_WEEK) == ag.getStart().get(Calendar.DAY_OF_WEEK)) && 
						    ((ag.getStart().before(dia) || ((!ag.getStart().before(dia)) && (!ag.getStart().after(dia)))))) {
						Calendar dayToSave = Calendar.getInstance();
						dayToSave.set(dia.get(Calendar.YEAR), dia.get(Calendar.MONTH), dia.get(Calendar.DAY_OF_MONTH),
								ag.getStart().get(Calendar.HOUR_OF_DAY), ag.getStart().get(Calendar.MINUTE), ag.getStart().get(Calendar.SECOND));
						lstDiasParaSalvar.add(format.format(dayToSave.getTime()));
					}
				}			

				// Dias já salvos no BD
				lstDiasSalvos = this.agendamentoRepositorio.listarDatasAgendamentoPeriodoPorGrupo(di, df, ag.getGrupo(), ag.getPsicologo());
				
				for (String dayToSave : lstDiasParaSalvar) {					
					if (!lstDiasSalvos.contains(dayToSave)) {					
						Calendar agendamentoStart = Calendar.getInstance(); 					
						Calendar agendamentoEnd = Calendar.getInstance();
						Calendar tmpData = Calendar.getInstance();		
						
						agendamentoStart.setTime(ag.getStart().getTime());
						agendamentoEnd.setTime(ag.getEnd().getTime());
						tmpData.setTime(format.parse(dayToSave));
						agendamentoStart.set(tmpData.get(Calendar.YEAR), tmpData.get(Calendar.MONTH), tmpData.get(Calendar.DAY_OF_MONTH));
						agendamentoEnd.set(tmpData.get(Calendar.YEAR), tmpData.get(Calendar.MONTH), tmpData.get(Calendar.DAY_OF_MONTH));						

						agendamento = new Agendamento(ag.getPaciente(), ag.getPsicologo(), ag.getgCalendarId(),
								agendamentoStart, agendamentoEnd, ag.getGrupo(), null, false);	
						
						lstAgendamentosParaSalvar.add(agendamento);						
						lstParaApresentarView.add(agendamento);
						
					}
				}
				this.agendamentoRepositorio.save(lstAgendamentosParaSalvar);
			}
		}				
		
		if (!lstParaApresentarView.isEmpty()) {
			lstAgendamentos.addAll(lstParaApresentarView);
		}
		
		return lstAgendamentos;
	}	
	
	/**	
	 * @return o próximo id a ser utilizado para um grupo de repetição de agendamento 
	 */
	@RequestMapping(
			value = "/getNextValueForGroup", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public long getNextValueForGroup() {
		// ARRUMAR APÓS LOGIN
		return this.agendamentoRepositorio.getNextValueForGroup(this.psicologoRepositorio.findOne(1L));
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
		
		agendamento.setPsicologo(this.psicologoRepositorio.findOne(1L)); // RETIRAR APÓS TRATAMENTO ADEQUADO (LOGIN)					
				
		List<Agendamento> lstAgendamento = new ArrayList<>();	
		
		if (agendamentoDTO.isRepetirSemanalmente()) {	
			if (agendamento.getGrupo() == 0) {
				agendamento.setGrupo(this.agendamentoRepositorio.getNextValueForGroup(agendamento.getPsicologo()));
				agendamento.setEventoPrincipal(true);
			}			
			
			int diaSemanaAgendamento = agendamento.getStart().get(Calendar.DAY_OF_WEEK);			
			Calendar dataInicialAgendamento = agendamento.getStart();			
						
			// percorre todos os dias constantes na view do calendário e repete o evento quando necessário			
			for (Calendar dia = agendamentoDTO.getDataInicialViewFC(); 
				 dia.before(agendamentoDTO.getDataFinalViewFC()); 
				 dia.add(Calendar.DATE, 1)) {	
				
				if ((dia.get(Calendar.DAY_OF_WEEK) == diaSemanaAgendamento) && 
				    ((dataInicialAgendamento.before(dia) || ((!dataInicialAgendamento.before(dia)) && (!dataInicialAgendamento.after(dia)))))) {																														
					Calendar agendamentoStart = Calendar.getInstance(); 					
					Calendar agendamentoEnd = Calendar.getInstance();										
					agendamentoStart.setTime(agendamento.getStart().getTime());
					agendamentoEnd.setTime(agendamento.getEnd().getTime());					
					agendamentoStart.set(dia.get(Calendar.YEAR), dia.get(Calendar.MONTH), dia.get(Calendar.DAY_OF_MONTH));							
					agendamentoEnd.set(dia.get(Calendar.YEAR), dia.get(Calendar.MONTH), dia.get(Calendar.DAY_OF_MONTH));					

					agendamento.setStart(agendamentoStart);
					agendamento.setEnd(agendamentoEnd);
					lstAgendamento.add(agendamento);
					
					agendamento = new Agendamento(agendamento.getPaciente(), agendamento.getPsicologo(), agendamento.getgCalendarId(),
							agendamentoStart, agendamentoEnd, agendamento.getGrupo(), null, false);																										
				}
			}		
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
	 * @param dataInicial a data inicial do período
	 * @param dataFinal a data final do período
	 * @param grupo o id do agrupamento do agendamento
	 * @throws Exception no caso do formato de alguma das datas informadas for inválido
	 * @return uma lista contendo as datas dos agendamentos encontrados no período para um determinado grupo
	 */
	@RequestMapping(
			value = "/listarAgendamentoPeriodoPorGrupo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)	
	public List<String> listarAgendamentoPeriodoPorGrupo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, @RequestParam("grupo") long grupo) throws Exception {		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			throw new Exception("Formato de data inválido em listarAgendamento.");
		}		
		
		/*
		List<String> lstDatasAgendamentos = this.agendamentoRepositorio
				.listarDatasAgendamentoPeriodoPorGrupo(di, df, grupo);
		
		return lstDatasAgendamentos;	
		*/
		return new ArrayList<>();
	}
}
