var app = angular.module('syspsi', ['ui.bootstrap']);

app.controller('AgendaCtrl', function ($scope, $uibModal) {
  var $ctrl = this;          
  
  $scope.agendamento = {
		  id         : null,
		  titulo     : null,
		  inicio     : null,
		  fim        : null,
		  observacoes: null
  };
  
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
	      templateUrl: 'novoEventoModal.html',
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
		if (angular.element('#AgendaCtrl').scope().agendamento.titulo) {
			var eventData;
	
			eventData = {
					title : angular.element('#AgendaCtrl').scope().agendamento.titulo,
					start : angular.element('#AgendaCtrl').scope().agendamento.inicio,
					end   : angular.element('#AgendaCtrl').scope().agendamento.fim
			};	
	
			$('#calendar').fullCalendar('renderEvent',eventData, true); // stick? = true
		}
		$('#calendar').fullCalendar('unselect');
	
		$uibModalInstance.close();
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});