package br.com.syspsi.controller;

import java.security.Principal;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Config;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.ConfigRepositorio;

@RestController
public class ConfigController {
	
	@Autowired
	private ConfigRepositorio configRepositorio;
	
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
	 * @param dataInicial A data inicial dos agendamentos
	 * @param dataFinal A data final dos agendamentos
	 * @return A lista de agendamentos para o período informado
	 * @throws Exception no caso do formato de alguma das datas informadas for inválido
	 */
	@RequestMapping(
			value = "/loadConfig", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public Config loadConfig(Principal principal) throws Exception {
		logMessage("loadConfig: início", false);
		Psicologo psicologo = LoginController.getPsicologoLogado();
		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		logMessage("loadConfig: fim", false);
		return this.configRepositorio.findByPsicologo(psicologo);
	}
}
