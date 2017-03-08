angular.module('syspsi').factory('convenioAPI', function($http, config) {
	var _listarConveniosAtivos = function() {
		return $http.get(config.baseUrl + '/listarConveniosAtivos');
	}
	
	return {				
		listarConveniosAtivos: _listarConveniosAtivos
	};
});