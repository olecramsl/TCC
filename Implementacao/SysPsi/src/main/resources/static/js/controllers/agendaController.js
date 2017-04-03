// Modulos desta controller
var lazyModules = ['ui.calendar', 'ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('AgendaCtrl', ['$scope', '$mdDialog', 'agendamentoFactory', 'pacienteFactory', 'configFactory', 
	'modalAgendamentoFactory', 'modalAgendamentoService', 'config', function ($scope, $mdDialog, agendamentoFactory, pacienteFactory, 
			configFactory, modalAgendamentoFactory,	modalAgendamentoService, config) {
	
  var ctrl = this;
  
  $scope.$watch(function () { return modalAgendamentoFactory.getMsgConfirmacao(); }, function (newValue, oldValue) {
   	  ctrl.msgConfirmacao = newValue;
  });
  
  $scope.$watch(function () { return modalAgendamentoFactory.getTipoConfirmacao(); }, function (newValue, oldValue) {
   	  ctrl.tipoConfirmacao = newValue;
  });   
    
  $scope.$watch(function () { return agendamentoFactory.getAgendamento(); }, function (newValue, oldValue) {
   	  ctrl.agendamento = newValue;
  });
  
  $scope.$watch(function () { return agendamentoFactory.getAgendamentoCarregado(); }, function (newValue, oldValue) {
   	  ctrl.agendamentoCarregado = newValue;
  });
  
  $scope.$watch(function () { return agendamentoFactory.getLstPacientesAtivos(); }, function (newValue, oldValue) {
   	  ctrl.lstPacientesAtivos = newValue;
  });
  
  $scope.$watch(function () { return agendamentoFactory.getIndexPacienteSelecionado(); }, function (newValue, oldValue) {
   	  ctrl.indexPacienteSelecionado = newValue;
  });    
  
  /**
   * Trata eventuais excessoes que possam ocorrer
   */
  var tratarExcecao = function(error) {
	  var msg;
	  try {
		  // captura de excecao enviada pela Controller (codigo java)
		  msg = error.data.message;
	  } catch(erro) {
		  // Erro nivel Javascript
		  msg = error.data.message;
	  }
	  $mdDialog.show(
		$mdDialog.alert()
			.clickOutsideToClose(true)
			.title('Algo saiu errado ...')
			.textContent(msg)
			.ariaLabel('Alerta')
			.ok('Ok')						
	  );	
  }    
  
  var select = function(start, end) {
	  limparDadosAgendamento();	  
	  agendamentoFactory.setAgendamentoCarregado(null);	  

	  // Verifica se existe um horario pre definido
	  if (!start.hasTime()) {		
		  var time = moment();
		  start = moment(start).hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
		  end = moment(start); // a consulta deve terminar no mesmo dia
		  end.add(configSys.tempoSessao, 'm');
	  }
		
	  var dataInicialAgendamento = start.local();
	  var dataFinalAgendamento = end.local();
		
	  agendamentoFactory.setStart(new Date(dataInicialAgendamento));
	  agendamentoFactory.setEnd(new Date(dataFinalAgendamento));
	  agendamentoFactory.setFormatedStart(start.format('HH:mm'));		
	  
	  modalAgendamentoService.openEventModal();
  };
	
  var eventClick = function(event, jsEvent, view) {			
	  var tmpLst = agendamentoFactory.getLstPacientesAtivos();
	  for (var i = 0; i < tmpLst.length; i++) {
		  if (tmpLst[i].id == event.paciente.id) {					
			  agendamentoFactory.setIndexPacienteSelecionado(i);					
			  break;
		  }				
	  }
		
	  event.formatedStart = event.start.format('HH:mm');							
	  agendamentoFactory.setAgendamento(angular.copy(event));
	  agendamentoFactory.setAgendamentoCarregado(angular.copy(event));
	  
	  modalAgendamentoService.openEventModal();											
  };
	
  var eventDrop = function(event, delta, revertFunc, jsEvent, ui, view) {			
	  var oldEvent = angular.copy(event); // evento dropado
		
	  var days = moment.duration(delta).days()*(-1);
	  oldEvent.start.add(days, "d");
	  oldEvent.end.add(days, "d");						
		
	  var horas   = event.end.hours();
	  var minutos = event.end.minutes();
			
	  event.end  = moment(event.start);
	  event.end  = moment(event.end).hours(horas).minutes(minutos);								
		
	  updateEventDroped(angular.copy(event), angular.copy(oldEvent));
  };
	
  var viewRender = function (view, element) {		  	
	  listarAgendamento(view.start, view.end);						
  };

  /* config object */
  ctrl.uiConfig = {
		  calendar: ({
			  header : {
				  left : 'prev,next today',
				  center : 'title',
				  right : 'month,agendaWeek,agendaDay'
			  },
			  timezone: "local",
			  allDaySlot: false,
			  locale : 'pt-br',
			  navLinks : true, // can click day/week names to navigate views
			  selectable : true,
			  slotDuration : "00:30:00",
			  slotLabelFormat : [ 'ddd D/M', 'HH:mm' ],
			  timeFormat : "HH:mm",
			  selectHelper : true,		
			  editable : true,
			  eventLimit : true, // allow "more" link when too many events
			  select : select,
			  eventClick : eventClick,		
			  eventDrop : eventDrop,
			  viewRender: viewRender			
		  })
  };  
    
  /**
   * Popula a lista de pacientes ativos
   */
  var carregarPacientesAtivos = function() {
	  pacienteFactory.listarPacientesAtivosInativos(true).then(
	      successCallback = function(response) {	    	  
	    	  agendamentoFactory.setLstPacientesAtivos(response.data);	    	  
	  	  },
	  	  errorCallback = function (error, status){
	  		tratarExcecao(error); 
	  	  }
	  );
  }
  
  /**
   * Configurações do sistema
   */  
  var carregarConfiguracoes = function() {
	  configFactory.loadConfig().then(
	      successCallback = function(response) {	
	    	  configSys = response.data;	    	  
	  	  },
	  	  errorCallback = function (error, status){
	  		tratarExcecao(error); 
	  	  }
	  );     
  }

  /**
   * Limpa os dados pertinentes a um agendamento
   */
  var limparDadosAgendamento = function() {
	  agendamentoFactory.setAgendamento({});
	  agendamentoFactory.setIndexPacienteSelecionado(null);
  };
  
  /**
   * Popula o calendario com os agendamentos do BD e persiste novos agendamentos
   * na view atual, caso necessário
   */ 
  var listarAgendamento = function(dataInicial, dataFinal) {
	  agendamentoFactory.listarAgendamentos(dataInicial, dataFinal).then(
			  successCallback = function (response) {
				  angular.element('.calendar').fullCalendar('removeEvents');
				  angular.element('.calendar').fullCalendar('renderEvents',response.data);
			  },
			  errorCallback = function (error) {	  			  		  
				  tratarExcecao(error);
			  }
	  );	  
  };      
  
  /**
   * Atualiza na base de dados um evento que foi movido na agenda
   */
  var updateEventDroped = function(event, oldEvent) {
	  event.repetirSemanalmente = false;
	  event.grupo = 0;
	  var agendamentoDTO = agendamentoFactory.prepararAgendamentoDTO(event);	 
	  agendamentoFactory.salvarAgendamento(agendamentoDTO).then(
		  successCallback = function(response) {
			  angular.element('.calendar').fullCalendar('removeEvents', event.id);
			  angular.element('.calendar').fullCalendar('renderEvent', response.data);
			  
			  // Mantem o evento antigo no BD para evitar o save na view quando visualizada
			  if (oldEvent.grupo > 0) {
				  oldEvent.id = null;				  
				  oldEvent.eventoPrincipal = false;
				  oldEvent.ativo = false;
				  oldEvent.repetirSemanalmente = false;
				  
				  agendamentoDTO = agendamentoFactory.prepararAgendamentoDTO(oldEvent);
				  agendamentoFactory.salvarAgendamento(agendamentoDTO).then(
						  successCallback = function(response) {
							  agendamentoFactory.setAgendamento(angular.copy(event));
							  // Mantem o grupo original para pesquisa e, caso assim deseje o usuário, deslocamento dos eventos futuros
							  agendamentoFactory.setGrupo(oldEvent.grupo);

							  if (agendamentoFactory.getEventoPrincipal()) {									  
								  agendamentoFactory.atribuirNovoEventoPrincipal(agendamentoFactory.getAgendamento());
							  }
							  
							  if (agendamentoFactory.getStart().format("WW") === oldEvent.start.format("WW")) {								  							  
								  var diasDiferenca = oldEvent.start.dayOfYear() - event.start.dayOfYear();
								  if ((diasDiferenca < 7) && (event.start.day() !== oldEvent.start.day())) {
									  modalAgendamentoFactory.setTipoConfirmacao(config.tiposConfirmacoes.MOVER_EVENTOS);
									  modalAgendamentoFactory.setMsgConfirmacao("Você moveu um agendamento configurado para repetir semanalmente. Deseja mover também os eventos futuros associados a este agendamento?");
									  modalAgendamentoService.openConfirmModal();	
								  }
							  }
						  },
						  errorCallback = function (error){			  
							  tratarExcecao(error);			  						
						  }
				  );
			  }
		  },
		  errorCallback = function (error){			  
			  tratarExcecao(error);			  						
		  }
	  );		  	 	 
  };                
  
  carregarPacientesAtivos();
  carregarConfiguracoes();
}]);