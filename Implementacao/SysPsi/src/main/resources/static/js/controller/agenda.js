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
		  repetirSemanalmente: false
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
   * Retorna a lista de datas da view iguais ao dia da semana de eventStart
   */
  $scope.getDaysToSaveEventInView = function(dataInicial, dataFinal, eventStart) {
	  var days = [];
	  var diaAgendamento = moment(eventStart).day(); // dia da semana do evento (dom, seg, ter, etc.)
	  var addLoop = 24 * 60 * 60 * 1000;
	  // percorre todos os dias constantes na view do calendário e repete o evento quando necessário
	  for (loop = moment(dataInicial).valueOf(); loop < moment(dataFinal).valueOf(); loop = loop + addLoop) {
		  var dia = new Date(loop);			  		  
		  if ((diaAgendamento == dia.getDay()) && (eventStart < dia)) {		    			  
			  eventStart = moment(eventStart).date(dia.getDate()).month(dia.getMonth()).year(dia.getFullYear());    				
			  days.push(eventStart)
		  }
	  };
	  return days;
  }
  
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
	  /*
	  var evento;
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  $http.get('http://localhost:8080/listarAgendamentos', {params}).then(
	      successCallback = function (response) {
	  		  // Adiciona os agendamentos no calendario
	  		  angular.forEach(response.data, function(value, key) {	
	  			  $('#calendar').fullCalendar('renderEvent',value);
	  			  if (value.eventoPrincipal) {
	  				  evento = angular.copy(value);
	  				  var daysToRepeat = $scope.getDaysToSaveEventInView(dataInicial, dataFinal, value.start);
	  				  params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format(), grupo: value.grupo};	  				  
	  				  // Verifica se já existem registros para o período no BD
	  				  var promiseArray = []; // retorno das requisições http
	  				  var data;
	  				  $http.get('http://localhost:8080/listarAgendamentoPeriodoPorGrupo', {params}).then(
	  						successCallback = function (response) {	
	  							angular.forEach(daysToRepeat, function(value1, key1) {	  								
	  								var dia = value1.date() < 10 ? "0" + value1.date() : value1.date();
	  								var mes = (value1.month()+1) < 10 ? "0" + (value1.month()+1) : (value1.month()+1); 
	  								data = value1.year() + "-" + mes + "-" + dia;
	  								// Verifica se a data não existe na lista de agendamentos persistidos. Caso positivo,
	  								// salva o agendamento no BD
	  								if (response.data.indexOf(data) === -1) {
	  									evento.id		       = null; // novo registro no BD	  									
	  									evento.description     = null;
	  									evento.title           = $scope.updateTitle(evento);
	  									evento.eventoPrincipal = false;
	  									evento.start           = angular.copy(value1);	  									
	  									evento.end             = moment(value.end).add(1, "h");	
	  										  												 
	  									promiseArray.push($http.post('http://localhost:8080/salvarAgendamento', angular.copy(evento)));	  										  								  								
	  								}	  								
	  							});
	  							
	  							$q.all(promiseArray).then(function(dataArray) {
	  				    	  		angular.forEach(dataArray, function(value, key) {	  			  
	  				    	  			$('#calendar').fullCalendar('renderEvent', value.data);
	  				    	  		});		  
	  				    	  	}, function (error){		  		    		  
	  				    	  		angular.element('#AgendaCtrl').scope().tratarExcecao(error);
	  				    	  	});	  						
	  						},
	  						errorCallback = function (error) {	  			  		  
	  					  		$scope.tratarExcecao(error);
	  						}
	  				  );	  				  
	  			  }			  
	  		  });  		  
	  	  },
		  errorCallback = function (error) {	  			  		  
	  		$scope.tratarExcecao(error);
		  }
	  );  
	  */ 
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
  $scope.updateEventDroped = function(event) {	  	  
	  var params = angular.element('#AgendaCtrl').scope().agendamento;	
	  $http.post('http://localhost:8080/salvarAgendamento', params).then(
		  successCallback = function(response) {			  
		  },
		  errorCallback = function (error){			  
			  angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
		  }
	  );	
  };
  
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
			$http.post('http://localhost:8080/salvarAgendamento', angular.copy(agendamento)).then(
				successCallback = function(response) {	  				    //					
					var event = $('#calendar').fullCalendar('clientEvents',agendamento.id);
					if (event) {	
						agendamento.title = angular.element('#AgendaCtrl').scope().updateTitle(agendamento);
						
						/*
						if (angular.element('#AgendaCtrl').scope().agendamento.repetirSemanalmente) {
							$('#calendar').fullCalendar('removeEvents', angular.element('#AgendaCtrl').scope().agendamento.id);
							view = $('#calendar').fullCalendar('getView');
							angular.element('#AgendaCtrl').scope().repetirAgendamento(view.start, view.end, angular.element('#AgendaCtrl').scope().agendamento);
						} else {		
							$('#calendar').fullCalendar('removeEvents', angular.element('#AgendaCtrl').scope().agendamento.id);											
							$('#calendar').fullCalendar('renderEvent', angular.element('#AgendaCtrl').scope().agendamento);
						}
						*/
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
			
			view = $('#calendar').fullCalendar('getView');			
			// Necessário para evitar problemas na controller Java entre as datas
			var dataInicialView = moment();
			var dataFinalView = moment();
			dataInicialView = moment(dataInicialView).date(view.start.date()).month(view.start.month()).year(view.start.year())
				.hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);
			dataFinalView = moment(dataFinalView).date(view.end.date()).month(view.end.month()).year(view.end.year())
				.hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);
			// Fim
			
			var agendamentoDTO = {
					agendamento        : agendamento,
					repetirSemanalmente: agendamento.repetirSemanalmente, 
					dataInicialViewFC  : dataInicialView, 
					dataFinalViewFC    : dataFinalView
			};			
			
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