angular.module('syspsi', ['ngRoute', 'ngMaterial', 'ngIdle'])
	.config(['$routeProvider', '$httpProvider', 'IdleProvider', 'KeepaliveProvider', function($routeProvider, $httpProvider, IdleProvider, 
			KeepaliveProvider) {
		
		// configure Idle settings
		IdleProvider.idle(1800); // in seconds - 30min
		IdleProvider.timeout(120); // in seconds - 2min
		KeepaliveProvider.interval(10); // in seconds
		
		$routeProvider.
			when('/login', { 
				templateUrl: "templates/login.html",
				controller: "LoginCtrl",
				controllerAs: "ctrl"
			}).when('/dashboard', { 
				templateUrl: "templates/dashboard.html"
			}).when('/agenda/', { 
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
			}).otherwise({redirectTo: '/'});
	
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]).run(['$rootScope', '$location', 'loginFactory', 'Idle', 'idleService', function($rootScope,$location,loginFactory,Idle,idleService){
		// start watching when the app runs. also starts the Keepalive service by default.
		Idle.watch();			
		
		$rootScope.$on('IdleStart', function() { 
			idleService.openWarning();
		});				
		
		$rootScope.$on('IdleTimeout', function() {			
			loginFactory.logout();			
			$rootScope.authenticated = false;
			$location.path("/");			
		});
	}]);