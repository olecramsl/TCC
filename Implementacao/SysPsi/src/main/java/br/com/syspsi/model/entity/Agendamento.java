package br.com.syspsi.model.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@Entity
public class Agendamento {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;	
	@ManyToOne
    @JoinColumn(name="idpaciente")
	private Paciente paciente;
	@Column(name="gcalendarid") 
	private Long gCalendarId;	
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar start;
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar end;
	private String description;	
	@Transient
	private String title;
	
	// Apenas para JPA
	protected Agendamento() {
		super();
	}
	
	public Agendamento(Paciente paciente, Calendar start, Calendar end, String description) {
		super();		
		this.paciente = paciente;
		this.start = start;
		this.end = end;
		this.description = description;		
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
	 * @return the paciente
	 */
	public Paciente getPaciente() {
		return paciente;
	}

	/**
	 * @param paciente the user to set
	 */
	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}	
	
	/**
	 * @return the gCalendarId
	 */
	public Long getgCalendarId() {
		return gCalendarId;
	}

	/**
	 * @param gCalendarId the gCalendarId to set
	 */
	public void setgCalendarId(Long gCalendarId) {
		this.gCalendarId = gCalendarId;
	}
	
	/**
	 * @return the start
	 */
	public Calendar getStart() {
		return start;
	}
	
	/**
	 * @param inicio the start to set
	 */
	public void setStart(Calendar start) {
		this.start = start;
	}
	
	/**
	 * @return the end
	 */
	public Calendar getEnd() {
		return end;
	}
	
	/**
	 * @param fim the end to set
	 */
	public void setEnd(Calendar end) {
		this.end = end;
	}
	
	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}
	
	/**
	 * @param the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}		
	
	/**
	 * @return the title
	 */
	public String getTitle() {
		return (this.description != null && !this.description.isEmpty()) ?
				this.paciente.getNomeExibicao() + " (" + this.description + ")" : 
				this.paciente.getNomeExibicao();
	}
	
	/**
	 * @param titulo the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}
}