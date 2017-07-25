package br.com.syspsi.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.jasperreports.JasperReportsPdfView;

import br.com.syspsi.exception.RelatorioException;
import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InRelatorioDTO;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Despesa;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.DespesaRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@RestController
public class RelatorioController {

	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
	@Autowired
	private DespesaRepositorio despesaRepositorio;

	@Autowired
    private ApplicationContext appContext;
	
	private static final Logger logger = LoggerFactory.getLogger(RelatorioController.class);	
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
			value = "/imprimirRelatorioReceitas", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public ModelAndView imprimirRelatorioReceitas(@RequestBody InRelatorioDTO inRelatorioDTO, 
			Principal user) throws Exception {			
		try {
			Psicologo psicologo;
			if (user != null) {							
				psicologo = this.psicologoRepositorio.findByLogin(user.getName());
				if (psicologo == null) {
					logMessage("imprimirRelatorioReceitas - Psicólogo nulo.", true);
					throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
				}		
			} else {
				logMessage("imprimirRelatorioReceitas - User nulo.", true);
				throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
			}		
			
											
			List<Agendamento> lstAgendamentos = 
					this.agendamentoRepositorio.listarConsultasPorPeriodo(
							inRelatorioDTO.getDataInicial(), inRelatorioDTO.getDataFinal(), 
							psicologo);
			
			BigDecimal totalReceitas = new BigDecimal(0);
			for (Agendamento ag : lstAgendamentos) {				
				totalReceitas = totalReceitas.add(ag.getConsulta().getValor()); 
			}
										
			JRBeanCollectionDataSource beanColDataSource = 
					new JRBeanCollectionDataSource(lstAgendamentos);
								
			JasperReportsPdfView view = new JasperReportsPdfView();
	        view.setUrl("classpath:br/com/syspsi/jasper/receitasRel.jrxml");	        
	        view.setApplicationContext(appContext);
	        view.setContentType("application/pdf");	        
	        view.setReportDataKey("datasource");
	        
	        Properties p = new Properties();
	        p.setProperty("Content-disposition", "inline; filename=\"relatorioReceitas.pdf\"");
	        view.setHeaders(p);

	        Map<String, Object> params = new HashMap<>();
	        params.put("dataInicial", inRelatorioDTO.getDataInicial());
	        params.put("dataFinal", inRelatorioDTO.getDataFinal());
	        params.put("totalReceitas", totalReceitas);
	        params.put("datasource", beanColDataSource);
	        		        
	        return new ModelAndView(view, params);	        						           	       																									
		} catch(RelatorioException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("imprimirRelatorioReceitas - Erro: " + ex.getMessage(), true);			
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
	
	@RequestMapping(
			value = "/imprimirRelatorioDespesas", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public ModelAndView imprimirRelatorioDespesas(@RequestBody InRelatorioDTO inRelatorioDTO, 
			Principal user) throws Exception {							
		try {
			Psicologo psicologo;
			if (user != null) {							
				psicologo = this.psicologoRepositorio.findByLogin(user.getName());
				if (psicologo == null) {
					logMessage("imprimirRelatorioDespesas - Psicólogo nulo.", true);
					throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
				}		
			} else {
				logMessage("imprimirRelatorioDespesas - User nulo.", true);
				throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
			}		
		
										
			List<Despesa> lstDespesas = 
					this.despesaRepositorio.listarPorPeriodo(inRelatorioDTO.getDataInicial(), 
							inRelatorioDTO.getDataFinal(), psicologo);
			
			BigDecimal totalDespesas = new BigDecimal(0);
			for (Despesa despesa : lstDespesas) {				
				totalDespesas = totalDespesas.add(despesa.getValor()); 
			}			
								
			JRBeanCollectionDataSource beanColDataSource = 
					new JRBeanCollectionDataSource(lstDespesas);
								
			JasperReportsPdfView view = new JasperReportsPdfView();
	        view.setUrl("classpath:br/com/syspsi/jasper/despesasRel.jrxml");
	        view.setApplicationContext(appContext);
	        view.setContentType("application/pdf");	        
	        view.setReportDataKey("datasource");
	        	        
	        Properties p = new Properties();
	        p.setProperty("Content-disposition", "inline; filename=\"relatorioDespesas.pdf\"");
	        view.setHeaders(p);

	        Map<String, Object> params = new HashMap<>();
	        params.put("dataInicial", inRelatorioDTO.getDataInicial());
	        params.put("dataFinal", inRelatorioDTO.getDataFinal());
	        params.put("totalDespesas", totalDespesas);
	        params.put("datasource", beanColDataSource);
	        
	        return new ModelAndView(view, params);	        						           	       																								
		} catch(RelatorioException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("imprimirRelatorioDespesas - Erro: " + ex.getMessage(), true);			
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
	
	@RequestMapping(
			value = "/imprimirRelatorioProntuarios", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public ModelAndView imprimirRelatorioProntuarios(@RequestBody InRelatorioDTO inRelatorioDTO, 
			Principal user) throws Exception {	
		try {							
			Psicologo psicologo;
			if (user != null) {							
				psicologo = this.psicologoRepositorio.findByLogin(user.getName());
				if (psicologo == null) {
					logMessage("imprimirRelatorioProntuarios - Psicólogo nulo.", true);
					throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
				}		
			} else {
				logMessage("imprimirRelatorioProntuarios - User nulo.", true);
				throw new RelatorioException("Erro ao carregar psicólogo. Faça login novamente.");
			}	
											
			List<Agendamento> lstAgendamentos = this.agendamentoRepositorio
					.listarAgendamentosComConsultaPeriodo(inRelatorioDTO.getDataInicial(), 
							inRelatorioDTO.getDataFinal(), inRelatorioDTO.getPaciente(), 
							psicologo);
			
			Iterator<Agendamento> i = lstAgendamentos.iterator();
			while (i.hasNext()) {
			   Agendamento ag = i.next(); // must be called before you can call i.remove()
			   if (ag.getConsulta().getProntuario() == null) {
				   i.remove();
			   } else {
				   ag.getConsulta().setProntuario(Util.decrypt(ag.getConsulta().getProntuario(), psicologo));				   
			   }
			}
														
			JRBeanCollectionDataSource beanColDataSource = 
					new JRBeanCollectionDataSource(lstAgendamentos);
								
			JasperReportsPdfView view = new JasperReportsPdfView();
	        view.setUrl("classpath:br/com/syspsi/jasper/prontuariosRel.jrxml");
	        view.setApplicationContext(appContext);
	        view.setContentType("application/pdf");	        	        
	        view.setReportDataKey("datasource");
	        	        
	        Properties p = new Properties();
	        p.setProperty("Content-disposition", "inline; filename=\"relatorioDespesas.pdf\"");
	        view.setHeaders(p);

	        Map<String, Object> params = new HashMap<>();
	        params.put("dataInicial", inRelatorioDTO.getDataInicial());
	        params.put("dataFinal", inRelatorioDTO.getDataFinal());
	        params.put("nomePaciente", inRelatorioDTO.getPaciente().getNomeExibicao());
	        params.put("datasource", beanColDataSource);
	        
	        return new ModelAndView(view, params);	        						           	       																								
		} catch(RelatorioException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("imprimirRelatorioProntuarios - Erro: " + ex.getMessage(), true);			
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
	
	@RequestMapping(
			value = "/imprimirRelatorioProntuario", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public ModelAndView imprimirRelatorioProntuario(@RequestBody Agendamento agendamento, 
			Principal user) throws Exception {										
		try {
			Psicologo psicologo;
			if (user != null) {							
				psicologo = this.psicologoRepositorio.findByLogin(user.getName());
				if (psicologo == null) {
					logMessage("imprimirRelatorioProntuario - Psicólogo nulo.", true);
					throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
				}		
			} else {
				logMessage("imprimirRelatorioProntuario - User nulo.", true);
				throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
			}	
														
			JasperReportsPdfView view = new JasperReportsPdfView();
	        view.setUrl("classpath:br/com/syspsi/jasper/prontuarioRel.jrxml");
	        view.setApplicationContext(appContext);
	        view.setContentType("application/pdf");	    
	        view.setReportDataKey("datasource");
	        	        
	        Properties p = new Properties();
	        p.setProperty("Content-disposition", "inline; filename=\"relatorioDespesas.pdf\"");
	        view.setHeaders(p);

	        Map<String, Object> params = new HashMap<>();
	        params.put("nomePaciente", agendamento.getPaciente().getNomeExibicao());	        
	        params.put("consulta", agendamento.getConsulta());
	        params.put("datasource", new JREmptyDataSource());
	        
	        return new ModelAndView(view, params);	        						           	       																								
		} catch(RelatorioException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("imprimirRelatorioProntuario - Erro: " + ex.getMessage(), true);			
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
}
