angular.module('syspsi').controller('DialogCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', 'financeiroFactory', 'agendamentoFactory', 
	'convenioFactory', 'utilService', function ($scope, $mdDialog, consultaPacienteFactory, financeiroFactory, agendamentoFactory, convenioFactory,
	utilService) {
	
	var ctrl = this;		
	
	if (financeiroFactory.getDespesa()) {
		$scope.despesa = financeiroFactory.getDespesa();
	} else {
		$scope.despesa = {};
	}
	
	if (financeiroFactory.getAgendamento() && financeiroFactory.getAgendamento().consulta) {
		$scope.agendamento = angular.copy(financeiroFactory.getAgendamento());
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
			
			//var despesaDTO = financeiroFactory.prepararDespesaDTO(novaDespesa);
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
			
			$mdDialog.hide();
		} else {
			utilService.tratarExcecao("Valor da despesa inválido!")
		}
	};
	
	$scope.salvarConsulta = function(agendamento) {		
		agendamento.consulta.valor = agendamento.consulta.valor.toString().replace(",", ".");		
										
		var dataConsultaSplit = $scope.dataConsulta.split("/");			
		var dia = dataConsultaSplit[0];
		var mes = dataConsultaSplit[1]-1;
		var ano = dataConsultaSplit[2];
		var horaConsultaSplit = $scope.horaConsulta.split(":");
		var hora = horaConsultaSplit[0];
		var min = horaConsultaSplit[1];
		var dataHoraConsulta = moment();
		var dataHoraConsulta = moment(dataHoraConsulta).year(ano).month(mes).date(dia).hour(hora).minute(min);
		var duracaoConsulta = moment(agendamento.consulta.fim).diff(moment(agendamento.consulta.inicio), 'minutes');
		
		agendamento.start = dataHoraConsulta.local("DD-MM-YYYY HH:mm");
		agendamento.consulta.inicio = agendamento.start;
		agendamento.end = moment(agendamento.start);
		agendamento.consulta.fim = moment(agendamento.consulta.inicio);
		agendamento.end.add(duracaoConsulta, 'm');
		agendamento.consulta.fim.add(duracaoConsulta, 'm');		
				
		agendamentoFactory.salvarAgendamento(agendamento).then(
				successCallback = function(response) {
					financeiroFactory.listarConsultasPorPeriodo(financeiroFactory.getDtInicioPeriodo(), financeiroFactory.getDtFimPeriodo()).then(
							successCallback = function(response) {
								financeiroFactory.setLstReceitas(response.data.lstAgendamentos);
								financeiroFactory.setTotalConsultasPeriodo(response.data.totalConsultas);
							},
							errorCallback = function(error) {
								utilService.tratarExcecao(error);
							}
					);
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		);
		
		$mdDialog.hide();
	};	
}]);