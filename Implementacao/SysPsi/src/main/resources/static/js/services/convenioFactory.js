angular.module('syspsi').factory('convenioFactory', ['$http', 'consts', function($http, consts) {	
	var _lstConveniosAtivos = null;
	
	var _listarConveniosAtivos = function() {
		return $http.get(consts.BASE_URL + '/listarConveniosAtivos');
	}
	
	return {
		getLstConveniosAtivos: function() { return _lstConveniosAtivos; },
		setLstConveniosAtivos: function(lstConveniosAtivos) { _lstConveniosAtivos = lstConveniosAtivos; },
		listarConveniosAtivos: _listarConveniosAtivos
	};
}]);