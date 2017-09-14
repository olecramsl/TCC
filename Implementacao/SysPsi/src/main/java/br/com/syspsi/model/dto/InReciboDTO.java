package br.com.syspsi.model.dto;

import java.math.BigDecimal;
import java.util.Calendar;

import br.com.syspsi.model.entity.Paciente;


public class InReciboDTO {		
	private Paciente paciente;
	private String referenteA;
	private Calendar dataEmissao;
	private BigDecimal valor;	

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
	
	/**
	 * @return the dataEmissao
	 */
	public Calendar getDataEmissao() {
		return dataEmissao;
	}

	/**
	 * @param dataEmissao the dataEmissao to set
	 */
	public void setDataEmissao(Calendar dataEmissao) {
		this.dataEmissao = dataEmissao;
	}

	/**
	 * @return the valor
	 */
	public BigDecimal getValor() {
		return valor;
	}

	/**
	 * @param valor the valor to set
	 */
	public void setValor(BigDecimal valor) {
		this.valor = valor;
	}
}
