// Modulos desta controller	
var lazyModules = ['ui.bootstrap', 'ngTable'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroPacienteCtrl', ['$mdDialog', '$uibModal', '$scope', '$http', '$location', '$route', 
	'convenioFactory', 'pacienteFactory', 'cadastroPacienteFactory', 'consultaPacienteFactory', 'agendamentoFactory', 'NgTableParams', 
	'utilService', function ($mdDialog, $uibModal,	$scope,	$http, $location, $route, convenioFactory, pacienteFactory, cadastroPacienteFactory, 
		consultaPacienteFactory, agendamentoFactory, NgTableParams, utilService) {	
	
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
	
	if (cadastroPacienteFactory.isEditandoPaciente()) {
		ctrl.paciente = cadastroPacienteFactory.getPaciente();		
	} else {
		ctrl.paciente = {};
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
	
	var carregarConveniosAtivos = function() {
		convenioFactory.listarConveniosAtivos().then(
				successCallback = function(response) {	  
					ctrl.lstConveniosAtivos = response.data;					
				},
				errorCallback = function (error, status){					
					utilService.tratarExcecao(error); 
				}
		);
	};
	
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
		
		agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente, 
				dataInicialViewFC  : start, 
				dataFinalViewFC    : end
		}
		
		agendamentoFactory.salvarAgendamento(agendamentoDTO).then(
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
			
	carregarConveniosAtivos();
	ctrl.carregarPacientes();
	carregarGruposPacientes();		
}]);