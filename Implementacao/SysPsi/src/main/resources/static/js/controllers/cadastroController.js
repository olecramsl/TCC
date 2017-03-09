angular.module('syspsi').controller('CadastroCtrl', function ($scope, $http, configAPI, convenioAPI, pacienteAPI) {
	var $ctrl = this;
	
	/**
	 * Abre janela modal de erro
	 */
	/*
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
	*/
	  
	$scope.paciente = {};
	
	var carregarConveniosAtivos = function() {
		convenioAPI.listarConveniosAtivos().then(
				successCallback = function(response) {	  
					$scope.lstConveniosAtivos = response.data;					
				},
				errorCallback = function (error, status){					
					//$scope.tratarExcecao(error); 
				}
		);
	};
	
	$scope.buscarCep = function(strCep) {
		var cep = strCep.replace(/[^0-9]/g,'');		
		
		$http.get("https://viacep.com.br/ws/" + cep + "/json/").then(
				successCallback = function(response) {
					$scope.paciente.logradouro = response.data.logradouro;
					$scope.paciente.bairro = response.data.bairro;
					$scope.paciente.localidade = response.data.localidade;
					$scope.paciente.uf = response.data.uf;					
				},
			  	errorCallback = function (error, status){
					//$scope.tratarExcecao(error); 
			  	}
		);
	};
	
	$scope.salvarPaciente = function(paciente) {
		paciente = formatarDados(paciente);
		paciente.ativo = true;
		pacienteAPI.salvarPaciente(paciente).then(
				successCallback = function(response) {	  					
				},
				errorCallback = function (error, status){
					console.log(error);
					//$scope.tratarExcecao(error); 
				}
		);
	};
	
	var formatarDados = function(paciente) {		
		var arrDataNascimento = paciente.dataNascimento.split("/");
		paciente.dataNascimento = new Date(arrDataNascimento[2], arrDataNascimento[1], arrDataNascimento[0]);		
		paciente.cpf = paciente.cpf.replace(/[^0-9]/g,'');
		paciente.telefoneContato = paciente.telefoneContato.replace(/[^0-9]/g,'');
		paciente.cep = paciente.cep.replace(/[^0-9]/g,'');
		return paciente;
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
			
		$ctrl.openErroModal();
	};    
	
	carregarConveniosAtivos();
});