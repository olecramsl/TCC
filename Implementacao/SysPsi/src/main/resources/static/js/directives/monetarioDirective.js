angular.module('syspsi').directive('formattedValor', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {			
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format								
				if (data) { 
					if (!isNaN(data)) {						
			    		var novoValor = parseFloat(data).toFixed(2);					
			    		if (novoValor.split(".").length > 1 || novoValor.split(",").length > 1) {    			   
			    			novoValor = novoValor.replace('.',',');
			    		} else {    			   
			    			novoValor = novoValor + ",00";
			    		}
			    		return novoValor;
					} 
		    	}
				return "0,00";
		    	 							
			});
		}
	}
}]);