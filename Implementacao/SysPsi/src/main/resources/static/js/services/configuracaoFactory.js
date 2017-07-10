angular.module('syspsi').factory('configuracaoFactory', ['$http', 'consts', function($http, consts) {
	var _isVinculadoGCal = function() {		
		return $http.get(consts.BASE_URL + '/isVinculadoGCal');
	};
	
	var _exportarAgendamentoParaGoogleCalendar = function() {
		return $http.get(consts.BASE_URL + '/exportarAgendamentoParaGoogleCalendar');
	};
	
	var _desvincularAgendamentosDoGoogleCalendar = function() {
		return $http.get(consts.BASE_URL + '/desvincularAgendamentosDoGoogleCalendar');
	};
	
	return {
		isVinculadoGCal: _isVinculadoGCal,
		exportarAgendamentoParaGoogleCalendar: _exportarAgendamentoParaGoogleCalendar,
		desvincularAgendamentosDoGoogleCalendar: _desvincularAgendamentosDoGoogleCalendar		
	};
}]);