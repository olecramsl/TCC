angular.module('syspsi').factory('pacienteAPI', function($http, config) {
	var _listarPacientesAtivos = function() {
		return $http.get(config.baseUrl + '/listarPacientesAtivos');
	};
	
	return {
		listarPacientesAtivos: _listarPacientesAtivos
	};
});