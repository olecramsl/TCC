angular.module('syspsi').factory('cadastroPsicologoFactory', ['$http', 'consts', function($http, consts) {
	var _psicologo;	
	
	var _salvarPsicologo = function(psicologo) {
		var novoPsicologo = angular.copy(psicologo);				
		
		if (novoPsicologo.cpf) {
			novoPsicologo.cpf = novoPsicologo.cpf.replace(/[^0-9]/g,'');
		}
		novoPsicologo.ativo = true;
		
		InPsicologoDTO = {
				psicologo: novoPsicologo,
				senha: novoPsicologo.senha
		}
		
		return $http.post(consts.BASE_URL + '/salvarPsicologo', InPsicologoDTO);
	};
	
	var _excluirPsicologo = function(psicologo) {
		return $http.post(consts.BASE_URL + '/excluirPsicologo', psicologo);
	};
	
	var _atualizarPsicologo = function(psicologo) {
		return $http.post(consts.BASE_URL + '/atualizarPsicologo', psicologo);
	};
	
	return {
		getPsicologo: function() { return _psicologo; },
		setPsicologo: function(psicologo) { _psicologo = psicologo; },				
		salvarPsicologo: _salvarPsicologo,
		excluirPsicologo: _excluirPsicologo,
		atualizarPsicologo: _atualizarPsicologo
	};
}]);