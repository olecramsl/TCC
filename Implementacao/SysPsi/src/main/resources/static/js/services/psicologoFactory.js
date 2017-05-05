angular.module('syspsi').factory('psicologoFactory', ['$http', 'config', function($http, config) {
	var _gerarChave = function() {		
		return $http.get(config.BASE_URL + '/gerarChave');
	};

	return {			
		gerarChave: _gerarChave
	};
}]);