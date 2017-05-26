package br.com.syspsi.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
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

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

import br.com.syspsi.exception.GCalendarException;
import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InAgendamentoDTO;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.model.entity.TmpGCalendarEvent;
import br.com.syspsi.repository.AgendamentoRepositorio;
import br.com.syspsi.repository.PacienteRepositorio;
import br.com.syspsi.repository.TmpGCalendarEventRepositorio;

@RestController
public class AgendaController {			
	/** Application name. */
    private static final String APPLICATION_NAME = "syspsi";

    /** Directory to store user credentials for this application. */
    private static final java.io.File DATA_STORE_DIR = new java.io.File(
        System.getProperty("user.home"), ".credentials/syspsi");

    /** Global instance of the {@link FileDataStoreFactory}. */
    private static FileDataStoreFactory DATA_STORE_FACTORY;

    /** Global instance of the JSON factory. */
    private static final JsonFactory JSON_FACTORY =
        JacksonFactory.getDefaultInstance();

    /** Global instance of the HTTP transport. */
    private static HttpTransport HTTP_TRANSPORT;

    /** Global instance of the scopes required by this quickstart.
     *
     * If modifying these scopes, delete your previously saved credentials
     * at ~/.credentials/syspsi
     */
    private static final List<String> SCOPES =
        Arrays.asList(CalendarScopes.CALENDAR_READONLY);

    static {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            DATA_STORE_FACTORY = new FileDataStoreFactory(DATA_STORE_DIR);
        } catch (Throwable t) {
            t.printStackTrace();
            System.exit(1);
        }
    }       
    
    public static String COR_AGENDAMENTO_DEFAULT = "#0A6CAC";
    public static String COR_AGENDAMENTO_CONVENIO = "#00BE4D";
    public static String COR_AGENDAMENTO_NAO_COMPARECEU = "#FF5900";
    public static String COR_AGENDAMENTO_GOOGLE_CALENDAR = "#E70046";
    private final static Logger logger = Logger.getLogger(AgendaController.class);
    
    @Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
    
    @Autowired
    private TmpGCalendarEventRepositorio gCalendarEventRepositorio;
    
    @Autowired
    private PacienteRepositorio pacienteRepositorio;
    
    private static void logMessage(String msg, boolean error) {
    	if(!error && logger.isDebugEnabled()){
    	    logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
    /**
     * Creates an authorized Credential object.
     * @return an authorized Credential object.
     * @throws IOException
     */
    public static Credential authorize() throws GCalendarException {        
    	try {
    		// Load client secrets.
	        InputStream in =
	            AgendaController.class.getResourceAsStream("/client_secret.json");
	        GoogleClientSecrets clientSecrets =
	            GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));
	
	        // Build flow and trigger user authorization request.
	        GoogleAuthorizationCodeFlow flow =
	                new GoogleAuthorizationCodeFlow.Builder(
	                        HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
	                .setDataStoreFactory(DATA_STORE_FACTORY)
	                .setAccessType("offline")
	                .build();
	        Credential credential = new AuthorizationCodeInstalledApp(
	            flow, new LocalServerReceiver()).authorize("user");
	       
	        return credential;
    	} catch(IOException ex) {
    		logMessage("authorize(): Não foi possível carregar o arquivo client_secret.json.", true);
        	throw new GCalendarException("Não foi possível carregar o arquivo client_secret.json.");
        }
    }
    
    /**
     * Build and return an authorized Calendar client service.
     * @return an authorized Calendar client service
     * @throws IOException
     */
    public static com.google.api.services.calendar.Calendar
        getCalendarService() throws GCalendarException {
    	logMessage("getCalendarService: authorize", false);
    	
        Credential credential = authorize();
        logMessage("getCalendarService: authorize sem erros", false);    	
        return new com.google.api.services.calendar.Calendar.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }        
    	
	/**
	 * Retorna uma lista de agendamentos futuros a serem salvos, uma vez que os agendamentos futuros são salvos apenas quando o
	 * usuário visualiza a view FullCalendar 
	 * @param di a data inicial da view
	 * @param df a data final da view
	 * @param agendamento o objeto agendamento de referência
	 * @return um lista de objetos Agendamento
	 */		    					
    private void salvarAgendamentosFuturos(Calendar di, Calendar df, Agendamento ag) throws Exception {
		try {			
			logMessage("getLstAgendamentosParaSalvar: início", false);
			
			if (ag == null) {
				logMessage("Agendamento recebido nulo", true);
				throw new Exception("Não foi possível listar agendamentos.");
			}
			
			List<Agendamento> lstAgendamento = new ArrayList<>();

			Agendamento agendamento = new Agendamento(ag.getPaciente(), ag.getConvenio(), ag.getIdGCalendar(), ag.getIdRecurring(), 
					ag.getStart(), ag.getEnd(), ag.getGrupo(), null,  ag.getColor(), false, true);
						
			// Dias já salvos no BD
			List<String> lstDiasSalvos = this.agendamentoRepositorio.listarDatasAgendamentoPeriodoPorGrupo(di, df, 
					agendamento.getGrupo());
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");		
			// percorre todos os dias constantes na view do calendário e repete o evento quando necessário		
			for (Calendar dia = (Calendar)di.clone(); dia.before(df); dia.add(Calendar.DATE, 1)) {			
				if ((dia.get(Calendar.DAY_OF_WEEK) == agendamento.getStart().get(Calendar.DAY_OF_WEEK)) &&
					    ((agendamento.getStart().before(dia) || 
					    ((!agendamento.getStart().before(dia)) && (!agendamento.getStart().after(dia)))))) {								
					// Verifica se o dia jah estah salvo no BD
					if (lstDiasSalvos.isEmpty() || !lstDiasSalvos.contains(format.format(dia.getTime()))) {
						agendamento.setStart((Calendar)dia.clone());
						agendamento.setEnd((Calendar)dia.clone());
						agendamento.getEnd().add(Calendar.HOUR, 1);							
												
						lstAgendamento.add(agendamento);
											
						agendamento = new Agendamento(agendamento.getPaciente(), agendamento.getConvenio(), agendamento.getIdGCalendar(), 
								agendamento.getIdRecurring(), (Calendar)agendamento.getStart().clone(), 
								(Calendar)agendamento.getEnd().clone(),	agendamento.getGrupo(),	null, agendamento.getColor(), false, true);					
					}
				}
			
			}
			
			if (!lstAgendamento.isEmpty()) {
				this.agendamentoRepositorio.save(lstAgendamento);
			}
			
			logMessage("getLstAgendamentosParaSalvar: fim", false);						
		} catch(Exception ex) {			
			logMessage("getLstAgendamentosParaSalvar: " + ex.getMessage(), true);
			throw new Exception("Erro ao carregar agendamentos!");			
		}
	}
	
    /**
     * Acessa o Google Calendar para buscar os eventos de um determinado período
     * @param di a data inicial do período
     * @param df a data final do período
     * @return uma lista de objetos TmpGCalendarEvent
     * @throws Exception caso algum erro ocorra
     */
    public List<TmpGCalendarEvent> listarAgendamentosGCalendar(Calendar di, Calendar df) throws GCalendarException {    	
        try {
        	logMessage("listarAgendamentosGCalendar: início", false);
        	List<TmpGCalendarEvent> lstAgendamentosGCalendar = new ArrayList<>();
	    	
        	// Build a new authorized API client service.
            // Note: Do not confuse this class with the
            // com.google.api.services.calendar.model.Calendar class.
        	logMessage("getCalendarService", false);
            com.google.api.services.calendar.Calendar service =
                getCalendarService();
            logMessage("getCalendarService: OK", false);
            
            logMessage("Transforma di e df", false);
            DateTime timeMin = new DateTime(di.getTimeInMillis());
            DateTime timeMax = new DateTime(df.getTimeInMillis());
            logMessage("Transforma di e df: OK", false);
            
	        Events events = service.events().list("primary")
	            .setTimeMin(timeMin)
	            .setTimeMax(timeMax)
	            .setOrderBy("startTime")
	            .setSingleEvents(true)
	            .execute();
	        List<Event> items = events.getItems();	 	
	        logMessage("Qtd itens encontrados GCal: " + (items!=null?items.size():0), false);
	        // Para verificar se o evento já não está salvo na tabela TmpGCalendarEvent
	        List<String> lstGCalendarIds_TmpGCalendarTable = 
	        		this.gCalendarEventRepositorio.listarPorPeriodo(di, df);
	        logMessage("Qtd itens encontrados lstGCalendarIds_TmpGCalendarTable: " + 
	        		(lstGCalendarIds_TmpGCalendarTable!=null?lstGCalendarIds_TmpGCalendarTable.size():0), false);
	        // Para verificar se o evento já não está salvo na tabela Agendamento	        
	        List<String> lstGCalendarIds_AgendamentoTable = 
	        		this.agendamentoRepositorio.listarIdGCalendarPorPeriodo(di, df);
	        logMessage("Qtd itens encontrados lstGCalendarIds_AgendamentoTable: " + 
	        		(lstGCalendarIds_AgendamentoTable!=null?lstGCalendarIds_AgendamentoTable.size():0), false);
	        	     
	        int qtdEventosRemovidosGCalendar_TmpGCalendarTable = 0;
	        int qtdEventosRemovidosGCalendar_AgendamentoTable = 0;
	        int qtdItemsGCal = 0;
	        
	        if (items != null) {
	        	qtdItemsGCal = items.size();
	        }
	        
	        if (lstGCalendarIds_TmpGCalendarTable != null) {
	        	qtdEventosRemovidosGCalendar_TmpGCalendarTable = lstGCalendarIds_TmpGCalendarTable.size() - qtdItemsGCal;
	        }
	        
	        if ( lstGCalendarIds_AgendamentoTable != null) {
	        	qtdEventosRemovidosGCalendar_AgendamentoTable = lstGCalendarIds_AgendamentoTable.size() - qtdItemsGCal;
	        }	        
	        
	        // Remove da tabela TmpGCalendarEvents eventos removidos no gcal
            int count = 0;
            if (qtdEventosRemovidosGCalendar_TmpGCalendarTable > 0) {
            	for (String idGCalendar : lstGCalendarIds_TmpGCalendarTable) {
            		if (!items.contains(idGCalendar)) {
            			// Remove da tabela temporária os eventos removidos no GCalendar
            			this.gCalendarEventRepositorio.deleteByIdGCalendar(idGCalendar);            			
            			count++;
            			logMessage("Evento " + idGCalendar + " removido de lstGCalendarIds_TmpGCalendarTable", false);
            			if (count == qtdEventosRemovidosGCalendar_TmpGCalendarTable) {
            				break;
            			}
            		}
            	}
            }
                        
            // Remove da tabela Agendamento eventos removidos no gcal
            count = 0;
            if (qtdEventosRemovidosGCalendar_AgendamentoTable > 0) {
            	for (String idGCalendar : lstGCalendarIds_AgendamentoTable) {
            		if (!items.contains(idGCalendar)) {
            			// Remove da tabela temporária os eventos removidos no GCalendar
            			this.agendamentoRepositorio.deleteByIdGCalendar(idGCalendar);            			
            			count++;
            			logMessage("Evento " + idGCalendar + " removido de lstGCalendarIds_AgendamentoTable", false);
            			if (count == qtdEventosRemovidosGCalendar_AgendamentoTable) {
            				break;
            			}
            		}
            	}
            } 
            	        
	        if (qtdItemsGCal > 0) {	                        
	            TmpGCalendarEvent tmpGCalendarEvent;	            	            
	            
	            for (Event event : items) {	            		            		            	
	            	/*
	            	 * Não serão importados eventos:
	            	 * Já importados anteriormente
	            	 * all-day: Quando event.getEnd().getDate() != null
	            	 * Recorrentes: recurringEventId != null	            	
	            	 */	            	
	            	if (!lstGCalendarIds_TmpGCalendarTable.contains(event.getId()) &&
	            	   (!lstGCalendarIds_AgendamentoTable.contains(event.getId())) &&
	            	   (event.getEnd().getDate() == null) && (event.getRecurringEventId() == null)) {		            		
		                DateTime start = event.getStart().getDateTime();		                
		                if (start == null) {
		                    start = event.getStart().getDate();
		                }		                		                
		                Calendar startEvent = Calendar.getInstance();
		                Calendar endEvent = Calendar.getInstance();			                
		                startEvent.setTimeInMillis(event.getStart().getDateTime().getValue());		                
		                endEvent.setTimeInMillis(event.getEnd().getDateTime().getValue());		                
		                tmpGCalendarEvent = new TmpGCalendarEvent(LoginController.getPsicologoLogado(), 
		                		event.getId(), event.getRecurringEventId(), startEvent, endEvent, 
		                		event.getSummary(), event.getDescription());		                
		                lstAgendamentosGCalendar.add(tmpGCalendarEvent);		                
	            	} else if ((lstGCalendarIds_TmpGCalendarTable.contains(event.getId())) && 
	            			   (event.getEnd().getDate() == null)) {
	            		tmpGCalendarEvent = this.gCalendarEventRepositorio.findByIdGCalendar(event.getId());
	            		// criar um hash das informações de eventos do google e outro dos eventos
	            		// da tabela do sistema para verificar se houve alteração
	            		boolean change = false;
	            		// Recorrência?
	            		if (event.getRecurringEventId() != null) {
	            			// what now?
	            		} 
	            		
	            		if (event.getStart().getDateTime().getValue() != 
	            			tmpGCalendarEvent.getStart().getTimeInMillis()) {
	            			Calendar startEvent = Calendar.getInstance();
	            			startEvent.setTimeInMillis(event.getStart().getDateTime().getValue());
	            			tmpGCalendarEvent.setStart(startEvent);
	            			change = true;
	            		}	            		
	            		
	            		if (event.getEnd().getDateTime().getValue() != 
		            			tmpGCalendarEvent.getEnd().getTimeInMillis()) {
		            			Calendar endEvent = Calendar.getInstance();
		            			endEvent.setTimeInMillis(event.getStart().getDateTime().getValue());
		            			tmpGCalendarEvent.setStart(endEvent);
		            			change = true;
		            	}	            		
	            			            		
	            		if (event.getSummary() != null && 
	            			!event.getSummary().equals(tmpGCalendarEvent.getSummary())) {
	            			tmpGCalendarEvent.setSummary(event.getSummary());
	            			change = true;
	            		}
	            			            		
	            		if (change) {
	            			this.gCalendarEventRepositorio.save(tmpGCalendarEvent);	            			
	            		}
	            			            		
	            		lstAgendamentosGCalendar.add(tmpGCalendarEvent);
	            	}  else if ((lstGCalendarIds_AgendamentoTable.contains(event.getId())) && 
	            			   (event.getEnd().getDate() == null)) {
	            		Agendamento agendamento = this.agendamentoRepositorio.findByIdGCalendar(event.getId());
	            		// criar um hash das informações de eventos do google e outro dos eventos
	            		// da tabela do sistema para verificar se houve alteração
	            		boolean change = false;
	            		// Recorrência?
	            		if (event.getRecurringEventId() != null) {
	            			// what now?
	            		} 
	            		if (event.getStart().getDateTime().getValue() != 
	            			agendamento.getStart().getTimeInMillis()) {
	            			Calendar startEvent = Calendar.getInstance();
	            			startEvent.setTimeInMillis(event.getStart().getDateTime().getValue());
	            			agendamento.setStart(startEvent);
	            			change = true;
	            		}
	            		
	            		if (event.getEnd().getDateTime().getValue() != 
	            			agendamento.getEnd().getTimeInMillis()) {
		            		Calendar endEvent = Calendar.getInstance();
		            		endEvent.setTimeInMillis(event.getStart().getDateTime().getValue());
		            		agendamento.setStart(endEvent);
		            		change = true;
		            	}	            			            		
	            		
	            		if (event.getDescription() != null && 
		            		!event.getDescription().equals(agendamento.getDescription())) {
		            		agendamento.setDescription(event.getDescription());
		            		change = true;
		            	}
	            		
	            		if (change) {	            			
	            			this.agendamentoRepositorio.save(agendamento);
	            		}
	            		
	            	}
	            }
	        }
	       
	        if (!lstAgendamentosGCalendar.isEmpty()) {
	        	logMessage("Qtd items salvos em tmpGCalendar: " + lstAgendamentosGCalendar.size(), false);
	        	gCalendarEventRepositorio.save(lstAgendamentosGCalendar);
	        }	        	        
	        	       	        
	        logMessage("listarAgendamentosGCalendar: fim", false);
	        return lstAgendamentosGCalendar;
        } catch(Exception ex) {
        	logMessage("listarAgendamentosGCalendar: " + ex.getMessage(), true);
        	throw new GCalendarException("Problemas ao carregar os eventos do Google Calendar");
        }
    }
	
	/**
	 * @param dataInicial A data inicial dos agendamentos
	 * @param dataFinal A data final dos agendamentos
	 * @return A lista de agendamentos para o período informado
	 * @throws Exception no caso do formato de alguma das datas informadas for inválido
	 */
	@RequestMapping(
			value = "/listarAgendamentos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Agendamento> listarAgendamentos(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal) throws Exception {
		logMessage("listarAgendamentos: início", false);
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
		
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
					
		// Cria os agendamentos futuros para a view, caso necessário
		for (Agendamento ag : this.agendamentoRepositorio.listarEventosPrincipaisPorPeriodo(df, LoginController.getPsicologoLogado())) {					
			if (ag.isAtivo()) {												
				di.set(Calendar.HOUR_OF_DAY, ag.getStart().get(Calendar.HOUR_OF_DAY));
				di.set(Calendar.MINUTE, ag.getStart().get(Calendar.MINUTE));
				df.set(Calendar.HOUR_OF_DAY, ag.getEnd().get(Calendar.HOUR_OF_DAY));
				df.set(Calendar.MINUTE, ag.getEnd().get(Calendar.MINUTE));
					
				this.salvarAgendamentosFuturos(di, df, ag);
			}			
		}				
		
		List<Agendamento> lstAgendamentos = new ArrayList<>();
		for (Agendamento ag : this.agendamentoRepositorio.listarPorPeriodo(di, df, psicologo)) {
			if (ag.isAtivo()) {
				if (ag.getColor().equals(COR_AGENDAMENTO_NAO_COMPARECEU)) {
					ag.setNaoCompareceu(true);
				}
				
				// Decripta dados do prontuário				
				if (ag.getConsulta() != null && ag.getConsulta().getProntuario() != null && !ag.getConsulta().getProntuario().isEmpty()) {
					ag.getConsulta().setProntuario(Util.decrypt(ag.getConsulta().getProntuario(), psicologo));
				}
				
				lstAgendamentos.add(ag);
			}
		}			
		
		// AGENDAMENTOS CALENDAR	
		boolean usingGcal = false;
		if (usingGcal) {
			for (TmpGCalendarEvent gcal : listarAgendamentosGCalendar(di, df)) {
				lstAgendamentos.add(new Agendamento(null, gcal.getIdGCalendar(), gcal.getIdRecurring(), 
						gcal.getStart(), gcal.getEnd(), 0L, gcal.getSummary(), COR_AGENDAMENTO_GOOGLE_CALENDAR, false, true));			
			}
		}						
		
		logMessage("listarAgendamentos: fim", false);
		return lstAgendamentos;		
	}	
	
	/**
	 * Salva um agendamento. Se for um agendamento semanal, salva o primeiro evento. Nesse caso é necessário
	 * chamar listarAgendamentos no AngularJS para que a view seja atualizada com os agendamentos futuros.
	 * @param InAgendamentoDTO dto contendo o agendamento; data inicial e final da view; e se o evento é semanal
	 * @throws Exception Caso haja algum problema ao persistir os dados no BD	 
	 */
	@RequestMapping(
			value = "/salvarAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Agendamento salvarAgendamento(@RequestBody InAgendamentoDTO agendamentoDTO) throws Exception {
		logMessage("salvarAgendamento: início", false);		
		Agendamento agendamento = agendamentoDTO.getAgendamento();
		
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo.", true);
			throw new Exception("Não foi possível salvar o agendamento!");
		}		
		
		agendamento.setColor(COR_AGENDAMENTO_DEFAULT);
		if (agendamento.getConvenio() != null) {
			agendamento.setColor(COR_AGENDAMENTO_CONVENIO);
		}
		if (agendamento.isNaoCompareceu()) {
			agendamento.setColor(COR_AGENDAMENTO_NAO_COMPARECEU);
		}
				
		if ((agendamentoDTO.isRepetirSemanalmente() &&				
		   (agendamento.getGrupo() == null || agendamento.getGrupo() == 0))) {
			agendamento.setGrupo(this.agendamentoRepositorio.getNextValueForGroup());			
			agendamento.setEventoPrincipal(true);
		} else {
			agendamento.setEventoPrincipal(false);
		}
						
		if (agendamento.getConsulta() != null && agendamento.getConsulta().getProntuario() != null && 
			!agendamento.getConsulta().getProntuario().isEmpty()) {						
			agendamento.getConsulta().setProntuario(Util.encrypt(agendamento.getConsulta().getProntuario(), psicologo));
		}
				
		agendamento = this.agendamentoRepositorio.save(agendamento);
		
		if (agendamento == null) {
			logMessage("Erro ao salvar no BD.", true);
			throw new Exception("Não foi possível salvar o agendamento!");
		}
		
		if (agendamento.getColor() != null && agendamento.getColor().equals(COR_AGENDAMENTO_NAO_COMPARECEU)) {
			agendamento.setNaoCompareceu(true);
		}
		
		if (agendamento.getConsulta() != null) {
			agendamento.getConsulta().setProntuario(Util.decrypt(agendamento.getConsulta().getProntuario(), psicologo));
		}
		logMessage("salvarAgendamento: fim", false);

		return agendamento;
	}
	
	/**
	 * Salva um agendamento. Se for um agendamento semanal, salva o primeiro evento. Nesse caso é necessário
	 * chamar listarAgendamentos no AngularJS para que a view seja atualizada com os agendamentos futuros.
	 * @param InAgendamentoDTO dto contendo o agendamento; data inicial e final da view; e se o evento é semanal
	 * @throws Exception Caso haja algum problema ao persistir os dados no BD	 
	 */
	@RequestMapping(
			value = "/salvarAgendamentoTemporarioGCalendar", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Agendamento salvarAgendamentoTemporarioGCalendar(@RequestBody InAgendamentoDTO agendamentoDTO) throws Exception {
		logMessage("salvarAgendamentoTemporarioGCalendar: início", false);
		Agendamento agendamento = agendamentoDTO.getAgendamento();
		
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo.", true);
			throw new Exception("Não foi possível salvar o agendamento!");
		}
				
		if (agendamentoDTO.isRepetirSemanalmente()) {			
			//TmpGCalendarEvent tmp = gCalendarEventRepositorio.findTop1ByIdRecurringOrderByStartAsc(agendamento.getIdRecurring());
			//SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
			//System.out.println(format.format(tmp.getStart().getTime()));
			agendamento.setEventoPrincipal(true);			
			gCalendarEventRepositorio.deleteByIdRecurring(agendamento.getIdRecurring());
			logMessage("Evento repetido. Agendamento(s) apagado(s). idRecurring: " + agendamento.getIdRecurring(), false);
		} else {
			agendamento.setEventoPrincipal(false); 
			gCalendarEventRepositorio.deleteByIdGCalendar(agendamento.getIdGCalendar());
			logMessage("Agendamento apagado. idGCalendar: " + agendamento.getIdGCalendar(), false);
		}
		
		agendamento.setColor(COR_AGENDAMENTO_DEFAULT);		
		Agendamento ag = this.agendamentoRepositorio.save(agendamento);
		logMessage("salvarAgendamentoTemporarioGCalendar: fim", false);
		return ag;		
	}
	
	/**
	 * Remove um agendamento do BD
	 * @param agendamento o agendamento a ser removido
	 * @throws Exception caso algum erro ocorra
	 */
	@RequestMapping(
			value = "/removerAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void removerAgendamento(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("removerAgendamento: início", false);
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo", true);
			throw new Exception("Não foi possível remover o agendamento.");
		}
		
		if (agendamento.getGrupo() > 0 && agendamento.getConsulta() == null) {
			agendamento.setAtivo(false);			
			this.agendamentoRepositorio.save(agendamento);
			logMessage("Agendamento repetido e marcado como inativo. Id" + agendamento.getId(), false);
		} else {
			if (agendamento.getConsulta() == null) {
				this.agendamentoRepositorio.delete(agendamento);
				logMessage("Agendamento removido. Id" + agendamento.getId(), false);
			} else {
				// O agendamento possui uma consulta associada. Apenas inativa o agendamento
				logMessage("Consulta associada. Agendamento marcado como inativo. Id" + agendamento.getId(), false);
			}
		}
		
		if (agendamento.getConsulta() != null) {
			Psicologo psicologo = LoginController.getPsicologoLogado();		
			if (psicologo == null) {
				logMessage("Psicólogo nulo em getPsicologoLogado", true);
				throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
			}
			
			agendamento.setAtivo(false);
			agendamento.getConsulta().setProntuario(Util.encrypt(agendamento.getConsulta().getProntuario(), psicologo));
			this.agendamentoRepositorio.save(agendamento);
		}
		
		logMessage("removerAgendamento: fim", false);
	}			
	
	/**
	 * Remove os agendamentos futuros com base em um agendamento
	 * @param agendamento o agendamento a ser removido
	 * @throws Exception caso algum erro ocorra
	 */
	@RequestMapping(
			value = "/removerAgendamentosFuturos", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void removerAgendamentosFuturos(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("removerAgendamentosFuturos: início", false);
		
		for (Agendamento ag : this.agendamentoRepositorio.findByGrupo(agendamento.getGrupo())) {
			if (ag.getStart().after(agendamento.getStart()) && ag.getConsulta() == null) {				
				this.agendamentoRepositorio.delete(ag);
			} else if (ag.getStart().after(agendamento.getStart()) && ag.getConsulta() != null) {
				// Agendamento associado a uma consulta
				ag.setAtivo(false);				
				this.agendamentoRepositorio.save(ag);
				logMessage("Consulta associada. Agendamento marcado como inativo. Id" + ag.getId(), false);
			}
		}
		
		// Desconfigura agendamento repetitivo para eventos anteriores
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.findByGrupo(agendamento.getGrupo());
		for (Agendamento ag : lstAgendamentos) {
			ag.setGrupo(0L);
			ag.setEventoPrincipal(false);
		}
		this.agendamentoRepositorio.save(lstAgendamentos);
		logMessage("removerAgendamentosFuturos: fim", false);
	}
	
	/**
	 * Move os agendamentos futuros com base em um agendamento
	 * @param agendamento o agendamento a ser movido
	 * @throws Exception caso algum erro ocorra
	 */
	@RequestMapping(
			value = "/moverAgendamentosFuturos", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void moverAgendamentosFuturos(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("moverAgendamentosFuturos: início", false);
		
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo", true);
			throw new Exception("Não foi possível mover os agendamentos futuros.");
		}
		
		Psicologo psicologo = LoginController.getPsicologoLogado();
		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), 
				agendamento.getGrupo(), psicologo);
		
		Agendamento ag = this.agendamentoRepositorio.findByGrupoAndEventoPrincipal(agendamento.getGrupo(), true);
				
		if (ag != null) {
			ag.setEventoPrincipal(false);			
			this.agendamentoRepositorio.save(ag);
		}
		
		Long novoGrupo = this.agendamentoRepositorio.getNextValueForGroup();		
		agendamento.setEventoPrincipal(true);
		agendamento.setGrupo(novoGrupo);		
		this.agendamentoRepositorio.save(agendamento);
		
		int addDays = 0;
		if (lstAgendamentos != null && !lstAgendamentos.isEmpty()) {
			addDays = agendamento.getStart().get(Calendar.DAY_OF_WEEK) - lstAgendamentos.get(0).getStart().get(Calendar.DAY_OF_WEEK);
		}
		
		for (Agendamento a : lstAgendamentos) {
			if (a.isAtivo()) {
				a.setGrupo(novoGrupo);
				a.getStart().add(Calendar.DATE, addDays);
				a.getEnd().add(Calendar.DATE, addDays);							
			}
		}
		
		this.agendamentoRepositorio.save(lstAgendamentos);
		logMessage("moverAgendamentosFuturos: fim", false);
	}
	
	/**
	 * Atualiza paciente e horários dos agendamentos futuros com base em um agendamento 
	 * @param agendamento o agendamento a ser atualizado
	 * @throws Exception caso algum erro ocorra
	 */
	@RequestMapping(
			value = "/atualizarAgendamentosFuturos", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarAgendamentosFuturos(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("atualizarAgendamentosFuturos: início", false);
		
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo", true);
			throw new Exception("Não foi possível atualizar os agendamentos futuros.");
		}
		
		Psicologo psicologo = LoginController.getPsicologoLogado();
		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), agendamento.getGrupo(), psicologo);
				
		Agendamento ag = this.agendamentoRepositorio.findByGrupoAndEventoPrincipal(agendamento.getGrupo(), true);
				
		if(ag != null) {
			ag.setEventoPrincipal(false);			
			this.agendamentoRepositorio.save(ag);
		}		
		
		agendamento.setEventoPrincipal(true);		
		this.agendamentoRepositorio.save(agendamento);		
		
		SimpleDateFormat format = new SimpleDateFormat("H:mm");
		int hora = Integer.parseInt(format.format(agendamento.getStart().getTime()).split(":")[0]);
		int minuto = Integer.parseInt(format.format(agendamento.getStart().getTime()).split(":")[1]);
				
		for (Agendamento a : lstAgendamentos) {
			if (a.isAtivo()) {
				a.setPaciente(agendamento.getPaciente());
				a.getStart().set(Calendar.HOUR_OF_DAY, hora);
				a.getStart().set(Calendar.MINUTE, minuto);
				a.getEnd().set(Calendar.HOUR_OF_DAY, hora + 1);
				a.getEnd().set(Calendar.MINUTE, minuto);							
			}
		}
		
		this.agendamentoRepositorio.save(lstAgendamentos);
		logMessage("atualizarAgendamentosFuturos: fim", false);
	}
	
	/**
	 * Marca um outro evento como principal
	 * @param agendamento o agendamento a ser removido
	 * @throws Exception caso algum erro ocorra
	 */
	@RequestMapping(
			value = "/atribuirNovoEventoPrincipal", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atribuirNovoEventoPrincipal(@RequestBody Agendamento agendamento) throws Exception {
		logMessage("atribuirNovoEventoPrincipal: início", false);
		
		if (agendamento == null) {
			logMessage("Agendamento recebido nulo", true);
			throw new Exception("Não foi possível configurar agendamento principal.");
		}
		
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		// Remove agendamentos futuros, caso existam
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), agendamento.getGrupo(), psicologo);
		
		SimpleDateFormat format = new SimpleDateFormat("H:mm");
		boolean achou = false;
		String horarioConsulta = format.format(agendamento.getStart().getTime());
		for (Agendamento ag : lstAgendamentos) {
			if (horarioConsulta.equals(format.format(ag.getStart().getTime())) && ag.isAtivo()) {
				ag.setEventoPrincipal(true);				
				this.agendamentoRepositorio.save(ag);
				achou = true;
				break;
			}
		}

		if (!achou && !lstAgendamentos.isEmpty()) {
			Agendamento ag = lstAgendamentos.get(0);
			ag.setEventoPrincipal(true);			
			this.agendamentoRepositorio.save(ag);
		}		
		logMessage("atribuirNovoEventoPrincipal: fim", false);
	}
	
	@RequestMapping(
			value = "/listarAgendamentosComConsulta", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public List<Agendamento> listarAgendamentosComConsulta(@RequestBody Paciente paciente) throws Exception {		
		logMessage("listarAgendamentosComConsulta: início", false);		
		
		if (paciente == null) {
			logMessage("Paciente recebido nulo", true);
			throw new Exception("Não foi possível listar agendamentos.");
		}
						
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
				
		List<Agendamento> lstAgendamento = new ArrayList<>();
		for (Agendamento ag : this.agendamentoRepositorio.listarAgendamentosComConsulta(paciente, psicologo)) {
			if (ag.getConsulta() != null && ag.getConsulta().getProntuario() != null && !ag.getConsulta().getProntuario().isEmpty()) {
				ag.getConsulta().setProntuario(Util.decrypt(ag.getConsulta().getProntuario(), psicologo));
			}
			lstAgendamento.add(ag);
		}
		
		logMessage("listarAgendamentosComConsulta: fim", false);		
		return lstAgendamento;
	}
	
	@RequestMapping(
			value = "/listarAgendamentosComConsultaPeriodo", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE
			)
	public List<Agendamento> listarAgendamentosComConsultaPeriodo(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal, @RequestParam("idPaciente") Long idPaciente) throws Exception {		
		logMessage("AgendaController.listarAgendamentosComConsultaPeriodo: início", false);		
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			logMessage("Formato de data inválido", true);
			throw new Exception("Não foi possível listar os prontuários.");
		}
		
		if (idPaciente == null) {
			logMessage("idPaciente recebido nulo", true);
			throw new Exception("Não foi possível listar os prontuários.");
		}
						
		Psicologo psicologo = LoginController.getPsicologoLogado();		
		if (psicologo == null) {
			logMessage("Psicólogo nulo em getPsicologoLogado", true);
			throw new Exception("Erro ao carregar psicólogo. Faça login novamente.");
		}
		
		Paciente paciente = this.pacienteRepositorio.findOne(idPaciente);
		if (paciente == null) {
			logMessage("Paciente com id " + idPaciente + " não encontrado!", true);
			throw new Exception("Não foi possível listar os prontuários.");
		}
				
		List<Agendamento> lstAgendamento = new ArrayList<>();
		for (Agendamento ag : this.agendamentoRepositorio.listarAgendamentosComConsultaPeriodo(di, df, paciente, psicologo)) {			
			if (ag.getConsulta() != null && ag.getConsulta().getProntuario() != null && !ag.getConsulta().getProntuario().isEmpty()) {				
				ag.getConsulta().setProntuario(Util.decrypt(ag.getConsulta().getProntuario(), psicologo));
			}
			lstAgendamento.add(ag);
		}
		
		logMessage("AgendaController.listarAgendamentosComConsultaPeriodo: fim", false);		
		return lstAgendamento;
	}
}