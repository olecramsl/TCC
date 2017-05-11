angular.module('syspsi').service('utilService', ['$mdDialog', function($mdDialog) {
	/**
	 * Trata eventuais excessoes que possam ocorrer
	*/
	var _tratarExcecao = function(error) {	
		try {
			// captura de excecao enviada pela Controller (codigo java)
			msg = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			msg = error;
		}
		
		$mdDialog.show(
			$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Algo saiu errado ...')
				.textContent(msg)
				.ariaLabel('Alerta')
				.ok('Ok')						
		);	
	}  
	
	return {
		tratarExcecao: _tratarExcecao
	}
}]);