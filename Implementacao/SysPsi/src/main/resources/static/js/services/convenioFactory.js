angular.module('syspsi').factory('convenioFactory', ['$http', 'config', function($http, config) {	
	var _lstConveniosAtivos = null;
	
	var _listarConveniosAtivos = function() {
		return $http.get(config.BASE_URL + '/listarConveniosAtivos');
	}
	
	return {
		getLstConveniosAtivos: function() { return _lstConveniosAtivos; },
		setLstConveniosAtivos: function(lstConveniosAtivos) { _lstConveniosAtivos = lstConveniosAtivos; },
		listarConveniosAtivos: _listarConveniosAtivos
	};
}]);