angular.module('syspsi').factory('cadastroPacienteFactory', ['$http', 'config', function($http, config) {
	var _paciente;
	var _editandoPaciente;
	
	var _salvarPaciente = function(paciente) {	
		var novoPaciente = angular.copy(paciente);
		var arrDataNascimento = novoPaciente.dataNascimento.split("/");
		novoPaciente.dataNascimento = new Date(arrDataNascimento[2], arrDataNascimento[1], arrDataNascimento[0]);		
		novoPaciente.cpf = novoPaciente.cpf.replace(/[^0-9]/g,'');
		novoPaciente.telefoneContato = novoPaciente.telefoneContato.replace(/[^0-9]/g,'');
		novoPaciente.cep = novoPaciente.cep.replace(/[^0-9]/g,'');
		novoPaciente.ativo = true;
		return $http.post(config.baseUrl + '/salvarPaciente', novoPaciente);
	};
	
	var _excluirPaciente = function(paciente) {
		return $http.post(config.baseUrl + '/excluirPaciente', paciente);
	};
	
	var _atualizarPaciente = function(paciente) {
		return $http.post(config.baseUrl + '/atualizarPaciente', paciente);
	};
	
	return {
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; },
		isEditandoPaciente: function() { return _editandoPaciente; },
		setEditandoPaciente: function(editandoPaciente) { _editandoPaciente = editandoPaciente; },
		salvarPaciente: _salvarPaciente,
		excluirPaciente: _excluirPaciente,
		atualizarPaciente: _atualizarPaciente
	};
}]);