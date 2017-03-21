angular.module('syspsi').filter('cepFormat', function() {
    return function(cep) {
    	if (cep) {    		
    		return cep.substr(0,5) + "-" + cep.substr(5);
    	}    	
    };
});