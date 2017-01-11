package br.com.syspsi.modelo;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.syspsi.persistencia.PacienteRepositorio;

@Entity
public class Paciente {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private String nome;
	private String sobrenome;
	private boolean ativo;
	@Transient
	private String nomeExibicao;
	@Autowired
	private static PacienteRepositorio pacienteRepositorio;
	
	// Apenas para JPA
	protected Paciente() {
		super();
	}
	
	public Paciente(long id, String nome, String sobrenome) {
		super();		
		this.id = id;
		this.nome = nome;
		this.sobrenome = sobrenome;
		
		// nome de exibicao
		if (!this.nome.isEmpty() && !this.sobrenome.isEmpty()) {
			int index = this.sobrenome.split(" ").length - 1;
			this.nomeExibicao = this.nome.split(" ")[0] + " " + this.sobrenome.split(" ")[index];
		}
	}
	/**
	 * @return the id
	 */
	public long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(long id) {
		this.id = id;
	}
	/**
	 * @return the nome
	 */
	public String getNome() {
		return nome;
	}
	/**
	 * @param nome the nome to set
	 */
	public void setNome(String nome) {
		this.nome = nome;
	}
	/**
	 * @return the sobrenome
	 */
	public String getSobrenome() {
		return sobrenome;
	}
	/**
	 * @param sobrenome the sobrenome to set
	 */
	public void setSobrenome(String sobrenome) {
		this.sobrenome = sobrenome;
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
		return this.nomeExibicao;
	}
	
	/**
	 * @return Uma lista contendo os pacientes ativos
	 */
	public static List<Paciente> getLstPacientesAtivos() {
		// TRATAMENTO PROVISÓRIO
		/*
		List<Paciente> lstPacientes = new ArrayList<Paciente>();
		lstPacientes.add(new Paciente(1, "Marcelo da", "Silva Lima"));
		lstPacientes.add(new Paciente(2, "Jacira", "Cunha"));
		return lstPacientes;
		*/
		
		return pacienteRepositorio.findByAtivo(true);
	}
}
