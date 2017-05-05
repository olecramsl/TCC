angular.module("syspsi").directive('exitConsultaPacientePage', ['$rootScope', '$mdDialog', '$location', 'consultaPacienteFactory', 
	function($rootScope, $mdDialog, $location, consultaPacienteFactory) {	
	return {
		link: function($scope, elem, attrs) {						
            $scope.$on('$locationChangeStart', function(event, next, current) {
            	if ($rootScope.sairPaginaConsulta) {
            		$rootScope.sairPaginaConsulta = false;
            	} else {
            		$rootScope.sairPaginaConsulta = true;            		
            		if (consultaPacienteFactory.getConteudoProntuarioMudou() && !confirm('Há informações não salvas no prontuário. Deseja realmente sair?')) {
            			event.preventDefault();
            		} else {       
            			consultaPacienteFactory.setAgendamento({});
            			consultaPacienteFactory.setConsulta({});
            		}
            		/*
            		if (consultaPacienteFactory.getConteudoProntuarioMudou()) {
	            		var confirm = $mdDialog.confirm()
	            			.title('Atenção')
	            			.textContent('Há informações não salvas no prontuário. Deseja realmente sair?')            	    
	            			.ok('Sim')
	            			.cancel('Não');
	
	            		$mdDialog.show(confirm).then(function() {            		
	            			consultaPacienteFactory.setId(null);            	
		                	consultaPacienteFactory.setAgendamento(null);
		                	consultaPacienteFactory.setProntuario(null);
		                	consultaPacienteFactory.setInicio(null);
		                	consultaPacienteFactory.setFim(null);
		                	consultaPacienteFactory.setPaciente(null);		                	
	            			$location.path($location.url(next).hash());
	            		}, function() {                 			
	            		});
            		}
            		*/
            	}                  	            	                            
            });            
        }
    };
}]);