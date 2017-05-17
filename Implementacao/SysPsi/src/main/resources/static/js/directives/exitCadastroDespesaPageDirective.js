angular.module("syspsi").directive('exitCadastroDespesaPage', ['cadastroDespesaFactory', function(cadastroDespesaFactory) {
	return {
		link: function($scope, elem, attrs) {
			window.onbeforeunload = function(){				
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {
            	console.log("Entrou!");
            	cadastroDespesaFactory.setDespesa(null);            	
            });
        }
    };
}]);