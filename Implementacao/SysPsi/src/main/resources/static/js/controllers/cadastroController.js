// Modulos desta controller
var lazyModules = ['ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroCtrl', function ($uibModal, $scope, $http, configAPI, convenioAPI, pacienteAPI) {
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
	
	/**
	 * Abre janela modal de sucesso
	 */	
	$ctrl.openOkModal = function (size) {	 	
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/okModal.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: '$ctrl',
			scope: $scope, // bind $scope to modal window      
			size: size
		});    	
	};
		  
	$scope.paciente = {};
	
	$scope.loading = false;
	
	// 0 - Pacientes Ativos
	// 1 - Pacientes Inativos
	// 2 - Todos
	$scope.pesquisa = {};
	$scope.pesquisa.tipoPesquisa = 0;
	
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
		$scope.loading = true;
		
		var cep = strCep.replace(/[^0-9]/g,'');
		$http.get("https://viacep.com.br/ws/" + cep + "/json/").then(
				successCallback = function(response) {
					$scope.paciente.logradouro = response.data.logradouro;
					$scope.paciente.bairro = response.data.bairro;
					$scope.paciente.localidade = response.data.localidade;
					$scope.paciente.uf = response.data.uf;
					$scope.loading = false;					
				},
			  	errorCallback = function (error, status){
					$scope.paciente.logradouro = "";
					$scope.paciente.bairro = "";
					$scope.paciente.localidade = "";
					$scope.paciente.uf = "";
					$scope.loading = false;
			  	}		
		);						
	};
	
	$scope.salvarPaciente = function(paciente) {		
		pacienteAPI.salvarPaciente(paciente).then(
				successCallback = function(response) {
					$scope.paciente = {};
					$scope.msgOk = "Paciente cadastrado com sucesso!";
					$scope.cadastroClienteForm.$setPristine();
					$ctrl.openOkModal();
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
		/*
		try {
			// captura de excecao enviada pela Controller (codigo java)
			$scope.msgErro = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			$scope.msgErro = error;
		}
		*/	
		$scope.msgErro = error.data.message;
		console.log($scope.msgErro);		
		$ctrl.openErroModal();
	};    
	
	carregarConveniosAtivos();
});