angular.module('syspsi').factory('cadastroPacienteFactory', ['$http', 'config', function($http, config) {
	var _paciente;
	var _editandoPaciente;
	
	var _listarGruposPacientes = function() {
		return $http.get(config.BASE_URL + '/listarGruposPacientes');
	};
	
	var _salvarPaciente = function(paciente) {	
		var novoPaciente = angular.copy(paciente);
		
		if (novoPaciente.cpf) {
			novoPaciente.cpf = novoPaciente.cpf.replace(/[^0-9]/g,'');
		}
		
		if (novoPaciente.telefoneContato) {
			novoPaciente.telefoneContato = novoPaciente.telefoneContato.replace(/[^0-9]/g,'');
		}
		
		if (novoPaciente.cep) { 
			novoPaciente.cep = novoPaciente.cep.replace(/[^0-9]/g,'');
		}
		
		if (novoPaciente.cpfResponsavel) {
			novoPaciente.cpfResponsavel = novoPaciente.cpfResponsavel.replace(/[^0-9]/g,'');
		}
		
		if (novoPaciente.telefoneContatoResponsavel) {
			novoPaciente.telefoneContatoResponsavel = novoPaciente.telefoneContatoResponsavel.replace(/[^0-9]/g,'');
		}
		
		novoPaciente.ativo = true;
		return $http.post(config.BASE_URL + '/salvarPaciente', novoPaciente);
	};
	
	var _excluirPaciente = function(paciente) {
		return $http.post(config.BASE_URL + '/excluirPaciente', paciente);
	};
	
	var _atualizarPaciente = function(paciente) {
		return $http.post(config.BASE_URL + '/atualizarPaciente', paciente);
	};
	
	return {
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; },
		isEditandoPaciente: function() { return _editandoPaciente; },
		setEditandoPaciente: function(editandoPaciente) { _editandoPaciente = editandoPaciente; },
		listarGruposPacientes: _listarGruposPacientes,
		salvarPaciente: _salvarPaciente,
		excluirPaciente: _excluirPaciente,
		atualizarPaciente: _atualizarPaciente
	};
}]);