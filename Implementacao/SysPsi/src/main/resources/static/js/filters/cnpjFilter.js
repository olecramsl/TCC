angular.module('syspsi').filter('cnpjFormat', function() {
    return function(cnpj) {    	
    	if (cnpj) {
    		return cnpj.substr(0,2) + "." + cnpj.substr(2,3) + "." + cnpj.substr(5,3) + "/"+ cnpj.substr(8, 4) + "-" + cnpj.substr(12);
    	}    	
    };
});