angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', 'financeiroFactory', 'utilService', 
	function ($scope, $mdDialog, consultaPacienteFactory, financeiroFactory, utilService) {
	
	var ctrl = this;
	
	ctrl.editando = false;
	if (financeiroFactory.getDespesa()) {
		$scope.despesa = financeiroFactory.getDespesa();
		ctrl.editando = true;
	} else {
		$scope.despesa = {};
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.finalizarConsulta = function(valor, recibo) {		
		var novoValor = valor.replace(",",".");
		consultaPacienteFactory.setValor(novoValor);		
		consultaPacienteFactory.setRecibo(!!recibo);
		$mdDialog.hide();		
	};
	
	$scope.salvarDespesa = function(despesa) {
		var novaDespesa = angular.copy(despesa);		
		novaDespesa.valor = despesa.valor.replace(",", ".");
		
		if (novaDespesa.vencimento) {
			var vencimentoSplit = novaDespesa.vencimento.split("/");			
			var dia = vencimentoSplit[0];
			var mes = vencimentoSplit[1]-1;
			var ano = vencimentoSplit[2];
			var vencimento = moment();
			var vencimento = moment(vencimento).date(dia).month(mes).year(ano);
			novaDespesa.vencimento = vencimento.local();		
		}
		
		financeiroFactory.salvarDespesa(novaDespesa).then(
				successCallback = function(response) {
					if (ctrl.editando) {
						// Exclui o item da lista. Se após edição a despesa estiver no range do período, inclui novamente
						var lstDespesas = financeiroFactory.getLstDespesas();
						var antigoValor = 0;
					    var index = -1;					    
						for(var i = 0; i < lstDespesas.length; i++) {
							if (lstDespesas[i].id === novaDespesa.id) {														
								index = i;
								antigoValor = lstDespesas[i].valor;
								break;
							}
						}					
						if (index > -1) {														
							lstDespesas.splice(index, 1);
							financeiroFactory.setLstDespesas(lstDespesas);
							
							if (novaDespesa.pago) {
								var totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
								financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas - antigoValor);
							} else {
								var totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
								financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas - antigoValor);
							}
							
							var totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
							financeiroFactory.setTotalDespesasPeriodo(totalDespesas - antigoValor);
						}
					}
					
					var dtInicio = financeiroFactory.getDtInicioPeriodo();
					var dtFim = financeiroFactory.getDtFimPeriodo();
					var dtDespesa = response.data.vencimento;
					if (dtDespesa >= dtInicio && dtDespesa <= dtFim) {						
						financeiroFactory.addDespesaNaLista(response.data);
						
						if (response.data.pago) {
							var totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
							financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas + response.data.valor);
						} else {
							var totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
							financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas + response.data.valor);
						}
						
						var totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
						financeiroFactory.setTotalDespesasPeriodo(totalDespesas + response.data.valor);
					}
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error); 
				}
		);
		
		$mdDialog.hide();
	};
}]);