package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Prontuario implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	@ManyToOne
    @JoinColumn(name="idpaciente")
	private Paciente paciente;	
	private String conteudo;
	private Calendar inicio;
	private Calendar fim;
	
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
	 * @return the conteudo
	 */
	public String getConteudo() {
		return conteudo;
	}
	
	/**
	 * @param conteudo the conteudo to set
	 */
	public void setConteudo(String conteudo) {
		this.conteudo = conteudo;
	}
	
	/**
	 * @return the inicio
	 */
	public Calendar getInicio() {
		return inicio;
	}
	
	/**
	 * @param inicio the inicio to set
	 */
	public void setInicio(Calendar inicio) {
		this.inicio = inicio;
	}
	
	/**
	 * @return the fim
	 */
	public Calendar getFim() {
		return fim;
	}
	
	/**
	 * @param fim the fim to set
	 */
	public void setFim(Calendar fim) {
		this.fim = fim;
	}	
}
