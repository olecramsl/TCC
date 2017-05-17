package br.com.syspsi.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Despesa;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.DespesaRepositorio;

@RestController
public class FinanceiroController {
	private final static Logger logger = Logger.getLogger(FinanceiroController.class);
	
	@Autowired
	private DespesaRepositorio despesaRepositorio;
	
	
	private static void logMessage(String msg, boolean error) {
    	if(!error && logger.isDebugEnabled()){
    	    logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
	@RequestMapping(
			value="/salvarDespesa",
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Despesa salvarDespesa(@RequestBody Despesa despesa) throws Exception {
		logMessage("FinanceiroController.salvarDespesa: início", false);
		
		Psicologo psicologo = LoginController.getPsicologoLogado();
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}		
		despesa.setPsicologo(psicologo);
		Despesa desp = this.despesaRepositorio.save(despesa);
		
		logMessage("FinanceiroController.salvarDespesa: fim", false);
		return desp;
	}
	
	@RequestMapping(
			value="/excluirDespesa",
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirDespesa(@RequestBody Despesa despesa) throws Exception {
		logMessage("FinanceiroController.excluirDespesa: início", false);
		
		this.despesaRepositorio.delete(despesa);
		
		logMessage("FinanceiroController.excluirDespesa: fim", false);
	}
	
	@RequestMapping(
			value="/listarDespesasPorPeriodo",
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public List<Despesa> listarDespesas(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal) throws Exception {
		
		logMessage("FinanceitoController.listarDespesas: início", false);
		
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();				
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			logMessage("Formato de data inválido", true);
			throw new Exception("Erro ao listar despesas: formato de data inválido.");
		}
		
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		List<Despesa> lstDespesas = this.despesaRepositorio.listarPorPeriodo(di, df, psicologo);
		logMessage("FinanceitoController.listarDespesas: fim", false);
		return lstDespesas;
	}
}
