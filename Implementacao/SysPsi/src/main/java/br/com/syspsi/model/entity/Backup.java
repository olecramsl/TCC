package br.com.syspsi.model.entity;

import java.util.Calendar;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.commons.codec.binary.Base64;

@Entity
public class Backup {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private Calendar inicio;
	private Calendar fim;
	
	@Transient
	private static String key = "$tM4l8OhfQ6&6f%#";
	
	// Apenas para JPA
	protected Backup() {
		
	}
	
	public Backup(Calendar inicio, Calendar fim) {
		this.id = null;
		this.inicio = inicio;
		this.fim = fim;
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
	public static String encrypt(String texto) throws Exception {
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");

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
    public static String decrypt(String encrypted) throws Exception {    	        	    	    	    
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");

        Cipher cipher = Cipher.getInstance("AES");                
    	cipher.init(Cipher.DECRYPT_MODE, skeySpec);
    	 
        byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));        

        return new String(original);
    }
}
