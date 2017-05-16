angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', function ($scope, $mdDialog, 
		consultaPacienteFactory) {	
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.finalizarConsulta = function(valor) {		
		if ($scope.valor && $scope.valor > 0) {
			consultaPacienteFactory.setValor($scope.valor);
			consultaPacienteFactory.setRecibo(!!$scope.recibo);
		} else {
			consultaPacienteFactory.setValor(null);
			consultaPacienteFactory.setRecibo(null);
		}
		$mdDialog.hide();		
	};
	
	$scope.cadastrarDespesa = function(despesa) {
		console.log(despesa);
	};
}]);