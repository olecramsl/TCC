// Modulos desta controller
var lazyModules = ['ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroCtrl', function ($uibModal, $uibModalStack, $scope, $http, configAPI, convenioAPI, pacienteAPI) {
	var $ctrl = this;
	
	/**
	 * Abre janela modal de erro
	 */	
	$ctrl.openErroModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/erroModal.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: '$ctrl',
			scope: $scope, // bind $scope to modal window      
			size: size
		});    	
	};
	
	$ctrl.openPleaseWaitDialog = function (size) {	 	
		var pleaseWaitDialog = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/pleaseWaitDialog.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: '$ctrl',
			scope: $scope, // bind $scope to modal window      
			size: size
		});    	
	};	
	  
	$scope.paciente = {};
	
	var carregarConveniosAtivos = function() {
		convenioAPI.listarConveniosAtivos().then(
				successCallback = function(response) {	  
					$scope.lstConveniosAtivos = response.data;					
				},
				errorCallback = function (error, status){					
					$scope.tratarExcecao(error); 
				}
		);
	};
	
	$scope.buscarCep = function(strCep) {
		var cep = strCep.replace(/[^0-9]/g,'');		
		$ctrl.openPleaseWaitDialog();
		$http.get("https://viacep.com.br/ws/" + cep + "/json/").then(
				successCallback = function(response) {
					$scope.paciente.logradouro = response.data.logradouro;
					$scope.paciente.bairro = response.data.bairro;
					$scope.paciente.localidade = response.data.localidade;
					$scope.paciente.uf = response.data.uf;					
				},
			  	errorCallback = function (error, status){
					$scope.paciente.logradouro = "";
					$scope.paciente.bairro = "";
					$scope.paciente.localidade = "";
					$scope.paciente.uf = "";						
			  	}		
		);		
		console.log($uibModalStack.getTop());
	};
	
	$scope.salvarPaciente = function(paciente) {		
		pacienteAPI.salvarPaciente(paciente).then(
				successCallback = function(response) {
					$scope.paciente = {};
				},
				errorCallback = function (error, status){					
					$scope.tratarExcecao(error); 
				}
		);
	};
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	$scope.tratarExcecao = function(error) {
		try {
			// captura de excecao enviada pela Controller (codigo java)
			$scope.msgErro = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			$scope.msgErro = error;
		}
			
		console.log($scope.msgErro);
		$ctrl.openErroModal();
	};    
	
	carregarConveniosAtivos();
});