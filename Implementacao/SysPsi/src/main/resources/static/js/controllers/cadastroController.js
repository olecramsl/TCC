// Modulos desta controller
var lazyModules = ['ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroCtrl', ['$uibModal', '$scope', '$http', 'convenioFactory', 'pacienteFactory', 
	'modalInstanceFactory',	'modalInstanceService', function ($uibModal, $scope, $http, convenioFactory, pacienteFactory, modalInstanceFactory,
			modalInstanceService) {
	
	var ctrl = this;		
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	var tratarExcecao = function(error) {
		try {
			// captura de excecao enviada pela Controller (codigo java)
			modalInstanceFactory.setMsgErro(error.data.message);
		} catch(erro) {
			// Erro nivel Javascript
			modalInstanceFactory.setMsgErro(error.data.message);
		}				
		modalInstanceService.openErroModal();
	};
		  
	// Busca CEP
	ctrl.loading = false;
	
	var carregarConveniosAtivos = function() {
		convenioFactory.listarConveniosAtivos().then(
				successCallback = function(response) {	  
					ctrl.lstConveniosAtivos = response.data;					
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);
	};
	
	ctrl.buscarCep = function(strCep) {
		ctrl.loading = true;
		
		var cep = strCep.replace(/[^0-9]/g,'');
		$http.get("https://viacep.com.br/ws/" + cep + "/json/").then(
				successCallback = function(response) {
					ctrl.paciente.logradouro = response.data.logradouro;
					ctrl.paciente.numero = "";
					ctrl.paciente.bairro = response.data.bairro;
					ctrl.paciente.localidade = response.data.localidade;
					ctrl.paciente.uf = response.data.uf;
					ctrl.loading = false;					
				},
			  	errorCallback = function (error, status){
					ctrl.paciente.logradouro = "";
					ctrl.paciente.numero = "";
					ctrl.paciente.bairro = "";
					ctrl.paciente.localidade = "";
					ctrl.paciente.uf = "";
					ctrl.loading = false;
			  	}		
		);						
	};
	
	ctrl.salvarPaciente = function(paciente) {				
		pacienteFactory.salvarPaciente(paciente).then(
				successCallback = function(response) {		
					ctrl.paciente = {};
					$scope.cadastroClienteForm.$setPristine();					
					modalInstanceFactory.setMsgOk("Paciente cadastrado com sucesso!");
					modalInstanceService.openOkModal();
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);
	};	   
	
	carregarConveniosAtivos();
}]);