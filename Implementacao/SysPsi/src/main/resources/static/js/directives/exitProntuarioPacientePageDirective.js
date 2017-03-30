angular.module("syspsi").directive('exitProntuarioPacientePage', ['$mdDialog', 'prontuarioPacienteFactory', 'modalInstanceFactory', 
	'modalInstanceService',	function($mdDialog, prontuarioPacienteFactory, modalInstanceFactory, modalInstanceService) {
	return {
		link: function($scope, elem, attrs) {
			window.onbeforeunload = function(){				
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {			
            	//modalInstanceFactory.setMsgConfirmacao("Are you sure you want to leave this page?");            	
            	//modalInstanceService.openConfirmacaoModal();
            	            	
            	// Appending dialog to document.body to cover sidenav in docs app
            	var confirm = $mdDialog.confirm()
            		.title('Atenção')
            	    .textContent('Há informações não salvas no prontuário. Deseja realmente sair?')
            	    .ariaLabel('Sim')
            	    .targetEvent(event)
            	    .ok('Please do it!')
            	    .cancel('Sounds like a scam');

            	$mdDialog.show(confirm).then(function() {
            		$scope.status = 'You decided to get rid of your debt.';
            		event.preventDefault();
            		console.log("1");
            	}, function() {
            		$scope.status = 'You decided to keep your debt.';
            		event.preventDefault();
            		console.log("2");
            	});
            	event.preventDefault();  
            	  
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
            });            
        }
    };
}]);