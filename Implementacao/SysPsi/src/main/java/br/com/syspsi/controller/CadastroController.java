package br.com.syspsi.controller;

import java.util.List;

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
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosAtivos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosAtivos() throws Exception {
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
	public List<GrupoPaciente> listarGruposPacientes() throws Exception {
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
		paciente.setPsicologo(LoginController.getPsicologoLogado());
		if (paciente.getPsicologo() != null) {
			try {
				if (paciente.getCpf() != null) {
					paciente.validarCPF(paciente.getCpf());
				}
				
				if (paciente.getCpfResponsavel() != null) {
					paciente.validarCPF(paciente.getCpfResponsavel());
				}
				
				return (Paciente) this.pacienteRepositorio.save(paciente);
			} catch (DataIntegrityViolationException e) {
				if (e.getMessage().toLowerCase().contains("cpf")) {
					throw new Exception("O CPF informado já está cadastrado.");
				} else {
					throw new Exception("Erro ao salvar o paciente.");
				}
			} 
		} else {
			throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
		}
	}
}
