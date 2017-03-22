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
				controller: "ConsultaPacienteCtrl",
				controllerAs: "ctrl"
			}).when('/cadastrarPaciente', { 
				templateUrl: "templates/cadastrar_pacientes.html",
				controller: "CadastroPacienteCtrl",
				controllerAs: "ctrl"
			}).when('/editarPaciente', { 
				templateUrl: "templates/cadastrar_pacientes.html",
				controller: "CadastroPacienteCtrl",
				controllerAs: "ctrl"
			}).when('/consultarPacientes', { 
				templateUrl: "templates/consultar_pacientes.html",
				controller: "CadastroPacienteCtrl",
				controllerAs: "ctrl"
			});
	
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);