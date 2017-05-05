package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.apache.commons.codec.binary.Base64;

@Entity
public class Consulta implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private String prontuario;
	private double valor;
	private boolean recibo;
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
	 * @return the prontuario
	 */
	public String getProntuario() {
		return prontuario;
	}
	
	/**
	 * @param conteudo the prontuario to set
	 */
	public void setProntuario(String conteudo) {
		this.prontuario = conteudo;
	}
	
	/**
	 * @return the valor
	 */
	public double getValor() {
		return valor;
	}

	/**
	 * @param valor the valor to set
	 */
	public void setValor(double valor) {
		this.valor = valor;
	}

	/**
	 * @return the recibo
	 */
	public boolean isRecibo() {
		return recibo;
	}

	/**
	 * @param recibo the recibo to set
	 */
	public void setRecibo(boolean recibo) {
		this.recibo = recibo;
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
	public String encrypt(String texto, Psicologo psicologo) throws Exception {
		//byte[] key = (this.agendamento.getPaciente().getCpf() + "@tG7!").getBytes("UTF-8");
		byte[] key = psicologo.getChave();		
		
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES");        
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);

        byte[] encrypted = cipher.doFinal(texto.getBytes());        

        return Base64.encodeBase64String(encrypted);
    }

	/**
	 * Decripta um texto
	 * @param encrypted o texto criptografado
	 * @return o texto descriptografado
	 * @throws Exception caso algum erro ocorra durante a descriptografia
	 */
    public String decrypt(String encrypted, Psicologo psicologo) throws Exception {
    	//byte[] key = (this.agendamento.getPaciente().getCpf() + "@tG7!").getBytes("UTF-8");
    	byte[] key = psicologo.getChave();    	
    	    	    	    	
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES");                
    	cipher.init(Cipher.DECRYPT_MODE, skeySpec);
    	 
        byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));        

        return new String(original);
    }

}
