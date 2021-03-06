// Modulos desta controller	
var lazyModules = ['ui.bootstrap', 'ngTable'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroPacienteCtrl', ['$mdDialog', '$uibModal', '$scope', '$http', '$location', 
	'convenioFactory', 'pacienteFactory', 'cadastroPacienteFactory', 'consultaPacienteFactory', 'agendamentoFactory', 
	'NgTableParams',	'utilService', function ($mdDialog, $uibModal,	$scope,	$http, $location, convenioFactory, 
	pacienteFactory, cadastroPacienteFactory, consultaPacienteFactory, agendamentoFactory, NgTableParams, utilService) {	
	
	var ctrl = this;
		
	$scope.$watch(function () { return ctrl.paciente.grupo; }, function (newValue, oldValue) {
	   	  if (newValue && newValue.maiorIdade) {
	   		  ctrl.maiorIdade = true;	   		  
	   	  } else {	   		  
	   		  ctrl.maiorIdade = false;	   		  
	   	  }
	});			
	
	$scope.$watch(function () { return ctrl.lstPacientes; }, function (newValue, oldValue) {
		ctrl.tableParams = new NgTableParams({ count: 10, sorting: { nomeCompleto: "asc" } }, { counts: [], dataset: ctrl.lstPacientes });
	});
	
	/*
	 Ativos = 1
	 Inativos = 2
	 Todos = 3 
	 */
	ctrl.pesquisa = {};
	// pacientes ativos
	ctrl.pesquisa.tipoPesquisa = "1";
	
	ctrl.paciente = {};
	if (cadastroPacienteFactory.isEditandoPaciente()) {
		ctrl.paciente = cadastroPacienteFactory.getPaciente();		
	}
	
	ctrl.lstAgendamentosComConsulta = {};
		
	var carregarGruposPacientes = function() {
		cadastroPacienteFactory.listarGruposPacientes().then(
				successCallback = function(response) {	  
					ctrl.lstGruposPacientes = response.data;					
				},
				errorCallback = function (error, status){					
					utilService.tratarExcecao(error); 
				}
		);
	}
		
		  
	// Busca CEP
	ctrl.loading = false;
	
	ctrl.carregarPacientes = function() {	
		if (ctrl.pesquisa.tipoPesquisa === "1") {			
			pacienteFactory.listarPacientesAtivosInativos(true).then(
					successCallback = function(response) {	  
						ctrl.lstPacientes = response.data;
						
					},
					errorCallback = function (error, status){					
						utilService.tratarExcecao(error); 
					}
			);
		} else if (ctrl.pesquisa.tipoPesquisa === "2") {			
			pacienteFactory.listarPacientesAtivosInativos(false).then(
					successCallback = function(response) {	  
						ctrl.lstPacientes = response.data;							
					},
					errorCallback = function (error, status){					
						utilService.tratarExcecao(error); 
					}
			);
		} else {			
			pacienteFactory.listarPacientes().then(
					successCallback = function(response) {	  
						ctrl.lstPacientes = response.data;						
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
					ctrl.paciente.logradouro = response.data.logradouro;
					ctrl.paciente.numero = "";
					ctrl.paciente.bairro = response.data.bairro;
					ctrl.paciente.localidade = response.data.localidade;
					ctrl.paciente.uf = response.data.uf;
					ctrl.loading = false;					
				},
			  	errorCallback = function (error, status){
					ctrl.paciente.logradouro = "";
					ctrl.paciente.numero = "";
					ctrl.paciente.bairro = "";
					ctrl.paciente.localidade = "";
					ctrl.paciente.uf = "";
					ctrl.loading = false;
			  	}		
		);						
	};
	
	ctrl.salvarPaciente = function(paciente) {
		var dataNascimentoPaciente = paciente.dataNascimento;
		if (paciente.dataNascimento) {
			var dataSplit = paciente.dataNascimento.split("/");			
			var dia = dataSplit[0];
			var mes = dataSplit[1]-1;
			var ano = dataSplit[2];
			var data = moment();
			data = moment(data).date(dia).month(mes).year(ano);
			paciente.dataNascimento = data.local();
		}
		
		var nomeSplit = paciente.nomeCompleto.split(" ");
		paciente.nomeCompleto = "";
		for (i=0; i<nomeSplit.length; i++) {				
			paciente.nomeCompleto = paciente.nomeCompleto + nomeSplit[i].substring(0,1).toUpperCase() +
				nomeSplit[i].substring(1).toLowerCase() + " ";			
		}		
		paciente.nomeCompleto = paciente.nomeCompleto.substring(0, paciente.nomeCompleto.length-1);
		
		if (paciente.nomeCompletoResponsavel) {
			nomeSplit = paciente.nomeCompletoResponsavel.split(" ");
			paciente.nomeCompletoResponsavel = "";
			for (i=0; i<nomeSplit.length; i++) {				
				paciente.nomeCompletoResponsavel = paciente.nomeCompletoResponsavel + nomeSplit[i].substring(0,1).toUpperCase() +
					nomeSplit[i].substring(1).toLowerCase() + " ";			
			}		
			paciente.nomeCompletoResponsavel = paciente.nomeCompletoResponsavel.substring(0, paciente.nomeCompletoResponsavel.length-1);			
		}
		
		cadastroPacienteFactory.salvarPaciente(paciente).then(
			successCallback = function(response) {																									
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Cadastro de Paciente')
						.textContent('Paciente cadastrado com sucesso!')
						.ariaLabel('Alerta')
						.ok('Ok')						
				);												
				
					
				ctrl.paciente = {};				
				$scope.cadastroPacienteForm.$setPristine();	
				
				pacienteFactory.listarPacientesAtivosInativos(true).then(
						successCallback = function(response) {					    
					    	  agendamentoFactory.setLstPacientesAtivos(response.data);	    	  
					  	  },
					  	  errorCallback = function (error, status){
					  		utilService.tratarExcecao(error); 
					  	  }
				);
			},
			errorCallback = function (error, status){		
				paciente.dataNascimento = dataNascimentoPaciente; 
				utilService.tratarExcecao(error); 
			}
		);		
	};	
	
	ctrl.iniciarConsulta = function(paciente) {
		var start = new Date();								
		var end = new Date();
		
		consulta = {
				id: null,
				prontuario: "",
				valor: 0,
				recibo: false,
				inicio: start,
				fim: end
		};
		
		// cria agendamento
		agendamento = {
				id: null,
				gCalendarId: null,				
				paciente: paciente,
				consulta: consulta,
				title: paciente.nomeExibicao,
				start: start,
				end: end,				
				grupo: 0,
				eventoPrincipal: false,
				description: null,
				repetirSemanalmente: false,
				ativo: true			
		}		
		
		agendamentoFactory.salvarAgendamento(agendamento).then(
				successCallback = function(response) {
					consultaPacienteFactory.setAgendamento(response.data);
					consultaPacienteFactory.setInicioAgendamento(new Date());
					consultaPacienteFactory.setFimAgendamento(null);
					$location.path("/consulta");
				},
				errorCallback = function (error, status){					
					utilService.tratarExcecao(error); 
				}
		);				
	};		
	
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
	
	ctrl.ativarDesativarPaciente = function(paciente) {		
		var atualizar = function() {
			cadastroPacienteFactory.atualizarPaciente(paciente).then(		
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
		};
		
		if (paciente.ativo) {
			var confirm = $mdDialog.confirm()
				.title('Atenção')
				.textContent('Tem certeza que deseja desativar este paciente?')				
				.ok('Sim')
				.cancel('Não');

			$mdDialog.show(confirm).then(function() {  
				paciente.ativo = false;
				atualizar();
			}, function() {});			
		} else {
			paciente.ativo = true;
			atualizar();
		}		
	}
	
	ctrl.verProntuarios = function(paciente) {			
		agendamentoFactory.listarAgendamentosComConsulta(paciente).then(
				successCallback = function(response) {					
					consultaPacienteFactory.setLstAgendamentosComConsulta(response.data);
					if (response.data.length > 0) {
						consultaPacienteFactory.setAgendamento(response.data[0]);
						$location.path('/prontuarios');
					} else {
						$mdDialog.show(
							$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('Prontuários')
								.textContent('Paciente não possui prontuários!')
								.ariaLabel('Alerta')
								.ok('Ok')						
						);
					}					
				},
				errorCallback = function (error, status){					
					utilService.tratarExcecao(error); 
				}
		);
	};
	
	ctrl.imprimirRecibo = function(paciente) {
		$scope.paciente = paciente;
		$mdDialog.show({
		      controller: function(){					    	  
		    	  this.parent = $scope;
		    	  this.parent.referenteA = "";
		    	  this.parent.dtEmissao = moment();
		    	  this.parent.valor = null;
		    	  
		    	  this.parent.cancel = function() {
		    		  $scope.paciente = null;
		    		  $scope.referenteA = "";
		    		  $scope.dtEmissao = null;
		    		  $scope.valor = null;
		    		  $mdDialog.hide();
		    	  };
		    	  
		    	  this.parent.imprimirRecibo = function(referenteA, dtEmissao, valor) {		    		  		    		 
		    		  $scope.referenreA = referenteA;
		    		  $scope.dtEmissao = dtEmissao;
		    		  $scope.valor = valor;
		    		  $mdDialog.hide();
		    	  }		    	  					    	 
	          },
	          controllerAs: 'ctrl',
		      templateUrl: 'templates/imprimir_recibo_modal.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:false					     
		    }).then(function() {			    	
		    	if ($scope.paciente && $scope.dtEmissao && $scope.valor) {
		    		utilService.setMessage("Gerando recibo ...");
					utilService.showWait();
					consultaPacienteFactory.imprimirRecibo($scope.paciente, $scope.referenteA, 
							$scope.dtEmissao, $scope.valor).then(
							successCalback = function(response) {
								utilService.hideWait();
								var file = new Blob([response.data], {
							    	type: 'application/pdf'
							    });
							    var fileURL = URL.createObjectURL(file);				    
								window.open(fileURL);
							},
							errorCallback = function(error, status) {
								utilService.hideWait();
								utilService.tratarExcecao("Não foi psossível gerar o recibo.");
							}
					);
		    	}
		    }, function() {		    	
		    	$scope.paciente = null;
	    		$scope.referenteA = "";
	    		$scope.dtEmissao = null;
	    		$scope.valor = null;
		    });				
	};	
	
	ctrl.reimprimirRecibo = function(paciente) {
		consultaPacienteFactory.listarRecibosPaciente(paciente).then(
				successCalback = function(response) {					
					$scope.lstRecibos = response.data;					
					if ($scope.lstRecibos && $scope.lstRecibos.length > 0) {
						$mdDialog.show({
						      controller: function(){					    	  
						    	  this.parent = $scope;						    	  
						    	  this.parent.lstRecibos = $scope.lstRecibos;
						    	  this.parent.recibo = null;
						    	  
						    	  this.parent.cancel = function() {
						    		  $scope.recibo = null;
						    		  $scope.lstRecibos = null;
						    		  $mdDialog.hide();
						    	  };
						    	  
						    	  this.parent.reimprimirRecibo = function(recibo) {						    		  
						    		  $scope.recibo = recibo;
						    		  $scope.lstRecibos = null;
						    		  $mdDialog.hide();
						    	  }
					          },
					          controllerAs: 'ctrl',
						      templateUrl: 'templates/reimprimir_recibo_modal.html',
						      parent: angular.element(document.body),
						      clickOutsideToClose:false					     
						    }).then(function() {			    	
						    	if ($scope.recibo) {
						    		utilService.setMessage("Gerando recibo ...");
									utilService.showWait();
									consultaPacienteFactory.reimprimirRecibo($scope.recibo).then(
											successCalback = function(response) {
												utilService.hideWait();
												var file = new Blob([response.data], {
											    	type: 'application/pdf'
											    });
											    var fileURL = URL.createObjectURL(file);				    
												window.open(fileURL);
											},
											errorCallback = function(error, status) {
												utilService.hideWait();
												utilService.tratarExcecao("Não foi psossível gerar o recibo.");
											}
									);
						    	}
						    }, function() {		    	
					    		$scope.recibo = null;
						    });
					} else {
						$mdDialog.show(
								$mdDialog.alert()
									.clickOutsideToClose(true)
									.title('Emissão de Recibo')
									.textContent('Não foram encontrados recibos emitidos para o paciente.')
									.ariaLabel('Alerta')
									.ok('Ok')						
								);
					}
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		);					
	};
				
	ctrl.carregarPacientes();
	carregarGruposPacientes();		
}]);