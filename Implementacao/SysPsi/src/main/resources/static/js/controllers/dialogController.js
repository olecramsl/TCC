angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', 'financeiroFactory', 'agendamentoFactory', 
	'utilService', function ($scope, $mdDialog, consultaPacienteFactory, financeiroFactory, agendamentoFactory, utilService) {
	
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
		var novoValor = Number(valor.replace(",","."));
		
		if (novoValor > 0) {		
			var totalConsultasPeriodo = financeiroFactory.getTotalConsultasPeriodo();
			financeiroFactory.setTotalConsultasPeriodo(totalConsultasPeriodo + novoValor);		
				
			var dataConsulta = agendamentoFactory.getStart();
			var dtInicioMesCorrente = financeiroFactory.getDtInicioMesCorrente();
			var dtFimMesCorrente = financeiroFactory.getDtFimMesCorrente();
			
			if (dataConsulta >= dtInicioMesCorrente && dataConsulta <= dtFimMesCorrente) {
				var totalConsultasMesCorrente = financeiroFactory.getTotalConsultasMesCorrente();
				financeiroFactory.setTotalConsultasMesCorrente(totalConsultasMesCorrente + novoValor);
			}
			
			consultaPacienteFactory.setValor(novoValor);		
			consultaPacienteFactory.setRecibo(!!recibo);
			$mdDialog.hide();
		} else {
			utilService.tratarExcecao("Valor da consulta inválido!")
		}		
	};
	
	$scope.salvarDespesa = function(despesa) {
		var novaDespesa = angular.copy(despesa);		
		novaDespesa.valor = despesa.valor.replace(",", ".");
		
		if (novaDespesa.valor > 0) {
		
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
						var dtInicioMesCorrente = financeiroFactory.getDtInicioMesCorrente().valueOf();
						var dtFimMesCorrente = financeiroFactory.getDtFimMesCorrente().valueOf();
						var dtInicio = financeiroFactory.getDtInicioPeriodo();
						var dtFim = financeiroFactory.getDtFimPeriodo();
						var dtDespesa = response.data.vencimento;
						var totalDespesasMesCorrente = 0;
						var totalDespesasPagas = 0;
						var totalDespesasNaoPagas = 0;
						
						if (ctrl.editando) {
							// Exclui o item da lista. Se após edição a despesa estiver no range do período, inclui novamente
							var lstDespesas = financeiroFactory.getLstDespesas();
							var antigoValor = 0;
							var vencimentoAntigo = null;
						    var index = -1;					    
							for(var i = 0; i < lstDespesas.length; i++) {
								if (lstDespesas[i].id === novaDespesa.id) {														
									index = i;
									antigoValor = lstDespesas[i].valor;
									vencimentoAntigo = lstDespesas[i].vencimento;
									break;
								}
							}					
							if (index > -1) { // Edição														
								lstDespesas.splice(index, 1);
								financeiroFactory.setLstDespesas(lstDespesas);
								
								if (novaDespesa.pago) {
									totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
									financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas - antigoValor);
								} else {
									totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
									financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas - antigoValor);
								}
															
								totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
								financeiroFactory.setTotalDespesasPeriodo(totalDespesas - antigoValor);
								
								if (vencimentoAntigo && vencimentoAntigo >= dtInicioMesCorrente && vencimentoAntigo <= dtFimMesCorrente) {
									totalDespesasMesCorrente = financeiroFactory.getTotalDespesasMesCorrente();
									financeiroFactory.setTotalDespesasMesCorrente(totalDespesasMesCorrente - antigoValor);
								}
							}
						}
																									
						if (dtDespesa >= dtInicio && dtDespesa <= dtFim) {						
							financeiroFactory.addDespesaNaLista(response.data);
							
							if (response.data.pago) {
								totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
								financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas + response.data.valor);
							} else {
								totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
								financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas + response.data.valor);
							}
							
							totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
							financeiroFactory.setTotalDespesasPeriodo(totalDespesas + response.data.valor);
						}
																
						if (dtDespesa >= dtInicioMesCorrente && dtDespesa <= dtFimMesCorrente) {
							totalDespesasMesCorrente = financeiroFactory.getTotalDespesasMesCorrente();
							financeiroFactory.setTotalDespesasMesCorrente(totalDespesasMesCorrente + response.data.valor);
						}
					},
					errorCallback = function(error) {
						utilService.tratarExcecao(error); 
					}
			);
			
			$mdDialog.hide();
		} else {
			utilService.tratarExcecao("Valor da despesa inválido!")
		}
	};
}]);