angular.module('syspsi').controller('CadastroPsicologoCtrl', ['$mdDialog', '$scope', '$http', '$location', 
	'cadastroPsicologoFactory','utilService', 'consts', function ($mdDialog, $scope, $http, $location, 
			cadastroPsicologoFactory, utilService, consts) {	

	var ctrl = this;		

	ctrl.salvarPsicologo = function(psicologo) {		
		cadastroPsicologoFactory.salvarPsicologo(psicologo).then(
			successCallback = function(response) {																									
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Cadastro de Psicologo')
						.textContent('Psicólogo cadastrado com sucesso!')
						.ariaLabel('Alerta')
						.ok('Ok')	
				).then(function() {			
					ctrl.psicologo = {};				
					$scope.cadastroPsicologoForm.$setPristine();
					window.location.href = consts.BASE_URL;
				});																									
			},
			errorCallback = function (error, status){						
				utilService.tratarExcecao(error); 
			}
		);		
	};	
	
	/*
	ctrl.editarPaciente = function(paciente) {
		if (paciente.dataNascimento) {
			var dataFormatada = new Date(paciente.dataNascimento);			
			var dia = dataFormatada.getDate() < 10?"0"+dataFormatada.getDate():dataFormatada.getDate();
			var mes = (dataFormatada.getMonth()+1) < 10?"0"+(dataFormatada.getMonth()+1):(dataFormatada.getMonth()+1);
			var ano = dataFormatada.getFullYear();			
			paciente.dataNascimento = dia + "/" + mes + "/" + ano;
		}
		cadastroPacienteFactory.setPaciente(paciente);
		cadastroPacienteFactory.setEditandoPaciente(true);
		$location.path("/editarPaciente");
	};
		
	ctrl.excluirPaciente = function(paciente) {
		var confirm = $mdDialog.confirm()
			.title('Atenção')
			.textContent('Todas as informações do paciente, incluindo os prontuários, serão perdidas. Tem certeza que deseja continuar?')				
			.ok('Sim')
			.cancel('Não');

		$mdDialog.show(confirm).then(function() {  
			cadastroPacienteFactory.excluirPaciente(paciente).then(
				successCallback = function(response) {																							
					ctrl.carregarPacientes();	
					
					pacienteFactory.listarPacientesAtivosInativos(true).then(
							successCallback = function(response) {					    
						    	  agendamentoFactory.setLstPacientesAtivos(response.data);	    	  
						  	  },
						  	  errorCallback = function (error, status){
						  		utilService.tratarExcecao(error); 
						  	  }
					);
				},
				errorCallback = function (error, status) { 	
					utilService.tratarExcecao(error); 
				}
			);
		}, function() {});				
	}
	*/			
}]);