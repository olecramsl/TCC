package br.com.syspsi.model.entity;

import java.io.Serializable;
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
public class Agendamento implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;	
	@ManyToOne
    @JoinColumn(name="idpaciente")	
	private Paciente paciente;	
	@ManyToOne
    @JoinColumn(name="idconvenio")
	private Convenio convenio;
	@Column(name="idgcalendar") 
	private String idGCalendar;
	@Column(name="idrecurring")
	private String idRecurring;	
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar start;
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar end;	
	private Long grupo;
	private String description;
	@Column(name="eventoprincipal")
	private boolean eventoPrincipal;
	private String color;
	private boolean ativo;
	@Transient
	private String title;
	
	// Apenas para JPA
	protected Agendamento() {
		super();
	}
	
	public Agendamento(Paciente paciente, Convenio convenio, String idGCalendar, String idRecurring, Calendar start, 
			Calendar end, Long grupo, String description, String color, boolean eventoPrincipal, boolean ativo) {
		super();		
		this.paciente = paciente;
		this.convenio = convenio;
		this.idGCalendar = idGCalendar;
		this.idRecurring = idRecurring;
		this.start = start;
		this.end = end;
		this.grupo = grupo;
		this.description = description;
		this.eventoPrincipal = eventoPrincipal;
		this.color = color;
		this.ativo = ativo;
	}
	
	public Agendamento(Paciente paciente, String idGCalendar, String idRecurring, Calendar start, 
			Calendar end, Long grupo, String description, String color, boolean eventoPrincipal, boolean ativo) {
		super();		
		this.paciente = paciente;		
		this.idGCalendar = idGCalendar;
		this.idRecurring = idRecurring;
		this.start = start;
		this.end = end;
		this.grupo = grupo;
		this.description = description;		
		this.eventoPrincipal = eventoPrincipal;
		this.color = color;
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
	 * @return the convenio
	 */
	public Convenio getConvenio() {
		return convenio;
	}

	/**
	 * @param convenio the convenio to set
	 */
	public void setConvenio(Convenio convenio) {
		this.convenio = convenio;
	}

	/**
	 * @return the idGCalendar
	 */
	public String getIdGCalendar() {
		return idGCalendar;
	}

	/**
	 * @param idGCalendar the idGCalendar to set
	 */
	public void setIdGCalendar(String idGCalendar) {
		this.idGCalendar = idGCalendar;
	}
	
	/**
	 * @return the idRecurring
	 */
	public String getIdRecurring() {
		return idRecurring;
	}

	/**
	 * @param idRecurring the idRecurring to set
	 */
	public void setIdRecurring(String idRecurring) {
		this.idRecurring = idRecurring;
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
	 * @return the color
	 */
	public String getColor() {
		return color;
	}

	/**
	 * @param color the color to set
	 */
	public void setColor(String color) {
		this.color = color;
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
		if (this.paciente == null) {
			return !this.description.isEmpty()?this.description:"";
		}
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
