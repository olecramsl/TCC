angular.module('syspsi').controller('FinanceiroCtrl',['$scope', '$mdDialog', 'financeiroFactory', 'utilService', function($scope, $mdDialog, 
		financeiroFactory, utilService) {
	var ctrl = this;
	
	$scope.$watch(function () { return financeiroFactory.getLstDespesas(); }, function (newValue, oldValue) {
	   	  ctrl.lstDespesas = newValue;
	});
	
	var carregarDespesasDoMes = function() {		
		var dataInicial = moment().startOf('month').local().format();
		var dataFinal = moment().endOf('month').local().format();
		
		financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					financeiroFactory.setLstDespesas(response.data);
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		);
	};
	
	ctrl.cadastrarDespesa  = function() {
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/cadastrar_despesa_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {			
		}, function() {});
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
			
		}, function() {});
	}
	
	carregarDespesasDoMes();
}]);