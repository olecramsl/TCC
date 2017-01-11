package br.com.syspsi.modelo;

import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class Agendamento {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private Long gCalendarId;
	private Paciente paciente;
	private String title;
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar start;
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar end;
	private String description;				
	
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
		this.title = (this.description != null && !this.description.isEmpty()) ? 
				this.paciente.getNomeExibicao() + " (" + this.description + ")" : 
				this.paciente.getNomeExibicao();
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
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}
	
	/**
	 * @param titulo the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
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
}
