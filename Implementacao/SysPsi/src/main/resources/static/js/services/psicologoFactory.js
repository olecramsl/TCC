angular.module('syspsi').factory('psicologoFactory', ['$http', 'consts', function($http, consts) {
	var _vinculadoGCal;
	var _gerarChave = function() {		
		return $http.get(consts.BASE_URL + '/gerarChave');
	};
	
	var _setVinculadoGCal = function() {			
		$http.get(consts.BASE_URL + '/isVinculadoGCal').then(
				successCallback = function(response) {
					_vinculadoGCal = response.data;
				},
				errorCallback = function(error) {}
		);
	};

	return {
		setVinculadoGCal: _setVinculadoGCal,
		isVinculadoGCal: function() { return _vinculadoGCal; },
		gerarChave: _gerarChave
	};
}]);