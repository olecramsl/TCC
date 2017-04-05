angular.module("syspsi").directive('exitProntuarioPacientePage', ['$mdDialog', 'prontuarioPacienteFactory', function($mdDialog, 
		prontuarioPacienteFactory) {
	return {
		link: function($scope, elem, attrs) {			
            $scope.$on('$locationChangeStart', function(event, next, current) {
            	console.log("passou");
            	/*
            	if ($scope.prontuarioForm.$dirty && !confirm('Há informações não salvas no prontuário. Deseja realmente sair?')) {
                    event.preventDefault();
            	}
            	*/
            	// Appending dialog to document.body to cover sidenav in docs app
            	/*
            	var confirm = $mdDialog.confirm()
            		.title('Atenção')
            	    .textContent('Há informações não salvas no prontuário. Deseja realmente sair?')
            	    //.ariaLabel('Sim')            	    
            	    .ok('Sim')
            	    .cancel('Não');

            	$mdDialog.show(confirm).then(function() {            		
            		//event.preventDefault();            		
            		console.log("1");
            	}, function() {            		
            		event.preventDefault();
            		console.log("2");
            	});
            	//event.preventDefault();  
            	*/
            	  
            	/*  
            	if (!modalInstanceFactory.getSelecao()) {
                    event.preventDefault();
                } else {
	            	prontuarioPacienteFactory.setId(null);
	            	prontuarioPacienteFactory.setPaciente(null);
	            	prontuarioPacienteFactory.setInicio(null);
	            	prontuarioPacienteFactory.setFim(null);
                } 
                */     
            	prontuarioPacienteFactory.setId(null);
            	prontuarioPacienteFactory.setPaciente(null);
            	prontuarioPacienteFactory.setAgendamento(null);
            	prontuarioPacienteFactory.setConteudo(null);
            	prontuarioPacienteFactory.setInicio(null);
            	prontuarioPacienteFactory.setFim(null);
            });            
        }
    };
}]);