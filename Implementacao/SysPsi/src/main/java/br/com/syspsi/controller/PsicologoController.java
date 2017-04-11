package br.com.syspsi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class PsicologoController {
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@RequestMapping(
			value = "/gerarChave", 
			method={RequestMethod.GET}					
			)
	public void gerarChave() throws Exception {
		String key = LoginController.getPsicologoLogado().gerarChave();
		LoginController.getPsicologoLogado().setChave(key.getBytes());
		this.psicologoRepositorio.save(LoginController.getPsicologoLogado());
	}
}
