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
import javax.persistence.Table;

@Entity
@Table(name = "tmpgcalendarevent")
public class TmpGCalendarEvent implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@ManyToOne
    @JoinColumn(name="idpsicologo")
	private Psicologo psicologo;
	@Column(name="idgcalendar")
	private String idGCalendar;
	@Column(name="idrecurring")
	private String idRecurring;
	private Calendar start;
	private Calendar end;
	private String summary;
	private String description;
	
	// JPA only
	public TmpGCalendarEvent() {
		super();
	}
	
	public TmpGCalendarEvent(Psicologo psicologo, String idGCalendar, String idRecurring, Calendar start, Calendar end,
			String summary, String description) {
		super();		
		this.psicologo = psicologo;
		this.idGCalendar = idGCalendar;
		this.idRecurring = idRecurring;
		this.start = start;
		this.end = end;
		this.summary = summary;
		this.description = description;
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
	 * @param start the start to set
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
	 * @param end the end to set
	 */
	public void setEnd(Calendar end) {
		this.end = end;
	}
	
	/**
	 * @return the summary
	 */
	public String getSummary() {
		return summary;
	}
	
	/**
	 * @param summary the summary to set
	 */
	public void setSummary(String summary) {
		this.summary = summary;
	}
	
	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}
	
	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}	
}
