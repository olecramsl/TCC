angular.module('syspsi').factory('consultaPacienteFactory', ['$http', 'config', function($http, config) {	
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
		getId: function() { return _id; },
		setId: function(id) { _id = id; },			
		getAgendamento: function() { return _agendamento; },
		setAgendamento: function(agendamento) { _agendamento = agendamento; },
		getProntuario: function() { return _prontuario; },
		setProntuario: function(prontuario) { _prontuario = prontuario; },
		getValor: function() { return _valor; },
		setValor: function(valor) { _valor = valor; },
		getRecibo: function() { return _recibo; },
		setRecibo: function(recibo) { _recibo = recibo; },
		getInicio: function() { return _inicio; },
		setInicio: function(inicio) { _inicio = inicio; },
		getFim: function() { return _fim; },
		setFim: function(fim) { _fim = fim; },
		salvarConsultaPaciente: _salvarConsultaPaciente,
		getConsultaByIdAgendamento: _getConsultaByIdAgendamento,
		getConteudoProntuarioMudou: function() { return _conteudoProntuarioMudou; },
		setConteudoProntuarioMudou: function(conteudoProntuarioMudou) { _conteudoProntuarioMudou = conteudoProntuarioMudou; },
		getPaciente: function() { return _paciente; },
		setPaciente: function(paciente) { _paciente = paciente; }
	};	
}]);