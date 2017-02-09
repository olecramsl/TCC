// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
angular.module('syspsi').controller('ModalInstanceCtrl', function ($uibModalInstance, $q, $scope, agendaAPI) {
		
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
			agendamento.end = moment(agendamento.start).add(angular.element('#AgendaCtrl').scope().config.tempoSessao, 'm');			

			var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(agendamento); 
			$http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
					successCallback = function(response) {	  				   					
						var event = $('#calendar').fullCalendar('clientEvents',agendamento.id);
						if (event) {
							agendamento.title = angular.element('#AgendaCtrl').scope().updateTitle(agendamento);
							
							if (agendamento.repetirSemanalmente) {
								$scope.atualizarViewFC();
							} else {
								$('#calendar').fullCalendar('removeEvents', agendamento.id);
								$('#calendar').fullCalendar('renderEvent', response.data);
							}
																		
						} else {
							angular.element('#AgendaCtrl').scope().msgErro = "Não foi possível encontrar o agendamento com o id informado!";
							angular.element('#AgendaCtrl').scope().$ctrl.openErroModal(); 
						}	
						
						if ((agendamento.grupo > 0) && (!agendamento.repetirSemanalmente) && 
							(agendamento.formatedStart === agendamentoCarregado.formatedStart)) {
							angular.element('#AgendaCtrl').scope().tipoConfirmacao = config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS;
							angular.element('#AgendaCtrl').scope().msgConfirmacao = "Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?";				
							angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();							
						} else if ((agendamento.grupo > 0) && ((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								  (agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							angular.element('#AgendaCtrl').scope().tipoConfirmacao = config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS;
							angular.element('#AgendaCtrl').scope().msgConfirmacao = "Replicar alterações nos eventos futuros?";
							angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
						}
					},
					errorCallback = function (error, status){					
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  							
					}					
			);			
		// Novo agendamento
		} else if (agendamento.paciente) {				
			agendamento.title = angular.element('#AgendaCtrl').scope().updateTitle(agendamento);
			var horarioConsulta = agendamento.formatedStart.split(":");
			agendamento.start = moment(agendamento.start).hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);
			agendamento.end = moment(agendamento.start).add(angular.element('#AgendaCtrl').scope().config.tempoSessao, 'm');
			agendamento.ativo = true;
			agendamento.grupo = 0;
					
			
			var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(agendamento);
			$http.post('http://localhost:8080/salvarAgendamento', angular.copy(agendamentoDTO)).then(
					successCallback = function(response) {				
						$scope.atualizarViewFC();
					},
					errorCallBack = function(error) {
						angular.element('#AgendaCtrl').scope().tratarExcecao(error);
					}
			);																
		};				
		
		$('#calendar').fullCalendar('unselect');												
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove os eventos da view e popula com eventos atualizados/salvos
	 */
	$scope.atualizarViewFC = function() {
		$('#calendar').fullCalendar('removeEvents');
		// Atualiza a view para o caso de haver algum evento semanal
		view = $('#calendar').fullCalendar('getView');
		var params = {dataInicial: view.start.format(), dataFinal: view.end.format()};
		agendaAPI.listarAgendamentos(params).then(
			  successCallback = function (response) {
				  $('#calendar').fullCalendar('renderEvents',response.data);
			  },
			  errorCallback = function (error) {	  			  		  
			  		$scope.tratarExcecao(error);
			  }
		 );		
	};
	
	/**
	 * Confirma com o usuário a remoção do evento
	 */
	$scope.confirmarRemocaoEvento = function (agendamento) {		
		angular.element('#AgendaCtrl').scope().tipoConfirmacao = config.tiposConfirmacoes.REMOVER_EVENTO;
		angular.element('#AgendaCtrl').scope().msgConfirmacao = "Tem certeza que deseja excluir o agendamento?";
		angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
		
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove um evento
	 */
	$scope.removerEvento = function(agendamento) {			
		$http.post('http://localhost:8080/removerAgendamento', angular.copy(agendamento)).then(
				successCallback = function(response) {
					if (agendamento.grupo > 0 && agendamento.eventoPrincipal) {
						$http.post('http://localhost:8080/atribuirNovoEventoPrincipal', angular.copy(agendamento)).then(
								successCallback = function(response) {									
									$('#calendar').fullCalendar('removeEvents',agendamento.id);				
								},
								errorCallback = function (error, status){					
									angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
								}
						);
					}
					$('#calendar').fullCalendar('removeEvents',agendamento.id);				
				},
				errorCallback = function (error, status){					
					angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				}
			);				
		$uibModalInstance.close();
		
		if (agendamento.grupo > 0) {
			angular.element('#AgendaCtrl').scope().tipoConfirmacao = tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS;
			angular.element('#AgendaCtrl').scope().msgConfirmacao = "Remover também os eventos futuros?";
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
		$http.post('http://localhost:8080/removerAgendamentosFuturos', angular.copy(agendamento)).then(
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
		$http.post('http://localhost:8080/moverAgendamentosFuturos', agendamento).then(
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
		$http.post('http://localhost:8080/atualizarAgendamentosFuturos', agendamento).then(
				successCallback = function(response) {					
					$scope.atualizarViewFC();			
				},
				errorCallback = function (error, status){					
					angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
				}
		);	
		$uibModalInstance.close();
	};
});