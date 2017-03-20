angular.module('syspsi').filter('telefoneFormat', function() {
    return function(telefone) {
    	if (telefone.length === 10) {
    		return "(" + telefone.substr(0,2) + ") " + telefone.substr(2,4) + " " + telefone.substr(6);
    	} else {
    		return "(" + telefone.substr(0,2) + ") " + telefone.substr(2,5) + " " + telefone.substr(7);
    	}
        
    };
});