angular.module('syspsi').controller('DashboardCtrl', ['$location', 'financeiroFactory', 
	'pacienteFactory', 'convenioFactory', 'agendamentoFactory', 'configuracaoFactory', 'waitFactory', 
	'utilService', 'consts', function($location, financeiroFactory, pacienteFactory, convenioFactory,
			agendamentoFactory, configuracaoFactory, waitFactory, utilService, consts) {
	var ctrl = this;	
		
	if ($location.absUrl().indexOf("?success") >= 0) {
		$location.search({});
		waitFactory.setMessage("Exportando eventos para o Google Calendar.");
		utilService.showWait();
		configuracaoFactory.exportarAgendamentoParaGoogleCalendar().then(
				successCallback = function(response) {
					utilService.hideWait();
				},
				errorCallback = function(error) {
					utilService.hideWait();
					utilService.tratarExcecao(error);
				}
		);
	} else if ($location.absUrl().indexOf("?error") >= 0) {		
		$location.search({});
		utilService.tratarExcecao("Não foi possível vincular a agenda!");			
	}
	
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