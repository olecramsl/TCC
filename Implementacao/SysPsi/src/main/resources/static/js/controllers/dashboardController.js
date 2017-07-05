// Modulos desta controller
var lazyModules = ['angular.morris'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('DashboardCtrl', ['$window', '$mdDialog', '$location', 'financeiroFactory', 
	'pacienteFactory', 'convenioFactory', 'agendamentoFactory', 'configuracaoFactory',
	'consultaPacienteFactory','utilService','consts', function($window, $mdDialog, $location, 
			financeiroFactory, pacienteFactory, convenioFactory, agendamentoFactory, 
			configuracaoFactory, consultaPacienteFactory, utilService, consts) {
	var ctrl = this;						
	
	if ($location.absUrl().indexOf("?success") >= 0) {
		$location.search({});

		var confirm = $mdDialog.confirm()
	    	.title('Gostaria de exportar os agendamentos do sistema para o Google Calendar?')
	    	.textContent('Serão exportados os agendamentos da data de hoje para frente.')
	    	.ariaLabel('Exportar agendamentos para Google Calendar')
	    	.ok('Sim')
	    	.cancel('Não');
	
		$mdDialog.show(confirm).then(function() {
			utilService.setMessage("Exportando eventos para o Google Calendar.");
			utilService.showWait();
			configuracaoFactory.exportarAgendamentoParaGoogleCalendar().then(
					successCallback = function(response) {
						utilService.hideWait();
					},
					errorCallback = function(error) {
						utilService.hideWait();
						utilService.tratarExcecao(error);
					}
			);			
		}, function() {
			
		});
	} else if ($location.absUrl().indexOf("?error") >= 0) {		
		$location.search({});
		utilService.tratarExcecao("Não foi possível vincular a agenda!");			
	}	
	
	var carregarPacientesAtivos = function() {
		pacienteFactory.listarPacientesAtivosInativos(true).then(
		      successCallback = function(response) {		    	  
		    	  agendamentoFactory.setLstPacientesAtivos(response.data);	    	  
		  	  },
		  	  errorCallback = function (error, status){
		  		utilService.tratarExcecao(error); 
		  	  }
		  );
	  };   
	  
	  var carregarConveniosAtivos = function() {
		  convenioFactory.listarConveniosAtivos().then(
				  successCallback = function(response) {		    	  
			    	  convenioFactory.setLstConveniosAtivos(response.data);		    	  		    	  		    	 
			  	  },
			  	  errorCallback = function (error, status){
			  		utilService.tratarExcecao(error); 
			  	  }
			  );
	  };
	  
	  var carregarContasDoMes = function() {		
		  var dataInicial = moment().startOf('month').local().format();
		  var dataFinal = moment().endOf('month').local().format();
		
		  financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					ctrl.totalDespesasMesCorrente = response.data.totalDespesas;
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		  );
		
		  financeiroFactory.listarConsultasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					ctrl.totalConsultasMesCorrente = response.data.totalConsultas;
					
					financeiroFactory.listarConsultasNaoFinalizadasPorPeriodo(dataInicial, dataFinal).then(
							successCallback = function(response) {
								var contMasculino = 0;
						    	var contFeminino = 0;
						    	var contAdolescente = 0;
						    	var contAdulto = 0;
						    	var contCrianca = 0;
						    	var contIdoso = 0;
						    	
						    	response.data.forEach(function(item, index) {
						    		if (item.paciente.sexo === "M") {
						    			contMasculino++;
						    		} else {
						    			contFeminino++;
						    		} 
						    					    	
						    		if (item.paciente.grupo.descricao === "Adolescente") {
						    			contAdolescente++;
						    		} else if (item.paciente.grupo.descricao === "Adulto") {
						    			contAdulto++;
						    		} else if (item.paciente.grupo.descricao === "Criança") {
						    			contCrianca++;
						    		} else {
						    			contIdoso++;
						    		}
						    	});
						    	  
						    	ctrl.dataSexo = [];
						    	  
						    	if (contMasculino > 0) {			    		
						    		ctrl.dataSexo.push({label: "Masculino", value: contMasculino});
						    	}
						    	  
						    	if (contFeminino > 0) {			    		
						    		ctrl.dataSexo.push({label: "Feminino",value: contFeminino});
						    	}
						    	  
						    	ctrl.dataGrupo = [];
						    	
						    	if (contAdolescente > 0) {
						    		ctrl.dataGrupo.push({label: "Adolescente", value: contAdolescente});
					    		}
						    	
						    	if (contAdulto > 0) {
					    			ctrl.dataGrupo.push({label: "Adulto",value: contAdulto});
					    		}
						    	
						    	if (contCrianca > 0) {
					    			ctrl.dataGrupo.push({label: "Criança",value: contCrianca});
					    		}
						    	
						    	if (contIdoso > 0){
					    			ctrl.dataGrupo.push({label: "Idoso",value: contIdoso});
					    		}			
							},
							errorCallback = function(error) {
								utilService.tratarExcecao("Erro ao gerar o gráfico");
							}
						);
				},
				errorCallback = function(error) {					
					utilService.tratarExcecao(error);
				}
		  );
	  };
	  
	  var carregarAniversariantesDoMes = function() {
		  pacienteFactory.listarAniversariantesDoMes().then(
			      successCallback = function(response) {		    	  
			    	  ctrl.lstAniversariantes = response.data;	    	  
			  	  },
			  	  errorCallback = function (error, status){			  		
			  	  }
			  );
	  }
	  
	  var carregarAgendamentosDoDia = function() {
		  agendamentoFactory.listarAgendamentosDoDia().then(
			      successCallback = function(response) {		    	  
			    	  ctrl.lstAgendamentos = response.data;					    	  			    	 
			  	  },
			  	  errorCallback = function (error, status){		
			  		  utilService.tratarExcecao(error);
			  	  }
			  );
	  }
	  
	  ctrl.iniciarConsulta = function(agendamento) {
		  var ag = angular.copy(agendamento);
		  			
		  if (!ag.consulta) {
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
			  
			  ag.consulta = consulta;
		  }
		  
		  consultaPacienteFactory.setAgendamento(ag);			
		  $location.path("/consulta");		
	  }
	  
	  ctrl.sendEmail = function(paciente) {
		  console.log(paciente.email);
		  $window.open("mailto:"+ paciente.email + "?subject=" + "Feliz Aniversário!");		 
	  }
	
	carregarPacientesAtivos();
	carregarConveniosAtivos();
	carregarContasDoMes();
	carregarAniversariantesDoMes();
	carregarAgendamentosDoDia();
}]);