angular.module('syspsi').factory('pacienteFactory', ['$http', 'consts', function($http, consts) {
	var _listarPacientesAtivosInativos = function(ativo) {		
		var params = {ativo: ativo};
		return $http.get(consts.BASE_URL + '/listarPacientesAtivosInativos', {params});
	};
	
	var _listarPacientes = function() {				
		return $http.get(consts.BASE_URL + '/listarPacientes');
	};		
	
	return {
		listarPacientesAtivosInativos: _listarPacientesAtivosInativos,
		listarPacientes: _listarPacientes
	};
}]);