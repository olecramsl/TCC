package br.com.syspsi.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.exception.FinanceiroException;
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
	@Autowired
	private DespesaRepositorio despesaRepositorio;
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	private static final Logger logger = LoggerFactory.getLogger(FinanceiroController.class);	
	private static void logMessage(String msg, boolean error) {
    	if(!error){
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
		try {
			if (user == null) {
				logMessage("user nulo", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}
			
			//Psicologo psicologo = LoginController.getPsicologoLogado();
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			if (psicologo == null) {
				logMessage("salvarDespesa - Psicólogo nulo em getPsicologoLogado", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}	
			
			Despesa despesa = inDespesaDTO.getDespesa();
			if (despesa == null) {
				logMessage("salvarDespesa - despesa null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
			
			if (inDespesaDTO.getDataInicial() == null) {
				logMessage("salvarDespesa - dataInicial null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
			
			if (inDespesaDTO.getDataFinal() == null) {
				logMessage("salvarDespesa - dataFinal null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
					
			despesa.setPsicologo(psicologo);
			
			try {
				this.despesaRepositorio.save(despesa);
				OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(inDespesaDTO.getDataInicial(), 
						inDespesaDTO.getDataFinal(), psicologo);
								
				return outDespesaDTO;
			} catch(Exception ex) {
				logMessage("salvarDespesa - Erro ao salvar: " + ex.getMessage(), true);
				throw new FinanceiroException("Não foi possível salvar a despesa.");
			}
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("salvarDespesa - Erro ao salvar: " + ex.getMessage(), true);
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
		try {
			if (user == null) {
				logMessage("excluirDespesa - user nulo", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			
			Despesa despesa = inDespesaDTO.getDespesa();		
			if (despesa == null) {
				logMessage("excluirDespesa - despesa null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
			
			if (inDespesaDTO.getDataInicial() == null) {
				logMessage("excluirDespesa - dataInicial null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
			
			if (inDespesaDTO.getDataFinal() == null) {
				logMessage("excluirDespesa - dataFinal null", true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}
			
			try {			
				this.despesaRepositorio.delete(despesa);
				OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(inDespesaDTO.getDataInicial(), 
						inDespesaDTO.getDataFinal(), psicologo);				
				
				return outDespesaDTO;
			} catch (Exception ex) {
				logMessage("excluirDespesa - erro: " + ex.getMessage(), true);
				throw new FinanceiroException("Não foi possível excluir a despesa!");
			}	
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("salvarDespesa - Erro ao salvar: " + ex.getMessage(), true);
			throw new Exception("Não foi possível salvar a despesa.");
		}
	}
	
	@RequestMapping(
			value="/listarDespesasPorPeriodo",
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public OutDespesaDTO listarDespesas(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {
		try {
			if (user == null) {
				logMessage("listarDespesas - user nulo", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			
			Calendar di = Calendar.getInstance();
			Calendar df = Calendar.getInstance();				
			try {
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
				di.setTime(format.parse(dataInicial));
				df.setTime(format.parse(dataFinal));
			} catch (ParseException e) {
				logMessage("listarDespesas - Formato de data inválido", true);
				throw new FinanceiroException("Erro ao listar despesas: formato de data inválido.");
			}				
					
			OutDespesaDTO outDespesaDTO = prepararOutDespesaDTO(di, df, psicologo);			
			return outDespesaDTO;
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("listarDespesas - Erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar as despesas.");
		}
	}
	
	@RequestMapping(
			value = "/listarConsultasPorPeriodo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public OutReceitaDTO listarConsultasPorPeriodo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {		
		try {
			if (user == null) {
				logMessage("listarConsultasPorPeriodo - user nulo", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}						
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			Calendar di = Calendar.getInstance();
			Calendar df = Calendar.getInstance();		
			
			try {
				di.setTime(format.parse(dataInicial));
				df.setTime(format.parse(dataFinal));
			} catch (ParseException e) {
				logMessage("listarConsultasPorPeriodo - Formato de data inválido", true);
				throw new FinanceiroException("Erro ao listar agendamentos: formato de data inválido.");
			}		
			
			//Psicologo psicologo = LoginController.getPsicologoLogado();
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			if (psicologo == null) {
				logMessage("listarConsultasPorPeriodo - Psicólogo nulo.", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}
					
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
			
				return outReceitaDTO;
			} catch(Exception ex) {
				logMessage("listarConsultasPorPeriodo - Erro: " + ex.getMessage(), true);
				throw new FinanceiroException("Não foi possível listar as receitas");
			}
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("listarConsultasPorPeriodo - Erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar as receitas.");
		}
	}
	
	@RequestMapping(
			value = "/listarConsultasNaoFinalizadasPorPeriodo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Agendamento> listarConsultasNaoFinalizadasPorPeriodo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {		
		try {
			if (user == null) {
				logMessage("listarConsultasNaoFinalizadasPorPeriodo - user nulo", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}						
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			Calendar di = Calendar.getInstance();
			Calendar df = Calendar.getInstance();		
			
			try {
				di.setTime(format.parse(dataInicial));
				df.setTime(format.parse(dataFinal));
			} catch (ParseException e) {
				logMessage("listarConsultasNaoFinalizadasPorPeriodo - Formato de data inválido", true);
				throw new FinanceiroException("Erro ao listar agendamentos: formato de data inválido.");
			}		
			
			//Psicologo psicologo = LoginController.getPsicologoLogado();
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			if (psicologo == null) {
				logMessage("listarConsultasNaoFinalizadasPorPeriodo - Psicólogo nulo.", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
			}
					
			try {			
				List<Agendamento> lstAgendamentos = 
						this.agendamentoRepositorio.listarConsultasNaoFinalizadasPorPeriodo(di, df, psicologo);						
			
				return lstAgendamentos;
			} catch(Exception ex) {
				logMessage("listarConsultasNaoFinalizadasPorPeriodo - Erro: " + ex.getMessage(), true);
				throw new Exception("Não foi possível listar as consultas.");
			}
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("listarConsultasNaoFinalizadasPorPeriodo - Erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar as consultas.");
		}
	}
	
	private OutDespesaDTO prepararOutDespesaDTO(Calendar dataInicial, Calendar dataFinal, Psicologo psicologo) throws Exception {		
		try {
			//Psicologo psicologo = LoginController.getPsicologoLogado();		
			if (psicologo == null) {
				logMessage("prepararOutDespesaDTO - Psicólogo nulo em getPsicologoLogado", true);
				throw new FinanceiroException("Erro ao carregar psicólogo. Faça login novamente.");
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
									
			return despesaDTO;
		} catch(FinanceiroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("prepararOutDespesaDTO - Erro: " + ex.getMessage(), true);
			throw new Exception();
		}
	}	
}
