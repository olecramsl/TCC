package br.com.syspsi.controller;

import java.security.Principal;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InCredentials;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.PsicologoRepositorio;


@RestController
public class LoginController {
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	private static Psicologo psicologoLogado;
	
	/**
	 * @return the psicologoLogado
	 */
	public static Psicologo getPsicologoLogado() {
		return psicologoLogado;
	}
	
	@RequestMapping(
			value = "/login", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public Psicologo login(@RequestBody InCredentials credentials) {
		byte[] nextSalt = Util.getNextSalt();
		byte[] result = Util.hash("123".toCharArray(), nextSalt);
		Base64.Encoder enc = Base64.getEncoder();
		System.out.printf("salt: %s%n", enc.encodeToString(nextSalt));
		System.out.printf("hash: %s%n", enc.encodeToString(result));
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(credentials.getUsername());
		byte[] expectedHash = Util.hash(credentials.getPassword().toCharArray(), psicologo.getSalt().getBytes());
		if (Util.isExpectedPassword(psicologo.getSenha().toCharArray(), psicologo.getSalt().getBytes(), expectedHash)) {
			System.out.println("Done");
			psicologoLogado = psicologo;
			return psicologo;
		}
		return null;
	}
	
	@RequestMapping("/user")
	public Principal user(Principal user) {
		System.out.println("Before");
		System.out.println(user.getName());
		psicologoLogado = psicologoRepositorio.findByLogin(user.getName());		
		return user;
	}
	
	@RequestMapping("/keepAlive")
	public void keepAlive() {			
	}
}
