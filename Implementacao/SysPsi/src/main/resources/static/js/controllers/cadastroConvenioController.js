// Modulos desta controller	
var lazyModules = ['ui.bootstrap', 'ngTable'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroConvenioCtrl', ['$mdDialog', '$uibModal', '$scope', '$http', '$location', 'convenioFactory', 
	'cadastroConvenioFactory', 'NgTableParams',	'utilService', function ($mdDialog, $uibModal,	$scope,	$http, $location, convenioFactory, 
			cadastroConvenioFactory, NgTableParams, utilService) {	
	
	var ctrl = this;
			
	$scope.$watch(function () { return ctrl.lstConvenios; }, function (newValue, oldValue) {
		ctrl.tableParams = new NgTableParams({ count: 10, sorting: { nomeCompleto: "asc" } }, { counts: [], dataset: ctrl.lstConvenios });
	});
	
	/*
	 Ativos = 1
	 Inativos = 2
	 Todos = 3 
	 */
	ctrl.pesquisa = {};
	// pacientes ativos
	ctrl.pesquisa.tipoPesquisa = "1";
	
	ctrl.convenio = {};
	if (cadastroConvenioFactory.isEditandoConvenio()) {
		ctrl.convenio = cadastroConvenioFactory.getConvenio();		
	}
	
	// Busca CEP
	ctrl.loading = false;
	
	ctrl.carregarConvenios = function() {
		if (ctrl.pesquisa.tipoPesquisa === "1") {			
			convenioFactory.listarConveniosAtivos().then(
					successCallback = function(response) {	  
						ctrl.lstConvenios = response.data;
						
					},
					errorCallback = function (error, status){					
						utilService.tratarExcecao(error); 
					}
			);
		} else if (ctrl.pesquisa.tipoPesquisa === "2") {			
			convenioFactory.listarConveniosInativos().then(
					successCallback = function(response) {	  
						ctrl.lstConvenios = response.data;							
					},
					errorCallback = function (error, status){					
						utilService.tratarExcecao(error); 
					}
			);
		} else {			
			convenioFactory.listarConvenios().then(
					successCallback = function(response) {	  
						ctrl.lstConvenios = response.data;						
					},
					errorCallback = function (error, status){					
						utilService.tratarExcecao(error); 
					}
			);
		}	
	}
	
	ctrl.buscarCep = function(strCep) {
		ctrl.loading = true;
		
		var cep = strCep.replace(/[^0-9]/g,'');
		$http.get("https://viacep.com.br/ws/" + cep + "/json/").then(
				successCallback = function(response) {
					ctrl.convenio.logradouro = response.data.logradouro;
					ctrl.convenio.numero = "";
					ctrl.convenio.bairro = response.data.bairro;
					ctrl.convenio.localidade = response.data.localidade;
					ctrl.convenio.uf = response.data.uf;
					ctrl.loading = false;					
				},
			  	errorCallback = function (error, status){
					ctrl.convenio.logradouro = "";
					ctrl.convenio.numero = "";
					ctrl.convenio.bairro = "";
					ctrl.convenio.localidade = "";
					ctrl.convenio.uf = "";
					ctrl.loading = false;
			  	}		
		);						
	};
	
	ctrl.salvarConvenio = function(convenio) {		
		var novoConvenio = angular.copy(convenio);
		if (novoConvenio.valorConsultaIndividual) {
			novoConvenio.valorConsultaIndividual = convenio.valorConsultaIndividual.toString().replace(",", ".");
		}		
		if (novoConvenio.valorConsultaCasal) {
			novoConvenio.valorConsultaCasal = convenio.valorConsultaCasal.toString().replace(",", ".");
		}
		if (novoConvenio.valorConsultaFamilia) {
			novoConvenio.valorConsultaFamilia = convenio.valorConsultaFamilia.toString().replace(",", ".");
		}
		cadastroConvenioFactory.salvarConvenio(novoConvenio).then(
			successCallback = function(response) {																									
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Cadastro de Convênio')
						.textContent('Convênio cadastrado com sucesso!')
						.ariaLabel('Alerta')
						.ok('Ok')						
				);												
				
					
				ctrl.convenio = {};				
				$scope.cadastroConvenioForm.$setPristine();	
				
				convenioFactory.listarConveniosAtivos().then(
						successCallback = function(response) {					    
					    	  convenioFactory.setLstConveniosAtivos(response.data);	    	  
					  	  },
					  	  errorCallback = function (error, status){
					  		utilService.tratarExcecao(error); 
					  	  }
				);
			},
			errorCallback = function (error, status){						
				utilService.tratarExcecao(error); 
			}
		);			
	};	
	
	ctrl.editarConvenio = function(convenio) {		
		cadastroConvenioFactory.setConvenio(convenio);
		cadastroConvenioFactory.setEditandoConvenio(true);
		$location.path("/editarConvenio");		
	};
		
	ctrl.excluirConvenio = function(convenio) {
		var confirm = $mdDialog.confirm()
			.title('Atenção')
			.textContent('Tem certeza que deseja excluir o convênio?')				
			.ok('Sim')
			.cancel('Não');

		$mdDialog.show(confirm).then(function() {			
			cadastroConvenioFactory.excluirConvenio(convenio).then(
				successCallback = function(response) {																							
					ctrl.carregarConvenios();	
					
					convenioFactory.listarConveniosAtivos().then(
							successCallback = function(response) {					    
						    	  convenioFactory.setLstConveniosAtivos(response.data);	    	  
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
	
	ctrl.ativarDesativarConvenio = function(convenio) {
		var atualizar = function() {
			cadastroConvenioFactory.atualizarConvenio(convenio).then(		
				successCallback = function(response) {									
					ctrl.carregarConvenios();
					
					convenioFactory.listarConveniosAtivos().then(
							successCallback = function(response) {					    
						    	  convenioFactory.setLstConveniosAtivos(response.data);	    	  
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
		};		
		if (convenio.ativo) {
			var confirm = $mdDialog.confirm()
				.title('Atenção')
				.textContent('Tem certeza que deseja desativar este convênio?')				
				.ok('Sim')
				.cancel('Não');

			$mdDialog.show(confirm).then(function() {  
				convenio.ativo = false;
				atualizar();
			}, function() {});			
		} else {
			convenio.ativo = true;
			atualizar();
		}		
	}	
	
	ctrl.carregarConvenios();		
}]);