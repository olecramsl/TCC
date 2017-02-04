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
	private Long id;	
	@ManyToOne
    @JoinColumn(name="idpaciente")
	private Paciente paciente;	
	@ManyToOne
    @JoinColumn(name="idpsicologo")
	private Psicologo psicologo;
	@Column(name="gcalendarid") 
	private Long gCalendarId;	
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar start;
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar end;	
	private Long grupo;
	private String description;
	@Column(name="eventoprincipal")
	private boolean eventoPrincipal;
	private boolean ativo;
	@Transient
	private String title;
	
	// Apenas para JPA
	protected Agendamento() {
		super();
	}
	
	public Agendamento(Paciente paciente, Psicologo psicologo, Long gCalendarId, Calendar start, Calendar end,
			Long grupo, String description, boolean eventoPrincipal, boolean ativo) {
		super();		
		this.paciente = paciente;	
		this.psicologo = psicologo;
		this.gCalendarId = gCalendarId;
		this.start = start;
		this.end = end;
		this.grupo = grupo;
		this.description = description;
		this.eventoPrincipal = eventoPrincipal;
		this.ativo = ativo;
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
	
	public Long getGrupo() {
		return grupo;
	}

	public void setGrupo(Long grupo) {
		this.grupo = grupo;
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
	 * @return the eventoPrincipal
	 */
	public boolean isEventoPrincipal() {
		return eventoPrincipal;
	}

	/**
	 * @param eventoPrincipal the eventoPrincipal to set
	 */
	public void setEventoPrincipal(boolean eventoPrincipal) {
		this.eventoPrincipal = eventoPrincipal;
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

	/**
	 * @return the repetirSemanalmente
	 */
	public boolean isRepetirSemanalmente() {
		return this.grupo > 0 ? true : false;		
	}
}
