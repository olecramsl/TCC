angular.module('syspsi').factory('agendamentoFactory', ['$http', 'consts', function($http, consts) {
	var _agendamento = {};
	var _agendamentoCarregado = {};	
	var _lstPacientesAtivos = null;		
	
	var _listarAgendamentos = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
		return $http.get(consts.BASE_URL + '/listarAgendamentos', {params});
	};
	
	var _salvarAgendamento = function(ag) {
		var agendamento = angular.copy(ag);
		
		var agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente				
		};
		return $http.post(consts.BASE_URL + '/salvarAgendamento', angular.copy(agendamentoDTO));
	};
	
	var _salvarAgendamentoTemporarioGCalendar = function(ag) {
		var agendamentoDTO = {
				agendamento        : ag,
				repetirSemanalmente: ag.repetirSemanalmente				
		};
		
		return $http.post(consts.BASE_URL + '/salvarAgendamentoTemporarioGCalendar', angular.copy(agendamentoDTO));
	};
	
	var _atribuirNovoEventoPrincipal = function(agendamento) {
		return $http.post(consts.BASE_URL + '/atribuirNovoEventoPrincipal', angular.copy(agendamento));
	}
	
	var _removerAgendamento = function(agendamento) {
		return $http.post(consts.BASE_URL + '/removerAgendamento', angular.copy(agendamento));
	};
	
	var _removerAgendamentosFuturos = function(agendamento) {
		return $http.post(consts.BASE_URL + '/removerAgendamentosFuturos', angular.copy(agendamento));
	};
	
	var _moverAgendamentosFuturos = function(agendamento) {
		return $http.post(consts.BASE_URL + '/moverAgendamentosFuturos', angular.copy(agendamento));
	};
	
	var _atualizarAgendamentosFuturos = function(agendamento) {
		return $http.post(consts.BASE_URL + '/atualizarAgendamentosFuturos', angular.copy(agendamento));
	};
	
	var _listarAgendamentosComConsulta = function(paciente) {
		return $http.post(consts.BASE_URL + '/listarAgendamentosComConsulta', paciente);
	};
	
	var _listarAgendamentosComConsultaPeriodo = function(dataInicial, dataFinal, paciente) {		
		var params = {dataInicial: dataInicial, dataFinal: dataFinal, idPaciente: paciente.id};
		return $http.get(consts.BASE_URL + '/listarAgendamentosComConsultaPeriodo', {params});
	};
	
	var _listarAgendamentosDoDia = function() {
		return $http.get(consts.BASE_URL + '/listarAgendamentosDoDia');
	}
	
	return {		
		getAgendamento: function() { return _agendamento; },
		setAgendamento: function(agendamento) { _agendamento = agendamento; },		
		getId: function() { return _agendamento.id; },
		setId: function(id) { _agendamento.id = id; },
		getGCalendarId: function() { return _agendamento.gCalendarId; },
		setGCalendarId: function(gCalendarId) { _agendamento.gCalendarId = gCalendarId; },
		getPaciente: function() { return _agendamento.paciente; },
		setPaciente: function(paciente) { _agendamento.paciente = paciente; },
		getConvenio: function() {return _agendamento.convenio; },
		setConvenio: function(convenio) {_agendamento.convenio = convenio; },
		getTitle: function() { return _agendamento.title; },
		setTitle: function(title) { _agendamento.title = title; },
		getStart: function() { return _agendamento.start; },
		setStart: function(start) { _agendamento.start = start; },
		getEnd: function() { return _agendamento.end; },
		setEnd: function(end) { _agendamento.end = end; },
		getFormatedStart: function() { return _agendamento.formatedStart; },
		setFormatedStart: function(formatedStart) { _agendamento.formatedStart = formatedStart; },
		getGrupo: function() { return _agendamento.grupo; },
		setGrupo: function(grupo) { _agendamento.grupo = grupo; },
		getEventoPrincipal: function() { return _agendamento.eventoPrincipal; },
		setEventoPrincipal: function(eventoPrincipal) { _agendamento.eventoPrincipal = eventoPrincipal; },
		getDescription: function() { return _agendamento.description; },
		setDescription: function(description) { _agendamento.description = description; },
		getRepetirSemanalmente: function() { return _agendamento.repetirSemanalmente; },
		setRepetirSemanalmente: function(repetirSemanalmente) { _agendamento.repetirSemanalmente = repetirSemanalmente; },
		getAtivo: function() { return _agendamento.ativo; },
		setAtivo: function(ativo) { _agendamento.ativo = ativo; },
		getEditable: function() { return _agendamento.editable; },
		setEditable: function(editable) { _agendamento.editable = editable; },
		getAgendamentoCarregado: function() { return _agendamentoCarregado; },
		setAgendamentoCarregado: function(agendamentoCarregado) { _agendamentoCarregado = agendamentoCarregado; },
		getLstPacientesAtivos: function() { return _lstPacientesAtivos; },
		setLstPacientesAtivos: function(lstPacientesAtivos) { _lstPacientesAtivos = lstPacientesAtivos; },
		listarAgendamentos: _listarAgendamentos,
		salvarAgendamento: _salvarAgendamento,
		salvarAgendamentoTemporarioGCalendar: _salvarAgendamentoTemporarioGCalendar,
		atribuirNovoEventoPrincipal: _atribuirNovoEventoPrincipal,
		removerAgendamento: _removerAgendamento,
		removerAgendamentosFuturos: _removerAgendamentosFuturos,
		moverAgendamentosFuturos: _moverAgendamentosFuturos,
		atualizarAgendamentosFuturos: _atualizarAgendamentosFuturos,
		listarAgendamentosComConsulta: _listarAgendamentosComConsulta,
		listarAgendamentosComConsultaPeriodo: _listarAgendamentosComConsultaPeriodo,
		listarAgendamentosDoDia: _listarAgendamentosDoDia
	};
}]);