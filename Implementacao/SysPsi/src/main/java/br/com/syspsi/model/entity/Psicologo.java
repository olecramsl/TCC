package br.com.syspsi.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Psicologo implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	private Long id;
	@Column(name="nomecompleto")
	private String nomeCompleto;	
	private String cpf;
	private String crp;
	private String login;
	private byte[] senha;	
	private byte[] chave;
	@Column(name="vinculadogcal")
	private boolean vinculadoGCal;
	private boolean ativo;
	@Transient
	private String nomeExibicao;

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
	 * @return the nome
	 */
	public String getNomeCompleto() {
		return nomeCompleto;
	}
	
	/**
	 * @param nome the nome to set	
	 */
	public void setNomeCompleto(String nome) {
		this.nomeCompleto = nome;
	}
	
	/**
	 * @return the cpf
	 */
	public String getCpf() {
		return cpf;
	}

	/**
	 * @param cpf the cpf to set
	 */
	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	/**
	 * @return the crp
	 */
	public String getCrp() {
		return crp;
	}

	/**
	 * @param crp the crp to set
	 */
	public void setCrp(String crp) {
		this.crp = crp;
	}

	/**
	 * @return the login
	 */
	public String getLogin() {
		return login;
	}

	/**
	 * @param login the login to set
	 */
	public void setLogin(String login) {
		this.login = login;
	}

	/**
	 * @return the senha
	 */
	@JsonIgnore
	public byte[] getSenha() {
		return senha;
	}

	/**
	 * @param senha the senha to set
	 */
	public void setSenha(byte[] senha) {
		this.senha = senha;
	}

	/**
	 * @return the chave
	 */
	@JsonIgnore
	public byte[] getChave() {
		return chave;
	}

	/**
	 * @param chave the chave to set
	 */
	public void setChave(byte[] chave) {
		this.chave = chave;
	}

	/**
	 * @return the vinculadoGCal
	 */
	public boolean isVinculadoGCal() {
		return vinculadoGCal;
	}

	/**
	 * @param vinculadoGCal the vinculadoGCal to set
	 */
	public void setVinculadoGCal(boolean vinculadoGCal) {
		this.vinculadoGCal = vinculadoGCal;
	}

	/**
	 * @return the ativo
	 */
	public boolean isAtivo() {
		return ativo;
	}

	/**
	 * @param ativo the ativo to set
	 */
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
	
	/**
	 * @return the nomeExibicao
	 */
	public String getNomeExibicao() {
		// nome de exibicao
		if (!this.nomeCompleto.isEmpty()) {
			int index = this.nomeCompleto.split(" ").length - 1;
			if (index > 0) {
				return this.nomeCompleto.split(" ")[0] + " " + this.nomeCompleto.split(" ")[index];
			} else {
				return this.nomeCompleto.split(" ")[0];
			}
		}
		return null;
	}
}