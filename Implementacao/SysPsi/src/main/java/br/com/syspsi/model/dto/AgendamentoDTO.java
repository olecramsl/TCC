package br.com.syspsi.model.dto;

import java.util.Calendar;

import br.com.syspsi.model.entity.Agendamento;

public class AgendamentoDTO {
	private Agendamento agendamento;
	private boolean repetirSemanalmente;
	private Calendar dataInicialViewFC;
	private Calendar dataFinalViewFC;
	
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

	/**
	 * @return the dataInicialViewFC
	 */
	public Calendar getDataInicialViewFC() {
		return dataInicialViewFC;
	}
	
	/**
	 * @param dataInicialViewFC the dataInicialViewFC to set
	 */
	public void setDataInicialViewFC(Calendar dataInicialViewFC) {
		this.dataInicialViewFC = dataInicialViewFC;
	}
	
	/**
	 * @return the dataFinalViewFC
	 */
	public Calendar getDataFinalViewFC() {
		return dataFinalViewFC;
	}
	
	/**
	 * @param dataFinalViewFC the dataFinalViewFC to set
	 */
	public void setDataFinalViewFC(Calendar dataFinalViewFC) {
		this.dataFinalViewFC = dataFinalViewFC;
	}		
}
