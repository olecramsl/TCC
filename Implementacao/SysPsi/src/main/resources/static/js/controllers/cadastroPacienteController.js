// Modulos desta controller
var lazyModules = ['ui.bootstrap'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('CadastroPacienteCtrl', ['$uibModal', '$scope', '$http', '$location', 'configFactory', 'convenioFactory', 
	'pacienteFactory', 'cadastroPacienteFactory', 'consultaPacienteFactory', 'agendamentoFactory', 'modalInstanceFactory', 'modalInstanceService', function ($uibModal, 
			$scope,	$http, $location, configFactory, convenioFactory, pacienteFactory, cadastroPacienteFactory, consultaPacienteFactory, 
			agendamentoFactory,	modalInstanceFactory, modalInstanceService) {
	
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
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	var tratarExcecao = function(error) {
		try {
			// captura de excecao enviada pela Controller (codigo java)
			modalInstanceFactory.setMsgErro(error.data.message);
		} catch(erro) {
			// Erro nivel Javascript
			modalInstanceFactory.setMsgErro(error.data.message);
		}				
		modalInstanceService.openErroModal();
	};
		  
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
					modalInstanceFactory.setMsgOk("Paciente cadastrado com sucesso!");
					modalInstanceService.openOkModal();
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
					// seta paciente para prontuário
					consultaPacienteFactory.setPaciente(paciente);
					
					$location.path("/consulta");
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
		
	ctrl.excluirPaciente = function(id) {
		cadastroPacienteFactory.excluirPaciente(id).then(
				successCallback = function(response) {														
					ctrl.pacienteParaExcluir = {};					
					ctrl.carregarPacientes();					
					modalInstanceFactory.setMsgOk("Paciente excluído com sucesso!");
					modalInstanceService.openOkModal();					
				},
				errorCallback = function (error, status) { 	
					tratarExcecao(error); 
				}
		);		
	}
	
	ctrl.ativarDesativarPaciente = function(paciente) {
		if (paciente.ativo) {
			paciente.ativo = false;
		} else {
			paciente.ativo = true;
		}
		
		cadastroPacienteFactory.atualizarPaciente(paciente).then(
				successCallback = function(response) {														
					ctrl.pacienteParaExcluir = {};					
					ctrl.carregarPacientes();			
					if (paciente.ativo) {
						modalInstanceFactory.setMsgOk("Paciente ativado com sucesso!");
					} else {
						modalInstanceFactory.setMsgOk("Paciente desativado com sucesso!");
					}					
					modalInstanceService.openOkModal();					
				},
				errorCallback = function (error, status) { 	
					tratarExcecao(error); 
				}
		);	
	}
	
	carregarConfiguracoes();
	carregarConveniosAtivos();
	ctrl.carregarPacientes();	
}]);