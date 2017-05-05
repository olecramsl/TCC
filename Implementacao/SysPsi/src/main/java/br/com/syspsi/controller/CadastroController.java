package br.com.syspsi.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Convenio;
import br.com.syspsi.model.entity.GrupoPaciente;
import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.repository.ConvenioRepositorio;
import br.com.syspsi.repository.GrupoPacienteRepositorio;
import br.com.syspsi.repository.PacienteRepositorio;

@RestController
public class CadastroController {
	@Autowired
	private ConvenioRepositorio convenioRepositorio;
	
	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
	@Autowired
	private GrupoPacienteRepositorio grupoPacienteRepositorio;
	
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
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosAtivos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosAtivos() {
		return this.convenioRepositorio.findByAtivo(true);
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarGruposPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<GrupoPaciente> listarGruposPacientes() {
		return (List<GrupoPaciente>) this.grupoPacienteRepositorio.findAll();
	}
	
	/**
	 * Salva um paciente no BD
	 * @param paciente o paciente a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Paciente salvarPaciente(@RequestBody Paciente paciente) throws Exception {
		logMessage("salvarPaciente: cadastro do paciente " + paciente.getNomeExibicao(), false);		
		
		paciente.setPsicologo(LoginController.getPsicologoLogado());
		if (paciente.getPsicologo() != null) {
			try {
				if (paciente.getCpf() != null && !paciente.getCpf().trim().isEmpty()) {
					paciente.validarCPF(paciente.getCpf());
				}
				
				if (paciente.getCpfResponsavel() != null && !paciente.getCpfResponsavel().trim().isEmpty()) {
					paciente.validarCPF(paciente.getCpfResponsavel());
				}
				
				logMessage("salvarPaciente: cadastro do paciente " + paciente.getNomeExibicao() + " realizado com sucesso!", false);				
				return (Paciente) this.pacienteRepositorio.save(paciente);
			} catch (DataIntegrityViolationException e) {
				if (e.getMessage().toLowerCase().contains("cpf")) {
					logMessage("salvarPaciente: CPF já cadastrado!", true);
					throw new Exception("O CPF informado já está cadastrado.");
				} else {
					logMessage("salvarPaciente: erro ao salvar o paciente: " + e.getMessage(), true);
					throw new Exception("Erro ao salvar o paciente.");
				}
			} 
		} else {
			logMessage("salvarPaciente: psicologo null!", true);
			throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
		}
	}
}
