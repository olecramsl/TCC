package br.com.syspsi;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.modelo.Agendamento;
import br.com.syspsi.modelo.Paciente;

@RestController
public class AgendaController {	
	@RequestMapping("/agendamentos")
	public List<Agendamento> listarAgendamentos() {		
		List<Agendamento> lstAgendamentos = new ArrayList<Agendamento>();		
		List<Paciente> lstPacientes = Paciente.getLstPacientesAtivos();			
		Agendamento agendamento1 = new Agendamento(lstPacientes.get(0), Calendar.getInstance(), Calendar.getInstance(), null);
		Agendamento agendamento2 = new Agendamento(lstPacientes.get(1), Calendar.getInstance(), Calendar.getInstance(), "Não compareceu");
		lstAgendamentos.add(agendamento1);		
		lstAgendamentos.add(agendamento2);
		return lstAgendamentos;
	}
		
	@RequestMapping("/pacientesAtivos")
	public List<Paciente> getLstPacientesAtivos() {
		for (Paciente paciente : Paciente.getLstPacientesAtivos()) {
			System.out.println(paciente.getNome());
		}
		return Paciente.getLstPacientesAtivos();
	}
}
