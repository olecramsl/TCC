var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal, $http) {
  var $ctrl = this;          
    
  $scope.agendamento = {
		  id         : null,
		  titulo     : null,
		  inicio     : null,
		  fim        : null,
		  observacoes: null
  };  
  
  $http.get('http://localhost:8080/agendamentos/').then(function(response) {	  
	  $scope.lstAgendamentos = response.data;
	  
	  var eventData;	  
	  angular.forEach($scope.lstAgendamentos, function(value, key) {		  		  	  		  		
		  eventData = {
				  id    : value.id,				  		  
			      title : value.titulo,
			      start : value.inicio,
			      end   : value.fim
	      };	
	
          $('#calendar').fullCalendar('renderEvent',eventData, true); // stick? = true
	  });
  });    
  
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
  
  $ctrl.openNewEventModal = function (size) {	  
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
			
	$ctrl.ok = function () {						
		$uibModalInstance.close();
	};

	$ctrl.cancelar = function () {
		$ctrl.clearData();
		$uibModalInstance.dismiss('cancel');
	};
	
	$ctrl.salvar = function () {
		if (angular.element('#AgendaCtrl').scope().agendamento.titulo) {
			var eventData;
	
			angular.element('#AgendaCtrl').scope().agendamento.id = 3; // REMOVER APOS TRATAMENTO ADEQUADO
			eventData = {
					id    : angular.element('#AgendaCtrl').scope().agendamento.id,			
					title : angular.element('#AgendaCtrl').scope().agendamento.observacoes ? 
							angular.element('#AgendaCtrl').scope().agendamento.titulo 
							+ " (" + angular.element('#AgendaCtrl').scope().agendamento.observacoes + ")" : 
							angular.element('#AgendaCtrl').scope().agendamento.titulo,	
					start : angular.element('#AgendaCtrl').scope().agendamento.inicio,
					end   : angular.element('#AgendaCtrl').scope().agendamento.fim
			};	
	
			$('#calendar').fullCalendar('renderEvent',eventData, true); // stick? = true
		}
		$('#calendar').fullCalendar('unselect');			
						
		// adiciona agendamento na lista
		angular.element('#AgendaCtrl').scope().lstAgendamentos.push({
			id: angular.element('#AgendaCtrl').scope().agendamento.id,
			titulo: angular.element('#AgendaCtrl').scope().agendamento.titulo,
			inicio: angular.element('#AgendaCtrl').scope().agendamento.inicio,
			fim: angular.element('#AgendaCtrl').scope().agendamento.fim,
			observacoes: angular.element('#AgendaCtrl').scope().agendamento.observacoes
		});
		
		$ctrl.clearData();
		$uibModalInstance.close();
	}
	
	/**
	 * Limpa os dados do agendamento
	 */
	$ctrl.clearData = function () {
		angular.element('#AgendaCtrl').scope().agendamento.id          = null;
		angular.element('#AgendaCtrl').scope().agendamento.titulo      = null;
		angular.element('#AgendaCtrl').scope().agendamento.inicio      = null;
		angular.element('#AgendaCtrl').scope().agendamento.fim         = null;
		angular.element('#AgendaCtrl').scope().agendamento.observacoes = null;
	};
});