package br.com.syspsi.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;

@RestController
public class ConsultaController {
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	private final static Logger logger = Logger.getLogger(CadastroController.class);
	
	private static void logMessage(String msg, boolean error) {
    	if(!error && logger.isDebugEnabled()){
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
	public Agendamento salvarConsultaPaciente(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("ConsultaController.salvarConsultaPaciente: início", false);
		
		Psicologo psicologo = LoginController.getPsicologoLogado();
		
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
	
	@RequestMapping(
			value = "/listarConsultasPorPeriodo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Agendamento> listarConsultasPorPeriodo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal) throws Exception {
		logMessage("ConsultaController.listarConsultasPorPeriodo: início", false);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			logMessage("Formato de data inválido", true);
			throw new Exception("Erro ao listar agendamentos: formato de data inválido.");
		}		
		
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo);		
		logMessage("ConsultaController.listarConsultasPorPeriodo: Fim", false);
		
		return lstAgendamentos;
	}
}
