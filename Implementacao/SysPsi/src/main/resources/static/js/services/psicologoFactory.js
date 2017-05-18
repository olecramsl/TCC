angular.module('syspsi').factory('psicologoFactory', ['$http', 'consts', function($http, consts) {
	var _gerarChave = function() {		
		return $http.get(consts.BASE_URL + '/gerarChave');
	};

	return {			
		gerarChave: _gerarChave
	};
}]);