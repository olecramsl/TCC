package br.com.syspsi;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AgendaController {	
	@RequestMapping("/agendamentos")
	public List<Agendamento> listarAgendamentos() {
		List<Agendamento> lstAgendamentos = new ArrayList<Agendamento>();
		Agendamento agendamento1 = new Agendamento(1, "Marcelo Lima", Calendar.getInstance(), Calendar.getInstance(), null);
		Agendamento agendamento2 = new Agendamento(2, "Jacira Cunha", Calendar.getInstance(), Calendar.getInstance(), "Não compareceu");
		lstAgendamentos.add(agendamento1);		
		lstAgendamentos.add(agendamento2);
		return lstAgendamentos;
	}
}
