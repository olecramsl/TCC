package br.com.syspsi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.repository.AgendamentoRepositorio;

@RestController
@EnableAutoConfiguration
public class AgendaController {	
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
			
	@RequestMapping(value = "/agendamentos", method={RequestMethod.GET})
	public List<Agendamento> listarAgendamentos() {			
		return (List<Agendamento>) this.agendamentoRepositorio.findAll();
	}			
	
	@RequestMapping(value = "/salvarAgendamento", method={RequestMethod.POST})
	public void salvarAgendamento(Agendamento agendamento) {
		this.agendamentoRepositorio.save(agendamento);
	}
}
