package br.com.syspsi.model;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.InputMismatchException;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

import br.com.syspsi.controller.FinanceiroController;
import br.com.syspsi.model.entity.Psicologo;

public class Util {
	private final static Logger logger = Logger.getLogger(FinanceiroController.class);
	private static String key = "$tM4l8OhfQ6&6f%#";
	private static final Random RANDOM = new SecureRandom();
	private static final int ITERATIONS = 10000;
	private static final int KEY_LENGTH = 256;
	
	private static void logMessage(String msg, boolean error) {
    	if(!error && logger.isDebugEnabled()){
    	    logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
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
    
    /**
	 * @return a chave de criptografia para criptografar os prontuários
	 * @throws Exception caso algum problema ocorra
	 */
	public static String gerarChave() throws Exception {
		// create new key
		SecretKey secretKey = KeyGenerator.getInstance("AES").generateKey();	
		
		// get base64 encoded version of the key
		return java.util.Base64.getEncoder().encodeToString(secretKey.getEncoded()).substring(0, 16);
	}
	
	/**
	 * Valida o cpf informado
	 * @throws Exception caso o cpf informado seja inválido
	 */
	public static void validarCPF(String cpf) throws Exception {
		// considera-se erro CPF's formados por uma sequencia de numeros iguais
	    if (cpf.equals("00000000000") || cpf.equals("11111111111") ||
	    	cpf.equals("22222222222") || cpf.equals("33333333333") ||
	    	cpf.equals("44444444444") || cpf.equals("55555555555") ||
	    	cpf.equals("66666666666") || cpf.equals("77777777777") ||
	    	cpf.equals("88888888888") || cpf.equals("99999999999") ||
	       (cpf.length() != 11)) {	    	
	       throw new Exception("O CPF informado é inválido!");
	    }

	    char dig10, dig11;
	    int sm, i, r, num, peso;

	    // "try" - protege o codigo para eventuais erros de conversao de tipo (int)
	    try {
	    	// Calculo do 1o. Digito Verificador
	    	sm = 0;
	    	peso = 10;
	    	for (i=0; i<9; i++) {              
	    		// converte o i-esimo caractere do CPF em um numero:
	    		// por exemplo, transforma o caractere '0' no inteiro 0         
	    		// (48 eh a posicao de '0' na tabela ASCII)         
	    		num = (int)(cpf.charAt(i) - 48); 
	    		sm = sm + (num * peso);
	    		peso = peso - 1;
	    	}

	    	r = 11 - (sm % 11);
	    	if ((r == 10) || (r == 11))
	    		dig10 = '0';
	    	else dig10 = (char)(r + 48); // converte no respectivo caractere numerico

	    	// Calculo do 2o. Digito Verificador
	    	sm = 0;
	    	peso = 11;
	    	for(i=0; i<10; i++) {
	    		num = (int)(cpf.charAt(i) - 48);
	    		sm = sm + (num * peso);
	    		peso = peso - 1;
	    	}

	    	r = 11 - (sm % 11);
	    	if ((r == 10) || (r == 11))
	    		dig11 = '0';
	    	else dig11 = (char)(r + 48);

	    	// Verifica se os digitos calculados conferem com os digitos informados.
	    	if ((dig10 != cpf.charAt(9)) || (dig11 != cpf.charAt(10))) {	    		
	    		throw new Exception("O CPF informado é inválido!");
	    	}
	    } catch (InputMismatchException erro) {	    	
	    	throw new Exception("O CPF informado é inválido!");
	    }
	}
	
	public static void validarCNPJ(String cnpj) throws Exception {
		// considera-se erro CNPJ's formados por uma sequencia de numeros iguais
		if (cnpj.equals("00000000000000") || cnpj.equals("11111111111111") ||
			cnpj.equals("22222222222222") || cnpj.equals("33333333333333") ||
	        cnpj.equals("44444444444444") || cnpj.equals("55555555555555") ||
	        cnpj.equals("66666666666666") || cnpj.equals("77777777777777") ||
	        cnpj.equals("88888888888888") || cnpj.equals("99999999999999") ||
	       (cnpj.length() != 14)) {
			throw new Exception("O CNPJ informado é inválido!");
		}

	    char dig13, dig14;
	    int sm, i, r, num, peso;

	    try {
	    	// Calculo do 1o. Digito Verificador
	    	sm = 0;
	    	peso = 2;
	    	for (i=11; i>=0; i--) {
	    		// converte o i-ésimo caractere do CNPJ em um número:
	    		// por exemplo, transforma o caractere '0' no inteiro 0
	    		// (48 eh a posição de '0' na tabela ASCII)
	    		num = (int)(cnpj.charAt(i) - 48);
	    		sm = sm + (num * peso);
	    		peso = peso + 1;
	    		if (peso == 10) {	    			 
	    			peso = 2;
	    		}
	    	}

	    	r = sm % 11;
	    	if ((r == 0) || (r == 1)) {
	    		dig13 = '0';
	    	} else {
	    		dig13 = (char)((11-r) + 48);
	    	}

	    	// Calculo do 2o. Digito Verificador
	    	sm = 0;
	    	peso = 2;
	    	for (i=12; i>=0; i--) {
	    		num = (int)(cnpj.charAt(i)- 48);
	    		sm = sm + (num * peso);
	    		peso = peso + 1;
	    		if (peso == 10) {
	    			peso = 2;
	    		}
	    	}

	    	r = sm % 11;
	    	if ((r == 0) || (r == 1)) {
	    		dig14 = '0';
	    	} else {
	    		dig14 = (char)((11-r) + 48);
	    	}

	    	// Verifica se os dígitos calculados conferem com os dígitos informados.
	    	if ((dig13 != cnpj.charAt(12)) || (dig14 != cnpj.charAt(13))) {
	    		throw new Exception("O CNPJ informado é inválido!");
	    	}
	    } catch (InputMismatchException erro) {
	    	throw new Exception("O CNPJ informado é inválido!");
	    }
	}
	
	/**
	 * Returns a random salt to be used to hash a password.
	 *
	 * @return a 16 bytes random salt
	 */
	public static byte[] getNextSalt() {
		byte[] salt = new byte[16];
	    RANDOM.nextBytes(salt);
	    return salt;
	}

	/**
	 * Returns a salted and hashed password using the provided hash.<br>
	 * Note - side effect: the password is destroyed (the char[] is filled with zeros)
	 *
	 * @param password the password to be hashed
	 * @param salt     a 16 bytes salt, ideally obtained with the getNextSalt method
	 *
	 * @return the hashed password with a pinch of salt
	 */
	public static byte[] hash(char[] password, byte[] salt) {
		PBEKeySpec spec = new PBEKeySpec(password, salt, ITERATIONS, KEY_LENGTH);
	    Arrays.fill(password, Character.MIN_VALUE);
	    try {
	    	SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
	    	return skf.generateSecret(spec).getEncoded();
	    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
	    	logMessage("Erro na criptografia da senha: " + e.getMessage(), true);
	    	throw new AssertionError("Erro na criptografia da senha", e);
	    } finally {
	    	spec.clearPassword();
	    }
	}

	/**
	 * Returns true if the given password and salt match the hashed value, false otherwise.<br>
	 * Note - side effect: the password is destroyed (the char[] is filled with zeros)
	 *
	 * @param password     the password to check
	 * @param salt         the salt used to hash the password
	 * @param expectedHash the expected hashed value of the password
	 *
	 * @return true if the given password and salt match the hashed value, false otherwise
	 */
	public static boolean isExpectedPassword(char[] password, byte[] salt, byte[] expectedHash) {
		byte[] pwdHash = hash(password, salt);
	    Arrays.fill(password, Character.MIN_VALUE);
	    if (pwdHash.length != expectedHash.length) {
	    	return false;
	    }
	    
	    for (int i = 0; i < pwdHash.length; i++) {
	    	if (pwdHash[i] != expectedHash[i]) {
	    		return false;
	    	}
	    }
	    return true;
	  }

}
