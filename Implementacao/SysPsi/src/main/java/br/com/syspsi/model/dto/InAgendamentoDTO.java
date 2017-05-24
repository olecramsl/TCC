package br.com.syspsi.model.dto;

import br.com.syspsi.model.entity.Agendamento;

public class InAgendamentoDTO {
	private Agendamento agendamento;
	private boolean repetirSemanalmente;	
	
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
	 * @return the repetirSemanalmente
	 */
	public boolean isRepetirSemanalmente() {
		return repetirSemanalmente;
	}

	/**
	 * @param repetirSemanalmente the repetirSemanalmente to set
	 */
	public void setRepetirSemanalmente(boolean repetirSemanalmente) {
		this.repetirSemanalmente = repetirSemanalmente;
	}
}
