var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal, $http, $q) {
  var $ctrl = this;    
  
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
      scope: $scope, // bind $scope to modal scope      
      size: size
    });
    
    modalInstance.result.then(function (selectedItem) {            
    }, function () {        	
    	$scope.LimparDadosAgendamento();
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
      scope: $scope, // bind $scope to modal scope      
      size: size
    });    
  };
  
  /**
   * Popula a lista de pacientes ativos
   */  
  $http.get('http://localhost:8080/listarPacientesAtivos').then(
      successCallback = function(response) {	  
    	  $scope.lstPacientesAtivos = response.data;
  	  },
  	  errorCallback = function (error, status){
  		$scope.tratarExcecao(error); 
  	  }
  );  
  
  //Objeto agendamento  
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
  
  /**
   * Limpa os dados pertinentes a um agendamento
   */
  $scope.LimparDadosAgendamento = function() {
	  $scope.agendamento = {};
  	  $scope.indexPacienteSelecionado = null;
  };
  
  /**
   * Popula o calendario com os agendamentos do BD e persiste novos agendamentos
   * na view atual, caso necessário
   */ 
  $scope.listarAgendamento = function(dataInicial, dataFinal) {
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  $http.get('http://localhost:8080/listarAgendamentos', {params}).then(
			  successCallback = function (response) {
				  $('#calendar').fullCalendar('renderEvents',response.data);
			  },
			  errorCallback = function (error) {	  			  		  
			  		$scope.tratarExcecao(error);
			  }
	  );	  
  };      
  
  /**
   * Atualiza o título do agendamento
   */
  $scope.updateTitle = function (agendamento) {		
	  return agendamento.description ? agendamento.paciente.nomeExibicao + " (" +
			  agendamento.description + ")" : agendamento.paciente.nomeExibicao;			  
  };       
  
  /**
   * Atualiza na base de dados um evento que foi movido na agenda
   */
  $scope.updateEventDroped = function(event, oldEvent) {	  
	  var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(angular.copy(event));	 
	  $http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
		  successCallback = function(response) {
			  // Mantem o evento antigo no BD para evitar o save na view quando visualizada
			  if (oldEvent.grupo > 0) {
				  oldEvent.id = null;
				  oldEvent.eventoPrincipal = false;
				  oldEvent.ativo = false;
				  agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(angular.copy(oldEvent));
				  $http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
						  successCallback = function(response) {
							  
						  },
						  errorCallback = function (error){			  
							  angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
						  }
				  );
			  }
		  },
		  errorCallback = function (error){			  
			  angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
		  }
	  );	
  };
  
  /**
   * Retorna o DTO a ser enviado ao método salvar
   */
  $scope.prepareAgendamentoDTO = function(agendamento) {
	  view = $('#calendar').fullCalendar('getView');			
	  // Necessário para evitar problemas na controller Java entre as datas
	  var dataInicialView = moment();
	  var dataFinalView = moment();
	  dataInicialView = moment(dataInicialView).date(view.start.date()).month(view.start.month()).year(view.start.year())
	  	.hour(agendamento.start.hour()).minute(agendamento.start.minute()).second(0).millisecond(0);
	  dataFinalView = moment(dataFinalView).date(view.end.date()).month(view.end.month()).year(view.end.year())
	  	.hour(agendamento.end.hour()).minute(agendamento.end.minute()).second(0).millisecond(0);
	  // Fim
	  
	  return agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente, 
				dataInicialViewFC  : dataInicialView, 
				dataFinalViewFC    : dataFinalView
	  };
  }
  
  /**
   * Trata eventuais excessoes que possam ocorrer
   */
  $scope.tratarExcecao = function(error) {
	  try {
		  // captura de excecao enviada pela Controller (codigo java)
		  angular.element('#AgendaCtrl').scope().msgErro = error.data.message;
	  } catch(erro) {
		  // Erro nivel Javascript
		  angular.element('#AgendaCtrl').scope().msgErro = error;
	  }
		
	  $ctrl.openErroModal();
  }       
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
app.controller('ModalInstanceCtrl', function ($uibModalInstance, $http, $q, $scope) {
	/**
	 * Cancela a operação na janela modal
	 */
	$scope.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};
	
	/**
	 * Salva/atualiza as informações de um agendamento
	 */
	$scope.salvar = function (agendamento) {				
		// Edicao				
		if (agendamento.id) {
			var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(agendamento); 
			$http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
					successCallback = function(response) {	  				   					
						var event = $('#calendar').fullCalendar('clientEvents',agendamento.id);
						if (event) {	
							agendamento.title = angular.element('#AgendaCtrl').scope().updateTitle(agendamento);
													
							if (angular.element('#AgendaCtrl').scope().agendamento.repetirSemanalmente) {
								$('#calendar').fullCalendar('removeEvents');
								view = $('#calendar').fullCalendar('getView');
								angular.element('#AgendaCtrl').scope().listarAgendamento(view.start, view.end);
							} else {		
								$('#calendar').fullCalendar('removeEvents', angular.element('#AgendaCtrl').scope().agendamento.id);											
								$('#calendar').fullCalendar('renderEvents',response.data);
							}						
						} else {
							angular.element('#AgendaCtrl').scope().msgErro = "Não foi possível encontrar o agendamento com o id informado!";
							angular.element('#AgendaCtrl').scope().$ctrl.openErroModal(); 
						}	
					},
					errorCallback = function (error, status){					
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  							
					}
			);
		// Novo agendamento
		} else if (angular.element('#AgendaCtrl').scope().agendamento.paciente) {				
			agendamento.title   = angular.element('#AgendaCtrl').scope().updateTitle(agendamento);
			var horarioConsulta = agendamento.formatedStart.split(":");
			agendamento.start   = moment(agendamento.start).hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);
			agendamento.end     = moment(agendamento.start).add(1, 'h');						
						
			var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(agendamento);
			$http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
					successCallback = function(response) {											
						$('#calendar').fullCalendar('renderEvents',response.data);
					},
					errorCallBack = function(error) {
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);
					}
			);																
		};
		
		$('#calendar').fullCalendar('unselect');												
		$uibModalInstance.close();
	};
		
	/**
	 * Remove um agendamento
	 */
	$scope.remover = function (agendamento) {											
		$http.post('http://localhost:8080/removerAgendamento', angular.copy(agendamento)).then(
			successCallback = function(response) {	  				    									
				$('#calendar').fullCalendar('removeEvents',agendamento.id);				
			},
			errorCallback = function (error, status){					
				angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
			}
		);	
		$uibModalInstance.close();
	};						
});