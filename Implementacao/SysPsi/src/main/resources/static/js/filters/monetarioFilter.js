angular.module('syspsi').filter('monetarioFormat', function() {
    return function(valor) {
    	if (valor) {    		
    		var novoValor = 'R$ ' + valor.toString().replace('.',',');    		    		
    		return novoValor;
    	}    	
    };
});