angular.module('syspsi').controller('FinanceiroCtrl',['$scope', '$mdDialog', 'financeiroFactory', 'utilService', function($scope, $mdDialog, 
		financeiroFactory, utilService) {
	var ctrl = this;
	
	ctrl.dtInicio = new Date(moment().startOf('month').local());
	ctrl.dtFim = new Date(moment().endOf('month').local());
			 	 	
	$scope.$watch(function () { return financeiroFactory.getLstDespesas(); }, function (newValue, oldValue) {
	   	  ctrl.lstDespesas = newValue;
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
							financeiroFactory.setLstDespesas(lstDespesas);
							
							if (despesa.pago) {
								var totalDespesasPagas = financeiroFactory.getTotalDespesasPagasPeriodo();							
								financeiroFactory.setTotalDespesasPagasPeriodo(totalDespesasPagas - despesa.valor);
							} else {
								var totalDespesasNaoPagas = financeiroFactory.getTotalDespesasNaoPagasPeriodo();							
								financeiroFactory.setTotalDespesasNaoPagasPeriodo(totalDespesasNaoPagas - despesa.valor);
							}
							
							var totalDespesas = financeiroFactory.getTotalDespesasPeriodo();						
							financeiroFactory.setTotalDespesasPeriodo(totalDespesas - despesa.valor);														
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
		
		edtDespesa.valor = edtDespesa.valor.toString().replace(".",",");
		
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
}]);