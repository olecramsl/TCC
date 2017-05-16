angular.module('syspsi').controller('FinanceiroCtrl',['$mdDialog', function($mdDialog) {
	var ctrl = this;
	
	ctrl.cadastrarDespesa  = function() {
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/cadastrar_despesa_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {
			console.log("OK");
		}, function() {});
	};
}]);