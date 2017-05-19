angular.module('syspsi').controller('DashboardCtrl', ['$scope', 'financeiroFactory', 'utilService', function($scope, financeiroFactory, 
		utilService) {
	var ctrl = this;
	
	$scope.$watch(function() { return financeiroFactory.getTotalConsultasMesCorrente(); }, function(newValue, oldValue) {
		ctrl.totalConsultasMesCorrente = newValue;
	});
	
	$scope.$watch(function() { return financeiroFactory.getTotalDespesasMesCorrente(); }, function(newValue, oldValue) {
		ctrl.totalDespesasMesCorrente = newValue;
	});
	
	var carregarDespesasDoMes = function() {		
		var dataInicial = moment().startOf('month').local().format();
		var dataFinal = moment().endOf('month').local().format();
		
		financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {					
					financeiroFactory.setLstDespesas(response.data);
					
					totalDespesas = 0;
					totalDespesasPagas = 0;
					totalDespesasNaoPagas = 0;
					response.data.forEach(function(despesa) {
						if (despesa.pago) {
							totalDespesasPagas += despesa.valor;
						} else {
							totalDespesasNaoPagas += despesa.valor;
						}
						totalDespesas += despesa.valor;
					});
															
					financeiroFactory.setTotalDespesasMesCorrente(totalDespesas);
					financeiroFactory.setTotalDespesasPeriodo(totalDespesas);
					financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas);
					financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas);
				},
				errorCallback = function(error) {
					financeiroFactory.setLstDespesas({});
					utilService.tratarExcecao(error);
				}
		);
		
		financeiroFactory.listarConsultasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					var totalConsultas = 0;
					response.data.forEach(function(agendamento) {
						totalConsultas += agendamento.consulta.valor;
					});					
					financeiroFactory.setTotalConsultasMesCorrente(totalConsultas);
					financeiroFactory.setTotalConsultasPeriodo(totalConsultas);
				},
				errorCallback = function(error) {
					financeiroFactory.setTotalConsultasPeriodo(0);
					utilService.tratarExcecao(error);
				}
		);
	};
	
	if (!financeiroFactory.getLstDespesas()) {
		carregarDespesasDoMes();
	}
}]);