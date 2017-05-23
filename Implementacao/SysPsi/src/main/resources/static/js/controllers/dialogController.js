angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', 'financeiroFactory', 'agendamentoFactory', 
	'convenioFactory', 'utilService', function ($scope, $mdDialog, consultaPacienteFactory, financeiroFactory, agendamentoFactory, convenioFactory,
	utilService) {
	
	var ctrl = this;		
	
	if (financeiroFactory.getDespesa()) {
		$scope.despesa = financeiroFactory.getDespesa();
	} else {
		$scope.despesa = {};
	}
	
	if (financeiroFactory.getAgendamento()) {
		$scope.agendamento = financeiroFactory.getAgendamento();
		var dataHora = moment($scope.agendamento.consulta.inicio).format("DD/MM/YYYY HH:mm");
		$scope.dataConsulta = dataHora.split(' ')[0];
		$scope.horaConsulta = dataHora.split(' ')[1];
		
		$scope.lstPacientesAtivos = agendamentoFactory.getLstPacientesAtivos();
		$scope.lstConveniosAtivos = convenioFactory.getLstConveniosAtivos();
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.finalizarConsulta = function(valor, recibo) {	
		var novoValor = Number(valor.replace(",","."));
		
		if (novoValor > 0) {		
			consultaPacienteFactory.setValor(novoValor);		
			consultaPacienteFactory.setRecibo(!!recibo);
			$mdDialog.hide();
		} else {
			utilService.tratarExcecao("Valor da consulta inválido!")
		}		
	};
	
	$scope.salvarDespesa = function(despesa) {
		var novaDespesa = angular.copy(despesa);		
		novaDespesa.valor = despesa.valor.toString().replace(",", ".");
		
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
			
			var despesaDTO = financeiroFactory.prepararDespesaDTO(novaDespesa);
			financeiroFactory.salvarDespesa(despesaDTO).then(
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
			
			$mdDialog.hide();
		} else {
			utilService.tratarExcecao("Valor da despesa inválido!")
		}
	};
}]);