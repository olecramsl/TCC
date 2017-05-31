angular.module('syspsi').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', '$mdDialog', 'loginFactory', 'utilService',
	function($scope, $rootScope, $http, $location, $mdDialog, loginFactory, utilService) {
	var ctrl = this;
	
	/*
	var authenticate = function(credentials, callback) {		
		var headers = credentials ? {authorization : "Basic "
			+ btoa(credentials.username + ":" + credentials.password)
		} : {};
		
		loginFactory.login(headers).then(function(response) {			
			if (response.data.name) {				
				$rootScope.authenticated = true;				
				loginFactory.realizarBackup().then(
						successCallback = function(response) {},
						errorCallback = function(error) {														
							utilService.tratarExcecao(error);
						}
				);
				$location.path('/dashboard');
			} else {											
				$rootScope.authenticated = false;
			}			
			callback && callback();
		}, function() {
			$rootScope.authenticated = false;
			callback && callback();
		});
	}
	
	authenticate();
	*/
	ctrl.credentials = {};
	ctrl.login = function() {
		/*
		authenticate(ctrl.credentials, function() {
			if ($rootScope.authenticated) {				
				ctrl.error = false;
		    } else {		    	
		    	ctrl.error = true;
		    }
		  });
		*/		
		loginFactory.login(ctrl.credentials).then(function(response) {			
			if (response.data.nomeCompleto) {				
				$rootScope.authenticated = true;
				ctrl.error = false;
				loginFactory.realizarBackup().then(
						successCallback = function(response) {},
						errorCallback = function(error) {														
							utilService.tratarExcecao(error);
						}
				);
				$location.path('/dashboard');
			} else {											
				$rootScope.authenticated = false;
				ctrl.error = true;
			}			
		}, function() {
			$rootScope.authenticated = false;
			ctrl.error = true;
		});
	};
	
	ctrl.logout = function() {
		loginFactory.logout();
		$rootScope.authenticated = false;
		ctrl.credentials = {};
	    $location.path("/");
	};
}]);