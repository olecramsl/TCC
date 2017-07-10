package br.com.syspsi.model.dto;

import java.util.Calendar;

import br.com.syspsi.model.entity.Paciente;

public class InRelatorioDTO {
	private Calendar dataInicial;
	private Calendar dataFinal;
	private Paciente paciente;
	/**
	 * @return the dataInicial
	 */
	public Calendar getDataInicial() {
		return dataInicial;
	}
	/**
	 * @param dataInicial the dataInicial to set
	 */
	public void setDataInicial(Calendar dataInicial) {
		this.dataInicial = dataInicial;
	}
	/**
	 * @return the dataFinal
	 */
	public Calendar getDataFinal() {
		return dataFinal;
	}
	/**
	 * @param dataFinal the dataFinal to set
	 */
	public void setDataFinal(Calendar dataFinal) {
		this.dataFinal = dataFinal;
	}
	/**
	 * @return the paciente
	 */
	public Paciente getPaciente() {
		return paciente;
	}
	/**
	 * @param paciente the paciente to set
	 */
	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}

	
}
