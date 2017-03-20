angular.module('syspsi').factory('pacienteFactory', ['$http', 'config', function($http, config) {
	var _listarPacientesAtivosInativos = function(ativo) {		
		var params = {ativo: ativo};
		return $http.get(config.baseUrl + '/listarPacientesAtivosInativos', {params});
	};
	
	var _listarPacientes = function() {				
		return $http.get(config.baseUrl + '/listarPacientes');
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
		listarPacientesAtivosInativos: _listarPacientesAtivosInativos,
		listarPacientes: _listarPacientes,
		salvarPaciente: _salvarPaciente
	};
}]);