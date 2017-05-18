angular.module('syspsi').factory('loginFactory', ['$http', 'consts', function($http, consts) {		
	var _login = function(headers) {		
		return $http.get(consts.BASE_URL + '/user', {headers : headers});
	};
	
	var _logout = function() {
		return $http.post('logout', {});
	};
	
	var _realizarBackup = function() {
		return $http.get(consts.BASE_URL + '/realizarBackup');
	}
	
	return {		
		login: _login,
		logout: _logout,
		realizarBackup: _realizarBackup		
	};
}]);