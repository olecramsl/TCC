package br.com.syspsi.controller;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@RestController
public class RelatorioController {
	
private final static Logger logger = Logger.getLogger(CadastroController.class);

	//@Autowired 
	//private DataSource dataSource;
	
	@Autowired
	private ApplicationContext appContext;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;


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
			value = "/imprimirRelatorioReceitas", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public void imprimirRelatorioReceitas(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user) throws Exception {
		logMessage("RelatorioController.imprimirRelatorioReceitas: início", false);
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			logMessage("Formato de data inválido", true);
			throw new Exception("Erro ao gerar relatório: formato de data inválido.");
		}		
		
		Psicologo psicologo;
		if (user != null) {			
			logMessage("user.getName(): " + user.getName(), false);
			psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			if (psicologo == null) {
				logMessage("Psicólogo nulo em getPsicologoLogado", true);
				throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
			}		
		} else {
			logMessage("User nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		try {						
			/*
			JasperReportsPdfView view = new JasperReportsPdfView();						
			view.setUrl("classpath:br/com/syspsi/jasper/receitasRel.jrxml");			
			view.setApplicationContext(appContext);							
		
			List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo);			
		
			Map<String, Object> params = new HashMap<>();
			params.put("DS", lstAgendamentos);
			*/														
			List<Agendamento> lstAgendamentos = 
					this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo);
			
			System.out.println("SIZE: " + lstAgendamentos.size());
			
			JRBeanCollectionDataSource beanColDataSource = 
					new JRBeanCollectionDataSource(lstAgendamentos);
			
			Map parameters = new HashMap();			
			parameters.put("DS1", beanColDataSource);
			
			String path = this.getClass().getClassLoader().getResource("").getPath();
			String pathToReportPackage = path + "br/com/syspsi/jasper/";			
			JasperReport report = 
					JasperCompileManager.compileReport(pathToReportPackage + "receitasRel.jrxml");
			
			/*
			JasperPrint print = 
					JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
	 
			JasperExportManager.exportReportToPdfFile(print, 
					"C:/Users/marcelo.lima/Desktop/Nova pasta/Relatorio_de_Clientes.pdf");
			*/
			JasperPrint jasperPrint = 
					JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

			logMessage("RelatorioController.imprimirRelatorioReceitas: fim", false);
        
			//return new ModelAndView(view, params);
		} catch(Exception ex) {
			logMessage("Erro ao gerar relatório: " + ex.getMessage(), true);
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
}
