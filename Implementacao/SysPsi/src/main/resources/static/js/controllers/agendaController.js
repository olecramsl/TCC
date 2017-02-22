// Modulos desta controller
var lazyModules = ['ui.calendar', 'ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('AgendaCtrl', function ($rootScope, $scope, $uibModal, $q, agendaAPI, pacienteAPI, configAPI, modal, config, $http) {
  var $ctrl = this;      
  
  $scope.select = function(start, end) {						  	
	  	limparDadosAgendamento();
		$scope.agendamentoCarregado = null;

		// Verifica se existe um horario pre definido
		if (!start.hasTime()) {		
			var time = moment();
			start = moment(start).hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
			end = moment(start); // a consulta deve terminar no mesmo dia
			end.add(configSys.tempoSessao, 'm');
		}
		
		var dataInicialAgendamento = start.local();
		var dataFinalAgendamento = end.local();
		
		$scope.agendamento.start = new Date(dataInicialAgendamento);
		$scope.agendamento.end = new Date(dataFinalAgendamento);
		$scope.agendamento.formatedStart =	start.format('HH:mm');									
		
		$scope.$ctrl.openEventModal();																			
	};
	
	$scope.eventClick = function(event, jsEvent, view) {			
		var tmpLst = $scope.lstPacientesAtivos;
		for (var i = 0; i < tmpLst.length; i++) {
			if (tmpLst[i].id == event.paciente.id) {					
				$scope.indexPacienteSelecionado = i;					
				break;
			}				
		}
		
		event.formatedStart = event.start.format('HH:mm');							
		$scope.agendamento = angular.copy(event);			
		$scope.agendamentoCarregado = angular.copy(event);								
		$scope.$ctrl.openEventModal();											
	};
	
	$scope.eventDrop = function(event, delta, revertFunc, jsEvent, ui, view) {			
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
	
	$scope.viewRender = function (view, element) {	
		angular.element('.calendar').fullCalendar('removeEvents');		
		listarAgendamento(view.start, view.end);						
	};

	/* config object */
	$scope.uiConfig = {
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
			select : $scope.select,
			eventClick : $scope.eventClick,		
			eventDrop : $scope.eventDrop,
			viewRender: $scope.viewRender			
	  })
	};
  
  /**
   * Abre janela modal do agendamento
   */
  $ctrl.openEventModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/eventoModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });
    
    modalInstance.result.then(function (selectedItem) {            
    }, function () {        	
    	limparDadosAgendamento();
    });
  };
  
  /**
   * Abre janela modal de erro
   */
  $ctrl.openErroModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/erroModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });    
  };
  
  /**
   * Abre janela modal de erro
   */
  $ctrl.openConfirmModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/confirmacaoModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });    
  };
  
  // Objeto agendamento  
  $scope.agendamento = {
		  id                 : null,
		  gCalendarId        : null,
		  paciente	         : null,
		  psicologo			 : null,
		  title              : null,
		  start              : null,
		  end                : null,
		  formatedStart		 : null,
		  grupo		         : 0,
		  eventoPrincipal    : false,
		  description        : null,
		  repetirSemanalmente: false,
		  ativo				 : true
  };      
  
  // Lista de pacientes ativos cadastrados no sistema
  $scope.lstPacientesAtivos = null;
  
  // O index do paciente atribuido ao agendamento selecionado na agenda
  $scope.indexPacienteSelecionado = null;    
  
  // Mensagem de erro 
  $scope.msgErro = null;
  
  // Mensagem modal confirmação
  $scope.msgConfirmacao = null;  
  $scope.tipoConfirmacao = null;
  
  $scope.$watch(function () { return modal.getMsgErro(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
    	  $scope.msgErro = newValue;
      }
  });
  
  $scope.$watch(function () { return modal.getMsgConfirmacao(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
    	  $scope.msgConfirmacao = newValue;
      }
  });
  
  $scope.$watch(function () { return modal.getTipoConfirmacao(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
    	  $scope.tipoConfirmacao = newValue;
      }
  });   
  
  /**
   * Popula a lista de pacientes ativos
   */
  var carregarPacientesAtivos = function() {
	  pacienteAPI.listarPacientesAtivos().then(
	      successCallback = function(response) {	  
	    	  $scope.lstPacientesAtivos = response.data;
	  	  },
	  	  errorCallback = function (error, status){
	  		$scope.tratarExcecao(error); 
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
	  		$scope.tratarExcecao(error); 
	  	  }
	  );     
  }

  /**
   * Limpa os dados pertinentes a um agendamento
   */
  var limparDadosAgendamento = function() {
	  $scope.agendamento = {};
  	  $scope.indexPacienteSelecionado = null;
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
			  		$scope.tratarExcecao(error);
			  }
	  );	  
  };      
  
  /**
   * Atualiza na base de dados um evento que foi movido na agenda
   */
  var updateEventDroped = function(event, oldEvent) {
	  event.repetirSemanalmente = false;
	  event.grupo = 0;
	  var agendamentoDTO = agendaAPI.prepareAgendamentoDTO(event);	 
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
				  
				  agendamentoDTO = agendaAPI.prepareAgendamentoDTO(oldEvent);
				  agendaAPI.salvarAgendamento(agendamentoDTO).then(
						  successCallback = function(response) {
							  $scope.agendamento = angular.copy(event);
							  // Mantem o grupo original para pesquisa e, caso assim deseje o usuário, deslocamento dos eventos futuros
							  $scope.agendamento.grupo = oldEvent.grupo;

							  if ($scope.agendamento.eventoPrincipal) {									  
								  agendaAPI.atribuirNovoEventoPrincipal($scope.agendamento);
							  }
							  
							  if ($scope.agendamento.start.format("WW") === oldEvent.start.format("WW")) {								  							  
								  var diasDiferenca = oldEvent.start.dayOfYear() - event.start.dayOfYear();
								  if ((diasDiferenca < 7) && (event.start.day() !== oldEvent.start.day())) {
									  $scope.tipoConfirmacao = config.tiposConfirmacoes.MOVER_EVENTOS;
									  $scope.msgConfirmacao = "Você moveu um agendamento configurado para repetir semanalmente. Deseja mover também os eventos futuros associados a este agendamento?";
									  $scope.$ctrl.openConfirmModal();	
								  }
							  }
						  },
						  errorCallback = function (error){			  
							  $scope.tratarExcecao(error);			  						
						  }
				  );
			  }
		  },
		  errorCallback = function (error){			  
			  $scope.tratarExcecao(error);			  						
		  }
	  );		  	 	 
  };
  
  /**
   * Retorna o DTO a ser enviado ao método salvar
   */
  $scope.prepareAgendamentoDTO = function(agendamento) {
	  var view = angular.element('.calendar').fullCalendar('getView');
	  	  	  
	  var dataInicialView =view.start.local();
	  var dataFinalView = view.end.local();
	  
	  return agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente, 
				dataInicialViewFC  : new Date(dataInicialView), 
				dataFinalViewFC    : new Date(dataFinalView)
	  };
  }
  
  /**
   * Verifica se algum campo da modal de novo evento foi alterado
   */
  $scope.isDataChanged = function(agendamento, agendamentoCarregado) {	  
	  if (agendamentoCarregado === null) {		  
		  return true;	  
	  }
	  return agendamentoCarregado.paciente.id !== agendamento.paciente.id ||
	  	agendamentoCarregado.formatedStart !== agendamento.formatedStart ||
	  	agendamentoCarregado.description !== agendamento.description ||
	  	agendamentoCarregado.repetirSemanalmente !== agendamento.repetirSemanalmente;
  }
  
  /**
   * Trata eventuais excessoes que possam ocorrer
   */
  $scope.tratarExcecao = function(error) {
	  try {
		  // captura de excecao enviada pela Controller (codigo java)
		  $scope.msgErro = error.data.message;
	  } catch(erro) {
		  // Erro nivel Javascript
		  $scope.msgErro = error;
	  }
		
	  $ctrl.openErroModal();
  }           
  
  carregarPacientesAtivos();
  carregarConfiguracoes();
});