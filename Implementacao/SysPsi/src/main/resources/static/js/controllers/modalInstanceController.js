angular.module('syspsi').controller('ModalInstanceCtrl', ['$uibModalInstance', 'modalInstanceFactory', function ($uibModalInstance, 
		modalInstanceFactory) {
	var ctrl = this;
	
	ctrl.msgErro = modalInstanceFactory.getMsgErro();
	ctrl.msgOk = modalInstanceFactory.getMsgOk();
	ctrl.msgConfirmacao = modalInstanceFactory.getMsgConfirmcao();
	ctrl.selecao = modalInstanceFactory.getSelecao();
	
	ctrl.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};		
	
	ctrl.confirmacao = function () {
		modalInstanceFactory.setSelecao(true);
	};
	
	ctrl.naoConfirmacao = function () {
		modalInstanceFactory.setSelecao(false);
	};
}]);