// Modulos desta controller
var lazyModules = ['ngTable'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('FinanceiroCtrl',['$scope', '$mdDialog', 'financeiroFactory', 'NgTableParams', 'utilService', 
	function($scope, $mdDialog,	financeiroFactory, NgTableParams, utilService) {
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
						var lstDespesas = financeiroFactory.getLstDespesas(); 
						var index = lstDespesas.indexOf(despesa);						
						if (index > -1) {				
							lstDespesas.splice(index, 1);							
							financeiroFactory.setLstDespesas(angular.copy(lstDespesas));							

							if (despesa.pago) {
								var totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
								financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas - despesa.valor);
							} else {
								var totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
								financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas - despesa.valor);
							}
							
							var totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
							financeiroFactory.setTotalDespesasPeriodo(totalDespesas - despesa.valor);
							
							var dtInicioMesCorrente = financeiroFactory.getDtInicioMesCorrente();
							var dtFimMesCorrente = financeiroFactory.getDtFimMesCorrente();
							if (despesa.vencimento >= dtInicioMesCorrente && despesa.vencimento <= dtFimMesCorrente) {
								totalDespesasMesCorrente = financeiroFactory.getTotalDespesasMesCorrente();
								financeiroFactory.setTotalDespesasMesCorrente(totalDespesasMesCorrente - despesa.valor);
							}
						}
						
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
		financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {							
					financeiroFactory.setLstDespesas(response.data);					
					
					var totalDespesas = 0;
					var totalDespesasPagas = 0;
					var totalDespesasNaoPagas = 0;
					response.data.forEach(function(despesa) {
						if (despesa.pago) {
							totalDespesasPagas += despesa.valor;
						} else {
							totalDespesasNaoPagas += despesa.valor;
						}
						totalDespesas += despesa.valor;
					});
													
					financeiroFactory.setTotalDespesasPeriodo(totalDespesas);
					financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas);
					financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas);					
				},
				errorCallback = function(error) {					
					financeiroFactory.setLstDespesas({});
					utilService.tratarExcecao(error);
				}
		);				
	};
	
	ctrl.pesquisarReceitasPeriodo = function(dataInicial, dataFinal) {		
		financeiroFactory.listarConsultasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					financeiroFactory.setLstReceitas(response.data);
					var totalConsultas = 0;
					response.data.forEach(function(agendamento) {
						totalConsultas += agendamento.consulta.valor;
					});										
					financeiroFactory.setTotalConsultasPeriodo(totalConsultas);
				},
				errorCallback = function(error) {
					financeiroFactory.setTotalConsultasPeriodo(0);
					utilService.tratarExcecao(error);
				}
		);
	};
	
	ctrl.marcarPago = function(despesa) {
		var novaDespesa = angular.copy(despesa);	
		novaDespesa.pago = true;
		
		financeiroFactory.salvarDespesa(novaDespesa).then(
				successCallback = function(response) {
					var lstDespesas = financeiroFactory.getLstDespesas();				
				    var index = -1;
				    var valorDespesa = 0;
					for(var i = 0; i < lstDespesas.length; i++) {
						if (lstDespesas[i].id === novaDespesa.id) {						
							index = i;
							valorDespesa = lstDespesas[i].valor; 
							lstDespesas[i].pago = true;
							break;
						}
					}
										
					if (index > -1) {
						var totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
						financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas + valorDespesa);
						
						var totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
						financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas - valorDespesa);											
					}					
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		);		
	};
	
	ctrl.dtInicio = new Date(moment().startOf('month').local());
	ctrl.dtFim = new Date(moment().endOf('month').local());	
	ctrl.pesquisarDespesasPeriodo(ctrl.dtInicio, ctrl.dtFim);
	ctrl.pesquisarReceitasPeriodo(ctrl.dtInicio, ctrl.dtFim);
}]);