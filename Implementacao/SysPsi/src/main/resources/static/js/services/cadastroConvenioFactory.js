angular.module('syspsi').factory('cadastroConvenioFactory', ['$http', 'consts', function($http, consts) {
	var _convenio;
	var _editandoConvenio;
	
	var _salvarConvenio = function(convenio) {	
		var novoConvenio = angular.copy(convenio);
		
		if (novoConvenio.cnpj) {
			novoConvenio.cnpj = novoConvenio.cnpj.replace(/[^0-9]/g,'');
		}
		
		if (novoConvenio.telefoneContato) {
			novoConvenio.telefoneContato = novoConvenio.telefoneContato.replace(/[^0-9]/g,'');
		}
		
		if (novoConvenio.cep) { 
			novoConvenio.cep = novoConvenio.cep.replace(/[^0-9]/g,'');
		}
		
		novoConvenio.ativo = true;
		return $http.post(consts.BASE_URL + '/salvarConvenio', novoConvenio);
	};
	
	var _excluirConvenio = function(convenio) {
		return $http.post(consts.BASE_URL + '/excluirConvenio', convenio);
	};
	
	var _atualizarConvenio = function(convenio) {
		return $http.post(consts.BASE_URL + '/atualizarConvenio', convenio);
	};
	
	return {
		getConvenio: function() { return _convenio; },
		setConvenio: function(convenio) { _convenio = convenio; },
		isEditandoConvenio: function() { return _editandoConvenio; },
		setEditandoConvenio: function(editandoConvenio) { _editandoConvenio = editandoConvenio; },		
		salvarConvenio: _salvarConvenio,
		excluirConvenio: _excluirConvenio,
		atualizarConvenio: _atualizarConvenio
	};
}]);