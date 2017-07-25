package br.com.syspsi.controller;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.exception.BackupException;
import br.com.syspsi.model.Util;
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
	@Value("${backup.qtdMaxArquivos}")
	private String qtdMaxArquivos;

	@Autowired
	private BackupRepositorio backupRepositorio;
	
	private static String DATABASE = "syspsi";
	private final static String SEPARATOR = File.separator;
	
	private static final Logger logger = LoggerFactory.getLogger(BackupController.class);	
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
			value = "/realizarBackup", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)			
	public void realizarBackup() throws Exception {										
		/*
		// Para descriptografar aquivo de backup		
		FileWriter fw1 = null;
		BufferedWriter out1 = null;
		try {
			String arq = this.dirToSave + "\\syspsi_20170515_1631.sql.enc";
			List<String> linhas1 = Files.readAllLines(Paths.get(arq), Charset.forName("UTF-8"));
			fw1 = new FileWriter(this.dirToSave + "\\syspsi_20170515_1631.sql");							
			out1 = new BufferedWriter(fw1);
			for (String linha : linhas1) {								
				out1.write(Util.decrypt(linha));
				out1.newLine();
			}
		} catch(Exception ex) {
			System.out.println("Erro decrypt" + ex.getMessage());
		} finally {							
			out1.close();
		}
		*/		
		
		try {
			Backup todayBackup = this.backupRepositorio.executouBackupHoje();		
			if (todayBackup != null) {			
				SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm");			
				logMessage("realizarBackup - Backup já realizado hoje às " + format.format(todayBackup.getInicio().getTime()), false);						
			} else {
				File file = new File(MYSQL_PATH + "\\mysqldump.exe");
				if (!file.exists()) {
					logMessage("realizarBackup - Não foi possível localizar o arquivo mysqldump em " + MYSQL_PATH, true);
					throw new Exception("Não foi possível realizar o backup!");
				} else {	
					file = new File(dirToSave);
					if (!file.exists()) {
						logMessage("realizarBackup - Não foi possível localizar o diretório para salvar o backup: " + dirToSave, true);
						throw new Exception("Não foi possível realizar o backup!");
					}		
									
					// Apaga arquivos de backup excedentes, caso existam
					this.realizarManutencaoArquivosBackup();
									
					String plainText = Util.decrypt(this.dbPassword);
					
					SimpleDateFormat format1 = new SimpleDateFormat("dd/MM/yyyy HH:mm");
					Calendar inicio = Calendar.getInstance();
					logMessage("realizarBackup - Início do backup: " + format1.format(inicio.getTime()), false);
					
					SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd'_'HHmm");
					String command = MYSQL_PATH + SEPARATOR + "mysqldump.exe";
					String resultFile = this.dirToSave + SEPARATOR + DATABASE + "_" + format.format(inicio.getTime()) + ".sql";
					ProcessBuilder pb = new ProcessBuilder(
					        command,
					        "--user=" + this.dbUser,
					        "--password=" + plainText,
					        "--single-transaction",
					        "--databases",
					        DATABASE,
					        "--verbose",
					        "--result-file=" + resultFile);
																											
					Process process = pb.start();
					process.waitFor(); // Aguarda o fim do backup
					
					// criptografa arquivo de backup					
					File sqlFile = new File(resultFile);
					if (sqlFile.exists()) {							
						FileWriter fw = null;
						BufferedWriter out = null; 
						try {
							logMessage("realizarBackup - Início da criptografia do sql", false);
							
							fw = new FileWriter(resultFile + ".enc");
							out = new BufferedWriter(fw);
							List<String> linhas = Files.readAllLines(Paths.get(resultFile), Charset.forName("UTF-8"));
							
							logMessage("realizarBackup - Número de linhas lidas: " + linhas.size(), false);
							
							for (String linha : linhas) {								
								out.write(Util.encrypt(linha));
								out.newLine();
							}
							logMessage("realizarBackup - Fim da criptografia do sql", false);
							
							// Apaga arquivo sql
							sqlFile.delete();							
						} catch(Exception ex) {
							logMessage("realizarBackup - Erro ao criptografar arquivo de backup: " + ex.getMessage(), true);
							throw new BackupException("Erro ao criptografar arquivo de backup. Informe o administrador do sistema!");
						} finally {				         
				            out.close();
				        }																																	
					}
					
					Calendar fim = Calendar.getInstance();
					logMessage("realizarBackup - Fim do backup: " + format1.format(fim.getTime()), false);
					
					Backup backup = new Backup(inicio, fim);
					this.backupRepositorio.save(backup);
				}			
			}
		} catch(BackupException ex) {			
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("realizarBackup - Erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível realizar o backup!");
		}
	}
	
	/**
	 * Apaga os arquivos excedentes de backup conforme configuração do arquivo application.yml
	 * @throws Exception
	 */
	private void realizarManutencaoArquivosBackup() throws Exception {		
		try {						
			// Apaga Arquivos excedentes, caso existam
			File dir = new File(this.dirToSave);
			// Apenas arquivos sql serão colocados na lista
			File[] files = dir.listFiles(new FilenameFilter() {
			    public boolean accept(File dir, String name) {
			        return name.toLowerCase().endsWith(".enc");
			    }
			});
			
			int qtdMaxArq = Integer.parseInt(this.qtdMaxArquivos);
			int qtdArqDir = files.length;
			int qtdArqExc = qtdArqDir - qtdMaxArq;
			logMessage("realizarBackup - Qtd arquivos de backup excedentes: " + qtdArqExc, false);
			if (qtdArqExc > 0) {												
				// Ordena em ordem crescente. Os primeiros arquivos serão os mais antigos.
				Arrays.sort(files);
				for (File file : files) {					
					logMessage("realizarBackup - Arquivo de backup " + file.getName() + " deletado.", false);
					file.delete();
					if (--qtdArqExc == 0) {
						break;
					}
				}
			}
			
		} catch (NumberFormatException ex) {
			logMessage("realizarBackup - qtdMaxArquivos inválido no arquivo application.yml: " + this.qtdMaxArquivos, true);
			throw new Exception("Configuração de quantidade de arquivos de backup inválida!");
		} catch (Exception ex) {
			logMessage("realizarBackup - Erro ao realizar manutenção do backup: " + ex.getMessage(), true);			
		}
	}
}
