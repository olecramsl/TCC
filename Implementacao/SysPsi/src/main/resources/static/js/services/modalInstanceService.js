angular.module('syspsi').service('modalInstanceService', ['$uibModal', function($uibModal) {	
	this.openErroModal = function (size) {	 	
		  var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'templates/erro_modal.html',		      
		      controller: 'ModalInstanceCtrl',
		      controllerAs: 'ctrl',      
		      size: size
		  });    
	};
	
	this.openOkModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/ok_modal.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: 'ctrl',			      
			size: size
		});    	
	};
	
	this.openConfirmacaoModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/confirmacao_modal.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: 'ctrl',			      
			size: size
		});    	
	};
}]);