package br.com.syspsi.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class PsicologoController {
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
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
	
	/*
	@RequestMapping(
			value = "/gerarChave", 
			method={RequestMethod.GET}					
			)
	public void gerarChave() throws Exception {
		Psicologo psicologo = LoginController.getPsicologoLogado();
		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em gerarChave", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		String key = Util.gerarChave();
		psicologo.setChave(key.getBytes());
		this.psicologoRepositorio.save(psicologo);
	}
	*/
}
