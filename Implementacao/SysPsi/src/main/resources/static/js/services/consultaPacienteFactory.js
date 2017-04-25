angular.module('syspsi').factory('consultaPacienteFactory', ['$http', 'config', function($http, config) {
	var _consulta = {};
	var _id;
	var _agendamento;
	var _prontuario;
	var _valor;
	var _recibo;
	var _inicio;
	var _fim;
	var _conteudoProntuarioMudou;
	var _paciente;
	
	var _salvarConsultaPaciente = function(consulta) {
		return $http.post(config.baseUrl + '/salvarConsultaPaciente', angular.copy(consulta));
	};	
	
	var _getConsultaByIdAgendamento = function(idAgendamento) {
		var params = {idAgendamento: idAgendamento};
		return $http.get(config.baseUrl + '/getConsultaByIdAgendamento', {params});
	}; 
	
	return {
		getConsulta: function() { return _consulta; },
		setConsulta: function(consulta) { _consulta = consulta; },
		getId: function() { return _consulta.id; },
		setId: function(id) { _consulta.id = id; },			
		getAgendamento: function() { return _consulta.agendamento; },
		setAgendamento: function(agendamento) { _consulta.agendamento = agendamento; },
		getProntuario: function() { return _consulta.prontuario; },
		setProntuario: function(prontuario) { _consulta.prontuario = prontuario; },
		getValor: function() { return _consulta.valor; },
		setValor: function(valor) { _consulta.valor = valor; },
		getRecibo: function() { return _consulta.recibo; },
		setRecibo: function(recibo) { _consulta.recibo = recibo; },
		getInicio: function() { return _consulta.inicio; },
		setInicio: function(inicio) { _consulta.inicio = inicio; },
		getFim: function() { return _consulta.fim; },
		setFim: function(fim) { _consulta.fim = fim; },
		salvarConsultaPaciente: _salvarConsultaPaciente,
		getConsultaByIdAgendamento: _getConsultaByIdAgendamento,
		getConteudoProntuarioMudou: function() { return _conteudoProntuarioMudou; },
		setConteudoProntuarioMudou: function(conteudoProntuarioMudou) { _conteudoProntuarioMudou = conteudoProntuarioMudou; },
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; }
	};	
}]);