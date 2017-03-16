// Modulos desta controller
var lazyModules = ['ui.calendar', 'ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('AgendaCtrl', function ($rootScope, $scope, $uibModal, $q, agendaAPI, pacienteAPI, configAPI, 
		modalAgendamentoAPI, config, $http) {
  var ctrl = this;
  
  $scope.$watch(function () { return modalAgendamentoAPI.getMsgErro(); }, function (newValue, oldValue) {
   	  ctrl.msgErro = newValue;
  });
  
  $scope.$watch(function () { return modalAgendamentoAPI.getMsgConfirmacao(); }, function (newValue, oldValue) {
   	  ctrl.msgConfirmacao = newValue;
  });
  
  $scope.$watch(function () { return modalAgendamentoAPI.getTipoConfirmacao(); }, function (newValue, oldValue) {
   	  ctrl.tipoConfirmacao = newValue;
  });   
  
  $scope.$watch(function () { return agendaAPI.getAgendamento(); }, function (newValue, oldValue) {
   	  ctrl.agendamento = newValue;
  });
  
  $scope.$watch(function () { return agendaAPI.getAgendamentoCarregado(); }, function (newValue, oldValue) {
   	  ctrl.agendamentoCarregado = newValue;
  });
  
  $scope.$watch(function () { return agendaAPI.getLstPacientesAtivos(); }, function (newValue, oldValue) {
   	  ctrl.lstPacientesAtivos = newValue;
  });
  
  $scope.$watch(function () { return agendaAPI.getIndexPacienteSelecionado(); }, function (newValue, oldValue) {
   	  ctrl.indexPacienteSelecionado = newValue;
  });    
  
  /**
   * Abre janela modal do agendamento
   */
  var openEventModal = function (size) {	 	
	  var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'templates/eventoModal.html',
	      controller: 'ModalAgendamentoCtrl',
	      controllerAs: 'ctrl',      
	      size: size
	  });
    
	  modalInstance.result.then(function (selectedItem) {}, function () {        	
	  		limparDadosAgendamento();
	  });
  };
  
  /**
   * Abre janela modal de erro
   */
  var openErroModal = function (size) {	 	
	  var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'templates/erroModal.html',
	      controller: 'ModalAgendamentoCtrl',
	      controllerAs: 'ctrl',
	      scope: $scope, // bind $scope to modal window      
	      size: size
	  });    
  };
  
  /**
   * Abre janela modal de erro
   */
  /*
  var openConfirmModal = function (size) {	 	
	  var modalInstance = $uibModal.open({
	      animation: true,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'templates/confirmacaoAgendamentoModal.html',
	      controller: 'ModalAgendamentoCtrl',
	      controllerAs: 'ctrl',      
	      size: size
	  });    
  };
  */  
  
  var select = function(start, end) {	  
	  limparDadosAgendamento();
	  agendaAPI.setAgendamentoCarregado(null);	  

	  // Verifica se existe um horario pre definido
	  if (!start.hasTime()) {		
		  var time = moment();
		  start = moment(start).hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
		  end = moment(start); // a consulta deve terminar no mesmo dia
		  end.add(configSys.tempoSessao, 'm');
	  }
		
	  var dataInicialAgendamento = start.local();
	  var dataFinalAgendamento = end.local();
		
	  agendaAPI.setStart(new Date(dataInicialAgendamento));
	  agendaAPI.setEnd(new Date(dataFinalAgendamento));
	  agendaAPI.setFormatedStart(start.format('HH:mm'));
		
	  openEventModal();																			
  };
	
  var eventClick = function(event, jsEvent, view) {			
	  var tmpLst = agendaAPI.getLstPacientesAtivos();
	  for (var i = 0; i < tmpLst.length; i++) {
		  if (tmpLst[i].id == event.paciente.id) {					
			  agendaAPI.setIndexPacienteSelecionado(i);					
			  break;
		  }				
	  }
		
	  event.formatedStart = event.start.format('HH:mm');							
	  agendaAPI.setAgendamento(angular.copy(event));
	  agendaAPI.setAgendamentoCarregado(angular.copy(event));	  
	  openEventModal();											
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
	  angular.element('.calendar').fullCalendar('removeEvents');		
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
	  pacienteAPI.listarPacientesAtivos().then(
	      successCallback = function(response) {	  
	    	  agendaAPI.setLstPacientesAtivos(response.data);	    	  
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
	  configAPI.loadConfig().then(
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
	  agendaAPI.setAgendamento({});
	  agendaAPI.setIndexPacienteSelecionado(null);
  };
  
  /**
   * Popula o calendario com os agendamentos do BD e persiste novos agendamentos
   * na view atual, caso necessário
   */ 
  var listarAgendamento = function(dataInicial, dataFinal) {
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  agendaAPI.listarAgendamentos(params).then(
			  successCallback = function (response) {
				  angular.element('.calendar').fullCalendar('renderEvents',response.data);
			  },
			  errorCallback = function (error) {	  			  		  
				  ctrl.tratarExcecao(error);
			  }
	  );	  
  };      
  
  /**
   * Atualiza na base de dados um evento que foi movido na agenda
   */
  var updateEventDroped = function(event, oldEvent) {
	  event.repetirSemanalmente = false;
	  event.grupo = 0;
	  var agendamentoDTO = agendaAPI.prepararAgendamentoDTO(event);	 
	  agendaAPI.salvarAgendamento(agendamentoDTO).then(
		  successCallback = function(response) {
			  angular.element('.calendar').fullCalendar('removeEvents', event.id);
			  angular.element('.calendar').fullCalendar('renderEvent', response.data);
			  
			  // Mantem o evento antigo no BD para evitar o save na view quando visualizada
			  if (oldEvent.grupo > 0) {
				  oldEvent.id = null;				  
				  oldEvent.eventoPrincipal = false;
				  oldEvent.ativo = false;
				  oldEvent.repetirSemanalmente = false;
				  
				  agendamentoDTO = agendaAPI.prepararAgendamentoDTO(oldEvent);
				  agendaAPI.salvarAgendamento(agendamentoDTO).then(
						  successCallback = function(response) {
							  agendaAPI.setAgendamento(angular.copy(event));
							  // Mantem o grupo original para pesquisa e, caso assim deseje o usuário, deslocamento dos eventos futuros
							  agendaAPI.setGrupo(oldEvent.grupo);

							  if (agendaAPI.getEventoPrincipal()) {									  
								  agendaAPI.atribuirNovoEventoPrincipal(agendaAPI.getAgendamento());
							  }
							  
							  if (agendaAPI.getStart().format("WW") === oldEvent.start.format("WW")) {								  							  
								  var diasDiferenca = oldEvent.start.dayOfYear() - event.start.dayOfYear();
								  if ((diasDiferenca < 7) && (event.start.day() !== oldEvent.start.day())) {
									  modalAgendamentoAPI.setTipoConfirmacao(config.tiposConfirmacoes.MOVER_EVENTOS);
									  modalAgendamentoAPI.setMsgConfirmacao("Você moveu um agendamento configurado para repetir semanalmente. Deseja mover também os eventos futuros associados a este agendamento?");
									  modalAgendamentoAPI.openConfirmModal();	
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
  
  /**
   * Trata eventuais excessoes que possam ocorrer
   */
  var tratarExcecao = function(error) {
	  try {
		  // captura de excecao enviada pela Controller (codigo java)
		  ctrl.msgErro = error.data.message;
	  } catch(erro) {
		  // Erro nivel Javascript
		  ctrl.msgErro = error;
	  }
		
	  openErroModal();
  }           
  
  carregarPacientesAtivos();
  carregarConfiguracoes();
});