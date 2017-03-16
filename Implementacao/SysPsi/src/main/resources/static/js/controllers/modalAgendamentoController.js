angular.module('syspsi').controller('ModalAgendamentoCtrl', function ($uibModalInstance, $q, $rootScope, $scope, $location, agendaAPI,  
		configAPI, config, modalAgendamentoAPI, consultaAPI) {	
	var ctrl = this;
	
	ctrl.lstPacientesAtivos = agendaAPI.getLstPacientesAtivos();
	ctrl.indexPacienteSelecionado = agendaAPI.getIndexPacienteSelecionado();
	ctrl.agendamento = agendaAPI.getAgendamento();
	ctrl.agendamentoCarregado = agendaAPI.getAgendamentoCarregado();	
	ctrl.msgConfirmacao = modalAgendamentoAPI.getMsgConfirmacao();
	
	/**
	 * Configurações do sistema
	 */  
	var carregarConfiguracoes = function() {
		configAPI.loadConfig().then(
				successCallback = function(response) {	
					configSys = response.data;	    	  
				},
		  	  	errorCallback = function (error, status){
					$scope.tratarExcecao(error); 
		  	  	}
		  	);     
	 };
	 
	 /**
	  * Atualiza o campo description do agendamento
	  */
	 var updateTitle = function (agendamento) {		
		 return agendamento.description ? agendamento.paciente.nomeExibicao + " (" +
				 agendamento.description + ")" : agendamento.paciente.nomeExibicao;			  
	 };
	 
	 /**
	  * Remove os eventos da view e popula com eventos atualizados/salvos
	  */
	 var atualizarViewFC = function() {
		 angular.element('.calendar').fullCalendar('removeEvents');
		 // Atualiza a view para o caso de haver algum evento semanal
		 view = angular.element('.calendar').fullCalendar('getView');
		 var params = {dataInicial: view.start.format(), dataFinal: view.end.format()};
		 agendaAPI.listarAgendamentos(params).then(
				 successCallback = function (response) {
					 angular.element('.calendar').fullCalendar('renderEvents',response.data);
				 },
				 errorCallback = function (error) {	  			  		  
					 angular.element('#AgendaCtrl').scope().tratarExcecao(error);
				 }
		 );		
	 };
	 
	 /**
	  * Remove os agendamentos futuros associados a um evento semanal
	  */
	 var removerEventosFuturos = function (agendamento) {		
		 agendaAPI.removerAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {	  				    									
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Move os agendamentos futuros associados a um evento semanal
	  */
	 var moverEventosFuturos = function (agendamento) {			 	
		 agendaAPI.moverAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {					
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Atualizar os agendamentos futuros associados a um evento semanal
	  */
	 var atualizarEventosFuturos = function (agendamento) {		 
		 agendaAPI.atualizarAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {					
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	/**
	 * Cancela a operação na janela modal
	 */
	ctrl.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};		
	
	/**
	 * Salva/atualiza as informações de um agendamento
	 */
	ctrl.salvar = function (agendamento, agendamentoCarregado) {
		// Edicao				
		if (agendamento.id) {	
			var horas = agendamento.formatedStart.split(":")[0];
			var minutos = agendamento.formatedStart.split(":")[1];
			agendamento.start = moment(agendamento.start).hour(horas).minute(minutos);
			agendamento.end = moment(agendamento.start).add(configSys.tempoSessao, 'm');			

			var agendamentoDTO = agendaAPI.prepararAgendamentoDTO(agendamento); 
			agendaAPI.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {	  				   					
						var event = angular.element('.calendar').fullCalendar('clientEvents',agendamento.id);
						if (event) {
							agendamento.title = updateTitle(agendamento);
							
							if (agendamento.repetirSemanalmente) {
								atualizarViewFC();
							} else {
								angular.element('.calendar').fullCalendar('removeEvents', agendamento.id);
								angular.element('.calendar').fullCalendar('renderEvent', response.data);
							}
																		
						} else {
							modalAgendamentoAPI.setMsgErro("Não foi possível encontrar o agendamento com o id informado!");
							angular.element('#AgendaCtrl').scope().ctrl.openErroModal(); 
						}	
						
						if (agendamento.eventoPrincipal) {									  
							  agendaAPI.atribuirNovoEventoPrincipal($scope.agendamento);
						}
						
						if ((agendamento.grupo > 0) && (!agendamento.repetirSemanalmente) && 
							(agendamento.formatedStart === agendamentoCarregado.formatedStart)) {
							modalAgendamentoAPI.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
							modalAgendamentoAPI.setMsgConfirmacao("Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?");				
							//angular.element('#AgendaCtrl').scope().ctrl.openConfirmModal();
							modalAgendamentoAPI.openConfirmModal();
						} else if ((agendamento.grupo > 0) && ((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								  (agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							modalAgendamentoAPI.setTipoConfirmacao(config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS);							
							modalAgendamentoAPI.setMsgConfirmacao("Replicar alterações nos eventos futuros?");
							//angular.element('#AgendaCtrl').scope().ctrl.openConfirmModal();
							modalAgendamentoAPI.openConfirmModal();
						}
					},
					errorCallback = function (error, status){					
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  							
					}					
			);			
		// Novo agendamento
		} else if (agendamento.paciente) {				
			agendamento.title = updateTitle(agendamento);
			var horarioConsulta = agendamento.formatedStart.split(":");
			agendamento.start = moment(agendamento.start).hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);
			agendamento.end = moment(agendamento.start).add(configSys.tempoSessao, 'm');
			agendamento.ativo = true;
			agendamento.grupo = 0;
					
			
			var agendamentoDTO = agendaAPI.prepararAgendamentoDTO(agendamento);
			agendaAPI.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {				
						atualizarViewFC();
					},
					errorCallBack = function(error) {
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);
					}
			);																
		};								
		
		angular.element('.calendar').fullCalendar('unselect');												
		$uibModalInstance.close();
	};			
	
	/**
	 * Confirma com o usuário a remoção do evento
	 */
	ctrl.confirmarRemocaoEvento = function (agendamento) {		
		modalAgendamentoAPI.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTO);
		modalAgendamentoAPI.setMsgConfirmacao("Tem certeza que deseja excluir o agendamento?");
		//angular.element('#AgendaCtrl').scope().ctrl.openConfirmModal();
		modalAgendamentoAPI.openConfirmModal();
		
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove um evento
	 */
	ctrl.removerEvento = function(agendamento) {			
		agendaAPI.removerAgendamento(agendamento).then(
				successCallback = function(response) {
					if (agendamento.grupo > 0 && agendamento.eventoPrincipal) {
						agendaAPI.atribuirNovoEventoPrincipal(agendamento).then(
								successCallback = function(response) {									
									angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
								},
								errorCallback = function (error, status){					
									angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
								}
						);
					}
					angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
				},
				errorCallback = function (error, status){					
					angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				}
			);				
		$uibModalInstance.close();
		
		if (agendamento.grupo > 0) {
			modalAgendamentoAPI.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
			modalAgendamentoAPI.setMsgConfirmacao("Remover também os eventos futuros?");
			//angular.element('#AgendaCtrl').scope().ctrl.openConfirmModal();
			modalAgendamentoAPI.openConfirmModal();
		}		
	};
	
	ctrl.iniciarConsulta = function(agendamento) {		
		if (agendamento.paciente) {
			consultaAPI.setPaciente(agendamento.paciente);				
			$uibModalInstance.close();			
			$location.path('/consulta');
			
		} else {
			// erro ao pegar o paciente
		}
	}
	
	/**
	 * Direciona para função correta quando selecionado "Sim" na janela modal de confirmação
	 */
	ctrl.confirmar = function(agendamento, tipoConfirmacao) {	
		if (tipoConfirmacao === config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS) {
			$scope.removerEventosFuturos(agendamento);			
		} else if (tipoConfirmacao === config.tiposConfirmacoes.MOVER_EVENTOS) {			
			$scope.moverEventosFuturos(agendamento);
		} else if (tipoConfirmacao === config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS) {			
			$scope.atualizarEventosFuturos(agendamento);
		} else if (tipoConfirmacao === config.tiposConfirmacoes.REMOVER_EVENTO) {			
			$scope.removerEvento(agendamento);
		}
		$uibModalInstance.close();
	}
	
	/**
	 * Cancela a operação na janela modal de confirmação
	 */
	ctrl.naoConfirmar = function (agendamento) {
		$uibModalInstance.close();		
	};			
	
	/**
	 * Verifica se algum campo da modal de novo evento foi alterado
	 */
	ctrl.isDataChanged = function(agendamento, agendamentoCarregado) {	  
		if (agendamentoCarregado === null) {		  
			return true;	  
		}
		return agendamentoCarregado.paciente.id !== agendamento.paciente.id ||
		 	agendamentoCarregado.formatedStart !== agendamento.formatedStart ||
		  	agendamentoCarregado.description !== agendamento.description ||
		  	agendamentoCarregado.repetirSemanalmente !== agendamento.repetirSemanalmente;
	}
	
	carregarConfiguracoes();
});