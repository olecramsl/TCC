package br.com.syspsi.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

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

import br.com.syspsi.model.dto.AgendamentoDTO;
import br.com.syspsi.model.entity.Agendamento;
import br.com.syspsi.repository.AgendamentoRepositorio;

@RestController
public class AgendaController {			
	/** Application name. */
    private static final String APPLICATION_NAME = "syspsi";

    /** Directory to store user credentials for this application. */
    private static final java.io.File DATA_STORE_DIR = new java.io.File(
        System.getProperty("user.home"), ".credentials/calendar-java-quickstart");

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
     * at ~/.credentials/calendar-java-quickstart
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
    
    @Autowired
	private AgendamentoRepositorio agendamentoRepositorio;
	
    /**
     * Creates an authorized Credential object.
     * @return an authorized Credential object.
     * @throws IOException
     */
    public static Credential authorize() throws IOException {
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
        System.out.println(
                "Credentials saved to " + DATA_STORE_DIR.getAbsolutePath());
        return credential;
    }
    
    /**
     * Build and return an authorized Calendar client service.
     * @return an authorized Calendar client service
     * @throws IOException
     */
    public static com.google.api.services.calendar.Calendar
        getCalendarService() throws IOException {
        Credential credential = authorize();
        return new com.google.api.services.calendar.Calendar.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
    
    @RequestMapping(value="/callback", method=RequestMethod.GET, params="code" )
    public ModelAndView oauth2Callback(@RequestParam(value="code") String code, ModelAndView mv) {
    	/*
	    try {
		    TokenResponse response = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
		    credential=flow.createAndStoreCredential(response, "userID");
		    client = new com.google.api.services.calendar.Calendar.Builder(httpTransport, JSON_FACTORY, credential).
		    setApplicationName(APPLICATION_NAME).build();
		
		    Events events=client.events();
		    com.google.api.services.calendar.model.Events eventList=events.list("primary").execute();
		    mv.addObject("events", eventList.getItems()); 
	    } catch (Exception e) {
	    }
	    */
	    mv.setViewName("agenda");
	    return mv;
    }
    
    @RequestMapping(
    		value="/listarAgendamentoGCalendar", 
    		method=RequestMethod.GET,
    		produces = MediaType.APPLICATION_JSON_VALUE
    )
    public List<Agendamento> listarAgendamentosGCalendar(@RequestParam("dataInicial") String dataInicial, 
			@RequestParam("dataFinal") String dataFinal) throws Exception {
    	List<Agendamento> lstAgendamentosGCalendar = new ArrayList<>();
    	
    	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			throw new Exception("Formato de data inválido em listarAgendamento.");
		}	
    	
    	// Build a new authorized API client service.
        // Note: Do not confuse this class with the
        //   com.google.api.services.calendar.model.Calendar class.
        com.google.api.services.calendar.Calendar service =
            getCalendarService();

        // List the next 10 events from the primary calendar.
        DateTime now = new DateTime(System.currentTimeMillis());
        Events events = service.events().list("primary")
            .setMaxResults(10)
            .setTimeMin(now)
            .setOrderBy("startTime")
            .setSingleEvents(true)
            .execute();
        List<Event> items = events.getItems();
        if (items.size() == 0) {
            System.out.println("No upcoming events found.");
        } else {
            System.out.println("Upcoming events");
            for (Event event : items) {
                DateTime start = event.getStart().getDateTime();
                if (start == null) {
                    start = event.getStart().getDate();
                }
                System.out.printf("%s (%s)\n", event.getSummary(), start);
            }
        }
        return lstAgendamentosGCalendar;
    }       		
	
	/**
	 * Retorna uma lista de objetos Agendamento para serem gravados na view FullCalendar
	 * @param di a data inicial da view
	 * @param df a data final da view
	 * @param agendamento o objeto agendamento de referência
	 * @return um lista de objetos Agendamento
	 */
	private List<Agendamento> getLstAgendamentosParaSalvar(Calendar di, Calendar df, Agendamento ag) {
		List<Agendamento> lstAgendamento = new ArrayList<>();
		Agendamento agendamento = new Agendamento(ag.getPaciente(), ag.getPsicologo(), ag.getgCalendarId(), 
				ag.getStart(), ag.getEnd(), ag.getGrupo(), ag.getDescription(), ag.isEventoPrincipal(), 
				ag.isAtivo());
					
		// Dias já salvos no BD
		List<String> lstDiasSalvos = this.agendamentoRepositorio.listarDatasAgendamentoPeriodoPorGrupo(di, df, 
				agendamento.getGrupo(), agendamento.getPsicologo());
		
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
					
					agendamento = new Agendamento(agendamento.getPaciente(), agendamento.getPsicologo(), null,  
							(Calendar)agendamento.getStart().clone(), (Calendar)agendamento.getEnd().clone(),
							agendamento.getGrupo(),	null, false, true);
				}
			}
		}			
		return lstAgendamento;
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
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar di = Calendar.getInstance();
		Calendar df = Calendar.getInstance();		
		
		try {
			di.setTime(format.parse(dataInicial));
			df.setTime(format.parse(dataFinal));
		} catch (ParseException e) {
			throw new Exception("Formato de data inválido em listarAgendamento.");
		}																	
		
		List<Agendamento> lstAgendamentos = new ArrayList<>();
		for (Agendamento ag : this.agendamentoRepositorio.listarPorPeriodo(di, df, LoginController.getPsicologoLogado())) {
			if (ag.isEventoPrincipal() && ag.isAtivo()) {
				lstAgendamentos.add(ag); // os eventos principais ativos devem ser adicionados para serem exibidos na view				
				// Agendamento é criado com eventoPrincipal false, pois o evento principal já existe e está ativo,
				// restando apenas criar os agendamentos futuros
				Agendamento agendamento = new Agendamento(ag.getPaciente(), ag.getPsicologo(), null, 
						ag.getStart(), ag.getEnd(), ag.getGrupo(), null, !ag.isEventoPrincipal(), true);
				di.set(Calendar.HOUR_OF_DAY, agendamento.getStart().get(Calendar.HOUR_OF_DAY));
				di.set(Calendar.MINUTE, agendamento.getStart().get(Calendar.MINUTE));
				df.set(Calendar.HOUR_OF_DAY, agendamento.getEnd().get(Calendar.HOUR_OF_DAY));
				df.set(Calendar.MINUTE, agendamento.getEnd().get(Calendar.MINUTE));
				lstAgendamentos.addAll(this.getLstAgendamentosParaSalvar(di, df, agendamento));
				
			} else {			
				lstAgendamentos.add(ag); // Novo agendamento
			}
		}				
		
		this.agendamentoRepositorio.save(lstAgendamentos);
		
		// remove os inativos
		for (Iterator<Agendamento> iterator = lstAgendamentos.iterator(); iterator.hasNext(); ) {
		    Agendamento value = iterator.next();
		    if (!value.isAtivo()) {
		        iterator.remove();
		    }
		}
		
		return lstAgendamentos;
	}	
	
	/**
	 * Salva um agendamento. Se for um agendamento semanal, salva o primeiro evento. Nesse caso é necessário
	 * chamar listarAgendamentos no AngularJS para que a view seja atualizada com os agendamentos futuros.
	 * @param AgendamentoDTO dto contendo o agendamento; data inicial e final da view; e se o evento é semanal
	 * @throws Exception Caso haja algum problema ao persistir os dados no BD	 
	 */
	@RequestMapping(
			value = "/salvarAgendamento", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Agendamento salvarAgendamento(@RequestBody AgendamentoDTO agendamentoDTO) throws Exception {		
		Agendamento agendamento = agendamentoDTO.getAgendamento();		
				
		agendamento.setPsicologo(LoginController.getPsicologoLogado());
				
		if ((agendamentoDTO.isRepetirSemanalmente() &&				
		   (agendamento.getGrupo() == null || agendamento.getGrupo() == 0))) {
			agendamento.setGrupo(this.agendamentoRepositorio.getNextValueForGroup(agendamento.getPsicologo()));
			agendamento.setEventoPrincipal(true);
		} else {
			agendamento.setEventoPrincipal(false);
		}
		return this.agendamentoRepositorio.save(agendamento);		
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
		if (agendamento.getGrupo() > 0) {
			agendamento.setAtivo(false);
			this.agendamentoRepositorio.save(agendamento);
		} else {
			this.agendamentoRepositorio.delete(agendamento);
		}
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
		// Remove agendamentos futuros, caso existam
		this.agendamentoRepositorio.removerAgendamentosFuturos(agendamento.getStart(), agendamento.getGrupo(), agendamento.getPsicologo());
		
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.findByGrupoAndPsicologo(agendamento.getGrupo(), agendamento.getPsicologo());
		for (Agendamento ag : lstAgendamentos) {
			ag.setGrupo(0L);
			ag.setEventoPrincipal(false);
		}
		this.agendamentoRepositorio.save(lstAgendamentos);
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
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), agendamento.getGrupo(), agendamento.getPsicologo());
		
		Agendamento ag = this.agendamentoRepositorio.findByGrupoAndPsicologoAndEventoPrincipal(agendamento.getGrupo(), 
				agendamento.getPsicologo(), true);
				
		if (ag != null) {
			ag.setEventoPrincipal(false);		
			this.agendamentoRepositorio.save(ag);
		}
		
		Long novoGrupo = this.agendamentoRepositorio.getNextValueForGroup(agendamento.getPsicologo());		
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
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), agendamento.getGrupo(), agendamento.getPsicologo());
		
		Agendamento ag = this.agendamentoRepositorio.findByGrupoAndPsicologoAndEventoPrincipal(agendamento.getGrupo(), 
				agendamento.getPsicologo(), true);
		
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
		// Remove agendamentos futuros, caso existam
		List<Agendamento> lstAgendamentos = this.agendamentoRepositorio.listarAgendamentosAposData(agendamento.getStart(), agendamento.getGrupo(), agendamento.getPsicologo());
		
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
	}
}