angular.module('syspsi').controller('homeCtrl', ['cadastroFactory', function(cadastroFactory) {
	var ctrl = this;
	
	ctrl.resetarPaciente = function() {		
		cadastroFactory.setPaciente({});
	}
}]);