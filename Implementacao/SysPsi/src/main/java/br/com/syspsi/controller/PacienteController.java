package br.com.syspsi.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.repository.PacienteRepositorio;

@RestController
@EnableAutoConfiguration
public class PacienteController {
	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
	@RequestMapping(
			value = "/listarPacientesAtivos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientesAtivos(Principal principal) {
		List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByAtivoAndPsicologoOrderByNomeCompletoAsc(true, LoginController.getPsicologoLogado());
		return lstPacientes;
	}
}
