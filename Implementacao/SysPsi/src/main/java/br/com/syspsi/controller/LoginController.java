package br.com.syspsi.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class LoginController {
	
	//@Autowired
	//private PsicologoRepositorio psicologoRepositorio;
	
	//private static Psicologo psicologoLogado;
	
	/**
	 * @return the psicologoLogado
	 */
	/*
	public static Psicologo getPsicologoLogado() {
		return psicologoLogado;
	}
	*/
	
	@RequestMapping("/user")
	public Principal user(Principal user) {		
		//psicologoLogado = psicologoRepositorio.findByLogin(user.getName());		
		return user;
	}
	
	@RequestMapping("/keepAlive")
	public void keepAlive() {			
	}
}
