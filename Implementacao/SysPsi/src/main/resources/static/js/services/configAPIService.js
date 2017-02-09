angular.module('syspsi').factory('configAPI', function($http, config) {
	var _loadConfig = function() {
		return $http.get(config.baseUrl + '/loadConfig');
	};

	return {			
		loadConfig: _loadConfig
	};
});