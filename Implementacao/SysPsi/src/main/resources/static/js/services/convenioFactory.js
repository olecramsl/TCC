angular.module('syspsi').factory('convenioFactory', ['$http', 'consts', function($http, consts) {	
	var _lstConveniosAtivos = null;
	
	var _listarConveniosAtivos = function() {	
		return $http.get(consts.BASE_URL + '/listarConveniosAtivos');
	}
	
	var _listarConveniosInativos = function() {		
		return $http.get(consts.BASE_URL + '/listarConveniosInativos');
	}
	
	var _listarConvenios = function() {		
		return $http.get(consts.BASE_URL + '/listarConvenios');
	}
	
	var _atualizarConvenio = function(convenio) {
		return $http.post(consts.BASE_URL + '/atualizarConvenio', convenio);
	};
	
	var _excluirConvenio = function(convenio) {
		return $http.post(consts.BASE_URL + '/excluirConvenio', convenio);
	};
	
	return {
		getLstConveniosAtivos: function() { return _lstConveniosAtivos; },
		setLstConveniosAtivos: function(lstConveniosAtivos) { _lstConveniosAtivos = lstConveniosAtivos; },
		listarConveniosAtivos: _listarConveniosAtivos,
		listarConveniosInativos: _listarConveniosInativos,
		listarConvenios: _listarConvenios,
		atualizarConvenio: _atualizarConvenio,
		excluirConvenio: _excluirConvenio
	};
}]);