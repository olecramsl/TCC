angular.module("syspsi").directive('exitCadastroPacientePage', ['cadastroPacienteFactory', function(cadastroPacienteFactory) {
	return {
		link: function($scope, elem, attrs) {
			window.onbeforeunload = function(){				
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {            	
            	cadastroPacienteFactory.setEditandoPaciente(false);            	
            });
        }
    };
}]);