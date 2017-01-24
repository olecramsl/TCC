var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal, $http, $q) {
  var $ctrl = this;         
  
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
  
  /**
   * Popula o calendario com os agendamentos do BD
   */ 
  $scope.listarAgendamento = function(dataInicial, dataFinal) {	 
	  var evento;
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  $http.get('http://localhost:8080/listarAgendamentos', {params}).then(
	      successCallback = function (response) {
	    	  //var gruposAdd = []; // grupos já replicados na view
	    	  //var promiseArray = []; // retorno das requisições http
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
	  								if (response.data.indexOf(data) === -1) {	  				
	  									evento.id		       = null; // novo registro no BD	  									
	  									evento.description     = null;
	  									evento.title           = $scope.updateTitle(evento);
	  									evento.eventoPrincipal = false;
	  									evento.start           = angular.copy(value1);	  									
	  									evento.end             = moment(value.end).add(1, "h");	  										  								
	  									$('#calendar').fullCalendar('renderEvent',evento);	  									
	  								}	  								
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
  };
  
  /**
   * Repete o agendamento na view FullCalendar
   * Os registros dos agendamentos semanais somente serão criados sob demanda (na apresentação da view)
   */
  /*
  $scope.repetirAgendamento = function (dataInicial, dataFinal, event) {	  	  
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format(), grupo: event.grupo};
	  // Verifica se já existem registros para o período no BD
	  $http.get('http://localhost:8080/listarAgendamentoPeriodoPorGrupo', {params}).then(
	      successCallback = function (response) {
	    	  var lstAgendamentosPeriodo = response.data;	    	  
	    	  // Verifica se jah existe um grupo pre definido para o agendamento repetitivo
	    	  // Caso não exista, cria um novo	  
	    	  if (event.grupo == 0) {			  
	    		  event.grupo = 1; // ALTERAR APOS TRATAMENTO ADEQUADO
	    	  }		  
		    		  	  	  		  	 
	    	  var promiseArray = []; // retorno das requisições http
	    	  var diaAgendamento = moment(event.start).day(); // dia da semana do evento (dom, seg, ter, etc.)
	    	  var addLoop = 24 * 60 * 60 * 1000;
	    	  // percorre todos os dias constantes na view do calendário e repete o evento quando necessário
	    	  for (loop = moment(dataInicial).valueOf(); loop <= moment(dataFinal).valueOf(); loop = loop + addLoop) {
	    		  var dia = new Date(loop);			  		  
	    		  if ((diaAgendamento == dia.getDay()) && (event.start < dia)) {		    			  
	    			  event.start = moment(event.start).date(dia.getDate()).month(dia.getMonth()).year(dia.getFullYear());
	    			  event.end   = moment(event.end).date(dia.getDate()).month(dia.getMonth()).year(dia.getFullYear());
		    				    			  
	    			  if (lstAgendamentosPeriodo.indexOf(moment(event.start).format('YYYY-MM-DD')) !== -1) {	    				  
	    				  var evento = $('#calendar').fullCalendar('clientEvents',event.id);
	    				  if (!evento) {
	    					  $('#calendar').fullCalendar('renderEvent', event);
	    				  }
	    			  } else {
		    			  params = angular.copy(event);			  
		    			  promiseArray.push($http.post('http://localhost:8080/salvarAgendamento', params));
		    			  
		    			  event.title = $scope.updateTitle(event);
		    			  event.id = null; // Caso necessário novos agendamentos na view
		    			  event.description = null; // Limpa observações dos futuros agendamentos
	    			  }
	    		  }
	    	  	};
		    	  
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
  };
  */
  $scope.getDaysToSaveEventInView = function(dataInicial, dataFinal, eventStart) {
	  var days = [];
	  var diaAgendamento = moment(eventStart).day(); // dia da semana do evento (dom, seg, ter, etc.)
	  var addLoop = 24 * 60 * 60 * 1000;
	  // percorre todos os dias constantes na view do calendário e repete o evento quando necessário
	  for (loop = moment(dataInicial).valueOf(); loop <= moment(dataFinal).valueOf(); loop = loop + addLoop) {
		  var dia = new Date(loop);			  		  
		  if ((diaAgendamento == dia.getDay()) && (eventStart < dia)) {		    			  
			  eventStart = moment(eventStart).date(dia.getDate()).month(dia.getMonth()).year(dia.getFullYear());    				
			  days.push(eventStart)
		  }
	  };
	  return days;
  }
  
  /**
   * Atualiza o título do agendamento
   */
  $scope.updateTitle = function (agendamento) {		
	  return agendamento.description ? agendamento.paciente.nomeExibicao + " (" +
			  agendamento.description + ")" : agendamento.paciente.nomeExibicao;			  
  };
  
  // Objeto agendamento
  $scope.agendamento = {
		  id                 : null,
		  gCalendarId        : null,
		  paciente	         : null,
		  title              : null,
		  start              : null,
		  end                : null,
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
   * Apaga os dados do agendamento
   */
  $scope.apagarDadosAgendamento = function() {			  
	  $scope.agendamento = {
			  id                 : null,
			  gCalendarId        : null,
			  paciente	         : null,
			  title              : null,
			  start              : null,
			  end                : null,
			  grupo              : 0,
			  eventoPrincipal    : false,
			  description        : null,
			  repetirSemanalmente: false
	  };	  
	  $scope.indexPacienteSelecionado = null;
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
		
	  angular.element('#AgendaCtrl').scope().$ctrl.openErroModal();
  }
  
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
    	$scope.apagarDadosAgendamento();      	
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
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
app.controller('ModalInstanceCtrl', function ($uibModalInstance, $http, $q) {
	var $ctrl = this;		
			
	/**
	 * Cancela a operação na janela modal
	 */
	$ctrl.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};
	
	/**
	 * Salva/atualiza as informações de um agendamento
	 */
	$ctrl.salvar = function () {		
		// Edicao
		if (angular.element('#AgendaCtrl').scope().agendamento.id) {				
			var params = angular.element('#AgendaCtrl').scope().agendamento;				
			$http.post('http://localhost:8080/salvarAgendamento', params).then(
				successCallback = function(response) {	  				    //					
					var event = $('#calendar').fullCalendar('clientEvents',angular.element('#AgendaCtrl').scope().agendamento.id);
					if (event) {	
						angular.element('#AgendaCtrl').scope().agendamento.title = 
							angular.element('#AgendaCtrl').scope().updateTitle(angular.element('#AgendaCtrl').scope().agendamento);
						
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
			event = angular.element('#AgendaCtrl').scope().agendamento;
			event.title = angular.element('#AgendaCtrl').scope().updateTitle(event);			
			
			var promiseArray = []; // retorno das requisições http							
			if (angular.element('#AgendaCtrl').scope().agendamento.repetirSemanalmente) {
				event.eventoPrincipal = true;
				// pega id do grupo para repetição
				event.grupo = 1; // RETIRAR APÓS TRATAMENTO ADEQUADO
				
				view = $('#calendar').fullCalendar('getView');				
				var daysToSave = angular.element('#AgendaCtrl').scope()
					.getDaysToSaveEventInView(view.start, view.end, event.start);
										
				angular.forEach(daysToSave, function(value, key) {
					event.start = value;							
					event.end	= moment(value).add(1, 'h');
					
					// Salva no BD										
					params = angular.copy(event);							
					promiseArray.push($http.post('http://localhost:8080/salvarAgendamento', params));
													
					event.id              = null; // para novo registro
					event.title           = null;
					event.description     = null;
					event.eventoPrincipal = false;
				});
			} else {
				// Salva no BD
				params = angular.copy(event);							
				promiseArray.push($http.post('http://localhost:8080/salvarAgendamento', params));
			}
			
			$q.all(promiseArray).then(function(dataArray) {
    	  		angular.forEach(dataArray, function(value, key) {	    	  			
    	  			// Adiciona evento ao calendário    	  			
    	  			$('#calendar').fullCalendar('renderEvent', value.data);    	  			
    	  		});		  
    	  	}, function (error){		  		    		  
    	  		angular.element('#AgendaCtrl').scope().tratarExcecao(error);
    	  	});								
		};
												
		$('#calendar').fullCalendar('unselect');												
		$uibModalInstance.close();
	};
		
	/**
	 * Remove um agendamento
	 */
	$ctrl.remover = function () {									
		var params = angular.element('#AgendaCtrl').scope().agendamento;
		$http.post('http://localhost:8080/removerAgendamento', params).then(
			successCallback = function(response) {	  				    //									
				$('#calendar').fullCalendar('removeEvents',angular.element('#AgendaCtrl').scope().agendamento.id);				
			},
			errorCallback = function (error, status){					
				angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
			}
		);	
		$uibModalInstance.close();
	};						
});