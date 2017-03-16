angular.module('syspsi').controller('loginCtrl', function($scope, $rootScope, $http) {				  
	var authenticate = function(credentials, callback) {
		var headers = credentials ? {authorization : "Basic "
			+ btoa(credentials.username + ":" + credentials.password)
		} : {};

		$http.get('http://localhost:8080/user', {headers : headers}).then(function(response) {			
			if (response.data.name) {
				$rootScope.authenticated = true;				
				window.location.href="/home.html";									
			} else {											
				$rootScope.authenticated = false;
				window.location.href="/login.html";
			}
			$scope.$apply();
			callback && callback();
		}, function() {
			$rootScope.authenticated = false;
			callback && callback();
		});
	}

	authenticate();
	$scope.credentials = {};
	$scope.login = function() {		
		authenticate($scope.credentials, function() {
			if ($rootScope.authenticated) {				
				$scope.error = false;
		    } else {		    	
		    	$scope.error = true;
		    }
		  });
	};
});