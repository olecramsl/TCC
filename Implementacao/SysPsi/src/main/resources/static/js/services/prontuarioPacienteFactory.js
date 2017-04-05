angular.module('syspsi').factory('prontuarioPacienteFactory', ['$http', 'config', function($http, config) {	
	var _id;
	var _paciente;
	var _agendamento;
	var _conteudo;
	var _inicio;
	var _fim;
	
	var _salvarProntuarioPaciente = function(prontuario) {
		return $http.post(config.baseUrl + '/salvarProntuarioPaciente', angular.copy(prontuario));
	};	
	
	var _getProntuarioByIdAgendamento = function(idAgendamento) {
		var params = {idAgendamento: idAgendamento};
		return $http.get(config.baseUrl + '/getProntuarioByIdAgendamento', {params});
	}; 
	
	return {
		getId: function() { return _id; },
		setId: function(id) { _id = id; },	
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; },
		getAgendamento: function() { return _agendamento; },
		setAgendamento: function(agendamento) { _agendamento = agendamento; },
		getConteudo: function() { return _conteudo; },
		setConteudo: function(conteudo) { _conteudo = conteudo; },
		getInicio: function() { return _inicio; },
		setInicio: function(inicio) { _inicio = inicio; },
		getFim: function() { return _fim; },
		setFim: function(fim) { _fim = fim; },
		salvarProntuarioPaciente: _salvarProntuarioPaciente,
		getProntuarioByIdAgendamento: _getProntuarioByIdAgendamento
	};	
}]);