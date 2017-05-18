angular.module('syspsi', ['ngRoute', 'ngMaterial', 'ngIdle']).constant("consts", {
	BASE_URL: "http://localhost:8080",
	TIPOS_CONFIRMACOES: {
		'REMOVER_EVENTOS_FUTUROS': 1,
		'MOVER_EVENTOS': 2,
		'ALTERAR_DADOS_FUTUROS': 3,
		'REMOVER_EVENTO': 4,
		'REMOVER_EVENTOS_GRUPO': 5
	}
}).config(['$routeProvider', '$httpProvider', '$mdDateLocaleProvider', 'IdleProvider', 'KeepaliveProvider', 'consts',
		function($routeProvider, $httpProvider, $mdDateLocaleProvider, IdleProvider, KeepaliveProvider, consts) {
		
		// configure Idle settings
		IdleProvider.idle(1800); // in seconds - 30min
		IdleProvider.timeout(120); // in seconds - 2min		
		KeepaliveProvider.interval(1200); // in seconds - 20min			
		KeepaliveProvider.http(consts.BASE_URL + '/keepAlive');
		
		$routeProvider.
			when('/login', { 
				templateUrl: "templates/login.html",
				controller: "LoginCtrl",
				controllerAs: "ctrl"
			}).when('/dashboard', { 
				templateUrl: "templates/dashboard.html",
				controller: "DashboardCtrl",
				controllerAs: "ctrl"
			}).when('/agenda/', { 
				templateUrl: "templates/agenda.html",
				controller: "AgendaCtrl",
				controllerAs: "ctrl"
			}).when('/consulta', { 
				templateUrl: "templates/consulta.html",
				controller: "ConsultaPacienteCtrl",
				controllerAs: "ctrl"
			}).when('/prontuarios', { 
				templateUrl: "templates/prontuarios.html",
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
			}).when('/financeiro', { 
				templateUrl: "templates/financeiro.html",
				controller: "FinanceiroCtrl",
				controllerAs: "ctrl"
			}).otherwise({redirectTo: '/'});
	
		$mdDateLocaleProvider.formatDate = function(date) {
			return moment(date).format('DD/MM/YYYY');
		};
		
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]).run(['$rootScope', '$location', 'loginFactory', 'Idle', 'idleService', function($rootScope, 
			$location, loginFactory, Idle, idleService){
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