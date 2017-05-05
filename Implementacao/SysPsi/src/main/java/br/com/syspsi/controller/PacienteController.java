package br.com.syspsi.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.repository.PacienteRepositorio;

@RestController
public class PacienteController {
	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
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
			value = "/listarPacientesAtivosInativos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientesAtivosInativos(@RequestParam("ativo") Boolean ativo) throws Exception {		
		List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByAtivoAndPsicologoOrderByNomeCompletoAsc(ativo, LoginController.getPsicologoLogado());
		return lstPacientes;
	}
	
	@RequestMapping(
			value = "/listarPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientes() throws Exception {		
		List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByPsicologoOrderByNomeCompletoAsc(LoginController.getPsicologoLogado());
		return lstPacientes;
	}
	
	@RequestMapping(
			value = "/excluirPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirPaciente(@RequestBody Paciente paciente) throws Exception {
		if (paciente != null) {
			this.pacienteRepositorio.delete(paciente);			
			logMessage("Paciente id " + paciente.getId() + " e nome exibição " + paciente.getNomeExibicao() + " removido com sucesso", false);
		} else {
			logMessage("Paciente nulo", true);
			throw new Exception("Não foi possível remover o paciente");
		}
	}
	
	@RequestMapping(
			value = "/atualizarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarPaciente(@RequestBody Paciente paciente) throws Exception {
		this.pacienteRepositorio.save(paciente);
	}
}
