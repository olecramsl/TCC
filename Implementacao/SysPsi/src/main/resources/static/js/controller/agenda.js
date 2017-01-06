var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal, $http) {
  var $ctrl = this;          
  
  /**
   * Popula o calendario com os agendamentos do BD
   */ 
  $http.get('http://localhost:8080/agendamentos/').then(function(response) {	  
	  $scope.lstAgendamentos = response.data;
	  	  
	  // Adiciona os agendamentos no calendario
	  angular.forEach($scope.lstAgendamentos, function(value, key) {
          $('#calendar').fullCalendar('renderEvent',value, true); // stick? = true
	  });
  });   
  
  $scope.agendamento = {
		  id         : null,
		  gCalendarId: null,
		  user		 : null,
		  title      : null,
		  start      : null,
		  end        : null,
		  description: null
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
  };  
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
app.controller('ModalInstanceCtrl', function ($uibModalInstance) {
	var $ctrl = this;		
			
	/**
	 * Cancela a operação na janela modal
	 */
	$ctrl.cancelar = function () {
		$ctrl.clearData();
		$uibModalInstance.dismiss('cancel');
	};
	
	/**
	 * Salva/atualiza as informações de um agendamento
	 */
	$ctrl.salvar = function () {
		if (angular.element('#AgendaCtrl').scope().agendamento.id) {									
			var event = $('#calendar').fullCalendar('clientEvents',angular.element('#AgendaCtrl').scope().agendamento.id);
			if (event) {
				$ctrl.setTitle();				
				event[0].title       = angular.element('#AgendaCtrl').scope().agendamento.title;
				event[0].user        = angular.element('#AgendaCtrl').scope().agendamento.user;
				event[0].description = angular.element('#AgendaCtrl').scope().agendamento.description;							
				$('#calendar').fullCalendar('updateEvent',event[0]);				
				$ctrl.updateLstAgendamentos(event[0]);
			}
		} else if (angular.element('#AgendaCtrl').scope().agendamento.user) {			
			angular.element('#AgendaCtrl').scope().agendamento.id = 3; // REMOVER APOS TRATAMENTO ADEQUADO							
						
			$ctrl.setTitle();
			
			$('#calendar').fullCalendar('renderEvent',angular.element('#AgendaCtrl').scope().agendamento, true); // stick? = true
			
			// adiciona agendamento na lista 
			angular.element('#AgendaCtrl').scope().lstAgendamentos.push({
				id         : angular.element('#AgendaCtrl').scope().agendamento.id,
				gCalendarId: angular.element('#AgendaCtrl').scope().agendamento.gCalendarId,
				user       : angular.element('#AgendaCtrl').scope().agendamento.user,
				title      : angular.element('#AgendaCtrl').scope().agendamento.description ?
						     angular.element('#AgendaCtrl').scope().agendamento.user  + " (" + 
						     angular.element('#AgendaCtrl').scope().agendamento.description + ")" :
						     angular.element('#AgendaCtrl').scope().agendamento.user,
				start      : angular.element('#AgendaCtrl').scope().agendamento.start,
				end        : angular.element('#AgendaCtrl').scope().agendamento.end,
				description: angular.element('#AgendaCtrl').scope().agendamento.description
			});
		}
		$('#calendar').fullCalendar('unselect');			
								
		$ctrl.clearData();
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
			$ctrl.clearData();
		}
	}
	
	/**
	 * Atualiza o título do agendamento
	 */
	$ctrl.setTitle = function () {
		angular.element('#AgendaCtrl').scope().agendamento.title = 
			angular.element('#AgendaCtrl').scope().agendamento.description ?
			angular.element('#AgendaCtrl').scope().agendamento.user + " (" +
			angular.element('#AgendaCtrl').scope().agendamento.description + ")" :
			angular.element('#AgendaCtrl').scope().agendamento.user;
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
	
	/**
	 * Limpa os dados do agendamento
	 */
	$ctrl.clearData = function () {				
		angular.element('#AgendaCtrl').scope().agendamento.id          = null;
		angular.element('#AgendaCtrl').scope().agendamento.gCalendarId = null;
		angular.element('#AgendaCtrl').scope().agendamento.user        = null;
		angular.element('#AgendaCtrl').scope().agendamento.title       = null;
		angular.element('#AgendaCtrl').scope().agendamento.start       = null;
		angular.element('#AgendaCtrl').scope().agendamento.end         = null;
		angular.element('#AgendaCtrl').scope().agendamento.description = null;
	};
});