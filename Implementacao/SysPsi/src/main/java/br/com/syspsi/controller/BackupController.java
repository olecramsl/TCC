package br.com.syspsi.controller;

import java.io.File;
import java.text.SimpleDateFormat;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.model.entity.Backup;
import br.com.syspsi.repository.BackupRepositorio;

@RestController
public class BackupController {	
	
	@Value("${backup.mysql.path}")	
	private String MYSQL_PATH;

	@Autowired
	private BackupRepositorio backupRepositorio;
	
	private static String SEPARATOR = File.separator;
	
	private final static Logger logger = Logger.getLogger(BackupController.class);
	
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
			value = "/realizarBackup", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)			
	public void realizarBackup() throws Exception {
		Backup backup = this.backupRepositorio.executouBackupHoje();		
		if (backup != null) {			
			SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm");
			System.out.println("Backup já realizado hoje às " + format.format(backup.getInicio().getTime()));
			logMessage("Backup já realizado hoje às " + format.format(backup.getInicio().getTime()), false);						
		} else {
			File file = new File(MYSQL_PATH + "\\mysqldump.exe");
			if (!file.exists()) {
			   //diretorio.mkdirs(); //mkdir() cria somente um diretório, mkdirs() cria diretórios e subdiretórios.
				logMessage("Não foi possível localizar o arquivo mysqldump", false);
				throw new Exception("Não foi possível realizar o backup!");
			} else {				
				System.out.println("Realiza backup");
			}			
		}
	}
}
