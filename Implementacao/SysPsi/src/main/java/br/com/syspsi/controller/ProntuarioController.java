package br.com.syspsi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Prontuario;
import br.com.syspsi.repository.ProntuarioRepositorio;

@RestController
public class ProntuarioController {
	@Autowired
	private ProntuarioRepositorio prontuarioRepositorio;
	
	/**
	 * Salva um prontuario no BD
	 * @param prontuario o prontuário a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarProntuarioPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Prontuario salvarProntuarioPaciente(@RequestBody Prontuario prontuario) throws Exception {
		if (prontuario.getPaciente().getPsicologo() != null) {			
			prontuario.setConteudo(prontuario.encrypt(prontuario.getConteudo()));
			return this.prontuarioRepositorio.save(prontuario);
		}
		throw new Exception("Não foi possível salvar o prontuário do paciente!");
	}
	
	/**
	 * @param agendamento um objeto Agendamento
	 * @return o prontuário associado ao agendamento
	 * @throws Exception caso algum problema ocorra 
	 */
	@RequestMapping(
			value = "/getProntuarioByIdAgendamento", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public Prontuario getProntuarioByIdAgendamento(@RequestParam(value="idAgendamento")  Long idAgendamento) throws Exception {
		return this.prontuarioRepositorio.getProntuarioByIdAgendamento(idAgendamento);
	}
}
