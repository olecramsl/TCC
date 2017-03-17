angular.module('syspsi').factory('configFactory', ['$http', 'config', function($http, config) {
	var _loadConfig = function() {
		return $http.get(config.baseUrl + '/loadConfig');
	};

	return {			
		loadConfig: _loadConfig
	};
}]);