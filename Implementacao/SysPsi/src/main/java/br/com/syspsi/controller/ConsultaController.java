package br.com.syspsi.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class ConsultaController {
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	private static final Logger logger = LoggerFactory.getLogger(ConsultaController.class);	
	private static void logMessage(String msg, boolean error) {
    	if(!error){
    		logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
		
	/**
	 * Salva um prontuario no BD
	 * @param consulta o prontuário a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarConsultaPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Agendamento salvarConsultaPaciente(@RequestBody Agendamento agendamento, Principal user) 
			throws Exception {
		logMessage("ConsultaController.salvarConsultaPaciente: início", false);
		
		if (user == null) {
			logMessage("user nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		//Psicologo psicologo = LoginController.getPsicologoLogado();
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		
		if (psicologo == null) {
			logMessage("Psicólogo nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
				
		if (agendamento == null) {
			logMessage("Agendamento nulo", true);
			throw new Exception("Não foi possível salvar a consulta.");
		}
						
		if (agendamento.getConsulta() == null) {
			logMessage("Consulta nula", true);
			throw new Exception("Não foi possível salvar a consulta");
		}
				
		agendamento.getConsulta().setInicio(agendamento.getStart());
		agendamento.getConsulta().setFim(agendamento.getEnd());
		agendamento.getConsulta().setProntuario(Util.encrypt(agendamento.getConsulta().getProntuario(), psicologo));				
		
		agendamento.setColor(AgendaController.COR_AGENDAMENTO_DEFAULT);
		if (agendamento.getConvenio() != null) {
			agendamento.setColor(AgendaController.COR_AGENDAMENTO_CONVENIO);
		}
		if (agendamento.isNaoCompareceu()) {
			agendamento.setColor(AgendaController.COR_AGENDAMENTO_NAO_COMPARECEU);
		}
		
		agendamento = this.agendamentoRepositorio.save(agendamento);
		
		logMessage("ConsultaController.salvarConsultaPaciente: fim", false);
		return agendamento;
	}			
}
