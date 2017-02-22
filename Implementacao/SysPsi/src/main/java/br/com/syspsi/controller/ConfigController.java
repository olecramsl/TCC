package br.com.syspsi.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Config;
import br.com.syspsi.repository.ConfigRepositorio;

@RestController
public class ConfigController {
	
	@Autowired
	private ConfigRepositorio configRepositorio;
	
	/**
	 * @param dataInicial A data inicial dos agendamentos
	 * @param dataFinal A data final dos agendamentos
	 * @return A lista de agendamentos para o período informado
	 * @throws Exception no caso do formato de alguma das datas informadas for inválido
	 */
	@RequestMapping(
			value = "/loadConfig", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public Config loadConfig(Principal principal) throws Exception {
		return this.configRepositorio.findByPsicologo(LoginController.getPsicologoLogado());
	}
}
