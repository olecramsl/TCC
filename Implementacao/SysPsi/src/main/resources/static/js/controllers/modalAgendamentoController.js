angular.module('syspsi').controller('ModalAgendamentoCtrl', ['$uibModalInstance', '$location', '$mdDialog', 'agendamentoFactory', 'configFactory', 
	'modalAgendamentoFactory', 'modalAgendamentoService', 'consultaPacienteFactory', 'config', function ($uibModalInstance, $location, 
			$mdDialog, agendamentoFactory, configFactory, modalAgendamentoFactory, modalAgendamentoService,	consultaPacienteFactory, config) {
	
	var ctrl = this;		
	
	ctrl.lstPacientesAtivos = agendamentoFactory.getLstPacientesAtivos();
	ctrl.indexPacienteSelecionado = agendamentoFactory.getIndexPacienteSelecionado();
	ctrl.agendamento = agendamentoFactory.getAgendamento();
	ctrl.agendamentoCarregado = agendamentoFactory.getAgendamentoCarregado();	
	ctrl.msgConfirmacao = modalAgendamentoFactory.getMsgConfirmacao();
	ctrl.tipoConfirmacao = modalAgendamentoFactory.getTipoConfirmacao();	
	
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
		 agendamentoFactory.listarAgendamentos(view.start, view.end).then(
				 successCallback = function (response) {
					 angular.element('.calendar').fullCalendar('renderEvents',response.data);
				 },
				 errorCallback = function (error) {	  			  		  
					 tratarExcecao(error);
				 }
		 );		
	 };
	 
	 /**
	  * Remove os agendamentos futuros associados a um evento semanal
	  */
	 var removerEventosFuturos = function (agendamento) {		
		 agendamentoFactory.removerAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {	  				    									
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Move os agendamentos futuros associados a um evento semanal
	  */
	 var moverEventosFuturos = function (agendamento) {			 	
		 agendamentoFactory.moverAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {					
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Atualizar os agendamentos futuros associados a um evento semanal
	  */
	 var atualizarEventosFuturos = function (agendamento) {		 
		 agendamentoFactory.atualizarAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {					
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){					
					 tratarExcecao(error);			  						
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

			var agendamentoDTO = agendamentoFactory.prepararAgendamentoDTO(agendamento); 
			agendamentoFactory.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {	  				   					
						var event = angular.element('.calendar').fullCalendar('clientEvents',agendamento.id);																								
						if (event.length > 0) {
							agendamento.title = updateTitle(agendamento);
							
							if (agendamento.repetirSemanalmente) {
								atualizarViewFC();
							} else {
								angular.element('.calendar').fullCalendar('removeEvents', agendamento.id);
								angular.element('.calendar').fullCalendar('renderEvent', response.data);
							}
																		
						} else {								
							$mdDialog.show(
								$mdDialog.alert()
									.clickOutsideToClose(true)
									.title('Algo saiu errado ...')
									.textContent("Não foi possível encontrar o agendamento com o id informado!")
									.ariaLabel('Alerta')
									.ok('Ok')						
							);
							
						}	
						
						if (agendamento.eventoPrincipal) {									  
							agendamentoFactory.atribuirNovoEventoPrincipal(ctrl.agendamento);
						}
						
						if ((agendamento.grupo > 0) && (!agendamento.repetirSemanalmente) && 
							(agendamento.formatedStart === agendamentoCarregado.formatedStart)) {
							modalAgendamentoFactory.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
							modalAgendamentoFactory.setMsgConfirmacao("Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?");				
							modalAgendamentoService.openConfirmModal();
						} else if ((agendamento.grupo > 0) && ((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								  (agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							modalAgendamentoFactory.setTipoConfirmacao(config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS);							
							modalAgendamentoFactory.setMsgConfirmacao("Replicar alterações nos eventos futuros?");							
							modalAgendamentoService.openConfirmModal();
						}
					},
					errorCallback = function (error, status){					
						tratarExcecao(error);			  							
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
					
			
			var agendamentoDTO = agendamentoFactory.prepararAgendamentoDTO(agendamento);
			agendamentoFactory.salvarAgendamento(agendamentoDTO).then(
					successCallback = function(response) {				
						atualizarViewFC();
					},
					errorCallBack = function(error) {
						tratarExcecao(error);
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
		modalAgendamentoFactory.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTO);
		modalAgendamentoFactory.setMsgConfirmacao("Tem certeza que deseja excluir o agendamento?");
		modalAgendamentoService.openConfirmModal();
		
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove um evento
	 */
	var removerEvento = function(agendamento) {			
		agendamentoFactory.removerAgendamento(agendamento).then(
				successCallback = function(response) {
					if (agendamento.grupo > 0 && agendamento.eventoPrincipal) {
						agendamentoFactory.atribuirNovoEventoPrincipal(agendamento).then(
								successCallback = function(response) {									
									angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
								},
								errorCallback = function (error, status){					
									tratarExcecao(error);			  						
								}
						);
					}
					angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
				},
				errorCallback = function (error, status){					
					tratarExcecao(error);			  						
				}
			);				
		$uibModalInstance.close();
		
		if (agendamento.grupo > 0) {
			modalAgendamentoFactory.setTipoConfirmacao(config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS);
			modalAgendamentoFactory.setMsgConfirmacao("Remover também os eventos futuros?");
			modalAgendamentoService.openConfirmModal();
		}		
	};
	
	ctrl.iniciarConsulta = function(agendamento) {
		consultaPacienteFactory.getConsultaByIdAgendamento(agendamento.id).then(
				successCallback = function(response) {
					consultaPacienteFactory.setPaciente(agendamento.paciente);
					consultaPacienteFactory.setFim(null);
					if (response.data.id) {				
						consultaPacienteFactory.setId(response.data.id);						
						consultaPacienteFactory.setAgendamento(response.data.agendamento);
						consultaPacienteFactory.setProntuario(response.data.prontuario);
						consultaPacienteFactory.setInicio(response.data.inicio);						
						$location.path('/consulta');
					} else {
						if (agendamento.paciente) {
							consultaPacienteFactory.setId(null);
							consultaPacienteFactory.setAgendamento(agendamento);
							consultaPacienteFactory.setProntuario(null);
							consultaPacienteFactory.setInicio(new Date());							
							$location.path('/consulta');
						} else {
							$mdDialog.show(
								$mdDialog.alert()
									.clickOutsideToClose(true)
									.title('Algo saiu errado ...')
									.textContent("Não foi possível localizar o paciente da consulta!")
									.ariaLabel('Alerta')
									.ok('Ok')						
							);							
						}
					}
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);
		$uibModalInstance.close();			
	};
	
	/**
	 * Direciona para função correta quando selecionado "Sim" na janela modal de confirmação
	 */
	ctrl.confirmar = function(agendamento, tipoConfirmacao) {	
		if (tipoConfirmacao === config.tiposConfirmacoes.REMOVER_EVENTOS_FUTUROS) {
			removerEventosFuturos(agendamento);			
		} else if (tipoConfirmacao === config.tiposConfirmacoes.MOVER_EVENTOS) {
			moverEventosFuturos(agendamento);
		} else if (tipoConfirmacao === config.tiposConfirmacoes.ALTERAR_DADOS_FUTUROS) {
			atualizarEventosFuturos(agendamento);
		} else if (tipoConfirmacao === config.tiposConfirmacoes.REMOVER_EVENTO) {
			removerEvento(agendamento);
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
}]);