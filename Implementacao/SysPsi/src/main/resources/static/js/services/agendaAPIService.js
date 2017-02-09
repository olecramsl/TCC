angular.module('syspsi').factory('agendaAPI', function($http, config) {			
	var _listarAgendamentos = function(params) {
		return $http.get(config.baseUrl + '/listarAgendamentos', {params});
	};
	
	var _salvarAgendamento = function(agendamentoDTO) {
		return $http.post(config.baseUrl + '/salvarAgendamento', agendamentoDTO);
	};
	
	var _atribuirNovoEventoPrincipal = function(agendamento) {
		return $http.post(config.baseUrl + '/atribuirNovoEventoPrincipal', angular.copy(agendamento));
	}
	
	return {				
		listarAgendamentos: _listarAgendamentos,
		salvarAgendamento: _salvarAgendamento,
		atribuirNovoEventoPrincipal: _atribuirNovoEventoPrincipal
	};
});