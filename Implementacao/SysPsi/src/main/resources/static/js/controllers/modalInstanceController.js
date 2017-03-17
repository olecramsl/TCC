angular.module('syspsi').controller('ModalInstanceCtrl', ['$uibModalInstance', 'modalInstanceFactory', function ($uibModalInstance, 
		modalInstanceFactory) {
	var ctrl = this;
	
	ctrl.msgErro = modalInstanceFactory.getMsgErro();
	ctrl.msgOk = modalInstanceFactory.getMsgOk();
	
	ctrl.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};		
}]);