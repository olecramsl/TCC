package br.com.syspsi.model.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="consulta_tem_recibo")
public class ConsultaTemRecibo {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@ManyToOne
    @JoinColumn(name="idconsulta")
	private Consulta consulta;
	@ManyToOne
    @JoinColumn(name="idrecibo")
	private Recibo recibo;		
	
	public ConsultaTemRecibo() {
		super();
	}	

	public ConsultaTemRecibo(Consulta consulta, Recibo recibo) {
		super();
		this.consulta = consulta;
		this.recibo = recibo;
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
	 * @return the consulta
	 */
	public Consulta getConsulta() {
		return consulta;
	}
	
	/**
	 * @param consulta the consulta to set
	 */
	public void setConsulta(Consulta consulta) {
		this.consulta = consulta;
	}
	
	/**
	 * @return the recibo
	 */
	public Recibo getRecibo() {
		return recibo;
	}
	
	/**
	 * @param recibo the recibo to set
	 */
	public void setRecibo(Recibo recibo) {
		this.recibo = recibo;
	}
}