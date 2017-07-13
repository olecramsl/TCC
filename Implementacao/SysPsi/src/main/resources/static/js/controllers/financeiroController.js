// Modulos desta controller
var lazyModules = ['ngTable'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('FinanceiroCtrl',['$scope', '$mdDialog', 'financeiroFactory', 
	'NgTableParams', 'utilService', function($scope, $mdDialog,	financeiroFactory, NgTableParams, 
			utilService) {
	var ctrl = this;							 	 		
	
	$scope.$watch(function () { return financeiroFactory.getLstReceitas(); }, function (newValue, oldValue) {
		ctrl.tableReceitasParams = new NgTableParams({ count: 5, sorting: { start: "asc" } }, { counts: [], dataset: newValue });		
	});
	
	$scope.$watch(function () { return financeiroFactory.getLstDespesas(); }, function (newValue, oldValue) {
		ctrl.tableDespesasParams = new NgTableParams({ count: 5, sorting: { vencimento: "asc" } }, { counts: [], dataset: newValue });		
	});
	
	$scope.$watch(function () { return ctrl.dtInicio; }, function (newValue, oldValue) {
		financeiroFactory.setDtInicioPeriodo(newValue);
	   	if (newValue > ctrl.dtFim) {
	   		ctrl.dtFim = ctrl.dtInicio;
	   	}
	});
	
	$scope.$watch(function () { return ctrl.dtFim; }, function (newValue, oldValue) {
		financeiroFactory.setDtFimPeriodo(newValue);
	});
	
	$scope.$watch(function () { return financeiroFactory.getTotalConsultasPeriodo(); }, function (newValue, oldValue) {		
		ctrl.totalConsultasPeriodo = newValue;
	});
	
	$scope.$watch(function () { return financeiroFactory.getTotalDespesasPeriodo(); }, function (newValue, oldValue) {		
		ctrl.totalDespesasPeriodo = newValue;
	});
	
	$scope.$watch(function () { return financeiroFactory.getTotalDespesasPagasPeriodo(); }, function (newValue, oldValue) {		
		ctrl.totalDespesasPagasPeriodo = newValue;
	});
	
	$scope.$watch(function () { return financeiroFactory.getTotalDespesasNaoPagasPeriodo(); }, function (newValue, oldValue) {		
		ctrl.totalDespesasNaoPagasPeriodo = newValue;
	});		
	
	ctrl.searchDisabled = false;
	
	ctrl.cadastrarDespesa  = function() {
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/cadastrar_despesa_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {	
			financeiroFactory.setDespesa({});			
		}, function() {
			financeiroFactory.setDespesa({});
		});		
	};
	
	ctrl.excluirDespesa = function(despesa) {
		var confirm = $mdDialog.confirm()
			.title('Atenção')
			.textContent('Você tem certeza que deseja excluir essa despesa?')				
			.ok('Sim')
			.cancel('Não');

		$mdDialog.show(confirm).then(function() {  			
			financeiroFactory.excluirDespesa(despesa).then(
					successCallback = function(response) {
						financeiroFactory.setLstDespesas(response.data.lstDespesas);
						financeiroFactory.setTotalDespesasPeriodo(response.data.totalDespesas);
						financeiroFactory.setTotalDespesasPagasPeriodo(response.data.totalDespesasPagas);
						financeiroFactory.setTotalDespesasNaoPagasPeriodo(response.data.totalDespesasNaoPagas);
					},
					errorCallback = function(error) {
						utilService.tratarExcecao(error);
					}										
			);
		}, function() {});		
	};
	
	ctrl.editarDespesa = function(despesa) {
		var edtDespesa = angular.copy(despesa);
		if (edtDespesa.vencimento) {						
			var dataFormatada = new Date(edtDespesa.vencimento);			
			var dia = dataFormatada.getDate() < 10?"0"+dataFormatada.getDate():dataFormatada.getDate();			
			var mes = (dataFormatada.getMonth()+1) < 10?"0"+(dataFormatada.getMonth()+1):(dataFormatada.getMonth()+1);			
			var ano = dataFormatada.getFullYear();			
			edtDespesa.vencimento = dia + "/" + mes + "/" + ano;			
		}
		
		financeiroFactory.setDespesa(edtDespesa);		
		
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/cadastrar_despesa_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {	
			financeiroFactory.setDespesa({});
		}, function() {
			financeiroFactory.setDespesa({});
		});
	};	
	
	ctrl.pesquisarDespesasPeriodo = function(dataInicial, dataFinal) {		
		ctrl.searchDisabled = true;
		financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					financeiroFactory.setLstDespesas(response.data.lstDespesas);
					financeiroFactory.setTotalDespesasPeriodo(response.data.totalDespesas);
					financeiroFactory.setTotalDespesasPagasPeriodo(response.data.totalDespesasPagas);
					financeiroFactory.setTotalDespesasNaoPagasPeriodo(response.data.totalDespesasNaoPagas);
				},
				errorCallback = function(error) {					
					financeiroFactory.setLstDespesas({});
					ctrl.searchDisabled = false;
					utilService.tratarExcecao(error);
				}
		);				
	};
	
	ctrl.pesquisarReceitasPeriodo = function(dataInicial, dataFinal) {
		ctrl.searchDisabled = true;
		financeiroFactory.listarConsultasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					financeiroFactory.setLstReceitas(response.data.lstAgendamentos);
					financeiroFactory.setTotalConsultasPeriodo(response.data.totalConsultas);
				},
				errorCallback = function(error) {
					financeiroFactory.setTotalConsultasPeriodo(0);
					ctrl.searchDisabled = false;
					utilService.tratarExcecao(error);
				}
		);
	};
	
	ctrl.marcarPago = function(despesa) {
		var novaDespesa = angular.copy(despesa);	
		novaDespesa.pago = true;
		
		financeiroFactory.salvarDespesa(novaDespesa).then(
				successCallback = function(response) {
					financeiroFactory.setLstDespesas(response.data.lstDespesas);
					financeiroFactory.setTotalDespesasPeriodo(response.data.totalDespesas);
					financeiroFactory.setTotalDespesasPagasPeriodo(response.data.totalDespesasPagas);
					financeiroFactory.setTotalDespesasNaoPagasPeriodo(response.data.totalDespesasNaoPagas);
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		);		
	};
	
	ctrl.editarConsulta = function(agendamento) {		
		financeiroFactory.setAgendamento(agendamento);
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/editar_consulta_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {			
			financeiroFactory.setAgendamento({});
		}, function() {			
			financeiroFactory.setAgendamento({});
		});
	};
		
	ctrl.imprimirRelatorioReceitas = function(dataInicial, dataFinal) {
		utilService.setMessage("Gerando relatório ...");
		utilService.showWait();
		financeiroFactory.imprimirRelatorioReceitas(dataInicial, dataFinal).then(
				successCallback = function(response) {	
					utilService.hideWait();			
					var file = new Blob([response.data], {
				    	type: 'application/pdf'
				    });
				    var fileURL = URL.createObjectURL(file);				    
					window.open(fileURL);							
				},
				errorCallback = function(error) {
					utilService.hideWait();
					utilService.tratarExcecao(error);
				}
		);
	};	
	
	ctrl.imprimirRelatorioDespesas = function(dataInicial, dataFinal) {
		utilService.setMessage("Gerando relatório ...");
		utilService.showWait();
		financeiroFactory.imprimirRelatorioDespesas(dataInicial, dataFinal).then(
				successCallback = function(response) {
					utilService.hideWait();
					var file = new Blob([response.data], {
				    	type: 'application/pdf'
				    });
				    var fileURL = URL.createObjectURL(file);				    
					window.open(fileURL);							
				},
				errorCallback = function(error) {
					utilService.hideWait();
					utilService.tratarExcecao(error);
				}
		);
	};
	
	ctrl.dtInicio = new Date(moment().startOf('month').local());
	ctrl.dtFim = new Date(moment().endOf('month').local());	
	ctrl.pesquisarDespesasPeriodo(ctrl.dtInicio, ctrl.dtFim);
	ctrl.pesquisarReceitasPeriodo(ctrl.dtInicio, ctrl.dtFim);
}]);