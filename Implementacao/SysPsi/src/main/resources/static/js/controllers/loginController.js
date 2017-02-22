angular.module('syspsi').config(function($httpProvider) {    
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}).controller('loginCtrl', function($scope, $rootScope, $http) {				  
	var authenticate = function(credentials, callback) {
		var headers = credentials ? {authorization : "Basic "
			+ btoa(credentials.username + ":" + credentials.password)
		} : {};

		$http.get('http://localhost:8080/user', {headers : headers}).then(function(response) {
			console.log(response);
			if (response.data.name) {
				$rootScope.authenticated = true;				
				window.location.href="/home.html";					
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