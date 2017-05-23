package br.com.syspsi.model.dto;

import java.math.BigDecimal;
import java.util.List;

import br.com.syspsi.model.entity.Despesa;

public class OutDespesaDTO {
	private List<Despesa> lstDespesas;	
	private BigDecimal totalDespesas;
	private BigDecimal totalDespesasPagas;
	private BigDecimal totalDespesasNaoPagas;
	
	/**
	 * @return the lstDespesas
	 */
	public List<Despesa> getLstDespesas() {
		return lstDespesas;
	}
	
	/**
	 * @param lstDespesas the lstDespesas to set
	 */
	public void setLstDespesas(List<Despesa> lstDespesas) {
		this.lstDespesas = lstDespesas;
	}
	
	/**
	 * @return the totalDespesas
	 */
	public BigDecimal getTotalDespesas() {
		return totalDespesas;
	}
	
	/**
	 * @param totalDespesas the totalDespesas to set
	 */
	public void setTotalDespesas(BigDecimal totalDespesas) {
		this.totalDespesas = totalDespesas;
	}
	
	/**
	 * @return the totalDespesasPagas
	 */
	public BigDecimal getTotalDespesasPagas() {
		return totalDespesasPagas;
	}
	
	/**
	 * @param totalDespesasPagas the totalDespesasPagas to set
	 */
	public void setTotalDespesasPagas(BigDecimal totalDespesasPagas) {
		this.totalDespesasPagas = totalDespesasPagas;
	}
	
	/**
	 * @return the totalDespesasNaoPagas
	 */
	public BigDecimal getTotalDespesasNaoPagas() {
		return totalDespesasNaoPagas;
	}
	
	/**
	 * @param totalDespesasNaoPagas the totalDespesasNaoPagas to set
	 */
	public void setTotalDespesasNaoPagas(BigDecimal totalDespesasNaoPagas) {
		this.totalDespesasNaoPagas = totalDespesasNaoPagas;
	}
}
