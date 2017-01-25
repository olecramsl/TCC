package br.com.syspsi.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
		
		return (List<Agendamento>) this.agendamentoRepositorio.findByPeriod(di, df);
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
		return this.agendamentoRepositorio.getNextValueForGroup();
	}	
		
	/**
	 * Salva um agendamento
	 * @param agendamento O agendamento a ser salvo
	 * @throws NullPointerException Caso o objeto retornado por save seja nulo
	 * @return o id do agendamento persistido no BD
	 */
	@RequestMapping(
			value = "/salvarAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Agendamento salvarAgendamento(@RequestBody Agendamento agendamento) throws NullPointerException {
		agendamento.setPsicologo(this.psicologoRepositorio.findOne(1L)); // RETIRAR APÓS TRATAMENTO ADEQUADO (LOGIN)					
				
		Agendamento tmpAgendamento = this.agendamentoRepositorio.save(agendamento);		
		if (tmpAgendamento == null) {
			throw new NullPointerException("Não foi possível salvar o agendamento!");
		}
		return tmpAgendamento;		
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
		
		List<String> lstDatasAgendamentos = this.agendamentoRepositorio
				.listarDatasAgendamentoPeriodoPorGrupo(di, df, grupo);
		
		return lstDatasAgendamentos;						
	}
}
