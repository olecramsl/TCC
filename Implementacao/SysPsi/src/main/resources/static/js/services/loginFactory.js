angular.module('syspsi').factory('loginFactory', ['$http', 'consts', function($http, consts) {		
	var _login = function(credentials) {			
		//return $http.get(consts.BASE_URL + '/user', {headers : headers});		
		return $http.post(consts.BASE_URL + '/login', credentials);
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