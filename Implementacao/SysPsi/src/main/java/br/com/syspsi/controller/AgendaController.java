package br.com.syspsi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.repository.AgendamentoRepositorio;

@RestController
@EnableAutoConfiguration
public class AgendaController {	
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
				
	/**	
	 * @return Uma lista de agendamentos
	 */
	@RequestMapping(
			value = "/listarAgendamentos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)	
	public List<Agendamento> listarAgendamentos() {			
		return (List<Agendamento>) this.agendamentoRepositorio.findAll();
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
	public long salvarAgendamento(@RequestBody Agendamento agendamento) throws NullPointerException {		
		Agendamento tmpAgendamento = this.agendamentoRepositorio.save(agendamento);		
		if (tmpAgendamento == null) {
			throw new NullPointerException("Não foi possível salvar o agendamento!");
		}
		return tmpAgendamento.getId();			
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
}
