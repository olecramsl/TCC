package br.com.syspsi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Consulta;
import br.com.syspsi.repository.ConsultaRepositorio;

@RestController
public class ConsultaController {
	@Autowired
	private ConsultaRepositorio consultaRepositorio;
	
	/**
	 * Salva um prontuario no BD
	 * @param consulta o prontuário a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarConsultaPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Consulta salvarConsultaPaciente(@RequestBody Consulta consulta) throws Exception {
		if (consulta.getAgendamento().getPaciente().getPsicologo() != null) {			
			consulta.setProntuario(consulta.encrypt(consulta.getProntuario()));
			return this.consultaRepositorio.save(consulta);
		}
		throw new Exception("Não foi possível salvar a consulta!");
	}
	
	/**
	 * @param agendamento um objeto Agendamento
	 * @return o prontuário associado ao agendamento
	 * @throws Exception caso algum problema ocorra 
	 */
	@RequestMapping(
			value = "/getConsultaByIdAgendamento", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public Consulta getProntuarioByIdAgendamento(@RequestParam(value="idAgendamento")  Long idAgendamento) throws Exception {
		Consulta consulta = this.consultaRepositorio.getConsultaByIdAgendamento(idAgendamento);
		if (consulta != null) { 
			consulta.setProntuario(consulta.decrypt(consulta.getProntuario()));
		}
		return consulta;
	}
}
