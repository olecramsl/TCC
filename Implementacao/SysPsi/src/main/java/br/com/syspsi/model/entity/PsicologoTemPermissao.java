package br.com.syspsi.model.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="psicologo_tem_permissao")
public class PsicologoTemPermissao {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	Integer id;
	@ManyToOne
    @JoinColumn(name="idpsicologo")
	Psicologo psicologo;
	@ManyToOne
    @JoinColumn(name="idpermissao")
	Permissao permissao;
	@Column(name="datacriacao")
	Calendar dataCriacao;		
	
	/**
	 * @param id
	 * @param psicologo
	 * @param permissao
	 * @param dataCriacao
	 */
	public PsicologoTemPermissao(Psicologo psicologo, Permissao permissao, Calendar dataCriacao) {
		super();		
		this.psicologo = psicologo;
		this.permissao = permissao;
		this.dataCriacao = dataCriacao;
	}
	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
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
	 * @return the permissao
	 */
	public Permissao getPermissao() {
		return permissao;
	}
	/**
	 * @param permissao the permissao to set
	 */
	public void setPermissao(Permissao permissao) {
		this.permissao = permissao;
	}
	/**
	 * @return the dataCriacao
	 */
	public Calendar getDataCriacao() {
		return dataCriacao;
	}
	/**
	 * @param dataCriacao the dataCriacao to set
	 */
	public void setDataCriacao(Calendar dataCriacao) {
		this.dataCriacao = dataCriacao;
	}
}
