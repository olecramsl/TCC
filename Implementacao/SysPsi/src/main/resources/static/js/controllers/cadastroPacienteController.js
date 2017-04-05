// Modulos desta controller
var lazyModules = ['ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroPacienteCtrl', ['$mdDialog', '$uibModal', '$scope', '$http', '$location', 'configFactory', 
	'convenioFactory', 'pacienteFactory', 'cadastroPacienteFactory', 'prontuarioPacienteFactory', 'agendamentoFactory',	function ($mdDialog, 
			$uibModal,	$scope,	$http, $location, configFactory, convenioFactory, pacienteFactory, cadastroPacienteFactory, 
			prontuarioPacienteFactory,	agendamentoFactory) {
	
	var ctrl = this;		
	
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
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	var tratarExcecao = function(error) {
		var msg;
		try {
			// captura de excecao enviada pela Controller (codigo java)
			msg = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			msg = error.data.message;
		}
		$mdDialog.show(
			$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Algo saiu errado ...')
				.textContent(msg)
				.ariaLabel('Alerta')
				.ok('Ok')						
		);		
	};
	
	/**
	 * Configurações do sistema
	 */  
	var carregarConfiguracoes = function() {
		configFactory.loadConfig().then(
				successCallback = function(response) {	
					configSys = response.data;	    	  
				},
				errorCallback = function (error, status){
					tratarExcecao(error); 
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
					tratarExcecao(error); 
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
						tratarExcecao(error); 
					}
			);
		} else if (ctrl.pesquisa.tipoPesquisa === "2") {			
			pacienteFactory.listarPacientesAtivosInativos(false).then(
					successCallback = function(response) {	  
						ctrl.lstPacientes = response.data;					
					},
					errorCallback = function (error, status){					
						tratarExcecao(error); 
					}
			);
		} else {			
			pacienteFactory.listarPacientes().then(
					successCallback = function(response) {	  
						ctrl.lstPacientes = response.data;					
					},
					errorCallback = function (error, status){					
						tratarExcecao(error); 
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
		if (cadastroPacienteFactory.isEditandoPaciente()) {			
			var dataFormatada = new Date(paciente.dataNascimento);
			paciente.dataNascimento = dataFormatada.getDate() + "/" + (dataFormatada.getMonth()+1) + "/" + dataFormatada.getFullYear();
		}
		
		cadastroPacienteFactory.salvarPaciente(paciente).then(
			successCallback = function(response) {						
				ctrl.paciente = {};
				$scope.cadastroClienteForm.$setPristine();
				
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Cadastro de Paciente')
						.textContent('Paciente cadastrado com sucesso!')
						.ariaLabel('Alerta')
						.ok('Ok')						
				);
				
			},
			errorCallback = function (error, status){					
				tratarExcecao(error); 
			}
		);		
	};	
	
	ctrl.iniciarConsulta = function(paciente) {		
		var start = new Date();								
		var end = new Date();		
		
		// cria agendamento
		agendamento = {
				id: null,
				gCalendarId: null,				
				paciente: paciente,				
				psicologo: paciente.psicologo,				
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
					prontuarioPacienteFactory.setId(null);
					prontuarioPacienteFactory.setPaciente(paciente);
					prontuarioPacienteFactory.setAgendamento(response.data);
					prontuarioPacienteFactory.setConteudo(null);
					prontuarioPacienteFactory.setInicio(new Date());
					prontuarioPacienteFactory.setFim(null);
					
					$location.path("/prontuario");
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);				
	};		
	
	ctrl.editarPaciente = function(paciente) {		
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
					$mdDialog.show(
						$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('Exclusão de Paciente')
							.textContent('Paciente excluído com sucesso!')
							.ariaLabel('Alerta')
							.ok('Ok')						
					);	
				},
				errorCallback = function (error, status) { 	
					tratarExcecao(error); 
				}
			);
		}, function() {});				
	}
	
	ctrl.ativarDesativarPaciente = function(paciente) {		
		var atualizar = function() {
			cadastroPacienteFactory.atualizarPaciente(paciente).then(		
				successCallback = function(response) {									
					ctrl.carregarPacientes();
					var msg;
					if (paciente.ativo) {
						msg = "Paciente ativado com sucesso!";
					} else {						
						msg = "Paciente desativado com sucesso!";						
					}									
					
					$mdDialog.show(
						$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('Ativação de Paciente')
							.textContent(msg)
							.ariaLabel('Alerta')
							.ok('Ok')						
					);
					
				},
				errorCallback = function (error, status) {
					console.log("Erro: " + error);
					tratarExcecao(error); 
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
	
	carregarConfiguracoes();
	carregarConveniosAtivos();
	ctrl.carregarPacientes();	
}]);