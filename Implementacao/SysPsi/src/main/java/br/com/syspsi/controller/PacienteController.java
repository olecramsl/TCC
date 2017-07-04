package br.com.syspsi.controller;

import java.security.Principal;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.PacienteRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class PacienteController {

	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
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
	
	@RequestMapping(
			value = "/listarAniversariantesDoMes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public List<Paciente> listarAniversariantesDoMes(Principal user) throws Exception {
		logMessage("PacienteController.listarAniversariantesDoMes: início", false);
		try {
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			
			List<Paciente> lstAniversariantes = 
					this.pacienteRepositorio.listarAniversariantesDoMes(psicologo); 
			logMessage("PacienteController.listarAniversariantesDoMes: fim", false);
			return lstAniversariantes;
		} catch(Exception ex) {
			logMessage("Erro ao buscar aniversariantes: " + ex.getMessage(), true);
			throw new Exception();
		}
	}
}
