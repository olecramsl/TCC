package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.apache.commons.codec.binary.Base64;

@Entity
public class Prontuario implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	@ManyToOne
    @JoinColumn(name="idpaciente")
	private Paciente paciente;	
	@ManyToOne
    @JoinColumn(name="idagendamento")
	private Agendamento agendamento;
	private String conteudo;
	private Calendar inicio;
	private Calendar fim;		
	
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
	 * @param paciente the paciente to set
	 */
	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}
	
	/**
	 * @return the agendamento
	 */
	public Agendamento getAgendamento() {
		return agendamento;
	}

	/**
	 * @param agendamento the agendamento to set
	 */
	public void setAgendamento(Agendamento agendamento) {
		this.agendamento = agendamento;
	}

	/**
	 * @return the conteudo
	 */
	public String getConteudo() {
		return conteudo;
	}
	
	/**
	 * @param conteudo the conteudo to set
	 */
	public void setConteudo(String conteudo) {
		this.conteudo = conteudo;
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
	 * Encripta um texto
	 * @param texto o texto a ser criptografado
	 * @return o texto criptografado
	 * @throws Exception caso ocorra algum erro durante a encriptação
	 */
	public String encrypt(String texto) throws Exception {
		byte[] key = (this.paciente.getCpf() + "@tG7!").getBytes("UTF-8");		
		
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);

        byte[] encrypted = cipher.doFinal(texto.getBytes());
        System.out.println("encrypted string: " + Base64.encodeBase64String(encrypted));

        return Base64.encodeBase64String(encrypted);
    }

	/**
	 * Decripta um texto
	 * @param encrypted o texto criptografado
	 * @return o texto descriptografado
	 * @throws Exception caso algum erro ocorra durante a descriptografia
	 */
    public String decrypt(String encrypted) throws Exception {
    	byte[] key = (this.paciente.getCpf() + "@tG7!").getBytes("UTF-8");    	
    	
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec);

        byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));

        return new String(original);
    }

}
