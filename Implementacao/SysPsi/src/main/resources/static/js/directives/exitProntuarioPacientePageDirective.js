angular.module("syspsi").directive('exitProntuarioPacientePage', ['prontuarioPacienteFactory', 'modalInstanceFactory', 'modalInstanceService', '$mdDialog', 
	function(prontuarioPacienteFactory, modalInstanceFactory, modalInstanceService, $mdDialog) {
	return {
		link: function($scope, elem, attrs) {
			window.onbeforeunload = function(){				
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {			
            	//modalInstanceFactory.setMsgConfirmacao("Are you sure you want to leave this page?");            	
            	//modalInstanceService.openConfirmacaoModal();
            	
            	$scope.showConfirm = function(ev) {
            	    // Appending dialog to document.body to cover sidenav in docs app
            	    var confirm = $mdDialog.confirm()
            	          .title('Would you like to delete your debt?')
            	          .textContent('All of the banks have agreed to forgive you your debts.')
            	          .ariaLabel('Lucky day')
            	          .targetEvent(ev)
            	          .ok('Please do it!')
            	          .cancel('Sounds like a scam');

            	    $mdDialog.show(confirm).then(function() {
            	      $scope.status = 'You decided to get rid of your debt.';
            	    }, function() {
            	      $scope.status = 'You decided to keep your debt.';
            	    });
            	  }; 
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