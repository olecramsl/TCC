package br.com.syspsi;

import java.util.Calendar;

public class Agendamento {
	private long id;
	private Long gCalendarId;
	private String user;
	private String title;
	private Calendar start;
	private Calendar end;
	private String description;				
	
	public Agendamento(long id, Long gCalendarId, String user, Calendar start, Calendar end, String description) {
		super();
		this.id = id;
		this.user = user;
		this.start = start;
		this.end = end;
		this.description = description;
		this.title = (this.description != null && !this.description.isEmpty()) ? this.user + " (" + this.description + ")" : this.user;
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
	 * @return the user
	 */
	public String getUser() {
		return user;
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(String user) {
		this.user = user;
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
