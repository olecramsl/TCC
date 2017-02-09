angular.module('syspsi').factory('agendaAPI', function($http, config) {			
	var _listarAgendamentos = function(params) {
		return $http.get(config.baseUrl + '/listarAgendamentos', {params});
	};
	
	var _salvarAgendamento = function(agendamentoDTO) {
		return $http.post(config.baseUrl + '/salvarAgendamento', angular.copy(agendamentoDTO));
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
	var _prepareAgendamentoDTO = function(ag) {
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
	
	var _msgErro = null;
	var _msgConfirmacao = null;
			
	return {				
		listarAgendamentos: _listarAgendamentos,
		salvarAgendamento: _salvarAgendamento,
		atribuirNovoEventoPrincipal: _atribuirNovoEventoPrincipal,
		removerAgendamento: _removerAgendamento,
		removerAgendamentosFuturos: _removerAgendamentosFuturos,
		moverAgendamentosFuturos: _moverAgendamentosFuturos,
		atualizarAgendamentosFuturos: _atualizarAgendamentosFuturos,
		prepareAgendamentoDTO: _prepareAgendamentoDTO,
		getMsgErro: function() { return _msgErro; },
		setMsgErro: function(msgErro) { _msgErro = msgErro; },
		getMsgConfirmacao: function() { return _msgConfirmacao; },
		setMsgConfirmacao: function(msgConfirmacao) { _msgConfirmacao = msgConfirmacao; },		
	};
});