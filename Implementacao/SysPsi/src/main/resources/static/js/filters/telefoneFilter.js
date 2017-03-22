angular.module('syspsi').filter('telefoneFormat', function() {
    return function(telefone) {
    	if (telefone) {
    		return telefone.substr(0,2) + " " + telefone.substr(2,4) + "-" + telefone.substr(6);
    	}
    	return;
    };
});