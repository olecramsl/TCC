angular.module('syspsi').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'loginFactory', function($scope, $rootScope, 
		$http, $location, loginFactory) {
	var ctrl = this;
	
	var authenticate = function(credentials, callback) {		
		var headers = credentials ? {authorization : "Basic "
			+ btoa(credentials.username + ":" + credentials.password)
		} : {};
		
		loginFactory.login(headers).then(function(response) {
			if (response.data.name) {				
				$rootScope.authenticated = true;				
				$location.path('/dashboard');
			} else {											
				$rootScope.authenticated = false;
				$location.path('/login');
			}
			//$scope.$apply();
			callback && callback();
		}, function() {
			$rootScope.authenticated = false;
			callback && callback();
		});
	}

	authenticate();
	ctrl.credentials = {};
	ctrl.login = function() {	
		authenticate(ctrl.credentials, function() {
			if ($rootScope.authenticated) {				
				ctrl.error = false;
		    } else {		    	
		    	ctrl.error = true;
		    }
		  });
	};
	
	ctrl.logout = function() {
		loginFactory.logout();
		$rootScope.authenticated = false;
	    $location.path("/");
		/*
		$http.post('logout', {}).success(function() {
			$rootScope.authenticated = false;
		    $location.path("/");
		}).error(function(data) {
		    $rootScope.authenticated = false;
		});
		*/
	};
}]);