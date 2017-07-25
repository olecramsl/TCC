package br.com.syspsi.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class PsicologoController {
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	private static final Logger logger = LoggerFactory.getLogger(PsicologoController.class);	
	private static void logMessage(String msg, boolean error) {
    	if(!error){
    		logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
	@RequestMapping(
			value = "/isVinculadoGCal", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public boolean isVinculadoGCal(Principal user) {		
		try {
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			boolean isVinculadoGCal = psicologo.isVinculadoGCal();			
			return isVinculadoGCal;
		} catch(Exception ex) {
			logMessage("isVinculadoGCal - Erro: " + ex.getMessage(), true);
			return false;
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
