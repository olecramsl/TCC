// Modulos desta controller
var lazyModules = ['ckeditor'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('ProntuarioPacienteCtrl', ['$scope', 'prontuarioPacienteFactory', 'modalInstanceFactory', 
	function ($scope, prontuarioPacienteFactory, modalInstanceFactory) {
	
	var ctrl = this;
	
	$scope.$watch(function () { return prontuarioPacienteFactory.getPaciente(); }, function (newValue, oldValue) {
		ctrl.paciente = newValue;		
	});
	
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
	
	// Editor options.
	ctrl.options = {
			language: 'pt-br',
			allowedContent: true,
			entities: false
	};

	// Called when the editor is completely ready.
	ctrl.onReady = function () {
		// ...
	};
	
	ctrl.salvar = function(conteudoProntuario) {
		var prontuario = {
				id: prontuarioPacienteFactory.getId(),
				paciente: prontuarioPacienteFactory.getPaciente(),
				conteudo: conteudoProntuario,
				inicio: prontuarioPacienteFactory.getInicio(),
				fim: new Date()
		}
		prontuarioPacienteFactory.salvarProntuarioPaciente(prontuario).then(
				successCallback = function(response) {		
					prontuarioPacienteFactory.setId(response.data.id)
					/*
					$scope.cadastroClienteForm.$setPristine();					
					modalInstanceFactory.setMsgOk("Paciente cadastrado com sucesso!");
					modalInstanceService.openOkModal();
					*/
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);	
	}
}]);