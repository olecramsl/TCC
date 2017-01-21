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
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  $http.get('http://localhost:8080/listarAgendamentos', {params}).then(
	      successCallback = function (response) {	    	  
	  		  // Adiciona os agendamentos no calendario
	  		  angular.forEach(response.data, function(value, key) {	  			  
	  			  // Verifica agendamento semanal	  			  	  			 
	  			  if (value.grupo > 0) {
	  				  $scope.repetirAgendamento(dataInicial, dataFinal, value);
	  			  } else {
	  				  $('#calendar').fullCalendar('renderEvent',value);
	  			  }		  			  	  			  
	  		  });  		  
	  	  },
		  errorCallback = function (error) {
	  		$scope.tratarExcecao(error);
		  }
	  );   
  };
  
  /**
   * Repete o agendamento na view FullCalendar, se necessário
   * Os novos eventos repetidos somente serão criados quando a view for visualizada
   */
  $scope.repetirAgendamento = function (dataInicial, dataFinal, event) {	  	  
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format(), grupo: event.grupo};
	  $http.get('http://localhost:8080/isAgendamentoPeriodoSet', {params}).then(
	      successCallback = function (response) {	    
	    	  if (!response.data) { // o evento só será salvo na base se ainda não existir
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
		    			  			  
		    			  var params = angular.copy(event);			  
		    			  promiseArray.push($http.post('http://localhost:8080/salvarAgendamento', params));
		    			  
		    			  event.title = $scope.updateTitle(event);
		    			  event.id = null; // Caso necessário novos agendamentos na view
		    			  event.description = null; // Limpa observações dos futuros agendamentos			  			  		 
		    		  }
		    	  };
		    	  
		    	  $q.all(promiseArray).then(function(dataArray) {
		    		  angular.forEach(dataArray, function(value, key) {	  			  
		      			  //alert(angular.toJson(value));  			 
		    			  $('#calendar').fullCalendar('renderEvent', value.data);
		      		  });		  
		    	  }, function (error){
		    		  angular.element('#AgendaCtrl').scope().tratarExcecao(error);
		    	  });
	    	  } else {
	    		  $('#calendar').fullCalendar('renderEvent', event);
	    	  }
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
  
  // Objeto agendamento
  $scope.agendamento = {
		  id         : null,
		  gCalendarId: null,
		  paciente	 : null,
		  title      : null,
		  start      : null,
		  end        : null,
		  grupo		 : 0,
		  description: null
  };
  // Se o agendamento será repetido semanalmente
  $scope.repetirSemanalmente = null;
  
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
			  id         : null,
			  gCalendarId: null,
			  paciente	 : null,
			  title      : null,
			  start      : null,
			  end        : null,
			  grupo      : 0,
			  description: null
	  };	  
	  $scope.indexPacienteSelecionado = null;
	  $scope.repetirSemanalmente      = null;
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
app.controller('ModalInstanceCtrl', function ($uibModalInstance, $http) {
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
			var params = angular.element('#AgendaCtrl').scope().agendamento;				
			$http.post('http://localhost:8080/salvarAgendamento', params).then(
				successCallback = function(response) {																					
					angular.element('#AgendaCtrl').scope().agendamento = response.data;
					angular.element('#AgendaCtrl').scope().agendamento.title = 
						angular.element('#AgendaCtrl').scope().updateTitle(angular.element('#AgendaCtrl').scope().agendamento);
					
					angular.element('#AgendaCtrl').scope().repetirSemanalmente = true; // RETIRAR APÓS TRATAMENTO ADEQUADO
					if (angular.element('#AgendaCtrl').scope().repetirSemanalmente) {						
						view = $('#calendar').fullCalendar('getView');
						angular.element('#AgendaCtrl').scope().repetirAgendamento(view.start, view.end, angular.element('#AgendaCtrl').scope().agendamento);
					} else {
						$('#calendar').fullCalendar('renderEvent',angular.element('#AgendaCtrl').scope().agendamento);
					}
				},
			    errorCallback = function (error, status){					
					angular.element('#AgendaCtrl').scope().tratarExcecao(error); 					
				}
			);									
		}
												
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