angular.module('syspsi').service('modalAgendamentoService', ['$uibModal', 'agendamentoFactory', function($uibModal, agendamentoFactory) {
	/**
	 * Abre janela modal de erro
	 */	
	this.openConfirmModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
		    ariaLabelledBy: 'modal-title',
		    ariaDescribedBy: 'modal-body',
		    templateUrl: 'templates/confirmacao_agendamento_modal.html',
		    controller: 'ModalAgendamentoCtrl',
		    controllerAs: 'ctrl',      
		    size: size
		});    
	};
	
	/**
	 * Abre janela modal do agendamento
	 */	
	this.openEventModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
		    ariaLabelledBy: 'modal-title',
		    ariaDescribedBy: 'modal-body',
		    templateUrl: 'templates/evento_modal.html',
		    controller: 'ModalAgendamentoCtrl',
		    controllerAs: 'ctrl',      
		    size: size
		});
	    
		modalInstance.result.then(function (selectedItem) {}, function () {        	
			agendamentoFactory.setAgendamento({});
			agendamentoFactory.setIndexPacienteSelecionado(null);
		});
	};
}]);