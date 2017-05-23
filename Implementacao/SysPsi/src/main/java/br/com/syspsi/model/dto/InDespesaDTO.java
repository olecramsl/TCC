package br.com.syspsi.model.dto;

import java.util.Calendar;

import br.com.syspsi.model.entity.Despesa;

public class InDespesaDTO {
	private Despesa despesa;
	private Calendar dataInicial;
	private Calendar dataFinal;
	
	/**
	 * @return the despesa
	 */
	public Despesa getDespesa() {
		return despesa;
	}
	
	/**
	 * @param despesa the despesa to set
	 */
	public void setDespesa(Despesa despesa) {
		this.despesa = despesa;
	}
	
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
}
