package br.com.syspsi.model.dto;

import br.com.syspsi.model.entity.Agendamento;

public class InReciboDTO {
	private Agendamento agendamento;
	private String referenteA;
	
	/**
	 * @return the agendamento
	 */
	public Agendamento getAgendamento() {
		return agendamento;
	}
	
	/**
	 * @param agendamento the agendamento to set
	 */
	public void setAgendamento(Agendamento agendamento) {
		this.agendamento = agendamento;
	}
	
	/**
	 * @return the referenteA
	 */
	public String getReferenteA() {
		return referenteA;
	}
	
	/**
	 * @param referenteA the referenteA to set
	 */
	public void setReferenteA(String referenteA) {
		this.referenteA = referenteA;
	}
}
