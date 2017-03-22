package br.com.syspsi.controller;

import java.util.List;

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
	public void excluirPaciente(@RequestBody long id) throws Exception {
		this.pacienteRepositorio.deleteById(id);
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
