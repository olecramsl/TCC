angular.module('syspsi').controller('PsicologoCtrl', ['psicologoFactory', function(psicologoFactory) {
	var ctrl = this;
	
	ctrl.gerarChave = function() {		
		psicologoFactory.gerarChave().then(
				successCalback = function(response) {
					console.log("Success!");
					console.log("Chave: " + response.data);
				},
				errorCallback = function(error) {
					console.log(error);
				}			
		);
	}
}]);