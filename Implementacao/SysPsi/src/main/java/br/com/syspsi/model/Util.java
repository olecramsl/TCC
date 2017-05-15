package br.com.syspsi.model;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

import br.com.syspsi.model.entity.Psicologo;

public class Util {
	private static String key = "$tM4l8OhfQ6&6f%#";
	
	/**
	 * Encripta um texto do arquivo de configuração com a chave da classe
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
	 * Encripta um texto com a chave de criptografia de um psicólogo
	 * @param texto o texto a ser criptografado
	 * @return o texto criptografado
	 * @throws Exception caso ocorra algum erro durante a encriptação
	 */
	public static String encrypt(String texto, Psicologo psicologo) throws Exception {
		byte[] key = psicologo.getChave();		
		
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES");        
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);

        byte[] encrypted = cipher.doFinal(texto.getBytes());        

        return Base64.encodeBase64String(encrypted);
    }
	
	/**
	 * Decripta um texto do arquivo de configuração com a chave da classe
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

	/**
	 * Decripta um texto com a chave de criptografia de um psicólogo
	 * @param encrypted o texto criptografado
	 * @return o texto descriptografado
	 * @throws Exception caso algum erro ocorra durante a descriptografia
	 */
    public static String decrypt(String encrypted, Psicologo psicologo) throws Exception {
    	byte[] key = psicologo.getChave();    	
    	    	    	    	
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");

        Cipher cipher = Cipher.getInstance("AES");                
    	cipher.init(Cipher.DECRYPT_MODE, skeySpec);
    	 
        byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));        

        return new String(original);
    }
}
