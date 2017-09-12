package br.com.syspsi.model.dto;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;

import br.com.syspsi.model.entity.Consulta;


public class InReciboDTO {	
	private List<Consulta> lstConsultas;
	private String referenteA;
	private String nomePaciente;
	private Calendar dataEmissao;
	private BigDecimal valor;

	/**
	 * @return the lstConsultas
	 */
	public List<Consulta> getLstConsultas() {
		return lstConsultas;
	}

	/**
	 * @param lstConsultas the lstConsultas to set
	 */
	public void setLstConsultas(List<Consulta> lstConsultas) {
		this.lstConsultas = lstConsultas;
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
	 * @return the nomePaciente
	 */
	public String getNomePaciente() {
		return nomePaciente;
	}

	/**
	 * @param nomePaciente the nomePaciente to set
	 */
	public void setNomePaciente(String nomePaciente) {
		this.nomePaciente = nomePaciente;
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
