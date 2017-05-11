package br.com.syspsi.model.entity;

import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Backup {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private Calendar inicio;
	private Calendar fim;
	
	// Apenas para JPA
	protected Backup() {
		
	}
	
	public Backup(Calendar inicio, Calendar fim) {
		this.id = null;
		this.inicio = inicio;
		this.fim = fim;
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
