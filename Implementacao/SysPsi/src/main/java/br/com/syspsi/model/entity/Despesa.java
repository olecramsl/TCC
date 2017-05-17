package br.com.syspsi.model.entity;

import java.math.BigDecimal;
import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Despesa {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@ManyToOne
    @JoinColumn(name="idpsicologo")	
	private Psicologo psicologo;
	private String descricao;
	private BigDecimal valor;
	private Calendar vencimento;
	private boolean pago;
	private String observacao;
	
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * @return the psicologo
	 */
	public Psicologo getPsicologo() {
		return psicologo;
	}
	
	/**
	 * @param psicologo the psicologo to set
	 */
	public void setPsicologo(Psicologo psicologo) {
		this.psicologo = psicologo;
	}
	
	/**
	 * @return the descricao
	 */
	public String getDescricao() {
		return descricao;
	}
	
	/**
	 * @param descricao the descricao to set
	 */
	public void setDescricao(String descricao) {
		this.descricao = descricao;
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
	
	/**
	 * @return the vencimento
	 */
	public Calendar getVencimento() {
		return vencimento;
	}
	
	/**
	 * @param vencimento the vencimento to set
	 */
	public void setVencimento(Calendar vencimento) {
		this.vencimento = vencimento;
	}
	
	/**
	 * @return the pago
	 */
	public boolean isPago() {
		return pago;
	}
	
	/**
	 * @param pago the pago to set
	 */
	public void setPago(boolean pago) {
		this.pago = pago;
	}
	
	/**
	 * @return the observacao
	 */
	public String getObservacao() {
		return observacao;
	}
	
	/**
	 * @param observacao the observacao to set
	 */
	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}	
}
