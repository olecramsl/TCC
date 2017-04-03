// Modulos desta controller
var lazyModules = ['ckeditor'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('ProntuarioPacienteCtrl', ['$scope', '$mdDialog', 'prontuarioPacienteFactory', function ($scope, 
		$mdDialog, prontuarioPacienteFactory) {
	
	var ctrl = this;
	
	$scope.$watch(function () { return prontuarioPacienteFactory.getPaciente(); }, function (newValue, oldValue) {
		ctrl.paciente = newValue;		
	});
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	var tratarExcecao = function(error) {
		var msg;
		try {
			// captura de excecao enviada pela Controller (codigo java)
			msg = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			msg = error.data.message;
		}
		
		$mdDialog.show(
			$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Algo saiu errado ...')
				.textContent(msg)
				.ariaLabel('Alerta')
				.ok('Ok')						
		);
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
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);	
	}
}]);