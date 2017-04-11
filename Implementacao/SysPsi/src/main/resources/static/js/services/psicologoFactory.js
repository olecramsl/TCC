angular.module('syspsi').factory('psicologoFactory', ['$http', 'config', function($http, config) {
	var _gerarChave = function() {		
		return $http.get(config.baseUrl + '/gerarChave');
	};

	return {			
		gerarChave: _gerarChave
	};
}]);