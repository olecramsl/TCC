angular.module('syspsi').factory('pacienteAPI', function($http, config) {
	var _listarPacientesAtivos = function() {
		return $http.get(config.baseUrl + '/listarPacientesAtivos');
	};
	
	var _salvarPaciente = function(paciente) {
		return $http.post(config.baseUrl + '/salvarPaciente', angular.copy(paciente));
	};
	
	return {
		listarPacientesAtivos: _listarPacientesAtivos,
		salvarPaciente: _salvarPaciente
	};
});