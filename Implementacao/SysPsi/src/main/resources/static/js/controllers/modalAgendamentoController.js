angular.module('syspsi').controller('ModalAgendamentoCtrl', function ($uibModalInstance, $q, $scope, agendaAPI, configAPI, config, modal) {		
	
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
	 * Cancela a operação na janela modal
	 */
	$scope.cancelar = function () {				
		$uibModalInstance.dismiss('cancel');		
	};		
	
	/**
	 * Salva/atualiza as informações de um agendamento
	 */
	$scope.salvar = function (agendamento, agendamentoCarregado) {
		// Edicao				
		if (agendamento.id) {	
			var horas = agendamento.formatedStart.split(":")[0];
			var minutos = agendamento.formatedStart.split(":")[1];
			agendamento.start = moment(agendamento.start).hour(horas).minute(minutos);
			agendamento.end = moment(agendamento.start).add(configSys.tempoSessao, 'm');			

			var agendamentoDTO = agendaAPI.prepareAgendamentoDTO(agendamento); 
			agendaAPI.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {	  				   					
						var event = angular.element('.calendar').fullCalendar('clientEvents',agendamento.id);
						if (event) {
							agendamento.title = updateTitle(agendamento);
							
							if (agendamento.repetirSemanalmente) {
								$scope.atualizarViewFC();
							} else {
								angular.element('.calendar').fullCalendar('removeEvents', agendamento.id);
								angular.element('.calendar').fullCalendar('renderEvent', response.data);
							}
																		
						} else {
							modal.setMsgErro("Não foi possível encontrar o agendamento com o id informado!");
							angular.element('#AgendaCtrl').scope().$ctrl.openErroModal(); 
						}	
						
						if (agendamento.eventoPrincipal) {									  
							  agendaAPI.atribuirNovoEventoPrincipal($scope.agendamento);
						}
						
						if ((agendamento.grupo > 0) && (!agendamento.repetirSemanalmente) && 
							(agendamento.formatedStart === agendamentoCarregado.formatedStart)) {
							modal.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
							modal.setMsgConfirmacao("Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?");				
							angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();							
						} else if ((agendamento.grupo > 0) && ((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								  (agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							modal.setTipoConfirmacao(config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS);							
							modal.setMsgConfirmacao("Replicar alterações nos eventos futuros?");
							angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
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
					
			
			var agendamentoDTO = agendaAPI.prepareAgendamentoDTO(agendamento);
			agendaAPI.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {				
						$scope.atualizarViewFC();
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
	 * Remove os eventos da view e popula com eventos atualizados/salvos
	 */
	$scope.atualizarViewFC = function() {
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
	 * Confirma com o usuário a remoção do evento
	 */
	$scope.confirmarRemocaoEvento = function (agendamento) {		
		modal.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTO);
		modal.setMsgConfirmacao("Tem certeza que deseja excluir o agendamento?");
		angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
		
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove um evento
	 */
	$scope.removerEvento = function(agendamento) {			
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
			modal.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
			modal.setMsgConfirmacao("Remover também os eventos futuros?");
			angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
		}		
	};
	
	/**
	 * Direciona para função correta quando selecionado "Sim" na janela modal de confirmação
	 */
	$scope.confirmar = function(agendamento, tipoConfirmacao) {	
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
	$scope.naoConfirmar = function (agendamento) {
		$uibModalInstance.close();		
	};
	
	/**
	 * Remove os agendamentos futuros associados a um evento semanal
	 */
	$scope.removerEventosFuturos = function (agendamento) {		
		agendaAPI.removerAgendamentosFuturos(agendamento).then(
				successCallback = function(response) {	  				    									
					$scope.atualizarViewFC();			
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
	$scope.moverEventosFuturos = function (agendamento) {			 	
		agendaAPI.moverAgendamentosFuturos(agendamento).then(
				successCallback = function(response) {					
					$scope.atualizarViewFC();			
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
	$scope.atualizarEventosFuturos = function (agendamento) {
		console.log(agendamento.id);
		agendaAPI.atualizarAgendamentosFuturos(agendamento).then(
				successCallback = function(response) {					
					$scope.atualizarViewFC();			
				},
				errorCallback = function (error, status){					
					angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				}
		);	
		$uibModalInstance.close();
	};		
	
	carregarConfiguracoes();
});