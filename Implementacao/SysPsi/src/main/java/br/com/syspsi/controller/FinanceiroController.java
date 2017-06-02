package br.com.syspsi.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InDespesaDTO;
import br.com.syspsi.model.dto.OutDespesaDTO;
import br.com.syspsi.model.dto.OutReceitaDTO;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Despesa;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.DespesaRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;

@RestController
public class FinanceiroController {
	private final static Logger logger = Logger.getLogger(FinanceiroController.class);
	
	@Autowired
	private DespesaRepositorio despesaRepositorio;
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	
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
	public OutDespesaDTO salvarDespesa(@RequestBody InDespesaDTO inDespesaDTO, Principal user) 
			throws Exception {
		logMessage("FinanceiroController.salvarDespesa: início", false);
		
		if (user == null) {
			logMessage("user nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		//Psicologo psicologo = LoginController.getPsicologoLogado();
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}	
		
		Despesa despesa = inDespesaDTO.getDespesa();
		if (despesa == null) {
			logMessage("despesa null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
		
		if (inDespesaDTO.getDataInicial() == null) {
			logMessage("dataInicial null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
		
		if (inDespesaDTO.getDataFinal() == null) {
			logMessage("dataFinal null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
				
		despesa.setPsicologo(psicologo);
		
		try {
			this.despesaRepositorio.save(despesa);
			OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(inDespesaDTO.getDataInicial(), 
					inDespesaDTO.getDataFinal(), psicologo);
			
			logMessage("FinanceiroController.salvarDespesa: fim", false);
			return outDespesaDTO;
		} catch(Exception ex) {
			logMessage("Erro ao salvar: " + ex.getMessage(), true);
			throw new Exception("Não foi possível salvar a despesa.");
		}
	}
	
	@RequestMapping(
			value="/excluirDespesa",
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public OutDespesaDTO excluirDespesa(@RequestBody InDespesaDTO inDespesaDTO, Principal user) 
			throws Exception {
		logMessage("FinanceiroController.excluirDespesa: início", false);
		
		if (user == null) {
			logMessage("user nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		
		Despesa despesa = inDespesaDTO.getDespesa();		
		if (despesa == null) {
			logMessage("FinanceiroController.excluirDespesa: despesa null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
		
		if (inDespesaDTO.getDataInicial() == null) {
			logMessage("FinanceiroController.excluirDespesa: dataInicial null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
		
		if (inDespesaDTO.getDataFinal() == null) {
			logMessage("FinanceiroController.excluirDespesa: dataFinal null", true);
			throw new Exception("Não foi possível excluir a despesa!");
		}
		
		try {			
			this.despesaRepositorio.delete(despesa);
			OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(inDespesaDTO.getDataInicial(), 
					inDespesaDTO.getDataFinal(), psicologo);
			logMessage("FinanceiroController.excluirDespesa: fim", false);
			
			return outDespesaDTO;
		} catch (Exception ex) {
			logMessage("FinanceiroController.excluirDespesa: " + ex.getMessage(), true);
			throw new Exception("Não foi possível excluir a despesa!");
		}					
	}
	
	@RequestMapping(
			value="/listarDespesasPorPeriodo",
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public OutDespesaDTO listarDespesas(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {
		
		logMessage("FinanceitoController.listarDespesas: início", false);
		
		if (user == null) {
			logMessage("user nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		
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
				
		OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(di, df, psicologo);
		logMessage("FinanceitoController.listarDespesas: fim", false);
		return outDespesaDTO;
	}
	
	@RequestMapping(
			value = "/listarConsultasPorPeriodo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public OutReceitaDTO listarConsultasPorPeriodo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {
		logMessage("ConsultaController.listarConsultasPorPeriodo: início", false);
		
		if (user == null) {
			logMessage("user nulo", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}						
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			logMessage("Formato de data inválido", true);
			throw new Exception("Erro ao listar agendamentos: formato de data inválido.");
		}		
		
		//Psicologo psicologo = LoginController.getPsicologoLogado();
		Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
				
		//List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo);
		try {
			OutReceitaDTO outReceitaDTO = new OutReceitaDTO();
			outReceitaDTO.setLstAgendamentos(this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo));
			
			BigDecimal totalConsultas = new BigDecimal(0);
			for (Agendamento agendamento : outReceitaDTO.getLstAgendamentos()) {				
				totalConsultas = totalConsultas.add(agendamento.getConsulta().getValor());
				if (agendamento.getConsulta().getProntuario() != null && !agendamento.getConsulta().getProntuario().isEmpty()) {
					agendamento.getConsulta().setProntuario(Util.decrypt(agendamento.getConsulta().getProntuario(), psicologo));
				}
			}
			outReceitaDTO.setTotalConsultas(totalConsultas);
			logMessage("ConsultaController.listarConsultasPorPeriodo: Fim", false);
		
			return outReceitaDTO;
		} catch(Exception ex) {
			logMessage("Erro ao listar consultas: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar as receitas!");
		}
	}
	
	private OutDespesaDTO prepararOutDespesaDTO(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo) throws Exception {
		logMessage("FinanceitoController.prepararDespesaDTO: início", false);
		//Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		OutDespesaDTO despesaDTO = new OutDespesaDTO();		
		despesaDTO.setLstDespesas(this.despesaRepositorio.listarPorPeriodo(dataInicial, dataFinal, psicologo));
		
		BigDecimal totalDespesas = new BigDecimal(0);
		BigDecimal totalDespesasPagas = new BigDecimal(0);
		BigDecimal totalDespesasNaoPagas = new BigDecimal(0);
		
		for (Despesa despesa : despesaDTO.getLstDespesas()) {
			if (despesa.isPago()) {
				totalDespesasPagas = totalDespesasPagas.add(despesa.getValor());				
			} else {
				totalDespesasNaoPagas = totalDespesasNaoPagas.add(despesa.getValor());				
			}
			totalDespesas = totalDespesas.add(despesa.getValor());			
		}		
		despesaDTO.setTotalDespesas(totalDespesas);
		despesaDTO.setTotalDespesasNaoPagas(totalDespesasNaoPagas);
		despesaDTO.setTotalDespesasPagas(totalDespesasPagas);
		
		logMessage("FinanceitoController.prepararDespesaDTO: fim", false);
		
		return despesaDTO;
	}
}
