package br.com.syspsi;

import java.util.Calendar;

public class Agendamento {
	private long id;
	private String titulo;
	private Calendar inicio;
	private Calendar fim;
	private String observacoes;				
	
	public Agendamento(long id, String titulo, Calendar inicio, Calendar fim, String observacoes) {
		super();
		this.id = id;
		this.titulo = titulo;
		this.inicio = inicio;
		this.fim = fim;
		this.observacoes = observacoes;
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
	 * @return the titulo
	 */
	public String getTitulo() {
		return titulo;
	}
	
	/**
	 * @param titulo the titulo to set
	 */
	public void setTitulo(String titulo) {
		this.titulo = titulo;
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
	
	/**
	 * @return the observacoes
	 */
	public String getObservacoes() {
		return observacoes;
	}
	
	/**
	 * @param observacoes the observacoes to set
	 */
	public void setObservacoes(String observacoes) {
		this.observacoes = observacoes;
	}		
}
