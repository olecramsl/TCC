angular.module('syspsi').controller('DashboardCtrl', ['$rootScope', '$scope', 'financeiroFactory', 'pacienteFactory', 'convenioFactory', 'agendamentoFactory',
	'utilService', function($rootScope, $scope, financeiroFactory,	pacienteFactory, convenioFactory, agendamentoFactory, utilService) {
	var ctrl = this;	
		
	var carregarPacientesAtivos = function() {
		pacienteFactory.listarPacientesAtivosInativos(true).then(
		      successCallback = function(response) {		    	  
		    	  agendamentoFactory.setLstPacientesAtivos(response.data);	    	  
		  	  },
		  	  errorCallback = function (error, status){
		  		utilService.tratarExcecao(error); 
		  	  }
		  );
	  };   
	  
	  var carregarConveniosAtivos = function() {
		  convenioFactory.listarConveniosAtivos().then(
				  successCallback = function(response) {		    	  
			    	  convenioFactory.setLstConveniosAtivos(response.data);		    	  		    	  		    	 
			  	  },
			  	  errorCallback = function (error, status){
			  		utilService.tratarExcecao(error); 
			  	  }
			  );
	  };
	  
	  var carregarContasDoMes = function() {		
		  var dataInicial = moment().startOf('month').local().format();
		  var dataFinal = moment().endOf('month').local().format();
		
		  financeiroFactory.listarDespesasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					ctrl.totalDespesasMesCorrente = response.data.totalDespesas;
				},
				errorCallback = function(error) {
					utilService.tratarExcecao(error);
				}
		  );
		
		  financeiroFactory.listarConsultasPorPeriodo(dataInicial, dataFinal).then(
				successCallback = function(response) {
					ctrl.totalConsultasMesCorrente = response.data.totalConsultas;
				},
				errorCallback = function(error) {					
					utilService.tratarExcecao(error);
				}
		  );
	  };
	
	carregarPacientesAtivos();
	carregarConveniosAtivos();
	carregarContasDoMes();
}]);