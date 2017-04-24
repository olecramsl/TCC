angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', function ($scope, $mdDialog, 
		consultaPacienteFactory) {	
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.answer = function(answer) {		
		$mdDialog.hide(answer);		
	};
}]);