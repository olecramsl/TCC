angular.module('syspsi').factory('pacienteFactory', ['$http', 'config', function($http, config) {
	var _listarPacientesAtivosInativos = function(ativo) {		
		var params = {ativo: ativo};
		return $http.get(config.BASE_URL + '/listarPacientesAtivosInativos', {params});
	};
	
	var _listarPacientes = function() {				
		return $http.get(config.BASE_URL + '/listarPacientes');
	};		
	
	return {
		listarPacientesAtivosInativos: _listarPacientesAtivosInativos,
		listarPacientes: _listarPacientes
	};
}]);