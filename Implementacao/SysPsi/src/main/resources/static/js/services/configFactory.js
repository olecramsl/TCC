angular.module('syspsi').factory('configFactory', ['$http', 'config', function($http, config) {
	var _configSys = null;
	
	var _loadConfig = function() {
		return $http.get(config.BASE_URL + '/loadConfig');
	};

	return {		
		setConfigSys: function(configSys) { _configSys = configSys; },
		getTempoSessao: function() { return _configSys.tempoSessao; },
		loadConfig: _loadConfig
	};
}]);