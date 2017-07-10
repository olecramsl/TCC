angular.module('syspsi').factory('consultaPacienteFactory', ['$http', 'consts', function($http, consts) {
	var _agendamento;
	var _lstAgendamentosComConsulta;
	var _conteudoProntuarioMudou;
	
	var _salvarConsultaPaciente = function(agendamento) {
		return $http.post(consts.BASE_URL + '/salvarConsultaPaciente', angular.copy(agendamento));
	};	
	
	var _imprimirRelatorioProntuarios = function(dataInicial, dataFinal, paciente) {
		var inRelatorioDTO = {
				dataInicial: dataInicial,
				dataFinal: dataFinal,
				paciente: paciente
		}; 
		
		return $http.post(consts.BASE_URL + '/imprimirRelatorioProntuarios', inRelatorioDTO, {responseType:'arraybuffer'});
	};
	
	return {
		getAgendamento: function() { return _agendamento; },
		setAgendamento: function(agendamento) { _agendamento = agendamento; },
		getInicioAgendamento: function() { return _agendamento.start; },
		setInicioAgendamento: function(inicio) { _agendamento.start = inicio; },
		getFimAgendamento: function() { return _agendamento.end; },
		setFimAgendamento: function(fim) { _agendamento.end = fim; },
		getConsulta: function() { return _agendamento.consulta; },
		setConsulta: function(consulta) { _agendamento.consulta = consulta; },		
		getId: function() { return _agendamento.consulta.id; },
		setId: function(id) { _agendamento.consulta.id = id; },
		getPaciente: function() { return _agendamento.paciente; },
		setPaciente: function(paciente) { _agendamento.paciente = paciente; },
		getProntuario: function() { return _agendamento.consulta.prontuario; },
		setProntuario: function(prontuario) { _agendamento.consulta.prontuario = prontuario; },
		getValor: function() { return _agendamento.consulta.valor; },
		setValor: function(valor) { _agendamento.consulta.valor = valor; },
		getRecibo: function() { return _agendamento.consulta.recibo; },
		setRecibo: function(recibo) { _agendamento.consulta.recibo = recibo; },
		getInicio: function() { return _agendamento.consulta.inicio; },
		setInicio: function(inicio) { _agendamento.consulta.inicio = inicio; },
		getFim: function() { return _agendamento.consulta.fim; },
		setFim: function(fim) { _agendamento.consulta.fim = fim; },
		getLstAgendamentosComConsulta: function() { return _lstAgendamentosComConsulta; },
		setLstAgendamentosComConsulta: function(lstAgendamentosComConsulta) { _lstAgendamentosComConsulta = lstAgendamentosComConsulta; },
		getConteudoProntuarioMudou: function() { return _conteudoProntuarioMudou; },
		setConteudoProntuarioMudou: function(conteudoProntuarioMudou) { _conteudoProntuarioMudou = conteudoProntuarioMudou; },
		salvarConsultaPaciente: _salvarConsultaPaciente,
		imprimirRelatorioProntuarios: _imprimirRelatorioProntuarios
	};	
}]);