package br.com.syspsi.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "grupopaciente")
public class GrupoPaciente implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private String descricao;
	@Column(name="maioridade")
	private boolean maiorIdade;
	
	/**
	 * @return the id
	 */
	public int getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(int id) {
		this.id = id;
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
	 * @return the maiorIdade
	 */
	public boolean isMaiorIdade() {
		return maiorIdade;
	}
	/**
	 * @param maiorIdade the maiorIdade to set
	 */
	public void setMaiorIdade(boolean maiorIdade) {
		this.maiorIdade = maiorIdade;
	}

}
