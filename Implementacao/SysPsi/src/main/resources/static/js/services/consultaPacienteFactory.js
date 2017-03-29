angular.module('syspsi').factory('prontuarioPacienteFactory', function() {
	var _paciente;
	
	return {
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; },
	};
});