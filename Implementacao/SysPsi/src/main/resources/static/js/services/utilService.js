angular.module('syspsi').service('utilService', ['$rootScope', '$mdDialog', function($rootScope, 
		$mdDialog) {
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
	};  
	
	var _showWait = function() {
		/*
		$mdDialog.show({
			controller: 'WaitCtrl',
	        template: 'templates/waiting.html',
	        parent: angular.element(document.body),
	        clickOutsideToClose:false,
	        fullscreen: false
	    }).then(function(){});
	    */
		$mdDialog.show({
			controller: 'WaitCtrl',			
		    templateUrl: 'templates/waiting.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: false		    
		}).then(function() {			
		}, function() {});
	};
	
	var _hideWait = function() {
		$rootScope.$emit("hide_wait");
	};
	
	return {
		tratarExcecao: _tratarExcecao,
		hideWait: _hideWait,
	    showWait: _showWait
	}
}]);