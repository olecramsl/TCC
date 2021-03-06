angular.module('syspsi').controller('ModalAgendamentoCtrl', ['$scope', '$uibModalInstance', 
	'$location', '$mdDialog', 'agendamentoFactory',	'convenioFactory', 'modalAgendamentoFactory', 
	'modalAgendamentoService', 'consultaPacienteFactory', 'psicologoFactory', 'utilService', 'consts', 
	function ($scope, $uibModalInstance, $location, $mdDialog,	agendamentoFactory, convenioFactory, 
			modalAgendamentoFactory, modalAgendamentoService, consultaPacienteFactory, 
			psicologoFactory, utilService, consts) {
	
	var ctrl = this;	
		
	ctrl.lstPacientesAtivos = agendamentoFactory.getLstPacientesAtivos();
	ctrl.agendamento = agendamentoFactory.getAgendamento();
	ctrl.agendamentoCarregado = agendamentoFactory.getAgendamentoCarregado();	
	ctrl.msgConfirmacao = modalAgendamentoFactory.getMsgConfirmacao();
	ctrl.tipoConfirmacao = modalAgendamentoFactory.getTipoConfirmacao();
	ctrl.lstConveniosAtivos = convenioFactory.getLstConveniosAtivos();
	ctrl.tempoSessao = 1; // em minutos
	
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
		 utilService.setMessage("Carregando agendamentos ...");
		 utilService.showWait();		 		 
		 angular.element('.calendar').fullCalendar('removeEvents');
		 // Atualiza a view para o caso de haver algum evento semanal
		 view = angular.element('.calendar').fullCalendar('getView');
		 agendamentoFactory.listarAgendamentos(view.start, view.end).then(
				 successCallback = function (response) {					 					 
					 angular.element('.calendar').fullCalendar('renderEvents',response.data);
					 utilService.hideWait();
				 },
				 errorCallback = function (error) {	
					 utilService.hideWait();
					 utilService.tratarExcecao(error);
				 }
		 );		
	 };
	 
	 /**
	  * Remove os agendamentos futuros associados a um evento semanal
	  */
	 var removerEventosFuturos = function (agendamento) {
		 //utilService.setMessage("Removendo eventos futuros ...");
		 //utilService.showWait();			 
		 agendamentoFactory.removerAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {
					 //utilService.hideWait();
					 atualizarViewFC();					 
				 },
				 errorCallback = function (error, status){
					 //utilService.hideWait();
					 utilService.tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Move os agendamentos futuros associados a um evento semanal
	  */
	 var moverEventosFuturos = function (agendamento) {		
		 //utilService.setMessage("Movendo eventos futuros ...");
		 //utilService.showWait();		 
		 agendamentoFactory.moverAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {
					 //utilService.hideWait();
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){
					 //utilService.hideWait();
					 utilService.tratarExcecao(error);			  						
				 }
		 );	
		 $uibModalInstance.close();
	 };
	
	 /**
	  * Atualizar os agendamentos futuros associados a um evento semanal
	  */
	 var atualizarEventosFuturos = function (agendamento) {		
		 //utilService.setMessage("Atualizando eventos futuros ...");
		 //utilService.showWait();		 
		 agendamentoFactory.atualizarAgendamentosFuturos(agendamento).then(
				 successCallback = function(response) {
					 //utilService.hideWait();
					 atualizarViewFC();			
				 },
				 errorCallback = function (error, status){
					 //utilService.hideWait();
					 utilService.tratarExcecao(error);			  						
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
		// Agendamento carregado da tebela temporária gCalendar		
		if (agendamentoCarregado && !agendamentoCarregado.paciente) {
			//utilService.setMessage("Importanto agendamentos ...");
			//utilService.showWait();						 
			if (agendamento.idRecurring) {
				agendamento.repetirSemanalmente = false;
			}
			agendamentoFactory.salvarAgendamentoTemporarioGCalendar(agendamento).then(
					successCallback = function(response) {
						//utilService.hideWait();
						atualizarViewFC();						
					},
					errorCallback = function(error) {
						//utilService.hideWait();
						utilService.tratarExcecao(error);
					}
			);			
		// Edicao	
		} else if (agendamento.id) {
			//utilService.setMessage("Editando agendamento ...");
			//utilService.showWait();
						
			var horas = agendamento.formatedStart.split(":")[0];
			var minutos = agendamento.formatedStart.split(":")[1];
			agendamento.start = moment(agendamento.start).hour(horas).minute(minutos);			
			agendamento.end = moment(agendamento.start).add(ctrl.tempoSessao, 'm');			

			if (psicologoFactory.isVinculadoGCal() && agendamentoCarregado.grupo > 0) {
				agendamento.repetirSemanalmente = agendamentoCarregado.repetirSemanalmente;
			}
			
			agendamentoFactory.salvarAgendamento(agendamento).then(
					successCallback = function(response) {	  				   					
						//utilService.hideWait();
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
							modalAgendamentoFactory.setTipoConfirmacao(consts.TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS);
							modalAgendamentoFactory.setMsgConfirmacao("Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?");				
							modalAgendamentoService.openConfirmModal();
						} else if ((agendamento.grupo > 0 && !psicologoFactory.isVinculadoGCal()) && 
								((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								(agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							modalAgendamentoFactory.setTipoConfirmacao(consts.TIPOS_CONFIRMACOES.ALTERAR_DADOS_FUTUROS);							
							modalAgendamentoFactory.setMsgConfirmacao("Replicar alterações nos eventos futuros?");							
							modalAgendamentoService.openConfirmModal();
						}
					},
					errorCallback = function (error, status){						
						//utilService.hideWait();
						//utilService.tratarExcecao(error);	
						atualizarViewFC();
					}					
			);			
		// Novo agendamento
		} else if (agendamento.paciente) {			
			//utilService.setMessage("Salvando agendamento ...");
			//tilService.showWait();			
			
			agendamento.title = updateTitle(agendamento);
			var horarioConsulta = agendamento.formatedStart.split(":");
			agendamento.start = moment(agendamento.start).hour(horarioConsulta[0]).minute(horarioConsulta[1]).second(0).millisecond(0);			
			agendamento.end = moment(agendamento.start).add(ctrl.tempoSessao, 'm');
			agendamento.ativo = true;
			agendamento.grupo = 0;
					
			
			agendamentoFactory.salvarAgendamento(agendamento).then(
					successCallback = function(response) {
						//utilService.hideWait();						
					
						if (agendamento.repetirSemanalmente) {
							atualizarViewFC();
						} else {
							angular.element('.calendar').fullCalendar('renderEvent', response.data);
						}												
					},
					errorCallBack = function(error) {
						//utilService.hideWait();			
						utilService.tratarExcecao(error).then(function() {
							var view = angular.element('.calendar').fullCalendar('getView');
							listarAgendamento(view.start, view.end);
						});
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
		modalAgendamentoFactory.setTipoConfirmacao(consts.TIPOS_CONFIRMACOES.REMOVER_EVENTO);
		modalAgendamentoFactory.setMsgConfirmacao("Tem certeza que deseja excluir o agendamento?");
		modalAgendamentoService.openConfirmModal();
		
		$uibModalInstance.close();
	};		
	
	/**
	 * Remove um evento
	 */
	var removerEvento = function(agendamento) {	
		//utilService.setMessage("Removendo agendamento ...");
		//utilService.showWait();		
		agendamentoFactory.removerAgendamento(agendamento).then(
				successCallback = function(response) {					
					if (agendamento.grupo > 0 && agendamento.eventoPrincipal) {
						agendamentoFactory.atribuirNovoEventoPrincipal(agendamento).then(
								successCallback = function(response) {
									//utilService.hideWait();
									angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
								},
								errorCallback = function (error, status){
									//utilService.hideWait();
									utilService.tratarExcecao(error);			  						
								}
						);
					} else {
						//utilService.hideWait();
					}
					angular.element('.calendar').fullCalendar('removeEvents',agendamento.id);				
				},
				errorCallback = function (error, status){	
					//utilService.hideWait();
					utilService.tratarExcecao(error);			  						
				}
			);				
		$uibModalInstance.close();
						
		if ((!psicologoFactory.isVinculadoGCal() && agendamento.grupo > 0) || agendamento.eventoPrincipal) {
			modalAgendamentoFactory.setTipoConfirmacao(consts.TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS);
			modalAgendamentoFactory.setMsgConfirmacao("Remover também os eventos futuros?");
			modalAgendamentoService.openConfirmModal();
		}		 				
	};
	
	ctrl.iniciarConsulta = function(agendamento) {		
		consultaPacienteFactory.setAgendamento(agendamento);
		if (agendamento.consulta) {						
			$location.path('/consulta');
		} else {
			if (agendamento.paciente) {								
				consultaPacienteFactory.setConsulta({});
				consultaPacienteFactory.setId(null);				
				consultaPacienteFactory.setProntuario(null);
				consultaPacienteFactory.setValor(0);
				consultaPacienteFactory.setRecibo(false);
				consultaPacienteFactory.setInicio(new Date());
				consultaPacienteFactory.setFim(null);
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
		$uibModalInstance.close();			
	};
	
	/**
	 * Direciona para função correta quando selecionado "Sim" na janela modal de confirmação
	 */
	ctrl.confirmar = function(agendamento, tipoConfirmacao) {	
		if (tipoConfirmacao === consts.TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS) {
			removerEventosFuturos(agendamento);			
		} else if (tipoConfirmacao === consts.TIPOS_CONFIRMACOES.MOVER_EVENTOS) {
			moverEventosFuturos(agendamento);
		} else if (tipoConfirmacao === consts.TIPOS_CONFIRMACOES.ALTERAR_DADOS_FUTUROS) {
			atualizarEventosFuturos(agendamento);
		} else if (tipoConfirmacao === consts.TIPOS_CONFIRMACOES.REMOVER_EVENTO) {
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
		if (agendamentoCarregado === null || !agendamentoCarregado.paciente) {		  
			return true;	  
		}	

		var convenioId = null;
		var convenioCarregadoId = null;
		if (agendamento.convenio) {
			convenioId = agendamento.convenio.id;
		}
		if (agendamentoCarregado.convenio) {
			convenioCarregadoId = agendamentoCarregado.convenio.id;
		}
		
		return agendamentoCarregado.paciente.id !== agendamento.paciente.id ||
			convenioId !== convenioCarregadoId ||
		 	agendamentoCarregado.formatedStart !== agendamento.formatedStart ||
		  	agendamentoCarregado.description !== agendamento.description ||
		  	agendamentoCarregado.repetirSemanalmente !== agendamento.repetirSemanalmente ||
		  	agendamentoCarregado.naoCompareceu !== agendamento.naoCompareceu;
	};
	
	ctrl.verProntuarios = function(paciente) {
		$uibModalInstance.close();
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
}]);