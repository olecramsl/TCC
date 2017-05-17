angular.module('syspsi').filter('booleanFormat', function() {
    return function(valor) {
    	return valor?"Sim":"Não";   	
    };
});