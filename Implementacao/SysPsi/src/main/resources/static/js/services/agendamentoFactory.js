angular.module('syspsi').factory('agendamentoFactory', ['$http', 'config', function($http, config) {
	var _agendamento = {};
	var _agendamentoCarregado = {};	
	var _lstPacientesAtivos = null;		
	
	var _listarAgendamentos = function(dataInicial, dataFinal) {
		var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
		return $http.get(config.baseUrl + '/listarAgendamentos', {params});
	};
	
	var _salvarAgendamento = function(agendamentoDTO) {
		return $http.post(config.baseUrl + '/salvarAgendamento', angular.copy(agendamentoDTO));
	};
	
	var _salvarAgendamentoTemporarioGCalendar = function(agendamentoDTO) {
		return $http.post(config.baseUrl + '/salvarAgendamentoTemporarioGCalendar', angular.copy(agendamentoDTO));
	};
	
	var _atribuirNovoEventoPrincipal = function(agendamento) {
		return $http.post(config.baseUrl + '/atribuirNovoEventoPrincipal', angular.copy(agendamento));
	}
	
	var _removerAgendamento = function(agendamento) {
		return $http.post(config.baseUrl + '/removerAgendamento', angular.copy(agendamento));
	};
	
	var _removerAgendamentosFuturos = function(agendamento) {
		return $http.post(config.baseUrl + '/removerAgendamentosFuturos', angular.copy(agendamento));
	};
	
	var _moverAgendamentosFuturos = function(agendamento) {
		return $http.post(config.baseUrl + '/moverAgendamentosFuturos', angular.copy(agendamento));
	};
	
	var _atualizarAgendamentosFuturos = function(agendamento) {
		return $http.post(config.baseUrl + '/atualizarAgendamentosFuturos', angular.copy(agendamento));
	};
	
	/**
	 * Retorna o DTO a ser enviado ao método salvar
	 */
	var _prepararAgendamentoDTO = function(ag) {		
		var agendamento = angular.copy(ag);
		
		var view = angular.element('.calendar').fullCalendar('getView');
		  	  	  
		var dataInicialView =view.start.local();
		var dataFinalView = view.end.local();
		
		return agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente,				
				dataInicialViewFC  : new Date(dataInicialView), 
				dataFinalViewFC    : new Date(dataFinalView)
		};
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
		prepararAgendamentoDTO: _prepararAgendamentoDTO,		
	};
}]);