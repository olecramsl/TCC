package br.com.syspsi.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.apache.log4j.Logger;
import org.jasypt.util.text.BasicTextEncryptor;
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
	
	@Value("${spring.datasource.username}")
	private String dbUser;
	@Value("${spring.datasource.password}")
	private String dbPassword;
	@Value("${backup.mysql.path}")	
	private String MYSQL_PATH;
	@Value("${backup.salvarEm}")	
	private String dirToSave;

	@Autowired
	private BackupRepositorio backupRepositorio;
	
	private static String DATABASE = "syspsi";
	private final static String SEPARATOR = File.separator;
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
		logMessage("realizarBackup(): Início", false);
		Backup todayBackup = this.backupRepositorio.executouBackupHoje();		
		if (todayBackup != null) {			
			SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm");
			System.out.println("Backup já realizado hoje às " + format.format(todayBackup.getInicio().getTime()));
			logMessage("Backup já realizado hoje às " + format.format(todayBackup.getInicio().getTime()), false);						
		} else {
			File file = new File(MYSQL_PATH + "\\mysqldump.exe");
			if (!file.exists()) {
			   //diretorio.mkdirs(); //mkdir() cria somente um diretório, mkdirs() cria diretórios e subdiretórios.
				logMessage("Não foi possível localizar o arquivo mysqldump em " + MYSQL_PATH, true);
				throw new Exception("Não foi possível realizar o backup!");
			} else {	
				file = new File(dirToSave);
				if (!file.exists()) {
					logMessage("Não foi possível localizar o diretório para salvar o backup: " + dirToSave, true);
					throw new Exception("Não foi possível realizar o backup!");
				}				
								
				/*
				 * Password criado para criptografar a senha no arquivo application.yml
				 * A senha criptografada pode ser gerada com o Jasypt CLI Tools disponível em
				 * http://www.jasypt.org/cli.html. A criptografia da senha pode ser gerada com o comando
				 * encrypt.bat input="senha_do_bd" password="senha_para_criptografia" 
				 * a senha_do_bd está sendo recuperaga do arquivo application.yml com a instrução
				 * 
				 * @Value("${spring.datasource.password}")
				 * private String dbPassword;
				 * 		 
				 * a senha_para_criptografia deve ser setada em textEncryptor.setPassword()
				*/
				BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
				textEncryptor.setPassword("$tM4l8OhfQ6&6f#");  
				String plainText = textEncryptor.decrypt(this.dbPassword);
				
				
				SimpleDateFormat format1 = new SimpleDateFormat("dd/MM/yyyy HH:mm");
				Calendar inicio = Calendar.getInstance();
				logMessage("Início do backup: " + format1.format(inicio.getTime()), false);
				
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd'_'HHmm");
				String command = MYSQL_PATH + SEPARATOR + "mysqldump.exe";
				ProcessBuilder pb = new ProcessBuilder(
				        command,
				        "--user=" + this.dbUser,
				        "--password=" + plainText,
				        "--single-transaction",
				        "--databases",
				        DATABASE,
				        "--verbose",
				        "--result-file=" + this.dirToSave + SEPARATOR + DATABASE + "_" + format.format(inicio.getTime()) + ".sql");
								
				try {														
					pb.start();
					
					Calendar fim = Calendar.getInstance();
					logMessage("Fim do backup: " + format1.format(fim.getTime()), false);
					
					Backup backup = new Backup(inicio, fim);
					this.backupRepositorio.save(backup);
				} catch(Exception ex) {
					logMessage("Erro: " + ex.getMessage(), true);
					throw new Exception("Não foi possível realizar o backup!");
				}
			}			
		}
		logMessage("realizarBackup(): Fim", false);
	}
}
