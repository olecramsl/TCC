angular.module('syspsi').filter('cpfFormat', function() {
    return function(cpf) {
        return cpf.substr(0,3) + "." + cpf.substr(3,3) + "." + cpf.substr(6,3) + "-" + cpf.substr(9);
    };
});