package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Recibo implements Serializable {	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@ManyToOne
    @JoinColumn(name="idpaciente")
	private Paciente paciente;
	@ManyToOne
    @JoinColumn(name="idpsicologo")
	private Psicologo psicologo;
	@Column(name="referentea")
	private String referenteA;
	@Column(name="dataemissao")
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