var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal, $http) {
  var $ctrl = this;      
  
  /**
   * Popula o calendario com os agendamentos do BD
   */ 
  $http.get('http://localhost:8080/agendamentos').then(
      successCallback = function (response) {	  
  	      $scope.lstAgendamentos = response.data;
	  	  
  		  // Adiciona os agendamentos no calendario
  		  angular.forEach($scope.lstAgendamentos, function(value, key) {  			  
  			  $('#calendar').fullCalendar('renderEvent',value, true); // stick? = true
  		  })  		  
  	  },
	  errorCallback = function (error, status) {
		  // tratar erro
	  }
  );   
  
  /**
   * Popula a lista de pacientes ativos
   */
  $http.get('http://localhost:8080/listarPacientesAtivos').then(
      successCallback = function(response) {	  
    	  $scope.lstPacientesAtivos = response.data;
  	  },
  	  errorCallback = function (error, status){
  		// tratar erro
  	  }
  );
  
  $scope.agendamento = {
		  id         : null,
		  gCalendarId: null,
		  paciente	 : null,
		  title      : null,
		  start      : null,
		  end        : null,
		  description: null
  };
  
  // Lista de pacientes ativos cadastrados no sistema
  $scope.lstPacientesAtivos = null;
  
  // O index do paciente selecionado na agenda
  $scope.indexPacienteSelecionado = null;
    
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
			  description: null
	  };	  
	  $scope.indexPacienteSelecionado = null;
  };
  
  /**
   * Abre janela modal
   */
  $ctrl.openEventModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'eventoModal.html',
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
						$ctrl.setTitle();				
						event[0].title       = angular.element('#AgendaCtrl').scope().agendamento.title;
						event[0].paciente    = angular.element('#AgendaCtrl').scope().agendamento.paciente;
						event[0].description = angular.element('#AgendaCtrl').scope().agendamento.description;
						
						
						
						$('#calendar').fullCalendar('updateEvent',event[0]);				
						$ctrl.updateLstAgendamentos(event[0]);	
						angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
					}
				},
			    errorCallback = function (error, status){					
				    // tratar erro
					alert(error);
					angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
				}
			);			
		// Novo agendamento
		} else if (angular.element('#AgendaCtrl').scope().agendamento.paciente) {																		
			var params = angular.element('#AgendaCtrl').scope().agendamento;			
			$http.post('http://localhost:8080/salvarAgendamento', params).then(
				successCallback = function(response) {	  				    //					
					angular.element('#AgendaCtrl').scope().agendamento.id = response.data;
					
					$ctrl.setTitle();									
					
					$('#calendar').fullCalendar('renderEvent',angular.element('#AgendaCtrl').scope().agendamento, true); // stick? = true
					
					// adiciona agendamento na lista 			
					angular.element('#AgendaCtrl').scope().lstAgendamentos.push(
							angular.element('#AgendaCtrl').scope().agendamento);
					
					angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
				},
			    errorCallback = function (error, status){					
				    // tratar erro
					angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
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
		var event = $('#calendar').fullCalendar('clientEvents',angular.element('#AgendaCtrl').scope().agendamento.id);
		if (event) {
			$('#calendar').fullCalendar('removeEvent',event[0]);
			/*
			var index = angular.element('#AgendaCtrl').scope().lstAgendamentos.indexOf(event[0]);			
			angular.element('#AgendaCtrl').scope().lstAgendamentos.splice(index, 1);
			*/			
		}
	}
	
	/**
	 * Atualiza o título do agendamento
	 */
	$ctrl.setTitle = function (agendamento) {			
		angular.element('#AgendaCtrl').scope().agendamento.title = 
			angular.element('#AgendaCtrl').scope().agendamento.description ?
			angular.element('#AgendaCtrl').scope().agendamento.paciente.nomeExibicao + " (" +
			angular.element('#AgendaCtrl').scope().agendamento.description + ")" :
			angular.element('#AgendaCtrl').scope().agendamento.paciente.nomeExibicao;			
	};
	
	/**
	 * Atualiza a lista de agendamentos
	 */
	$ctrl.updateLstAgendamentos = function (event) {		
		// se garantirmos que lstAgendamentos estah ordenada, podemos fazer uma busca
		// binaria ao inves de linear				
		for (var i = 0; i < angular.element('#AgendaCtrl').scope().lstAgendamentos.length; i++) {				
			if (angular.element('#AgendaCtrl').scope().lstAgendamentos[i].id == event.id) {						
				angular.element('#AgendaCtrl').scope().lstAgendamentos[i] = event;					
				break;
			}
	    };	    	    	    
	};	
});