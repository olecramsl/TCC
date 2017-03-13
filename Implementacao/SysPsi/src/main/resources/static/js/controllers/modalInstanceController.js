angular.module('syspsi').controller('ModalInstanceCtrl', function ($uibModalInstance, $scope) {
	/**
	 * Cancela a operação na janela modal
	 */
	$scope.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};
});