//angular.module('syspsi', [])
angular.module('syspsi', ['ngRoute'])
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
		$routeProvider.
			when('/dashboard', { 
				templateUrl: "templates/dashboard.html"					
			}).when('/agenda', { 
				templateUrl: "templates/agenda.html",
				controller: "AgendaCtrl",
				controllerAs: "ctrl"
			}).when('/consulta', { 
				templateUrl: "templates/consulta.html",
				controller: "ConsultaCtrl",
				controllerAs: "ctrl"
			});
	
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);