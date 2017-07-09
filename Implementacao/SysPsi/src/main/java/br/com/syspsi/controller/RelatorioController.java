package br.com.syspsi.controller;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.jasperreports.JasperReportsPdfView;

import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@RestController
public class RelatorioController {
	
private final static Logger logger = Logger.getLogger(CadastroController.class);

	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@Autowired
	private AgendamentoRepositorio agendamentoRepositorio;

	@Autowired
    private ApplicationContext appContext;	

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
	public ModelAndView imprimirRelatorioReceitas(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, Principal user, 
			HttpServletResponse response) throws Exception {	
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
			List<Agendamento> lstAgendamentos = 
					this.agendamentoRepositorio.listarConsultasPorPeriodo(di, df, psicologo);
								
			JRBeanCollectionDataSource beanColDataSource = 
					new JRBeanCollectionDataSource(lstAgendamentos);
							
			JasperReportsPdfView view = new JasperReportsPdfView();
	        view.setUrl("classpath:br/com/syspsi/jasper/receitasRel.jrxml");
	        view.setApplicationContext(appContext);
	        view.setContentType("application/pdf");	        
	        view.setReportDataKey("datasource");
	        
	        Properties p = new Properties();
	        p.setProperty("Content-disposition", "inline; filename=\"meuRelatorioLegal.pdf\"");
	        view.setHeaders(p);

	        Map<String, Object> params = new HashMap<>();
	        params.put("datasource", beanColDataSource);

	        return new ModelAndView(view, params);	              
			
			/*
			String path = this.getClass().getClassLoader().getResource("").getPath();
			String pathToReport = path + "br/com/syspsi/jasper/receitasRel.jrxml";

	        JasperReport jreport = JasperCompileManager.compileReport(pathToReport);	        

	        HashMap params = new HashMap();

	        JasperPrint jprint = JasperFillManager.fillReport(jreport, params, beanColDataSource);

	        JasperExportManager.exportReportToPdfFile(jprint,
	                "C:\\Users\\Marcelo\\Desktop\\DefesaTCC\\report2.pdf");
	        
	        File pdfFile = new File("C:\\Users\\Marcelo\\Desktop\\DefesaTCC\\report2.pdf");
	        InputStream targetStream = new FileInputStream(pdfFile);
	        IOUtils.copy(targetStream, response.getOutputStream());
	        response.flushBuffer();	
	        */        	       																						   
		} catch(Exception ex) {
			logMessage("Erro ao gerar relatório: " + ex.getMessage(), true);			
			throw new Exception("Não foi possível gerar o relatório");
		}
	}
}
