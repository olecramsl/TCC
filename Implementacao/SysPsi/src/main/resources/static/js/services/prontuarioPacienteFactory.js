angular.module('syspsi').factory('prontuarioPacienteFactory', ['$http', 'config', function($http, config) {
	var _id;
	var _paciente;
	var _inicio;
	var _fim;
	
	var _salvarProntuarioPaciente = function(prontuario) {
		return $http.post(config.baseUrl + '/salvarProntuarioPaciente', angular.copy(prontuario));
	};	
	
	return {
		getId: function() { return _id; },
		setId: function(id) { _id = id; },	
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; },
		getInicio: function() { return _inicio; },
		setInicio: function(inicio) { _inicio = inicio; },
		getFim: function() { return _fim; },
		setFim: function(fim) { _fim = fim; },
		salvarProntuarioPaciente: _salvarProntuarioPaciente
	};
}]);