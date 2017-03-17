angular.module('syspsi').factory('pacienteFactory', ['$http', 'config', function($http, config) {
	var _listarPacientesAtivos = function() {
		return $http.get(config.baseUrl + '/listarPacientesAtivos');
	};
	
	var _salvarPaciente = function(paciente) {	
		var novoPaciente = angular.copy(paciente);
		var arrDataNascimento = novoPaciente.dataNascimento.split("/");
		novoPaciente.dataNascimento = new Date(arrDataNascimento[2], arrDataNascimento[1], arrDataNascimento[0]);		
		novoPaciente.cpf = novoPaciente.cpf.replace(/[^0-9]/g,'');
		novoPaciente.telefoneContato = novoPaciente.telefoneContato.replace(/[^0-9]/g,'');
		novoPaciente.cep = novoPaciente.cep.replace(/[^0-9]/g,'');
		return $http.post(config.baseUrl + '/salvarPaciente', novoPaciente);
	};
	
	return {
		listarPacientesAtivos: _listarPacientesAtivos,
		salvarPaciente: _salvarPaciente
	};
}]);