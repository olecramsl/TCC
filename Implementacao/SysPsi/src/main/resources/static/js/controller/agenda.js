var app = angular.module('syspsi', ['ui.bootstrap']);

app.constant('TIPOS_CONFIRMACOES', {
	'REMOVER_EVENTOS_FUTUROS': 1,
	'MOVER_EVENTOS': 2,
	'ALTERAR_DADOS_FUTUROS': 3,
	'REMOVER_EVENTO': 4,
	'REMOVER_EVENTOS_GRUPO': 5
});

app.controller('AgendaCtrl', ['$scope','$uibModal', '$http', '$q', 'TIPOS_CONFIRMACOES', function ($scope, $uibModal, $http, $q, TIPOS_CONFIRMACOES) {
  var $ctrl = this;    
  
  /**
   * Abre janela modal do agendamento
   */
  $ctrl.openEventModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/eventoModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });
    
    modalInstance.result.then(function (selectedItem) {            
    }, function () {        	
    	$scope.LimparDadosAgendamento();
    });
  };
  
  /**
   * Abre janela modal de erro
   */
  $ctrl.openErroModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/erroModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });    
  };
  
  /**
   * Abre janela modal de erro
   */
  $ctrl.openConfirmModal = function (size) {	 	
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/confirmacaoModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      scope: $scope, // bind $scope to modal window      
      size: size
    });    
  };
  
  // Objeto agendamento  
  $scope.agendamento = {
		  id                 : null,
		  gCalendarId        : null,
		  paciente	         : null,
		  psicologo			 : null,
		  title              : null,
		  start              : null,
		  end                : null,
		  formatedStart		 : null,
		  grupo		         : 0,
		  eventoPrincipal    : false,
		  description        : null,
		  repetirSemanalmente: false,
		  ativo				 : true
  };    	  
  
  // Lista de pacientes ativos cadastrados no sistema
  $scope.lstPacientesAtivos = null;
  
  // O index do paciente atribuido ao agendamento selecionado na agenda
  $scope.indexPacienteSelecionado = null;    
  
  // Mensagem de erro
  $scope.msgErro = null;
  
  // Mensagem modal confirmação
  $scope.msgConfirmacao = null;  
  $scope.tipoConfirmacao = null; 
  
  /**
   * Popula a lista de pacientes ativos
   */  
  $http.get('http://localhost:8080/listarPacientesAtivos').then(
      successCallback = function(response) {	  
    	  $scope.lstPacientesAtivos = response.data;
  	  },
  	  errorCallback = function (error, status){
  		$scope.tratarExcecao(error); 
  	  }
  );
  
  /**
   * Configurações do sistema
   */  
  $http.get('http://localhost:8080/loadConfig').then(
      successCallback = function(response) {	
    	  $scope.config = response.data;    	  
  	  },
  	  errorCallback = function (error, status){
  		$scope.tratarExcecao(error); 
  	  }
  );     

  /**
   * Limpa os dados pertinentes a um agendamento
   */
  $scope.LimparDadosAgendamento = function() {
	  $scope.agendamento = {};
  	  $scope.indexPacienteSelecionado = null;
  };
  
  /**
   * Popula o calendario com os agendamentos do BD e persiste novos agendamentos
   * na view atual, caso necessário
   */ 
  $scope.listarAgendamento = function(dataInicial, dataFinal) {
	  var params = {dataInicial: dataInicial.format(), dataFinal: dataFinal.format()};
	  $http.get('http://localhost:8080/listarAgendamentos', {params}).then(
			  successCallback = function (response) {
				  $('#calendar').fullCalendar('renderEvents',response.data);
			  },
			  errorCallback = function (error) {	  			  		  
			  		$scope.tratarExcecao(error);
			  }
	  );	  
  };      
  
  /**
   * Atualiza o título do agendamento
   */
  $scope.updateTitle = function (agendamento) {		
	  return agendamento.description ? agendamento.paciente.nomeExibicao + " (" +
			  agendamento.description + ")" : agendamento.paciente.nomeExibicao;			  
  };       
  
  /**
   * Atualiza na base de dados um evento que foi movido na agenda
   */
  $scope.updateEventDroped = function(event, oldEvent) {	  
	  event.repetirSemanalmente = false;
	  event.grupo = 0;
	  var agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(angular.copy(event));	 
	  $http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
		  successCallback = function(response) {
			  $('#calendar').fullCalendar('removeEvents', event.id);
			  $('#calendar').fullCalendar('renderEvent', response.data);
			  
			  // Mantem o evento antigo no BD para evitar o save na view quando visualizada
			  if (oldEvent.grupo > 0) {
				  oldEvent.id = null;				  
				  oldEvent.eventoPrincipal = false;
				  oldEvent.ativo = false;
				  oldEvent.repetirSemanalmente = false;				  
				  
				  agendamentoDTO = angular.element('#AgendaCtrl').scope().prepareAgendamentoDTO(angular.copy(oldEvent));
				  $http.post('http://localhost:8080/salvarAgendamento', agendamentoDTO).then(
						  successCallback = function(response) {
							  $scope.agendamento = angular.copy(event);
							  // Mantem o grupo original para pesquisa e, caso assim deseje o usuário, deslocamento dos eventos futuros
							  $scope.agendamento.grupo = oldEvent.grupo;
							  							  
							  if ($scope.agendamento.eventoPrincipal) {
								  $http.post('http://localhost:8080/atribuirNovoEventoPrincipal', angular.copy($scope.agendamento)).then(
										  /*
										  successCallback = function(response) {									
												$('#calendar').fullCalendar('removeEvents',agendamento.id);				
											},
											errorCallback = function (error, status){					
												angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
											}
											*/
								  );
							  }							    
							  var diasDiferenca = oldEvent.start.dayOfYear() - event.start.dayOfYear();							  
							  if ((diasDiferenca < 7) && (event.start.day() !== oldEvent.start.day())) {
								  $scope.tipoConfirmacao = TIPOS_CONFIRMACOES.MOVER_EVENTOS;
								  $scope.msgConfirmacao = "Você moveu um agendamento configurado para repetir semanalmente. Deseja mover também os eventos futuros associados a este agendamento?";				
								  $scope.$ctrl.openConfirmModal();	
							  }
						  },
						  errorCallback = function (error){			  
							  $scope.tratarExcecao(error);			  						
						  }
				  );
			  }
		  },
		  errorCallback = function (error){			  
			  angular.element('#AgendaCtrl').scope().tratarExcecao(error);			  						
		  }
	  );		  	 	 
  };
  
  /**
   * Retorna o DTO a ser enviado ao método salvar
   */
  $scope.prepareAgendamentoDTO = function(agendamento) {
	  view = $('#calendar').fullCalendar('getView');
	  	  
	  var dataInicialView =view.start.local();
	  var dataFinalView = view.end.local();
	  
	  return agendamentoDTO = {
				agendamento        : agendamento,
				repetirSemanalmente: agendamento.repetirSemanalmente, 
				dataInicialViewFC  : new Date(dataInicialView), 
				dataFinalViewFC    : new Date(dataFinalView)
	  };
  }
  
  /**
   * Verifica se algum campo da modal de novo evento foi alterado
   */
  $scope.isDataChanged = function(agendamento, agendamentoCarregado) {	  
	  if (agendamentoCarregado === null) {		  
		  return true;	  
	  }
	  return agendamentoCarregado.paciente.id !== agendamento.paciente.id ||
	  	agendamentoCarregado.formatedStart !== agendamento.formatedStart ||
	  	agendamentoCarregado.description !== agendamento.description ||
	  	agendamentoCarregado.repetirSemanalmente !== agendamento.repetirSemanalmente;
  }
  
  /**
   * Trata eventuais excessoes que possam ocorrer
   */
  $scope.tratarExcecao = function(error) {
	  try {
		  // captura de excecao enviada pela Controller (codigo java)
		  $scope.msgErro = error.data.message;
	  } catch(erro) {
		  // Erro nivel Javascript
		  $scope.msgErro = error;
	  }
		
	  $ctrl.openErroModal();
  }       
}]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
app.controller('ModalInstanceCtrl', ['$uibModalInstance', '$http', '$q', '$scope', 'TIPOS_CONFIRMACOES',	
	function ($uibModalInstance, $http, $q, $scope, TIPOS_CONFIRMACOES) {
		
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
							angular.element('#AgendaCtrl').scope().tipoConfirmacao = TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS;
							angular.element('#AgendaCtrl').scope().msgConfirmacao = "Você optou por não repetir este evento semanalmente. Deseja excluir os eventos futuros associados a este agendamento?";				
							angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();							
						} else if ((agendamento.grupo > 0) && ((agendamento.formatedStart !== agendamentoCarregado.formatedStart) || 
								  (agendamentoCarregado.paciente.id !== agendamento.paciente.id))) {
							angular.element('#AgendaCtrl').scope().tipoConfirmacao = TIPOS_CONFIRMACOES.ALTERAR_DADOS_FUTUROS;
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
		$scope.listarAgendamento(view.start, view.end);
	}
	
	/**
	 * Confirma com o usuário a remoção do evento
	 */
	$scope.confirmarRemocaoEvento = function (agendamento) {		
		angular.element('#AgendaCtrl').scope().tipoConfirmacao = TIPOS_CONFIRMACOES.REMOVER_EVENTO;
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
			angular.element('#AgendaCtrl').scope().tipoConfirmacao = TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS;
			angular.element('#AgendaCtrl').scope().msgConfirmacao = "Remover também os eventos futuros?";
			angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
		}
		/*
		else if((agendamento.grupo > 0) && (agendamento.eventoPrincipal)) {
			angular.element('#AgendaCtrl').scope().tipoConfirmacao = TIPOS_CONFIRMACOES.REMOVER_EVENTOS_GRUPO;
			angular.element('#AgendaCtrl').scope().msgConfirmacao = "Você está removendo o agendamento principal de um agendamento semanal. Isso removerá todos agendamentos futuros associados a este agendamento. Deseja prosseguir?";
			angular.element('#AgendaCtrl').scope().$ctrl.openConfirmModal();
		}
		*/
	};
	
	/**
	 * Direciona para função correta quando selecionado "Sim" na janela modal de confirmação
	 */
	$scope.confirmar = function(agendamento, tipoConfirmacao) {
		if (tipoConfirmacao === TIPOS_CONFIRMACOES.REMOVER_EVENTOS_FUTUROS) {
			$scope.removerEventosFuturos(agendamento);			
		} else if (tipoConfirmacao === TIPOS_CONFIRMACOES.MOVER_EVENTOS) {			
			$scope.moverEventosFuturos(agendamento);
		} else if (tipoConfirmacao === TIPOS_CONFIRMACOES.ALTERAR_DADOS_FUTUROS) {			
			$scope.atualizarEventosFuturos(agendamento);
		} else if (tipoConfirmacao === TIPOS_CONFIRMACOES.REMOVER_EVENTO) {			
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
}]);