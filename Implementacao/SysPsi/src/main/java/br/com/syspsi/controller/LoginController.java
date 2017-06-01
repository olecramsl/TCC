package br.com.syspsi.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
		/*
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    String login = auth.getName(); //get logged in username
	    return (Psicologo) psicologoRepositorio.findByLogin(login);
	    */
	}
	
	@RequestMapping("/user")
	public Principal user(Principal user) {		
		psicologoLogado = psicologoRepositorio.findByLogin(user.getName());		
		return user;
	}
	
	@RequestMapping("/keepAlive")
	public void keepAlive() {			
	}
}
