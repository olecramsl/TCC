angular.module('syspsi').controller('DashboardCtrl', ['financeiroFactory', 'utilService', function(financeiroFactory, utilService) {
	var ctrl = this;
	
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
					
					ctrl.totalDespesasMesCorrente = totalDespesas;
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
					ctrl.totalConsultasMesCorrente = totalConsultas;
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