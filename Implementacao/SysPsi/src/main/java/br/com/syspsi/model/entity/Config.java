package br.com.syspsi.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class Config implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;
	@OneToOne
	@JoinColumn(name="idpsicologo")
	private Psicologo psicologo;
	@Column(name="temposessao") 
	private int tempoSessao;
	@Column(name="intervalotempocalendario") 
	private int intervaloTempoCalendario;		
	
	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}
	
	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
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
	 * @return the tempoSessao
	 */
	public int getTempoSessao() {
		return tempoSessao;
	}
	
	/**
	 * @param tempoSessao the tempoSessao to set
	 */
	public void setTempoSessao(int tempoSessao) {
		this.tempoSessao = tempoSessao;
	}
	
	/**
	 * @return the intervalorTempoCalendario
	 */
	public int getIntervaloTempoCalendario() {
		return intervaloTempoCalendario;
	}
	
	/**
	 * @param intervalorTempoCalendario the intervalorTempoCalendario to set
	 */
	public void setIntervaloTempoCalendario(int intervalorTempoCalendario) {
		this.intervaloTempoCalendario = intervalorTempoCalendario;
	}	
}